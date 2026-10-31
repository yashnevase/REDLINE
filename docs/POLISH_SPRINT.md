# POLISH_SPRINT.md — "Look Lock" (insert before continuing phases; owner-approved pause)
> Owner clarification, 2026-10-31: approved visual sprint with silver-grey satin Core retained; no gameplay timing, knockback, collision or hit-stop changes. Blue-violet/chrome requirements below are superseded. Human look-lock and physical-phone gates remain open.

> Authority: REDLINE_BRIEF. This sprint changes **no gameplay**. It makes the existing scene, Core, enemies, FX and HUD reach the Spirit Call bar, then phases resume. Baseline = Codex's current in-engine renders (save as `art/targets/redline-current/baseline-01.png…`); targets = `art/targets/spirit-call/`.

## 1. Honest status
Good: iso camera, lava channels, brick walls, crates/pipes/gears/vents, teal lobby, faceted Sawlet/Grinder, HUD layout, flat white eyes + red slashes.
Gap vs Spirit Call: flat even lighting (no depth), floor is one brown with thin grid, thin grey FX rings, Core reads **grey matte**, not blue-violet chrome, tiny low-contrast HUD text, buttons overlapping props, lava has no glow on its surroundings. Boss-like enemies have more character than the hero.

## 2. Fix list (what Codex does, in this order)
| # | Problem | Three.js fix |
|---|---|---|
| 1 | Core is grey, flat | Procedural **matcap** (canvas gradient: deep blue-violet `#2e3380` → `#6a72d8` → bright `#e8ebff` top-left spot, thin cool rim at the edge, a faint warm bounce at the bottom). Add a small additive rim sprite. Eyes/marks stay unlit. Core must be the most saturated/bright thing on the floor. |
| 2 | Even, flat light | Warm key `DirectionalLight` + cool `HemisphereLight`; `PCFSoftShadowMap`, one shadow cascade fitted to the arena; tone mapping ACES, sRGB output; soft **contact shadow** blob under every unit (instanced). Slight vignette via CSS radial gradient over the canvas. |
| 3 | Floor boring | Floor as `InstancedMesh` slabs with **per-instance colour variation** (4–5 tones, ±4 % lightness, a few darker/cracked, rare bolts/decals); bevel the slab edges; subtle large-scale light gradient across the arena. |
| 4 | Lava dead | Emissive lava shader: scrolling 2-octave noise, brighter cracks, slow bubble sprites, **additive glow decal** on adjacent floor/wall (width ~1.5 u, 25 % alpha), a few drifting ember particles. No full-screen bloom. |
| 5 | Walls/props flat | Vertex-colour bake: darker at bottom, lighter top edge (fake AO); 1-pixel lighter top bevel; props cast shadows; add 6–10 more small props and decals so the edge zones feel built. |
| 6 | FX rings thin/grey | Layered FX recipe (below): filled gradient disc + 2 rings + arc streaks + sparks + ground scorch. Colours from Heat tier (violet → orange → white). |
| 7 | Hit has no punch | Enemy white **hit flash** 70 ms (emissive), squash 0.8/1.2, knockback 0.4 u eased, shard + spark burst, number pop with overshoot, camera punch (ortho zoom −2 % over 60 ms), hit-stop 40–60 ms (sim time policy). |
| 8 | Motion stiff | Procedural animation table (below) on all units. |
| 9 | HUD weak | Larger plates (≥16 px text at 844×390), higher contrast, Heat arc, buttons never over props (HUD sits on a soft dark gradient strip), pulse/spring on press, cooldown sweeps. Roster-style Core plate is fine. |
| 10 | Enemy readability | Eyes white-hot core + red slant; role shape unmistakable at 300 px; thin red HP pip bar above head only when damaged. |

## 3. Layered FX recipe (every ability/hit uses it; all pooled, instanced, ≤1,024 particles)
1. **Anticipation** 80–120 ms (Core squashes/shrinks; ring fades in on the floor). 2. **Burst** frame: white flash disc 1 frame, scale 0→1 ease-out-cubic in 120 ms. 3. **Filled disc** gradient (centre transparent → edge colour, additive) expands 200 ms, fades 300 ms. 4. **Two rings** at 1.0× and 0.75× radius, thick 4–6 % radius, offset by 40 ms. 5. **Arc streaks** 6–10 curved lines rotating 30°, fade 250 ms. 6. **Sparks/shards** 12–30 instanced quads with gravity, random spin, 400–700 ms. 7. **Ground scorch** decal alpha 0.35 → 0 over 1.2 s. 8. **Number** pops 0.6 → 1.15 → 1.0 (120 ms), floats up 0.8 u, fades 600 ms; bold with soft dark shadow, no outline. 9. **Camera**: punch + 1–2 px shake scaled by tier (off in reduce-flash).
## 4. Procedural animation table (no rigs; parts follow data timings)
Idle: bob ±0.04 u @ 1.6 Hz, blink every 3–5 s (eye scaleY 0.1 for 90 ms). Move: stretch along velocity up to 1.15×, squash on turns, dust puff every 0.25 u at speed. Dash: anticipation 70 ms squash 0.85, stretch 1.35 along dir, motion trail ribbon (additive, 8 samples), landing squash. Bonk: lunge 0.15 u toward target, hold 40 ms. Hurt: eyes → hurt shape, tint flash, 0.3 s shake. Overdrive: marks glow white, edge speed streaks, heat shimmer ring. Enemy spawn: drop from 3 u with shadow growing, squash on land, dust ring. Enemy death: freeze 60 ms, pop into 8–12 shards + gear bits, fade shadow. UI: all buttons spring (overshoot 8 %), numbers count up. Use critically-damped springs, not linear tweens.
## 5. Process (to avoid endless fiddling)
- Work in the `core-studio`, `arena`, `combat-readability` scenes; `pnpm shots` after each item; view images.
- Time-box: one session per 2–3 items; max 4 sessions. Then stop.
- Make a **look-lock capture**: same viewport (1280×720), same framing as `combat-lava-aoe`, a Pulse Bash mid-burst with 5 enemies; save `shots/looklock.png` + a 3 s sequence.
## 6. Gate (owner approves; Codex cannot self-pass)
Beside `combat-lava-aoe` at 1280×720, the capture must satisfy: Core is clearly blue-violet chrome and the brightest object · depth visible (shadows, light falloff, tonal floor) · lava glows onto surroundings · hit burst has ≥5 distinct layers · numbers/HUD readable at 844×390 · enemies readable at 300 px · 60 fps on the target phone with the quality tier recorded. Fail any → one more session, then ask.
## 7. Codex prompt (paste)
"Read docs/REDLINE_BRIEF.md and docs/POLISH_SPRINT.md. Pause gameplay phases. Run the Look Lock sprint, items 1–10 in order, using pnpm shots after each, viewing images and comparing with art/targets/spirit-call/. No gameplay changes. Report with before/after screenshots and the gate checklist. Ask only for product decisions."
