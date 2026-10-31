import {z} from 'zod';
import {Descriptor,Schema} from '@typeonce/ritmo';
import {tuningSchema,type CombatTuning} from '../content/combat.ts';
const n=z.number().finite(), ticks=z.number().int().nonnegative();
const point={x:n,z:n,prevX:n,prevZ:n};
export const dashSchema=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('idle')}),z.object({kind:z.literal('charging'),ticks:ticks}),z.object({kind:z.literal('active'),remaining:ticks,dx:n,dz:n,protected:z.boolean().default(true),protectionTicks:ticks.default(12),variant:z.enum(['tap','rush','charge']).default('tap'),distance:n.positive().default(4),duration:ticks.positive().default(12),hits:z.array(n.int()).default([])})
]);
export const behavior=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('spawn'),remaining:ticks}),z.object({kind:z.literal('chase')}),z.object({kind:z.literal('windup'),remaining:ticks,dx:n,dz:n}),
 z.object({kind:z.literal('lunge'),remaining:ticks,dx:n,dz:n,hasHit:z.boolean()}),
 z.object({kind:z.literal('recover'),remaining:ticks,rallyEligible:z.literal(true).optional()}),z.object({kind:z.literal('defeated')})
]);
export const eventSchema=z.object({id:z.string(),tick:ticks,kind:z.enum(['dash','bonk','hurt','defeat','pulse','boost','stomp','overdrive','blade']),x:n,z:n,amount:n,radius:n.nonnegative().optional(),dx:n.optional(),dz:n.optional()});
export const heroSchema=z.object({...point,momentum:z.discriminatedUnion('kind',[z.object({kind:z.literal('idle')}),z.object({kind:z.literal('rolling'),ticks:ticks,dx:n,dz:n})]).default({kind:'idle'}),hp:n.nonnegative(),vx:n,vz:n,faceX:n,faceZ:n,charges:ticks,recharge:ticks,buffer:ticks,heat:n.nonnegative().default(0),overdrive:ticks.default(0),overdriveBuffer:z.boolean().default(false),iframeLock:ticks.default(0),bonkCooldown:ticks,pulseCooldown:ticks.default(0),boostCooldown:ticks.default(0),stompCooldown:ticks.default(0),abilityBuffer:z.enum(['pulse','boost','stomp']).nullable().default(null),abilityBufferTicks:ticks.default(0),dash:dashSchema,dashCooldown:ticks.default(0),tapWindow:ticks.default(0),dashReleaseBuffer:z.boolean().default(false),dashReleaseSuppressed:z.boolean().default(false),special:z.discriminatedUnion('kind',[z.object({kind:z.literal('idle')}),z.object({kind:z.literal('spin'),remaining:ticks,hits:z.array(n.int()),hopRemaining:ticks.default(0)}),z.object({kind:z.literal('hop'),remaining:ticks})]).default({kind:'idle'})});
export type Hero=z.infer<typeof heroSchema>;
export const stateSchema=z.object({
 tick:ticks,hitstop:ticks,
 hero:heroSchema,
 enemy:z.object({...point,hp:n.nonnegative(),behavior}),events:z.array(eventSchema)
});
export type FightState=z.infer<typeof stateSchema>;
export type FightEvent=z.infer<typeof eventSchema>;
export type Command={x:number;z:number;dash:boolean;dashInput?:'press'|'release'|'cancel';overdrive?:boolean;ability?:'pulse'|'boost'|'stomp';tuning?:CombatTuning;upgrade?:string;choice?:number};
export const idleCommand:Command={x:0,z:0,dash:false};
export const State=Descriptor.ConstructedResource(stateSchema)('Redline/Fight');
export const Input=Descriptor.Service<{read():Command}>()('Redline/Input');
export const Tuning=Descriptor.ConstructedResource(tuningSchema)('Redline/Tuning');
export const Game=Schema.bind(Schema.fragment({resources:{State,Tuning}}));
export function initialState(t:CombatTuning):FightState {
 return {tick:0,hitstop:0,hero:{momentum:{kind:'idle'},x:-1.1,z:.7,prevX:-1.1,prevZ:.7,hp:t.heroHP,vx:0,vz:0,faceX:.7,faceZ:.7,charges:t.dashCharges,recharge:0,buffer:0,heat:0,overdrive:0,overdriveBuffer:false,iframeLock:0,bonkCooldown:0,pulseCooldown:0,boostCooldown:0,stompCooldown:0,abilityBuffer:null,abilityBufferTicks:0,dash:{kind:'idle'},dashCooldown:0,tapWindow:0,dashReleaseBuffer:false,dashReleaseSuppressed:false,special:{kind:'idle'}},enemy:{x:t.sawletSpawnX,z:t.sawletSpawnZ,prevX:t.sawletSpawnX,prevZ:t.sawletSpawnZ,hp:t.sawletHP,behavior:{kind:'chase'}},events:[]};
}
