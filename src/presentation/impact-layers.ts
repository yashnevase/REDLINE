import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
// Bounded, original ground-space layers shared by all eight impact slots.
export function makeImpactLayers(root:T.Group){
 const discGeometry=new T.RingGeometry(0,1,24,2);const colours=[];const p=discGeometry.attributes.position;
 for(let i=0;i<p.count;i++){const brightness=Math.hypot(p.getX(i),p.getY(i))**2;colours.push(brightness,brightness,brightness);}discGeometry.setAttribute('color',new T.Float32BufferAttribute(colours,3));
 const parts=Array.from({length:6},(_,i)=>new T.RingGeometry(.94,1,12,1,i*Math.PI/3,.4));const arcsGeometry=mergeGeometries(parts);parts.forEach(p=>p.dispose());
 const innerGeometry=new T.RingGeometry(.91,1,48),crackParts:T.BufferGeometry[]=[];for(let i=0;i<9;i++){const a=i*Math.PI*2/9;for(let j=0;j<3;j++){const g=new T.PlaneGeometry(.018,.2);g.rotateZ(-a+(j%2?.24:-.24));g.translate(Math.sin(a)*(.22+j*.2),Math.cos(a)*(.22+j*.2),0);crackParts.push(g);}}const scorchGeometry=mergeGeometries(crackParts);crackParts.forEach(g=>g.dispose());
 const material=(color:string,additive=false)=>new T.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide,toneMapped:false,blending:additive?T.AdditiveBlending:T.NormalBlending});
 const slots=Array.from({length:8},()=>{
  const disc=new T.Mesh(discGeometry,material('#bba2ff',true));disc.material.vertexColors=true;
  const inner=new T.Mesh(innerGeometry,material('#efe6ff',true)),arcs=new T.Mesh(arcsGeometry,material('#c4a9ff',true)),scorch=new T.Mesh(scorchGeometry,material('#9b5cff',true));
  const meshes=[disc,inner,arcs,scorch];meshes.forEach((mesh,i)=>{mesh.rotation.x=-Math.PI/2;mesh.visible=false;mesh.position.y=.022+i*.006;root.add(mesh);});return{disc,inner,arcs,scorch,meshes};
 });
 return{reset:()=>slots.forEach(s=>s.meshes.forEach(m=>m.visible=false)),draw:(i:number,x:number,z:number,radius:number,age:number,life:number,colour:T.Color,quiet:boolean,low:boolean,spin=false)=>{
  const s=slots[i],p=age/life;s.meshes.forEach(m=>{m.position.x=x;m.position.z=z;});
  s.disc.visible=age<life;s.disc.scale.setScalar(radius);s.disc.material.color.copy(colour);s.disc.material.opacity=(1-p)*(quiet?.07:.24);
  s.inner.visible=!low&&age>.04&&age<life;s.inner.scale.setScalar(radius*.75);s.inner.material.opacity=(1-p)*(quiet?.18:.7);
  s.arcs.visible=!quiet&&!low&&age<life;s.arcs.scale.setScalar(radius*1.04);s.arcs.rotation.z=age*(spin?16:.8);s.arcs.material.color.copy(colour);s.arcs.material.opacity=(1-p)*.8;
  s.scorch.visible=!low&&age<1.2;s.scorch.scale.setScalar(radius*.65);s.scorch.material.opacity=.5*Math.max(0,1-age/1.2);
 }};
}
