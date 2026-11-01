# Spirit Call study for Chapter 1 close-out

2026-11-01. Study only; implementation is rebuilt in REDLINE. No code or art copied. The owner's new audio permission is narrower than a general reuse licence: private audio only, never public assets/builds.

## Lighting and materials

Read `ref/spirit-call/spirit-call-main/src/presentation/host.ts`, `scenery.ts`, `scene.ts` and reviewed combat/lobby targets. The host uses a hemisphere and directional key with calibrated physical intensity, readable silhouette lighting, and batched blob/contact shadows. Floor/scenery is data-driven, using an understated base below tiled surfaces and deliberately selected inlays; geometry and contact cues carry depth. Apply a cleaner lower-saturation floor, stronger warm key, cool silhouette separation and shadows above the actual floor. Atmospheric effects must not veil the player.

## Combat feel and VFX timing

Read scene feedback/camera flow and `combat-light.ts`. Presentation interpolates state, decays shake/kicks, uses bounded short-lived light/ribbon batches, and separates anticipation/contact/aftermath. Our arena must preserve honest telegraph sizes and a bright Core location, rather than stacking flashes over it. Keep sparks in bounded pools; quiet modes suppress motion/flashes without changing the simulation.

## UI scale

Read `hud.ts` and reviewed `combat-lava-swarm.png` / `menu-hero.png`. Desktop and touch presentation deliberately differ; the touch pad has its own hit regions and device switching. HUD uses a compact top objective, thin health information, clear skill slots and menu/help. Apply desktop-only panel reduction and quiet heavy-combat plates; move detailed enemy tools into pause/help, retaining touch/controller access.

## Step 2 world study and application

Re-read local `src/presentation/scenery.ts`: a slightly lowered base supports batched tiles/inlays, quiet quarter-turn variation, and explicitly placed prop instances. Its floor holes replace selected tiles rather than covering them with a flat decal. Readability comes from geometry/contact layers and restrained floor values. REDLINE uses independently authored mixed steel plates, inset missing-plate machinery, a real recessed grate/pit, and an existing fractured-plate room. Chapter-owned deterministic placement is shared between visible grates and the speed-boost rule; cosmetic props remain outside simulation collision. The background catalogue is rebuilt as original compact geometry and vertex-animation batches, with a separate lower-detail batch. No scenery implementation, models, textures or names copied.

The four owner arena references were inspected again: ref1 armoured frame/lamp/giant silhouette, ref2 recessed multi-level machinery, ref3 edge smoke/embers, ref4 fissures and wrecks. Their checker colours and dense dark contours do not override the later tonal-floor/clarity rules. Exact reference fidelity needs measured comparisons and independent/owner review; implementing a checklist is not match approval.

## Audio mapping (for Step 4, continued)

Read the architecture comments and cue routing in `sound.ts` / `audio.ts`. This snapshot primarily synthesizes layered click/thud/crunch/swish/metal sounds with WebAudio, unlocks on a gesture, pre-renders where practical, rate-limits repeats, caps/prioritizes voices, pans by screen position and ducks the mix. It is not permission to copy its sound-generation code. REDLINE will implement an independent cue/bus/map/pack system with fallback synthesis and optional private owner files. Owner-supplied music currently exists under `close1/public/audio/music/`; none is shipped or staged during Step 1.

## Verification and limits

## Steps 3–5 application

Revisited local host/scene feedback, combat-light, sound/audio and HUD principles while extending the close-out: retain a short anticipation/contact/aftermath, distinguish role reactions, use small capped sparks/lights, and keep cosmetic camera effects outside simulation. REDLINE's new Boost drift, shield break and timed synergy state are original deterministic rules; the renderer reads snapshots. High AO excludes transparent planes from normal/depth capture and stays optional. Normal/Low effects reuse existing batches to preserve measured budgets.

The audio rebuild uses its own typed cue map, gain buses, capped prioritized voices, per-cue original synthesis and music file manifest. No Spirit Call synthesis code was copied. The garage applies the reference's left-card/central-character/right-stats hierarchy with REDLINE's rotatable Core, original part/cosmetic registry and local mission/save flow. That functional hierarchy does not establish visual parity; the outstanding world/art findings remain valid.

Compare real REDLINE captures at 1280×720 and 1920×1080 to the local combat target at matched sizes, plus compact viewport regression. Review blurred grayscale frames and normal motion; do not infer success from colour alone. An independent judge and the owner must assess the Step 1 clarity gate. No assertion that REDLINE has already beaten Spirit Call's polish.
