import type {CombatTuning} from './combat.ts';
export const enemyKinds=['sawlet','thrower','shieldsaw','grinder'] as const;
export type EnemyKind=typeof enemyKinds[number];
export const enemyNames:Record<EnemyKind,string>={sawlet:'Sawlet',thrower:'Rivet Thrower',shieldsaw:'Shieldsaw',grinder:'Grinder'};
// START formations from the brief's explicitly referenced §24.3. Full-clear gate supersedes its old 70% rule.
export const waves:readonly (readonly EnemyKind[])[]=[
 ['sawlet','sawlet','sawlet','sawlet','sawlet','sawlet','sawlet','sawlet'],
 ['sawlet','sawlet','sawlet','sawlet','sawlet','sawlet','thrower','thrower'],
 ['sawlet','sawlet','sawlet','sawlet','shieldsaw','shieldsaw','thrower'],
 ['sawlet','sawlet','sawlet','sawlet','sawlet','thrower','thrower','shieldsaw','shieldsaw','grinder']
];
export function enemyStats(kind:EnemyKind,t:CombatTuning){
 const table={
  sawlet:{hp:t.sawletHP,speed:t.sawletSpeed,radius:t.sawletRadius,range:t.attackRange,windup:t.windupTicks,recovery:t.recoveryTicks,heat:t.heatPerSawlet},
  thrower:{hp:t.throwerHP,speed:t.throwerSpeed,radius:t.throwerRadius,range:t.throwerFar,windup:t.throwerWindupTicks,recovery:t.throwerRecoveryTicks,heat:t.heatPerThrower},
  shieldsaw:{hp:t.shieldsawHP,speed:t.shieldsawSpeed,radius:t.shieldsawRadius,range:t.attackRange,windup:t.shieldWindupTicks,recovery:t.shieldRecoveryTicks,heat:t.heatPerShieldsaw},
  grinder:{hp:t.grinderHP,speed:t.grinderSpeed,radius:t.grinderRadius,range:t.grinderSweepRadius,windup:t.grinderWindupTicks,recovery:t.grinderRecoveryTicks,heat:t.heatPerGrinder}
 } satisfies Record<EnemyKind,{hp:number;speed:number;radius:number;range:number;windup:number;recovery:number;heat:number}>;
 return table[kind];
}
