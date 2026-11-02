import type {RunState} from './run-schema.ts';
export function missionMastery(s:RunState,boss=false){return{noHit:s.score.damageTaken-(boss?0:s.objective.startDamage)===0,perfectDodges:s.quality.perfectDodges-(boss?0:s.objective.startPerfects)>=3,redline:(boss?s.extras.bestStyle:s.objective.bestStyle)>=3};}
export function masteryStars(m:ReturnType<typeof missionMastery>){return Number(m.noHit)+Number(m.perfectDodges)+Number(m.redline);}
