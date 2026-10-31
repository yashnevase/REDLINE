# FEEL_SPRINT_2.md — focus, punch, speed (from review of FEEL_REPORT, wave3-4.mp4, blade.mp4, feel-source.zip)
> Budgets are met on the M4 (Standard 106 calls / 50.6k tris, Low 66 / 23.8k; p95 ≈ 17.7 ms), 67 tests pass: good foundation. Remaining gap to the Spirit Call feel is **camera focus, effect strength, speed sensation and straggler pacing**. Same rules as FEEL_SPRINT: presentation is free, pacing numbers are content tuning with tests. Authority: REDLINE_BRIEF.

## Findings (evidence)
1. **Fights happen at the slab edge.** Spawns at 22 u radius, camera clamp `24 − inset(4) = ±20 u` (`camera-follow.ts`), so many frames are 40 % hull wall + giant corner props, with the Core off to a side. Clips: frames 3, 7, 8 of wave3-4. The open centre, which we designed, is barely used.
2. **Effects exist but are weak.** `impact-layers.ts` disc opacity ≈ 0.24, quiet 0.07; rings thin; damage numbers (e.g. "18") are tiny in the clip; no visible edge speed lines; hit sparks small. The report values (26 px, 40 sparks) are not producing a visible punch.
3. **Core is easy to lose** among rust blobs and props (≈9.4 % height, busy surroundings).
4. **Speed sensation is low:** movement looks the same at rest and at full speed; Overdrive is a colour change plus a label.
5. **Stragglers:** bot max bonk gap 3.9 s; last enemies idle/linger at the end of a wave.
6. HUD: debug-style values (10000/10000) in clips are fine for tests but the bars/labels crowd the lower centre; cooldown numbers are visually busy.

## Changes (in this order; each verified with `pnpm shots` + a 10 s capture you view)
### 1. Focus the fight (biggest win)
- **Play zone ±17 u** (slab stays 48 u as scenery). Soft invisible leash (push-back ease) at ±17; spawns drop in on a 14–17 u ring, not at the hull edge; camera clamp ±13 u so the hull appears only as a thin strip. Corner clusters stay outside ±19 u; props never inside the play zone except the 3–4 low obstacles.
- Open centre bigger and used: obstacles ≥ 8 u apart, 4 u lanes.
- **Core 11–12 % of screen height** (gameplay view ≈ 11 u high on phone; ~12 u desktop). Test thumb occlusion.
- **Hero locator:** soft violet floor pool under the Core (additive disc, 4 u radius, 0.25 α, slow pulse) that also lights nearby floor; slightly stronger cool rim on the Core; enemies get a faint red underglow disc so teams separate (violet = ours, red = theirs).
### 2. Make hits hit
- Impact layers: gradient disc α 0.45 (heavy 0.6), inner ring α 0.9 and **2× thicker**, arcs 1.3× longer, scorch α 0.6; add a 1-frame **impact star** sprite (white, 1.6× target size) and a 2-frame white edge flash on heavy hits (6 % screen α; off in reduce-flash).
- Sparks ×1.5 size, longer streaks (velocity-stretched quads), hot yellow-white core fading to violet; shards bigger (rust + a few bright metal chips).
- Numbers: 34 px phone / 38 px desktop, white fill with violet shadow + 1 px dark edge, crits/heavy orange and 1.3× bigger, pop overshoot 1.25, slight random tilt ±6°, stack upward when merging. A distinct **"CRUNCH" style** for tier-3 hits (bigger, shaken).
- Knockback 0.3 → 0.5 u with a brief enemy squash 0.75/1.25 and a spin on death; heavy kills slow-mo 0.35× for 100 ms (not in reduced motion).
### 3. Speed sensation
- Screen-edge **speed lines** (instanced streaks, radial) appear above 80 % speed and always in Overdrive, scaling with Heat.
- Continuous Core **trail ribbon** (violet, 6 samples) while moving fast, ghosts only on dash; stretch along velocity up to 1.2×; subtle FOV-like **ortho zoom-out 2 %** at top speed.
- Dust puffs on direction change; floor streak lines (faint) under fast movement.
- **Overdrive entry moment:** 0.2 s slow-mo 0.3×, zoom −6 %, white-violet flash, shockwave ring, banner; while active: orange-white Core aura, floor pool turns orange, edge cells run faster, extra speed lines.
### 4. Pace fixes (content tuning, add tests)
- **Rally:** when ≤ 2 enemies remain, they gain +40 % approach speed and no idle; target bot max bonk gap ≤ 2.0 s in waves 1–3 (normal HP, moving bot).
- Spawn cadence 0.8–1.2 s (from 0.8–1.5) when fewer than 5 are alive; keep caps (≤12 alive, ≤3 attacking); telegraph minima untouched.
### 5. Calmer HUD
- Hide debug numbers in production (use a 100-point scale); cooldown number only at the end of the sweep (last 1 s) or on press; ability buttons 8 % larger on phone with clearer icon contrast; HP bar thicker with a damage flash; keep the Heat arc as the main feedback.
### 6. Atmosphere refinements
- Floor tile variation ×1.5, more scuffs/decals near the play zone edge; a single large soft light sweep every ~8 s; satellite platforms slightly larger and closer to be visible in gameplay frames; nebula brightens slightly with Heat.
### 7. Phone gate (owner)
- Deploy a test build for the phone (e.g. GitHub Pages from the existing repo) — **owner approves any deploy**. Record device/browser/fps and thumb-zone notes in `docs/STATE.md`. Until then every phone claim stays "unverified".

## Gate (owner)
A fresh 30 s clip of waves 2–3: the Core and enemies are the focus (hull never fills > 15 % of the frame) · hits visibly punch (numbers readable at a glance, sparks and rings seen without pausing) · Overdrive feels like a boost · no empty stretches > 2 s · budgets still met on the Mac · `pnpm check` green.

## Codex prompt
"Read docs/REDLINE_BRIEF.md, docs/FEEL_SPRINT.md and docs/FEEL_SPRINT_2.md. Do §1–§6 in order (presentation free; pacing as content tuning with tests), keep budgets, record changed tunables in docs/FEEL_REPORT.md, verify with pnpm shots and short captures you view. Don't deploy anything; propose the phone-test deploy for owner approval."
