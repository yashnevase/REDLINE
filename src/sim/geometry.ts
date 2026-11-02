import {bogLayout} from '../content/chapters/bog-moon.ts';
import {deckCornerKeepouts,EXPANDED_DECK_ENABLED} from '../content/items/cl-clarity.ts';
import {obstacles,type CombatTuning} from '../content/combat.ts';
const collisionObstacles=EXPANDED_DECK_ENABLED?[...obstacles,...deckCornerKeepouts]:obstacles;
export function direction(x:number,z:number){const length=Math.sqrt(x*x+z*z);return length>0?{x:x/length,z:z/length}:{x:0,z:0};}
export function collide(x:number,z:number,r:number,t:CombatTuning){
 x=Math.max(-t.arenaHalfWidth+r,Math.min(t.arenaHalfWidth-r,x));z=Math.max(-t.laneHalfWidth+r,Math.min(t.laneHalfWidth-r,z));
 const active=t.collisionChapter===2?[...bogLayout(0).totems.map(p=>({...p,hx:1.15,hz:1.15})),...deckCornerKeepouts]:collisionObstacles;
 for(let pass=0;pass<2;pass++)for(const o of active){
  const qx=Math.max(o.x-o.hx,Math.min(o.x+o.hx,x)),qz=Math.max(o.z-o.hz,Math.min(o.z+o.hz,z));
  const dx=x-qx,dz=z-qz,dist=Math.sqrt(dx*dx+dz*dz);
  if(dist>0&&dist<r){x+=dx/dist*(r-dist);z+=dz/dist*(r-dist);}
  else if(dist===0){const pushX=o.hx+r-Math.abs(x-o.x),pushZ=o.hz+r-Math.abs(z-o.z);if(pushX<pushZ)x+=(x>=o.x?1:-1)*pushX;else z+=(z>=o.z?1:-1)*pushZ;}
 }
 x=Math.max(-t.arenaHalfWidth+r,Math.min(t.arenaHalfWidth-r,x));z=Math.max(-t.laneHalfWidth+r,Math.min(t.laneHalfWidth-r,z));
 if(EXPANDED_DECK_ENABLED)for(const o of deckCornerKeepouts)if(Math.abs(x-o.x)<o.hx+r&&Math.abs(z-o.z)<o.hz+r){const inwardX=o.x-Math.sign(o.x)*(o.hx+r),inwardZ=o.z-Math.sign(o.z)*(o.hz+r);if(Math.abs(x-inwardX)<Math.abs(z-inwardZ))x=inwardX;else z=inwardZ;}
 return{x,z};
}
