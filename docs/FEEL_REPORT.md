# DEPTH_SPRINT · Part A report · 2026-10-31

Session1 implements A1–A6. The sprint explicitly requests three sessions: A, then B, then C/D with E. **Parts B–E remain approved work for those subsequent sessions**, tracked in DEPTH_PROGRESS.md. This checkpoint does not claim the new combat roster, perfect dodge, score progression or living world are implemented. The existing four-wave→Rex loop remains playable. The brief records the owner-directed scope amendments.

## Result

The Core stays a rigid ball in ordinary movement and Overdrive. Painted panel seams/flush bolt detail rotate with travelled distance/radius while face/crown stay readable; matcap lighting remains fixed. Only dash anticipation and a brief impact change shape. Every active dash hides eyes/crown; Rush/Charge are slightly larger spherical cannonballs, scrape sparks/dust and ricochet off obstacles/enemies. Ricochet retains the original dash duration, protection window and per-target hit set.

Movement now reaches base8.5u/s in~80ms, builds to10.5u/s after1s of straight input, drifts briefly through sharp turns and stops immediately on release with a skid. Analog strength remains normalized. Hero momentum is saved deterministic state; legacy snapshots decode to idle. Render-only rolling, spring/impact timers and cosmetic seeded particles reset on restart/rewind and never write sim/RNG state.

75/50/25% integrity drives scratches, dented LOD-shell vertices/dark patches, sparks, cracked/Heat-lit plate, smoke and hurt eyes. Wounds follow HP thresholds; a new run/full repair removes them. Existing Reinforced Shell continues its stated20-HP restoration, clearing only thresholds that are healed. Damage captures use actual incoming attacks with controlled25-damage tuning; attackers are then made harmless to show settled wear after the white flash fades. This is visual evidence, not balance evidence.

Saved Close/Default/Wide camera distance works through C/V, mouse wheel, two-finger canvas pinch, +/− buttons and Options. User zoom eases independently of simulation pacing and preserves pixel-sized damage numbers. Attack-range radii remain world-space honest; line strokes remain pixel-sized. Close follows nearer; portrait gets another1u of follow margin so fast movement plus impact zoom cannot clip the Core. Portrait control/HP/wave plates are separated; the640×360 Overdrive pill is narrower after a caught overlap.

## Tunables

All new primary defaults are exposed in the existing development workbench; production omits it. No new dependency/download or reference code/asset copying. The movement study and source paths are in SPIRIT_CALL_MOVEMENT_NOTES.md; original asset/shader provenance in ASSETS.md.

| Item | Current value |
|---|---|
| Base / straight rolling speed | 8.5 /10.5 u/s (move upgrades scale both) |
| Acceleration | vector-limited106.25u/s²; base ramp~80ms /5ticks |
| Momentum / straight direction dot / sharp-turn grip | 60ticks /.985 /.65 |
| Release stop | immediate zero velocity; presentation skid |
| Normal locomotion stretch | none; round body, eyes/marks lean |
| Anticipation | critical damping response.035s; max±6%, no overshoot |
| Impact exception | 0.92Y /1.08XZ,80ms; reduced-motion bypass |
| Dash display size tap /Rush /Charge | 1 /1.04 /1.06, uniform spherical scale |
| Roll rotation | travelled distance/radius; dash spin×1.25 |
| Rush/Charge ricochet | reflection from contact normal; .7u enemy knockback; hit/protection timers retained |
| HP wear thresholds / dent displacement | 75/50/25%; max.045 sphere-local units |
| Motion particles | shared32-instance dust/scrape/smoke pass, Low20; presentation-only seeded RNG |
| Camera distance presets / response | .85 /1 /1.3; .16s smooth preference easing |
| Follow clamp | ±13u landscapeDefault/Wide, ±14.2Close; portrait±14Default/Wide, ±15.2Close |
| Existing caps/warnings | ≤12live /≤3attacking; ordinary24/30/36/48ticks, boss≥48 unchanged |
| Low budget tradeoff | omits ambient sparkle pass and outer edge-cell trim frames; neon cells, scar smoke and gameplay retained |

## Evidence and checks

