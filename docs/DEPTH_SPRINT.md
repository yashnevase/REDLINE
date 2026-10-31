# DEPTH_SPRINT.md — movement, combat depth, living world, progression (owner feedback 2026-10-31)
> Owner asked for all of this and approved the Whirler, boost vents and score targets (2026-10-31), so it is **approved scope with no further ASK items**; numbers are START values, tunable. Authority: REDLINE_BRIEF (Codex records these amendments there + STATE.md). Work in the three parts below, **one Codex session each**, verified with `pnpm shots` + clips you view. Keep determinism: sim changes get tests; **cosmetic randomness uses a presentation-only seeded RNG, never the sim RNG**. Keep Standard ≤120 calls/60k tris, Low ≤70/25k (Low is at its cap: budget before adding).
> Reference: the three Hades-like screenshots the owner shared (dense, chaotic, glowing runes around the hero, BACKSTAB call-outs, debris, big layered AoE). Spirit Call = movement/animation feel source.

## What the latest clip shows
Core squashes into an **egg/jelly** shape when moving or in Overdrive (stretch is too large and springy); hits show a lot of rings but few *different* things; obstacles are plain boxes; vents are flat black grilles clustered together; the floor is a perfect grid; enemy count is better but fights are still "stand and spam".

# PART A — Hero movement and look
**A1 No jelly.** Squash/stretch max 1.06 (was ~1.2), stiff critically damped spring, no wobble overshoot; shape changes only on impacts (0.92/1.08, 80 ms) and dash anticipation. Eyes/marks lean, not the body.
**A2 Rolling.** Core visibly **rolls**: add rotating surface detail that turns with velocity (panel seams/bolt rings baked into the matcap overlay) while face and crown marks stay readable; roll speed = ground speed / radius. Idle = slow hover-bob + blink.
**A3 Movement feel (study Spirit Call first):** Codex reads Spirit Call's player movement/animation code in `ref/spirit-call/` and writes `docs/SPIRIT_CALL_MOVEMENT_NOTES.md` (acceleration, turn smoothing, easing, animation timing; no copying). Then tune: base speed **6 → 8.5 u/s**, accel 0.08 s, **momentum** ramps to 10.5 u/s after 1 s of straight rolling, slight drift on sharp turns, instant stop with a small skid. All tunable.
**A4 Cannonball dash (Ben-10 Cannonbolt):** every dash variant becomes a **tight metal ball roll**: face/crown hidden for the dash (blank chrome + spinning seams), sparks scraping the floor, dust trail, motion lines; Roll Rush/Charge Dash = bigger, faster spin, bounces off obstacles/enemies (knockback), screen-edge streaks. Same hit rules as approved.
**A5 Damage scars (hero):** HP thresholds drive visuals: 75 % light scratches (overlay mask), 50 % dents (vertex displacement on LOD sphere + darker patches) and sparks, 25 % cracked plate + smoke puffs + eyes hurt; Heat glows through cracks; fully repaired at run start or by repair upgrades. Presentation only.
**A6 Zoom control:** three presets (Close 0.85×, Default 1.0×, Wide 1.3×) with smooth ease; **V = wider, C = closer**, mouse wheel, pinch/+/- on touch, saved in preferences; HUD scales correctly; combat readable at all three (telegraphs/numbers stay pixel-sized).

# PART B — Combat depth (play with angle and timing, not spam)
**B1 Hit quality by angle, timing, speed (sim, tested):**
- **Speed-bonk** (approved): faster = more damage.
- **Angle:** rear hit ×1.5 ("BACKSTAB"-style call-out **"REAR HIT"**), side ×1.0, front vs armoured ×0.3. Shieldsaw front ×0.1, rear ×1.5.
- **Punish window:** right after an enemy's heavy attack its recovery (0.4–0.8 s) takes ×2 damage ("COUNTER" call-out, extra Heat). Counter-bonk (hit in the last 0.15 s of a telegraph) = stagger + call-out.
- **Perfect dodge** (approved earlier, now implement): i-frames overlapping a real attack = slow-mo flash, Heat +, next hit ×1.5 for 1.5 s ("PERFECT").
- Spamming buttons into enemies is weak: ordinary front hits on tough enemies deal small damage; heavy damage comes from angle/timing; **being inside a heavy enemy's attack zone costs big damage** (Grinder ≈ 30 % HP).
**B2 Rock-paper-scissors roster** (each beaten best by a different tool; mark it in enemy cards/hints):
| Enemy | Role | Best answer | Weak to |
|---|---|---|---|
| Sawlet (fast, weak) | swarm | Q Blade Spin / combo chains | being grouped |
| Rivet Thrower | ranged | close with dash; sidestep lanes | rear / melee |
| Shieldsaw | armour | Stomp stun then rear hit | rear |
| Grinder | slow heavy | dodge its cone, punish window | recovery, rear |
| **Whirler (new, APPROVED)** | rusty body with 2–3 spinning blade arms at 30°/45° | time the gap between sweeps, hit the body, or Roll Rush through the gap | gaps in rotation |
Whirler arms are visible, telegraphed sweep arcs; touching an arm hurts, body hits are safe. Owner approved (2026-10-31): it replaces one Sawlet slot in waves 3–4 / Level 3.
**B3 Projectiles are blade-themed:** thrower shots become **spinning saw discs / spike bolts** (rusty, not yellow bullets), visible spin, leave a floor scar.
**B4 Q and X become real abilities (not a plain impact):**
- **Q Blade Spin:** 0.7 s whirlwind, 3 damage ticks (8/8/8 = 24), orbiting blade arcs with trail ribbons, debris and sparks pulled in, floor scar ring, enemies pulled/spun, runes ring around the hero (Hades-style) showing the radius.
- **X Stomp:** 0.35 s leap (shadow shrinks), slam, **radial ground cracks**, chunks launched, shockwave ring, enemies launched and stunned 0.6 s, damage 14 → **20**, camera punch; leaves a glowing crack that fades.
- **E Boost Burst:** forward jet cone with flame trail + streaks.
Cooldown rings, anticipation, burst, aftermath on each; call-out names pop at the screen edge.
**B5 Blade form (unlock after boss, used from then on):** auto-fire **spike/spinning blade projectiles**: Blade Spin releases 4 orbiting blades for 3 s; E = spike fan (5 spikes, cone); X = spike ring. Bonk stays.
**B6 Combo and points:** hit chain within 2 s builds ×2…×10 multiplier (cosmetic streak banners already exist, now they multiply **score**, not damage); damage taken resets it; score shown top centre with pop.

