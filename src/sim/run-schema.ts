import {extrasSchema} from './s4-extras.ts';
import {combatStatusSchema} from './cl6-status.ts';
import {ventStateSchema} from './c1-vents.ts';
import {objectiveSchema,levelCompletionSchema} from './f1-objectives.ts';
import {F1_ENABLED} from '../content/items/switches.ts';
import {objectiveFormation} from '../content/items/f1-objectives.ts';
import {deathCauses} from '../content/items/f5-results.ts';
import {scoreSchema} from './b6-score.ts';
import {bladeProjectileSchema} from './b5-blade-projectiles.ts';
import {qualitySchema} from './b1-hit-quality.ts';
import {z} from 'zod';
import {Descriptor,Schema,Ops} from '@typeonce/ritmo';
import {heroSchema,behavior,eventSchema,initialState,Input,Tuning} from './schema.ts';
import {enemyKinds,waves,enemyStats} from '../content/encounter.ts';
import type {CombatTuning} from '../content/combat.ts';
import {collide} from './geometry.ts';
const n=z.number().finite(),ticks=z.number().int().nonnegative();
export const enemySchema=z.object({status:combatStatusSchema,id:ticks,attackSerial:ticks.default(0),kind:z.enum(enemyKinds),x:n,z:n,prevX:n,prevZ:n,hp:n.nonnegative(),faceX:n,faceZ:n,behavior});
const target=z.object({x:n,z:n});
export const bossSchema=z.object({status:combatStatusSchema,exposed:ticks.default(0),x:n,z:n,prevX:n,prevZ:n,hp:n.nonnegative(),sequence:ticks,faceX:n,faceZ:n,behavior:z.discriminatedUnion('kind',[
 z.object({kind:z.literal('recover'),remaining:ticks}),
 z.object({kind:z.literal('chomp-warning'),remaining:ticks,dx:n,dz:n}),
 z.object({kind:z.literal('charge'),remaining:ticks,dx:n,dz:n,hasHit:z.boolean()}),
 z.object({kind:z.literal('sweep-warning'),remaining:ticks,gapX:n,gapZ:n}),
 z.object({kind:z.literal('volley-warning'),remaining:ticks,targets:z.array(target).length(5)}),
 z.object({kind:z.literal('summon-warning'),remaining:ticks,targets:z.array(target).max(3)})
])});
export type Boss=z.infer<typeof bossSchema>;
export function initialBoss(t:CombatTuning):Boss{return{status:combatStatusSchema.parse({}),exposed:0,x:6,z:0,prevX:6,prevZ:0,hp:t.bossHP,sequence:0,faceX:-1,faceZ:0,behavior:{kind:'recover',remaining:t.bossIntroTicks}};}
const phase=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('fight'),wave:ticks,nextSpawn:ticks,nextSpawnIn:ticks.default(0)}),
 z.object({kind:z.literal('upgrade'),wave:ticks,choices:z.array(z.string()).length(3),completion:levelCompletionSchema.optional()}),
 levelCompletionSchema.extend({kind:z.literal('level-complete')}),
 z.object({kind:z.literal('boss'),boss:bossSchema}),
 z.object({kind:z.literal('complete'),reward:z.literal('blade').optional()}),z.object({kind:z.literal('lost'),cause:z.enum(deathCauses).default('unknown')})
]);
export const runSchema=z.object({mode:z.discriminatedUnion('kind',[z.object({kind:z.literal('campaign')}),z.object({kind:z.literal('mission'),id:ticks.max(3)})]).default({kind:'campaign'}),extras:extrasSchema,vents:ventStateSchema,objective:objectiveSchema,score:scoreSchema,bladeProjectiles:z.array(bladeProjectileSchema).max(32).default([]),nextBladeProjectile:ticks.default(0),bladeFireIn:ticks.default(0),quality:qualitySchema,tick:ticks,hitstop:ticks,loadout:z.enum(['core','blade']).default('core'),hero:heroSchema,enemies:z.array(enemySchema).max(12),projectiles:z.array(z.object({id:ticks,owner:ticks,x:n,z:n,prevX:n,prevZ:n,dx:n,dz:n,remaining:ticks})).max(24),nextProjectile:ticks,phase,upgrades:z.array(z.string()),events:z.array(eventSchema)});
export type RunState=z.infer<typeof runSchema>;
export type Enemy=z.infer<typeof enemySchema>;
export const Run=Descriptor.ConstructedResource(runSchema)('Redline/Run');
export const RunGame=Schema.bind(Schema.fragment({resources:{Run,Tuning}}));
export {Input};
export function spawnEnemy(kind:Enemy['kind'],index:number,wave:number,t:CombatTuning):Enemy {
 // Stable circular drops inside the combat zone; the 48-u slab is scenery.
 const angle=index*2.399963229728653+wave*.7,radius=t.spawnRadius+(index%3)*t.spawnSeparation*.5;
 const x=Ops.cos(angle)*radius,z=Ops.sin(angle)*radius,side=x>=0?1:-1;
 const stats=enemyStats(kind,t),p=collide(x,z,stats.radius,t);
 return{status:combatStatusSchema.parse({}),id:wave*100+index,attackSerial:0,kind,x:p.x,z:p.z,prevX:p.x,prevZ:p.z,hp:stats.hp,faceX:-side,faceZ:0,behavior:{kind:'spawn',remaining:t.spawnDropTicks}};
}
export function initialRun(t:CombatTuning,loadout:RunState['loadout']='core',options:{mission?:number;seed?:number}={}):RunState {
 const mission=options.mission,level=mission===undefined?0:Math.max(0,Math.min(2,mission)),mode:RunState['mode']=mission===undefined?{kind:'campaign'}:{kind:'mission',id:Math.min(3,Math.max(0,Math.floor(mission)))};const initial=objectiveFormation(level,0);
 return{mode,extras:extrasSchema.parse({seed:options.seed??4107,level}),vents:ventStateSchema.parse({}),objective:objectiveSchema.parse({level}),score:scoreSchema.parse({}),bladeProjectiles:[],nextBladeProjectile:0,bladeFireIn:0,quality:qualitySchema.parse({}),tick:0,hitstop:0,loadout,hero:initialState(t).hero,enemies:mission===3?[]:(F1_ENABLED?initial:waves[0]).slice(0,Math.min(t.enemyCap,t.openingThreats)).map((kind,i)=>spawnEnemy(kind,i,0,t)),projectiles:[],nextProjectile:0,phase:mission===3?{kind:'boss',boss:initialBoss(t)}:{kind:'fight',wave:0,nextSpawn:Math.min(t.enemyCap,t.openingThreats,initial.length),nextSpawnIn:t.spawnMinTicks},upgrades:[],events:[]};
}
