"""Original PIL-only comparison, no reference code reused. Masks + alignment are explicit."""
from PIL import Image, ImageDraw, ImageFont
import json,sys,statistics
from pathlib import Path
root=Path('art/match/core'); n=int(sys.argv[1]) if len(sys.argv)>1 else 1
ref=Image.open(root/'ref.png').convert('RGB'); actual=Image.open(root/f'raw-{n}.png').convert('RGB')
# Manual reference foreground annotation excludes ink thickness and contact shadow.
mask=Image.new('L',ref.size);d=ImageDraw.Draw(mask);d.polygon([(71,5),(100,10),(122,26),(134,49),(135,79),(124,104),(104,119),(71,124),(40,118),(18,103),(5,80),(4,53),(14,30),(36,12)],fill=255)
mask.save(root/'ref-mask.png')
am=Image.new('L',actual.size);am.putdata([255 if b-r>18 and b-g>10 else 0 for r,g,b in actual.getdata()]);ImageDraw.floodfill(am,(0,0),128);am=am.point(lambda v:0 if v==128 else 255)
if (root/f'mask-{n}.png').exists():am=Image.open(root/f'mask-{n}.png').convert('L').point(lambda v:255 if v>127 else 0)
# Crop boundary excludes any disconnected contact shadow; neutral grey shadow has no blue chroma.
box=am.getbbox();am.save(root/f'actual-mask-{n}.png')
def align(im,m):
 b=m.getbbox();im=im.crop(b);m=m.crop(b);scale=min(416/im.width,416/im.height);size=(round(im.width*scale),round(im.height*scale));im=im.resize(size,Image.Resampling.LANCZOS);m=m.resize(size,Image.Resampling.NEAREST);out=Image.new('RGB',(448,448),'#cbd0d1');om=Image.new('L',(448,448));xy=((448-size[0])//2,(448-size[1])//2);out.paste(im,xy);om.paste(m,xy);return out,om
r,rm=align(ref,mask);a,ma=align(actual,am);a.save(root/f'iter-{n}.png')
intersection=sum(x>0 and y>0 for x,y in zip(rm.getdata(),ma.getdata()));union=sum(x>0 or y>0 for x,y in zip(rm.getdata(),ma.getdata()));iou=intersection/union
# Dominant blue-body RGB distribution: 10th/50th/90th percentile per channel; eyes/red/grey excluded.
def palette(im,m):
 pixels=[p for p,v in zip(im.getdata(),m.getdata()) if v and p[2]-p[0]>18 and p[2]-p[1]>10]
 return [[sorted(p[c] for p in pixels)[round((len(pixels)-1)*q)] for c in range(3)] for q in [.1,.5,.9]]
rp,ap=palette(r,rm),palette(a,ma);error=sum(abs(x-y) for u,v in zip(rp,ap) for x,y in zip(u,v))/(9*255)*100
report={'iteration':n,'silhouetteIoU':iou,'silhouettePass':iou>=.8,'palettePercentileRGB':{'reference':rp,'candidate':ap},'paletteMeanChannelErrorPercentOf255':error,'paletteMaxChannelErrorPercentOf255':max(abs(x-y) for u,v in zip(rp,ap) for x,y in zip(u,v))/255*100,'palettePass':max(abs(x-y) for u,v in zip(rp,ap) for x,y in zip(u,v))/255*100<=10,'alignment':'Each mask bounding box independently uniformly fitted to 416px within 448px; no rotation or nonuniform scaling. IoU checks silhouette shape, not world scale. Reference manually annotated to exclude ink/shadow; candidate object-ID render if available (mask-N.png), otherwise blue chroma segmentation + hole fill. Circular IoU is weak evidence for character identity; feature/owner review required.','referenceCrop':[76,29,220,160],'source':'Gemini_Generated_Image_d0xrt7d0xrt7d0xr.png row 1 cell 1'}
(root/f'metrics-{n}.json').write_text(json.dumps(report,indent=2))
comparison=Image.new('RGB',(1344,520),'#17202a');draw=ImageDraw.Draw(comparison);draw.text((14,12),'REFERENCE / neutral cell 1',fill='white');draw.text((462,12),f'CORE STUDIO / iteration {n}',fill='white');draw.text((910,12),'MASK OVERLAY / ref cyan, candidate red',fill='white');comparison.paste(r,(0,42));comparison.paste(a,(448,42));overlay=Image.new('RGB',(448,448));overlay.putdata([(255 if y else 0,180 if x else 0,220 if x else 0) for x,y in zip(rm.getdata(),ma.getdata())]);comparison.paste(overlay,(896,42));draw.text((14,498),f'IoU {iou:.3f} | blue-body palette error {error:.1f}% of RGB range | NOT owner approval',fill='white');comparison.save(root/f'cmp-{n}.png');print(json.dumps(report))
