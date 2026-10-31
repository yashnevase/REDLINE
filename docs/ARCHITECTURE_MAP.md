# REDLINE architecture plan

Planned, not implemented. Vite + TypeScript + Three.js + pnpm. Pin versions during setup. Engine selection awaits clean-install smoke test and owner decision.

| Path | Responsibility | Study inspiration |
|---|---|---|
| src/content | Validated content and tuning data | reference content, config/tuning.ts |
| src/sim | Seeded fixed-step headless state, commands and events | simulation.ts, runtime.ts |
| src/input | Keyboard/touch/gamepad to tick commands | config/input.ts |
| src/presentation | Readonly snapshots, interpolation, camera, presets and bounded FX | presentation/camera.ts, scene.ts, looks.ts |
| src/ui | HUD, safe areas and tuning panel | presentation/hud.ts |
| src/app | Browser lifecycle, accumulator and time policy | headless/browser separation |
| test | Replay and content validation | reference test organization |
| tools | Real check/shots/perf/asset verification | reference scripts organization |

Flow: devices → tick commands → simulation → readonly snapshots/events → presentation/UI. Debug edits use validated commands. Presentation never writes sim state; browser clocks remain outside sim.

First scene: Core, one Sawlet, Foundry floor and HUD. Capture desktop and landscape phone after ready signal, recording scene/seed/tick/viewport/camera. Compare side by side with target and obtain owner look approval before Phase 1. Exclude references and debug tools from production build. No reference code or assets reused.


Revision 2: presentation now separates materials.ts (five preset families and original procedural chrome reflection), models.ts (original flush-faced Core and faceted Sawlet), effects.ts (authored preview loop only), and scene.ts (world/camera/lighting/batching). The browser UI defaults to lobby with working preview links. Presentation animation is a function of tick; it does not constitute a gameplay simulation.


## Phase 1 implementation
- content/combat.ts: validated START tuning and solid-prop bounds.
- sim/schema.ts: validated serializable Fight state, tagged dash/enemy behavior, intent contract and resource descriptors.
- sim/rules.ts: pure fixed-tick movement/collision/dash/bonk/Sawlet rules. No renderer, DOM, clocks or globals.
- sim/runtime.ts: pinned Ritmo runtime/schedule, detached Inspector projection, snapshot/restore interface. Each runtime owns its input service and saved state.
- input/devices.ts: keyboard, independent pointer captures and gamepad into the same tick command. Converts screen vectors through the current isometric camera basis.
- app/main.ts: 60 Hz accumulator with bounded catch-up, pause/focus handling, restart, HUD and dev-only replay/capture tools. Integer sim hit-stop preserves queued dash input.
- presentation/scene.ts and combat-fx.ts: readonly interpolated snapshots → model poses, follow camera, telegraphs, pooled rings/sparks/numbers/trails. No runtime writes.
- tests: full dash timing/distance/charge cycle, speed damage/cadence, collisions, hit buffering, attack/i-frame boundaries, replay, snapshot round-trip and Ritmo determinism audit.

No save progression, next-wave rules, perfect dodge, Overdrive invulnerability or other pending design decisions were inferred approved.

## Phase 2 encounter
`content/encounter.ts` defines roles, START formations and config-derived enemy stats. `content/upgrades.ts` owns the approved closed upgrade pool, numeric effective tuning and offers. `sim/run-schema.ts` owns a saved Run resource: hero, bounded enemies/projectiles, tagged fight/upgrade/complete/lost phase, picked upgrades and presentation events. `run-rules.ts` owns all encounter damage, AI, engagement, projectile collision and progression; `run-runtime.ts` owns its Ritmo system/schedule and detached inspector. Both runtimes use `hero.ts` for movement/cooldowns and `geometry.ts` for solid collision. The old trial remains independent with no duplicate hero motion logic. `presentation/encounter.ts` mirrors read-only run views into bounded actor/warning/projectile pools; `scene.ts` owns hero/camera/pooled hit feedback. App host forwards card/device intents and displays detached view data. The upgrade screen never writes saved state directly.

Phase 3: boss data is part of the tagged `Run.phase.boss`, so attack-only target/direction fields live on their specific warning/charge variants. `boss-rules.ts` updates deterministic warnings, charges, sweep gap, volley targets and summons; `run-rules.ts` owns shared damage and terminal reward. Saved `Run.loadout` selects Q behavior; profile storage never enters simulation code. `content/profile.ts` validates unlock/equipment, `save/profile.ts` adapts localStorage, and app persists only actual boss→reward transitions. Presentation mirrors boss snapshots and saved loadout; no renderer writes to the world.

## Look Lock presentation additions

impact-layers.ts owns eight ground FX slots with shared geometry and per-slot opacity/colour. combat-fx.ts owns ingestion/reset and maps simulation events to them. scene.ts owns original lava shader/uniform time, additive floor spill, material-isolated environment shading and a 13-capacity NPC shadow instance pool. content/scene.mjs owns light/floor/spill/burst settings exposed by the existing workbench. No simulation dependencies introduced.

## Core candidate and measurement

makeCore(materials, matched=false) retains gameplay model by default; core-studio opts into candidate expressions/curved shell/materials. Studio Heat maps are three bounded textures; mask render clones mesh nodes and uses one solid material, with no simulation access. tools/core-match.mjs captures previews/camera evidence, tools/measure-core.py annotates/alines/measures via Pillow, tools/core-motion.mjs records motion. No new sim state or rule changes.

## Candidate Core hardware and loading

core-sockets.ts lazily loads original GLB only in core-studio, validates surface roles and converts to matcaps with a faded outer-panel boundary. Scene owns retryable load promise/readiness; failed loads are surfaced by existing Try again UI. Object-ID mask clones are built after asset load. makeCore accepts injected Blade materials; geometry creation remains headless. Socket export is validated by a real GLTF parse test; app asserts no studio hardware request in gameplay. No sim/save-rule changes.

## Chapter 1 completion pass
`presentation/industrial.ts` owns original hard-surface placeholders/GLB geometry substitution; `enemies.ts` owns the four shared body/hardware kits. `space-stage.ts` owns merged slab and separately merged/fading corner/satellite groups. `selective-glow.ts` owns High-only half-resolution emissive bloom. `models.ts` supplies detailed/studio vs gameplay Core LOD; `materials.ts` supplies original matcaps/seeded UV wear. Batch merging preserves UVs/vertex colours; faders must bind after merging. `sim/hero.ts` owns dash recognition/charge/protection/cooldown, while `run-rules.ts` owns swept Rush/Charge hits and once-per-target Spin plus hop/cone. All new saved fields have schema defaults and restore/replay coverage. Device code sends press/release/cancel intents; pause cancellation is queued through the same simulation path. New replay exports are version3. No presentation writes simulation state.
