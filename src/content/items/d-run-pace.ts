export const D_PACE_ENABLED=true;
export const paceDefaults={level1Goal:10000,level2Goal:24000,level3Goal:40000,level1MinWaves:3,level2MinWaves:4,level3MinWaves:5};
export type PaceTuning=typeof paceDefaults;
// Owner requested longer fights and more total enemies, without raising the live/attack caps.
export const runPace={goals:[paceDefaults.level1Goal,paceDefaults.level2Goal,paceDefaults.level3Goal],minimumWaves:[paceDefaults.level1MinWaves,paceDefaults.level2MinWaves,paceDefaults.level3MinWaves]} as const;
