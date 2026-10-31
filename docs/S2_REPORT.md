# NEXT_WORK — Session 2 review

2026-10-31 · Q1–Q5, B1–B6, F1–F5. Part A remains accepted. Session 2 implementation and automated/browser verification are complete. Human first-time comprehension and final art/feel acceptance are not self-certified.

## Item ledger

All evidence is captured from the running Three.js game. `shots/s2/` paths below are repository-relative; each `desktop` capture is 1280×720 and each `compact` capture is 844×390. Controlled feature scenes restore validated deterministic snapshots; the normal-play clip uses normal tuning and recorded movement/ability/upgrade intents. No reference art is used as game assets.

| ID | Status | Viewed evidence, desktop + compact | Result |
|---|---|---|---|
| Q1 | DONE | `roster-{desktop,compact}.png`, `whirler-active-{desktop,compact}.png` | Grey worn steel, rusty edge variation, bright bevels and animated streak/sparkle shader. |
| Q2 | DONE | `eyeAction-*`, `eyes-*`, `hurtEyes-*`; `eyes-details.jpg` | Round idle, angular action, narrower red extreme and hurt flicker; 80 ms morph. |
| Q3 | DONE | `repair-{desktop,compact}.png` | +25% maximum HP once per wave, actual repair amount, nano feedback; HP wear threshold clears naturally. Boss thresholds never repair. |
| Q4 | DONE | `far-{desktop,compact}.png`, `far-combat-*`, `options-*` | Four saved presets, V/C/wheel/pinch/buttons. Readable HUD and fixed-pixel numbers at Far. |
| Q5 | DONE | `lobby-rotate-{desktop,compact}.png`, `review.json` | Mouse/touch drag, inertia, idle spin, double-tap reset and right-stick rotation verified. |
| B1 | DONE | `quality-*`, `perfect-*`; normal-play clip | Real sim-produced rear/counter/perfect events; armour, punish windows, real-attack i-frames and timed next-hit bonus. |
| B2 | DONE | `whirler-*`, `whirler-active-*`; `whirler-reward-*.webm` | Five-role roster, tool hints, three tilted steel blade arms, warning sectors and safe-centre/arm-hit rules. Both blade faces retained after batching. |
| B3 | DONE | `projectiles-{desktop,compact}.png`; ability clips | Enemy spinning saw discs and pooled floor-impact scars replace yellow shots. |
| B4 | DONE | `spin-*`, `stomp-*`, `boost-*`; `abilities-inputs-*.webm` | Three-tick whirlwind, leap/slam, launch/stun, cracks/chunks/runes and forward jet cone; cooldown and name feedback. |
| B5 | DONE | `blade-*`, `bladeFan-*`, `bladeRing-*`, `reward-*`; `final-smoke.json` | Auto-fire, four orbiters, five-shot fan and eight-shot ring. Actual boss kill unlocks, equips and saves Blade; reload verified. |
| B6 | DONE | `quality-*`, normal-play clip; `normal-bot.json` | Timed chains to ×10 multiply kill score, not damage; hurt resets. Rex retains final-hit quality bonus. |
| F1 | DONE | `roster-*`, `level-*`, `boss-*`, `reward-*`; normal-play clip | Persistent goals/score/enemy count, level cards and phase-segmented boss bar. Three score-gated levels lead to Rex. |
| F2 | DONE | `bindings-*`, `controller-*`, `touch-compact.png`; `inputs-motion.json` | Saved conflict-checked rebindings, actual rebound key, device glyph changes and held-controller/keyboard switching verified. |
| F3 | DONE | `rex-tips-1-*`, `boss-exposed-*`, `weakspot-*`; ability clips | First two encounters show skippable tips. Exposed plates last 0.8 s, glow orange and take ×2 damage; phase text/cuts remain visible. |
| F4 | DONE | `upgrade-*`, `build-*`, `build-pause-*` | Icons, tags, rarity edges, plain explanations and real before→after values; owned strip/pause list, first-pick explainer and actual current/max integrity. |
| F5 | DONE | `deathActual-*`, `reward-*`; `inputs-motion.json` | Score/target, stars, best combo, actual final-hit frame and killer-specific tip. Retry measured at 33 ms desktop / 26 ms compact. |

