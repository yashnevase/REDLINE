import * as T from 'three';import type {Boss} from '../sim/run-schema.ts';import type {CombatTuning} from '../content/combat.ts';import {steelBladeShape} from './bl-steel.ts';
export function makeRexV2Warnings(root:T.Group){
 const geometry=new T.PlaneGeometry(2,2),style=new T.InstancedBufferAttribute(new Float32Array(96),1),gap=new T.InstancedBufferAttribute(new Float32Array(96),2);geometry.setAttribute('warnStyle',style);geometry.setAttribute('warnGap',gap);const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{dim:{value:1}},vertexShader:'attribute float warnStyle;attribute vec2 warnGap;varying vec2 p;varying float k;varying vec2 g;void main(){p=position.xy;k=warnStyle;g=warnGap;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 p;varying float k;varying vec2 g;uniform float dim;void main(){float r=length(p),edge=1.-smoothstep(.018,.045,abs(r-.94)),fill=(1.-smoothstep(.94,1.,r))*.15;float a=edge+fill;if(k>1.5)a=max(1.-smoothstep(.02,.05,abs(p.x)),step(.88,abs(p.x)))*step(abs(p.y),1.);if(k>.5&&k<1.5&&dot(normalize(p),g)>.82)a=0.;gl_FragColor=vec4(1.,.24,.15,min(.85,a)*dim);}'});const rings=new T.InstancedMesh(geometry,material,96);root.add(rings);const sawGeometry=new T.ShapeGeometry(steelBladeShape());sawGeometry.scale(2,2,2);const saws=new T.InstancedMesh(sawGeometry,new T.MeshLambertMaterial({color:'#ead6b5',side:T.DoubleSide}),3);root.add(saws);const d=new T.Object3D();
 return{draw:(b:Boss,t:CombatTuning,quiet:boolean,flashes:boolean)=>{rings.count=saws.count=0;const r=b.rex;if(!r)return;material.uniforms.dim.value=flashes?.38:1;const put=(x:number,z:number,radius:number,k=0,angle=0,length=radius)=>{if(rings.count>=96)return;const i=rings.count++;d.position.set(x,.075,z);d.rotation.set(-Math.PI/2,0,angle);d.scale.set(radius,length,1);d.updateMatrix();rings.setMatrixAt(i,d.matrix);style.setX(i,k);gap.setXY(i,r.dx,-r.dz);};
  if(r.mode==='warning'){
   if(r.attack==='sweep')put(b.x,b.z,t.bossSweepRadius,1);
   if(r.attack==='slam')put(b.x,b.z,5.4);
   if(r.attack==='slam'||r.attack==='barrage'||r.attack==='summon'||r.attack==='vent')r.targets.forEach(p=>put(p.x,p.z,r.attack==='vent'?t.surgeRadius:t.rexCircleRadius));
   if(r.attack==='roll'){const len=t.arenaHalfWidth*2;put(b.x+r.dx*len/2,b.z+r.dz*len/2,t.bossRadius,2,Math.atan2(r.dx,r.dz),len/2);}
   if(r.attack==='boomerang')for(const side of Array.from({length:r.sawCount},(_,i)=>i===0?-1:i===1?1:0))for(let i=1;i<25;i++){const p=i/24,reach=Math.sin(p*Math.PI)*t.rexSawReach,bend=Math.sin(p*Math.PI*2)*2.4*side;put(r.origin.x+r.dx*reach-r.dz*bend,r.origin.z+r.dz*reach+r.dx*bend,.15);}
  }
  if(r.mode==='active'){
   if(r.attack==='slam')put(b.x,b.z,r.elapsed/60*t.rexRingSpeed);
   if(r.attack==='vent')r.targets.forEach((p,i)=>{if(i>=Math.floor((r.elapsed-1)/24))put(p.x,p.z,t.surgeRadius);});
   if(r.attack==='barrage')r.targets.forEach((p,i)=>{if(r.elapsed<=i*12+1)put(p.x,p.z,t.rexCircleRadius);});
   r.saws.forEach(p=>{d.position.set(p.x,.65,p.z);d.rotation.set(-Math.PI/2,0,quiet?0:r.elapsed*.3);d.scale.setScalar(1);d.updateMatrix();saws.setMatrixAt(saws.count++,d.matrix);});
  }
  for(const pool of[rings,saws]){pool.instanceMatrix.needsUpdate=true;if(pool.count)pool.computeBoundingSphere();}style.needsUpdate=gap.needsUpdate=true;
 },reset:()=>{rings.count=saws.count=0;}};
}
