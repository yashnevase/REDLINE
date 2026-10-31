import {F5_ENABLED} from '../content/items/switches.ts';import type {RunState} from './run-schema.ts';import type {CombatTuning} from '../content/combat.ts';import type {DeathCause} from '../content/items/f5-results.ts';
export function recordDeath(source:DeathCause):DeathCause{return F5_ENABLED?source:'unknown';}
export function resultStars(s:RunState,t:CombatTuning,target:number){return Number(s.score.points>=target&&s.phase.kind!=='lost')+Number(s.hero.hp>=t.heroHP*.25)+Number(s.quality.perfectDodges>=3);}
