import * as T from 'three';
import type {Preferences} from '../content/preferences.ts';
export function makeCoreMotion(world:T.Group){
 const root=new T.Group();world.add(root);const ghostMaterial=new T.MeshBasicMaterial({color:'#a883ff',transparent:true,opacity:.18,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
 const ghosts=new T.InstancedMesh(new T.SphereGeometry(.61,12,8),ghostMaterial,3);root.add(ghosts);ghosts.count=0;
 const dust=new T.InstancedMesh(new T.IcosahedronGeometry(.085,0),new T.MeshBasicMaterial({color:'#bca3df',transparent:true,opacity:.2,depthWrite:false}),12);root.add(dust);dust.count=0;
 const ribbonGeometry=new T.PlaneGeometry(1,.35,2,1),colours:number[]=[];for(let i=0;i<ribbonGeometry.attributes.position.count;i++){const p=ribbonGeometry.attributes.position;colours.push(1,1,1,(1-Math.abs(p.getY(i))/.2)*(.5+p.getX(i)));}ribbonGeometry.setAttribute('color',new T.Float32BufferAttribute(colours,4));
 const ribbon=new T.InstancedMesh(ribbonGeometry,new T.MeshBasicMaterial({color:'#ad81ff',vertexColors:true,transparent:true,opacity:.65,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,toneMapped:false}),12);ribbon.count=0;ribbon.setColorAt(0,new T.Color('#fff'));root.add(ribbon);const colour=new T.Color();
 const dummy=new T.Object3D(),history:{x:number;z:number;at:number}[]=[],path:{x:number;z:number;at:number}[]=[],puffs:{x:number;z:number;at:number}[]=[];let last=-1,pathAt=-1,oldVX=0,oldVZ=0,oldHop=false;
 function reset(){history.length=path.length=puffs.length=0;last=pathAt=-1;oldVX=oldVZ=0;oldHop=false;ghosts.count=dust.count=ribbon.count=0;}
 return{reset,draw:(time:number,h:{x:number;z:number;vx:number;vz:number;dashing:boolean;hop:boolean;overdrive:boolean;speedLimit?:number},prefs:Preferences,opacity:number,dustOpacity:number)=>{
  if(time<last)reset();const fresh=time>last;last=time;const speed=Math.hypot(h.vx,h.vz),fast=speed>(h.speedLimit??6)*.8;
  if(fresh){if(h.dashing)history.push({x:h.x,z:h.z,at:time});if(history.length>12)history.shift();if(fast&&time-pathAt>.035){pathAt=time;path.push({x:h.x,z:h.z,at:time});}while(path.length>6)path.shift();const turn=Math.hypot(h.vx-oldVX,h.vz-oldVZ);if(!prefs.reducedMotion&&(turn>2||oldHop&&!h.hop))puffs.push({x:h.x,z:h.z,at:time});oldVX=h.vx;oldVZ=h.vz;oldHop=h.hop;}
  while(puffs.length>12)puffs.shift();ghosts.count=0;ghostMaterial.opacity=prefs.reducedFlashes?0:opacity;
  if(!prefs.reducedMotion&&!prefs.reducedFlashes)for(let i=0;i<3;i++){const point=history[history.length-1-i*3];if(!point||time-point.at>.18)continue;dummy.rotation.set(0,0,0);dummy.position.set(point.x,.68,point.z);dummy.scale.setScalar(1-(time-point.at)*2);dummy.updateMatrix();ghosts.setMatrixAt(ghosts.count++,dummy.matrix);}ghosts.instanceMatrix.needsUpdate=true;
  ribbon.count=0;ribbon.material.opacity=prefs.reducedFlashes?.12:.65;
  if(!prefs.reducedMotion){for(let i=0;i<path.length-1;i++){const a=path[i],b=path[i+1],age=time-a.at;if(age>.3)continue;const dx=b.x-a.x,dz=b.z-a.z;dummy.position.set((a.x+b.x)/2,.047,(a.z+b.z)/2);dummy.rotation.set(-Math.PI/2,0,Math.atan2(-dz,dx));dummy.scale.set(Math.max(.05,Math.hypot(dx,dz)),1,1);dummy.updateMatrix();ribbon.setMatrixAt(ribbon.count,dummy.matrix);ribbon.setColorAt(ribbon.count++,colour.setScalar(Math.max(0,1-age/.3)));}
   if(fast)for(let i=0;i<6;i++){const back=.4+(i*.17+time*speed*.5)%1.4,side=(i%3-1)*.28,dx=h.vx/speed,dz=h.vz/speed;dummy.position.set(h.x-dx*back-dz*side,.05,h.z-dz*back+dx*side);dummy.rotation.set(-Math.PI/2,0,Math.atan2(-dz,dx));dummy.scale.set(.3+speed*.025,.1,1);dummy.updateMatrix();ribbon.setMatrixAt(ribbon.count,dummy.matrix);ribbon.setColorAt(ribbon.count++,colour.setScalar(.2));}}
  ribbon.instanceMatrix.needsUpdate=true;if(ribbon.instanceColor)ribbon.instanceColor.needsUpdate=true;
  dust.count=0;dust.material.opacity=prefs.reducedFlashes?dustOpacity*.25:dustOpacity;
  if(!prefs.reducedMotion)for(const puff of puffs){const age=time-puff.at;if(age<0||age>.4)continue;dummy.rotation.set(0,0,0);dummy.position.set(puff.x,.08+age*.2,puff.z);dummy.scale.setScalar(1+age*4);dummy.updateMatrix();dust.setMatrixAt(dust.count++,dummy.matrix);}dust.instanceMatrix.needsUpdate=true;for(const pool of [ghosts,ribbon,dust])if(pool.count)pool.computeBoundingSphere();
 },metadata:()=>({ghosts:ghosts.count,ribbonInstances:ribbon.count})};
}
