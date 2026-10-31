import {B2_ENABLED} from './items/switches.ts';
import type {CombatTuning} from './combat.ts';
export const enemyKinds=['sawlet','thrower','shieldsaw','grinder','whirler'] as const;
export type EnemyKind=typeof enemyKinds[number];
export const enemyNames:Record<EnemyKind,string>={sawlet:'Sawlet',thrower:'Rivet Thrower',shieldsaw:'Shieldsaw',grinder:'Grinder',whirler:'Whirler'};
// Owner-approved FEEL_SPRINT formations. Full clear still gates the next wave.
export const waves:readonly (readonly EnemyKind[])[]=[
 [...Array<EnemyKind>(8).fill('sawlet')],
 [...Array<EnemyKind>(6).fill('sawlet'),...Array<EnemyKind>(3).fill('thrower')],
 [...Array<EnemyKind>(4).fill('sawlet'),B2_ENABLED?'whirler':'sawlet',...Array<EnemyKind>(3).fill('thrower'),...Array<EnemyKind>(3).fill('shieldsaw')],
 [...Array<EnemyKind>(5).fill('sawlet'),B2_ENABLED?'whirler':'sawlet',...Array<EnemyKind>(3).fill('thrower'),...Array<EnemyKind>(2).fill('shieldsaw'),'grinder']
];
export function enemyStats(kind:EnemyKind,t:CombatTuning){
 const table={
  sawlet:{hp:t.sawletHP,speed:t.sawletSpeed,radius:t.sawletRadius,range:t.attackRange,windup:t.windupTicks,recovery:t.recoveryTicks,heat:t.heatPerSawlet},
  thrower:{hp:t.throwerHP,speed:t.throwerSpeed,radius:t.throwerRadius,range:t.throwerFar,windup:t.throwerWindupTicks,recovery:t.throwerRecoveryTicks,heat:t.heatPerThrower},
  shieldsaw:{hp:t.shieldsawHP,speed:t.shieldsawSpeed,radius:t.shieldsawRadius,range:t.attackRange,windup:t.shieldWindupTicks,recovery:t.shieldRecoveryTicks,heat:t.heatPerShieldsaw},
  whirler:{hp:t.whirlerHP,speed:t.whirlerSpeed,radius:t.whirlerRadius,range:t.whirlerRange,windup:t.whirlerWindupTicks,recovery:t.whirlerRecoveryTicks,heat:t.heatPerWhirler},
  grinder:{hp:t.grinderHP,speed:t.grinderSpeed,radius:t.grinderRadius,range:t.grinderSweepRadius,windup:t.grinderWindupTicks,recovery:t.grinderRecoveryTicks,heat:t.heatPerGrinder}
 } satisfies Record<EnemyKind,{hp:number;speed:number;radius:number;range:number;windup:number;recovery:number;heat:number}>;
 return table[kind];
}
