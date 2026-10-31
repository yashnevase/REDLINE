import * as T from 'three';
import type {Preferences} from '../content/preferences.ts';
export function makeCoreMotion(world:T.Group){
 const root=new T.Group();world.add(root);const ghostMaterial=new T.MeshBasicMaterial({color:'#a883ff',transparent:true,opacity:.18,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
 const ghosts=new T.InstancedMesh(new T.SphereGeometry(.61,12,8),ghostMaterial,3);root.add(ghosts);ghosts.count=0;
 const dust=new T.InstancedMesh(new T.IcosahedronGeometry(.085,0),new T.MeshBasicMaterial({color:'#bca3df',transparent:true,opacity:.2,depthWrite:false}),12);root.add(dust);dust.count=0;
 const dummy=new T.Object3D(),history:{x:number;z:number;at:number}[]=[],puffs:{x:number;z:number;at:number}[]=[];let last=-1,oldVX=0,oldVZ=0,oldHop=false;
 return{reset:()=>{history.length=puffs.length=0;last=-1;oldVX=oldVZ=0;oldHop=false;},draw:(time:number,h:{x:number;z:number;vx:number;vz:number;dashing:boolean;hop:boolean;overdrive:boolean},prefs:Preferences,opacity:number,dustOpacity:number)=>{
  if(time<last){history.length=puffs.length=0;}const fresh=time>last;last=time;
  if(fresh){if(h.dashing)history.push({x:h.x,z:h.z,at:time});if(history.length>12)history.shift();const turn=Math.hypot(h.vx-oldVX,h.vz-oldVZ);if(!prefs.reducedMotion&&(turn>2||oldHop&&!h.hop))puffs.push({x:h.x,z:h.z,at:time});oldVX=h.vx;oldVZ=h.vz;oldHop=h.hop;}
  while(puffs.length>12)puffs.shift();ghosts.count=0;ghostMaterial.opacity=prefs.reducedFlashes?0:opacity;
  if(!prefs.reducedMotion&&!prefs.reducedFlashes)for(let i=0;i<3;i++){const point=history[history.length-1-i*3];if(!point||time-point.at>.18)continue;dummy.position.set(point.x,.68,point.z);dummy.scale.setScalar(1-(time-point.at)*2);dummy.updateMatrix();ghosts.setMatrixAt(ghosts.count++,dummy.matrix);}ghosts.instanceMatrix.needsUpdate=true;
  dust.count=0;dust.material.opacity=prefs.reducedFlashes?dustOpacity*.25:dustOpacity;
  if(!prefs.reducedMotion)for(const puff of puffs){const age=time-puff.at;if(age<0||age>.4)continue;dummy.position.set(puff.x,.08+age*.2,puff.z);dummy.scale.setScalar(1+age*4);dummy.updateMatrix();dust.setMatrixAt(dust.count++,dummy.matrix);}dust.instanceMatrix.needsUpdate=true;
 }};
}