- `pnpm check`:76tests, both Ritmo audits and content/source/TypeScript/lint validation pass. New tests cover acceleration/momentum/analog/drift/instant stop, ricochet plus invariant hit/protection state, legacy/round-trip snapshots, rigid response/wear and preference migration.
- `pnpm build`: passes, production reference/debug exclusion passes. Existing~1MB entry chunk warning remains.
- `pnpm shots`:14scenes×desktop/compact, comparison frames and motion captures. Screenshots and sampled motion were viewed, including a local Spirit Call comparison; no reference media shipped. Human feel/reference parity is not self-approved.
- `review/depth-a/movement-{desktop,compact,portrait}.mp4`:18s real keyboard movement with tap/Rush/Charge and C/V zoom, normal HP/stats. Replay verification is exact for each. Independent camera fixtures then check12corners (4×3presets), wheel/pinch/buttons and preference reload per layout. Portrait additionally samples every movement frame, including transient impact zoom:975frames, conservative Core bounds remain inside390×844. HUD fixes and final portrait motion were recaptured/viewed.
- `review/depth-a/inputs-four-sizes.json`: browser keyboard, simultaneous joystick+touch, emulated controller, replay, Core/HUD corner bounds pass at1280×720,844×390,640×360,390×844. Saved options/accessibility/pause/focus, full completion-control and production startup/no-debug/touch/loss-retry harnesses pass. Physical-device claims remain separate; no phone/deploy gate was reintroduced.
- Faster movement exposed nearest-target switching jitter in the old bot. Two-unit target hysteresis now holds a chosen target until another is clearly closer; no HP/damage cheats. Default bot reaches Rex at58HP with wave1–3 active-clock bonk gaps1.17/1.70/1.13s (wave4:1.67s). PartB/C/D fairness will be rerun as those mechanics land.
- Current source packet `review/feel-source.zip` contains exactly34 files from presentation/content/ui, extracted bytes checked. Full deterministic movement code is in the repository's sim folder, outside that intentionally three-folder packet. Prior checkpoints remain in Git tags.

## Hardware budget

Headed Chromium with verified ANGLE Metal Apple M4, requestedDPR2; actual Standard1.5 /Low1. Warm30frames, sample180rAF intervals per case. Default fixtures: Rex+six adds, twelve mixed wave4 enemies and a corner. Default peaks: **Standard114calls /47,224tri; Low69 /21,994**. Added Close/Wide corner fixtures at25%HP exercise scars/smoke plus wider scenery: **Standard118 /50,254; Low70 /22,804**, within120/60k and70/25k. Highest measured p95~17.6ms, p50~16.7ms (about60Hz, not a guarantee on every device). Low remains at its call cap. High/detailed diagnostic Core studio are outside gameplay budgets.

| Viewport | Tier | Camera | Peak calls | Peak triangles | p95 ms |
|---|---|---|---:|---:|---:|
| 1280×720 | standard | close | 111 | 46,822 | 17.6 |
| 1280×720 | standard | wide | 118 | 50,134 | 17.6 |
| 1280×720 | low | close | 68 | 21,174 | 17.6 |
| 1280×720 | low | wide | 70 | 22,744 | 17.5 |
| 844×390 | standard | close | 111 | 46,918 | 17.5 |
| 844×390 | standard | wide | 117 | 50,254 | 17.5 |
| 844×390 | low | close | 68 | 21,232 | 17.6 |
| 844×390 | low | wide | 70 | 22,804 | 17.6 |

Stress fixtures retain enemy/hero HP to keep the named load alive; they are budget evidence, not human balance. The added portrait safety offset only changes portrait framing; landscape budgets exercise the same final rendering path. No deployment was performed. Final owner rolling/visual/fun acceptance stays with the owner.

---

# Historical FEEL_SPRINT_2 report below

# FEEL_SPRINT_2 report · 2026-10-31

Sections 1–6 are implemented and verified for owner review. Owner explicitly replaced section 7: ignore the physical-phone gate, support responsive keyboard/touch/controller input and do not deploy. That gate is out of this sprint's scope. Measurements below are from the Mac; they do not certify every physical device. Final art, punch and fun acceptance remain with the owner.

The previous report/source/evidence are preserved at Git tag `feel-sprint`; this report describes `feel-sprint-2`. `docs/FEEL_SPRINT_2.md` is the unchanged supplied request. The brief records the owner-directed amendment.

## Six completed checkpoints

