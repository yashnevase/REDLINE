import {makeExposedPlates} from './f3-exposed-plates.ts';
import {coversHero,makeOcclusionFade} from './occlusion.ts';
import {makeLaneWarning} from './lane-warning.ts';
import {saw} from './industrial.ts';
import {shellPatch} from './models.ts';
import {batchParts,batchActor} from './batch-parts.ts';
import {bossStage} from '../content/boss.ts';
import * as T from 'three';
import type {Materials} from './materials.ts';
import type {Boss} from '../sim/run-schema.ts';
import type {CombatTuning} from '../content/combat.ts';
export function makeBossPresentation(world:T.Group,m:Materials){
 const paintedRust=m.rustActor.clone(),paintedLight=m.rustActor.clone();paintedLight.color.set('#c8b7b1');const arms:T.Group[]=[];const root=new T.Group(),body=new T.Group();world.add(root);root.add(body);body.position.y=2.5;body.scale.setScalar(.91);
 const part=(parent:T.Group,g:T.BufferGeometry,material:T.Material,x=0,y=0,z=0)=>{const mesh=new T.Mesh(g,material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
 part(body,new T.SphereGeometry(1.6,12,8),m.dark);
 // Separate spherical armour panels, grooves and rivets; no legs.
 for(let row=0;row<3;row++)for(let i=0;i<8;i++){
  const a=i*Math.PI/4,theta=.12+row*.92,g=new T.SphereGeometry(1.63,6,4,a+.025,Math.PI/4-.05,theta,.85);
  part(body,g,(i+row)%3===0?paintedLight:paintedRust);
  const phi=a+Math.PI/8,y=Math.cos(theta+.4)*1.65,r=Math.sin(theta+.4)*1.65;
  part(body,new T.SphereGeometry(.045,6,4),m.lightSteel,Math.sin(phi)*r,y,Math.cos(phi)*r);
 }
 const face=new T.Group();face.scale.setScalar(1.6);body.add(face);shellPatch(face,[[-.74,.37],[-.35,.32],[0,.29],[.35,.32],[.74,.37],[.66,.12],[.25,.10],[0,.12],[-.25,.1],[-.66,.12]],m.dark,.04,1);
 for(const side of [-1,1]){shellPatch(face,[[side*.61,.31],[side*.12,.23],[side*.3,.13],[side*.50,.16]],m.red,.065,1);}
 for(const side of [-1,1]){
  const shoulder=part(body,new T.CylinderGeometry(.35,.40,.23,16),m.steel,side*1.5,.12,.2);shoulder.rotation.z=Math.PI/2;const shoulderCap=part(body,new T.CylinderGeometry(.22,.25,.28,12),m.rustLight,side*1.56,.12,.2);shoulderCap.rotation.z=Math.PI/2;
  const arm=new T.Group();arms.push(arm);root.add(arm);arm.position.set(side<0?-1.85:2.15,side<0?1.88:1.4,.2);
  for(let i=0;i<8;i++){const p=(i+.5)/8,rise=2.62-arm.position.y;const link=part(arm,new T.TorusGeometry(.13,.045,3,8),m.steel,-side*(.1+p*.45),.35+p*(rise-.35),0);link.rotation.y=i%2*Math.PI/2;}
  if(side<0){
   const jaw=saw(arm,m,.52,-.35,0,.25);jaw.scale.y=2.2;jaw.rotation.z=1.1;
   const weaponMetal=m.rustActor.clone();weaponMetal.color.set('#d4c4bc');const plate=part(jaw,new T.CapsuleGeometry(.25,.35,4,12),weaponMetal,0,0,.10);plate.scale.z=.16;const recess=part(jaw,new T.CapsuleGeometry(.14,.32,3,10),m.dark,0,0,.15);recess.scale.z=.08;
   for(const y of [-.3,.3])part(jaw,new T.SphereGeometry(.055,6,4),m.lightSteel,0,y,.16);
   part(arm,new T.CylinderGeometry(.23,.23,.4,12),m.steel,.25,-.30,.27).rotation.x=Math.PI/2;
  }else{
   const barrel=part(arm,new T.CylinderGeometry(.29,.36,.6,12),m.steel,0,.08,0);barrel.rotation.z=.15;
   for(const finger of [-1,1]){const claw=part(arm,new T.TorusGeometry(.26,.09,5,12,Math.PI*.7),m.rustLight,finger*.10,-.42,.10);claw.rotation.z=finger<0?Math.PI*.8:-Math.PI*.5;}
  }
 }
 // Salvaged trophy plates across the lower hull.
 for(const x of [-.8,0,.8]){const plate=part(body,new T.BoxGeometry(.45,.35,.10),m.steel,x,-.85,1.2);plate.rotation.z=x*.3;part(body,new T.CylinderGeometry(.10,.13,.16,8),m.dark,x,-.85,1.29).rotation.x=Math.PI/2;}
 for(const [x,y,z,a] of [[-.58,-.45,1.47,-.25],[.62,-.48,1.46,.3],[.1,-1.13,1.16,-.15]]){const plate=part(body,new T.BoxGeometry(.52,.40,.1),m.rustLight,x,y,z);plate.rotation.z=a;for(const side of [-1,1])part(body,new T.SphereGeometry(.04,6,4),m.lightSteel,x+side*.18,y,z+.07);}
 const topPlate=part(body,new T.SphereGeometry(1.64,8,4,0,.96,.23,.66),m.rustLight);topPlate.name='kit-armourPlate';
 const cracks=new T.Group();body.add(cracks);const crackSurface=new T.Group();crackSurface.scale.setScalar(1.6);cracks.add(crackSurface);
 const paths=[[[-.72,.58],[-.52,.45],[-.57,.18],[-.4,.04],[-.49,-.25],[-.29,-.51],[-.35,-.77]],[[.35,.86],[.25,.62],[.4,.39],[.32,.15],[.48,-.04],[.36,-.35],[.49,-.64]],[[-.86,-.12],[-.65,-.05],[-.49,-.25],[-.15,-.31],[.03,-.17],[.29,-.22],[.47,-.4],[.76,-.37]],[[-.57,.18],[-.25,.19],[-.05,.37],[.25,.35],[.4,.39],[.72,.27]],[[.03,-.17],[-.04,-.46],[.12,-.7],[.05,-.9]]];
 for(const points of paths)for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),x=-(b[1]-a[1])/length*.012,y=(b[0]-a[0])/length*.012;shellPatch(crackSurface,[[a[0]+x,a[1]+y],[b[0]+x,b[1]+y],[b[0]-x,b[1]-y],[a[0]-x,a[1]-y]],m.red,.05,0);}
 for(const angle of [Math.PI/2,Math.PI,-Math.PI/2]){const side=crackSurface.clone(true);side.rotation.y=angle;cracks.add(side);}cracks.visible=false;
 const steam=new T.InstancedMesh(new T.IcosahedronGeometry(.2,0),new T.MeshBasicMaterial({color:'#cdc1db',transparent:true,opacity:.25,depthWrite:false}),12);root.add(steam);steam.visible=false;const steamDummy=new T.Object3D();
 const exposedPlates=makeExposedPlates(body);const finalize=()=>{batchParts(cracks);batchActor(body,m.rustPaint,[cracks]);for(const arm of arms)batchActor(arm,m.rustPaint);batchParts(root,[body,...arms,steam]);fade=makeOcclusionFade(root);exposedPlates.install();};
 let fade=makeOcclusionFade(root);
 const warnings=new T.Group();world.add(warnings);
 const warnMat=new T.MeshBasicMaterial({color:'#ff4d63',transparent:true,opacity:.24,depthWrite:false,side:T.DoubleSide,toneMapped:false});
 const charge=makeLaneWarning();charge.root.name='chomp-lane';warnings.add(charge.root);
 const sweep=new T.Mesh(new T.RingGeometry(.02,1,80),warnMat.clone());sweep.rotation.x=-Math.PI/2;warnings.add(sweep);
 const sweepEdge=new T.Mesh(new T.RingGeometry(.98,1,80),new T.MeshBasicMaterial({color:'#ff9b9e',transparent:true,opacity:.85,depthWrite:false,side:T.DoubleSide,toneMapped:false}));sweepEdge.rotation.x=-Math.PI/2;warnings.add(sweepEdge);
 const crates=Array.from({length:5},()=>{const group=new T.Group();warnings.add(group);const ring=new T.Mesh(new T.RingGeometry(.9,1,40),new T.MeshBasicMaterial({color:'#ff9b9e',transparent:true,opacity:.85,depthWrite:false,side:T.DoubleSide,toneMapped:false}));ring.rotation.x=-Math.PI/2;group.add(ring);const crate=new T.Mesh(new T.BoxGeometry(.8,.8,.8),m.rustLight);group.add(crate);return{group,ring,crate};});
 let lastGap=-1;root.visible=false;warnings.visible=false;
 function draw(b:Boss,tick:number,alpha:number,t:CombatTuning,reducedMotion=false,camera?:T.Camera,hero?:{x:number;y:number;z:number;radius:number},reducedFlashes=false){
  cracks.visible=bossStage(b.hp,t)===4;steam.visible=cracks.visible;if(steam.visible){for(let i=0;i<12;i++){const p=(tick/75+i*.13)%1;steamDummy.position.set(Math.sin(i*2.4)*1.5,2.85+p*1.8,Math.cos(i*2.4)*1.3);steamDummy.scale.setScalar(Math.sin(p*Math.PI)*(reducedMotion?.6:1));steamDummy.updateMatrix();steam.setMatrixAt(i,steamDummy.matrix);}steam.instanceMatrix.needsUpdate=true;steam.computeBoundingSphere();}root.visible=true;warnings.visible=true;root.position.set(b.prevX+(b.x-b.prevX)*alpha,0,b.prevZ+(b.z-b.prevZ)*alpha);root.scale.setScalar(t.bossRadius/1.6);root.rotation.y=Math.atan2(b.faceX,b.faceZ);body.rotation.y=0;body.position.y=2.5+(reducedMotion?0:Math.sin(tick/30)*.05);
  fade(!!camera&&!!hero&&coversHero(camera,hero,{x:b.x,y:2.5,z:b.z,radius:t.bossRadius}));
  charge.root.visible=false;sweep.visible=false;sweepEdge.visible=false;for(const c of crates)c.group.visible=false;
  exposedPlates.draw(b.exposed>0,reducedFlashes);const state=b.behavior;arms.forEach((arm,i)=>arm.rotation.z=reducedMotion?0:state.kind==='charge'?(i===0?-.28:.28):Math.sin(tick/30+i)*.04);
  if(state.kind==='chomp-warning'){
   const length=t.bossChompSpeed*t.bossChompTicks/60*(bossStage(b.hp,t)===4?t.bossEnrageSpeed:1);charge.root.visible=true;charge.draw(b.x-state.dx*t.bossRadius,b.z-state.dz*t.bossRadius,state.dx,state.dz,t.bossRadius*2,length+t.bossRadius*2,1-state.remaining/t.bossChompWindupTicks);
  }
  if(state.kind==='sweep-warning'){
   const dot=bossStage(b.hp,t)===4?1-(1-t.bossGapDot)*t.bossEnrageGapFactor:t.bossGapDot;const gap=Math.acos(dot);if(lastGap!==gap){sweep.geometry.dispose();sweep.geometry=new T.RingGeometry(.02,1,80,1,gap,Math.PI*2-gap*2);sweepEdge.geometry.dispose();sweepEdge.geometry=new T.RingGeometry(.98,1,80,1,gap,Math.PI*2-gap*2);lastGap=gap;}
   sweep.visible=true;sweep.position.set(b.x,.05,b.z);sweep.scale.setScalar(t.bossSweepRadius);sweep.rotation.z=Math.atan2(-state.gapZ,state.gapX);sweepEdge.visible=true;sweepEdge.position.copy(sweep.position);sweepEdge.position.y+=.01;sweepEdge.scale.copy(sweep.scale);sweepEdge.rotation.copy(sweep.rotation);
  }
  if(state.kind==='volley-warning'||state.kind==='summon-warning')state.targets.forEach((point,i)=>{const c=crates[i];c.group.visible=true;c.group.position.set(point.x,.05,point.z);c.ring.scale.setScalar(t.bossVolleyRadius);c.crate.visible=state.kind==='volley-warning';c.crate.position.y=.8+state.remaining/t.bossVolleyWindupTicks*4;});
 }
 return{root,warnings,draw,finalize,preview:(tick:number)=>{fade(false);root.visible=true;root.position.set(3,0,-1);root.rotation.y=0;body.rotation.y=0;body.position.y=2.5+Math.sin(tick/30)*.05;warnings.visible=false;}};
}
