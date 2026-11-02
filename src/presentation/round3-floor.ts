// Authored surface colours. No reference bitmap and no additional scene object.
export const ROUND3_FLOOR_ENABLED=true;
export const floorPaintColours={warm:['#b9ac94','#b3a18b','#b4a28f','#c1ae95'],cool:['#a3adb5','#a8afb0'],oxide:['#af8063','#b48a69']} as const;
export function floorPaintBand(x:number,z:number){const bucket=(((x*7+z*11)%20)+20)%20;return bucket<12?'warm':bucket<17?'cool':'oxide';}
export function paintWarmPlates(c:CanvasRenderingContext2D,size:number){
 if(!ROUND3_FLOOR_ENABLED)return;
 const unit=size/48;
 for(let z=0;z<24;z++)for(let x=0;x<24;x++){const colours=floorPaintColours[floorPaintBand(x,z)];c.fillStyle=colours[(x*3+z*7)%colours.length];c.fillRect(x*2*unit,z*2*unit,2*unit+.5,2*unit+.5);}
}
