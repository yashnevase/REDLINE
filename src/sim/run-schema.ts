import {z} from 'zod';
import {Descriptor,Schema} from '@typeonce/ritmo';
import {heroSchema,behavior,eventSchema,initialState,Input,Tuning} from './schema.ts';
import {enemyKinds,waves,enemyStats} from '../content/encounter.ts';
import type {CombatTuning} from '../content/combat.ts';
import {collide} from './geometry.ts';
const n=z.number().finite(),ticks=z.number().int().nonnegative();
export const enemySchema=z.object({id:ticks,kind:z.enum(enemyKinds),x:n,z:n,prevX:n,prevZ:n,hp:n.nonnegative(),faceX:n,faceZ:n,behavior});
const target=z.object({x:n,z:n});
export const bossSchema=z.object({x:n,z:n,prevX:n,prevZ:n,hp:n.nonnegative(),sequence:ticks,faceX:n,faceZ:n,behavior:z.discriminatedUnion('kind',[
 z.object({kind:z.literal('recover'),remaining:ticks}),
 z.object({kind:z.literal('chomp-warning'),remaining:ticks,dx:n,dz:n}),
 z.object({kind:z.literal('charge'),remaining:ticks,dx:n,dz:n,hasHit:z.boolean()}),
 z.object({kind:z.literal('sweep-warning'),remaining:ticks,gapX:n,gapZ:n}),
 z.object({kind:z.literal('volley-warning'),remaining:ticks,targets:z.array(target).length(5)}),
 z.object({kind:z.literal('summon-warning'),remaining:ticks,targets:z.array(target).max(3)})
])});
export type Boss=z.infer<typeof bossSchema>;
export function initialBoss(t:CombatTuning):Boss{return{x:6,z:0,prevX:6,prevZ:0,hp:t.bossHP,sequence:0,faceX:-1,faceZ:0,behavior:{kind:'recover',remaining:t.bossIntroTicks}};}
const phase=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('fight'),wave:ticks,nextSpawn:ticks}),
 z.object({kind:z.literal('upgrade'),wave:ticks,choices:z.array(z.string()).length(3)}),
 z.object({kind:z.literal('boss'),boss:bossSchema}),
 z.object({kind:z.literal('complete'),reward:z.literal('blade').optional()}),z.object({kind:z.literal('lost')})
]);
export const runSchema=z.object({tick:ticks,hitstop:ticks,loadout:z.enum(['core','blade']).default('core'),hero:heroSchema,enemies:z.array(enemySchema).max(12),projectiles:z.array(z.object({id:ticks,owner:ticks,x:n,z:n,prevX:n,prevZ:n,dx:n,dz:n,remaining:ticks})).max(24),nextProjectile:ticks,phase,upgrades:z.array(z.string()),events:z.array(eventSchema)});
export type RunState=z.infer<typeof runSchema>;
export type Enemy=z.infer<typeof enemySchema>;
export const Run=Descriptor.ConstructedResource(runSchema)('Redline/Run');
export const RunGame=Schema.bind(Schema.fragment({resources:{Run,Tuning}}));
export {Input};
export function spawnEnemy(kind:Enemy['kind'],index:number,wave:number,t:CombatTuning):Enemy {
 // Stable interleaved positions on both sides of the central lane; no unseeded RNG.
 const side=index%2===0?1:-1,x=side*(t.spawnRadius+Math.floor(index/4)*t.spawnSeparation),z=((index*3)%7-3)*1.35;
 const stats=enemyStats(kind,t),p=collide(x,z,stats.radius,t);
 return{id:wave*100+index,kind,x:p.x,z:p.z,prevX:p.x,prevZ:p.z,hp:stats.hp,faceX:-side,faceZ:0,behavior:{kind:'spawn',remaining:t.spawnDropTicks}};
}
export function initialRun(t:CombatTuning,loadout:RunState['loadout']='core'):RunState {
 return{tick:0,hitstop:0,loadout,hero:initialState(t).hero,enemies:waves[0].slice(0,t.enemyCap).map((kind,i)=>spawnEnemy(kind,i,0,t)),projectiles:[],nextProjectile:0,phase:{kind:'fight',wave:0,nextSpawn:Math.min(t.enemyCap,waves[0].length)},upgrades:[],events:[]};
}
