import {z} from 'zod';
import {CL6_ENABLED} from '../content/items/cl-combat.ts';
import {B1_ENABLED} from '../content/items/switches.ts';
import type {Hero,FightEvent} from './schema.ts';
import type {Enemy} from './run-schema.ts';
import type {CombatTuning} from '../content/combat.ts';
import {direction} from './geometry.ts';
const ticks=z.number().int().nonnegative();
export const qualitySchema=z.object({buff:z.discriminatedUnion('kind',[z.object({kind:z.literal('idle')}),z.object({kind:z.literal('charged'),remaining:ticks})]).default({kind:'idle'}),dodged:z.array(z.string()).max(64).default([]),perfectDodges:ticks.default(0),rearHits:ticks.default(0),counters:ticks.default(0)}).default({buff:{kind:'idle'},dodged:[],perfectDodges:0,rearHits:0,counters:0});
export type Quality=z.infer<typeof qualitySchema>;
export function tickQuality(q:Quality){if(q.buff.kind==='charged'){if(q.buff.remaining>1)q.buff.remaining--;else q.buff={kind:'idle'};}}
export function classifyHit(e:Pick<Enemy,'x'|'z'|'faceX'|'faceZ'|'kind'|'behavior'>&{status?:Enemy['status']},h:Hero,t:CombatTuning,q:Quality,source:'bonk'|'dash'|'ability'|'projectile'='bonk',enabled=B1_ENABLED){
 const d=direction(h.x-e.x,h.z-e.z),dot=d.x*e.faceX+d.z*e.faceZ,rear=dot<=t.rearDot,armoured=e.kind==='shieldsaw'&&!(CL6_ENABLED&&(e.status?.shieldBreak??0)>0)||e.kind==='grinder',punish=e.behavior.kind==='recover'&&(e.behavior.punish??0)>0,counter=source==='bonk'&&e.behavior.kind==='windup'&&e.behavior.remaining<=t.counterWindowTicks;
 if(!enabled)return{factor:e.kind==='shieldsaw'&&dot>=t.shieldFrontDot?t.shieldDamageFactor:1,rear:false,punish:false,counter:false,perfect:false};
 let factor=rear?t.rearDamageFactor:armoured&&dot>=t.shieldFrontDot?(e.kind==='shieldsaw'?t.shieldDamageFactor:t.armourFrontFactor):1;if(punish)factor*=t.punishDamageFactor;const perfect=q.buff.kind==='charged';if(perfect){factor*=t.perfectDamageFactor;q.buff={kind:'idle'};}if(rear)q.rearHits++;if(punish||counter)q.counters++;return{factor,rear,punish,counter,perfect};
}
export function grantPerfect(q:Quality,h:Hero,attack:string,t:CombatTuning,enabled=B1_ENABLED){if(!enabled||q.dodged.includes(attack))return false;q.dodged.push(attack);if(q.dodged.length>64)q.dodged.shift();q.perfectDodges++;q.buff={kind:'charged',remaining:t.perfectBuffTicks};h.heat=Math.min(t.heatThreshold,h.heat+t.perfectHeat);return true;}
export function qualityEvent(s:{tick:number;events:FightEvent[]},label:NonNullable<FightEvent['label']>,x:number,z:number){s.events.push({id:`${s.tick}:${s.events.length}`,tick:s.tick,kind:'quality',label,x,z,amount:0});}
