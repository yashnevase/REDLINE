import {D_PACE_ENABLED,runPace,type PaceTuning} from './d-run-pace.ts';
import {B2_ENABLED} from './switches.ts';
import type {EnemyKind} from '../encounter.ts';
export const levelGoals=D_PACE_ENABLED?runPace.goals:[3000,6500,11000] as const;
export const minimumLevelWaves=(level:number,t?:PaceTuning)=>D_PACE_ENABLED?(t?[t.level1MinWaves,t.level2MinWaves,t.level3MinWaves]:runPace.minimumWaves)[Math.max(0,Math.min(2,level))]:1;
export const levelGoal=(level:number,t?:PaceTuning)=>(D_PACE_ENABLED&&t?[t.level1Goal,t.level2Goal,t.level3Goal]:levelGoals)[Math.max(0,Math.min(2,level))];
export const levelUnlocks=['LEVEL 2 · ARMOURED ENCOUNTERS','LEVEL 3 · GRINDERS & WHIRLERS','SCRAP-REX · BLADE REWARD'] as const;
export function objectiveFormation(level:number,wave:number):readonly EnemyKind[]{if(level===0)return[...Array<EnemyKind>(5+wave%2).fill('sawlet'),...Array<EnemyKind>(3).fill('thrower')];if(level===1)return[...Array<EnemyKind>(5+wave%2).fill('sawlet'),...Array<EnemyKind>(3).fill('thrower'),...Array<EnemyKind>(2).fill('shieldsaw')];return[...Array<EnemyKind>(5+wave%2).fill('sawlet'),...Array<EnemyKind>(2).fill('thrower'),...Array<EnemyKind>(2).fill('shieldsaw'),'grinder',B2_ENABLED?'whirler':'sawlet'];}
