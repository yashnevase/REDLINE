"""Main slab silhouette proxy from explicit manual reference outlines and object-ID masks.
Uniform bbox fitting only. This does not measure material/atmosphere fidelity or owner approval.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import json,sys
n=int(sys.argv[1]) if len(sys.argv)>1 else 7
root=Path('art/match/close-step2')
refs=['arena-ref-1-hazard-frame.png','arena-ref-2-sunken-pit.png','arena-ref-3-smoke.png','arena-ref-4-lava-cracks.png']
polys=[[(510,47),(974,281),(962,378),(571,571),(99,400),(61,335),(78,286)],[(521,4),(1022,252),(1005,359),(621,571),(411,571),(0,372),(5,307)],[(510,47),(974,281),(962,378),(571,571),(99,400),(61,335),(78,286)],[(511,36),(971,285),(930,427),(566,571),(92,402),(52,327),(79,281)]]
def fit(mask):
    box=mask.getbbox();m=mask.crop(box);scale=min(512/m.width,512/m.height);m=m.resize((round(m.width*scale),round(m.height*scale)),Image.Resampling.NEAREST);out=Image.new('L',(544,544));out.paste(m,((544-m.width)//2,(544-m.height)//2));return out
rows=[]
for i,(name,poly) in enumerate(zip(refs,polys),1):
    folder=root/f'ref-{i}';ref=Image.open(Path('art/arena-ref')/name).convert('RGB');actual=Image.open(folder/f'raw-{n}.png').convert('RGB');mask=Image.new('L',ref.size);ImageDraw.Draw(mask).polygon(poly,fill=255);mask.save(folder/'reference-main-slab-mask.png');rm=fit(mask);am=fit(Image.open(folder/f'mask-{n}.png').convert('L').point(lambda p:255 if p>127 else 0));a=list(rm.getdata());b=list(am.getdata());union=sum(x>0 or y>0 for x,y in zip(a,b));iou=sum(x>0 and y>0 for x,y in zip(a,b))/union
    overlay=Image.new('RGB',(544,544));overlay.putdata([(255 if y else 0,190 if x else 0,220 if x else 0)for x,y in zip(a,b)]);overlay.save(folder/f'slab-overlay-{n}.png');cmp=Image.new('RGB',(2048,572));cmp.paste(ref,(0,0));cmp.paste(actual,(1024,0));cmp.save(root/f'cmp-{i}.png');rows.append({'reference':name,'iteration':n,'mainSlabProxyIoU':iou,'threshold':.8,'thresholdMet':iou>=.8,'method':'Manual main-slab outline excludes background figures/wrecks/connected outlying platforms; actual mask includes static arena kit. Uniform bbox fit, no rotation/stretch. Approximate shape proxy, not an overall match score. Pit/platform framing differs and limits this comparison.','ownerApproval':False})
(root/f'metrics-{n}.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,indent=2))
