export const damagedInlays=[[-9,3],[7,-11],[13,3],[-5,13],[-15,-3],[3,-15]] as const;
export const isDamagedInlay=(x:number,z:number)=>damagedInlays.some(([a,b])=>a===x&&b===z);
