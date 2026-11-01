# Asset provenance — Phase 0

2026-11-01 CLOSE Step2: original seeded layout/vent rule, mixed plates/inset machinery, cosmetic props/debris/reactions, industrial catalogue, chamfered armour/pipes, tapered giants, atmosphere animation, two-surface Canvas armour paint and selective-emission/shadow changes authored locally. No Spirit Call source, models, textures or audio copied. New shipped original raster `public/textures/deck-wear-v1.png` was generated with built-in imagegen using a text-only original-material prompt, copied unchanged from the Codex generated-images directory; see `PAINTED_MATERIAL_PROMPT.md`. It is diffuse paint composited onto physical meshes, not an arena target/background. Existing procedural material remains a fallback. No dependency, paid external service, account or downloaded third-party asset added.

2026-11-01 CLOSE Step 1: original Core Fresnel shader addition, label clearance, floor paint/value changes, smoke dimming and HUD/help code authored locally. Spirit Call sources/captures studied only; no code, image or audio copied. Owner-supplied `close1/public/audio/music/theme.mp3`, `battle-01.mp3`, `battle-02.mp3`: **private use, not redistributable**; source: owner's close1 folder, underlying rights not asserted. Files remain ignored in that folder and outside the shipped public directory. Step 4 audio integration and public-build exclusion remain future work; do not copy these into deployable assets before exclusion is implemented.

2026-11-01 arena-depth pass: original Three.js armoured deck, inset machinery pit/bridge/stairs, half-plane-clipped fractured plate geometry and lower emissive layer; original runtime world-space canvas wear/grate/bolt atlas; original shaded scrap-mech silhouettes, wreck/crane/scaffold geometry, drift shader, smoke/ember pools, bounded impact point lights. No external model, texture or generated target image is shipped. `art/arena-ref/` remains study-only. Spirit Call's local scenery/combat-light source and combat/lobby screenshots were studied for layering, contact/readability and bounded pooling principles; no source code or assets were copied.

| Shipped item | Source | Licence / status | Notes |
|---|---|---|---|
| Core, Sawlet, floor, walls, crates, pipes, gears, vents | Original procedural geometry in src/presentation/scene.ts and models.ts | Original REDLINE implementation | No reference meshes or code copied |
| Chrome matcap and contact shadow | Original canvas generation in materials.ts and scene.ts | Original REDLINE implementation | Generated locally at runtime; no external texture |
| HUD and styles | Original HTML/CSS in src/app and src/ui | Original REDLINE implementation | System font; no downloaded font/icons |
| Three.js runtime | npm three@0.187.0 | MIT; node_modules/three/LICENSE | Required renderer, bundled in production |

Study-only, excluded from production: all art/ and ref/ files. Spirit Call snapshot has no project licence, so no source, names or assets are reused. Target screenshots are for review only. Tooling dependencies are recorded exactly in package.json and pnpm-lock.yaml; Playwright browser binaries live in ignored project-local .cache/. No external services or audio.

Revision 2: original Core/Sawlet builders in models.ts, material preset variants and chrome reflection in materials.ts, authored FX in effects.ts, teal canvas backdrop in scene.ts, original inline SVG HUD icons and lobby UI in main.ts/style.css. No reference code, meshes, images, animations, fonts or icons copied. Reference projection/lighting studied for principles only; see VISUAL_REVIEW.md.

Revision 3: owner-authorized satin silver-grey matcap generated in materials.ts replaces the earlier blue chrome reflection. Original expanded floor/background machinery in scene.ts; dimensions defined in content/scene.mjs. No new external assets or dependencies.

Expanded floor uses an original 18-triangle slab mesh (top, four bevels, four sides, no hidden underside), replacing the general extruded tile geometry.

Phase 1: @typeonce/ritmo 0.19.1 (MIT) and Zod 4.6.7 (MIT) are runtime dependencies; notices shipped in public/THIRD_PARTY_NOTICES.txt. Matched Ritmo devtools/lint packages are dev-only. Input, simulation rules, actual attack telegraphs and pooled hit/trail/number effects are original REDLINE code. Engine smoke uses the installed public API, not Spirit Call source. No new character assets/polish in this phase.

