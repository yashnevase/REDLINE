# FINAL_POLISH — bounded work ledger

Active owner directive: `FINAL_POLISH.md`, supplied2026-11-02. It supersedes the old IoU/independent-art-match closing gate. The fresh judge identifies concrete gaps; owner reviews final pairs. Maximum three polish sessions, one targeted iteration on a rejected pair, then remaining art wishes go to POST_SLICE_BACKLOG rather than indefinitely blocking closure. Do not tag early or claim unimplemented systems are finished.

| Session | Scope | Status |
|---|---|---|
| 1 · 2026-11-02 | P0 look bible/baselines; P1 Core candidate and turntable | P0 complete; P1 candidate under review |
| 2 | P2 equipment-specific abilities; P3 movers/declutter/vents; P4 interface/lobby | Not started |
| 3 | P5 world/material/effects finish; P6 layered mix; P7 QA and P9 close | Not started |

P1.2 explicitly asks owner approval of the Core turntable before moving on. Present the concrete candidate with concept/quality comparisons. Do not use an old failed art judge to create a new approval loop. Preserve the user's existing authorization for all remaining implementation.

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

**Not done:** final pairs/owner review, P2–P7. **Tunables:** no runtime changes in P0. **Budgets:** P0 only captures the unchanged130-test systems checkpoint; prior Standard92/58,698 and Low70/24,292 are baselines, not a fresh post-polish stress pass. P1 check/build and motion evidence are in its report. Existing normal-stat clips remain under `shots/close-chapter/`; the new Core clip is under `shots/final-p1/`.

Owner audit: all new complaints map directly to P1(hero/movement), P2(base-Q blades), P3(sliding boxes/clutter/vents), P4(generic UI/lobby), P5(colour/material/effects/enemies) and P6(weak audio). No issue is considered resolved by writing the bible or capturing a baseline.
