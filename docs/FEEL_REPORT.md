# FEEL_SPRINT report · 2026-10-31

Implementation checkpoint for owner review. All approved Chapter 1 phases remain implemented. The sprint improves pace, feedback, camera, motion, atmosphere, overlays and HUD, with measured Mac gameplay budgets met. **Owner feel acceptance remains open. Physical-phone performance/thumb-zone checks are explicitly unverified: the owner answered “No phone available now; record this gate as unverified.”**

## What changed

- Five opening threats, saved deterministic stagger queue, formations 8 / 9 / 11 / 12, quicker approach/recovery and earlier Heat. Full clear plus upgrade selection, twelve live/three attack caps, dash family, boss phases, local Blade/profile rules remain. No cosmetic streak damage multiplier or new reward/mechanic.
- Gameplay Core ports and industrial LOD, fewer curved-patch subdivisions, vertex-colour/emission palette batching, hidden under-hull/far-corner culling. Low uses flat tile tops, simple hull, fewer effects and skipped distant decoration; it changes geometry, not only DPR. Detailed Core study hardware stays in the diagnostic studio. Lobby/workshop use the game Core/kit.
- Tiered fixed-step hit-stop, sparks/rings/cracks, rust kill shards/gear/smoke, font-ready damage textures, pixel-scaled numbers with rapid-hit merging, readable killing-blow numbers, orange heavy text and cosmetic ×3/×5/×10 streaks. Armor can reduce damage while preserving ability hit-stop. Low reserves a number beside ability FX.
- Critically damped movement look-ahead, camera slab clamp, combined dash/impact zoom targets, micro-shake and skipped covering corner clusters. Acceleration squash, tilt/eye lean, three violet dash ghosts, turn/landing dust, charge particles, Spin ribbons, Stomp cracks and Overdrive aura/shimmer.
- Enemy anticipation/tint, spinning saw anticipation, throw recoil, flinch/wobble, phase-offset bob, drop-in rings and death pop. Nebula UV drift, star parallax/twinkle, dust, satellite bob, conduit pulses, chasing Heat-reactive edge cells, fourth-kill edge pulse, floor sweep, damage vignette and Heat grade.
- Edge-positioned, dismissible wave/Overdrive/boss/phase name plates and phase roar rings (visual only); upgrade springs, results count-up, cooldown/ready pops, button springs, HP flash and Heat glow. OFL Barlow Condensed Bold Italic is local, with its licence in public/fonts/OFL.txt and provenance in ASSETS.md.

## Tunables

The development workbench exposes the primary content/presentation values below. Production strips the workbench/replay API. Time is 60 fixed simulation ticks per second; nearest whole-tick hit-stop is recorded rather than claiming exact milliseconds.

| Item | Current value |
|---|---|
| Live / simultaneous attacking cap | 12 / 3, including shared projectile/boss engagement accounting |
| Opening threats / queued cadence | 5; 48–90 active ticks (0.8–1.5 s). Pause/hit-stop extend wall time |
| Spawn edge radius / drop | 22 u / 18 ticks (0.3 s) |
| Wave 1 | 8 Sawlets |
| Wave 2 | 6 Sawlets + 3 Throwers |
| Wave 3 | 5 Sawlets + 3 Throwers + 3 Shieldsaws |
| Wave 4 | 6 Sawlets + 3 Throwers + 2 Shieldsaws + 1 Grinder |
| Approach speeds: Sawlet / Thrower / Shield / Grinder | 9.5 / 4 / 4.5 / 3.2 u/s |
| Warning durations, same order | 24 / 30 / 36 / 48 ticks; boss ≥48 ticks. Schema enforces minima |
| Recovery durations, same order | 30 / 96 / 42 / 48 ticks |
| Kill Heat, same order / threshold | 8 / 9 / 12 / 18; threshold 90 |
| Overdrive | 300 ticks; +30% movement, +25% damage; protection cap once per 30 ticks |
| Light / medium / heavy ability hit-stop | 2 / 3 / 5 ticks = 33.3 / 50 / 83.3 ms (targets 30 / 55 / 90) |
| Kill stop minimum / ordinary bonk knockback | 4 ticks = 66.7 ms (target 60); 0.3 u |
| Shake: light / medium / heavy | 0.04 / 0.09 / 0.16 u |
| Sparks: light / medium / heavy | 10 / 20 / 40; Low 40% of counts |
| Effect pool limits | 8 stored events, 6 drawn Standard / 2 Low; 320 shards, 24 gear bits, 32 smoke; bounded text cache |
| Damage text | 26 px nominal at each viewport, 0.6→1.15→1 pop, 0.8 u float, violet shadow; merge within 0.13 s / 0.7 u |
| Gameplay camera | 13.2 u high; 45° azimuth / 30° elevation; nominal Core 9.39% screen height |
| Follow / look-ahead / clamp | analytic critical damping 0.16 s; 1.2 u; centre within ±20 u (4 u inset) |
| Zoom targets / easing | dash 4% out, light 2% in, heavy 4% in; 120 ms response |
| Boss phase presentation slow motion | 0.25× host pacing for 80 ms; disabled in reduced motion; no sim-state edits |
| Ghost / dust opacity | 0.18 / 0.2; three ghosts |
| Atmosphere strength / edge chase / floor sweep | 0.6 / 12 / 0.025 |
| Banner entrance | 0.6 s; dismiss button; no combat input blocking |