2026-10-31: Ability/Heat rules, input mapping, cooldown HUD and pooled ring-colour changes authored in this project. No Spirit Call source/assets reused; no downloads or new dependencies.

2026-10-31 Phase 2: original procedural Thrower turret, Shieldsaw shield/rollers, Grinder gear-stack silhouettes, bounded encounter telegraphs/projectiles, wave/upgrade UI and all encounter code authored locally. Existing REDLINE Sawlet geometry reused internally. No Spirit Call code/art, external downloads or new dependencies. New enemies are readable gameplay silhouettes awaiting the owner-deferred character polish pass.

Phase 3 preparation: original procedural Scrap-Rex faceted torso, saw arms/teeth and preview/telegraph geometry authored locally from REDLINE identity principles. No legs, no reference assets/code imported, no new dependency/download. Profile schema/storage and loadout panel are original project code. Boss combat and Blade effect await design answers.

Phase 3 approved loop: original boss attack/state code, gap/volley/summon presentation, enrage cracks, floating Blade saw and cleave arcs, local profile and equip/reward UI authored locally. No Spirit Call source or assets reused; no downloads or dependencies added. Reference screens used only for visual comparison.

Phase 4: original preferences/options UI, accessibility wiring and material batching helper authored locally. Existing project meshes/materials reused internally; no external code/art, download or dependency added. Geometry batching preserves original shapes and animated parts.

Readability follow-up: lane-warning geometry, camera-relative occluder fading, warning rims and encounter banner code/styles authored locally. Existing materials cloned only within bounded actor pools; no new images, external code/assets or dependencies. No outlines added to characters.

## Startup reliability follow-up

Startup/retry UI, explicit presentation resets and regression/capture code authored locally. Existing meshes, number canvases and materials retained. No reference code, external assets, dependencies or downloads introduced.

Look Lock: locally authored two-octave lava shader, vertex-tone prop shading, additive floor spill and procedural pooled impact layers. No downloaded textures/models, reference code or new dependencies. Baselines copied from previous local engine captures. Supplied sprint copied with explicit owner clarification.

## Sprint 2 provenance
Read supplied concept contact sheet and arena reference. Space-stage geometry, stars, slate-purple palette, painted matcap highlights and halo authored locally; no external assets or reference code copied. No dependencies/downloads added.

## Reference-match provenance

Core ref.png cropped from supplied labelled Core sheet row 1/cell 1 [76,29,220,160]; no source image ships as a texture. Candidate painted matcap, curved patches/expressions and preview variants authored locally. tools/measure-core.py uses installed Pillow + Python standard library; no NumPy/download/install. Original object-ID mask/overlay pipeline authored locally, no Spirit Call script copied. Fresh judges were explicitly requested by owner workflow.

## Core cycle 2 original Blender hardware

Original tools/build-core-sockets.py generates art/match/core/source/core-sockets.blend and public/models/core-sockets.glb. Five material roles; runtime converted to painted matcaps. Source coordinates/pivot/GLB normals/bounds validated; no reference code or texture copied. New Blade shape, brushed face texture, soft link and matcap fields authored procedurally. Support ref-side.png cropped from owner numbered sheet cell9 [354,132,490,225]. No installs/downloads/new dependencies.

## 2026-10-31 completion pass — original industrial kit and painted wear
Original Blender geometry authored in `tools/build-industrial-kit.py`: chamfered saw, curved upper/lower shield, armour patch and retained plank. Source `.blend`/bounds report: `art/match/industrial/source/`; shipped `public/models/industrial-kit.glb`. Core sockets remain original `tools/build-core-sockets.py` / `public/models/core-sockets.glb`. Both load before readiness and support an explicit retry on failure. Geometry UVs and painted rust/scuff maps are authored locally from math/seeded canvas brushwork, not sampled from reference pictures. Three's installed MIT-licensed addon loaders/postprocessing/geometry utilities are imported normally. No Spirit Call code/assets or unlicensed reference bitmaps were copied into the product; no new download/dependency was installed.

