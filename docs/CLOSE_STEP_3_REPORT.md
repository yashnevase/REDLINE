# CLOSE Step 3 — combat and Session 4 implementation

Chapter remains a review checkpoint. This report records implementation and automated evidence; it does not pass the outstanding ARENA-MATCH or owner feel gates from Step 2.

| ID | Status | Evidence and behavior |
|---|---|---|
| CL6 | DONE | `test/cl6-combat.test.mjs`, `test/b4-abilities.test.mjs`: Spin has three ticks/pull and stays vulnerable; Boost moves 3 u over 12 ticks with steering, a once-per-target cone hit, knockback/90-tick mark and one 30-tick cooldown refund; Stomp breaks frontal shields for 180 ticks and exposes Rex. Stunned/marked Spin multipliers 1.5/1.25; perfect refunds clamp without extending protection. |
| CL7 | DONE, visual review open | Warm rust showers, blue-white chrome impacts, small metal tetrahedra, heavy falling sparks, skid sparks and capped event lighting reuse existing pools. Feature motion is captured under `shots/close-chapter/`. |
| CL8 | DONE, visual review open | Role-specific bounce/spin, shield shove/rattle, Grinder stagger, Whirler wobble, Thrower recoil/death pops; short Core lunge and existing phase camera/slow feedback. Quiet modes retain gameplay. |
| CL9 | DONE, visual review open | Original painted wear/AO and bevel/bolt/cable kit from Step 2, cached soft shadows, per-level exposure, High selective bloom/composite/optional SSAO. Transparent planes excluded from AO depth, AO strength bounded; grain/blur/refraction/chromatic effects are disabled by quiet preferences. |
| G1 | DONE | Auto High on desktop/Standard on coarse-pointer devices, sustained p95 >22 ms over 3 s after warm-up drops High→Standard→Low with toast. Manual selection stays fixed. `test/s4-extras.test.mjs`. |
| G2 | DONE | Existing 60 Hz sim/interpolation retained; saved resolution scale and fullscreen added; blur/visibility pauses retain explicit resume. |
| G3 | DONE for browser inputs | Saved controller dead zone/rumble preference and supported dual-rumble; existing keyboard, mouse zoom, multi-touch and controller routing. Four-size navigation captures plus input audit. Physical hardware remains unverified/phone gate waived. |
| H1 | DONE, visual review open | Impact/edge response, chromatic pulse, speed blur or streaks, Stomp ring/refraction, OD bloom/Heat grade, last-kill and phase slow feedback, style edge intensity. Reduced flash/motion remove their respective effects. |
| H2 | DONE | `src/presentation/cue-bus.ts`: named, throttled, deduplicated cue projection with intensity/position and optional dev logger. Tested cue coverage and reset. Step 4 consumes it. |
| H3 | DONE | Existing key/fill, event pools, cool OD and enraged lighting retained; High emissive mask and per-level exposure extended. |
| I1 | DONE | Saved SCRAP/GRIND/METAL/REDLINE meter: speed/variety/angle/no-damage retention, hit drops a tier, idle decay, 15% score bonus per tier. |
| I2 | DONE | Four off-center bumpers and incoming Rush/Charge wall reflection; saved ricochet context grants ×1.5 dash damage with callout. |
| I3 | DONE | Warned saw-cart rail and crusher, player/enemy damage once per cycle; three explosive barrels, knock-attributed SCRAPPED bonus. 48-tick warning minimum. |
| I4 | DONE | Up to 12 separate magnetic scrap pickups, score/Heat/small capped heal; shared world batch. |
| I5 | DONE | One graze per actual blade/projectile attack ID, excludes an already-awarded perfect dodge, bounded history. |
| I6 | DONE | Deterministic per-level Blackout/Scrap Storm/Vent Surge: exposure, hazard cadence and boost grates, displayed in HUD/banner. |
| I7 | DONE | Star-gated paint/trail/eyes and Rex trophy shader stripes, selected in Step 5 garage, saved without combat changes. |
| I8 | DONE | Low-HP damage ×1.3, brief entry pulse, warning eyes/vignette and heartbeat cue; no new immunity. |
| I9 | DONE | Results show combo, biggest hit, best style and kills; original local PNG highlights export. |
| I10 | DONE | UTC-date seed, shared seeded vents/props/twist, local daily best, no online service. A year of seeds ×3 levels is tested. |

## Checks, budgets and captures

`pnpm check` passes 130 tests, both Ritmo audits, TypeScript and source/content validation; production build passes. Flags-off 2,400-tick independent replay also passes. Expanded run snapshots keep neutral defaults for old state. All four missions and full campaign clear with ordinary stats for Core and Blade, with exact replays (`shots/close-chapter/mission-runs.json`). Bot results are not human balance acceptance.

54 headed M4 cases: 3 rooms × desktop/compact × Standard/Low/High × 12-enemy crowd/Rex+6/corner. Standard max **92 calls /58,698 triangles**; Low **70 /24,292**; High separately **179 /115,674**. Measured p95 ≤17.7 ms in this matrix, not a universal device claim. Low remains at its draw-call ceiling. Optional SSAO is separately smoke-tested and is off by default. Steady counts exclude cached room-entry shadow work.

Evidence: `shots/close-chapter/{perf,smoke,mission-runs,capture}.json`, real desktop/compact normal and ability clips, four-size UI screenshots, High+AO frame. Continuous captures and final functional verification are recorded in the Step 6 report.

## Tuning and owner audit

Validated additions live in `content/items/cl-combat.ts`, `s4-additions.ts`, `combat.ts` and the debug panel. Core ability cooldowns remain 2/3/4 s; caps remain 12 live/3 attackers; warnings and minimum 3/4/5 waves remain. Low roster simplification was increased and small gear debris became tetrahedra to make room without new draw calls. Controls, garage orbit, zoom and older approved functionality remain in scope.

Owner notes map to existing Q/B/F IDs plus C/AM world work and G/H/I additions. Larger playable bounds ±21 and eight opening enemies remain. No new chapter, copied Spirit Call code/art, external dependency, or online feature.

**Not done:** full reference match and final owner visual/feel acceptance remain open. Step 2 judge still finds insufficient L2 multi-level composition, irregular background silhouettes and chipped/broken-steel finish. This report does not overrule that verdict. Human first-time-player results are not yet available.