1. Focus: ±17 u play zone with soft leash, 14–16.2 u deterministic circular arrivals, ±13 u camera clamp, four low obstacles at the ±12 u axes. Obstacles have 4.2 u outer lanes and a 22.4 u clear centre; the older 26 u groove remains scenery. Corner machinery is outside ±20 u and omitted during combat. Hero violet pool/rim and enemy red floor underglow separate teams.
2. Punch: stronger discs, thicker inner ring, longer arcs/scorch; one-frame white impact star; two-tick 6% heavy edge flash; velocity-stretched gradient sparks, larger rust/metal chips, readable merging numbers and heavy CRUNCH pop. Enemy squash/death spin, 0.5 u knockback and heavy-kill host slow motion. Refreshed bounds prevent pooled moving FX from disappearing when the camera leaves the origin.
3. Speed: single instanced radial line pass, six-sample ribbon, dash-only ghosts, velocity stretch, turn dust/floor streaks and top-speed zoom. Overdrive has entry slow motion/zoom/ring/flash, active orange-white aura/pool and faster edge motion. Host time effects never write simulation state; reduced motion/flashes bypass corresponding effects.
4. Pace: last-two Rally +40% approach and natural recovery skip; Stomp stun and warnings preserved. Sparse arrivals shorten to 48–72 ticks below five live. Thrower and Shieldsaw approach 4.6/5.5 u/s. Normal-HP moving bot reaches Rex alive; wave 1–3 maximum active-clock bonk gaps are 1.13/1.23/1.38 s. Caps remain 12 live / 3 attacking, warning minima unchanged, full clear plus upgrade selection retained.
5. HUD: 100-point HP presentation, thicker flash bar, real Heat arc, cooldown digits only in the final second or on press, compact ability buttons +8%, legible icons and safe placement. Small-landscape Overdrive pill narrowed after overlap testing. Real HP/save values remain unchanged.
6. Atmosphere: 1.5× floor variance, 64 scuffs around play-zone edge, one soft Standard sweep every 8 s, larger/closer satellites and Heat-reactive nebula. Palette batching and visible-instance filtering keep the added effects within budget. Low omits the sweep and retains simpler geometry/effect counts.

Each checkpoint ran `pnpm shots` plus viewed desktop/compact 10-second movement captures. `review/focus/steps/` contains the six compact clips; checkpoint boards show the progression, including the pre-HUD diagnostic values. Those isolated FX fixtures retain hero HP to keep the scene alive. The fresh final clips below use normal HP and damage. Own screenshots/motion boards and a local study-only Spirit Call comparison were viewed; reference material is not shipped. Remaining art differences include simplified enemy materials/shapes and floor dressing; no claim of exact reference parity.

## Current tuning

All content/presentation defaults remain available through the development workbench. Production excludes it and replay helpers. Simulation runs at 60 fixed ticks/s; host slow motion changes pacing only.

| Item | Value |
|---|---|
| Play/scenery half-width; leash | 17 / 24 u; 1.5 u band, strength 5 |
| Spawn ring / sparse cadence | 14, 15.1, 16.2 u; 48–72 ticks below five alive, otherwise 48–90 |
| Approach Sawlet / Thrower / Shield / Grinder | 9.5 / 4.6 / 5.5 / 3.2 u/s |
| Rally / ordinary bonk knockback | ≤2 enemies, +40% approach, natural recover skip; 0.5 u |
| Attack warnings | 24 / 30 / 36 / 48 ticks; boss ≥48 |
| Landscape camera | 11.2 u desktop / 11 u compact; nominal Core 11.07% / 11.27% screen height |
| Follow | analytic critical damping 0.16 s, look-ahead 1.2 u, centre clamp ±13 u; portrait safe-margin catch-up |
| Portrait compromise | 11 u visible width, Core about 44 px / 5.2% at 390×844; solid under-hull hidden, thin edge retained |
| Hero pool | 4 u radius, alpha .25, slow pulse, orange during Overdrive |
| Impact disc / heavy / inner / scorch alpha | .45 / .6 / .9 / .6; inner width doubled, arcs ×1.3 |
| Star / heavy edge flash | 1 render frame, 1.6× target size; 2 ticks at .06 white |
| Damage numbers | 38 px desktop / 34 px compact, heavy ×1.3, pop1.25, tilt±6°, merging stacks +.16 u |
| FX budget | 8 events stored; 4 Standard / 2 Low drawn, ability plus number reserved; bounded pools/text cache |
| Hit-stop | light2 / medium3 / heavy5 ticks, kill minimum4 |
| Slow motion | heavy kill .35×100 ms; Overdrive entry .3×200 ms; boss phase .25×80 ms; reduced-motion bypass |
| Speed lines / trail / stretch | >80% actual movement speed or Overdrive; 32 Standard /16 Low; 6 ribbon samples; max1.2× |
| Zoom | top speed 2% out, dash4% out, Overdrive entry6% out; existing impact zoom retained |
| Floor / sweep / satellites | variation .135; 64 edge scuffs; alpha .07 sweep8 s; satellite radius33 u, 7.2×1.6×6 u |

Portrait's width constraint deliberately takes priority over nominal landscape Core height: it keeps the hero visible at all four corners and through dashes. A narrow portrait cannot show the same horizontal safety margin at 11–12% screen height. The board documents the result instead of claiming the landscape scale there.

## Fresh normal-play evidence

`review/focus/waves2-3-desktop.mp4` and `waves2-3-compact.mp4` are 30-second captures through the real host, normal HP/damage, default stats and legal run upgrades. Wave 1 is set up by replaying the same normal inputs; no accelerated damage/clears or retained hero HP. A one-second upgrade-selection dwell is included. The deterministic moving bot steers, dodges, flanks shields and uses normal abilities/Overdrive. Recordings end on wave-3 upgrade selection. The post-clear choice screen is not an empty combat gap.