## 2026-10-31 FEEL_SPRINT

Gameplay industrial LOD is generated by `tools/build-game-lod.py` from our original retained Blender source, exporting `public/models/industrial-kit-game.glb`. Compact gameplay Core ports, merged vertex-colour/emission actor surfaces, afterimages, dust, atmosphere shaders and overlays are original code. Detailed studio hardware remains available. No Spirit Call code, art or textures are shipped.

Bundled unmodified **Barlow Condensed Bold Italic**, Copyright 2017 The Barlow Project Authors (https://github.com/jpt/barlow), SIL Open Font License 1.1. Retrieved from the official Google Fonts repository: https://github.com/google/fonts/tree/main/ofl/barlowcondensed . Files: `public/fonts/BarlowCondensed-BoldItalic.ttf` and accompanying `public/fonts/OFL.txt`. Used for damage text and display moments; no runtime font service. No dependencies or paid services added.

## 2026-10-31 FEEL_SPRINT_2
Original instanced radial speed lines, six-sample motion ribbon, velocity-stretched gradient spark quads, impact stars, team floor pools, palette batching and floor scuffs/sweep authored in the existing Three.js code. Existing original meshes, textures and bundled OFL Barlow font are reused. No reference images/code are embedded; no new download, package, account or paid service. Study-only reference comparisons remain ignored/local. Review clips and screenshots are captures of our game.

## 2026-10-31 DEPTH_SPRINT Part A
Original rigid Core matcap shader extension: rotating panel seams/flush bolt paint, scratch/dent/crack masks and heat-lit damage; original bounded anticipation/impact response. Dash scrape particles and scar smoke share our existing instanced motion pool with an original radial canvas mask. Cosmetic randomness uses a separate seeded presentation stream, reset on restart/rewind; simulation RNG is untouched. Spirit Call player/animation/config/character/actor sources were read only for movement principles, recorded in SPIRIT_CALL_MOVEMENT_NOTES.md. No reference code, shaders, textures, characters or names copied. No external download, install, dependency or service added.

## NEXT_WORK Session 2 (2026-10-31)
Original procedural steel/rust vertex paint and streak shader, fixed-topology intensity eyes, Whirler arms/warning sectors, instanced saw/spike projectiles, scars, Spin/Stomp/Boost shader layers, exposed-plate shading and UI icons were authored in this repository. Existing Core/enemy hardware remains the original project kit. Spirit Call remains study-only; no reference image, model, code or texture was incorporated. Low roster LOD uses Three.js's already bundled SimplifyModifier/meshoptimizer 1.1; its MIT attribution is included in public/THIRD_PARTY_NOTICES.txt. No new package install or downloaded asset.
# Chapter 1 audio and additions — 2026-11-01

Original implementation: named cue projection, independent WebAudio fallback synthesis, procedural UI/garage/cosmetic shaders and original effects. Spirit Call sound/host architecture studied only; no audio source code or SFX copied. Three.js built-in SSAOPass is MIT under the existing Three.js dependency; no package added.

| Local-only file | Source | Status |
|---|---|---|
| `public/audio/music/theme.mp3` | Owner's `close1/public/audio/music/theme.mp3` | Private use, not redistributable |
| `public/audio/music/battle-01.mp3` | Owner's `close1/public/audio/music/battle-01.mp3` | Private use, not redistributable |
| `public/audio/music/battle-02.mp3` | Owner's `close1/public/audio/music/battle-02.mp3` | Private use, not redistributable |

Files were copied only after public build exclusion was implemented. They and their generated manifest are git-ignored; production build excludes the complete private audio folder and creates an empty music manifest. Underlying music rights are not asserted. No commercial music was sourced externally. Original synth effects/ambience work when these files are absent. Earlier no-audio/no-runtime-copy notes below describe earlier checkpoints.
