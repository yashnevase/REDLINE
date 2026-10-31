# NEXT_WORK.md — the single work doc (replaces DEPTH_SPRINT, DEPTH_ADDENDUM, CHANGE_CONTROL, REQUIREMENTS_TRACKER, OWNER_NOTES)
> Authority: REDLINE_BRIEF. Part A (rolling, movement, cannonball dash, scars, zoom) is **done and accepted**. Everything below is approved. Work in **3 sessions**; each ends with a report in the format at the bottom. Budgets: Standard ≤120 calls/60k tris, Low ≤70/25k; desktop gets a richer High tier. Keep sim deterministic; cosmetic randomness never uses the sim RNG.

## Working rules (simple)
1. **Every item has an ID below. Do ALL items of the session. None may be skipped, shrunk or silently deferred.** If something truly can't be done, use BLOCKED/OPTIONS/RECOMMENDATION and say so in the report.
2. **Revertible:** build each item as its own commit(s) prefixed `[ID]`, with its code kept in its own module behind a simple on/off constant in code. When the owner says "remove X" or "change X", Codex reverts/edits just that item safely, re-runs `pnpm check`, and says what changed. No UI needed for this.
3. **Evidence:** every item needs a viewed screenshot or clip from the **real running game** (desktop + compact) and a test if it touches the sim.
4. **Owner-message audit before reporting:** re-read the "Owner notes" section at the bottom and tick each line against the items; anything without an item gets built.
5. Owner playtest notes may be pasted in chat using IDs ("I3 too hard"); apply them first.

## Colour direction (applies to all sessions)
Void/space, neon edge and UI accent stay **purple**. **Chapter 1 world = Scrapyard: rust brown, oxide red, steel grey, orange fire/vent light** (floor ramp `#4a3a34 → #6b4a3a → #8a5a40`, grey plates `#5a5560`, oxide red `#7a2f2a`, soot `#2b2422`). Hero stays blue-violet chrome. Later chapters swap the palette through a chapter config.

# SESSION 2 — fixes, combat depth, clarity
**Q1 Enemy blades:** worn steel with rough rusty edges, bright worn bevel, spin-blur streaks, faint edge sparkle (not mirror-shiny, not flat brown).
**Q2 Core eyes by intensity:** idle = current round flat white; action = semi-triangle angry; very high (Overdrive, high Heat, streak ≥×5) = sharper, narrower, orange-red tint; low HP = hurt eyes flicker. 80 ms morph.
**Q3 Heal:** +25 % max HP after each cleared wave (tunable 20–30 %), "REPAIR +25" nano-sparkle pop, one scar threshold clears. No heal between boss phases.
**Q4 Zoom:** Close 0.85 / **Default 1.15** / Wide 1.5 / Far 1.9 (desktop; phone default ~1.0), V/C/wheel/pinch; HUD, numbers and telegraphs stay readable at Far.
**Q5 Lobby Core rotatable:** drag (mouse/touch/right stick), inertia, auto-spin when idle, double-tap reset.
**B1 Hit quality (sim, tested):** speed-bonk (kept); rear hit ×1.5 "REAR HIT"; side ×1.0; front vs armour ×0.3 (Shieldsaw front ×0.1, rear ×1.5); **punish window** after an enemy's heavy attack ×2 ("COUNTER", extra Heat); counter-bonk in last 0.15 s of a telegraph = stagger; **perfect dodge** (i-frames overlapping a real attack) = slow-mo flash, Heat, next hit ×1.5 for 1.5 s ("PERFECT"). Standing inside a heavy enemy's zone costs ~30 % HP; plain front spam on tough enemies is weak.
**B2 Roster (rock-paper-scissors) + Whirler:** Sawlet (swarm) ← Q Spin/combos; Thrower (ranged) ← dash in, sidestep; Shieldsaw ← Stomp stun then rear; Grinder (slow heavy) ← dodge cone, punish window, rear; **Whirler (new)**: rusty body with 2–3 spinning blade arms at 30°/45°, telegraphed sweep arcs, arm touch hurts, body hit safe; time the gap or Roll Rush through. Whirler replaces a Sawlet slot in Level 3.
**B3 Projectiles:** thrower shots become spinning saw discs / spike bolts with floor scar (no yellow bullets).
**B4 Abilities:** **Q Blade Spin** 0.7 s whirlwind, 3 ticks (24 total), orbiting blade arcs + trail ribbons, debris pulled in, floor scar, enemies pulled/spun, rune ring showing radius. **X Stomp** 0.35 s leap (shadow shrinks), slam, radial ground cracks, launched chunks, shockwave ring, enemies launched + 0.6 s stun, damage 14→20. **E Boost Burst** forward jet cone with flame trail. Each: anticipation, burst, aftermath, cooldown ring, name call-out.
**B5 Blade form** (after boss): auto-fires spike/spinning-blade projectiles; Spin releases 4 orbiting blades 3 s; E spike fan (5); X spike ring.
**B6 Combo/score:** hit chain within 2 s builds ×2…×10; multiplies **score**; damage taken resets.
**F1 Objective strip:** always shows level goal + score bar ("LEVEL 1 · 1,240 / 3,000"), wave x/y, enemies left; boss fight swaps to **boss health bar split by phase** with name; **goal banner** at level start; level-complete/boss-defeated cards say what unlocked.
**F2 Device-matched hints:** keyboard/mouse → key caps (WASD, Space, Q/E/X, R, V/C); controller → button glyphs (Xbox/PlayStation auto); touch → on-screen controls only; swaps on first input of another type; **key rebinding** saved in Options.
**F3 Beating Scrap-Rex:** intro card with 3 tips ("Dash THROUGH the saw sweep", "Hit him from behind after his slam", "Stomp when his plates glow"); **exposed plates** glow orange 0.8 s after heavy attacks = ×2 "WEAK SPOT"; per-phase health bar and phase text; tips shown first 2 times, skippable.
**F4 Upgrades understandable:** card = icon, name, one plain sentence, **before → after numbers**, tag (Q/E/X/Dash/Core/Passive), rarity edge; all upgrades are passive or modify an existing ability (card says so); **build strip** of owned upgrades under the HP bar; pause screen lists them; first pick shows a 3-line explainer.
**F5 Results card:** score vs target, stars, best combo, what killed you (freeze frame + tip), retry < 2 s.
**S2 gate:** a first-time player can say the goal, how to beat Rex and what an upgrade does after one minute (note the check in the report).

