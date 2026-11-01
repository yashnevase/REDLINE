import * as T from 'three';
import {damagedInlays} from '../content/items/c2-inlays.ts';
import {isDamagedInlay} from '../content/items/c2-inlays.ts';
import {scrapyard} from '../content/chapters/scrapyard.ts';
import {AM3_ENABLED,worldPlateUV} from './am3-surface.ts';
import {AM4_ENABLED} from './am4-level-detail.ts';
import {C2_DAMAGE_ENABLED} from '../content/items/c-world.ts';
export function addDamagedInlays(root:T.Group,level:number,low:boolean){
 if(!C2_DAMAGE_ENABLED||level===2)return;
 const metal=new T.MeshLambertMaterial({color:'#73685c'}),dark=new T.MeshLambertMaterial({color:'#27262c'}),glow=new T.MeshBasicMaterial({color:'#d78035',toneMapped:false});
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,mat:T.Material)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);root.add(m);return m;};
 for(const [x,z]of damagedInlays){box(1.96,.05,1.96,x,-.17,z,dark);box(1.5,.01,.12,x,-.13,z,glow);for(const side of [-1,1]){box(.09,.12,1.96,x+side*.94,-.04,z,metal);box(1.96,.12,.09,x,-.04,z+side*.94,metal);}for(let j=0;j<(low?1:4);j++)box(.055,.03,1.7,x-.6+j*(low?1.2:.4),-.025,z,metal);box(.8,.035,.55,x+.6,-.03,z+.6,metal).rotation.z=.08;}
}
export function addMixedPlates(root:T.Group,level:number,inner:T.Material,outer:T.Material){
 const step=scrapyard.tiles.spacing,extent=scrapyard.tiles.extent,used=new Set<string>();
 const allowed=(x:number,z:number)=>Math.abs(x)+Math.abs(z)<=43&&!(C2_DAMAGE_ENABLED&&level!==2&&isDamagedInlay(x,z))&&!(level===2&&AM3_ENABLED&&Math.abs(x)<17&&Math.abs(z)<17)&&!(level===1&&AM4_ENABLED&&Math.abs(x)<8&&Math.abs(z)<8);
 for(let z=-extent+step/2;z<extent;z+=step)for(let x=-extent+step/2;x<extent;x+=step){if(!allowed(x,z)||used.has(`${x},${z}`))continue;const hash=((x+31)*73856093^(z+31)*19349663)>>>0;let w=C2_DAMAGE_ENABLED&&hash%3===0?2:1,d=C2_DAMAGE_ENABLED&&hash%7===0?2:1;if(x+(w-1)*step>=extent||z+(d-1)*step>=extent)w=d=1;for(let j=0;j<d;j++)for(let i=0;i<w;i++)if(!allowed(x+i*step,z+j*step)||used.has(`${x+i*step},${z+j*step}`))w=d=1;for(let j=0;j<d;j++)for(let i=0;i<w;i++)used.add(`${x+i*step},${z+j*step}`);
  const cx=x+(w-1)*step/2,cz=z+(d-1)*step/2,g=new T.BoxGeometry(w*step-.015,.06,d*step-.015);worldPlateUV(g,cx,cz);g.setAttribute('floorCentre',new T.Float32BufferAttribute(Array.from({length:g.attributes.position.count},()=>[cx,cz,1]).flat(),3));const plate=new T.Mesh(g,Math.abs(cx)<17&&Math.abs(cz)<17?inner:outer);plate.position.set(cx,-.03-(hash%7)*.001,cz);plate.rotation.y=C2_DAMAGE_ENABLED?((hash%5)-2)*.0006:0;root.add(plate);
 }
}
