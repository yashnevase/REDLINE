# Arena depth and combat pace — owner review pass, 2026-11-01

This is an implemented improvement pass, not a claim that Session 3 or the exact reference match is complete. The new kit now renders in the playable game as well as the showcase.

## Changes and evidence

| Area | Implemented | Viewed evidence |
|---|---|---|
| AM1–AM3 / GROUND | Lit armoured deck, quiet worn plate atlas with grates/bolts/patches, physical floor surface aligned below shadows/rings/scars; stronger corner machinery and hazard frame | `shots/arena-depth/level-1-{desktop,compact}.png`, `normal-{desktop,compact}.png` |
| AM4 | Four-unit-deep cosmetic machinery recess, exposed gears, ladder, grate deck, warm interior point light, side platforms and stairs | `level-2-{desktop,compact}.png` |
| Level 3 / AM3 | Actual irregular clipped/bevelled plate meshes with open fissures over a lower emissive layer, rather than orange lines drawn over intact tiles | `level-3-{desktop,compact}.png`, `fx-blade-*` |
| AM5–AM8 | Two chamfered humanoid scrap silhouettes; nine differently oriented/scaled wreck, scaffold and crane assemblies; drifting/turning geometry, rotating saws, billowing smoke and embers; stronger smoke with Heat/Overdrive and chaos preview | `level-1-*`, `chaos-*`, gameplay clips |
| C4 / fight feedback | At most three short-lived impact point lights, warm/blue steel sparks, floor FX visible above the plate tops, lamp light pulses | `fx-{blade,stomp,boost}-{desktop,compact}.png`, normal clips |
| D / longer fights | Goals 10,000 / 24,000 / 40,000; minimum 3 / 4 / 5 waves; six opening enemies; 12 live / 3 attacking caps retained. Six goal/minimum fields are validated saved tuning and exposed in development controls | HUD captures, `test/d-run-pace.test.mjs`, full browser/headless replay |
| UI1 | Duplicate wave panel suppressed when objective HUD is active; repair and ability announcements separated; goal banner yields to hit/ability queue; Overdrive disabled text more readable | `normal-{desktop,compact}.png` |

Normal-stat deterministic bot: **124 kills across 12 waves, 130.73 simulated seconds to Rex**, alive at 120/120 after a legitimate HP upgrade. Longest bonk gap 1.85 seconds. Earlier S2 bot reached Rex in roughly 33 seconds. These are regression measurements, not human balance acceptance or a promised human run length.

## Validation

- `pnpm check`: **105 tests pass**, TypeScript, both Ritmo audits and content/source validation.
- `pnpm build`: passes; no reference/debug assets shipped. Existing bundle-size advisory remains.
- Actual browser desktop/compact upgrade inputs, level continuation, Overdrive, three levels to boss/reward and exact headless replay: pass with accelerated diagnostic setup. Diagnostic upgrade fixture now uses current goals/minimum waves instead of stale 3,500-point setup.
- Production startup/no-debug exposure, actual touch ability, Low/reduced-motion options, loss/retry and saved Blade equip/reload: pass (`shots/arena-depth/production.json`). The local production preview remains `http://127.0.0.1:5199/`.
- 36 room/viewport/tier/stress cases on headed Apple M4 Metal: Standard **90 calls / 47,584 triangles**, Low **70 / 24,013**; measured p95 **≤17.7 ms**. Standard measured before the final Low-only floor consolidation; all 18 Low cases rerun afterward. Standard geometry was unchanged by that Low-only change. Final combined passing ledger: `shots/arena-depth/perf-final.json`; source iterations are `perf-before-low-lod.json` (Standard rows) and `perf-low.json` (final Low rows).
- Low floor uses a coalesced painted deck with actual pit/fracture openings, rather than hundreds of coplanar meshes. Fewer corner collars/secondary saws, roughly one-third of wreck dressing and reduced smoke retain the budget without changing gameplay.
- Geometry tests assert visible fissure area, plate-top height below combat FX and an exposed deep pit. Pace tests assert no score shortcut past minimum waves, tuning defaults/round-trip and custom targets.
- Actual desktop normal clip includes 32 seconds of normal-stat bot input, plus compact play and actual ability captures: `shots/arena-depth/normal-{desktop,compact}.webm`. Reference images remain local study targets, never runtime textures.

Retrieval checkpoint: `arena-depth-review` on the owner's REDLINE repository. Curated captures, performance ledger and clips accompany the source; raw capture attempts and reference pictures remain local.

## Comparison and owner-note audit

Studied the supplied four arena images and local Spirit Call combat/lobby screenshots plus its scenery/combat-light implementation principles. No reference code, character or texture was copied. Fresh judge found the first pit too hidden, lava too much like a wireframe, and overlapping HUD notices. Subsequent changes expose/deepen the pit, replace the lava overlay with separated irregular geometry and reposition notices. Local numbered comparison remains under `art/match/arena-level1/`; grayscale/blur captures are under `shots/arena-depth/`. No validated silhouette-IoU score or owner art approval is claimed.

Latest owner message audit: map geometry/depth → AM1/AM3/AM4; atmosphere and lively space → AM5–AM8; collision/combat sparks → C4 and corrected floor/effect heights; more time/enemies/score adjustment → D; Spirit Call comparison → local study and fresh judge. All latest-message concerns have concrete implementation work and evidence.

## Still not done

Exact arena fidelity remains open: richer irregular machinery silhouettes, wreck detail, denser asymmetric wear and more developed warm/cool atmosphere are still below the supplied art. This pass does not mark AM1–AM8 visually accepted. Existing full Session 3 work also remains: seeded/separated boost-vent gameplay, full C3 scenery catalogue, C7 smashable props, C8 reactive plate movement, complete chapter configuration consumption and final Session 3 gates. Session 4 remains future work. No human first-minute comprehension, physical-device or universal FPS claim; owner's phone waiver remains in force.
