import type {RunState} from './run-schema.ts';
export function missionMastery(s:RunState,_boss=false){return{noHit:s.score.damageTaken-s.objective.startDamage===0,perfectDodges:s.quality.perfectDodges-s.objective.startPerfects>=3,redline:s.objective.bestStyle>=3};}
export function masteryStars(m:ReturnType<typeof missionMastery>){return Number(m.noHit)+Number(m.perfectDodges)+Number(m.redline);}
