from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json
root=Path('shots/parity');refs=Path('art/targets/spirit-call')
mapping={'combat-desktop':'combat-lava-aoe.png','combat-compact':'combat-lava-swarm.png','lobby':'menu-hero.png','mission-select':'menu-challenges.png','workshop':'menu-collection.png','hero-close-up':'menu-hero.png','hud':'combat-lava-aoe.png'}
rows=[];manifest=json.loads((root/'manifest.json').read_text())
for area,name in mapping.items():
    ours=Image.open(root/f'{area}-ours.png').convert('RGB');sc=Image.open(refs/name).convert('RGB');crop=None
    if area=='hero-close-up':
        ours.save(root/'hero-close-up-ours-full.png');ours=ImageOps.pad(ours.crop((360,60,920,650)),ours.size,color='#111422');crop=[320,85,890,650];sc=sc.crop(crop);ours.save(root/f'{area}-ours.png')
    fitted=ImageOps.pad(sc,ours.size,color='#111422',method=Image.Resampling.LANCZOS);fitted.save(root/f'{area}-sc.png')
    board=Image.new('RGB',(ours.width*2,ours.height+36),'#111422');board.paste(ours,(0,36));board.paste(fitted,(ours.width,36));draw=ImageDraw.Draw(board);draw.text((14,10),f'{area} | REDLINE baseline',fill='white');draw.text((ours.width+14,10),'Spirit Call | aspect fit; local study only',fill='white');board.save(root/f'{area}-side-by-side.png');rows.append(ImageOps.contain(board,(1280,380)))
    pair=next(x for x in manifest['pairs'] if x['area']==area);pair['reference']={'source':str(refs/name),'crop':crop,'fit':'aspect-preserving pad; no source pixels stretched','oursCrop':[360,60,920,650] if crop else None}
sheet=Image.new('RGB',(1280,sum(r.height for r in rows)),'#111422');y=0
for row in rows:sheet.paste(row,(0,y));y+=row.height
sheet.save(root/'baseline-board.png');(root/'manifest.json').write_text(json.dumps(manifest,indent=2));print('Seven aspect-preserved local parity pairs and board saved.')
