import * as T from 'three';
import type {FightEvent} from '../sim/schema.ts';
// Original painted surface: the light stays fixed; only panel paint turns. One existing shell pass.
export function makeCoreSurface(shell:T.Mesh){
 if(!(shell.material instanceof T.MeshMatcapMaterial))throw new Error('Core shell must use its matcap material');
 const material=shell.material.clone();shell.material=material;
 const uniforms={uCoreRoll:{value:new T.Matrix3()},uCoreWear:{value:0},uCoreHeat:{value:0},uCoreDent:{value:.045},uCoreDetail:{value:.6}};
 material.onBeforeCompile=shader=>{Object.assign(shader.uniforms,uniforms);
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform mat3 uCoreRoll;uniform float uCoreWear;uniform float uCoreDent;varying vec3 vCoreLocal;').replace('#include <begin_vertex>',`#include <begin_vertex>
 vCoreLocal=uCoreRoll*normalize(position);
 float dent=exp(-32.*dot(vCoreLocal-vec3(.46,.2,.85),vCoreLocal-vec3(.46,.2,.85)))+exp(-40.*dot(vCoreLocal-vec3(-.6,-.3,.72),vCoreLocal-vec3(-.6,-.3,.72)));
 transformed-=normalize(position)*dent*uCoreDent*step(1.5,uCoreWear);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform float uCoreWear;uniform float uCoreHeat;uniform float uCoreDetail;varying vec3 vCoreLocal;').replace('#include <opaque_fragment>',`
 vec3 p=normalize(vCoreLocal);
 float seams=min(abs(abs(p.x)-.47),min(abs(p.y+.32),abs(p.z+.38)));
 float seam=(1.-smoothstep(.006,.018,seams))*smoothstep(.04,.12,abs(p.x+p.y*.7));
 float bolt=1.-smoothstep(.022,.037,length(vec2(abs(p.x)-.61,abs(p.y)-.38)));
 outgoingLight*=1.-uCoreDetail*(seam*.4+bolt*.65);
 float scratch=(1.-smoothstep(.002,.009,abs(p.y*.7+p.x*.3-.18+sin(p.x*24.)*.012)))*smoothstep(.12,.2,p.x)*(1.-smoothstep(.75,.9,p.x));
 scratch+=.7*(1.-smoothstep(.002,.009,abs(p.y+p.x*.6+.42)))*smoothstep(.03,.2,-p.x)*(1.-smoothstep(.5,.8,-p.x));
 float crack=(1.-smoothstep(.01,.035,abs(p.x+.16+sin(p.y*19.)*.036)))*smoothstep(-.8,-.4,p.y)*(1.-smoothstep(.4,.75,p.y));
 crack=max(crack,(1.-smoothstep(.009,.027,abs(p.y+.17+sin(p.x*15.)*.045)))*smoothstep(-.7,-.4,p.x)*(1.-smoothstep(.18,.5,p.x)));
 float plate=smoothstep(.14,.18,p.x)*(1.-smoothstep(.2,.5,p.y))*smoothstep(-.55,-.3,p.y)*smoothstep(.5,.75,p.z);
 outgoingLight=mix(outgoingLight,vec3(.12,.10,.18),plate*step(1.5,uCoreWear)*.55);
 float wear=step(.5,uCoreWear);outgoingLight=mix(outgoingLight,vec3(.12,.11,.18),min(.8,scratch*wear*.65));
 outgoingLight*=1.-step(1.5,uCoreWear)*.2*smoothstep(.4,.9,sin(p.x*8.+p.y*5.)*.5+.5);
 outgoingLight=mix(outgoingLight,vec3(.06,.04,.09),crack*step(2.5,uCoreWear)*.8);
 outgoingLight+=mix(vec3(.36,.09,.7),vec3(1.,.38,.08),uCoreHeat)*crack*step(2.5,uCoreWear)*(.18+uCoreHeat*.85);
 #include <opaque_fragment>`);
 };material.customProgramCacheKey=()=> 'redline-rigid-rolling-wear-v1';
 const roll=new T.Quaternion(),step=new T.Quaternion(),axis=new T.Vector3(),matrix=new T.Matrix4(),inverse=new T.Quaternion();
 let angle=0;return{reset:()=>{roll.identity();angle=0;},draw:(dx:number,dz:number,radius:number,body:T.Quaternion,wear:number,heat:number,detail:number,dent:number,dashSpin:number)=>{
  const distance=Math.hypot(dx,dz);if(distance>0&&distance<4){inverse.copy(body).invert();axis.set(dz,0,-dx).normalize().applyQuaternion(inverse);const delta=distance/Math.max(.1,radius)*dashSpin;step.setFromAxisAngle(axis,delta);roll.premultiply(step).normalize();angle+=delta;}
  uniforms.uCoreRoll.value.setFromMatrix4(matrix.makeRotationFromQuaternion(roll));uniforms.uCoreWear.value=wear;uniforms.uCoreHeat.value=heat;uniforms.uCoreDetail.value=detail;uniforms.uCoreDent.value=dent;
 },metadata:()=>({rollRadians:angle,wear:uniforms.uCoreWear.value})};
}
// Critically damped anticipation, bounded with no overshoot; impacts have a separate 80ms envelope.
export function makeRigidPose(){let value=0,velocity=0,last=-1,impactAt=-100;const seen=new Set<string>();return{reset:()=>{value=velocity=0;last=-1;impactAt=-100;seen.clear();},draw:(time:number,dt:number,charging:boolean,events:readonly FightEvent[],quiet:boolean,response=.035,anticipation=.06,compression=.08,impactSeconds=.08)=>{
 if(time<last){value=velocity=0;impactAt=-100;seen.clear();}last=time;
 for(const e of events)if((e.kind==='hurt'||e.kind==='bonk')&&!seen.has(e.id)){seen.add(e.id);impactAt=e.tick/60;}if(seen.size>512){seen.clear();for(const e of events)seen.add(e.id);}
 const target=charging?Math.min(.06,anticipation):0,w=2/Math.max(.01,response),d=value-target,c=velocity+w*d,e=Math.exp(-w*dt);value=target+(d+c*dt)*e;velocity=(velocity-w*c*dt)*e;value=Math.max(0,Math.min(.06,value));
 const impact=Math.max(0,1-(time-impactAt)/Math.max(.01,impactSeconds))*Math.min(.08,compression),amount=quiet?0:Math.max(value,impact);return{x:1+amount,y:1-amount,z:1+amount};
 }};}
export function wearTier(hp:number,max:number){const ratio=hp/Math.max(1,max);return ratio<=.25?3:ratio<=.5?2:ratio<=.75?1:0;}
