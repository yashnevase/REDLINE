# CLOSE Chapter 1 — Step 1 review

2026-11-01. The supplied `close1/docs/CLOSE_CHAPTER_1.md` is preserved unchanged as `docs/CLOSE_CHAPTER_1.md`. This report covers Step 1 and the owner's direct request for travel outside the hazard frame and more enemy pressure. Chapter 1 is **not closed**.

## Item ledger

| ID | Status | Evidence | Note |
|---|---|---|---|
| Study | DONE | `SPIRIT_CALL_NOTES_CH1.md` | Local lighting/materials, feedback/camera, UI and audio routing studied before implementation; no reference source/assets copied. |
| AREA | DONE | `../test/close-area.test.mjs`; `../shots/close-step1/beyond-frame-{desktop,large,compact}.png`; `report.json` | Actual play bounds expand ±17→±21. Frame remains an interior marking. Camera follows to ±17. Corner machinery has deterministic keepouts and inward escape resolution. Browser reaches x20.255 through ordinary movement. |
| Pressure | DONE | `../src/content/combat.ts`; area test; normal clip | Opening threats 6→8; 12 live/3 attackers retained. Goals and minimum waves retained. This increases initial simultaneous pressure, not total formation size. Human difficulty remains to be reviewed. |
| CL1 | DONE | `clarity-{desktop,large}.png`, `crowd-{desktop,large}.png`, `squint-{1280,1920}.png` | Stronger warm key; quieter, less saturated floor, larger painted plate subdivisions, thinner seams and fewer marks. Actors lead in grayscale. |
| CL2 | DONE | Same actual combat frames; normal clip | Vent smoke alpha ×.45 during fight/boss; central fight stays free of fog. Live vignette alpha reduced. Edge plumes remain. |
| CL3 | DONE | Same lineup/crowd/outer-belt captures; `report.json`; judge below | Default desktop Core nominal height10.54%; violet-white Fresnel on existing shell, stronger pool, cool Overdrive aura. Damage labels clear projected Core; center bonk stars suppressed, overlapping actors fade to8%, hurt flash reduced. |
| CL4 | DONE | Five-role lineups and 12-enemy crowded captures | Red pools .12→.16; brighter eye surround and cool rims; existing orange floor warnings stay above detail. |
| CL5 | DONE | `help-{desktop,large,compact}.png`; normal clip | Desktop objective/health footprints shrink ~23–25%; skill group scale .85. Detailed Enemy tools moves to pause, collapsed by default. Heavy-combat plates use60% background alpha. Compact redundant score row removed while score remains in first line; controls keep their function. |
| Step 1 gate | BLOCKED — owner review | Local `art/match/close-step1/cmp-{1280,1920}.png`; independent review below | Independent screenshot judge passes after correction. Owner acceptance remains open, as required by the supplied plan. |

Paths in the table without a directory prefix are under `shots/close-step1/`. This folder contains our captures only. Reference-containing comparisons stay local under ignored `art/match/close-step1/`; no target images ship.

## Independent visual review

Initial judge verdict: FAIL for crowded combat, despite readable lineup/outer-belt scenes. Damage labels and white contact effects covered the Core; transparent foreground actors formed a busy veil; compact objective covered the upper crowd.

Corrections were checked in the **same** 12-enemy, 70-tick stress fixture, not a reduced crowd: labels move beyond the projected Core rectangle, nearby bonk stars no longer cover it, occluding actor alpha .22→.08, hurt shell flash .6→.18, duplicate compact score row removed. The stress fixture deliberately uses high HP to hold the crowd; it is diagnostic, not normal balance evidence.

Updated verdict: **PASS for supplied Step 1 clarity frames** at both desktop sizes and grayscale. Core silhouette is readable in the crowd, compact objective clears upper enemies, central haze and desktop HUD are acceptable. Caveats: labels can still bunch above enemies and radial contact effects remain strong. Judge approval covers screenshot clarity; it does not establish motion quality, exact reference fidelity, universal hardware performance or owner approval.

## Validation and budgets

