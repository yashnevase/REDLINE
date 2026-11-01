# CLOSE Chapter 1 — Step 2 implementation checkpoint

2026-11-01. Owner said "proceed" after Step1. Ordered world implementation is complete below; **the full reference-art gate has not passed**. The owner's earlier instruction to continue all phases without intermediate asset stops remains in force. Continue approved implementation in order, retain the failed comparison findings for the final review, and withhold `chapter1-complete` until all gates pass. No visual acceptance is inferred from a silhouette score or from permission to continue.

## Item ledger

| ID | Status | Evidence / result |
|---|---|---|
| C0 / GROUND | DONE implementation | Quiet chapter-owned rust/steel floor, mixed2–4u plates, thin joints, welded/bolted paint, broad localized outer grime; original generated wear composited into procedural UV atlas. Gameplay actor readability retained. |
| C1 | DONE | Shared integer-seeded per-level layouts: five vents, ≥9u separation, clear central8u; floor grates connect visually to rim stacks. L2/L3 have two marked boost vents; L1 introduces ranged lanes with steam-only vents. Entry gives ×1.5 speed for60 active ticks, doesn't refresh while parked, rearms after leaving, freezes in menus. Tests cover legacy/active snapshots, expiry/reentry and exact replay. |
| C2 | DONE implementation | Mixed plate topology, dents/weld/scratch paint, six inset missing-plate machinery openings, glowing underlayer, kicked scrap and persistent/fading fight scars. L3 uses physically extruded inset fractured plates. |
| C3 | DONE catalogue; visual gate open | Nine distinct catalogue roles: crushed car, ribbed container, conveyor, pendulum, gears, crane/cables, abstract neon board, passing hauler, meteor scrap. Three depth/parallax bands, plus six close kinetic modules visible from the outer belt. Low keeps four wrecks and two close modules, with fewer details. See motion caveat below. |
| C4 / H3 | DONE implementation | Warm key/cool fill, cool Overdrive and enrage tint, two selected vent point lights, bounded three event lights, floor pools and steam shafts, High-only shimmer treatment. **Enabled previously disabled sun shadows**, cached per room on Standard/High; Low uses cheaper contact treatment. High emission mask now includes palette-baked neon and marked Core eyes/slashes. |
| C5 | DONE | Bolted hazard-striped low barricades with glow strips, reduced trim on Low, physical existing colliders retained. |
| C6 | DONE | Quiet rune/pool, edge steam/embers, metal chips, kicked debris, broad non-gory grime/splatter and nearby prop rattle. Fast-tick repeated renders no longer duplicate kicked scrap. World reactions ingest each simulation view, not just rendered frames. |
| C7 | DONE | Cosmetic cans/crates/barrels crush on dash, Stomp or heavy contact; one burst, settled non-collidable debris capped48; five props on Low. Reset/rewind and no-sim-write tests pass. |
| C8 | DONE implementation | Rigid plate-centre shader depression with0.3s settle and tunable50mm peak; regular Standard/High and fractured-plate geometry react. Low's broad single floor uses the cheaper impact cue. Vent pools illuminate plates. Screenshot alone does not certify perceived animation quality. |
| C9 | DONE geometry; art acceptance open | Articulated faceted scrap humanoids with tapered limbs, joints, rib plates, eyes and separate depths; omitted on Low. Last independent judge still found their earlier iteration too clean/geometric. |
| D / E | DONE | Chapter palette, tile settings, prop density, vent limits, background layers, per-level seeds/room/mechanic/roster read by scene and/or simulation. Three independent normal-stat level bots pass and replay exactly. Existing score→wave-clear→upgrade→level→Rex→Blade loop retained. Goals10k/24k/40k and minimum waves3/4/5; play bounds±21 and pressure8/12/3 unchanged. |
| BL1 / BL2 | DONE implementation | Existing original mirrored steel hands retained. Same steel model for thrown/orbit/fan/ring shots, edge glints, purple motion glow, brief floor-stick/shrink-out. Low caps stuck blades at2, Standard8. |
| UI1 / UI2 | DONE retained | Existing fixed announcement lanes and Heat ticks retained. Vent boost uses the ability lane; no extra instruction plate added. |
| AM1–AM8 | BLOCKED — full art gate | Frame/slab/pit/fissure/giant/wreck/smoke/motion structures exist and improved across comparisons, but the independent full-match verdict was FAIL. Exact owner-approved look is not declared achieved. |

## Evidence

