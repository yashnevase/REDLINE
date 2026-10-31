import {makeBladeProjectileView} from './b5-blade-projectiles.ts';
import {enemyLaunchHeight} from './b4-ability-effects.ts';
import {makeSawProjectiles,makeFloorScars} from './b3-saw-projectiles.ts';
import {B3_ENABLED} from '../content/items/switches.ts';
import {makeWhirlerWarning} from './b2-whirler.ts';
import {coversHero,makeOcclusionFade} from './occlusion.ts';
import {makeLaneWarning} from './lane-warning.ts';
import * as T from 'three';
import {batchActor} from './batch-parts.ts';
import {makeEnemy} from './enemies.ts';
import type {Materials} from './materials.ts';
import type {RunState} from '../sim/run-schema.ts';
import {enemyStats,type EnemyKind} from '../content/encounter.ts';
import type {CombatTuning} from '../content/combat.ts';
function model(kind:EnemyKind,m:Materials){return makeEnemy(kind,m).root;}
export function makeEncounterPresentation(world:T.Group,m:Materials,tuning:{spawnDropHeight:number}={spawnDropHeight:3}){
 const root=new T.Group();world.add(root);
 const circleWarning=new T.RingGeometry(.94,1,64),whirlerWarning=makeWhirlerWarning();
 const slots=Array.from({length:12},()=>{
  const actors={sawlet:model('sawlet',m),thrower:model('thrower',m),shieldsaw:model('shieldsaw',m),grinder:model('grinder',m),whirler:model('whirler',m)} satisfies Record<EnemyKind,T.Group>;for(const actor of Object.values(actors)){root.add(actor);actor.visible=false;}
  const warning=new T.Group();root.add(warning);
  const mat=new T.MeshBasicMaterial({color:'#ff5364',transparent:true,opacity:.2,depthWrite:false,side:T.DoubleSide,toneMapped:false});
  const lane=makeLaneWarning();warning.add(lane.root);
  const ring=new T.Mesh<T.BufferGeometry,T.MeshBasicMaterial>(circleWarning,mat.clone());ring.rotation.x=-Math.PI/2;warning.add(ring);
  const sweep=new T.Mesh(new T.RingGeometry(.9,1,64),new T.MeshBasicMaterial({color:'#ffb16c',transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide,toneMapped:false}));sweep.rotation.x=-Math.PI/2;root.add(sweep);
  const fades={sawlet:makeOcclusionFade(actors.sawlet),thrower:makeOcclusionFade(actors.thrower),shieldsaw:makeOcclusionFade(actors.shieldsaw),grinder:makeOcclusionFade(actors.grinder),whirler:makeOcclusionFade(actors.whirler)};
  return{actors,fades,warning,lane,ring,sweep,id:-1,headY:1.7,launchAt:-100,sweepAt:-100,hitAt:-100,deathAt:-100,shotAt:-100};
 });
 const bladeShots=makeBladeProjectileView(root),sawShots=makeSawProjectiles(root),floorScars=makeFloorScars(root);
 const rivets=new T.InstancedMesh(new T.OctahedronGeometry(.18),m.hot,24);root.add(rivets);rivets.count=0;const dummy=new T.Object3D();
 function draw(s:RunState,alpha:number,t:CombatTuning,reducedMotion=false,reducedFlashes=false,camera?:T.Camera,hero?:{x:number;y:number;z:number;radius:number}){
  const mix=(a:number,b:number)=>a+(b-a)*alpha;
  slots.forEach((slot,i)=>{
   const e=s.enemies[i];for(const actor of Object.values(slot.actors))actor.visible=false;slot.warning.visible=false;slot.sweep.visible=false;if(!e)return;
   if(slot.id!==e.id){slot.id=e.id;slot.launchAt=-100;slot.sweepAt=-100;slot.hitAt=-100;slot.deathAt=-100;}
   const stats=enemyStats(e.kind,t),x=mix(e.prevX,e.x),z=mix(e.prevZ,e.z),actor=slot.actors[e.kind];if(s.events.some(event=>event.kind==='defeat'&&Math.hypot(event.x-e.x,event.z-e.z)<.65))slot.deathAt=s.tick;if(s.events.some(event=>event.kind==='launch'&&event.targetId===e.id))slot.launchAt=s.tick;const deathAge=s.tick-slot.deathAt;actor.visible=e.hp>0||deathAge>=0&&deathAge<16;actor.position.set(x,e.behavior.kind==='spawn'?Math.pow(e.behavior.remaining/t.spawnDropTicks,2)*tuning.spawnDropHeight:0,z);actor.position.y+=enemyLaunchHeight(s.tick,slot.launchAt,reducedMotion);actor.rotation.y=Math.atan2(e.faceX,e.faceZ);actor.scale.setScalar(stats.radius/(e.kind==='sawlet'?.67:e.kind==='grinder'?1:e.kind==='whirler'?.8:.75));
   if(e.hp<=0&&deathAge>=0){const pop=deathAge<4?1:Math.max(0,1-(deathAge-4)/12);actor.scale.multiplyScalar(pop);if(!reducedMotion)actor.rotation.y+=deathAge*.22;}
   slot.headY=actor.position.y+(e.kind==='shieldsaw'?2.22:e.kind==='grinder'?2.35:e.kind==='thrower'?1.85:1.65)*actor.scale.y;
   if(e.kind==='whirler'){const rotor=actor.getObjectByName('rotor');if(rotor)rotor.rotation.y=-((s.tick+alpha)*t.whirlerSpin+e.id*.27)-actor.rotation.y;}slot.fades[e.kind](!!camera&&!!hero&&coversHero(camera,hero,{x,y:stats.radius,z,radius:stats.radius*(e.kind==='sawlet'?1.52:e.kind==='grinder'?1.25:e.kind==='shieldsaw'?1.3:1.15)}));
   if(s.events.some(event=>event.kind==='bonk'&&Math.hypot(event.x-e.x,event.z-e.z)<.65))slot.hitAt=s.tick;const flash=actor.getObjectByName('hit-flash');if(flash instanceof T.Mesh&&flash.material instanceof T.MeshBasicMaterial){flash.material.opacity=reducedFlashes?0:Math.max(0,1-(s.tick-slot.hitAt)/4.2)*.7;flash.visible=flash.material.opacity>0;}
   const b=e.behavior,body=actor.children[0],anticipation=b.kind==='windup'?1-b.remaining/stats.windup:0,flinch=Math.max(0,1-(s.tick-slot.hitAt)/9);
   if(s.projectiles.some(p=>p.owner===e.id&&p.remaining>=t.rivetLifeTicks-1))slot.shotAt=s.tick;
   const recoil=Math.max(0,1-(s.tick-slot.shotAt)/10);
   body.scale.set(reducedMotion?1:(1+anticipation*.13)*(1+flinch*.25),reducedMotion?1:(1-anticipation*.16)*(1-flinch*.25),reducedMotion?1:1+anticipation*.08);
   body.position.y=(e.kind==='grinder'||e.kind==='shieldsaw'?1:.7)+(reducedMotion?0:Math.sin(s.tick/18+e.id*2.4)*.025);
   body.rotation.y=!reducedMotion&&s.hero.special.kind==='spin'&&Math.hypot(e.x-s.hero.x,e.z-s.hero.z)<=t.bladeSpinRadius+stats.radius?s.tick*.35:0;body.rotation.x=reducedMotion?0:-flinch*.16+recoil*.22;body.rotation.z=reducedMotion?0:e.kind==='shieldsaw'?Math.sin((s.tick-slot.hitAt)*1.3)*flinch*.12:0;
   if(flash instanceof T.Mesh&&flash.material instanceof T.MeshBasicMaterial&&!reducedFlashes&&anticipation>0){flash.visible=true;flash.material.color.set('#ff946e');flash.material.opacity=anticipation*.2;}else if(flash instanceof T.Mesh&&flash.material instanceof T.MeshBasicMaterial)flash.material.color.set('#fff');
   const hit=flash instanceof T.Mesh&&flash.visible&&flash.material instanceof T.MeshBasicMaterial?flash.material.opacity:0;body.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material)&&o.material.userData.actorHit)o.material.userData.actorHit.value=hit;});if(flash)flash.visible=false;
   const rotor=actor.getObjectByName('rotor');if(rotor&&e.kind!=='whirler')for(const disc of rotor.children)disc.rotation.z=reducedMotion?0:s.tick*(b.kind==='lunge'?.3:b.kind==='windup'?.12+anticipation*.2:.08);actor.rotation.z=!reducedMotion&&b.kind==='windup'?Math.sin(s.tick*.8)*.025:0;
   if(b.kind==='spawn'){slot.sweepAt=s.tick+(b.remaining-1);}
   if(b.kind==='windup'){
    slot.warning.visible=true;slot.warning.position.set(x,.04,z);slot.warning.rotation.y=Math.atan2(b.dx,b.dz);slot.lane.root.visible=e.kind!=='grinder'&&e.kind!=='whirler';slot.ring.visible=e.kind==='grinder'||e.kind==='whirler';slot.ring.geometry=e.kind==='whirler'?whirlerWarning:circleWarning;if(e.kind==='whirler'){slot.warning.rotation.y=0;slot.ring.rotation.z=-((s.tick+alpha)*t.whirlerSpin+e.id*.27);}else slot.ring.rotation.z=0;slot.ring.material.opacity=.8;
    const length=e.kind==='sawlet'?t.lungeSpeed*t.lungeTicks/60:e.kind==='shieldsaw'?t.shieldChargeSpeed*t.shieldChargeTicks/60:t.rivetSpeed*t.rivetLifeTicks/60;
    const padding=e.kind==='thrower'?t.rivetRadius:stats.radius;slot.lane.draw(0,-padding,0,1,e.kind==='thrower'?t.rivetRadius*2:stats.radius*2,length+padding*2,1-b.remaining/stats.windup);slot.ring.scale.setScalar(e.kind==='whirler'?t.whirlerArmReach:t.grinderSweepRadius);
   }
   if(e.kind==='grinder'&&s.events.some(event=>event.kind==='stomp'&&Math.abs(event.x-e.x)<.01&&Math.abs(event.z-e.z)<.01))slot.sweepAt=s.tick;
   const age=(s.tick-slot.sweepAt)/60;if(age>=0&&age<.35){slot.sweep.visible=true;slot.sweep.position.set(x,.06,z);slot.sweep.scale.setScalar(t.grinderSweepRadius*(.4+age/.35*.6));slot.sweep.material.opacity=(1-age/.35)*.8;}
  });
  bladeShots.draw(s,alpha);sawShots.draw(s,alpha);floorScars.draw(s,reducedFlashes);rivets.visible=!B3_ENABLED;rivets.count=B3_ENABLED?0:s.projectiles.length;for(let i=0;i<24;i++){const p=s.projectiles[i];dummy.position.set(p?mix(p.prevX,p.x):0,.6,p?mix(p.prevZ,p.z):0);dummy.scale.setScalar(p?t.rivetRadius/.18:0);dummy.rotation.set(s.tick*.1,0,s.tick*.1);dummy.updateMatrix();rivets.setMatrixAt(i,dummy.matrix);}rivets.instanceMatrix.needsUpdate=true;if(rivets.count)rivets.computeBoundingSphere();
 }
 function screen(s:RunState,camera:T.Camera,width:number,height:number){return s.enemies.map((e,i)=>{const point=new T.Vector3(e.x,slots[i]?.headY??1.7,e.z).project(camera);return{id:e.id,x:(point.x+1)*width/2,y:(1-point.y)*height/2,visible:e.hp>0&&point.z>-1&&point.z<1};});}
 root.visible=false;return{root,draw,screen,budget:()=>Object.fromEntries(Object.entries(slots[0].actors).map(([kind,actor])=>{let triangles=0;for(const child of actor.children)child.traverseVisible(o=>{if(o instanceof T.Mesh)triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;});return[kind,triangles];})),reset:()=>{bladeShots.reset();floorScars.reset();for(const slot of slots){slot.id=-1;slot.hitAt=slot.deathAt=slot.sweepAt=slot.shotAt=-100;}},finalize:()=>{for(const slot of slots)for(const kind of ['sawlet','thrower','shieldsaw','grinder','whirler'] as const){const actor=slot.actors[kind];const body=actor.children[0] as T.Group,rotor=actor.getObjectByName('rotor')!,flash=actor.getObjectByName('hit-flash')!;batchActor(body,m.rustPaint,[rotor,flash]);if(kind==='whirler'&&rotor instanceof T.Group)batchActor(rotor,m.rustPaint,[],false);else for(const disc of rotor.children)if(disc instanceof T.Group)batchActor(disc,m.rustPaint,[],false);slot.fades[kind]=makeOcclusionFade(actor);}},lineup:(tick:number)=>{slots.forEach((slot,i)=>{slot.warning.visible=false;slot.sweep.visible=false;for(const actor of Object.values(slot.actors))actor.visible=false;if(i<5){const kind=(['sawlet','thrower','shieldsaw','grinder','whirler'] as const)[i],actor=slot.actors[kind];actor.visible=true;actor.position.set((i-2)*2.4,0,0);actor.rotation.set(0,.35,0);const rotor=actor.getObjectByName('rotor');if(rotor&&kind!=='whirler')for(const disc of rotor.children)disc.rotation.z=tick*.02;}});}};
}
