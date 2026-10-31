// Original REDLINE content. Seeded layout only; no gameplay engine selected yet.
export const scenes = ['lobby', 'arena', 'core-studio', 'enemy-lineup', 'combat-readability', 'perf-worst', 'boss', 'arena-showcase', 'sawlet-studio', 'thrower-studio', 'shieldsaw-studio', 'grinder-studio', 'boss-studio', 'workshop'];
export const seed = 4107;
export const defaults = Object.freeze({
  viewHeight: 13.8, elevation: 30, azimuth: 45, exposure: 1.05,
  keyLight: 2.8, fillLight: 0.6, ambientLight: 1.35, shadowOpacity: 0.2,
  spawnDropHeight:3, coreRadius: 0.62, coreBob: 0.035, bobSpeed: 1.8,
  floorVariance: 0.09, floorFalloff: 0.19, lavaSpill: 0.27, violetStrength: 2.5, orangeStrength: 2.8,
  renderScale: 1.5, particles: 22, stageHeight: 3.3, stageElevation: 18,
  coreHeat: 0, coreBlade: 0, coreExpression: 0, coreStudioHeight: 1.65, coreStudioWidth: 1.015, coreStudioSquash: 0.98, coreStudioElevation: 4, coreStudioAzimuth: 0, coreSheen: 0.6, turnSpeed: 0.35, effectRadius: 4.7, effectSpeed: 1, impactBurstSeconds: 0.12, impactShake: 0.04, impactZoom: 0.018
});
export const palettes = Object.freeze({ chrome: '#a3a7ab', rust: '#864b69', steel: '#5d6269', stone: '#36294f', glow: '#b49bff' });
export function random(seedValue) {
  let state = seedValue >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
}
export const foundry = Object.freeze({ columns: 33, tileSpacing: 1.45, channelCenter: 9.425, channelWidth: 2.75, innerWall: 7.98, outerWall: 10.95 });
export function floorLayout(seedValue = seed) {
  const rng = random(seedValue);
  return Array.from({ length: foundry.columns ** 2 }, (_, i) => ({ x: i % foundry.columns - Math.floor(foundry.columns / 2), z: Math.floor(i / foundry.columns) - Math.floor(foundry.columns / 2), tone: rng(), rotation: Math.floor(rng() * 4) }));
}
