import {P5_ENABLED} from './p5-finish.ts';
import * as T from 'three';
import {C2_DAMAGE_ENABLED} from '../content/items/c-world.ts';
// Original generated diffuse paint, composited into our authored UV atlas before warm-up.
// Procedural geometry/materials remain a complete fallback when the optional asset is absent.
export async function loadPaintedWear(textures:readonly T.Texture[]){
 // P5: repeated bitmap grime obscures the authored plate hierarchy.
 if(P5_ENABLED)return false;
 if(!C2_DAMAGE_ENABLED||textures.length===0)return false;
 let image:HTMLImageElement;try{image=await new T.ImageLoader().loadAsync('/textures/deck-wear-v1.png');}catch{return false;}
 for(const texture of textures){const canvas=texture.image;if(!(canvas instanceof HTMLCanvasElement))continue;const c=canvas.getContext('2d');if(!c)continue;c.save();c.globalAlpha=.28;const size=canvas.width/4;for(let y=0;y<4;y++)for(let x=0;x<4;x++)c.drawImage(image,x*size,y*size,size,size);c.restore();texture.needsUpdate=true;}
 return true;
}
