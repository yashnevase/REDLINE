import type {CombatTuning} from './combat.ts';
export function bossStage(hp:number,t:CombatTuning){const ratio=hp/t.bossHP;return ratio>.7?1:ratio>.4?2:ratio>.2?3:4;}
export const bossPatterns={1:['chomp','summon'],2:['chomp','sweep','summon'],3:['chomp','sweep','volley','summon'],4:['chomp','sweep','volley','chomp','summon']} as const;
