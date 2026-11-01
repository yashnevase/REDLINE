# FINAL_POLISH — bounded work ledger

Active owner directive: `FINAL_POLISH.md`, supplied2026-11-02. It supersedes the old IoU/independent-art-match closing gate. The fresh judge identifies concrete gaps; owner reviews final pairs. Maximum three polish sessions, one targeted iteration on a rejected pair, then remaining art wishes go to POST_SLICE_BACKLOG rather than indefinitely blocking closure. Do not tag early or claim unimplemented systems are finished.

| Session | Scope | Status |
|---|---|---|
| 1 · 2026-11-02 | P0 look bible/baselines; P1 Core candidate and turntable | DONE · Core approved by owner |
| 2 | P2 equipment-specific abilities; P3 movers/declutter/vents; P4 interface/lobby | DONE · reports P2/P3/P4 |
| 3 | P5 world/material/effects finish; P6 layered mix; P7 QA and P9 close | DONE · P5/P6/P7; bounded P9 engineering close |

P1.2 owner approval received: “Approve Core; continue P2–P6”. P2–P6 implementation is complete, including the bounded P3.4 depth/silhouette iteration. P7 passes final graphics, saves/replay, production, input, dialog-sound and real600.082s soak checks. FINAL_P7_REPORT and FINAL_VISUAL_REVIEW record closure; final parity/listening remains owner-reviewed. Do not use an old failed art judge to create a new approval loop. Preserve the user's existing authorization for all remaining implementation.

## P0 baseline report

| ID | Status | Evidence |
|---|---|---|
| P0.1 | DONE | `LOOK_BIBLE.md`: structured source/screen study, one value/colour script, material/detail/VFX/UI/audio rules, per-room application. Source observations are distinguished from REDLINE art decisions. |
| P0.2 baseline captures | DONE | All seven pairs in local `shots/parity/`, manifest records scene, viewport, tick/state, Standard quality and aspect-fit/crops. `baseline-board.png` was viewed. Fresh judge reviewed all seven independently. |
| P0.2 final owner approval | Pending later polish | These are before-images, not final approval candidates. Regenerate after the relevant P1–P6 changes. |

Pairs: combat-desktop1280×720, combat-compact844×390, lobby, mission-select, workshop, hero-close-up, HUD. Others1280×720. Compact SC960×540 is aspect-padded, never stretched; hero views use separate documented subject crops. Spirit Call/reference-containing images remain ignored/local, never shipped or force-added to Git. Tooling: `tools/final-parity.mjs` then `tools/final-parity.py`.

Fresh judge gaps, highest priority per pair:

- Desktop combat: muddy continuous floor, weak structural depth, equally bright ring, rust bodies too close to floor values. P3/P5.
- Compact combat: panels/buttons crowd the arena, dense hit silhouettes and large flash obscure separation. P4/P5.
- Lobby: Core too small/low versus large pedestal; dashboard cards and tiny tracked labels; bottom-right identity/control crowding. P4.2.
- Mission select: equally weighted modal cards, weak selected mission/reward/launch hierarchy; small prose and stars. P4.
- Workshop: lobby reused instead of a distinct equipment hierarchy; native selects, crowded footer, clipped lower list. P4.
- Hero close-up: broad pale highlight and strong reflection band; hard eye outlines, blunt crown, weak socket bevel hierarchy. P1.
- HUD: SCRAP/COUNTER/vent text collision; rounded plates, tiny labels and competing utilities. P4.

No IoU score or match approval was requested. Static frames do not prove motion or audio. Base-Q blades are a known P2 bug in these baselines.

**Baseline checkpoint omissions (now superseded):** P2–P7 implementation/checks are complete; final pairs exist. Owner final pair/listening verdict remains pending. **Tunables:** no runtime changes in P0. **Budgets:** P0 only captures the unchanged130-test systems checkpoint; prior Standard92/58,698 and Low70/24,292 are baselines, not a fresh post-polish stress pass. P1 check/build and motion evidence are in its report. Existing normal-stat clips remain under `shots/close-chapter/`; the new Core clip is under `shots/final-p1/`.

Owner audit: all new complaints map directly to P1(hero/movement), P2(base-Q blades), P3(sliding boxes/clutter/vents), P4(generic UI/lobby), P5(colour/material/effects/enemies) and P6(weak audio). No issue is considered resolved by writing the bible or capturing a baseline.

## Final ID ledger

| ID | Final status | Evidence / boundary |
|---|---|---|
| P0.1 | DONE | LOOK_BIBLE |
| P0.2 capture/judge | DONE | Seven refreshed local pairs; FINAL_VISUAL_REVIEW |
| P0.2 owner final verdict | BLOCKED · owner-only review outstanding | Final pairs ready; no owner verdict invented. P9 permits bounded engineering closure with this recorded |
| P1.1–1.3 | DONE · owner approved | FINAL_P1_REPORT and explicit chat approval |
| P2.1–2.2 | DONE | FINAL_P2_REPORT; zero-Core-blade/render/replay tests |
| P3.1/3.3/3.4 | DONE bounded implementation | FINAL_P3_REPORT + FINAL_P5_REPORT |
| P3.2 | DONE declutter; BLOCKED strict8-total all-fixture target | Complete inventory is12 (4 barricades,3 barrels,5 vents); earlier8 subset was incomplete. ART-06 preserves remaining layout work under P9 |
| P4.1–4.2 | DONE | FINAL_P4_REPORT; four-size UI/native-dialog sound checks |
| P5.1–5.4 | DONE bounded implementation | FINAL_P5_REPORT; final world/parity/grayscale captures |
| P6.1–6.3 | DONE | All46 reference cue recipes studied; original layered synth, measured mix/music evidence |
| P6.4 checklist | DONE | FINAL_P6_REPORT, original sampler and normal clips |
| P6.4 owner ear verdict | BLOCKED · owner-only listening outstanding | Cannot certify taste from automated signal checks; review remains in backlog |
| P7 | DONE | FINAL_P7_REPORT,137 tests/build,54 graphics cases, inputs/saves/missions/production/dialog controls and real600.082s soak |
| P8 | DONE | Per-step reports, shared normal clips/budgets/tunables/omissions and owner-note audit |
| P9 | DONE · bounded engineering close | chapter1-complete tag; CHAPTER_PIPELINE and explicit POST_SLICE_BACKLOG. Not an exact/AAA or human-acceptance claim |
