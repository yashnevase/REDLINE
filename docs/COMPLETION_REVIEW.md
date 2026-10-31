# Chapter 1 completion review — 2026-10-31

The owner requested an audit of the Markdown phases and completion of the remaining work without intermediate approval stops. This supersedes the per-asset stopping rule for this pass. It does **not** manufacture owner art acceptance, a human balance result, or a physical-phone performance result.

## Phase audit

| Phase | Already built before this pass | Completed in this pass | Evidence |
|---|---|---|---|
| 0 — setup / visual foundation | Vite/TypeScript/Three, pinned Ritmo sim, seed, commands, reference study/provenance | Reference Core promoted to gameplay/lobby; original industrial asset kit; comparison register updated | `pnpm check`, build validation, `art/match/` |
| 1 — small fight | Movement, auto-bonk, tap dash, one-Sawlet trial, keyboard/touch/gamepad, hit feedback | Refined live Core, more legible Sawlet, buffered hold/release and double-tap controls, hit/death feedback and restart cleanup | Headless movement/damage/replay tests; `shots/completion/controls.json` |
| 2 — combat slice | Four roles, four waves, 12 live / three attacking, all-clear upgrade gates, Heat/Overdrive, 12 upgrades | Distinct model kit for every role, harmless edge arrivals; approved Rush/Charge/shared dash cooldown; Q upgrades correctly affect Spin radius/damage/recharge | Fairness, snapshots, determinism, full-loop browser replay |
| 3 — complete loop | Four Scrap-Rex phases, minimum 0.8s warnings, victory/retry, Blade unlock/equip/local profile | Rebuilt legless plated Rex with floating chain/claw and toothed jaw, all-around enrage cracks/steam; Blade Spin + Boost hop/cone + Stomp; Spin/hop can overlap | Boss/Blade tests, production equip/reload smoke, combat captures |
| 4 — finish | Pause/focus, Options, saved reduced motion/flashes and Standard/Low, accessible results/upgrade selection | Larger dressed space slab, separate showcase camera, rounded centre groove, dense corner/satellite kits, wear/vents/cables, live Core lobby/workshop, cooldown sweeps, larger phone plates, High selective glow, batching/LOD | Desktop/phone screenshots, motion, startup/asset retry, production smoke, stress report |

Implementation of the approved Chapter 1 scope is present. Human fun/balance, final art approval and physical target-phone acceptance remain external review gates. No audio, accounts, online play, Chapter 2 gameplay, perfect-dodge reward, tooth-break/dent mechanic, rerolls or extra swarm were added.

## Current controls and START values

- Tap Space/Shift or Dash: 4 u / 12 ticks; two cells, 72-tick recharge. A short release starts the tap immediately.
- A second tap within 18 ticks upgrades the first paid gesture to Roll Rush: 6.5 u / 18 ticks, one charge total, one swept hit per target at 1.5× maximum speed-bonk damage. The recognition tap can already have moved the Core before Rush commits.
- Hold at least 15 ticks and release: Charge Dash; charge reaches maximum at 36 ticks, distance 4–9 u / 18 ticks. Protection lasts only the first 12 movement ticks. Q/E/X, pause or focus loss cancels a held charge; release after cancellation does not create a ghost dash.
- Shared post-dash lock: 30 ticks, halved in Overdrive; Charge has its own 60-tick post-dash lock. Overdrive still grants protection no more than once per 30 ticks.
- Blade Q: 24 damage, radius 2.5, 42-tick Spin, small 0.35 u pull, 120-tick cooldown. Each target is hit once during that Spin. E: existing 3 u boost plus a visual hop and forward 14-damage / 3 u cone, 180-tick cooldown; no extra invulnerability. X: 14 damage / radius 2 / 36-tick stun, 240-tick cooldown.
- Values live in content and the development workbench. The default Core retains Pulse/Boost/Stomp. Equipment remains fixed when a run starts. Existing version-1 local profiles are retained. New replay exports identify rules version 3; schema defaults preserve older snapshots' missing neutral fields.

## Visual evidence and measurement limits

Latest neutral comparisons are `art/match/<asset>/cmp-11.png`, with source crop, raw render, actual object-ID mask and JSON measurements alongside. Core reference comparison 10 remains the authored hero target; the live model uses that construction with a gameplay LOD.

| Asset | Shape IoU | Mean palette percentile-channel error / 255 |
|---|---:|---:|
| Core, comparison 10 | 0.950 | 3.62% |
| Sawlet | 0.828 | 2.88% |
| Rivet Thrower | 0.880 | 2.83% |
| Shieldsaw | 0.802 | 6.01% |
| Grinder | 0.820 | 1.61% |
| Scrap-Rex | 0.825 | 5.53% |
| Arena slab | 0.875 | 4.01% |

These are shape/palette proxies, **not near-identical identity or owner approval**. Each foreground bounding box is independently uniformly fitted to 416 px inside 448 px. No stretching or rotation is used in alignment. Reference masks are manually annotated; candidate masks are actual engine object-ID renders. Palette uses selected rust/mauve pixels and 10th/50th/90th channel percentiles, not perceptual DeltaE. The Core's palette selection differs (blue pixels).

