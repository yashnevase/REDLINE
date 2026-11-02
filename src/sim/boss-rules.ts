import {stepRexV2} from './rex-v2.ts';
import {exposeBossPlates} from './f3-weak-spot.ts';
import type {Boss,RunState} from './run-schema.ts';
import {spawnEnemy} from './run-schema.ts';
import type {CombatTuning} from '../content/combat.ts';
import {bossStage,bossPatterns} from '../content/boss.ts';
import {collide,direction} from './geometry.ts';
import type {Emit} from './hero.ts';
export function stepBoss(b:Boss,s:RunState,t:CombatTuning,hurt:(amount:number,attack?:string)=>void,event:Emit){
 if(b.rex){stepRexV2(b,s,t,hurt,event);return;}
 if(b.exposed>0)b.exposed--;const h=s.hero,stage=bossStage(b.hp,t,b.maxHP),enraged=stage===4,speed=enraged?t.bossEnrageSpeed:1,mult=enraged?t.bossEnrageDamage:1;
 const recover=(heavy=true)=>{exposeBossPlates(b,t,heavy);b.behavior={kind:'recover',remaining:Math.max(1,Math.round(t.bossRecoveryTicks/speed))};};
 const state=b.behavior;
 if(state.kind==='recover'){
  const d=direction(h.x-b.x,h.z-b.z);if(!b.exposed){b.faceX=d.x;b.faceZ=d.z;}
  if(state.remaining>1){state.remaining--;const dist=Math.sqrt((h.x-b.x)**2+(h.z-b.z)**2),step=Math.min(t.bossMoveSpeed/60,Math.max(0,dist-t.bossRadius-t.heroRadius-.35));const p=collide(b.x+d.x*step,b.z+d.z*step,t.bossRadius,t);b.x=p.x;b.z=p.z;return;}
  const engaged=new Set(s.enemies.filter(e=>e.hp>0&&(e.behavior.kind==='windup'||e.behavior.kind==='lunge')).map(e=>e.id));for(const p of s.projectiles)engaged.add(p.owner);if(engaged.size>=t.attackerCap)return;
  const pattern=bossPatterns[stage],move=pattern[b.sequence++%pattern.length];
  if(move==='chomp')b.behavior={kind:'chomp-warning',remaining:t.bossChompWindupTicks,dx:d.x,dz:d.z};
  if(move==='sweep')b.behavior={kind:'sweep-warning',remaining:t.bossSweepWindupTicks,gapX:d.x,gapZ:d.z};
  if(move==='volley'){
   const offsets=[[0,0],[2.4,0],[-2.4,0],[0,2.4],[0,-2.4]];b.behavior={kind:'volley-warning',remaining:t.bossVolleyWindupTicks,targets:offsets.map(([x,z])=>collide(h.x+x,h.z+z,t.bossVolleyRadius,t))};
  }
  if(move==='summon'){
   const count=Math.max(0,Math.min(3,6-s.enemies.filter(e=>e.hp>0).length,t.enemyCap-1-s.enemies.filter(e=>e.hp>0).length));
   b.behavior={kind:'summon-warning',remaining:t.bossSummonWindupTicks,targets:Array.from({length:count},(_,i)=>collide(b.x+(i-1)*3,b.z+(h.z>b.z?-4:4),t.sawletRadius,t))};
  }return;
 }
 if(state.kind==='charge'){
  const p=collide(b.x+state.dx*t.bossChompSpeed*speed/60,b.z+state.dz*t.bossChompSpeed*speed/60,t.bossRadius,t);b.x=p.x;b.z=p.z;
  if(!state.hasHit&&Math.sqrt((b.x-h.x)**2+(b.z-h.z)**2)<t.bossRadius+t.heroRadius){const hp=h.hp;hurt(t.bossChompDamage*mult);if(h.hp<hp)state.hasHit=true;}
  if(--state.remaining<=0)recover();return;
 }
 if(state.remaining>1){state.remaining--;return;}
 if(state.kind==='chomp-warning')b.behavior={kind:'charge',remaining:t.bossChompTicks,dx:state.dx,dz:state.dz,hasHit:false};
 if(state.kind==='sweep-warning'){
  const d=direction(h.x-b.x,h.z-b.z),dist=Math.sqrt((h.x-b.x)**2+(h.z-b.z)**2),gapDot=enraged?1-(1-t.bossGapDot)*t.bossEnrageGapFactor:t.bossGapDot;
  if(dist<=t.bossSweepRadius+t.heroRadius&&(dist<t.heroRadius||d.x*state.gapX+d.z*state.gapZ<gapDot))hurt(t.bossSweepDamage*mult);
  event('stomp',b.x,b.z,0,t.bossSweepRadius);recover();
 }
 if(state.kind==='volley-warning'){
  for(const point of state.targets){if(Math.sqrt((h.x-point.x)**2+(h.z-point.z)**2)<t.bossVolleyRadius+t.heroRadius)hurt(t.bossVolleyDamage*mult);event('stomp',point.x,point.z,0,t.bossVolleyRadius);}recover();
 }
 if(state.kind==='summon-warning'){
  s.enemies=s.enemies.filter(e=>e.hp>0);for(const point of state.targets){if(s.enemies.length>=Math.min(6,t.enemyCap-1))break;const e=spawnEnemy('sawlet',b.sequence*10+s.enemies.length,1000,t);Object.assign(e,{x:point.x,z:point.z,prevX:point.x,prevZ:point.z});s.enemies.push(e);}recover(false);
 }
}
