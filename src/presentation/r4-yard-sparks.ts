import * as T from 'three';
import type {RunState} from '../sim/run-schema.ts';
// Cosmetic hash streams: stable seed/tick/id, independent of simulation RNG and render frequency.
export const yardSparkBudget={standard:180,low:72,speedMin:3,speedMax:6} as const;
export function makeYardSparks(root:T.Object3D){
 const geometry=new T.PlaneGeometry(1,1),material=new T.MeshBasicMaterial({color:'#ffffff',transparent:true,depthWrite:false,side:T.DoubleSide,forceSinglePass:true,blending:T.AdditiveBlending,toneMapped:false});const mesh=new T.InstancedMesh(geometry,material,180);mesh.count=0;root.add(mesh);const d=new T.Object3D(),colour=new T.Color();let tick=-1,emitted=0;
 const hash=(n:number)=>{let v=Math.imul(n^83627,1664525);v=Math.imul(v^(v>>>16),1013904223);return(v>>>0)/4294967296;};
 return{draw:(s:RunState|null,time:number,camera:T.Camera,low:boolean,reducedMotion:boolean,reducedFlashes:boolean)=>{mesh.count=0;if(!s||reducedMotion)return;const cap=low?yardSparkBudget.low:yardSparkBudget.standard,seed=s.extras.seed,at=s.tick/60;tick=s.tick;emitted=0;
  const put=(x:number,y:number,z:number,angle:number,length:number,width:number,heat:number,ambient=false)=>{if(mesh.count>=cap)return;const p=new T.Vector3(x,y,z).project(camera),hero=new T.Vector3(s.hero.x,.8,s.hero.z).project(camera);if(ambient&&(Math.hypot(x-s.hero.x,z-s.hero.z)<4||Math.hypot(p.x-hero.x,p.y-hero.y)<.18))return;d.position.set(x,y,z);d.rotation.set(-Math.PI/2,0,angle);d.scale.set(length,width,1);d.updateMatrix();mesh.setMatrixAt(mesh.count,d.matrix);colour.set(heat<.2?'#fffbe1':heat<.6?'#ffc366':'#f5752e').multiplyScalar(reducedFlashes?.24:Math.max(.05,1-heat));mesh.setColorAt(mesh.count++,colour);emitted++;};
  // Disc contact fan: emission history is reconstructed, so paused re-renders never duplicate it.
  for(const e of s.enemies){if(e.hp<=0||e.kind!=='grinder'||e.behavior.kind==='spawn')continue;const active=e.behavior.kind==='lunge'||e.behavior.kind==='windup',n=low?4:10;for(let i=0;i<n;i++){const life=.48,age=((s.tick+i*7+e.id*3)%29)/60,a=e.faceX===0?i*.7:Math.atan2(e.faceZ,e.faceX)+(i%3-1)*.35,speed=3+hash(e.id*13+i)*3,side=i%2?1:-1;put(e.x+side*.95+Math.cos(a)*age*speed,.04+Math.max(0,.7*age-4*age*age),e.z+Math.sin(a)*age*speed,a,.22+speed*.07,.025,age/life+(active?0:.15));}}
  if(s.hero.dash.kind==='active'||s.hero.boost.kind==='active'||Math.hypot(s.hero.vx,s.hero.vz)>7){const h=s.hero,a=Math.atan2(h.vz,h.vx);for(let i=0;i<(low?4:10);i++){const age=((s.tick+i*3)%20)/60;put(h.x-h.vx*age+Math.sin(i*4)*.3,.045+Math.max(0,.7*age-3*age*age),h.z-h.vz*age+Math.cos(i*4)*.3,a,.26,.025,age/.34);}}
  // Independent edge streams: embers, welding showers, distant blade contacts, falling chips.
  for(let i=0;i<(low?20:50);i++){const side=i%4,a=hash(seed+i*31),b=hash(seed+i*17+3),cycle=(at*(i%3===0?.18:.55)+a*9)%5,edge=side%2?21.5:-21.5,x=side<2?edge:b*40-20,z=side>=2?edge:b*40-20;const shower=i%3===0;if(shower&&cycle>1.1)continue;const age=shower?cycle:cycle%1.6;put(x+Math.sin(i*5)*age,shower?Math.max(.05,2.6-2*age*age):.3+age*.8,z+Math.cos(i*3)*age,i,shower?.3:.07,shower?.025:.055,age/(shower?1.1:1.6),true);}
  // Rare segmented pylon arc, in the same capped draw; reduced flash removes the arc.
  const arc=(Math.floor(at/9)+seed)%4;if(!low&&!reducedFlashes&&at%9<.13)for(let i=0;i<12;i++){const x=-19+i*.4,z=arc%2?22:-22;put(x,2+Math.sin(i*3+Math.floor(at*30))*.18,z,0,.47,.035,.05,true);}
  mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;if(mesh.count)mesh.computeBoundingSphere();
 },metadata:()=>({tick,count:mesh.count,emitted,cap:180,lowCap:72,seeded:true,actorSafeAmbience:true})};
}
