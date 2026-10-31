import {F3_ENABLED} from '../content/items/switches.ts';import type {Boss} from './run-schema.ts';import type {CombatTuning} from '../content/combat.ts';
export function weakSpotFactor(b:Boss,t:CombatTuning,enabled=F3_ENABLED){return enabled&&b.exposed>0?t.punishDamageFactor:1;}
export function exposeBossPlates(b:Boss,t:CombatTuning,heavy=true){b.exposed=F3_ENABLED&&heavy?t.bossExposedTicks:0;}
