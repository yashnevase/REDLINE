# FUN_LAYER.md — what makes REDLINE addictive (design-lead notes)
> All items are **PROPOSED** unless marked. Each has a cost and a slice decision. The owner confirms before the agent builds anything marked "ASK". Goal: the dopamine loop the owner described: *smooth control + accurate hits + loud effects + timing that rewards thinking*, even with no music.

## 1. The core fun loop (LOCKED mechanics, restated as player feelings)
**Roll** (smooth, weighty) → **bonk** (crunchy hit, sparks, teeth snap) → **dodge through danger** (slow-mo flash) → **Heat climbs** (marks glow, screen gets louder) → **Overdrive** (the NFS boost moment) → **boss** (readable, fair, big) → **new part** (visible power-up). Every step must give a visual + motion reward within 100 ms.

## 2. "Lots of targets" without breaking fairness
Spirit Call-style games keep dangerous enemies few and tough so each fight is readable; Brotato-style games give a satisfying swarm. We get both with two tiers:
| Tier | Count (cap) | Role | Rules |
|---|---|---|---|
| **Threats** (Sawlet, Rivet Thrower, Shieldsaw, Grinder, boss) | ≤12 alive, **≤3 attacking at once** | fair, telegraphed danger | per Bible §6.9 |
| **Scrapbits** (fodder) — ASK | ≤24 alive extra, instanced | pop-able targets, combo and Heat food | never more than a tickle (Heat −2, no HP), no telegraph needed, always roll toward the Core |
Result: a screen full of things to bonk, but only ~3 real attackers at any moment. Cost: one tiny asset + one simple AI. **Slice decision: include if the owner says yes; otherwise cut with no code changes elsewhere.**

## 3. Skill and timing (what makes players think)
1. **Speed-bonk (LOCKED by the hard-body logic):** the faster you hit, the more teeth snap and the more damage you deal. Skill = building speed (dash → bonk) instead of standing still. Show a speed meter as a ring flare on the Core.
2. **Counter-bonk — ASK (cost: small):** bonk an enemy **in the last 0.15 s of its telegraph** → stagger 0.6 s, +Heat, big spark, smug eyes. A simple, learnable timing window that rewards reading telegraphs (the owner's "time the attack to win" idea).
3. **Perfect dodge (LOCKED):** dash through an attack in its last 0.15 s → slow-mo flash + Heat.
4. **Heat risk/reward (LOCKED):** higher Heat = more enemies and a bigger score multiplier; getting hit drops Heat. Players choose between playing safe and pushing for Overdrive.
5. **Enemy puzzles (LOCKED):** Shieldsaw from behind, Grinder dash-through, Rivet Thrower sidestep.
6. **Redline Rush (finisher) — ASK:** in Overdrive, the dash becomes a free, piercing charge through small enemies (the nitro moment). Cost: small.

## 4. Brotato-style run variety (cheap, high replay value)
- **1-of-3 upgrade after each wave** (12 upgrades, Bible §6.5). **Reroll** earned by perfect dodges (1 per 5), shown as a small token.
- **Wave modifiers — ASK, after the slice:** before a wave, pick 1 of 2 "curses" for a reward (e.g., "Slippery floor: +50% score", "Hot start: Heat begins at Warm but decays faster"). Deepens replay without new art.
- **Run mutators and daily seed — after the slice:** same arena, different rules; the deterministic sim already supports seeds.
- **Scrap pickups (mint) — after the slice:** a currency for a between-run garage later.

## 5. Spectacle without audio (the "metal song" feeling)
Camera punch and shake on heavy hits, hit-stop, speed streaks that scale with Heat tier, a screen-edge pulse on every 4th kill, boss intro push, phase-change roar ring, enemy gear-bit pops, floating damage numbers with ▲/▼. **Beat hook for later:** a `beat()` event emitter in the render layer (disabled now) so a looping track can drive pulses/hit-stop accents later without touching the sim.

## 6. Anti-frustration
Retry <2 s; show the killing attack in a freeze-frame; first death shows a one-line tip; assist options (more HP, slower enemies); no timers; telegraphs ≥0.4 s (≥0.8 s heavy).

## 7. Ship order
**Slice (must):** speed-bonk, perfect dodge, Heat/Overdrive, 1-of-3 upgrades. **Slice (ASK):** Scrapbits, Counter-bonk, Redline Rush, rerolls. **After slice:** wave modifiers, mutators, daily seed, pickups/garage, co-op.
