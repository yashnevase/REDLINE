# P7/P8/P9 — final Chapter1 verification

Implementation scope: P0 look study, owner-approved P1 Core, P2 equipment-specific Q, P3 recognizable movers/declutter/vents, P4 interface/lobby, P5 clean steel/depth/effects, P6 layered/calibrated audio. Reports FINAL_P1_REPORT through FINAL_P6_REPORT, LOOK_BIBLE, SPIRIT_CALL_AUDIO_MAP and FINAL_VISUAL_REVIEW give per-step evidence. This closes the bounded engineering pass; owner final art/ear acceptance is distinct.

| Check | Status | Evidence |
|---|---|---|
| P7 graphics | DONE |54 cases:3 rooms ×2 viewports ×3 tiers ×crowd/Rex/corner. `shots/final-polish/perf.json`. Low maximum70 calls/24,484 triangles; Standard92/59,110; High separately179/116,526. Worst measured p95 frame interval18.7ms on this Mac, not universal60FPS. High+AO also smoke-tested separately; matrix doesn't certify every AO/device combination. |
| Replay and missions | DONE | All four clean/migrated browser missions agree exactly with headless replay. P2 tests cover Core/Blade replay/snapshot. All existing flags-off deterministic checks remain green. Full campaign/loadout bot audit is additionally recorded in mission-runs.json. |
| Saves | DONE | Blade unlock/equip/reload, cosmetics, last mission, JSON export/import, malformed backup and IndexedDB fallback; `functional.json`. No save schema changed in this polish; existing migrations remain. |
| Inputs/readability | DONE | Four viewport sizes, sixteen outer corners: Core within screen and HUD bounds. Real keyboard events, simultaneous touch move/dash, emulated controller abilities/dash and exact replay. `inputs/report.json`; physical hardware not claimed. Expanded±21 deck remains beyond±17 hazard frame. |
| Production | DONE | No development API/workbench; options, touch Pulse, loss/retry, migrated Blade and Blade Q. `production/production.json`. Build excludes references/private audio and generates empty public music manifest. Existing bundle-size advisory remains. |
| Final UI clipping cleanup | DONE | Four-size pause/settings separation, all Heat ticks contained, lobby stack/hint fit; `ui/report.json`. Independent judge verified the concrete fixes. |
| Sound and volume reachability | DONE | Corner controls remain on lobby/workshop/play/results. Mission/options headers expose the same live sound panel inside the native dialog, with all four volume buses and global M mute. Four-size actual dialog/keyboard checks in modal-audio/report.json, including initially visible mission launch at short heights. |
| Audio signal/limits | DONE | Original sampler; extreme burst20 global groups,4 per cue,111 starts/1169 drops,0 settled groups; measured peak below0.94 ceiling, pause1100Hz. `shots/final-p6/mix.json`. Three private tracks independently verify−18.00LUFS prefader with peak-safe trims; no private files modified or shipped. |
| Ten-minute stability | DONE |600.082 real seconds/20 samples; steady post-GC heap32,087,224–32,658,196 bytes (0.545MiB variation); sampled maxima5 debris/24 dust/10 voices, caps48/32/20; no errors. `soak.json`. Soak preceded only the final native-dialog-access and whine-trigger follow-up; mixer topology, actor pools and simulation are unchanged, and targeted checks cover that follow-up. |

Normal play: `shots/final-polish/normal-desktop.webm` and `normal-compact.webm`,32 seconds of live normal-stat scripted player intents each. These are bots, not a human playtest. HP/damage/movement/cooldown content is unchanged; legitimate upgrades can increase maximum HP. Native1280/1920 grayscale squint captures verify the changed value hierarchy. Short ability clips and all3 room desktop/compact overview/play captures are also retained. Native final pairs in local `shots/parity/` use the same sizes/aspect-preserving crops as P0; reference-containing images are not committed or shipped.

## Owner-message audit

| Owner concern / previous work | Final mapping |
|---|---|
| Core looks poor, sphere/finish/eyes/crown, quieter movement | P1, explicitly approved by owner; rigid body and cool Overdrive shell retained |
| No base blades; unique Q/E/X and Blade unlock | P2 and prior CL6/B4/B5; Core Pulse vs equipped Spin, all Blade entities/rendering gated and tested |
| Sliding squares, too much trash, vents/atmosphere | P3 recognisable cart/pickups, eight inside fixtures, clear spawn ring, settled/fading debris, proper seeded vent model; P5 clean steel and pit/giant/wreck iteration |
| Flat/background-like map; all four arena targets | Original3D slab/pit/fractures and chaos states; P3.4/P5 bounded geometry/material refinement. Exact image replication is not asserted; remaining art wishes tracked |
| Beyond black/yellow outline, more enemies/time | Existing±21 fighting belt, eight opening enemies,12 live/3 attackers, score goals10k/24k/40k and minimum3/4/5 waves retained; final input/mission audits verify them |
| Generic UI/lobby, confusing rewards/upgrades/input hints | P4 shaped plates, larger orbitable Core/pedestal/rays/idle, selected mission brief/launch, saved workshop controls, input glyphs, numeric upgrade cards and score hierarchy |
| Weak fight sound and VFX | P5 shaped bursts/readable flashes; P6 body/metal/air/sub layers, speed/style pitch, accents, screen pan, music trim/duck, limiter and quiet UI |
| NEXT_WORK combat depth, roster, heal, scoring, progress, boss, save, additions | Existing Q/B/F/C/D/E/G/H/I and CL systems retained;137-test check, exact mission/campaign replays, profile/inputs/production audits. No simulation state is written by UI/render/audio |
| Match target, use references, preserve old code | Local look/audio studies and seven pairs; original assets/code, independent bounded visual check, ID commits and Git checkpoints; no deployment/private reference shipping |

The older brown-floor and deforming-Core directions are superseded by FINAL_POLISH and the owner's Core approval. Camera size follows the approved default priority; Far remains an optional wider view. Detailed tunables live with each step's modules/reports; this QA adds no balance change. Low has no spare draw-call budget; future scenery must batch or replace existing detail.

## Not done / owner review

Final pair approval and listening by ear remain owner-only verdicts (Core approval already received).3–5 first-time-player balance/feel review is unverified; PLAYTEST_SCRIPT is ready. Six-at-once normal-play mover visibility is not rigorously certified. These are explicitly tracked in POST_SLICE_BACKLOG alongside the fresh judge's optional art wishes. Phone/deployment gates were waived; emulation is not a physical-device claim. No AAA/exact-match or human approval is self-certified.

P9: three logical polish sessions used; one concrete overlap/clipping cleanup, not an endless IoU loop. All automated checks pass. Close the engineering slice and tag `chapter1-complete` per the owner's bounded rule, with the remaining wishes preserved in the backlog. STATE/CHAPTER_PIPELINE record the bounded closure; the tag does not assert owner acceptance of every final visual/audio choice.
