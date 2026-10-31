// Chapter data is shared by scene dressing and deterministic level generation.
export const E_ENABLED=true;
export const scrapyard={id:'scrapyard',palette:{floor:'#514039',steel:'#5a5560',oxide:'#7a2f2a',soot:'#2b2422',fire:'#ff8639',neon:'#aa78ff'},tiles:{spacing:3,extent:24,lightnessVariance:.08},props:{density:32},vents:{count:5,minSeparation:9,centreExclusion:8,boostCount:2},background:{islands:9,layers:3},roster:['sawlet','thrower','shieldsaw','grinder','whirler'],hazard:'boost-vent',levels:[{seed:4107,target:3000},{seed:8129,target:6500},{seed:12421,target:11000}]} as const;