| View | Maximum wall bonk gap | Maximum hull proxy | rAF p95 | Replay exact |
|---|---:|---:|---:|---|
| desktop | 1.382 s | 3.47% | 17.7 ms | yes |
| compact | 1.383 s | 5.38% | 17.7 ms | yes |

Hull coverage is a 32×18 ray-box sample proxy, not hand-segmented imagery; screenshots were inspected too. Bonk gaps are measured between hits in each active wave, including entry-to-first-hit; the headless test separately enforces ≤2 s in waves1–3. These establish this bot path, not all human balance. The same bot reaches Rex at72 HP; wave4 maximum gap is2.32 s, outside the requested waves1–3 pace gate. Both normal recordings show Overdrive, trails, hit rings/numbers and finite-wave cleanup. Full hashes and samples are in `review/focus/capture-report.json`.

## Hardware budgets

Headed Chromium, verified ANGLE Metal Apple M4. Requested DPR2; actual renderer caps Standard1.5 / Low1. Each case warms30 frames and samples180 rAF intervals. Stress fixtures retain HP to preserve Rex+six adds, twelve mixed enemies and corner coverage. Calls/triangles are sampled peaks; gameplay budgets assert Standard≤120 /60,000 and Low≤70 /25,000, plus actor limits Core8k/enemy2k. High and the dedicated close-up Core diagnostic studio are outside these gameplay budgets; lobby/workshop use the gameplay kit. No software-renderer or physical-phone performance inference.

**Final peaks: Standard107 calls /47,792 triangles; Low70 /22,872. Highest p95:17.7 ms.** Low meets its call cap exactly, so new effects need another budget check.

| Viewport | Tier | Scene | p50 ms | p95 ms | Peak calls | Peak triangles |
|---|---|---|---:|---:|---:|---:|
| 1280×720 | standard | rex-six-adds | 16.7 | 17.6 | 81 | 30,619 |
| 1280×720 | standard | wave4-twelve | 16.7 | 17.7 | 86 | 30,804 |
| 1280×720 | standard | corner | 16.7 | 17.7 | 105 | 47,648 |
| 1280×720 | low | rex-six-adds | 16.7 | 16.8 | 68 | 19,739 |
| 1280×720 | low | wave4-twelve | 16.7 | 16.8 | 70 | 20,338 |
| 1280×720 | low | corner | 16.7 | 16.8 | 69 | 22,784 |
| 844×390 | standard | rex-six-adds | 16.7 | 16.8 | 81 | 30,619 |
| 844×390 | standard | wave4-twelve | 16.7 | 16.8 | 91 | 30,804 |
| 844×390 | standard | corner | 16.7 | 16.7 | 107 | 47,792 |
| 844×390 | low | rex-six-adds | 16.7 | 16.8 | 68 | 19,739 |
| 844×390 | low | wave4-twelve | 16.7 | 16.8 | 70 | 20,338 |
| 844×390 | low | corner | 16.7 | 17.7 | 69 | 22,872 |

## Validation and reproducibility

- `pnpm check`: 71 tests, both Ritmo schedule audits, TypeScript/lint/content/source validation green. New coverage includes play zone/leash/spawns/lanes, Rally/stun/warnings/cadence, normal-HP bot gaps and moving FX bounds.
- `pnpm build`: green, production debug/reference exclusion passes. Existing ~1 MB entry chunk warning remains.
- `pnpm perf`, `pnpm shots`, `node tools/feel-scenes.mjs`: repeated after final FX culling fix; budgets and 14-scene Standard/Low captures pass.
- `node tools/focus-inputs.mjs`: keyboard events, simultaneous joystick+touch ability/dash, emulated controller, exact replay, corner visibility and HUD separation at 1280×720,844×390,640×360,390×844. `review/focus/inputs.json` and layout board record the results. This verifies browser input paths, not a physical controller or touch-device FPS.
- Existing completion controls, startup, asset retry, four-wave run, options/save and production touch/loss/retry/equip-reload harnesses passed. Browser harnesses share port5201; run them sequentially.
- `node tools/focus-review.mjs`: normal replay-backed30s recordings and samples; `node tools/focus-bot.mjs`: headless pace summary.
- `review/feel-source.zip`: refreshed exact32 files from src/presentation, src/content and src/ui only; extracted bytes verified against current source. Hash in review/focus/source-zip.sha256. No models, dependencies or reference art.

No deployment was performed. Physical-device testing was removed from this sprint by the owner's latest request; it is not a pending approval/blocker. Owner feel/art review remains the acceptance step.
