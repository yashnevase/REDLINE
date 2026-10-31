import {collide,direction} from './geometry.ts';
export {collide,direction} from './geometry.ts';
import {advanceHero,endDash,bufferDash} from './hero.ts';
import {stateSchema,type FightState,type Command} from './schema.ts';
import {type CombatTuning} from '../content/combat.ts';
export function stepFight(previous:unknown,command:Command,t:CombatTuning):FightState {
 const s=stateSchema.parse(previous),h=s.hero,e=s.enemy;s.tick++;s.events=[];h.charges=Math.min(h.charges,t.dashCharges);h.hp=Math.min(h.hp,t.heroHP);e.hp=Math.min(e.hp,t.sawletHP);
 h.prevX=h.x;h.prevZ=h.z;e.prevX=e.x;e.prevZ=e.z;
 const event=(kind:FightState['events'][number]['kind'],x:number,z:number,amount=0,radius=0)=>s.events.push({id:`${s.tick}:${s.events.length}`,tick:s.tick,kind,x,z,amount,radius});
 if(command.ability&&h.hp>0&&e.hp>0){h.abilityBuffer=command.ability;h.abilityBufferTicks=t.inputBufferTicks;}
 if(command.overdrive&&h.hp>0&&e.hp>0)h.overdriveBuffer=true;
 if(s.hitstop>0){if(h.hp>0&&e.hp>0)bufferDash(h,command,t);s.hitstop--;return s;}
 if(h.hp<=0||e.behavior.kind==='defeated')return s;
 const {ability,damageMultiplier,actualSpeed}=advanceHero(h,command,t,event);
 if(ability&&ability!=='boost'&&Math.sqrt((h.x-e.x)**2+(h.z-e.z)**2)<=(ability==='pulse'?t.pulseRadius:t.stompRadius)+t.sawletRadius){
  const amount=(ability==='pulse'?t.pulseDamage:t.stompDamage)*damageMultiplier;e.hp=Math.max(0,e.hp-amount);event('bonk',e.x,e.z,amount);s.hitstop=t.hitstopTicks;
  if(e.hp===0){e.behavior={kind:'defeated'};h.heat=Math.min(t.heatThreshold,h.heat+t.heatPerSawlet);event('defeat',e.x,e.z);}
  else if(ability==='stomp')e.behavior={kind:'recover',remaining:t.stompStunTicks+1};
 }
 if(e.behavior.kind==='defeated'){endDash(h);return s;}
 let dist=Math.sqrt((h.x-e.x)*(h.x-e.x)+(h.z-e.z)*(h.z-e.z));
 const towards=direction(h.x-e.x,h.z-e.z);
 switch(e.behavior.kind){
  case'chase':if(dist<t.attackRange)e.behavior={kind:'windup',remaining:t.windupTicks,dx:towards.x,dz:towards.z};else{const p=collide(e.x+towards.x*t.sawletSpeed/60,e.z+towards.z*t.sawletSpeed/60,t.sawletRadius,t);e.x=p.x;e.z=p.z;}break;
  case'windup':{const b=e.behavior;if(b.remaining>1)b.remaining--;else e.behavior={kind:'lunge',remaining:t.lungeTicks,dx:b.dx,dz:b.dz,hasHit:false};break;}
  case'lunge':{const b=e.behavior;const p=collide(e.x+b.dx*t.lungeSpeed/60,e.z+b.dz*t.lungeSpeed/60,t.sawletRadius,t);e.x=p.x;e.z=p.z;b.remaining--;break;}
  case'recover':if(e.behavior.remaining>1)e.behavior.remaining--;else e.behavior={kind:'chase'};break;
 }
 dist=Math.sqrt((h.x-e.x)*(h.x-e.x)+(h.z-e.z)*(h.z-e.z));
 // Resolve the actual attack first; a hit in this tick is not erased by an automatic bonk.
 if(e.behavior.kind==='lunge'&&!e.behavior.hasHit&&dist<t.heroRadius+t.sawletRadius){
  if(h.dash.kind!=='active'||!h.dash.protected){h.hp=Math.max(0,h.hp-t.contactDamage);e.behavior.hasHit=true;s.hitstop=t.hitstopTicks;event('hurt',h.x,h.z,t.contactDamage);}
 }
 if(h.hp>0&&dist<t.bonkRange&&h.bonkCooldown===0){
  const speedFactor=Math.min(1,actualSpeed/(t.dashDistance*60/t.dashTicks));const amount=Math.round(t.bonkDamage*(1+t.bonkSpeedBonus*speedFactor)*damageMultiplier*10)/10;
  e.hp=Math.max(0,e.hp-amount);h.bonkCooldown=t.bonkCooldownTicks;s.hitstop=t.hitstopTicks;event('bonk',e.x,e.z,amount);
  const away=direction(e.x-h.x,e.z-h.z);const p=collide(e.x+away.x*t.knockback,e.z+away.z*t.knockback,t.sawletRadius,t);e.x=p.x;e.z=p.z;
  if(e.hp===0){e.behavior={kind:'defeated'};h.heat=Math.min(t.heatThreshold,h.heat+t.heatPerSawlet);event('defeat',e.x,e.z);}
 }
 if(e.behavior.kind==='lunge'&&e.behavior.remaining<=0)e.behavior={kind:'recover',remaining:t.recoveryTicks};
 // All twelve dash ticks protect, including the tick on which the dash ends.
 endDash(h);
 return s;
}