`*` in an item name means both desktop and compact versions, unless explicitly qualified. Overview contact sheets: `board-desktop.jpg`, `board-compact.jpg`. Motion contact sheets: `normal-motion-board.jpg`, `abilities-motion-board.jpg`. Per-item source switches are in `src/content/items/switches.ts`; the implementation commits are prefixed with their IDs. Disabling a switch preserves readable save schemas.

## Not done

- No Session 2 item is omitted.
- **S2 human comprehension gate: UNVERIFIED.** Automation verifies the visible goal, Rex tips, upgrade explanations and inputs, but cannot establish what a first-time human can explain after one minute. Owner playtest/art/feel acceptance remains open.
- Physical-phone measurements were explicitly waived. Compact/touch/controller browser checks do not certify every physical device.
- Sessions 3 and 4 are next sessions, not completed here: full Scrapyard world/config/seeded layouts/vents and later desktop tiers/effects/additions remain tracked by their IDs in NEXT_WORK.

The wave strip uses an increasing wave number with **SCORE GATE** as its denominator: the total wave count is unknown until the target is reached. It does not falsely promise a fixed four-wave level. Reaching the score target still requires clearing the current wave and choosing its upgrade before the level card/continuation.

## Tunables and behavior

| Area | Values |
|---|---|
| Camera | Close 0.85 / Default 1.15 desktop (1.0 compact/coarse input) / Wide 1.5 / Far 1.9 |
| Wave repair | 25% maximum integrity, constrained to 20–30%; clamped to max; once per full clear |
| Hit quality | Rear ×1.5; armoured front ×0.3, Shieldsaw front ×0.1; punish ×2 for 36 ticks; final 9-tick counter window; 18-tick stagger |
| Perfect dodge | Real attack overlap only; Heat +12; next hit ×1.5 for 90 ticks; once per attack identity |
| Heavy punishment | Grinder sweep 30 damage; ordinary front spam retains armour reduction |
| Whirler | 48 HP; 42-tick warning; 36-tick sweep/recovery; 18 damage; three rotating arms, 2.5 u reach; 30°/45° blade tilts |
| Spin | 42 ticks, three damage ticks, 24 base total; pull, radius rune and shared aftermath pool |
| Stomp | 21-tick anticipation; 20 damage; 36-tick enemy launch/stun |
| Boost | 14-damage forward cone, 3 s base recharge |
| Blade | Auto shot every 45 ticks, 6 damage, 14 u/s, 72-tick life; four 4-damage orbiters for 180 ticks; E fan 5, X ring 8 |
| Score | 120-tick chain window, ×10 cap; kill values Sawlet100 / Thrower150 / Shieldsaw220 / Grinder350 / Whirler280 / Rex2000, before combo/quality bonuses |
| Objectives | Per-level 3,000 / 6,500 / 11,000; full-wave clear + upgrade; level unlock cards; then Rex |
| Rex | Four approved HP phases unchanged; 48-tick exposed-plate opening; tips on first two encounters |
| Presentation budgets | Batched actor bodies/steel, shared FX pools, single-pass flat transparency, Low roster geometry LOD; no new package install |

The functional score/level foundation was necessary for truthful F1 objectives. Session 3 D/E still owns per-level world layouts/vent seeds/mechanics and chapter configuration.

## Checks and budgets

- `pnpm check`: **PASS, 101 tests**, both Ritmo audits, TypeScript and source/content validation. Remaining lint warnings are the pre-existing unused arguments in the historical feel capture and an unnecessary spread in the stage loop.
- `pnpm build`: **PASS**; production validator confirms no debug API, workbench or reference assets in the bundle. Vite reports its existing large-chunk advisory.
- Production smoke: **PASS** startup, no debug/settings exposure, touch Spin, loss/retry, saved Blade selection/reload and Blade ability. `shots/run/production.json`.
- Browser regressions also pass: `tools/run-playtest.mjs` (real upgrade/continuation inputs, Overdrive, accelerated complete run and exact headless replay), `tools/boss-playtest.mjs` (four warning phases and reward), `tools/options-playtest.mjs` (pause/focus, saved settings and Low canvas). Controlled Rex opening checks show an actual heavy attack exposing plates for 48 ticks and the first Spin tick dealing **16 vs base 8**.
- Normal-stat deterministic bot: Levels 1–3 → Rex in **33.3 simulated seconds**, **120/120 HP** after the legitimate Reinforced Shell pick. Picks: Heavy Core, Wide Orbit, Reinforced Shell. Maximum bonk gaps by level: **1.08 / 1.65 / 1.45 s**. This is regression/fairness evidence, not human difficulty acceptance.
- `pnpm perf` now runs the current Session 2 matrix. 24 headed hardware-GPU stress cases: desktop/compact × Standard/Low × Default/Far × twelve mixed enemies, Rex+six adds, corner. Apple M4 via ANGLE Metal, DPR2. Active Blade auto-fire, Spin, Stomp and scars included. `shots/s2/perf.json`.

