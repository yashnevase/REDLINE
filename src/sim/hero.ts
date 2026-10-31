import type {Hero,Command,FightEvent} from './schema.ts';
import type {CombatTuning} from '../content/combat.ts';
import {collide,direction} from './geometry.ts';
export type Emit=(kind:FightEvent['kind'],x:number,z:number,amount?:number,radius?:number)=>void;
// Shared movement/cooldown owner for both the regression trial and the encounter.
export function advanceHero(h:Hero,command:Command,t:CombatTuning,event:Emit){
 for(const key of ['pulseCooldown','boostCooldown','stompCooldown'] as const)if(h[key]>0)h[key]--;
 if(h.dashCooldown>0)h.dashCooldown--;if(h.tapWindow>0)h.tapWindow--;if(h.special.kind==='spin'&&h.special.hopRemaining>0)h.special.hopRemaining--;if(h.special.kind!=='idle'&&--h.special.remaining<=0)h.special=h.special.kind==='spin'&&h.special.hopRemaining>0?{kind:'hop',remaining:h.special.hopRemaining}:{kind:'idle'};
 if(h.overdrive>0)h.overdrive--;if(h.iframeLock>0)h.iframeLock--;
 const requestedOverdrive=command.overdrive||h.overdriveBuffer;h.overdriveBuffer=false;
 if(requestedOverdrive&&h.heat>=t.heatThreshold&&h.overdrive===0){h.heat=0;h.overdrive=t.overdriveTicks;event('overdrive',h.x,h.z);}
 const damageMultiplier=h.overdrive>0?1+t.overdriveDamageBonus:1;
 if(command.dash)h.buffer=t.inputBufferTicks;
 if(h.bonkCooldown>0)h.bonkCooldown--;
 if(h.charges<t.dashCharges){h.recharge++;if(h.recharge>=t.rechargeTicks){h.charges++;h.recharge=0;}}
 const rawX=Number.isFinite(command.x)?command.x:0,rawZ=Number.isFinite(command.z)?command.z:0;
 const length=Math.sqrt(rawX*rawX+rawZ*rawZ),strength=Math.min(1,length),dir=direction(rawX,rawZ);
 if(length>.05){h.faceX=dir.x;h.faceZ=dir.z;}
 const released=command.dashInput==='release'||h.dashReleaseBuffer;h.dashReleaseBuffer=false;
 if(command.dashInput==='press')h.dashReleaseSuppressed=false;
 if(command.dashInput==='press'&&h.dash.kind!=='charging'&&(h.dashCooldown===0||h.tapWindow>0))h.dash={kind:'charging',ticks:0};
 if(h.dash.kind==='charging')h.dash.ticks++;
 if(command.ability||h.abilityBuffer||command.dashInput==='cancel'){if(h.dash.kind==='charging'){h.dash={kind:'idle'};h.dashReleaseSuppressed=true;}}
 let variant:'tap'|'rush'|'charge'|undefined,charge=0;
 if(released&&h.dashReleaseSuppressed)h.dashReleaseSuppressed=false;else if(released&&!command.ability){if(h.dash.kind==='charging'){charge=h.dash.ticks;variant=charge>=t.dashHoldTicks?'charge':h.tapWindow>0?'rush':'tap';h.dash={kind:'idle'};}else if(h.tapWindow>0)variant='rush';else if(h.dashCooldown===0)variant='tap';}
 if(h.buffer>0&&h.dash.kind==='idle')variant='tap';
 if(variant&&(h.dashCooldown===0||variant==='rush'&&h.tapWindow>0)&&(h.charges>0||h.overdrive>0||variant==='rush'&&h.tapWindow>0)){
  const d=length>.05?dir:direction(h.faceX,h.faceZ),duration=variant==='tap'?t.dashTicks:variant==='rush'?t.rushTicks:t.chargeDashTicks;
  const distance=variant==='tap'?t.dashDistance:variant==='rush'?t.rushDistance:t.dashDistance+(t.chargeMaxDistance-t.dashDistance)*Math.min(1,Math.max(0,(charge-t.dashHoldTicks)/(Math.max(1,t.dashChargeTicks-t.dashHoldTicks))));
  h.dash={kind:'active',remaining:duration,dx:d.x,dz:d.z,protected:h.overdrive===0||h.iframeLock===0,protectionTicks:t.dashTicks,variant,distance,duration,hits:[]};
  if(h.overdrive>0){if(h.iframeLock===0)h.iframeLock=t.overdriveIframeIntervalTicks;}else if(variant!=='rush')h.charges--;
  h.dashCooldown=duration+(variant==='charge'?t.chargeCooldownTicks:Math.round(t.dashSharedCooldownTicks*(h.overdrive>0?.5:1)));h.tapWindow=variant==='tap'?t.dashDoubleTapTicks:0;h.buffer=0;event('dash',h.x,h.z,variant==='rush'?1:variant==='charge'?2:0,distance);
 }
 if(h.buffer>0)h.buffer--;
 if(h.dash.kind==='active'){h.vx=h.dash.dx*h.dash.distance*60/h.dash.duration;h.vz=h.dash.dz*h.dash.distance*60/h.dash.duration;}
 else{const boost=h.overdrive>0?1+t.overdriveMoveBonus:1,targetX=dir.x*t.moveSpeed*strength*boost,targetZ=dir.z*t.moveSpeed*strength*boost,amount=(length>.05?t.acceleration:t.braking)/60;h.vx+=Math.max(-amount,Math.min(amount,targetX-h.vx));h.vz+=Math.max(-amount,Math.min(amount,targetZ-h.vz));}
 const steps=Math.max(1,Math.ceil(Math.sqrt(h.vx*h.vx+h.vz*h.vz)/60/(t.heroRadius*.5)));for(let i=0;i<steps;i++){const p=collide(h.x+h.vx/60/steps,h.z+h.vz/60/steps,t.heroRadius,t);h.x=p.x;h.z=p.z;}
 let ability:Command['ability'];
 if(h.abilityBuffer&&h.abilityBufferTicks>0){
  const candidate=h.abilityBuffer,key=candidate==='pulse'?'pulseCooldown':candidate==='boost'?'boostCooldown':'stompCooldown';
  if(h[key]===0){
   ability=candidate;h[key]=ability==='pulse'?t.pulseCooldownTicks:ability==='boost'?t.boostCooldownTicks:t.stompCooldownTicks;
   if(ability==='boost'){
    const d=direction(h.faceX,h.faceZ),steps=Math.ceil(t.boostDistance/(t.heroRadius*.5));
    for(let i=0;i<steps;i++){const pos=collide(h.x+d.x*t.boostDistance/steps,h.z+d.z*t.boostDistance/steps,t.heroRadius,t);h.x=pos.x;h.z=pos.z;}
   }
   event(ability,h.x,h.z,0,ability==='pulse'?t.pulseRadius:ability==='stomp'?t.stompRadius:0);h.abilityBuffer=null;h.abilityBufferTicks=0;
  }else{h.abilityBufferTicks--;if(h.abilityBufferTicks===0)h.abilityBuffer=null;}
 }
 const actualSpeed=Math.sqrt((h.x-h.prevX)**2+(h.z-h.prevZ)**2)*60;
 return{ability,damageMultiplier,actualSpeed};
}
export function endDash(h:Hero){if(h.dash.kind==='active'){h.dash.remaining--;h.dash.protectionTicks=Math.max(0,h.dash.protectionTicks-1);if(h.dash.protectionTicks===0)h.dash.protected=false;if(h.dash.remaining<=0)h.dash={kind:'idle'};}}

export function bufferDash(h:Hero,command:Command,t:CombatTuning){if(command.dash)h.buffer=t.inputBufferTicks;if(command.dashInput==='press')h.dashReleaseSuppressed=false;
 if(command.dashInput==='press'&&h.dash.kind==='idle')h.dash={kind:'charging',ticks:0};if(command.dashInput==='release')h.dashReleaseBuffer=true;if(command.dashInput==='cancel'&&h.dash.kind==='charging')h.dash={kind:'idle'};}