- `pnpm check`: 106 passing tests, TypeScript, Oxlint, both Ritmo audits and source/content validation. Area test verifies frame crossing, bounds, four machinery corners and eight opening threats. Existing wall-relative projectile and camera tests updated to the new tuning; occlusion tests verify live merged materials fade and restore without mutating shared originals.
- `pnpm build`: passes; production validator excludes references and debug API. Existing >500kB bundle advisory remains.
- `tools/close-step1-review.mjs`: 1280×720,1920×1080,844×390; no browser errors, real pause/help interactions and frame crossing; nominal Core heights10.54%,10.54%,10.74%. Nominal height is diameter divided by current orthographic view height, not pixel silhouette segmentation.
- `tools/close-step1-compare.mjs`: five-role lineup plus 12-enemy diagnostic, colour and grayscale inspected at both requested sizes. The Spirit Call target is resized to the matching frame dimensions for the local side-by-side; different mechanics and camera context limit exact equivalence.
- `tools/close-step1-perf.mjs`: 18 cases: three viewport sizes × Standard/Low ×12-enemy crowd/Rex+6/corner. Headed Chromium with Metal requested on this Mac. Standard peak90 calls/46,988 triangles; Low70/23,719; observed p95 ≤17.6ms. `perf.json` is the authoritative case-by-case record. This harness requests Metal; it does not independently assert the unmasked GPU string. Low remains at its70-call cap.
- `tools/production-playtest.mjs`: production startup, no debug API/settings panel, Options/resume, touch ability, death/retry and local Blade equip/reload pass. Emulated compact browser, not physical phone certification; owner waived that gate.
- Normal-stat full headless bot reaches Rex alive at120HP in115.28 simulated seconds over12 waves/124 kills. Maximum wave-index bonk gaps1.48/1.70/1.10/1.20s. This is a skilled bot; it clears faster than the prior six-opening case and does not prove longer human sessions or desired difficulty.
- Normal-play clip: `../shots/close-step1/normal-play.mp4` (last32 seconds of real-time playback of deterministic ordinary bot input; no fixture HP modifications). Original desktop recording also contains brief lineup/help/area checks before normal play. Viewed motion board: `motion-board.jpg`.

## Switches and tuning

`src/content/items/cl-clarity.ts` holds CL1–CL5 and independent expanded-deck/extra-pressure switches. Disabling them restores their previous branches without removing code. New simulation defaults are content only; presentation changes do not write simulation state or consume simulation randomness.

Primary values: play half-width21, camera inset7 (clamp17), opening threats8, key light3.1, Default desktop zoom1.05, locator opacity.33, rim strength1.5, enemy glow.16; combat smoke multiplier.45. The existing numeric tuning panel exposes combat/render defaults. Label clearance, smoke/HUD treatment and feature switches live in the new isolated clarity modules and associated presentation code. Re-run full replay/budgets after changing them; this step does not claim the all-flags-on/off Chapter QA gate.

## Owner-message audit

| Owner request | Mapping / result |
|---|---|
| Go beyond black/yellow frame; more enemies | AREA/Pressure above, real crossing and collision test. |
| Follow close1, study Spirit Call, clarity first | Canonical directive and study notes preserved; CL1–CL5 implemented/reviewed. No claim of beating reference art fidelity. |
| Atmosphere, grounded 3D world, damaged varied rusty floor, alive outer space, original steel blades | Existing arena-depth work retained; this pass cleans values and haze. Full C1–C9/AM1–AM8 gaps remain Step2. |
| Rotatable lobby, zoom, device glyphs/bindings, eyes, boss answers, readable upgrades, wave repair and score/health/progression | Existing Session2 features retained; CL5 clarifies HUD/help. Expanded map does not replace these features. Continued full QA is Step6. |
| Angle/timing/counters, Whirler/spikes, Q/E/X, damage wear, effects/transitions | Existing mechanics remain. New CL6–CL9 roles/synergies and Session4 additions are Step3, not silently declared complete here. |
| Seeded gameplay vents, chapter themes, scenery/reactive props, final reference match | Still required Step2; previous partial environment work is not full acceptance. |
| Private music/audio, save/mission select/workshop | Authorized in CLOSE, scheduled Steps4/5. Audio remains ignored/private and unloaded now. |
| Reversible changes, no missed items, all input/device classes | Item-prefixed commits and switches; no owner files removed. All remaining IDs retained below. Phone waiver persists; no universal-device claim. |

## Not done / next ordered work

The source directive explicitly requires a Step1 **judge + owner** clarity gate. Judge now passes; owner review remains. Do not tag `chapter1-complete` or report the chapter as finished.

After that gate, follow the ordered work without reopening already authorized design choices:

1. Step2: all C1–C9, D/E, AM1–AM8, especially boost-vent simulation, complete scenery/parallax catalogue, smashable/reactive props, finished giants, chapter config and per-level fairness/reference gates.
2. Step3: CL6–CL9, all G1–G3,H1–H3,I1–I10 from NEXT_WORK. Unique Spin/Boost/Stomp roles and synergies, spark language, per-role animation and graphics tiers.
3. Step4: CL10–CL13; independent audio architecture/cue map/fallback, private pack/build exclusion, owner music scan/crossfades and saved audio UI. Private music has not been copied into runtime assets.
4. Step5: CL14–CL16 versioned profile/export/import, selectable missions, 3D workshop/parts/cosmetics.
5. Step6: CL17–CL19 full clean/existing-save mission/input/audio/flag/soak QA, player script and pipeline. Tag only after every gate actually passes.

These future steps are not implementation failures or completed work. They remain in scope under the supplied sequence. Existing reports remain historical evidence rather than approval of those unfinished gates.
