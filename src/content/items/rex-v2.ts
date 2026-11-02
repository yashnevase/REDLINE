// Shared boss contract: fixed-step warnings, no encounter timer, explicit punish.
export const rexAttacks=['sweep','slam','boomerang','roll','barrage','vent','summon'] as const;
export type RexAttack=typeof rexAttacks[number];
export const rexNames:Record<RexAttack,string>={sweep:'Saw Sweep',slam:'Scrap Slam',boomerang:'Boomerang Saws',roll:'Roll Charge',barrage:'Trophy Barrage',vent:'Vent Eruption',summon:'Summon Grinders'};
export const rexPatterns={1:['sweep','slam','boomerang'],2:['roll','sweep','boomerang','slam'],3:['barrage','vent','roll','slam','boomerang'],4:['summon','roll','sweep','barrage','vent','slam','boomerang']} as const;
export const rexDefaults={rexHP:7000,rexWarningTicks:60,rexRecoveryTicks:90,rexChainRecoveryTicks:48,rexPunishTicks:60,rexDamage:18,rexRollSpeed:15,rexSawTravelTicks:96,rexSawReach:10,rexRingSpeed:9,rexCircleRadius:1.6,rexAddWarningTicks:60,rexCoreDamageFactor:1.4};
export const bossDesignRules={phases:4,minimumWarningTicks:48,punishMultiplier:2,minimumSelfStunTicks:60,noTimer:true} as const;