Actual game artifacts under `shots/close-step2/`: three-room desktop/compact overviews, top-down layouts,32s normal play, vent entry, prop before/burst/settled states, floor response, quiet modes,12s overview animation and a12s ordinary-stat outer-belt fight at the available Far camera preset. `features.json`, `atmosphere.json`, `fairness.json`, `report.json` retain measurements. The outer-belt clip uses normal HP/damage and recorded player intents, not boosted test stats. The stress/performance fixtures deliberately use high HP to keep a crowd and are not human-balance evidence.

Local reference-containing images remain ignored under `art/match/close-step2/`: `cmp-1.png`–`cmp-4.png`, numbered raw/mask captures, manual slab outlines and overlays. Main-slab-only IoU proxies were0.85–0.91 in iteration3; they exclude background and do **not** measure material, pit composition, atmosphere or overall match. Later iterations retain their own masks. Target images never enter runtime assets.

Independent review initially failed clean/uniform floor/slab, insufficient pit circulation/stairs/platform scale, sparse boxlike background and insufficient normal-frame motion proof. Follow-up work added chamfered face armour, exposed pipes/gears, pit crosswalk/lip/stairs/larger side platforms, thicker fissure plates, tapered giants, layered wrecks, distinct peripheral chaos smoke, painted material wear and real static shadows. Earlier follow-up still failed the full art gate. Latest materials/shadows/close-motion evidence remains for final review; do not convert that into a pass by inference.

## Verification and budgets

- `pnpm check`: **113 tests pass**, TypeScript, Oxlint, two Ritmo audits and source/content validation. New state defaults migrate pre-vent snapshots; active boost snapshots round-trip through the runtime. Render-repeat regression reproduced two chips instead of one, then passed after tick-owned ingestion/deduplication.
- `pnpm build`: passes; existing large-bundle advisory remains. References/debug API excluded; no private audio copied into runtime or distribution.
- Three independent normal-stat bots, starting without earlier-level upgrades, clear levels1/2/3 in22.77/42.40/61.38 simulated seconds at120HP after earned upgrades/repair. Maximum bonk gaps1.33/1.17/1.30s; exact independent replay. These are bot results, not human difficulty acceptance.
- Three rooms × desktop1280×720 / compact844×390 × crowd12 / Rex+6 / corner × Standard/Low =36 cases. Headed Chromium, verified ANGLE Metal Apple M4. Measured steady gameplay maxima: Standard **92 calls /57,378 triangles**, Low **70 /24,951**, p95≤17.7ms. Low is very close to its triangle cap. Static shadow generation is cached; room-entry shadow work is separate from steady rendering.
- High measured separately across18 equivalent cases: **179 calls /113,034 triangles**, p95≤17.6ms on this Mac. High is not held to Standard/Low geometry limits. These measurements precede the final reaction deduplication/close-module spacing cleanup, which does not add geometry or draw submissions. Final chapter QA rechecks all active features together.
- Physical phone gate remains waived. Compact/emulated input tests do not certify all devices.

## Tunables and provenance

Content switches: `src/content/items/c-world.ts`, existing AM/BL switches. Numeric defaults are validated combat/debug fields: speed factor1.5, duration60ticks, trigger1.1u, steam240/48ticks, debris48, settle0.3s, depression0.05u. `overviewElevation` exposes a diagnostic top-down view independently of the player camera. Chapter config owns5 vents, separation9, exclusion8,12 props,3 layers,9 wrecks and Low fraction0.4.

Original geometry, shaders, Canvas armour paint, layout and gameplay authored in this repository; Spirit Call was studied, not copied. The only new shipped raster is original built-in imagegen output [deck-wear-v1.png](../public/textures/deck-wear-v1.png); exact tool/prompt and fallback policy: [PAINTED_MATERIAL_PROMPT](PAINTED_MATERIAL_PROMPT.md). No new dependency, external model, music/SFX download or service account. Owner music stays ignored/private in close1.

## Owner-message audit and not done

Requests for a larger fighting area/more initial enemies remain implemented; wider world detail is in real geometry, not a reference background image. Rust/grey/oxide palette, vents, damaged varied floor, moving scrap, steel blades, rotatable lobby, input glyphs, eyes, repair, readable goals/upgrades and boss/Blade progression map to the existing IDs above and Session2. No owner request was removed.

**Not done:** full AM reference/art acceptance and independent confirmation of six clearly moving background elements in the final normal-play view. Remaining approved CL6–CL19 / Session4 items are not claimed in this report. Continue combat/additions, audio, saves/mission/workshop, then full QA in the supplied order; retain all art findings and final owner approval as open gates. No Chapter1-complete tag yet.
