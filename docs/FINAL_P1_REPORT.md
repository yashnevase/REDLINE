# P1 — Core candidate for owner review

2026-11-02, session1 of the maximum3-session FINAL_POLISH pass. P0 baseline report and fresh judge gaps: `FINAL_POLISH_PROGRESS.md`. This is a review candidate, not owner approval or a claim of AAA parity.

| ID | Status | Change/evidence |
|---|---|---|
| P1.1 | Candidate ready; P2 dependency remains | Core retains blue-violet midtones at all three Heat stages; power adds orange rim/floor aura rather than repainting the body white/orange. Narrower key reflection, gentler broad reflection transition, softer pale eye edge and sharper crown contour. Rigid spherical scale replaces impact/charge/leap distortion; scars stay surface-only. Existing bevel/socket detail retained. |
| P1.2 | Awaiting owner review | `?scene=core-turntable` exposes front/quarter/side/top. Query parameters: `heat=0..2`, `expression=0..5`, `wear=0..3`, `blade=1`. Twelve angle/heat frames, six expression/wear frames, contact sheet, local concept/Spirit Call quality comparison. Scar selector was verified against renderer metadata after fixing its initial disconnected value. |
| P1.3 | Candidate ready | Rigid turn lean, rolling surface maintained; tiny dust/sparks restricted to fast turning rather than damage-tier smoke or continuous ordinary dashing. Eye tracking retained. Simulation movement/acceleration/input timings unchanged. Real-time normal-stat32s desktop clip and compact motion capture. |

Evidence under `shots/final-p1/`: `turntable-board.png`, angle/Heat frames, `expression-N-wearN.png`, Overdrive desktop/compact, motion desktop/compact WebMs and report JSON. Local-only `shots/parity/p1-core-concept-quality.png` compares identity crop with our front view and Spirit Call's finish benchmark. The concept's heavy drawn contour is not copied into the mesh. No reference art/code is shipped.

`tools/final-core-review.mjs` verifies isotropic rendered body scale during Boost and Stomp; the final scar capture additionally checked each selected wear tier through real renderer metadata. `pnpm check`:130 passing tests, both Ritmo audits/source validation. Build passes with the existing bundle-size advisory; reference/debug/private-audio exclusion remains. This is presentation-only and leaves replay rules/saves unchanged.

No new draw pass, particle capacity or body tessellation was added. Crown contour and eye-edge geometry replace existing patches; matrices/material/particle behavior are changed in place. Previous stress maxima (Standard92/58,698, Low70/24,292) remain baseline measurements; final P7 stress suite is still required after all polish, not self-passed here. Standard motion/turntable capture costs are recorded in report metadata. High/Low full polish QA remains assigned to session3.

Tunables/switch: `presentation/p1-core-polish.ts` (P1_ENABLED, turn lean, fast-turn threshold, wear-detail); studio scale1×1, uniform combat scale, narrowed key-reflection widths and Heat-rim ramp. Existing geometry LODs are retained. Reduced motion/flashes still suppress their respective presentation channels.

**Not done:** owner Core approval, new original socket geometry beyond existing bevel details, final High/Low motion comparison, P2 equipment-specific Q correction and P3–P7. Base Q's Blade Spin presentation remains the separately assigned P2 bug; it is not claimed fixed by P1. Default idle/equipped attachments still follow the saved loadout. The overall interface/world in the screenshots are baselines awaiting later steps.

Owner audit: hero no longer changes to a white/orange blob; non-uniform egg/stretch removed in presentation; white eyes/crown/socket identity retained; fast-turn dust rather than continuous noise. Movement/shades/effects/lobby/audio complaints remain tracked to P3–P6, not dismissed because this candidate exists.

Review gate comes directly from FINAL_POLISH P1.2: “owner approves before moving on.” Review the turntable, concept/quality comparison and Overdrive frame. This requirement applies to the concrete Core candidate, not a new permission request for the already-approved full sprint. P9 still limits the whole polish to three sessions and one targeted revision per rejected pair.
