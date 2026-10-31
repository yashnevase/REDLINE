// Original REDLINE content. Seeded layout only; no gameplay engine selected yet.
export const scenes = ['lobby', 'arena', 'core-studio', 'enemy-lineup', 'combat-readability', 'perf-worst', 'boss', 'arena-showcase', 'sawlet-studio', 'thrower-studio', 'shieldsaw-studio', 'grinder-studio', 'boss-studio', 'workshop'];
export const seed = 4107;
export const defaults = Object.freeze({
  viewHeight: 11.2, phoneViewHeight:11, portraitViewWidth:11, elevation: 30, azimuth: 45, exposure: 1.05,
  keyLight: 2.8, fillLight: 0.6, ambientLight: 1.35, shadowOpacity: 0.2,
  spawnDropHeight:3, coreRadius: 0.62, coreBob: 0.035, bobSpeed: 1.8,
  floorVariance: 0.135, floorFalloff: 0.19, lavaSpill: 0.27, violetStrength: 2.5, orangeStrength: 2.8,
  renderScale: 1.5, particles: 22, stageHeight: 3.3, stageElevation: 18,
  cameraLookAhead:1.2, cameraDamping:.16, cameraInset:11, dashZoomOut:.04, lightZoom:.02, heavyZoom:.04, zoomEaseSeconds:.12,
  lightShake:.04, mediumShake:.09, heavyShake:.16, lightSparks:10, mediumSparks:20, heavySparks:40, numberPixels:38, phoneNumberPixels:34, heavyNumberScale:1.3, numberPopPeak:1.25, sparkSize:1.5, impactDiscOpacity:.45, heavyDiscOpacity:.6, impactRingOpacity:.9, scorchOpacity:.6, numberFloat:.8,
  locatorRadius:4, locatorOpacity:.25, enemyGlowOpacity:.12, coreRimStrength:1.2, effectSlots:4, speedThreshold:.8, speedZoomOut:.02, overdriveZoomOut:.06, overdriveEntrySeconds:.2, overdriveEntryScale:.3, velocityStretch:.2, ghostOpacity:.18, dustOpacity:.2, atmosphereStrength:.6, edgeChaseSpeed:12, ambientSweep:.07, sweepPeriod:8, sweepDuration:2, nebulaHeatBoost:.15, bannerSeconds:.6, bossSlowSeconds:.08, bossSlowScale:.25, killSlowSeconds:.1, killSlowScale:.35,
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
