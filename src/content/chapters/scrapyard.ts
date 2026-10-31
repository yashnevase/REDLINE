import {runPace} from '../items/d-run-pace.ts';
// Chapter data is shared by scene dressing and deterministic level generation.
export const E_ENABLED=true;
export const scrapyard={id:'scrapyard',palette:{floor:'#514039',steel:'#5a5560',oxide:'#7a2f2a',soot:'#2b2422',fire:'#ff8639',neon:'#aa78ff'},tiles:{spacing:3,extent:24,lightnessVariance:.08},props:{density:32},vents:{count:5,minSeparation:9,centreExclusion:8,boostCount:2},background:{islands:9,layers:3},roster:['sawlet','thrower','shieldsaw','grinder','whirler'],hazard:'boost-vent',levels:[{seed:4107,target:runPace.goals[0]},{seed:8129,target:runPace.goals[1]},{seed:12421,target:runPace.goals[2]}]} as const;
