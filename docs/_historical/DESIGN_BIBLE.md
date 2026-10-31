# REDLINE — DESIGN & BUILD BIBLE v4
### Fast isometric action-RPG arena game · sphere fighters · bolt-on abilities · Heat/Overdrive · built by AI agents (Codex) with MCP tools

> **PRECEDENCE (v4, 2026-10-30):** `docs/SLICE_LOCKED_DECISIONS.md` (owner-approved) **wins over this file**. This Bible's **§24 (v4 overrides + Chapter 1 numbers)** wins over §0–§23 where they differ. Visual rules live in `docs/STYLE.md` and `docs/ART_BRIEFS.md`; story in `docs/STORY.md`; fun/addictiveness in `docs/FUN_LAYER.md`; links in `docs/LINKS.md`; the build plan in `docs/PHASES.md`.
> **Working title:** REDLINE (placeholder; name/trademark not checked).
> **Supersedes** the Caddis design (v1/v2), which is archived. Reused from it: the deterministic-sim architecture, parts-on-sockets, 3 stackable challenges, 12-upgrade pool, save schema, quality-gate idea, feel numbers, look-loop pipeline, asset contract.
> **Companion file:** `docs/PLAYBOOK.md` (originally `CADDIS_PIPELINE_PLAYBOOK_v1.md`) (tools, licences, setup commands, model/effort table, loops, prompt library, sources). Where this file and the playbook disagree, **this file wins** on game design and the playbook wins on tool setup. Rename the playbook to `docs/PLAYBOOK.md` in the repo.
> **Labels:** **[LOCKED]** the user decided · **[START]** starting number to tune by feel · **[SUGGESTION]** my recommendation · **[UNVERIFIED]** not confirmed from a source · **[RISK]** could go wrong.
> **Date written:** 2026-10-29; **updated 2026-10-30 (v3.1)** with tool research (BlenderLens, threejs-devtools-mcp, PolyFork licence, SpriteCook pricing, VibeInc AI Art Team) and Phase-0 spikes. Prices, licences, quotas, versions change; re-check before relying on them.
> **Pack files:** `README_FIRST.md`, `AGENTS.md`, `docs/{SLICE_LOCKED_DECISIONS,DESIGN_BIBLE,PHASES,STYLE,ART_BRIEFS,STORY,FUN_LAYER,LINKS,PLAYBOOK,ASSETS,REFERENCES,DECISIONS,PROGRESS}.md`, `art/` (concept images + README), `ref/README.md`. **`docs/PHASES.md` is the step-by-step build plan with prompts.**

---

## 0. RULES FOR ANY AI READING THIS (follow these exactly)
1. **Read §0–§6 fully before writing code.** Do not build features that are not in §16 (scope). If something is unspecified, ask using the ask-protocol (§19.1); do not invent.
2. **Feel first.** Order of work: controls → dash → hit feel → enemy AI → fights → art/animation → transitions/VFX → UI/lobby → device polish → audio (last, minimal). Audio is out of scope until the user adds it.
3. **Simulation and rendering are separate.** `sim/` is deterministic, headless, fixed-step; never import `three`, DOM or UI into it. Rendering only reads sim state.
4. **Content is data.** Forms, parts, enemies, waves, upgrades live in `src/content/*.json|ts`. Visuals are attached only through `src/render/looks.ts` (content id → look). No asset paths inside content.
5. **Animation follows the sim.** Timings (`windup_ms`, `hit_ms`, `recover_ms`) are data; clips/tweens stretch to fit; no root motion; no hitboxes from clips.
6. **Everything tunable lives in a debug panel** (open with the backquote key, dev builds only). No magic numbers.
7. **Never ship reference images or unlicensed assets.** Log every asset in `docs/ASSETS.md` (file, source URL, author, licence, date, modified?).
8. **Verify before claiming done:** run `npm run check` (typecheck + sim tests + bot run + asset validation), and look at the game in a real browser at a phone viewport with touch.
9. **Small commits, explain why.** No pushes/deploys unless asked. Stay inside the project folder.
10. **Honesty:** if something failed or was not tested, say so. Never claim a number was measured if it was not.
11. **Spikes before commitments.** Diorama, Ritmo, SpriteCook and the two look options are *candidates*, decided by the Phase-0 spikes in `docs/PHASES.md`, not assumed. Record each decision in the decisions log (§1) with the evidence.

---