Iteration 1's new-asset measurements were invalidated by shadow planes/instance colours in the candidate masks; this was corrected before subsequent measurements. The boss's coarse original annotation/crop was corrected after inspecting a coordinate grid in iteration 6; earlier boss values are not comparable. Full weapon framing was corrected before comparison 11. A threshold pass alone does not prove the feature/style checklist. Fresh reviewers' remaining fidelity notes are retained in `art/match/FINAL_REVIEW.md`.

Gameplay remains at 13.8 u vertical view: nominal Core diameter ~8.99% height, ~24.53 u desktop / ~29.86 u phone horizontal width. Showcase is independently framed to the full slab. Camera-follow gameplay and showcase/lobby share the asset kit.

## Renderer and asset implementation

- Original Blender source: `tools/build-core-sockets.py` and `tools/build-industrial-kit.py`; `.blend` + bounds/pivot reports under `art/match/*/source/`; game GLBs under `public/models/`.
- Industrial kit contains chamfered saw, legacy plank, curved upper/lower shield halves and a curved armour patch. UVs for authored kit wear are generated from its geometry. Materials are converted/replaced with stylized presets before readiness; no PBR world/reflection/AO system was added.
- Original painted matcaps and seeded UV wear maps are canvas-generated. References are crops/comparison targets only; no Spirit Call source/art or reference images are shipped as textures.
- Gameplay Core uses lower sphere/patch tessellation, preserving expressions/proportions; studio/lobby retain detailed geometry. Invisible hit flashes are skipped. Merged geometry preserves vertex colours and mapped UVs. Occlusion fades are rebound to the live meshes after merging. Corner machinery fades when it would cover the Core.
- High uses half-resolution emissive-only selective bloom. Standard/Low retain additive glows; reduced flashes bypasses High bloom. Particle pools remain bounded well below 1,024.

## Verification record

See `shots/completion/check.log`, `build.log` and the individual browser logs/reports. The final suite covers keyboard Charge/Rush, simultaneous browser touch events, pause cancellation, browser-recorded replay, startup failure/retry, both GLB failure/retry paths, four-wave upgrades/Overdrive/clear, all Blade abilities, enraged boss/six adds, saved Options, production startup/touch/loss-retry/equip/reload, and stress rendering.

The combat and boss fixtures explicitly use seeded/debug high HP, low retained stress damage or accelerated wave clears. They demonstrate rendering/control/replay behavior; they are not normal-balance victories. Phone-sized Playwright is not a physical phone. Performance numbers and remaining acceptance limits are appended after the final measurement.

### Final results

- `pnpm check`: **62 tests pass**; TypeScript, source/content/asset validation and both Ritmo schedule audits pass. Includes actual GLB bounds/pivots, visible Core LOD budget, legacy snapshot defaults, once-per-target attacks, overlapping Spin/hop, reused-ID flash reset, live post-batch occlusion, and gamepad upgrade-release regression.
- Build passes and excludes reference assets/debug API. Entry JS ~1,007 kB / ~273 kB gzip (see exact build log); the existing >500 kB chunk warning remains.
- All final functional browser stages pass: controls (including emulated gamepad + replay), startup, both GLB retry paths, four-wave run/replay, Blade/enraged combat, Options and production. `pnpm shots` captured 14 scenes at 1280×720 and 844×390, target comparisons and continuous motion. Actual frames and extracted motion were viewed.
- Core LOD reduced opening-frame geometry from ~220k to ~135k triangles before the later scene dressing changes. Enraged stress batching reduced measured calls 164→137 Standard  / 160→133 Low, with the same deterministic fixture/end state. This is draw-call reduction, not a demonstrated frame-rate improvement.
- Final stress: Standard 137 calls /126,346 triangles, Low 133 /126,002. At 1×/4×/6× CPU throttling, Standard p95 ~83.3/83.3/83.4 ms; Low ~83.4/66.6/66.7 ms. Emulated 2× DPR; Standard canvas 1266×585, Low 844×390. Thirty warm-up frames, 120 recorded frames per case; HUD included. Synchronous unthrottled p95 CPU work is roughly 0.2 ms simulation, 1.2–1.4 ms render submission and 0.2 ms HUD; this does not identify the driver/GPU cause of long rAF intervals. **The 60 fps performance gate is not passed.** Physical-phone testing remains unperformed.
- High busy-fight capture and reduced-flash bypass pass separately. High stats now include every postprocessing pass (303 calls in the frozen six-add/Rex fixture vs 148 with reduced flashes/bloom bypass). High was not part of the Standard/Low performance run and must not be advertised as a phone-performance result.
- Fresh final visual review found no rendering blockers in the supplied comparisons; it still reports meaningful illustration-fidelity differences. Final owner art acceptance and human normal-balance playtest remain open.

Local production review: `http://localhost:5199/` (Vite preview; rebuild before reviewing subsequent source edits). Start/equip/retry/local save remain the real product flow. Do not interpret seeded test profiles as the owner's own save progress.
