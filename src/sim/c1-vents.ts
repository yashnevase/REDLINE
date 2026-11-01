import {z} from 'zod';
import {scrapyard} from '../content/chapters/scrapyard.ts';
import {chapterLayout} from '../content/chapters/layout.ts';
import {C1_GAMEPLAY_ENABLED} from '../content/items/c-world.ts';
import type {RunState} from './run-schema.ts';
import type {CombatTuning} from '../content/combat.ts';
export const ventStateSchema=z.object({contact:z.number().int().min(-1).default(-1),boost:z.discriminatedUnion('kind',[z.object({kind:z.literal('idle')}),z.object({kind:z.literal('active'),remaining:z.number().int().positive(),source:z.number().int().nonnegative()})]).default({kind:'idle'})}).default({contact:-1,boost:{kind:'idle'}});
export function stepVents(s:RunState,t:CombatTuning){
 const state=s.vents;if(state.boost.kind==='active'){if(state.boost.remaining>1)state.boost.remaining--;else state.boost={kind:'idle'};}
 if(!C1_GAMEPLAY_ENABLED||scrapyard.hazard!=='boost-vent')return 1;
 const vent=chapterLayout(s.objective.level).vents.find(v=>v.boost&&(s.hero.x-v.x)**2+(s.hero.z-v.z)**2<=t.ventTriggerRadius**2);
 if(vent&&state.contact!==vent.id){state.boost={kind:'active',source:vent.id,remaining:t.ventBoostTicks};s.events.push({id:`${s.tick}:vent:${vent.id}`,tick:s.tick,kind:'vent-boost',x:vent.x,z:vent.z,amount:t.ventSpeedFactor,radius:t.ventTriggerRadius});}
 state.contact=vent?.id??-1;
 return state.boost.kind==='active'?t.ventSpeedFactor:1;
}
