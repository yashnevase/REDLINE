import {classifyHit,grantPerfect,tickQuality,qualityEvent} from './b1-hit-quality.ts';
import {repairClearedWave} from './q3-wave-repair.ts';
import {stepBoss} from './boss-rules.ts';
import {runSchema,spawnEnemy,initialBoss,type RunState,type Enemy} from './run-schema.ts';
import type {Command} from './schema.ts';
import type {CombatTuning} from '../content/combat.ts';
import {waves,enemyStats} from '../content/encounter.ts';
import {upgradedTuning,upgradeChoices,upgrades} from '../content/upgrades.ts';
import {advanceHero,endDash,bufferDash,bounceDash} from './hero.ts';
import {collide,direction} from './geometry.ts';
const distance=(a:{x:number;z:number},b:{x:number;z:number})=>Math.sqrt((a.x-b.x)**2+(a.z-b.z)**2);
export function stepRun(previous:unknown,command:Command,base:CombatTuning):RunState {
 const s=runSchema.parse(previous),h=s.hero;s.tick++;s.events=[];
 const t=upgradedTuning(base,s.upgrades);
 const event=(kind:RunState['events'][number]['kind'],x:number,z:number,amount=0,radius=0)=>s.events.push({id:`${s.tick}:${s.events.length}`,tick:s.tick,kind,x,z,amount,radius});
 h.prevX=h.x;h.prevZ=h.z;if(s.phase.kind==='boss'){s.phase.boss.prevX=s.phase.boss.x;s.phase.boss.prevZ=s.phase.boss.z;}for(const e of s.enemies){e.prevX=e.x;e.prevZ=e.z;}for(const p of s.projectiles){p.prevX=p.x;p.prevZ=p.z;}
 if(s.phase.kind==='lost'||s.phase.kind==='complete')return s;
 if(s.phase.kind==='upgrade'){
  if(command.upgrade&&s.phase.choices.includes(command.upgrade)){
   const pick=upgrades.find(u=>u.id===command.upgrade);if(!pick)return s;
   s.upgrades.push(pick.id);if(pick.stat==='heroHP')h.hp+=t.upgradeHP;if(pick.stat==='dashCharges')h.charges+=t.upgradeCharges;
   const wave=s.phase.wave+1,next=waves[wave];s.enemies=next.slice(0,Math.min(t.enemyCap,t.openingThreats)).map((kind,i)=>spawnEnemy(kind,i,wave,t));s.phase={kind:'fight',wave,nextSpawn:Math.min(t.enemyCap,t.openingThreats,next.length),nextSpawnIn:t.spawnMinTicks};
   h.vx=0;h.vz=0;h.dash={kind:'idle'};h.special={kind:'idle'};h.tapWindow=0;h.dashReleaseBuffer=false;h.dashReleaseSuppressed=command.choice===0;h.buffer=0;h.abilityBuffer=null;h.abilityBufferTicks=0;
  }
  return s;
 }
 if(command.overdrive)h.overdriveBuffer=true;
 if(command.ability){h.abilityBuffer=command.ability;h.abilityBufferTicks=t.inputBufferTicks;}
 if(s.hitstop>0){bufferDash(h,command,t);s.hitstop--;return s;}
 tickQuality(s.quality);h.hp=Math.min(h.hp,t.heroHP);h.charges=Math.min(h.charges,t.dashCharges);
 const heroTuning=s.loadout==='blade'?{...t,pulseCooldownTicks:t.bladeCooldownTicks}:t;
 const {ability,damageMultiplier,actualSpeed}=advanceHero(h,command,heroTuning,event);
 const boss=s.phase.kind==='boss'?s.phase.boss:null;
 const stop=(amount:number,heavy=false)=>{s.hitstop=Math.max(s.hitstop,heavy||amount>=14?t.heavyHitstopTicks:amount>=12?t.mediumHitstopTicks:t.hitstopTicks);};
 const bossDamage=(amount:number,heavy=false,source:'bonk'|'dash'|'ability'|'projectile'='bonk')=>{if(!boss||boss.hp<=0)return;const state=boss.behavior,warning=state.kind.endsWith('-warning'),quality=classifyHit({x:boss.x,z:boss.z,faceX:boss.faceX,faceZ:boss.faceZ,kind:'grinder',behavior:warning?{kind:'windup',remaining:state.remaining,dx:0,dz:0}:{kind:'chase'}},h,t,s.quality,source);amount=Math.round(amount*quality.factor*10)/10;boss.hp=Math.max(0,boss.hp-amount);event('bonk',boss.x,boss.z,amount,t.bossRadius);if(quality.rear)qualityEvent(s,'REAR HIT',boss.x,boss.z);if(quality.counter){qualityEvent(s,'COUNTER',boss.x,boss.z);boss.behavior={kind:'recover',remaining:t.counterStaggerTicks};h.heat=Math.min(t.heatThreshold,h.heat+t.counterHeat);}stop(amount,heavy);};
 const hurt=(amount:number,attack='contact')=>{if(h.hp<=0)return;if(h.dash.kind==='active'&&h.dash.protected){if(amount>0&&grantPerfect(s.quality,h,attack,t))qualityEvent(s,'PERFECT',h.x,h.z);return;}h.hp=Math.max(0,h.hp-amount);stop(amount);event('hurt',h.x,h.z,amount);};
 const damage=(e:Enemy,amount:number,stun=false,heavy=false,source:'bonk'|'dash'|'ability'|'projectile'='bonk')=>{
  if(e.hp<=0)return;const stats=enemyStats(e.kind,t),quality=classifyHit(e,h,t,s.quality,source);amount*=quality.factor;
  amount=Math.round(amount*10)/10;e.hp=Math.max(0,e.hp-amount);event('bonk',e.x,e.z,amount,stats.radius);stop(amount,heavy);
  if(quality.rear)qualityEvent(s,'REAR HIT',e.x,e.z);if(quality.punish||quality.counter){qualityEvent(s,'COUNTER',e.x,e.z);h.heat=Math.min(t.heatThreshold,h.heat+t.counterHeat);}
  if(e.hp===0){s.hitstop=Math.max(s.hitstop,t.killHitstopTicks);e.behavior={kind:'defeated'};h.heat=Math.min(t.heatThreshold,h.heat+stats.heat);event('defeat',e.x,e.z);}
  else if(stun||quality.counter)e.behavior={kind:'recover',remaining:stun?t.stompStunTicks+1:t.counterStaggerTicks};
 };
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
 // Swept path damage for Rush/Charge: one hit per target for this dash, including the boss.
 if(h.dash.kind==='active'&&h.dash.variant!=='tap'){
  const dash=h.dash,near=(x:number,z:number,r:number)=>{const vx=h.x-h.prevX,vz=h.z-h.prevZ,den=vx*vx+vz*vz,u=den?Math.max(0,Math.min(1,((x-h.prevX)*vx+(z-h.prevZ)*vz)/den)):0;return Math.sqrt((x-h.prevX-u*vx)**2+(z-h.prevZ-u*vz)**2)<=r+t.heroRadius;};
  const amount=t.bonkDamage*(1+t.bonkSpeedBonus)*(dash.variant==='rush'?t.rushDamageFactor:1)*damageMultiplier;
  for(const e of s.enemies)if(e.hp>0&&!dash.hits.includes(e.id)&&near(e.x,e.z,enemyStats(e.kind,t).radius)){damage(e,amount,false,false,'dash');dash.hits.push(e.id);const away=direction(e.x-h.x,e.z-h.z),p=collide(e.x+away.x*t.dashBounceKnockback,e.z+away.z*t.dashBounceKnockback,enemyStats(e.kind,t).radius,t);bounceDash(h,-away.x,-away.z);e.x=p.x;e.z=p.z;}
  if(boss&&boss.hp>0&&!dash.hits.includes(-1)&&near(boss.x,boss.z,t.bossRadius)){bossDamage(amount,false,'dash');dash.hits.push(-1);bounceDash(h,h.x-boss.x,h.z-boss.z);}
 }
 if(boss&&boss.hp>0)stepBoss(boss,s,t,amount=>hurt(amount,`boss:${boss.sequence}`),event);

 const engaged=new Set(s.enemies.filter(e=>e.hp>0&&(e.behavior.kind==='windup'||e.behavior.kind==='lunge')).map(e=>e.id));for(const p of s.projectiles)engaged.add(p.owner);let attackers=engaged.size+(boss&&boss.hp>0&&boss.behavior.kind!=='recover'?1:0);
 const rally=s.phase.kind==='fight'&&s.enemies.filter(e=>e.hp>0).length<=t.rallyRemaining;
 for(const e of s.enemies){
  if(e.hp<=0)continue;const stats=enemyStats(e.kind,t),d=direction(h.x-e.x,h.z-e.z),dist=distance(h,e);
  switch(e.behavior.kind){
   case'spawn':if(--e.behavior.remaining<=0)e.behavior={kind:'chase'};break;
   case'chase':{
    e.faceX=d.x;e.faceZ=d.z;
    if(dist<=stats.range&&!engaged.has(e.id)&&attackers<t.attackerCap&&s.projectiles.length<24){e.attackSerial++;e.behavior={kind:'windup',remaining:stats.windup,dx:d.x,dz:d.z};attackers++;engaged.add(e.id);}
    else{
     const sign=rally?(dist>t.bonkRange*.8?1:0):e.kind==='thrower'&&dist<t.throwerNear?-1:dist>stats.range?1:0;
     const p=collide(e.x+d.x*stats.speed*(rally?1+t.rallySpeedBonus:1)/60*sign,e.z+d.z*stats.speed*(rally?1+t.rallySpeedBonus:1)/60*sign,stats.radius,t);e.x=p.x;e.z=p.z;
    }break;
   }
   case'windup':{
    const b=e.behavior;if(b.remaining>1){b.remaining--;break;}
    if(e.kind==='thrower'){
     s.projectiles.push({id:s.nextProjectile++,owner:e.id,x:e.x,z:e.z,prevX:e.x,prevZ:e.z,dx:b.dx,dz:b.dz,remaining:t.rivetLifeTicks});e.behavior={kind:'recover',remaining:stats.recovery,rallyEligible:true};
    }else if(e.kind==='grinder'){
     if(distance(h,e)<=t.grinderSweepRadius+t.heroRadius)hurt(t.grinderDamage,`enemy:${e.id}:${e.attackSerial}`);event('stomp',e.x,e.z,0,t.grinderSweepRadius);e.behavior={kind:'recover',remaining:stats.recovery,rallyEligible:true,punish:t.punishTicks};attackers--;
    }else e.behavior={kind:'lunge',remaining:e.kind==='shieldsaw'?t.shieldChargeTicks:t.lungeTicks,dx:b.dx,dz:b.dz,hasHit:false};
    break;
   }
   case'lunge':{
    const b=e.behavior,speed=e.kind==='shieldsaw'?t.shieldChargeSpeed:t.lungeSpeed,p=collide(e.x+b.dx*speed/60,e.z+b.dz*speed/60,stats.radius,t);e.x=p.x;e.z=p.z;
    if(!b.hasHit&&distance(h,e)<t.heroRadius+stats.radius){const hp=h.hp;hurt(e.kind==='shieldsaw'?t.rivetDamage:t.contactDamage,`enemy:${e.id}:${e.attackSerial}`);if(h.hp<hp)b.hasHit=true;}
    if(--b.remaining<=0){e.behavior={kind:'recover',remaining:stats.recovery,rallyEligible:true,punish:e.kind==='shieldsaw'?t.punishTicks:0};attackers--;}break;
   }
   case'recover':if((e.behavior.punish??0)>0)e.behavior.punish!--;if(rally&&e.behavior.rallyEligible&&!(e.behavior.punish??0)){e.behavior={kind:'chase'};break;}if(e.behavior.remaining>1)e.behavior.remaining--;else e.behavior={kind:'chase'};break;
  }
 }
 // Separate live bodies without moving the hero or consuming gameplay randomness.
 for(let i=0;i<s.enemies.length;i++)for(let j=i+1;j<s.enemies.length;j++){
  const a=s.enemies[i],b=s.enemies[j];if(a.hp<=0||b.hp<=0||a.behavior.kind==='lunge'||b.behavior.kind==='lunge')continue;
  const min=enemyStats(a.kind,t).radius+enemyStats(b.kind,t).radius,dist=distance(a,b);if(dist>=min)continue;
  const d=dist>0?direction(b.x-a.x,b.z-a.z):{x:1,z:0},push=(min-dist)*.5;
  const pa=collide(a.x-d.x*push,a.z-d.z*push,enemyStats(a.kind,t).radius,t),pb=collide(b.x+d.x*push,b.z+d.z*push,enemyStats(b.kind,t).radius,t);a.x=pa.x;a.z=pa.z;b.x=pb.x;b.z=pb.z;
 }
 const projectiles:RunState['projectiles']=[];
 for(const p of s.projectiles){
  const x=p.x+p.dx*t.rivetSpeed/60,z=p.z+p.dz*t.rivetSpeed/60,pos=collide(x,z,t.rivetRadius,t);p.x=x;p.z=z;p.remaining--;
  // Swept circle test against the hero, avoiding fast projectile tunnelling.
  const vx=p.x-p.prevX,vz=p.z-p.prevZ,den=vx*vx+vz*vz,u=den>0?Math.max(0,Math.min(1,((h.x-p.prevX)*vx+(h.z-p.prevZ)*vz)/den)):0;
  const near={x:p.prevX+u*vx,z:p.prevZ+u*vz};
  if(distance(h,near)<t.heroRadius+t.rivetRadius){hurt(t.rivetDamage,`projectile:${p.id}`);continue;}
  if(p.remaining>0&&Math.abs(pos.x-x)<.001&&Math.abs(pos.z-z)<.001)projectiles.push(p);
 }s.projectiles=projectiles;
 if(h.hp>0&&h.bonkCooldown===0&&!(h.dash.kind==='active'&&h.dash.variant!=='tap')){
  const target=s.enemies.filter(e=>e.hp>0&&distance(h,e)<t.bonkRange).sort((a,b)=>distance(h,a)-distance(h,b)||a.id-b.id)[0];
  if(boss&&boss.hp>0&&distance(h,boss)<t.bonkRange+t.bossRadius&&(!target||distance(h,boss)-t.bossRadius<distance(h,target))){const factor=Math.min(1,actualSpeed/(t.dashDistance*60/t.dashTicks));bossDamage(t.bonkDamage*(1+t.bonkSpeedBonus*factor)*damageMultiplier);h.bonkCooldown=t.bonkCooldownTicks;}
  else if(target){const factor=Math.min(1,actualSpeed/(t.dashDistance*60/t.dashTicks));damage(target,t.bonkDamage*(1+t.bonkSpeedBonus*factor)*damageMultiplier);h.bonkCooldown=t.bonkCooldownTicks;const away=direction(target.x-h.x,target.z-h.z),p=collide(target.x+away.x*t.knockback,target.z+away.z*t.knockback,enemyStats(target.kind,t).radius,t);target.x=p.x;target.z=p.z;}
 }
 endDash(h);
 if(h.hp<=0){h.dash={kind:'idle'};h.special={kind:'idle'};h.vx=h.vz=0;s.phase={kind:'lost'};return s;}
 if(boss&&boss.hp===0){h.dash={kind:'idle'};h.special={kind:'idle'};h.vx=h.vz=0;event('defeat',boss.x,boss.z);s.phase={kind:'complete',reward:'blade'};s.enemies=[];s.projectiles=[];return s;}
 if(s.phase.kind!=='fight')return s;
 // Spawn queue never exceeds the approved live cap. Dead entries are retired when replenishing.
 const alive=s.enemies.filter(e=>e.hp>0);const formation=waves[s.phase.wave];
 const spawnMax=alive.length<5?Math.min(t.spawnMaxTicks,t.sparseSpawnMaxTicks):t.spawnMaxTicks;s.phase.nextSpawnIn=Math.min(s.phase.nextSpawnIn,spawnMax);
 if(s.phase.nextSpawnIn>0)s.phase.nextSpawnIn--;
 if(s.phase.nextSpawn<formation.length&&alive.length<t.enemyCap&&s.phase.nextSpawnIn===0){
  const i=s.phase.nextSpawn++;s.enemies=alive;s.enemies.push(spawnEnemy(formation[i],i,s.phase.wave,t));
  // Stable cadence, saved in snapshots. No host clock or unseeded RNG in the simulation.
  s.phase.nextSpawnIn=t.spawnMinTicks+(i*17+s.phase.wave*11)%Math.max(1,spawnMax-t.spawnMinTicks+1);
 }
 if(s.enemies.every(e=>e.hp<=0)&&s.phase.nextSpawn===formation.length){
  s.projectiles=[];h.vx=0;h.vz=0;h.dash={kind:'idle'};const healed=repairClearedWave(h,t.heroHP,t.waveRepairFraction);if(healed>0)event('repair',h.x,h.z,healed,2.5);
  s.phase=s.phase.wave===waves.length-1?{kind:'boss',boss:initialBoss(t)}:{kind:'upgrade',wave:s.phase.wave,choices:upgradeChoices(s.phase.wave,s.upgrades)};
 }
 return s;
}
