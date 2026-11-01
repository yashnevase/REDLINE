export const I1_ENABLED=true,I2_ENABLED=true,I3_ENABLED=true,I4_ENABLED=true,I5_ENABLED=true,I6_ENABLED=true,I7_ENABLED=true,I8_ENABLED=true,I9_ENABLED=true,I10_ENABLED=true;
export const additionsDefaults={styleSpeedTicks:60,styleNoDamageTicks:180,styleDecayTicks:30,styleIdleTicks:120,styleScoreBonus:.15,ricochetDamageFactor:1.5,bumperRadius:.7,hazardPeriodTicks:300,hazardWarningTicks:48,hazardActiveTicks:48,hazardDamage:20,barrelDamage:45,barrelRadius:3.5,scrappedBonus:80,pickupMagnetRadius:6,pickupSpeed:7,pickupScore:10,pickupHeat:2,pickupHeal:1,grazeMargin:.6,grazeHeat:3,grazeScore:40,lastStandThreshold:.2,lastStandDamageBonus:.3} as const;
export const bumpers=[{x:19,z:8},{x:-19,z:-8},{x:8,z:-19},{x:-8,z:19}] as const;
export const styleNames=['SCRAP','GRIND','METAL','REDLINE'] as const;
export const styleRank=(points:number)=>points>=100?3:points>=60?2:points>=25?1:0;
export const twistNames=['BLACKOUT','SCRAP STORM','VENT SURGE'] as const;
export function levelTwist(seed:number,level:number){const h=(Math.imul((seed+Math.imul(level,2654435761))>>>0,2246822519)^(level*8129<<7))>>>0;return(h>>>13)%3;}
export function dailySeed(day:string){let value=2166136261;for(const c of day)value=Math.imul(value^c.charCodeAt(0),16777619)>>>0;return value;}
