# Spirit Call study for Chapter 1 close-out

2026-11-01. Study only; implementation is rebuilt in REDLINE. No code or art copied. The owner's new audio permission is narrower than a general reuse licence: private audio only, never public assets/builds.

## Lighting and materials

Read `ref/spirit-call/spirit-call-main/src/presentation/host.ts`, `scenery.ts`, `scene.ts` and reviewed combat/lobby targets. The host uses a hemisphere and directional key with calibrated physical intensity, readable silhouette lighting, and batched blob/contact shadows. Floor/scenery is data-driven, using an understated base below tiled surfaces and deliberately selected inlays; geometry and contact cues carry depth. Apply a cleaner lower-saturation floor, stronger warm key, cool silhouette separation and shadows above the actual floor. Atmospheric effects must not veil the player.

## Combat feel and VFX timing

Read scene feedback/camera flow and `combat-light.ts`. Presentation interpolates state, decays shake/kicks, uses bounded short-lived light/ribbon batches, and separates anticipation/contact/aftermath. Our arena must preserve honest telegraph sizes and a bright Core location, rather than stacking flashes over it. Keep sparks in bounded pools; quiet modes suppress motion/flashes without changing the simulation.

## UI scale

Read `hud.ts` and reviewed `combat-lava-swarm.png` / `menu-hero.png`. Desktop and touch presentation deliberately differ; the touch pad has its own hit regions and device switching. HUD uses a compact top objective, thin health information, clear skill slots and menu/help. Apply desktop-only panel reduction and quiet heavy-combat plates; move detailed enemy tools into pause/help, retaining touch/controller access.

## Audio mapping (for Step 4)

Read the architecture comments and cue routing in `sound.ts` / `audio.ts`. This snapshot primarily synthesizes layered click/thud/crunch/swish/metal sounds with WebAudio, unlocks on a gesture, pre-renders where practical, rate-limits repeats, caps/prioritizes voices, pans by screen position and ducks the mix. It is not permission to copy its sound-generation code. REDLINE will implement an independent cue/bus/map/pack system with fallback synthesis and optional private owner files. Owner-supplied music currently exists under `close1/public/audio/music/`; none is shipped or staged during Step 1.

## Verification and limits

Compare real REDLINE captures at 1280×720 and 1920×1080 to the local combat target at matched sizes, plus compact viewport regression. Review blurred grayscale frames and normal motion; do not infer success from colour alone. An independent judge and the owner must assess the Step 1 clarity gate. No assertion that REDLINE has already beaten Spirit Call's polish.
