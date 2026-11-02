import {isHopper} from '../content/chapters/bog-moon.ts';
import {bogSlow,stepBogWorld,stepHopper,bogDeath,clearBog,hopperHeight} from './bog-combat.ts';
import {startFrogLeap,stepFrogLeap} from './frog-legs.ts';
import {gulpNames} from './bog-schema.ts';
import {styleRank} from '../content/items/s4-additions.ts';
import {rexNames} from '../content/items/rex-v2.ts';
import {difficultyTuning} from '../content/r3-difficulty.ts';
import {updatePressure,directorHazards} from './r3-director.ts';
import {stepExtrasWorld,finishExtras,graze,bank} from './s4-extras.ts';
import {I8_ENABLED} from '../content/items/s4-additions.ts';
import {tickCombatStatuses,refundPerfect} from './cl6-status.ts';
import {CL6_ENABLED} from '../content/items/cl-combat.ts';
import {stepVents} from './c1-vents.ts';
import {activeFormation,levelCompletion,beginObjectiveWave} from './f1-objectives.ts';
import {F1_ENABLED} from '../content/items/switches.ts';
import {recordDeath} from './f5-results.ts';
import type {DeathCause} from '../content/items/f5-results.ts';
import {weakSpotFactor} from './f3-weak-spot.ts';
import {scoreEvents} from './b6-score.ts';
import {stepBladeProjectiles} from './b5-blade-projectiles.ts';
import {applyAbilities} from './b4-abilities.ts';
import {B3_ENABLED} from '../content/items/switches.ts';
import {whirlerArmTouches} from './b2-whirler.ts';
import {classifyHit,grantPerfect,tickQuality,qualityEvent} from './b1-hit-quality.ts';
import {repairClearedWave} from './q3-wave-repair.ts';
import {stepBoss} from './boss-rules.ts';
import {runSchema,spawnEnemy,spawnRunEnemy,initialBoss,type RunState,type Enemy} from './run-schema.ts';
import type {Command} from './schema.ts';
import type {CombatTuning} from '../content/combat.ts';
import {waves,enemyStats} from '../content/encounter.ts';
import {upgradedTuning,upgradeChoices,upgrades} from '../content/upgrades.ts';
import {advanceHero,endDash,bufferDash,bounceDash} from './hero.ts';
import {collide,direction} from './geometry.ts';
const distance=(a:{x:number;z:number},b:{x:number;z:number})=>Math.sqrt((a.x-b.x)**2+(a.z-b.z)**2);
export function stepRun(previous:unknown,command:Command,base:CombatTuning):RunState {
 const s=runSchema.parse(previous),h=s.hero;s.tick++;s.events=[];
 let t=upgradedTuning(difficultyTuning(base,s.rules,s.director.pressure),s.upgrades);if(s.chapter===2)t={...t,bossRadius:t.gulpRadius};
 const event=(kind:RunState['events'][number]['kind'],x:number,z:number,amount=0,radius=0)=>s.events.push({id:`${s.tick}:${s.events.length}`,tick:s.tick,kind,x,z,amount,radius});
 h.prevX=h.x;h.prevZ=h.z;if(s.phase.kind==='boss'){s.phase.boss.prevX=s.phase.boss.x;s.phase.boss.prevZ=s.phase.boss.z;}for(const e of s.enemies){e.prevX=e.x;e.prevZ=e.z;}for(const p of s.projectiles){p.prevX=p.x;p.prevZ=p.z;}
 if(s.phase.kind==='lost'||s.phase.kind==='complete')return s;
 if(s.phase.kind==='level-complete'){if(command.continue||command.choice===0){beginObjectiveWave(s,t,true);h.dashReleaseSuppressed=command.choice===0;h.dashReleaseBuffer=false;}return s;}
 if(s.phase.kind==='upgrade'){
  if(command.upgrade&&s.phase.choices.includes(command.upgrade)){
   const pick=upgrades.find(u=>u.id===command.upgrade);if(!pick)return s;
   s.upgrades.push(pick.id);if(pick.stat==='heroHP')h.hp+=t.upgradeHP;if(pick.stat==='dashCharges')h.charges+=t.upgradeCharges;
   const completion=s.phase.completion;if(F1_ENABLED){if(completion)s.phase={kind:'level-complete',...completion};else beginObjectiveWave(s,t);h.tapWindow=0;h.dashReleaseBuffer=false;h.dashReleaseSuppressed=command.choice===0;h.abilityBuffer=null;h.abilityBufferTicks=0;return s;}
   const wave=s.phase.wave+1,next=waves[wave];s.enemies=next.slice(0,Math.min(t.enemyCap,t.openingThreats)).map((kind,i)=>spawnEnemy(kind,i,wave,t));s.phase={kind:'fight',wave,nextSpawn:Math.min(t.enemyCap,t.openingThreats,next.length),nextSpawnIn:t.spawnMinTicks};
   h.vx=0;h.vz=0;h.boost={kind:'idle'};h.dash={kind:'idle'};h.special={kind:'idle'};h.tapWindow=0;h.dashReleaseBuffer=false;h.dashReleaseSuppressed=command.choice===0;h.buffer=0;h.abilityBuffer=null;h.abilityBufferTicks=0;
  }
  return s;
 }
 if(command.overdrive)h.overdriveBuffer=true;
 if(command.ability){h.abilityBuffer=command.ability;h.abilityBufferTicks=t.inputBufferTicks;}
 if(s.hitstop>0){bufferDash(h,command,t);s.hitstop--;return s;}
 updatePressure(s,t);tickQuality(s.quality);tickCombatStatuses(s);h.hp=Math.min(h.hp,t.heroHP);h.charges=Math.min(h.charges,t.dashCharges);
 const ventFactor=s.chapter===2?bogSlow(s,t):stepVents(s,t),heroTuning={...t,moveSpeed:t.moveSpeed*ventFactor,pulseCooldownTicks:s.loadout==='blade'?t.bladeCooldownTicks:t.pulseCooldownTicks};
 const {ability,damageMultiplier:driveMultiplier,actualSpeed}=advanceHero(h,s.leap?.kind==='air'?{...command,x:0,z:0,dash:false,dashInput:'cancel'}:command,heroTuning,event,true,()=>bank(s,t));
 const damageMultiplier=driveMultiplier*(I8_ENABLED&&h.hp<t.heroHP*t.lastStandThreshold?1+t.lastStandDamageBonus:1);
 const boss=s.phase.kind==='boss'?s.phase.boss:null;
 const stop=(amount:number,heavy=false)=>{s.hitstop=Math.max(s.hitstop,heavy||amount>=14?t.heavyHitstopTicks:amount>=12?t.mediumHitstopTicks:t.hitstopTicks);};
 const bossDamage=(amount:number,heavy=false,source:'bonk'|'dash'|'ability'|'projectile'|'hazard'='bonk')=>{if(!boss||boss.hp<=0)return;if(source==='hazard'){boss.hp=Math.max(0,boss.hp-amount);event('bonk',boss.x,boss.z,amount,t.bossRadius);return;}if((boss.rex||boss.gulp)&&s.loadout==='core')amount*=t.rexCoreDamageFactor;const state=boss.behavior,warning=state.kind.endsWith('-warning'),quality=classifyHit({x:boss.x,z:boss.z,faceX:boss.faceX,faceZ:boss.faceZ,kind:weakSpotFactor(boss,t)>1?'thrower':'grinder',behavior:warning?{kind:'windup',remaining:state.remaining,dx:0,dz:0}:{kind:'chase'}},h,t,s.quality,source);const weak=weakSpotFactor(boss,t);amount=Math.round(amount*quality.factor*weak*10)/10;if(weak>1)qualityEvent(s,'WEAK SPOT',boss.x,boss.z);boss.hp=Math.max(0,boss.hp-amount);event('bonk',boss.x,boss.z,amount,t.bossRadius);s.events[s.events.length-1].scoreFactor=weak*(quality.rear?t.rearDamageFactor:1)*(quality.counter?t.punishDamageFactor:1)*(quality.perfect?t.perfectDamageFactor:1);if(quality.rear)qualityEvent(s,'REAR HIT',boss.x,boss.z);if(quality.counter){qualityEvent(s,'COUNTER',boss.x,boss.z);if(!boss.rex)boss.behavior={kind:'recover',remaining:t.counterStaggerTicks};h.heat=Math.min(t.heatThreshold,h.heat+t.counterHeat);}stop(amount,heavy);};
 let killingAttack:string|undefined;let killedBy:DeathCause='unknown';const hurt=(amount:number,attack='contact',source:DeathCause='unknown')=>{if(h.hp<=0)return;if(s.leap?.kind==='air'){if(amount>0&&grantPerfect(s.quality,h,attack,t))qualityEvent(s,'PERFECT',h.x,h.z);return;}if(h.dash.kind==='active'&&h.dash.protected&&(!CL6_ENABLED||h.special.kind!=='spin')){if(amount>0&&grantPerfect(s.quality,h,attack,t)){qualityEvent(s,'PERFECT',h.x,h.z);refundPerfect(h,t);}return;}h.hp=Math.max(0,h.hp-amount);stop(amount);event('hurt',h.x,h.z,amount);if(h.hp===0){killedBy=recordDeath(source);if(source==='boss')killingAttack=boss?.gulp?gulpNames[boss.gulp.attack]:boss?.rex?rexNames[boss.rex.attack]:undefined;}};
 const damage=(e:Enemy,amount:number,stun=false,heavy=false,source:'bonk'|'dash'|'ability'|'projectile'|'hazard'='bonk')=>{
  if(e.hp<=0||source==='bonk'&&hopperHeight(e)>.6)return;const stats=enemyStats(e.kind,t),quality=classifyHit(e,h,t,s.quality,source);amount*=source==='hazard'?1:quality.factor*(e.variant==='armoured'&&!stun&&e.status.shieldBreak===0?.75:1);
  amount=Math.round(amount*10)/10;e.hp=Math.max(0,e.hp-amount);event('bonk',e.x,e.z,amount,stats.radius);s.events[s.events.length-1].scoreFactor=(quality.rear?t.rearDamageFactor:1)*(quality.punish||quality.counter?t.punishDamageFactor:1)*(quality.perfect?t.perfectDamageFactor:1);stop(amount,heavy);
  if(quality.rear)qualityEvent(s,'REAR HIT',e.x,e.z);if(quality.punish||quality.counter){qualityEvent(s,'COUNTER',e.x,e.z);h.heat=Math.min(t.heatThreshold,h.heat+t.counterHeat);}
  if(e.hp===0){bogDeath(e,s,t);s.hitstop=Math.max(s.hitstop,t.killHitstopTicks);e.behavior={kind:'defeated'};h.heat=Math.min(t.heatThreshold,h.heat+stats.heat);event('defeat',e.x,e.z);s.events[s.events.length-1].scoreValue=e.kind==='skipper'?t.scoreSkipper:e.kind==='croaker'?t.scoreCroaker:e.kind==='bogbulb'?t.scoreBogbulb:e.kind==='lasher'?t.scoreLasher:e.kind==='toad'?t.scoreToad:e.kind==='sawlet'?t.scoreSawlet:e.kind==='thrower'?t.scoreThrower:e.kind==='shieldsaw'?t.scoreShield:e.kind==='whirler'?t.scoreWhirler:t.scoreGrinder;}
  else if(stun||quality.counter){e.behavior={kind:'recover',remaining:stun?t.stompStunTicks+1:t.counterStaggerTicks,punish:isHopper(e.kind)?t.hopperRecoveryTicks:0};if(e.hopper){e.hopper.action='retreat';e.hopper.elapsed=0;}}
 };
 if(s.chapter!==2)directorHazards(s,t,(amount,id)=>hurt(amount,id,'hazard'),event);if(s.chapter!==2)stepExtrasWorld(s,t,event,(amount,id)=>hurt(amount,id,'hazard'),(e,amount)=>damage(e,amount,false,true,'hazard'),amount=>bossDamage(amount,true,'hazard'));
 if(s.chapter===2)stepBogWorld(s,t,(amount,id)=>hurt(amount,id,'hazard'),event);
 if(ability==='stomp'&&s.legs==='frog-legs')startFrogLeap(s,t,event);else applyAbilities(s,t,ability,damageMultiplier,damage,bossDamage,event);
 const landing=stepFrogLeap(s,command,t,event);if(landing){clearBog(s,landing.x,landing.z,landing.radius);for(const e of s.enemies)if(e.hp>0&&distance(h,e)<=landing.radius+enemyStats(e.kind,t).radius){damage(e,landing.damage*damageMultiplier,true,true,'ability');e.status.stunned=t.frogStunTicks;}if(boss&&distance(h,boss)<=landing.radius+t.bossRadius){bossDamage(landing.damage*damageMultiplier,true,'ability');boss.status.stunned=t.frogStunTicks;boss.exposed=Math.max(boss.exposed,60);if(boss.gulp){boss.gulp.mode='recovery';boss.gulp.remaining=60;boss.gulp.elapsed=0;}if(boss.rex){boss.rex.mode='recovery';boss.rex.remaining=60;boss.rex.elapsed=0;}}}
 if(s.chapter===2&&s.events.some(e=>e.kind==='stomp'))clearBog(s,h.x,h.z,t.stompRadius);stepBladeProjectiles(s,t,ability,event,damage,bossDamage);
 // Swept path damage for Rush/Charge: one hit per target for this dash, including the boss.
 if(h.dash.kind==='active'&&h.dash.variant!=='tap'){
  const dash=h.dash,near=(x:number,z:number,r:number)=>{const vx=h.x-h.prevX,vz=h.z-h.prevZ,den=vx*vx+vz*vz,u=den?Math.max(0,Math.min(1,((x-h.prevX)*vx+(z-h.prevZ)*vz)/den)):0;return Math.sqrt((x-h.prevX-u*vx)**2+(z-h.prevZ-u*vz)**2)<=r+t.heroRadius;};
  const amount=t.bonkDamage*(1+t.bonkSpeedBonus)*(dash.variant==='rush'?t.rushDamageFactor:1)*damageMultiplier*(s.extras.ricochet>0?t.ricochetDamageFactor:1);
  for(const e of s.enemies)if(e.hp>0&&!dash.hits.includes(e.id)&&near(e.x,e.z,enemyStats(e.kind,t).radius)){damage(e,amount,false,false,'dash');dash.hits.push(e.id);const away=direction(e.x-h.x,e.z-h.z),p=collide(e.x+away.x*t.dashBounceKnockback,e.z+away.z*t.dashBounceKnockback,enemyStats(e.kind,t).radius,t);bounceDash(h,-away.x,-away.z);e.x=p.x;e.z=p.z;}
  if(boss&&boss.hp>0&&!dash.hits.includes(-1)&&near(boss.x,boss.z,t.bossRadius)){bossDamage(amount,false,'dash');dash.hits.push(-1);bounceDash(h,h.x-boss.x,h.z-boss.z);}
 }
 if(boss&&boss.hp>0)stepBoss(boss,s,t,(amount,attack)=>hurt(amount,attack??`boss:${boss.sequence}`,'boss'),event);

 const engaged=new Set(s.enemies.filter(e=>e.hp>0&&(e.behavior.kind==='windup'||e.behavior.kind==='lunge')).map(e=>e.id));for(const p of s.projectiles)engaged.add(p.owner);let attackers=engaged.size+(boss&&boss.hp>0&&(boss.gulp?boss.gulp.mode!=='recovery':boss.behavior.kind!=='recover')?1:0);
 const compactEncounter=s.rules.difficulty==='normal'&&s.phase.kind==='fight';const rally=s.phase.kind==='fight'&&s.enemies.filter(e=>e.hp>0).length<=t.rallyRemaining;
 for(const e of s.enemies){
  if(e.hp<=0)continue;const stats=enemyStats(e.kind,t);if(compactEncounter&&e.kind==='thrower')stats.range=Math.min(stats.range,t.engagementRangedDistance);if(e.variant==='fast'){stats.speed*=1.3;stats.recovery=Math.max(12,Math.round(stats.recovery*.85));}const d=direction(h.x-e.x,h.z-e.z),dist=distance(h,e);
  if(isHopper(e.kind)){const before=e.behavior.kind==='windup'||e.behavior.kind==='lunge';stepHopper(e,s,t,attackers<t.attackerCap||before,(amount,id,kind)=>hurt(amount,id,kind),event);const after=e.behavior.kind==='windup'||e.behavior.kind==='lunge';attackers+=Number(after)-Number(before);continue;}
  switch(e.behavior.kind){
   case'spawn':if(--e.behavior.remaining<=0)e.behavior={kind:'chase'};break;
   case'chase':{
    e.faceX=d.x;e.faceZ=d.z;
    if(dist<=stats.range&&!engaged.has(e.id)&&attackers<t.attackerCap&&s.projectiles.length<24){e.attackSerial++;e.behavior={kind:'windup',remaining:stats.windup,dx:d.x,dz:d.z};attackers++;engaged.add(e.id);}
    else{
     const sign=rally?(dist>t.bonkRange*.8?1:0):e.kind==='thrower'&&dist<(!compactEncounter?t.throwerNear:Math.min(t.throwerNear,stats.range-1.4))?-1:dist>stats.range?1:0;
     const pursuit=compactEncounter&&dist>t.engagementCatchupDistance?Math.max(stats.speed,t.engagementCatchupSpeed):stats.speed;const p=collide(e.x+d.x*pursuit*(rally?1+t.rallySpeedBonus:1)/60*sign,e.z+d.z*pursuit*(rally?1+t.rallySpeedBonus:1)/60*sign,stats.radius,t);e.x=p.x;e.z=p.z;
    }break;
   }
   case'windup':{
    const b=e.behavior;if(b.remaining>1){b.remaining--;break;}
    if(e.kind==='thrower'){
     s.projectiles.push({id:s.nextProjectile++,owner:e.id,x:e.x,z:e.z,prevX:e.x,prevZ:e.z,dx:b.dx,dz:b.dz,remaining:t.rivetLifeTicks});e.behavior={kind:'recover',remaining:stats.recovery,rallyEligible:true};
    }else if(e.kind==='grinder'){
     if(distance(h,e)<=t.grinderSweepRadius+t.heroRadius)hurt(t.grinderDamage*(e.variant==='double-blade'?1.2:1),`enemy:${e.id}:${e.attackSerial}`,e.kind);event('stomp',e.x,e.z,0,t.grinderSweepRadius);e.behavior={kind:'recover',remaining:stats.recovery,rallyEligible:true,punish:t.punishTicks};attackers--;
    }else e.behavior={kind:'lunge',remaining:e.kind==='shieldsaw'?t.shieldChargeTicks:e.kind==='whirler'?t.whirlerSweepTicks:t.lungeTicks,dx:b.dx,dz:b.dz,hasHit:false};
    break;
   }
   case'lunge':{
    const b=e.behavior;if(e.kind==='whirler'){if(!b.hasHit&&whirlerArmTouches(e,h,s.tick,t)){const hp=h.hp;hurt(t.whirlerDamage*(e.variant==='double-blade'?1.2:1),`enemy:${e.id}:${e.attackSerial}`,e.kind);if(h.hp<hp)b.hasHit=true;}if(b.remaining===1&&!b.hasHit&&!whirlerArmTouches(e,h,s.tick,t)&&whirlerArmTouches(e,h,s.tick,{...t,heroRadius:t.heroRadius+t.grazeMargin}))graze(s,`enemy:${e.id}:${e.attackSerial}`,h.x,h.z,t);if(--b.remaining<=0){e.behavior={kind:'recover',remaining:t.whirlerRecoveryTicks,rallyEligible:true,punish:t.punishTicks};attackers--;}break;}const speed=e.kind==='shieldsaw'?t.shieldChargeSpeed:t.lungeSpeed,p=collide(e.x+b.dx*speed/60,e.z+b.dz*speed/60,stats.radius,t);e.x=p.x;e.z=p.z;
    if(!b.hasHit&&distance(h,e)<t.heroRadius+stats.radius){const hp=h.hp;hurt((e.kind==='shieldsaw'?t.rivetDamage:t.contactDamage)*(e.variant==='double-blade'?1.2:1),`enemy:${e.id}:${e.attackSerial}`,e.kind);if(h.hp<hp)b.hasHit=true;}
    if(b.remaining===1&&!b.hasHit&&distance(h,e)<t.heroRadius+stats.radius+t.grazeMargin&&distance(h,e)>=t.heroRadius+stats.radius)graze(s,`enemy:${e.id}:${e.attackSerial}`,h.x,h.z,t);if(--b.remaining<=0){e.behavior={kind:'recover',remaining:stats.recovery,rallyEligible:true,punish:e.kind==='shieldsaw'?t.punishTicks:0};attackers--;}break;
   }
   case'recover':if(compactEncounter&&e.behavior.rallyEligible&&dist>t.engagementCatchupDistance&&!(e.behavior.punish??0)&&e.behavior.remaining<=Math.max(1,stats.recovery-24)){e.behavior={kind:'chase'};break;}if((e.behavior.punish??0)>0)e.behavior.punish!--;if(rally&&e.behavior.rallyEligible&&!(e.behavior.punish??0)){e.behavior={kind:'chase'};break;}if(e.behavior.remaining>1)e.behavior.remaining--;else e.behavior={kind:'chase'};break;
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
  if(distance(h,near)<t.heroRadius+t.rivetRadius){if(B3_ENABLED)event('floor-scar',near.x,near.z,0,.4);hurt(t.rivetDamage,`projectile:${p.id}`,'thrower');continue;}
  if((h.x-p.x)*p.dx+(h.z-p.z)*p.dz<0&&distance(h,near)<t.heroRadius+t.rivetRadius+t.grazeMargin)graze(s,`projectile:${p.id}`,near.x,near.z,t);
  if(p.remaining>0&&Math.abs(pos.x-x)<.001&&Math.abs(pos.z-z)<.001)projectiles.push(p);else if(B3_ENABLED)event('floor-scar',pos.x,pos.z,0,.4);
 }s.projectiles=projectiles;
 if(h.hp>0&&h.bonkCooldown===0&&!(h.dash.kind==='active'&&h.dash.variant!=='tap')){
  const target=s.enemies.filter(e=>e.hp>0&&distance(h,e)<t.bonkRange).sort((a,b)=>distance(h,a)-distance(h,b)||a.id-b.id)[0];
  if(boss&&boss.hp>0&&distance(h,boss)<t.bonkRange+t.bossRadius&&(!target||distance(h,boss)-t.bossRadius<distance(h,target))){const factor=Math.min(1,actualSpeed/(t.dashDistance*60/t.dashTicks));bossDamage(t.bonkDamage*(1+t.bonkSpeedBonus*factor)*damageMultiplier);h.bonkCooldown=t.bonkCooldownTicks;}
  else if(target){const factor=Math.min(1,actualSpeed/(t.dashDistance*60/t.dashTicks));damage(target,t.bonkDamage*(1+t.bonkSpeedBonus*factor)*damageMultiplier);h.bonkCooldown=t.bonkCooldownTicks;const away=direction(target.x-h.x,target.z-h.z),p=collide(target.x+away.x*t.knockback,target.z+away.z*t.knockback,enemyStats(target.kind,t).radius,t);target.x=p.x;target.z=p.z;}
 }
 finishExtras(s,t,event);endDash(h);scoreEvents(s,t);s.objective.bestStyle=Math.max(s.objective.bestStyle,styleRank(s.extras.style));
 if(h.hp<=0){h.boost={kind:'idle'};h.dash={kind:'idle'};h.special={kind:'idle'};h.slam={kind:'idle'};h.vx=h.vz=0;s.phase={kind:'lost',cause:killedBy,...(killingAttack?{attack:killingAttack}:{})};return s;}
 if(boss&&boss.hp===0){h.boost={kind:'idle'};h.dash={kind:'idle'};h.special={kind:'idle'};h.slam={kind:'idle'};h.vx=h.vz=0;event('defeat',boss.x,boss.z);s.events[s.events.length-1].scoreValue=t.scoreBoss*([...s.events].reverse().find(e=>e.kind==='bonk'&&(e.x-boss.x)**2+(e.z-boss.z)**2<.16)?.scoreFactor??1);const before=s.events;s.events=[s.events[s.events.length-1]];scoreEvents(s,t);s.events=before;s.phase={kind:'complete',reward:s.chapter===2?'frog-legs':'blade'};s.enemies=[];s.projectiles=[];s.bladeProjectiles=[];return s;}
 if(s.phase.kind!=='fight')return s;
 // Spawn queue never exceeds the approved live cap. Dead entries are retired when replenishing.
 const alive=s.enemies.filter(e=>e.hp>0);const formation=activeFormation(s,t);s.phase.nextSpawn=Math.min(s.phase.nextSpawn,formation.length);
 const spawnMax=alive.length<5?Math.min(t.spawnMaxTicks,t.sparseSpawnMaxTicks):t.spawnMaxTicks;s.phase.nextSpawnIn=Math.min(s.phase.nextSpawnIn,spawnMax);
 if(s.phase.nextSpawnIn>0)s.phase.nextSpawnIn--;
 if(s.phase.nextSpawn<formation.length&&alive.length<t.enemyCap&&s.phase.nextSpawnIn===0){
  const i=s.phase.nextSpawn++;s.enemies=alive;s.enemies.push(spawnRunEnemy(formation[i],i,F1_ENABLED?s.objective.waveSerial:s.phase.wave,t,s.rules,s.extras.seed,s.objective.level,s.hero));
  // Stable cadence, saved in snapshots. No host clock or unseeded RNG in the simulation.
  s.phase.nextSpawnIn=t.spawnMinTicks+(i*17+s.phase.wave*11)%Math.max(1,spawnMax-t.spawnMinTicks+1);
 }
 if(s.enemies.every(e=>e.hp<=0)&&s.phase.nextSpawn===formation.length){
  s.projectiles=[];s.bladeProjectiles=[];h.vx=0;h.vz=0;h.dash={kind:'idle'};const completion=levelCompletion(s,t,h.hp),healed=repairClearedWave(h,t.heroHP,t.waveRepairFraction);if(healed>0)event('repair',h.x,h.z,healed,2.5);
  s.phase=F1_ENABLED?{kind:'upgrade',wave:s.phase.wave,choices:upgradeChoices(s.objective.waveSerial,s.upgrades),completion}:s.phase.wave===waves.length-1?{kind:'boss',boss:initialBoss(t)}:{kind:'upgrade',wave:s.phase.wave,choices:upgradeChoices(s.phase.wave,s.upgrades)};
 }
 return s;
}
