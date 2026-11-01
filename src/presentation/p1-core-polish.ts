// FINAL_POLISH P1: renderer-only rules; disable this module's switch to compare the previous finish.
export const P1_ENABLED=true;
export const corePolish={turnLean:.022,maxLean:.045,fastTurnThreshold:3.5,fastTurnSpeed:6,wearDetail:.25}as const;
export function coreTurntablePose(pose:string|null){return pose==='side'?{azimuth:90,elevation:4}:pose==='quarter'?{azimuth:35,elevation:12}:pose==='top'?{azimuth:0,elevation:70}:{azimuth:0,elevation:4};}