| Tier | Peak calls | Peak triangles | Required maximum | Highest measured p95 |
|---|---:|---:|---|---:|
| Standard | 88 | 52,016 | 120 / 60,000 | 17.7 ms |
| Low | 70 | 24,061 | 70 / 25,000 | 17.7 ms |

Core geometry is 3,010 triangles; roster actors range 768–1,546 before Low simplification. No universal FPS or physical-device claim is made. Low is at its draw-call ceiling; Session 3 must preserve the budget as the world expands.

## Clips to review

- `shots/s2/normal-play-32s.webm` — at least 30 s of normal-stat live gameplay; bot-generated input, ordinary run upgrades, no stress-stat overrides.
- `shots/s2/abilities-inputs-desktop.webm` and `abilities-inputs-compact.webm` — input/rebinding, Core/Blade Spin, Stomp and Boost; normal-stat controlled scenes.
- `shots/s2/whirler-reward-desktop.webm` and `whirler-reward-compact.webm` — live warning/sweep, boss reward and saved Blade equip flow; controlled feature scenarios.

The Spirit Call comparison remains a local study of framing, readable actors/telegraphs and restrained UI. Full Scrapyard density/lighting is Session 3; this report does not claim complete visual parity.

## Raw owner-note audit

Re-read NEXT_WORK's raw Owner notes before reporting. Every semicolon-separated request maps to an existing item or accepted Part A; **no orphan request** was found.

| Owner request | Coverage |
|---|---|
| Vents not done as decided | C1, Session 3, blocking |
| Environment feel/lighting/shadow/background detail missing | C3/C4/C5/C6, Session 3 |
| Uneven damaged tiles and colour shades | C2/C0, Session 3 |
| Alive outer scrapyard, boards, blades and sparks | C3/C6, Session 3 |
| Purple space; Chapter 1 brown/red/rust/grey | Colour direction applied to floor now; full C0/E world configuration Session 3 |
| Steel or rough rusty enemy blades | Q1, DONE |
| Rotatable lobby hero | Q5, DONE |
| More zoom out | Q4, DONE |
| HUD/key bindings match active input | F1/F2, DONE |
| Idle/action/extreme eyes | Q2, DONE |
| How to defeat villain | F3, DONE |
| Understandable upgrades | F4, DONE |
| Heal 20–30% per wave | Q3, DONE |
| Wave, target, enemy/own/boss health, finished state | F1/F3/F4/F5, DONE; existing enemy HP bars retained |
| Amazing effects/transitions/lighting/shadows | B4 now; C4 Session 3, H1 Session 4 |
| Trending flash/shake/blur; later sound | Existing feel feedback retained; H1/H2 Session 4, no audio added |
| Spinning blades on hero | B4/B5, DONE |
| PC/laptop/mobile; not mobile-centric | Desktop/compact and device checks now; G1/G2/G3 Session 4 |
| Every change revertible | Sixteen item switches/modules and ID-prefixed commits |
| Do not miss requests | Full sixteen-ID ledger and this audit; future IDs retained |
| Levels 1–3 by score → Rex → Blade | F1 foundation/B5 now; D/E world/layout portion Session 3 |
| Blade shoots spikes | B5, DONE |
| Enemy 30°/45° spinning arms | B2, DONE |
| Angle/timing/rock-paper-scissors/punish | B1/B2, DONE |
| V/C zoom | Q4, DONE |
| Hero damage deformation | Accepted Part A retained; repair changes wear by HP threshold |
| Neon vents with smoke/random positions | C1, Session 3, blocking |
| Chapter-specific themes | C0/E, Session 3 |

## Retrieval

Git checkpoint: `next-work-s2` on `main` in the owner’s REDLINE repository. `review/next-work-s2-source.zip` is the local source/docs/assets packet; evidence is retained separately in Git under `shots/s2/`. Previous accepted Part A and earlier sprint tags remain available.
