import {B2_ENABLED} from './switches.ts';
import type {EnemyKind} from '../encounter.ts';
export const levelGoals=[3000,6500,11000] as const;
export const levelUnlocks=['LEVEL 2 · ARMOURED ENCOUNTERS','LEVEL 3 · GRINDERS & WHIRLERS','SCRAP-REX · BLADE REWARD'] as const;
export function objectiveFormation(level:number,wave:number):readonly EnemyKind[]{if(level===0)return[...Array<EnemyKind>(5+wave%2).fill('sawlet'),...Array<EnemyKind>(3).fill('thrower')];if(level===1)return[...Array<EnemyKind>(5+wave%2).fill('sawlet'),...Array<EnemyKind>(3).fill('thrower'),...Array<EnemyKind>(2).fill('shieldsaw')];return[...Array<EnemyKind>(5+wave%2).fill('sawlet'),...Array<EnemyKind>(2).fill('thrower'),...Array<EnemyKind>(2).fill('shieldsaw'),'grinder',B2_ENABLED?'whirler':'sawlet'];}