# SESSION 3 — the Scrapyard world and progression (the previously missed items are BLOCKING)
**C1 Neon vents (rebuild):** vent stacks (grate + glowing slit + chimney), orange-violet light shaft, rising smoke sprites, embers, periodic steam bursts with glow pulse, light pool on floor/props, heat shimmer on High. **4–6 per run, seeded random, ≥9 u apart, never in the central 8 u**; 1–2 are **boost vents** (speed ×1.5 for 1 s, chevrons).
**C2 Irregular damaged tiles:** no perfect grid: mixed plate sizes (1×1, 1×2, 2×2), random slight rotation/height, uneven gaps, per-plate colour from the palette, rust/soot/oil/dents/cracks, bolt rows, hazard-paint, welded patches, a few **missing plates with glowing underlayer**, rim wear; fight scars accumulate and fade; kicked debris.
**C3 Alive outer space:** ring of floating scrapyard islands: crushed cars/containers, barrels, girders, conveyors, **giant rotating saw blades** (some orbiting), pendulum blades, gears, sparking cables, swinging cranes with chains, flickering **neon boards** (abstract glyphs, no text), flare lamps, drifting scrap, passing haulers, meteor streaks; 3 parallax layers; instanced/shader-animated; Low keeps ~40 %. ≥6 moving background elements visible in a normal frame.
**C4 Lighting/shadow:** warm orange key + violet rim; coloured pools from vents/neon/sparks; soft contact shadows; short floor light flashes on big events (max 3); god-rays through smoke; vignette; Heat grade. Stylized.
**C5 Barricades:** hazard-striped, bolted, glow strips, sparks. **C6 Density:** edge sparks/embers/scrap always moving, rune ring around hero, debris, rust flakes, oil/scrap splatter (non-gory), props rattle on stomp.
**C0 Palette** per colour direction above, verified by screenshot.
**D Progression:** Levels 1–3 each with a score target (3,000 / 6,500 / 11,000, tunable); reaching it ends the level after the current wave and unlocks the next; each level has its own layout/vent seed, enemy mix and one new mechanic (L1 Sawlets+Throwers, L2 +Shieldsaws+vents, L3 +Grinders+Whirlers); then **Scrap-Rex**; defeat → **Blade unlocked**, used from then on; Chapter 2 teaser. Stars for goals (≥25 % HP, 3 perfect dodges…). Fairness bots rerun per level.
**E Chapter config:** `src/content/chapters/<id>.ts` (palette, tiles, props, vents, background, roster, hazard); Chapter 1 scene reads it.
**S3 gate:** normal-play clip + top-down screenshot show rust palette, irregular damaged tiles, neon vents in different places with smoke/light, a clearly alive scrapyard around the slab; levels 1→3→boss→Blade end to end; budgets met.