## Hardware measurement

Headed Chromium, verified **ANGLE Metal Renderer: Apple M4**. No SwiftShader/software renderer accepted by the harness. Requested browser DPR is 2 at both viewports; renderer cap is Standard 1.5 / Low 1, so actual canvas resolutions are 1920×1080 / 1280×720 and 1266×585 / 844×390. Each case warms 30 frames and samples 180 requestAnimationFrame intervals. Calls/triangles are maxima sampled across those frames, not only the final frame. Fixtures retain hero/enemy HP or accelerate wave setup to keep the named stress scene alive; they do not establish human balance. High bloom and the close-up diagnostic studio are outside the gameplay tier targets.

Initial headed Rex baseline before code changes: Standard 183 calls / 133,846 triangles; Low 161 / 131,374 (final-frame counts; the baseline predates peak instrumentation). Saved in review/feel/perf-baseline.json. p95 was about 16.8–17.1 ms on the Mac, despite excessive geometry. This sprint chiefly improves mobile geometry/call headroom; it does not claim that the previous software-headless 83 ms was the Mac GPU.

Final sampled gameplay peaks: **Standard 106 calls / 50,570 triangles (limits 120 / 60,000); Low 66 / 23,764 (limits 70 / 25,000).** The harness asserts budgets and actor limits.

| Viewport | Tier | Stress scene | p50 ms | p95 ms | p99 ms | Peak calls | Peak triangles |
|---|---|---|---:|---:|---:|---:|---:|
| 1280×720 | standard | rex-six-adds | 16.7 | 17.6 | 17.7 | 83 | 35,609 |
| 1280×720 | standard | wave4-twelve | 16.7 | 17.7 | 17.7 | 81 | 36,072 |
| 1280×720 | standard | corner | 16.7 | 17.7 | 17.7 | 104 | 50,570 |
| 1280×720 | low | rex-six-adds | 16.7 | 17.6 | 17.7 | 66 | 23,615 |
| 1280×720 | low | wave4-twelve | 16.7 | 17.6 | 17.7 | 60 | 22,050 |
| 1280×720 | low | corner | 16.7 | 17.7 | 17.7 | 61 | 23,288 |
| 844×390 | standard | rex-six-adds | 16.7 | 17.6 | 17.7 | 83 | 35,609 |
| 844×390 | standard | wave4-twelve | 16.7 | 17.7 | 17.7 | 82 | 37,802 |
| 844×390 | standard | corner | 16.7 | 17.7 | 17.7 | 106 | 50,570 |
| 844×390 | low | rex-six-adds | 16.7 | 17.6 | 17.7 | 66 | 23,615 |
| 844×390 | low | wave4-twelve | 16.7 | 17.6 | 17.7 | 61 | 23,764 |
| 844×390 | low | corner | 16.7 | 17.7 | 17.7 | 61 | 23,288 |

About 60 Hz pacing on this Mac; tail values are reported rather than asserting a locked 60 fps. **Physical phone: device/browser/FPS unavailable, unverified.** Emulated dimensions and touch events are not phone hardware evidence.

## Scene counts

Headed Mac, 844×390, requested DPR2, fixed capture tick. Static scene counts complement the moving stress maxima above. Product scenes are asserted against both tier budgets. Diagnostic views are labelled; the detailed Core studio deliberately retains the full close-up asset and exceeds the gameplay budget.

| Scene | Standard calls / triangles | Low calls / triangles | Purpose |
|---|---:|---:|---|
| lobby | 65 / 51,426 | 28 / 9,508 | product |
| arena | 63 / 28,284 | 54 / 18,190 | product |
| core-studio | 18 / 100,258 | 18 / 100,258 | diagnostic presentation view |
| enemy-lineup | 7 / 5,404 | 7 / 5,404 | diagnostic presentation view |
| combat-readability | 82 / 39,026 | 74 / 16,890 | diagnostic presentation view |
| perf-worst | 63 / 28,284 | 54 / 18,190 | product |
| boss | 41 / 37,829 | 33 / 15,693 | diagnostic presentation view |
| arena-showcase | 99 / 55,834 | 19 / 9,094 | diagnostic presentation view |
| sawlet-studio | 22 / 2,086 | 22 / 2,086 | diagnostic presentation view |
| thrower-studio | 35 / 1,526 | 35 / 1,526 | diagnostic presentation view |
| shieldsaw-studio | 36 / 3,726 | 36 / 3,726 | diagnostic presentation view |
| grinder-studio | 29 / 3,378 | 29 / 3,378 | diagnostic presentation view |
| boss-studio | 3 / 5,712 | 3 / 5,712 | diagnostic presentation view |
| workshop | 65 / 51,426 | 28 / 9,508 | product |