# PART C — Living, dense world (the Hades-like "alive" feeling)
**C1 Vents:** replace black grilles with **neon vents** emitting a light shaft, rising steam/smoke (instanced soft sprites), pulsing glow, small sparks. **Random seeded positions each run** (4–6, far apart, not in the open centre). 1–2 are **boost vents** (stepping on gives 1 s speed ×1.5, NFS boost pad, owner approved) the rest decorative.
**C2 Floor:** uneven tiles: height jitter ±0.02 u, rotation ±0.6°, tone variance ±8 %, chipped/cracked tiles, a few missing tiles showing a glowing underlayer, scorch marks and cracks **accumulate from fights** (persistent decals, slow fade), scrap/debris pieces that **get kicked** by the hero and enemies (instanced, cheap physics).
**C3 Props:** replace plain boxes: obstacles become low barricades with bolts, hazard stripes, glow strips, sparks; crates have dents; neon signs (**abstract glyph shapes, no text/eyes**); hanging cables; billboards with animated light bars.
**C4 Background alive:** parallax layers with moving elements: drifting scrap, passing ships, flashing beacon lights, orbiting debris, crane arms swinging, neon boards flickering; nebula drift; occasional meteor streak; lightning-like flickers at Heat peaks. Loops baked into shaders/instanced animation, not video.
**C5 Lighting:** stronger violet/orange pools (vent lights, neon edge, hero pool), soft god-ray streaks from vents, subtle vignette; stylized shadows only; Heat raises overall ambient energy.
**C6 Chaos layer:** debris chunks and rust flakes on every kill, oil/scrap splatter decals (non-gory), floating embers, rune circle on the floor around the hero, rattling props on stomp. All pooled, ≤1,024 particles, reduced-flash dims them.

# PART D — Progression (Chapter 1 structure) — scope change, owner approved
- **Levels 1–3 each = a score target** (START: 3,000 / 6,500 / 11,000 points, owner approved, tunable). Reaching the target ends the level (finish current wave), unlocks the next, shows a results card. Each level has its own layout seed/vent pattern, enemy mix and one new mechanic (L1 Sawlets+Throwers, L2 + Shieldsaws + vents, L3 + Grinders + Whirlers).
- After Level 3: **Scrap-Rex** boss. Defeat him → **Blade unlocked**, used from then on (B5). Chapter 2 teaser after.
- Score from kills × combo × angle/counter bonuses; stars for goals (e.g., finish ≥25 % HP, 3 perfect dodges), like the Spirit Call challenges panel.
- This replaces the old "4 waves then boss" shape; waves become the inner loop of each level. Re-run fairness bots per level.

# PART E — Chapter theming system (for later chapters)
Data-driven `src/content/chapters/<id>.ts`: palette, floor/tile set, prop kit, vent type, background layers, enemy roster, hazard, music slot (later). Chapter 1 = Foundry neon purple; later chapters swap colours, enemies, hazards and play style (e.g., Cloud Docks wind gusts) without code changes. Build only Chapter 1 now; make Part C assets read from this config.

## Process, budgets, gate
Order: A → B → C → D (E woven in). After each part: `pnpm shots`, a 10–20 s capture, viewed; update `docs/FEEL_REPORT.md` (tunables + budgets). Low tier: fewer particles/vents/decals, simpler background, same gameplay.
**Gate (owner):** hero reads as a rolling metal ball, no jelly · dash looks like a cannonball roll · rear/counter/perfect call-outs appear and matter (spamming is clearly worse) · Q and X look and feel like real abilities · neon vents/random layout/uneven floor/moving background present · zoom V/C works · levels 1–3 → boss → Blade unlock works end to end · 60 fps and budgets still met on the Mac.
## Codex prompts (one per session)
1 "Read docs/REDLINE_BRIEF.md and docs/DEPTH_SPRINT.md. Do PART A. First read ref/spirit-call movement/animation and write docs/SPIRIT_CALL_MOVEMENT_NOTES.md. Then A1–A6. Verify with shots and clips you view."
2 "Do PART B with sim tests (angle/timing/perfect-dodge/counter, enemy roster, Whirler if the owner approves, blade projectiles, Q/X/E abilities, Blade form, combo score), then bots for fairness."
3 "Do PART C and PART D (and the chapter config from PART E). Respect budgets, record results in docs/FEEL_REPORT.md."