# SESSION 4 — desktop-first, juice, creative additions
**G1 Tiers:** High (desktop default: selective bloom, chromatic, heat haze, more debris/background), Standard, Low; auto-detect; auto-drop a tier if p95 > 22 ms for 3 s with a toast; manual override.
**G2 Smoothness:** sim stays 60 Hz; render interpolation for 120/144 Hz; resolution scale; fullscreen; pause on blur.
**G3 Input/layout:** keyboard+mouse (wheel zoom), controller (rumble where supported, dead-zone setting), touch; simultaneous inputs; layouts for ultrawide/small laptop/portrait; safe areas.
**H1 Trending effects (each with reduce-flash/motion switch):** impact frames (1-frame white/inverted on heavy kills), chromatic pulse, radial speed blur (High; streaks on Standard), Stomp refraction ring (High; additive ring elsewhere), bloom pulse on Overdrive, freeze-frame + slow-mo on last kill and boss phase breaks, Heat grade, anamorphic streak on big crits, edge glow by streak tier.
**H2 Sound-ready cues:** presentation emits named throttled cues (`hit_light/medium/heavy`, `crit`, `kill`, `dash_tap/rush/charge_start/charge_release`, `spin_start/tick`, `stomp_charge/slam`, `boost`, `overdrive_start/end`, `pickup`, `wave_start/clear`, `repair`, `boss_phase`, `ui_*`) with intensity/position; no audio yet; dev logger.
**I1 Style rank:** meter SCRAP → GRIND → METAL → REDLINE from speed, variety, angle hits, no damage; raises score multiplier and visual intensity; getting hit drops a tier.
**I2 Pinball bumpers + wall ricochet:** neon bumpers/rails; banking Rush/Charge off walls = "RICOCHET" ×1.5.
**I3 Usable hazards:** saw-cart rails, timed crushers, explosive barrels; enemies knocked in = "SCRAPPED" bonus; telegraphed; hurts hero too.
**I4 Scrap pickups:** kills drop glowing scrap that magnetizes (Heat/score/small heal); instanced, not counted in the 12 cap.
**I5 Graze:** pass within 0.6 u of a blade unhurt = "GRAZE" + Heat + score.
**I6 Level twists:** one random per level (Blackout, Scrap Storm, Vent Surge) shown in the banner.
**I7 Core cosmetics:** paint finishes, trail colours, eye shapes earned by stars; picked in lobby.
**I8 Last stand:** <20 % HP: slow-mo pulse, +30 % damage, red-orange eyes, heartbeat vignette.
**I9 Run highlights card:** best combo, biggest hit, style rank, kills; local share-image export.
**I10 Daily seed:** same seeded arena/vents/twist per day, local best score.
**Order:** I1, I2, I4, I5, I8 → I3, I6, I9 → I7, I10. **S4 gate:** tier auto-detect works, smooth at 120/144 Hz, rebinding works, each effect/addition visible in a clip.

# Report format (every session; the owner shares it back with clips)
1. Table of every ID in the session: **DONE / BLOCKED**, evidence path, one-line note. 2. **"Not done"** list (must be empty or justified). 3. Tunables changed. 4. Budgets and `pnpm check`/build results. 5. 1 normal-play clip (30 s) + short clips for new abilities/effects. 6. Owner-message audit result.

# Codex prompts
S2: "Read docs/REDLINE_BRIEF.md and docs/NEXT_WORK.md. Do SESSION 2 completely, following the working rules and report format." S3: "Do SESSION 3 completely (C1–C6, C0, D, E are blocking)." S4: "Do SESSION 4 completely."

# Owner notes (raw; audit against these)
Vents not done as decided; environment feel/lighting/shadow/background detail missing; ground tiles uniform → uneven, damaged, different colour shades; fill outer space with scrapyard boards, rotating blades, sparks, alive; purple space OK but Chapter 1 needs its own colours: brown, red, rusty, grey; enemy rotating blades nice, make steel or rough rusty; lobby like Spirit Call with rotatable hero; more zoom out; HUD and key bindings match the active input; eyes: idle = current, action = semi-triangle, extreme = more aggressive/red; how to defeat the main villain; upgrades not understandable; heal 20–30 % per wave; show wave, score target, enemy/own/boss health, when finished; more amazing effects, transitions, lighting, shadows; trending fight effects (flash, shake, blur) for later sound; more cool additions like spinning blades on ball; not mobile-centric (PC, laptop, mobile); any change revertible; don't miss requested items; levels 1–3 by score → boss → Blade; Blade shoots spikes; enemies with 30°/45° spinning arms; angle/timing/rock-paper-scissors, punish windows; V/C zoom; hero damage deformation; neon vents with smoke, random positions; chapter-specific themes.