Gameplay actor counts across expressions/equipment in evidence: Core root 2,084 triangles in the run clip, Blade root 3,570 including attachment/contact/halo. Calm Core in lobby: 2,084. Sawlet ~1,042; Thrower ~1,356; Shieldsaw ~1,546; Grinder ~1,460 before temporary hurt flash (168 extra). Each gameplay enemy remains below 2k and Core below 8k. Counts describe submitted model geometry; renderer frustum culling may submit fewer in a frame.

## Pace and acceptance limits

Normal-enemy-tuning greedy diagnostic, with 10,000 hero HP and no dash: moving first bonk 1.43 s; idle first contact 2.78 s; Heat ready in wave 2 at 11.58 s. It reaches Rex after 64.17 s. This is a repeatable diagnostic, not a skilled-player or normal-HP completion claim.

**The literal density/gap owner gate is not self-passed.** Finite waves still reach one enemy during full-clear cleanup, and this bot's maximum bonk gap is 3.90 s, above the requested 2 s. The separate 30 s wave-3 density clip holds ≥5 live enemies using explicit 600-HP enemies; it demonstrates crowd readability/performance, not normal balance or an infinite-spawn mechanic. Human feel/fairness and sustained normal-balance density remain for owner review. No extra respawn system or shortened warnings were introduced to disguise this limit.

## Evidence and delivery

- review/feel/wave3-4.mp4: 38 s, actual keyboard-driven wave 3 then wave 4; normal enemy HP/damage, 10,000 hero HP. Setup to wave 3 is accelerated. Remaining wave-3 cleanup is explicitly accelerated at ~29 s so both waves fit the recording; defaults are restored before wave 4. Replay matches the deterministic sim; canonical state hashes are in review/feel/replay-hashes.json. Observed dash variants: tap, rush, charge.
- review/feel/blade.mp4: 10 s excerpt of a 12 s keyboard run, seeded local Blade unlock and retained HP. Q Spin, E hop/cone, X Stomp, tap/Rush/Charge. Replay matches; observed variants tap, rush, charge.
- review/feel/density.mp4: 30 s, wave 3, 600 enemy HP / 10,000 hero HP; minimum live count 5. Camera, numbers/FX, motion and crowd evidence.
- review/feel/corner-atmosphere.mp4: 12 s, retained-HP edge/corner run showing culling, sky, satellites/conduits and Heat reactions.
- Four motion boards sample nine frames each; inspected along with full-size desktop/phone shots. Additional 14-scene × desktop/phone captures, four local study comparisons, options, warnings, abilities and production evidence live under shots/. Reference comparison pictures are study-only and excluded from Git/delivery.
- review/feel-source.zip: 63.1 KiB; exactly src/presentation/, src/content/, src/ui/. No models/public/ref/dependencies. This requested review subset is not standalone; the runnable full source, sim and assets are in GitHub.

Evidence was captured at the geometry checkpoint and integrated final passes, rather than after every individual subsection in the requested order. The four clips provide overlapping focused evidence for pace, juice/camera, motion, atmosphere, text and HUD. This process difference is recorded, not retroactively claimed as seven independent step captures.

Validation: pnpm check (67 tests, both Ritmo determinism/source audits), pnpm build (production debug/reference exclusion), headed pnpm perf and scene budget assertions. Desktop/phone-sized browser keyboard/hold/double-tap, simultaneous touch, gamepad, saved preferences, upgrade choice/replay, Rex/Blade, warnings, load-failure retry and production touch/loss/retry/equip-reload checks pass. Final source changes rerun startup/replay/production checks and shots. Physical-device acceptance is open. Existing ~1 MB JS / ~274 kB gzip chunk warning remains; no dependencies were added.

## Source history

GitHub: https://github.com/yashnevase/REDLINE . Baseline commit a42b01e is tagged chapter1-before-feel and was pushed before implementation. The sprint is a separate commit/tag feel-sprint; main tracks it. README documents setup and an independent baseline worktree. All shipped models/textures are original; the bundled font is OFL. Reference repositories, caches, generated raw videos and dependencies are excluded.
