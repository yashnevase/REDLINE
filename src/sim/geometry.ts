import {obstacles,type CombatTuning} from '../content/combat.ts';
export function direction(x:number,z:number){const length=Math.sqrt(x*x+z*z);return length>0?{x:x/length,z:z/length}:{x:0,z:0};}
export function collide(x:number,z:number,r:number,t:CombatTuning){
 x=Math.max(-t.arenaHalfWidth+r,Math.min(t.arenaHalfWidth-r,x));z=Math.max(-t.laneHalfWidth+r,Math.min(t.laneHalfWidth-r,z));
 for(let pass=0;pass<2;pass++)for(const o of obstacles){
  const qx=Math.max(o.x-o.hx,Math.min(o.x+o.hx,x)),qz=Math.max(o.z-o.hz,Math.min(o.z+o.hz,z));
  const dx=x-qx,dz=z-qz,dist=Math.sqrt(dx*dx+dz*dz);
  if(dist>0&&dist<r){x+=dx/dist*(r-dist);z+=dz/dist*(r-dist);}
  else if(dist===0){const pushX=o.hx+r-Math.abs(x-o.x),pushZ=o.hz+r-Math.abs(z-o.z);if(pushX<pushZ)x+=(x>=o.x?1:-1)*pushX;else z+=(z>=o.z?1:-1)*pushZ;}
 }
 x=Math.max(-t.arenaHalfWidth+r,Math.min(t.arenaHalfWidth-r,x));z=Math.max(-t.laneHalfWidth+r,Math.min(t.laneHalfWidth-r,z));
 return{x,z};
}