## 1. DECISIONS LOG
| # | Decision | Status |
|---|---|---|
| D1 | **Universe:** REDLINE: a ring-station galaxy of sphere fighters. Hero = **the Core** (plain sphere, eyes only) with bolt-on forms. Caddis larva archived. | [LOCKED] |
| D2 | **Six forms** at launch: Wing, Blade, Frog, Fist, Spike, Coil. Each has a colour, biome, culture, boss. Growth path to 60 (§15). | [LOCKED] |
| D3 | **Soft rock-paper-scissors wheel** (§4). Correct ×1.3, wrong ×0.85, time-to-kill penalty ≤1.6×. Never a hard wall. | [LOCKED] |
| D4 | **Characters have only eyes** (no nose/ears/mouth). Eyes carry emotion, telegraphs and feedback. | [LOCKED] |
| D5 | **Chapter = one biome.** Defeat its form's boss to unlock that form. **Chapter 1 = Foundry Scrapyard, Blade, boss Scrap-Rex.** Finish and polish this fully before any other chapter. | [LOCKED] |
| D6 | **Controls:** move, auto-aim basic attack (unlimited), dash, **Q** = Arms ability (2 s CD), **E** = Back ability (3 s CD), **X** = Legs ability (4 s CD), **R** = Overdrive. Keyboard, gamepad, touch. | [LOCKED, numbers START] |
| D7 | **Local save only** (no accounts, no leaderboard) in v1. | [LOCKED] |
| D8 | **Co-op later** (after the story is complete), then gladiator PvP, then a massive finale fight. | [LOCKED] |
| D9 | **Audio ignored for now.** Hooks left so metal music + beat-synced feedback can be added later. | [LOCKED] |
| D10 | **Engine: TypeScript + Vite + Three.js.** Godot only as a measured fallback if gate G2 fails on a real phone. | [LOCKED] |
| D11 | **Built mostly by GPT agents (Codex)** with MCP tools; user playtests, picks taste, approves art. | [LOCKED] |
| D12 | **Look:** default **Option A = smooth toon** (matches the user's mood frame). **Option B = Diorama-style pixel/dither** is tested in spike S1; chosen by the user on one approved frame at phone size. Diorama's *process* (frame = pure function of time, QA harness) is borrowed either way. | [DECIDE in Phase 0] |
| D13 | **Sim framework:** default plain TypeScript (strict types, deterministic, replay-hash test). **Ritmo** adopted only if spike S2 passes (headless sim + Three bridge + replay hash + co-op transport verified in code). | [DECIDE in Phase 0] |
| D14 | **Asset gate:** every model passes `blenderlens-mcp check` (CLI) or our `asset-validate.mjs` before it enters the game. | [LOCKED] |

---

## 2. PILLARS & NON-GOALS
**Pillars**
1. **Anyone can pick it up in 10 seconds.** One thumb to move, everything else auto or one tap.
2. **Fast and fearless.** Heat rises as you fight; Overdrive feels like a nitro boost.
3. **Every hit feels good.** At least 3 feedback layers on every hit (§8).
4. **Fair.** Every attack is telegraphed (≥0.4 s; heavy/boss ≥0.8 s). You always know why you died.
5. **Build identity.** Your Core wears the trophies of the forms you beat.
6. **Retry in under 2 seconds.**

**Non-goals (do not build now):** timers or speedrun challenges, hundreds of *threatening* enemies (a capped tier of harmless Scrapbit fodder is allowed, see §24.3), a story told in cutscenes, online PvP, accounts/leaderboards, a map editor, in-run part swapping, audio.

**Benchmarks (what we study, not copy):** **Spirit Call** (author's repo docs: few, tougher enemies; no timers; telegraph floors; deterministic sim; fairness gates), **Brotato** (short runs, easy start, build variety), **NFS Most Wanted** (the *feeling* of a boost: FOV kick, blur, streaks, rival ladder), **Valorant** (a growing roster with kits and maps; we copy the content model, not art).

**Honest comparison with Spirit Call [SUGGESTION]:** we will not match its total content or its years of tuning. A polished slice can match its *feel* in a narrow area; we differentiate on identity (sphere forms, wheel, Heat/Overdrive, trophy parts).

---

## 3. THE WORLD & STORY
> Canon is in `docs/SLICE_LOCKED_DECISIONS.md` §3 and `docs/STORY.md`. Summary: a giant **Engine** stalled at its **redline** long ago; six cultures grew around its broken pieces; **the Core** is the one piece still running (a spare that wakes up). Each boss holds a piece of the Engine; you bolt it on and gain its ability until you reach the **Throne Engine** and restart it. (The earlier "Blacklist/Orbit rulers" framing is dropped; the HUD boss bar uses the boss's name only.)
**Tone:** loud, fearless, fun, never gory. All ages. Story is told by **comic cards ≤10 s, skippable**, not cutscenes.

### 3.1 Eyes as the face
**Core:** two flat white shapes that morph (no pupils/brows/mouth). **Enemies:** narrow glowing triangles with a white-hot core, flashing before attacks. See `docs/STYLE.md` §4.

### 3.2 Districts (biome · form · culture · champion)
| Ch | Biome | Form | Colour ramp | Culture (idea) | Champion [names are placeholders] |
|---|---|---|---|---|---|
| 1 | **Foundry Scrapyard** | BLADE | steel, crimson, neon pink/blue signs | The Grinders: hoarders who sharpen everything; scrap-gods of "keep spinning" | **Scrap-Rex** |
| 2 | Cloud Docks | WING | sky cyan, white, gold | The Skyfarers: wind-traders, race on air currents | Skyreaver Vex |
| 3 | Bog Moon | FROG | acid green, teal, mud brown | The Hoppers: swamp chorus, leap-duels | Bogtyrant Gulp |
| 4 | Magma Forge | FIST | ember orange, black rock | The Hammerkin: forge-priests, believe in one perfect strike | Magmaw Brute |
| 5 | Crystal Quarry | SPIKE | amethyst violet, ice white | The Facets: quiet diamond-monks, never retreat | Prism Warden Geode |
| 6 | Storm Reactor | COIL | electric yellow, deep blue | The Arc-Choir: lightning singers | Voltarch |
| Finale | Throne Engine | ALL | all six ramps + Core's own red/chrome | The Engine | Throne Engine |

**Rule:** one colour ramp per biome/form; each culture has its own **prop language** (Grinders: gears, saw-signs; Skyfarers: pennants, balloons; Hoppers: lily pads, drums; Hammerkin: anvils, chains; Facets: crystals, mirrors; Arc-Choir: coils, antennae).

---

## 4. THE SIX FORMS & THE WHEEL
### 4.1 Forms (what each does)
| Form | Slot | Identity | Q/E/X ability (starting idea) | Strength | Weakness |
|---|---|---|---|---|---|
| **BLADE** | Arms (Q) | Spinning cutter | **Q Spin-Cut:** 1 s spin that hits everything around, moves you slowly | Crowds, sweeping | Exposed while spinning |
| **FIST** | Arms (Q) | Heavy hands | **Q Grab-Smash:** grab nearest enemy, slam, small shockwave | Burst damage | Slow, short range |
| **FROG** | Legs (X) | Bouncy leaper | **X Leap-Slam:** big jump with landing shockwave + stun | Gap-closer, crowd stun | Predictable landing |
| **WING** | Back (E) | Hit-and-run flier | **E Dive-Strike:** fast dash that hits through enemies | Speed, safety | Low damage |
| **SPIKE** | Back (E) | Diamond armor | **E Crystal Guard:** 2 s block, then fire spikes outward | Tank, ranged | Slow movement |
| **COIL** | Back (E) | Chain lightning | **E Arc:** chain lightning that stuns | Stun, chain | Short range |
**Slot note [SUGGESTION]:** Back has 3 parts and Legs has 1. Add Legs variants later (e.g., Treads) and consider a "Head" slot. For v1 only **Arms/Legs/Back** exist; empty slots use **Core defaults** (§6.4).

### 4.2 The wheel (each form beats two, loses to two, neutral to one)
| Form | Beats (×1.3) | Loses to (×0.85) | Neutral |
|---|---|---|---|
| Wing | Blade, Frog | Spike, Coil | Fist |
| Blade | Frog, Fist | Coil, Wing | Spike |
| Frog | Fist, Spike | Wing, Blade | Coil |
| Fist | Spike, Coil | Blade, Frog | Wing |
| Spike | Coil, Wing | Fist, Frog | Blade |
| Coil | Wing, Blade | Spike, Fist | Frog |

**Why (so the player can learn it):** Wings fly over spins and leaps · Blades shred slow arms and a frog's landing · a frog's slam ignores armor · Fists crush crystal and wear insulated gloves vs. lightning · Spikes ground lightning and shoot fliers · Coil conducts through metal and hits fliers.

**Rules**
- The multiplier applies to **damage dealt by a part's ability and basic attack tagged with that form** against an enemy of the target form.
- **Soft:** the time-to-kill ratio between the best and worst loadout against any enemy group must be **≤1.6×**, bot-checked (gate G6).
- UI shows a **recommended loadout hint** and a **▲/▼ matchup icon** on hit numbers. Never a gate.
- In PvP/co-op (later) the wheel stays but multipliers shrink to ×1.15 / ×0.9 [START].

---

## 5. CONTROLS, CAMERA, UI LAYOUT
**Camera [START]:** fixed isometric: yaw 45°, pitch ~50–55°, low-FOV perspective (or orthographic). Follows the Core with a small look-ahead. **No player camera rotation.**

| Action | Keyboard/mouse | Gamepad | Touch |
|---|---|---|---|
| Move | WASD / arrows | Left stick | Floating left stick |
| Aim | Auto-aim nearest threat; mouse can nudge | Right stick nudges | Auto only |
| Basic attack (unlimited) | Auto, or hold J/LMB | Auto, or RT | Auto |
| Dash (i-frames) | Space / Shift | A / RB | Dash button |
| Arms ability | **Q** | X | Q button |
| Back ability | **E** | Y | E button |
| Legs ability | **X** | B | X button |
| Overdrive | **R** | LT / RB+LB | R button (glows when ready) |
| Pause | Esc | Start | Pause icon |
**Touch layout:** left thumb = stick; right thumb = dash (largest), Q/E/X arc around it; Overdrive above. Buttons ≥ 56 px, spaced for thumbs, radial cooldown fill. **Rebinding, left-handed mirror, button size slider.** Input buffer **0.08 s** [START].

**HUD:** HP bar, Boost/Heat meter, three ability buttons with cooldown rings, wave banner, boss bar (top right), score + multiplier, challenge chips. Large, readable, thumbnail-friendly. **Do not show text smaller than ~14 px at phone size.**

---

## 6. CORE GAMEPLAY SYSTEMS
### 6.1 Core stats [START]
HP 100 · move speed 6 u/s · basic attack: auto-aim nearest enemy in 2.5 u, 0.45 s cadence, 8 dmg · dash: 0.20 s, 4 u, **i-frames 0.20 s**, 2 charges, 1.2 s recharge · Q cooldown 2 s · E 3 s · X 4 s · Overdrive charge from Heat.

### 6.2 Heat & Overdrive (signature system)
- **Heat 0–100**, shown as a meter with tiers: **Cool (0–29), Warm (30–59), Hot (60–89), MAX (90–100)**.
- **Gain:** kills (+4 small / +10 heavy), perfect dodge (dash through an attack inside its last 0.15 s: +8 and slow-mo), consecutive-hit combo.
- **Loss:** by hit tier (§24.2): light −10 / medium −15 / heavy −25 Heat; slow decay (−3/s) after 3 s without a kill.
- **Effects of tiers:** higher tier = **more enemies spawned (+10% per tier, still ≤12 cap)** and **score multiplier ×1 → ×5**, so Heat is risk/reward without a timer.
- **Overdrive (R when Heat ≥ 90):** 5 s [START]: +30% move, +25% damage, **dash is free**, attacks pierce small enemies. Ends by a visible "cool-down" pop. Costs all Heat.
- **Boost feel (NFS-inspired, but not a copy):** FOV kick +8°, radial blur at screen edges, speed streaks, chromatic aberration pulse, vignette, camera shake spike, brief time-slow on trigger (0.1 s at 40%), eye trails. All effects have **quality tiers** and a **reduce-flash/motion** setting (§9.4, §13).

### 6.3 Combat feel stack (every hit)
Hit-stop **0.04 s light / 0.07 s heavy** · screen shake (trauma² × 8 px, decay 1.5/s) · knockback **0.8 u light / 2.5 u heavy** · enemy flash white 0.06 s · squash-and-stretch · hit spark + ring · kill-pop particles in the enemy's colour ramp · damage number (matchup ▲/▼) · eye reaction. **Rule: ≥3 layers fire on every hit; log them in dev builds.** Dodge slow-mo: 0.15 s at 30% speed. [All START]

### 6.4 Core defaults (so Q/E/X always have something)
| Slot | Default | Behaviour |
|---|---|---|
| Arms (Q) | **Pulse Bash** | Short radial knockback, small damage |
| Back (E) | **Boost Burst** | Quick forward hop (not i-frames) |
| Legs (X) | **Stomp** | Small area stun |
Parts **replace** the default in their slot. Chapter 1's reward (Blade) replaces Q.

### 6.5 In-run upgrades (1-of-3 after each wave; run-only)
Rarity weights **60 / 30 / 10** (common/uncommon/rare). [from review; renamed for this universe]
| Rarity | Upgrade | Effect |
|---|---|---|
| Common | Sharpened | +15% basic damage |
| Common | Light Frame | +10% move speed |
| Common | Thicker Plating | +20 max HP |
| Common | Heat Bloom | +25% Heat gain |
| Common | Dashwise | −15% dash cooldown |
| Uncommon | Whirl | Basic attack hits 360° for 3 s after dash |
| Uncommon | Leech Weld | Heal 1 HP per kill |
| Uncommon | Mirror Plate | 15% chance to reflect projectiles |
| Uncommon | Lightfoot | +1 dash charge |
| Rare | Second Wind | +1 Overdrive charge (use twice) |
| Rare | Trophy Surge | +30% part-ability damage |
| Rare | Redzone | Below 30% HP: +40% damage, +10% speed |

### 6.6 Parts schema (data)
```json
{ "id":"blade_spincut", "form":"blade", "slot":"arms", "key":"Q",
  "stats":{"dmg":10,"range":1.8,"cooldown":2.0,"weight":2},
  "ability":"spin_cut",
  "timing":{"windup_ms":120,"hit_ms":900,"recover_ms":200},
  "tags":["slash"], "look":"blade_arm" }
```
Enemies carry `"form":"blade"`, hp, speed, `attackPattern`, timings. The matchup multiplier is computed from the `form` fields only.

### 6.7 Run flow [LOCKED]
Equip parts **before** a run from the unlocked set (max 3: Arms + Legs + Back). **No mid-run swapping.** Loop: **challenge → unlock → equip → retry.** In-run variety = upgrades.

### 6.8 Challenges (stackable, 3 per chapter) [LOCKED]
1. **Clear all 4 waves** (boss not required). 2. **Flawless:** take **zero damage** in waves 1–4 *and* the boss. 3. **Defeat the boss.** A single flawless boss run completes all three. Completing the boss challenge unlocks the form's part. (No timers.)

### 6.9 Fairness rules
Telegraph ≥0.4 s (heavy/boss ≥0.8 s; Spirit Call's floor is 0.3 s) · **max 3 enemies attacking at once** (engagement slots) · **hard cap 12 enemies on screen; extras queue and spawn on kills** · next wave begins at ~70% cleared · no spawn on the player · bots (0.25 s quick / 0.4 s learning reaction) must be able to clear with no unavoidable damage (G3).

### 6.10 Death & retry
Death → 0.6 s slow, "knocked out" eyes → retry button focused → new run in **<2 s**. Show **the killing attack** (freeze-frame highlight of the enemy and the telegraph) so the player learns.

---

## 7. CHAPTER 1: FOUNDRY SCRAPYARD (the entire first deliverable)
**Look:** floating scrapyard slab in space, rusty steel, neon pink/blue signs, piles of scrap, an arena ring, sparks, galaxy sky (inspired by the user's mood screenshot, which is an AI mock-up used for palette and mood only).
**Arena:** 40×40 u floating slab; central clearing; scrap-pile cover; **hazards:** telegraphed falling scrap crates (1 s warning circle) and a conveyor edge that nudges you; soft edges (respawn at center, −10 HP).

**Enemy roster (all tagged BLADE; seen at 32 px they must still read)**
| Enemy | Role | Behaviour | Telegraph |
|---|---|---|---|
| **Sawlet** (small) | Swarm | Chases, quick spin-dash | Eyes flash red 0.4 s, wheel whines |
| **Rivet Thrower** | Ranged | Keeps distance, throws rivets in an arc | Aim line 0.5 s |
| **Shieldsaw** | Armored | Frontal block; weak from behind | Shield glow, 0.6 s windup |
| **Grinder** (rare, tougher) | Heavy | Slow wide sweeping spin | 0.8 s ground ring |
**Waves [START]:** W1: 8 Sawlets · W2: 6 Sawlets + 2 Rivet Throwers · W3: 4 Sawlets + 2 Shieldsaws + 1 Thrower · W4: 5 Sawlets + 2 Throwers + 2 Shieldsaws + 1 Grinder · **Boss.** Target run ≈ 3–4 min.

**Boss: Scrap-Rex** (see §24.4 for the final 4-phase list; this block is superseded)
- **Phase 1 (100–60%):** Chomp-lunge (0.8 s telegraph) · Saw-sweep (ground ring) · calls 2 Sawlets.
- **Phase 2 (60–25%):** adds falling-scrap volleys and a 360° spin that you dodge by dashing *through* the gap.
- **Phase 3 (<25%):** enraged eyes, faster, adds ground lines; **Overdrive is nearly always available — the intended reward moment.**
- Boss intro: camera push 1.08× over 0.5 s + name bar (≤1.5 s, no cutscene). On defeat: slow-mo, explosion pop, trophy drop, **Blade part unlocked** card.

**Done when (Chapter 1 acceptance):** a new player can start, beat waves, see the boss telegraphs, win or lose, retry in <2 s, and unlock Blade — on a phone, keyboard and gamepad, at 60 fps target, with all gates in §14 passed.

---

## 8. ANIMATION, TRANSITIONS & VFX SPEC (the "feels expensive" layer)
**Principle:** the sphere is the hero of animation: **procedural squash-and-stretch, anticipation, follow-through, eye animation** replace skeletal animation. Parts are rigid meshes on sockets with tweened motion.

### 8.1 Core animation (procedural, data-driven)
Idle (breathe/bob + blink), run (roll + lean), dash (stretch + trail), hit (squash + eye hurt), attack (anticipation squash → release stretch), spawn-in (drop + landing dust), death (pop), Overdrive (glow + trail). **Parts:** spin, swing, flap, hop, flare — all from code curves with `windup/hit/recover`.
### 8.2 Transitions [START, all tunable]
| Moment | Effect | Time |
|---|---|---|
| Menu → Workshop | Camera swing + iris wipe in biome colour | 0.35 s |
| Workshop → Run | Core hops into arena, camera pull-back, spawn shockwave | 0.8 s |
| Wave start | Banner slides in; ground spawn rings telegraph 0.5 s before spawn | 0.4 s |
| Level-up pick | 0.2 s slow, card fan-in | 0.25 s |
| Boss intro | Camera push + name bar | ≤1.5 s |
| Boss phase change | Hit-stop, roar ring, tint shift | 0.6 s |
| Overdrive trigger | Time-slow, FOV kick, streaks, chromatic pulse | 0.3 s |
| Win/lose | Freeze + zoom, result card with kill highlight | 0.8 s |
| Retry | Fast wipe | 0.25 s |
### 8.3 VFX list
Hit sparks · impact rings · dash ribbon trail · landing dust · Heat aura pulse · speed streaks · radial blur (edge-only cheap shader) · screen-edge glow · telegraph decals (dim → bright at lock) · kill-pops in faction colours · conveyor/neon pulses · seam/bolt flash on part attach · scrap debris. **Budget:** ≤1,024 live particles (instanced/pooled), no per-frame allocations, fake volumetrics with scrolling-noise cones (not full-screen post).
### 8.4 Loadout Workshop (character creation moment)
Core on a plinth, turntable drag, idle breathing + blinks, eyes track the tapped slot. Tap slot → camera eases to its socket (0.25 s) → part carousel with icon, form colour, one-line ability, **wheel hint** → **attach:** part flies on a curved path, squash on the Core, bolt-flash + weld lines draw on (dash-offset shader), 3-layer feedback → Core flexes the part's signature move (0.5 s) → stats tick up. **≤10 s from open to "go."** Unlock moment: boss trophy drops, Core "welds" it on, slot lights up gold, one-tap equip; skippable.
### 8.5 Eyes
See `docs/STYLE.md` §4 (flat white shape morphs for the Core; glowing triangles for enemies).

---

## 9. ART STYLE & REFERENCE GUIDE
**Superseded by `docs/STYLE.md` (v3) and `docs/ART_BRIEFS.md` (v3), built from the locked art in `art/`.** Key rules: hard blue-violet matcap chrome Core with **two flat white eyes** and **two red crown slashes** (Heat marks); **no ring/belt, pupils, limbs, backpack, headphones, antenna**; rough matte rusty enemies with crimson triangle eyes (white-hot core); floating parts joined by a faint glowing link; attack warnings orange+white, grind sparks yellow-white, pickups mint; look Option A (smooth toon) locked. The earlier prompt pack (§9.4) is obsolete; use the prompt kit in `docs/ART_BRIEFS.md` §8.

---

## 10. UI, LOBBY & MENUS (all in scope for v1)
- **Title / Home:** big Play, Workshop, Challenges, Settings. Core idles with eye blink; parallax galaxy.
- **Chapter select:** a ring-station map with 6 districts (only Ch.1 playable; others silhouetted "coming soon").
- **Workshop:** §8.4.
- **Challenges screen:** 3 chips per chapter with ✓.
- **Results:** score, multiplier, Heat peak, challenges done, **best run vs previous**, kill highlight, **share card** (PNG with seed) [START].
- **Settings:** graphics quality (Low/Med/High, auto-detect), **reduce flash/motion**, screen-shake slider, aim assist, big-text, left-handed mirror, rebinding, touch size.
- **Lobby (v1):** a simple "Ready" hub; online/co-op lobby is a **later** phase (§17).
- **Accessibility:** colour-blind-safe telegraphs (shape + colour), reduce flash, assist options (more HP, slower enemies) [START].

---

## 11. TECH ARCHITECTURE
**Stack:** TypeScript + Vite + Three.js (pin the current stable; `awesome-gamedev-agent-skills` targets r186 [from the skill page]). Menus: plain DOM or Preact.
```
redline/
  AGENTS.md  docs/{DESIGN_BIBLE.md,PLAYBOOK.md,STYLE.md,ASSETS.md,REFERENCES.md}
  ref/  art/  tools/{look-score.mjs,asset-validate.mjs,bots/}
  src/
    sim/      # deterministic: entities, combat, heat, waves, ai, rng, replay
    content/  # forms.json parts.json enemies.json waves.json upgrades.json
    render/   # three scene, toon shader, looks.ts, vfx, postfx, camera
    ui/       # hud, menus, workshop
    input/    # keyboard, gamepad, touch -> commands
    save/     # localStorage schema + migration
    debug/    # tuning panel (dev only)
  test/
```
- **Fixed timestep (60 Hz) sim**, seeded RNG, **no `Math.random`, no wall-clock, no `three` imports in `sim/`.**
- **Input → commands** (move vector, buttons) per tick. This makes **replays and later co-op possible**.
- **Determinism for later co-op:** avoid transcendental math (`Math.sin/cos`) in `sim/` or use lookup tables/fixed-point; add a **replay-hash test** now (record inputs → replay → compare state hash). [RISK: cross-browser float differences; verify on real devices.]
- **Crowds:** instanced meshes; animation by uniform params (squash, spin), not one mixer per enemy.
- **Performance targets [START]:** 60 fps on iPhone 11 / Pixel 4a-class devices; ≲100 draw calls; ≲100k tris; ≤1,024 particles; postfx with quality tiers (Low = none). Test with 4× CPU throttle in Playwright **and** on real devices.
- **Debug panel:** every tunable value, presets `feel.vN.json`, dump/restore the save, force Heat, spawn enemies, slow-mo.
- **Save schema (localStorage, one JSON):**
```json
{ "version":1,
  "unlocks":["blade_spincut"],
  "loadout":{"arms":"blade_spincut","legs":"core_stomp","back":"core_boost"},
  "bestScores":{"foundry":12400},
  "settings":{"quality":"auto","reduceFlash":false,"shake":1.0,"leftHanded":false},
  "completedChallenges":{"foundry":[1,2,3]} }
```
- **Ritmo (typeonce-dev/ritmo):** MIT, TypeScript-first ECS with fixed-step loop, deterministic random, input, math, headless devtools. My own page read (2026-10-29): early-stage (79 stars, no version shown), **Pixi adapter only, netcode not mentioned**. Another assistant's summary (user-supplied, not verified by me) says it has `ritmo-netcode`/WebRTC and a generic render bridge. **Decision D13: run spike S2 before adopting;** if it fails, use plain TypeScript. Either way the replay-hash determinism test (G8) is mandatory.
- **Assets:** glTF `.glb` contract (meters, +Y up, facing +Z, origin between the feet/at centre for spheres, embedded textures, no Draco, ≤4 weights, named socket empties `socket_arm_R`… `socket_back`, in-place clips). Because spheres + rigid parts need little skinning, **many assets can be code-built (img2threejs style) or simple Blender meshes**.

---

## 12. PIPELINE (summary; details & commands in the Playbook)
Reference folder → **style contract** → Blender (+MCP) and code-built shapes → `.glb`/Three.js → **Look Loop** (Playwright render → score → fresh judge → change one thing) → **bots** (fairness/balance) → **human 15-min playtest** → feel tuning.
- **Tools (see `docs/PLAYBOOK.md` §12 addendum for evidence):**
  - **USE:** BlenderMCP (modeling + viewport look) · **BlenderLens** (`blenderlens-mcp`, Apache-2.0, beta v0.2.0, 40 tools; `check_asset` triangle/pivot/export checks; CLI `check` exits 0/1/2: use as the asset gate) · blender-skills · awesome-gamedev-agent-skills · dream-loop (critic loop) · img2threejs (code-built parts/props) · Playwright (headless screenshots, CI) · **threejs-devtools-mcp** (59 tools, MIT, v0.4.1, live scene inspection; needs an open browser tab) · PolyFork (props; licence confirmed, see Playbook §12).
  - **SPIKE then decide:** Diorama (style/process) · Ritmo (sim framework) · SpriteCook (UI icons; pixel-art oriented; free tier 40 credits/30 days, free outputs public, engine exports paid; check ToS).
  - **SKIP:** Motion2MixamoRig, DSH, Scenario (paid), spritefusion normals, local Hunyuan3D, **VibeInc AI Art Team** (needs a local GPU for TRELLIS.2; TRELLIS output flagged non-commercial; v0.1.0 with stubs).
  - **Patterns only:** lemo-opuscar, mg-styles-15 (style docs, rubric, one-frame approval).
- **Free assets:** Kenney (CC0), Quaternius (CC0), PolyFork (verify licence), Game-icons.net (verify licence; attribution likely), OpenGameArt/itch (per asset). **AI mesh generators (Meshy/Tripo free tiers):** reference only; free tiers have attribution/non-commercial issues. **Mixamo:** not needed.
- **Machine:** Mac M4 16 GB is enough for Blender + dev server + headless Chromium; avoid local 3D-generation models.
- **Models (Codex) [SUGGESTION]:** Phase 0 setup & Blender loops → **Astra (medium; high if stuck)** · daily features/AI/UI → **Sol (low–medium)** · hard bugs/architecture → **Sol high, escalate to Astra once if Sol fails twice** · look-judge subagent → **Sol or Astra, fresh context** · bulk/data → **Luna**. Raise effort before switching models. Plan quotas vary.
- **Never** run unknown `curl | sh`; ask before system-wide installs; save `.blend` before agent runs; use `BLENDER_MCP_SAFE_MODE=1`.

---

## 13. DEVICE & PERFORMANCE POLISH
- **Inputs:** keyboard, gamepad (Gamepad API; standard mapping), touch. Verify focus handling, pause on blur, orientation (landscape primary).
- **Quality tiers:** Low (no postfx, fewer particles, no outlines pass if slow), Med, High; auto-detect from a 5-second frame-time sample.
- **Mobile Safari:** test audio-less autoplay issues N/A; test context loss/resume, viewport/safe-area, pinch/zoom prevention, 100vh issues.
- **Real-device matrix:** iPhone Safari, Android Chrome, desktop Chrome/Firefox, one gamepad. Throttled desktop ≠ real phone.
- **Reduce-flash/motion** disables chromatic pulse, strobe, shake and heavy streaks.

---

## 14. QUALITY GATES (nothing moves on until its gate passes)
| Gate | Phase | Test |
|---|---|---|
| **G1 Controls** | 1 | Dash responds on first frame; input buffer works; i-frames verified by a sim test; works on touch/keyboard/gamepad |
| **G2 Phone perf** | 1/5 | 60 fps on a real mid-range phone with full wave + effects; else escalate (reduce tiers; Godot only as measured fallback) |
| **G3 Fairness** | 2/3 | 0.25 s and 0.4 s bots clear all waves/boss with **no unavoidable damage** |
| **G4 Feel** | 1–5 | Every hit fires ≥3 feedback layers (logged); daily 15-min playtest produces 3 notes → 3 changes |
| **G5 Readability** | 4 | A first-time player can name what killed them; silhouettes read at 32 px |
| **G6 Matchup cap** | 3 | Each starting part alone vs each enemy group: worst/best time-to-kill ≤1.6× |
| **G7 Look** | 4 | Look-score ≥ target on approved frames **and** human approval |
| **G8 Determinism** | 1 onward | Replay-hash test passes in CI (input recording → identical state) |
| **G9 Accessibility** | 5/6 | Reduce-flash works; colour-blind-safe telegraphs; text size OK |
| **G11 Slice acceptance (from the owner doc §14)** | 4–7 | Hero findable within 1 s in a 300 px wide frame · every attack warns ≥0.4 s (boss ≥0.8 s) · ≤12 threats alive · only the hero is mirror chrome and no prop has a face · a blade touching the hero never marks the hero and always damages the blade · every expression reads with no mouth |
| **G10 Five-tester test** | 7 | 5 people pick it up in 10 s unprompted; at least 3 retry voluntarily |

---

## 15. EXPANSION: FROM 6 TO 60 FORMS (the Valorant-style growth path)
Yes, this is a sound direction **if we scale the content, not the complexity.**
- **Rule:** keep **six form families on the wheel**. Grow by **variants within each family** (e.g., Blade: Saw, Katana, Scythe, Chakram…) — each a new kit and look, *same wheel position*. 6 families × 10 variants = 60 without a 60-node wheel (a 60-node counter table would be unbalanceable).
- **New biome per family** (and later sub-biomes), plus **new modifier tags** (burn, freeze, slow) as secondary layers.
- **Content-pack checklist per new form:** data entry → look (`looks.ts`) → 3 enemy variants → boss → challenge set → bot balance run → look loop → 15-min playtest.
- **Meta growth later:** cosmetics (colours/eyes), cultures lore, daily-seed challenge, endless mode.
- **[RISK]** Balance and art workload grow linearly; the data-driven model is what keeps it tractable.

---

## 16. SCOPE
**In (Chapter 1 slice):** the Core, Core defaults, Blade part, 4 Blade enemies, Scrap-Rex, Foundry Scrapyard, Heat/Overdrive, wheel math (even though only Blade enemies exist, the system and bot tests are in), Q/E/X, dash, 12-upgrade pool, workshop, 3 challenges, local save, keyboard + gamepad + touch, debug panel, bots, transitions/VFX, accessibility toggles, share card.
**Out until later:** other 5 biomes/forms, co-op, PvP, accounts/leaderboards, audio, cutscenes, map editor.

**What "slice size" means:** a *vertical slice* = one small piece of the game finished to final quality, not the whole game roughly built. Our slice is **Chapter 1**. If it is polished like Spirit Call, we add chapters gradually because the core is proven.

---

## 17. PHASED ROADMAP (durations are [START] and depend on playtest, not the calendar)
| Phase | Goal | Deliverable | Gates | Model/effort |
|---|---|---|---|---|
| **0 Setup & style lock** | Pipeline works; look agreed | Repo scaffold, MCPs, skills, `STYLE.md`, `ref/`, one approved style frame, SETUP_REPORT | Acceptance test (Playbook §4.11) | Astra medium |
| **1 Greybox feel** | Core moves/dashes/hits feel great | Capsule/sphere Core, dummy, debug panel, replay test | G1, G4, G8 (+G2 early) | Sol low–med |
| **2 Enemies, waves, Heat** | Real fights | 4 Blade enemies, wave manager, Heat/Overdrive, upgrades | G3 | Sol med |
| **3 Boss + unlock + loadout** | Full loop | Scrap-Rex, Blade part, workshop, challenges, save | G3, G6 | Sol med/high |
| **4 Art pass** | It looks like the reference | Core, enemies, boss, arena, parts via Blender/code; look loop | G5, G7 | Astra medium |
| **5 Transitions, VFX, UI** | Feels expensive | §8 spec, HUD, menus, Overdrive effects, quality tiers | G2 (real phone), G9 | Sol + Astra review |
| **6 Devices & accessibility** | Plays everywhere | Real-device matrix, touch polish, settings | G2, G9 | Sol |
| **7 Playtest & ship slice** | A shareable game | 5-tester test, fixes, deploy (static), share card | G10 | Sol + Astra audit |
| **8 Chapter 2 (Wing/Cloud Docks)** | Prove scaling | Second form via the new-form checklist | G3, G5, G6 | Sol |
| **9 Chapters 3–6, finale** | Story complete | Remaining forms, Throne Engine massive fight | all | — |
| **10 Co-op (2-player)** | Play together | WebRTC + room code; lockstep on the replay-tested sim | G8 + netplay tests | Astra high |
| **11 Gladiator PvP** | Competitive | Arena mode, mirror rules, ranked later | — | — |
Honest note: **60–120 commits plus daily playtesting** is a realistic scale for Chapter 1 polish, not 10–50.

---

## 18. CO-OP, GLADIATOR & THE MASSIVE FINALE (later)
- **Co-op (first online feature):** 2 players, each on their own device, **WebRTC with a room code** (same Wi-Fi or internet). **LAN auto-discovery does not exist in browsers**; use the room code. Needs a small signalling service (free tier hosting) [UNVERIFIED costs]. Lockstep (inputs exchanged, deterministic sim) with a small input delay. Each player chooses a form loadout; shared Heat optional.
- **Gladiator PvP:** needs rollback or tuned lockstep, balancing and anti-cheat considerations; do after co-op. Mirror rules: matchup multipliers shrink (§4.2).
- **Massive finale (Elden-Ring-like):** a multi-phase **Throne Engine** boss, each phase a form (e.g., Wing phase = aerial lanes, Spike phase = crystal walls), huge ground telegraphs, arena transformation. **Boss-size spectacle, not 100 enemies:** the 12-enemy cap stays; scale is in the boss, set pieces and VFX.
- **[RISK]** Online play multiplies QA work and cross-device determinism risk; do not start until the single-player slice and story are complete.

---

## 19. PROMPTS (copy/paste; the Playbook §9 has the longer library)
### 19.1 Ask-protocol (put in every prompt)
```
If blocked or a decision is mine, STOP and ask:
BLOCKED: <one line>
OPTIONS: A) … B) … (max 3)
RECOMMENDATION: <which and why>
NEED FROM ME: <exact thing: file, yes/no, login, screenshot>
Do not guess on licences, scope, or anything outside the project folder.
```
### 19.2 Master setup (Astra, medium) — Phase 0
Use Playbook §9.1, with this change: *"The game is REDLINE (docs/DESIGN_BIBLE.md). Read §0–§6, §9, §11, §12, §14 first and restate in 8 lines what we're building and the Phase-0 acceptance test."*
### 19.3 Phase 1 greybox (Sol, low–medium)
```
Read docs/DESIGN_BIBLE.md §0, §5, §6.1, §6.3, §11, §14. Build Phase 1: Vite+TS+Three scaffold; deterministic 60 Hz sim; a plain sphere Core with isometric camera; WASD/gamepad/touch move; dash with 0.20 s i-frames (2 charges); auto-aim basic attack on a training dummy; the full feel stack (hit-stop, shake, knockback, flash, squash, particles) with every value in a debug panel (backquote key); input→command stream; replay-hash test; `npm run check`.
Done = G1, G4, G8 pass and you show a Playwright screenshot at phone viewport. Do not add enemies, parts or art. <ask-protocol>
```
### 19.4 Phase 2 enemies + Heat (Sol, medium)
```
Implement Chapter 1 enemies (Sawlet, Rivet Thrower, Shieldsaw, Grinder) per Bible §7, the wave manager, engagement slots (max 3 attackers), 12-enemy cap with spawn queue, 70%-cleared wave rule, Heat tiers and Overdrive per §6.2, the 12 upgrades per §6.5. Timings in src/content. Add 0.25 s and 0.4 s bots proving no unavoidable damage (G3). Visuals only via looks.ts (placeholder spheres). <ask-protocol>
```
### 19.5 Phase 3 boss + loadout (Sol, medium/high)
```
Implement Scrap-Rex (3 phases, §7), the Blade part and Core defaults (§6.4, §6.6), loadout-before-run, 3 stackable challenges (§6.8), save schema (§11), the Workshop screen logic (UI placeholders), and a matchup-cap bot (G6). <ask-protocol>
```
### 19.5b Phase 4 art pass (Astra, medium) — see Playbook §6.2 (asset loop) and §9.2 (Blender prompt template)
Fill the template with: *Core: plain sphere, large expressive eyes, three bolt sockets, red/chrome, ≤4k tris; enemies per §7; style per §9.* Run the silhouette test (128/64/32 px) before detailing.
### 19.6 Look loop (Astra, medium) — Playbook §9.3 and §6.1
Run against the **approved style frame** only. One change per iteration; stop after 3 iterations with <2 points of gain.
### 19.7 Fresh judge — Playbook §9.7 (do not tell it to copy reference characters).
### 19.8 Bug fix — Playbook §9.6 (reproduce first, smallest fix, regression test).

---

## 20. WHAT THE USER MUST DO (the human parts AI cannot do)
1. **Collect/approve references** (§9.3, §9.4) and approve **one style frame**.
2. **Playtest 15 minutes a day on a real phone** and write 3 notes. This is the single biggest quality lever; AI has never felt the game.
3. **Decide** when an ask-protocol question arrives (licences, scope, taste).
4. **Real-device testing** (phone, controller) before gate G2/G9/G10.
5. **Add music later** (metal; ensure licence). Hooks: beat-synced hit-stop/pulses can be added without changing the sim.

---

## 21. RISKS
| Risk | Severity | Mitigation |
|---|---|---|
| AI can't feel the game | High | Debug panel + daily human playtest (G4) |
| Art drift / generic look | High | Reference folder, style contract, one approved frame, look loop, human approval (G7) |
| Scope creep (6→60 too early) | High | Ship Chapter 1 first; new systems replace, not stack |
| Mobile perf with postfx | Med | Quality tiers, G2 on a real phone |
| Matchup becomes a hidden wall | Med | Soft ×1.3/×0.85, ≤1.6× TTK cap, bot check (G6) |
| Determinism breaks co-op | Med | Replay-hash test from Phase 1; avoid transcendental math in sim |
| Licence traps (AI meshes, Mixamo, PolyFork unknown) | Med | `ASSETS.md`; hand-built/code-built shipping assets |
| Boost effects cause discomfort | Med | Reduce-flash/motion setting; tiers; no strobe |
| Name/trademark clash ("REDLINE") | Low | Check before publishing |
| 16 GB Mac limits | Low | Cloud generation avoided; local Blender only |

---

## 22. UNVERIFIED / NOT CHECKED
- Plan quotas/prices for Astra/Sol/Luna on the user's account.
- PolyFork's full licence (polyfork.dev/licensing); Game-icons current licence; Mixamo current terms; per-image-tool terms for AI reference images.
- **Diorama** (`sloemo01/diorama`): my fetches were blocked. Another assistant's summary (user-supplied) says: pixel-art-style isometric diorama playbook for Three.js with SKILL.md, 64-colour palette, ordered dither, inked outlines, frame as a pure function of time, QA harness. **Not verified by me**; spike S1 decides. Potential conflict with the smooth-toon look.
- **SpriteCook:** pricing page read (free 40 credits/30 days; commercial use stated allowed; ownership wording not explicit: read its ToS). Output is pixel-art oriented; may not match Option A.
- **BlenderLens** is a one-maintainer beta released 2026-10-10 without provenance attestation: pin the version, review before enabling `run_python`.
- PolyFork's 600-triangle free-tier figure (from a user-supplied summary) is **not on the licensing page I read**; that page says every low-poly model is free and bars resale/redistribution and training a commercial generator.
- Hunyuan3D on 16 GB; blender-ai-mcp (not reviewed); blender-skills recency; dream-loop's full scoring ladder.
- Cross-browser float determinism for lockstep co-op.
- Sandro Maglione's "Indie game development with AI" guide (announced ~28 Oct–4 Nov 2026; not found published yet): re-check.
- Social-media claims in pasted posts (e.g., "33 minutes", "2–3 days"): treat as inspiration, not schedule evidence.
- All numbers marked [START].

---

## 23. SOURCES (read this session; see the Playbook §11 for the full list)
Spirit Call author repo docs (vision, models, enemies, DEVELOPMENT, AGENTS) · BlenderMCP · blender-skills · awesome-gamedev-agent-skills · dream-loop write-up · img2threejs · Ritmo (typeonce-dev/ritmo) · PolyFork (polyfork.dev) · Kenney · Quaternius · Meshy pricing doc · Game Art Style · Gameplay Atlas · Codex model-selection and Astra/Sol benchmark articles. Links are listed in `CADDIS_PIPELINE_PLAYBOOK_v1.md` §11.


---

## 24. v4 OVERRIDES AND CHAPTER 1 NUMBERS (2026-10-30)
> Everything here is **PROPOSED/[START]** unless it restates a LOCKED item from `SLICE_LOCKED_DECISIONS.md`. The agent builds these as defaults in the debug panel; bots and playtests tune them. Items marked **ASK** need the owner's yes before building.

### 24.1 What changed from v3
Hero art locked (flat white eyes, crown slashes, no seam ring); hard-body logic (blades never mark the Core, enemy teeth snap in proportion to speed); parts **float** (no skinning/IK; boss has floating arms, **no legs**); story reworded (Engine/redline); look Option A locked; HUD adds a third ability button + pause + damage numbers; asset gate uses `blenderlens-mcp check`; arena enlarged; fun layer added (`FUN_LAYER.md`).

### 24.2 Hit tiers (how enemies threaten a body that cannot be cut)
| Tier | Examples | Knockback | Heat loss | HP loss | Core reaction |
|---|---|---|---|---|---|
| Tickle | Scrapbit | none | −2 | 0 | no flinch |
| Light | Sawlet scrape | 0.8 u | −10 | 6 | hurt eyes, small dent flash |
| Medium | Rivet, Shieldsaw charge | 1.5 u | −15 | 8–12 | dizzy eyes, short stun 0.2 s |
| Heavy | Grinder sweep, Rex attacks | 2.5 u | −25 | 15–25 | big dent/crack, 0.4 s stun |
Core HP 100 is displayed as **dent/crack stages** (100–66 clean · 66–33 dents + faint cracks · <33 heavy dents, bright cracks, steam) plus the HUD bar. **Saw contact never shows slashes on the Core.** Rolling/dashing into a blade breaks teeth ∝ speed.

### 24.3 Chapter 1 numbers [START]
**Core:** HP 100 · move 6 u/s · bonk 8 dmg × (1 + 0.5 × speed factor 0–1, 1 at dash speed), cadence 0.45 s, lunge 1.2 u, auto-target radius 2.5 u · dash 4 u in 0.20 s, i-frames 0.20 s, 2 charges, 1.2 s recharge · **Q** Pulse Bash 12 dmg r 2.5 u, CD 2 s · **E** Boost Burst forward hop 3 u (no i-frames), CD 3 s · **X** Stomp 14 dmg r 2 u + 0.6 s stun, CD 4 s.
**Heat:** gain Scrapbit +1, Sawlet/Rivet +4, Shieldsaw +6, Grinder +10, perfect dodge +8, counter-bonk +10 (ASK) · loss by hit tier (§24.2) · tiers Cold 0–29 / Warm 30–59 / Overheated 60–89 / Overdrive-ready ≥90 · Overdrive 5 s: +30% move, +25% dmg, free dash, pierce small enemies.
**Enemies (HP = bonks at base 8 dmg ≈ HP/8):**
| Enemy | HP | Move | Attack (telegraph → effect) |
|---|---|---|---|
| Scrapbit (ASK) | 4 | 3.5 u/s | rolls into Core: tickle |
| Sawlet | 16 (8 teeth) | 5.5 | 0.4 s eye-flash + decal → dash 9 u/s for 0.5 s; light |
| Rivet Thrower | 24 | 2.5, keeps 6–8 u | 0.5 s aim line → rivet arc 8 u/s; medium; CD 2.2 s |
| Shieldsaw | 40; front 120° arc takes ×0.1 | 3 | 0.6 s shield glow → charge 10 u/s for 1 s; medium; weak from behind |
| Grinder | 80 | 2 | 0.8 s ground ring r 3.0 u → sweep; heavy; 0.8 s recovery (punish window) |
**Scrap-Rex:** HP 600 · body Ø≈3.2 u · chomp-lunge (0.8 s, heavy 25) · saw-sweep (0.9 s, r 4.5 u with a gap sector to dash through, 20) · scrap volley (5 crates, 1.0 s warnings, 15 each) · summons 3 Sawlets (max 6 alive).
**Waves:** W1 8 Sawlets · W2 6 Sawlets + 2 Rivet Throwers · W3 4 Sawlets + 2 Shieldsaws + 1 Thrower · W4 5 Sawlets + 2 Throwers + 2 Shieldsaws + 1 Grinder · Boss. Scrapbits (ASK) trickle 10–16 per wave. Next wave starts at ~70% of threats cleared. 1-of-3 upgrade after each wave.
**Arena:** 48×48 u floating slab; orthographic view height ≈12 u (Core ≈8% of screen height); camera follows; soft edge respawn at centre (−10 HP). Hazards from W3: falling crate every ~6 s (1.0 s warning circle r 1.5 u, 12 dmg); 2 conveyor strips (1.5 u/s push, arrows).
**Caps:** ≤12 threats alive, ≤3 attacking at once; Scrapbits ≤24 extra (instanced).
Target run: ~3–4 min; boss fight ~90–120 s. **Bots tune all numbers (G3, G6).**

### 24.4 Boss phases (final, PROPOSED)
1 calm 100–70%: chomp-lunge + summon · 2 calm 70–40%: + saw-sweep with ground ring · 3 calm 40–20%: + falling-scrap volleys · **4 enraged <20%:** steam, glowing red cracks, blazing eyes, speed ×1.2, gaps ×0.8, damage ×1.25 — **telegraphs stay ≥0.8 s**. Rex's health shows as cracks on the body. Reward: Blade (replaces Q).

### 24.5 Open items resolved (owner may override)
- **Floating arms, no legs for Scrap-Rex:** yes.
- **Red crown slashes stay as the Heat indicator:** yes.
- **Guest enemy of another form in Chapter 1:** **no** (keep scope). The wheel is data-driven and bot-tested now (synthetic enemies) and becomes visible in Chapter 2.
- **Scrapbits, counter-bonk, Redline Rush, rerolls:** **ASK** (see `FUN_LAYER.md`).

### 24.6 Rolling, face and marks (implementation note)
The matcap chrome must not rotate with physics. Keep the **face layer and Heat marks camera-facing and decoupled**; sell rolling by lean, squash/stretch, specular shift, dust and speed lines.

### 24.7 Chapter pack format (so adding chapters is simple) [LOCKED intent]
```
src/content/chapters/<id>/
  chapter.json   # id, name, culture, form reward, order, arena size, challenges
  theme.json     # palette ramp, props list, hazards, eye family, sigil
  enemies.json   # enemy defs (form tag, hp, speed, attacks with windup/hit/recover)
  waves.json     # waves, caps, spawn rules, upgrade picks
  boss.json      # phases, attacks, rewards
src/render/looks.ts   # content id -> look (only place that knows assets)
```
**Add-a-chapter checklist (≤10 steps):** copy the folder · edit theme/enemies/waves/boss · add looks · build 3–4 enemy shapes + boss + arena props (Asset Loop) · bots (G3/G6) · Look Loop · 15-min playtest · add to the chapter map. Chapters without a folder show as silhouetted **"Coming soon"** on the chapter map (Chapter 2 shows after Chapter 1's outro card).

### 24.8 Spirit Call lessons (task)
Phase 0 produces `docs/SPIRIT_CALL_LESSONS.md` (≤1 page per source doc listed in `LINKS.md` §A: what they do, which of our rules it supports or contradicts, what to copy). Spirit Call's few-tough-enemies principle is why our **threat tier is capped at 12 and ≤3 attackers**, while Scrapbits supply the swarm feel.
