# POLISH_ROUND3 — one-session handoff ·2026-11-02

F1–F5 implemented in order, followed by one shared visual/measurement cleanup. Rounded UI, enemy designs, health bars, kill feedback and blue-violet Core remain approved. The earlier Round2 tag authorization was superseded by this pass before any tag mutation.

| ID | Status | Result and evidence |
|---|---|---|
| F1 | DONE | Seeded plate allocation60.1% warm grey-brown,25% cool steel,14.9% oxide; warm key/neutral fill, orange lamps and purple space. Initial overly brown candidate was tempered to warm steel-grey. Matched Default three-room desktop/compact before/after captures; floor-before-after.png. |
| F2 | DONE | Broken arena rings, arrows/lanes/stencils without text, oil/scorch/welds, flush offcuts, glowing grate paint and soft pools on existing3D plate UVs. Warm slow sweep;32 pooled impact/Stomp/kill scars, up to24s fade. No new fixture/collider; added surface height0. Five existing vents remain inside frame, none in central±12u. |
| F3 | DONE | Default1.0; Close.85/Wide1.5/Far1.9 remain saved and unchanged. Nominal idle Core11.07% desktop/11.27% compact; recording minima10.64%/10.83%, above10.5%. Approved enemy/Core proportions retained. Four-size corner/HUD and input checks pass. |
| F4 | DONE | Normal waves open at existing14 cap;5.8–6.6u hero-relative ring/flank drops with safe inward edge fallback and≥36tick warning. Distant pursuit12.5u/s, closer ranged band and warned10–16tick reserve arrivals. Normal reserve roster doubled; live/attacker limits remain14/4, Low10/3. Distant natural recovery can become pursuit after≥24ticks and completed punish window. Chill/Redline and Rex gameplay retain Round2 behavior. Actual camera measurement reaches14 and includes≥10 in every sampled moment with≥10 landed enemies. Full population/cleanup counts below. |
| F5 | DONE | Desktop secondary/twist/style/callout text≥14 displayed pixels after ancestor scaling; cream contrast plates,17px ability labels before the.85 HUD transform. Overdrive stays on one line. Compact secondary text12px; redundant branding hidden and style plate yields to combat callouts. Twist intro4s, inactive rank auto-hides. Four-size audit passes. |

## Normal-play evidence and visible population

Two36-second native Chromium recordings use Default zoom, normal stats and normal scripted inputs. No HP/damage modifications. Camera counts project each living, landed enemy's nominal body center into the actual camera viewport; incoming drops are tracked separately by the game's live count. The review-only caption shows LANDED / IN VIEW; it is not shipped in the product HUD. Samples include wall seconds and simulation seconds in capture.json.

| Recording | Peak landed / in view | Pressure samples: landed≥10 and in view≥10 | All fight samples with≥10 in view | Minimum nominal Core height |
|---|---:|---:|---:|---:|
| Desktop1280×720 |14 /14|200/200 (100%)|200/344 (58.1%)|10.64%|
| Compact844×390 |14 /14|203/203 (100%)|203/345 (58.8%)|10.83%|

Spawn/drop and final full-clear cleanup periods still fall below ten. The pressure result does not claim ten enemies in every frame of an entire wave. No win-condition or attacker-cap change was used to force that count. The initial close-formation candidate had only28–30% all-fight coverage; warned reserve arrivals and better convergence improve that to58–59%. Each final recording replays exactly against the headless simulation; both final-state SHA256 values are e3065292d3f30ff31934cd0e65c29bae5f1aff5b2f1a82030daf35d1001cca5d.

Core height is the projected nominal sphere diameter including camera zoom; the previously approved brief impact squash remains. scale-review-before-after.png explicitly compares the old Round2 Far review framing against the new Default recording. floor-before-after.png uses matched Default views on both sides; the earlier Default was1.05. Saved Far preferences are retained, so select Default to review the larger characters.

## Checks and budgets

- pnpm check:146 tests, TypeScript, lint, both Ritmo audits and source/content validation pass. New checks cover palette proportions, flush/bounded scar accumulation/dedup/fade/reset, Default scale, warned edge-safe deterministic formations and unchanged caps.
- pnpm build and distribution validation pass; private audio/reference/debug exclusion remains intact.
-36 native Mac stress cases: three rooms × desktop/compact × Low/Standard ×20-enemy crowd/Rex/corner (Low starts10). Stress HP is explicitly a fixture; it is separate from normal-play evidence.

| Tier | Peak calls | Peak triangles | Required limit | Worst measured p95 |
|---|---:|---:|---|---:|
| Low |49|20,355|70 /25,000|18.6ms|
| Standard |74|57,774|120 /60,000|17.6ms|

Four-size corner/Core/HUD, keyboard, simultaneous touch and emulated controller checks/replays pass. Eight clean/migrated browser mission outcomes match headless results exactly; Blade unlock/equip/reload, workshop/cosmetics, export/import, corrupt backup, IndexedDB fallback and missing-file synth pass. This includes a recorded Core Mission3 loss, not an all-missions-clear claim.

Fairness/cap/replay traces: Chill Core4/4 clears; Normal Core3/4 (Mission3 loses at20.37s), Normal Blade browser4/4; Redline Core3/4 (Mission3 loses at21.92s). Normal standalone Mission1 takes44.92 simulated seconds and Mission2 takes84.03s with the reserve roster. No player-stat cheats. Human balance remains for the owner/playtest, and the Core Mission3 result is specifically carried into POST_SLICE_BACKLOG.

Viewed desktop/compact before/after, normal fight captures, Low/Standard views and the300px grayscale squint image. Core and steel enemy silhouettes remain the foreground focus against the quieter warm floor. Motion clips and replay traces support this inspection; owner visual acceptance is not self-certified.

## Evidence and reproduction

- shots/round3/normal-desktop.webm and normal-compact.webm; capture.json contains counts over time.
- shots/round3/floor-before-after.png; scale-review-before-after.png; before/ and after/ contain three-room/two-size views and metadata.
- shots/round3/squint-300.png; normal-crowd/multi captures; audit/report.json (actual displayed fonts/overflow/hiding).
- shots/round3/final/perf.json, fairness.json, functional.json and inputs/report.json.
- tools/round3-compare.mjs (PASS=before/after), round3-capture, audit, perf, inputs, functional and runs. Browser tools run serially on5201.

## Not done — owner handoff

1. Owner plays15minutes on Default and records F1–F5 notes.
2. Owner runs docs/PLAYTEST_SCRIPT.md with3–5 first-time players and shares their answers.
3. Owner says accepted; only then advance chapter1-complete and update STATE. Remaining wishes belong in POST_SLICE_BACKLOG.

The existing completion tag is unchanged; no backup/advance tag was created during this pass. Physical-phone/deployment gates remain waived; these are Mac/emulated measurements, not universal-device or human-fairness certification. No Chapter2 work, deployment, external asset/dependency, new audio content or reference implementation was added. User-owned close1/ and docs/NEXT_WORK (1).md are untouched.
