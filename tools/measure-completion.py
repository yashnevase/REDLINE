"""Original Pillow reference comparisons. Manual silhouette annotations exclude shadows/labels.
Each bbox is uniformly fitted (no stretch/rotation); shape-only IoU, not acceptance.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import json,sys
n=int(sys.argv[1]) if len(sys.argv)>1 else 1
root=Path('art/match');line=Image.open('art/1793338592710_image.png').convert('RGB')
specs={
'sawlet':(line,(194,128,349,233),[(4,43),(14,31),(30,27),(38,14),(54,4),(76,1),(93,5),(106,15),(115,20),(139,8),(151,13),(146,31),(153,37),(144,51),(125,59),(121,77),(107,91),(90,99),(65,99),(44,93),(33,78),(28,61),(12,58),(3,53)]),
 'thrower':(line,(357,86,514,244),[(8,82),(13,75),(38,74),(43,46),(65,32),(71,8),(83,1),(122,6),(139,14),(134,40),(129,51),(141,72),(151,98),(147,123),(127,143),(100,151),(66,148),(43,133),(35,114),(13,115),(3,100)]),
 'shieldsaw':(line,(530,56,710,275),[(17,16),(39,4),(75,1),(105,8),(131,17),(134,46),(141,57),(154,59),(164,73),(173,103),(167,132),(149,149),(137,165),(133,194),(113,207),(79,213),(40,207),(23,193),(13,162),(9,123),(9,84),(11,45)]),
 'grinder':(line,(716,58,996,273),[(11,56),(28,20),(48,10),(62,20),(80,29),(104,22),(127,22),(150,30),(169,43),(190,12),(210,5),(230,20),(250,32),(264,52),(274,85),(275,133),(265,170),(245,197),(225,210),(204,201),(188,180),(171,160),(153,177),(126,185),(100,181),(79,168),(58,190),(36,182),(21,157),(7,122),(3,91)]),
 'boss':(Image.open('art/1793338588856_image.png').convert('RGB'),(40,143,492,439),[(5,140),(16,125),(39,127),(100,162),(126,129),(139,67),(177,30),(226,12),(276,15),(327,38),(359,74),(381,118),(388,162),(409,179),(430,188),(444,216),(441,253),(420,272),(392,272),(372,250),(365,218),(346,243),(313,263),(262,276),(211,275),(168,256),(144,220),(131,184),(107,198),(79,184),(50,166),(19,154)]),
 'arena':(Image.open('art/1793338596294_image.png').convert('RGB'),(75,4,985,572),[(0,280),(25,251),(68,229),(68,220),(101,216),(172,183),(160,140),(172,117),(206,105),(188,66),(213,18),(245,1),(265,25),(294,33),(308,57),(303,97),(457,30),(507,39),(535,65),(785,176),(832,190),(838,212),(868,227),(879,246),(884,265),(896,292),(900,339),(865,364),(491,568),(448,568),(30,364),(0,352)])}
if n>=6:
 # Corrected after inspecting boss-ref-grid.png: original coarse head annotation
 # was left of the actual head and the crop clipped the right claw. No legs included.
 specs['boss']=(Image.open('art/1793338588856_image.png').convert('RGB'),(40,143,513,484),[
 [(275,10),(238,16),(212,26),(183,45),(161,68),(146,99),(141,129),(148,165),(161,193),(177,224),(207,246),(236,264),(278,274),(314,276),(351,264),(383,244),(403,214),(412,182),(414,149),(405,100),(389,70),(371,49),(347,29),(312,15)],
 [(0,124),(25,113),(49,123),(61,134),(73,139),(99,154),(124,170),(138,173),(158,186),(164,211),(150,233),(131,244),(107,238),(92,226),(72,219),(51,206),(31,194),(16,178),(5,164),(0,148)],
 [(140,173),(153,149),(157,128),(167,130),(168,153),(158,183),(150,201)],
 [(406,104),(423,103),(434,116),(437,146),(445,166),(450,181),(457,177),(467,185),(473,211),(472,238),(460,263),(453,280),(459,307),(447,328),(431,338),(415,329),(411,315),(419,289),(406,283),(392,265),(389,245),(393,223),(408,216),(419,220),(431,229),(420,196),(409,170),(401,148)]])
def fit(im,mask):
 b=mask.getbbox();im=im.crop(b);mask=mask.crop(b);s=min(416/im.width,416/im.height);size=(round(im.width*s),round(im.height*s));xy=((448-size[0])//2,(448-size[1])//2);out=Image.new('RGB',(448,448),'#cbd0d1');out.paste(im.resize(size,Image.Resampling.LANCZOS),xy);m=Image.new('L',(448,448));m.paste(mask.resize(size,Image.Resampling.NEAREST),xy);return out,m
reports=[]
for name,(source,crop,poly) in specs.items():
 folder=root/name;folder.mkdir(exist_ok=True,parents=True);ref=source.crop(crop);ref.save(folder/'ref.png');mask=Image.new('L',ref.size);[ImageDraw.Draw(mask).polygon(p,fill=255) for p in (poly if name=='boss' and n>=6 else [poly])];mask.save(folder/'ref-mask.png');actual=Image.open(folder/f'raw-{n}.png').convert('RGB');am=Image.open(folder/f'mask-{n}.png').convert('L').point(lambda v:255 if v>127 else 0);r,rm=fit(ref,mask);a,ma=fit(actual,am);a.save(folder/f'iter-{n}.png')
 union=sum(x>0 or y>0 for x,y in zip(rm.getdata(),ma.getdata()));iou=sum(x>0 and y>0 for x,y in zip(rm.getdata(),ma.getdata()))/union
 def palette(im,m):
  p=[rgb for rgb,v in zip(im.getdata(),m.getdata()) if v and (rgb[0]>rgb[1]*1.1 and rgb[2]<rgb[0] if name!='arena' else rgb[2]>rgb[0]*1.05 and rgb[0]>rgb[1])];return [[sorted(px[c] for px in p)[round((len(p)-1)*q)] for c in range(3)] for q in [.1,.5,.9]] if p else None
 rp,ap=palette(r,rm),palette(a,ma);error=sum(abs(x-y) for u,v in zip(rp,ap) for x,y in zip(u,v))/(9*255)*100 if rp and ap else None
 report={'asset':name,'iteration':n,'source':'1793338596294_image.png' if name=='arena' else '1793338588856_image.png' if name=='boss' else '1793338592710_image.png','crop':crop,'silhouetteIoU':iou,'silhouetteThresholdMet':iou>=.8,'paletteMeanPercentileChannelErrorPercentOf255':error,'referencePalette':rp,'actualPalette':ap,'method':'Manually annotated reference object excluding label/shadow; rendered object-ID candidate; independent uniform bbox fit to416 within448; no stretch/rotation. IoU is approximate shape-only evidence, not identity/scale or owner acceptance. Boss annotation omits legs per owner rule. Palette selected rust (or arena mauve) pixels,10/50/90th channel percentile proxy; not perceptual DeltaE.','referenceMaskRevision':2 if name=='boss' and n>=6 else 1,'ownerReview':'Deferred to final by explicit owner instruction'}
 (folder/f'metrics-{n}.json').write_text(json.dumps(report,indent=2));reports.append(report)
 cmp=Image.new('RGB',(1344,520),'#1b142b');d=ImageDraw.Draw(cmp);d.text((12,12),name.upper()+' / reference study',fill='white');d.text((460,12),f'Original Three.js build / iteration {n}',fill='white');d.text((908,12),'Reference cyan / actual red',fill='white');cmp.paste(r,(0,42));cmp.paste(a,(448,42));over=Image.new('RGB',(448,448));over.putdata([(255 if y else 0,180 if x else 0,220 if x else 0) for x,y in zip(rm.getdata(),ma.getdata())]);cmp.paste(over,(896,42));d.text((12,499),f'Shape IoU {iou:.3f} | palette proxy {error:.1f}% | final owner review deferred' if error is not None else f'IoU {iou:.3f}',fill='white');cmp.save(folder/f'cmp-{n}.png')
Path('shots/completion/asset-metrics.json').write_text(json.dumps(reports,indent=2));print(json.dumps([{k:r[k] for k in ['asset','silhouetteIoU','paletteMeanPercentileChannelErrorPercentOf255']} for r in reports],indent=2))
# Whole-frame comparisons preserve all layout differences.
for asset,reference,actual in [('hud','art/1793338584886_image.png','shots/completion/arena-phone.png'),('fx','art/targets/spirit-call/combat-lava-aoe.png','shots/completion/combat-readability-desktop.png'),('lobby','art/_archive/other_Gemini_Generated_Image_h9drd5h9drd5h9dr.png','shots/completion/workshop-desktop.png')]:
 folder=root/asset;folder.mkdir(exist_ok=True);ref=Image.open(reference).convert('RGB');ref.save(folder/'ref.png');im=Image.open(actual).convert('RGB');out=Image.new('RGB',(2048,630),'#1b142b');d=ImageDraw.Draw(out);d.text((12,12),'REFERENCE / identity + layout study',fill='white');d.text((1036,12),'REDLINE / actual browser render',fill='white');ref.thumbnail((1024,576));im.thumbnail((1024,576));out.paste(ref,((1024-ref.width)//2,42));out.paste(im,(1024+(1024-im.width)//2,42));out.save(folder/f'cmp-{n}.png')
