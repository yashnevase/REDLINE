import {enemyStats} from '../content/encounter.ts';
import {B4_ENABLED} from '../content/items/switches.ts';
import type {RunState,Enemy} from './run-schema.ts';import type {CombatTuning} from '../content/combat.ts';import type {Emit} from './hero.ts';import type {Command} from './schema.ts';import {collide,direction} from './geometry.ts';
const distance=(a:{x:number;z:number},b:{x:number;z:number})=>Math.sqrt((a.x-b.x)**2+(a.z-b.z)**2);
type Hit=(e:Enemy,amount:number,stun?:boolean,heavy?:boolean,source?:'bonk'|'dash'|'ability'|'projectile')=>void;
type BossHit=(amount:number,heavy?:boolean,source?:'bonk'|'dash'|'ability'|'projectile')=>void;
export function applyAbilities(s:RunState,t:CombatTuning,ability:Command['ability'],damageMultiplier:number,damage:Hit,bossDamage:BossHit,event:Emit){
 const h=s.hero,boss=s.phase.kind==='boss'?s.phase.boss:null;
 if(!B4_ENABLED){legacyAbilities(s,t,ability,damageMultiplier,damage,bossDamage,event);return;}
 if(ability==='pulse'){h.special={kind:'spin',remaining:t.bladeSpinTicks,hits:[],hopRemaining:h.special.kind==='hop'?h.special.remaining:0};const fx=s.events.find(e=>e.kind==='pulse');if(fx){fx.kind='blade';fx.radius=t.bladeSpinRadius;}event('floor-scar',h.x,h.z,2,t.bladeSpinRadius);}
 if(ability==='stomp'){h.slam={kind:'charging',remaining:t.stompChargeTicks+1};const fx=s.events.find(e=>e.kind==='stomp');if(fx)fx.kind='stomp-charge';}
 if(ability==='boost'){if(h.special.kind==='spin')h.special.hopRemaining=t.boostHopTicks;else h.special={kind:'hop',remaining:t.boostHopTicks};const fx=s.events.find(e=>e.kind==='boost');if(fx){fx.radius=t.boostRadius;fx.dx=h.faceX;fx.dz=h.faceZ;}}
 let slam=false;if(h.slam.kind==='charging'&&--h.slam.remaining<=0){h.slam={kind:'idle'};slam=true;event('stomp',h.x,h.z,0,t.stompRadius);event('floor-scar',h.x,h.z,1,t.stompRadius);}
 const spin=h.special.kind==='spin'?h.special:null,interval=Math.max(1,Math.round(t.bladeSpinTicks/t.spinDamageTicks)),spinPulse=!!spin&&spin.remaining>0&&spin.remaining%interval===0;
 if(spinPulse){spin!.hits=[];event('spin-tick',h.x,h.z,0,t.bladeSpinRadius);}
 const zones:{kind:'spin'|'slam'|'boost';radius:number;amount:number}[]=[];if(spinPulse)zones.push({kind:'spin',radius:t.bladeSpinRadius,amount:(s.loadout==='blade'?t.bladeDamage:t.pulseDamage*2)/t.spinDamageTicks});if(slam)zones.push({kind:'slam',radius:t.stompRadius,amount:t.stompDamage});if(ability==='boost')zones.push({kind:'boost',radius:t.boostRadius,amount:t.boostDamage});
 const cone=(x:number,z:number)=>{const d=direction(x-h.x,z-h.z);return d.x*h.faceX+d.z*h.faceZ>=t.boostConeDot;};
 for(const zone of zones){for(const e of s.enemies){if(e.hp<=0)continue;const r=enemyStats(e.kind,t).radius;if(distance(h,e)>zone.radius+r||zone.kind==='boost'&&!cone(e.x,e.z))continue;damage(e,zone.amount*damageMultiplier,zone.kind==='slam',true,'ability');if(zone.kind==='slam'){event('launch',e.x,e.z,0,r);s.events[s.events.length-1].targetId=e.id;const away=direction(e.x-h.x,e.z-h.z),p=collide(e.x+away.x*.7,e.z+away.z*.7,r,t);e.x=p.x;e.z=p.z;}}
  if(boss&&distance(h,boss)<=zone.radius+t.bossRadius&&(zone.kind!=='boost'||cone(boss.x,boss.z)))bossDamage(zone.amount*damageMultiplier,true,'ability');
 }
 if(spin)for(const e of s.enemies){const r=enemyStats(e.kind,t).radius;if(e.hp>0&&distance(h,e)<=t.bladeSpinRadius+r){const d=direction(h.x-e.x,h.z-e.z),p=collide(e.x+d.x*t.bladePull/14,e.z+d.z*t.bladePull/14,r,t);e.x=p.x;e.z=p.z;}}

}
function legacyAbilities(s:RunState,t:CombatTuning,ability:Command['ability'],damageMultiplier:number,damage:Hit,bossDamage:BossHit,_event:Emit){const h=s.hero,boss=s.phase.kind==='boss'?s.phase.boss:null;
 if(ability==='pulse'&&s.loadout==='blade'){h.special={kind:'spin',remaining:t.bladeSpinTicks,hits:[],hopRemaining:h.special.kind==='hop'?h.special.remaining:0};const fx=s.events.find(e=>e.kind==='pulse');if(fx){fx.kind='blade';fx.radius=t.bladeSpinRadius;}}
 if(ability==='boost'&&s.loadout==='blade'){if(h.special.kind==='spin')h.special.hopRemaining=t.boostHopTicks;else h.special={kind:'hop',remaining:t.boostHopTicks};const fx=s.events.find(e=>e.kind==='boost');if(fx){fx.radius=t.boostRadius;fx.dx=h.faceX;fx.dz=h.faceZ;}}
 const spin=h.special.kind==='spin'?h.special:null;
 const hits=(x:number,z:number,radius:number)=>distance(h,{x,z})<=radius;
 const inCone=(x:number,z:number,r:number)=>{const d=direction(x-h.x,z-h.z);return hits(x,z,t.boostRadius+r)&&(d.x*h.faceX+d.z*h.faceZ>=t.boostConeDot||distance(h,{x,z})<.01);};
 if(spin||ability==='pulse'||ability==='stomp'||ability==='boost'&&s.loadout==='blade'){
  const radius=spin?t.bladeSpinRadius:ability==='pulse'?t.pulseRadius:t.stompRadius,amount=(spin?t.bladeDamage:ability==='boost'?t.boostDamage:ability==='pulse'?t.pulseDamage:t.stompDamage)*damageMultiplier;
  for(const e of s.enemies){const r=enemyStats(e.kind,t).radius;if(e.hp>0&&(ability==='boost'?inCone(e.x,e.z,r):hits(e.x,e.z,radius+r))&&(!spin||!spin.hits.includes(e.id))){damage(e,amount,ability==='stomp',true,'ability');if(spin){spin.hits.push(e.id);const d=direction(h.x-e.x,h.z-e.z),p=collide(e.x+d.x*t.bladePull,e.z+d.z*t.bladePull,r,t);e.x=p.x;e.z=p.z;}}}
  if(boss&&(ability==='boost'?inCone(boss.x,boss.z,t.bossRadius):hits(boss.x,boss.z,radius+t.bossRadius))&&(!spin||!spin.hits.includes(-1))){bossDamage(amount,true,'ability');spin?.hits.push(-1);}
 }
}
