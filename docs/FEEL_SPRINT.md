# FEEL_SPRINT.md — pace, juice, atmosphere, performance (after owner review of gameplay4.mp4, 2026-10-31)
> Look is now close enough to iterate on. This sprint is about **how it feels**: faster, more aggressive, more alive, smoother, and light enough for phones. Authority: REDLINE_BRIEF. Gameplay rules stay as approved; pacing/spawn numbers are content tuning (re-run sim tests and replay-hash). Presentation changes are free.

## What the video shows (owner + reviewer notes)
- Arena is **mostly empty floor**; fights have 2–7 enemies, long gaps, so it feels slow and calm, not NFS-fast.
- Hit effects are subtle (a ring under the Core); **damage numbers, hit sparks, shards and screen punch are barely visible**.
- Core is small in a big empty view; camera is static-feeling; when the Core nears a corner, giant props fill the screen (frame with huge saw + crates).
- Text/overlay moments are limited to wave panel and menus: no wave banners, combo/streak, Overdrive call-outs or boss card.
- Atmosphere is static (nebula, edge, satellites do not move or react).
- Reported **126k triangles / p95 83 ms in headless**: headless is software GL (not proof), but 126k tris and a ~135k-tri opening frame are far above a phone budget. Fix regardless.

## 0. Measure first (Codex; do not skip)
1. `pnpm perf` **headed on the Mac with real GPU** (not headless) at 1280×720 and 844×390 at DPR 2; record p50/p95/p99 frame time, calls, triangles.
2. Same scene on a real phone over LAN (`pnpm dev --host`), Safari/Chrome; record quality tier and rough fps with the DevTools remote tools.
3. Budgets: **Standard ≤ 60k tris, ≤ 120 calls; Low ≤ 25k tris, ≤ 70 calls; gameplay Core ≤ 8k tris; enemies ≤ 2k tris each, instanced where possible.** Fix to budget before adding effects (LOD, instancing, merge, drop unseen geometry, cull far props, lower shadow res).

## 1. Pace and density (content tuning)
- Keep caps (≤12 enemies alive, ≤3 attacking). Within them: **spawn staggered every 0.8–1.5 s from slab edges so ≥5 threats are alive during combat**; first contact < 3 s after wave start; never > 2 s with nothing to bonk.
- Wave sizes (START): W1 8 Sawlets · W2 6 Sawlets + 3 Throwers · W3 5 Sawlets + 3 Throwers + 3 Shieldsaws · W4 6 + 3 + 2 + 1 Grinder (total alive ≤12).
- Enemies close in more aggressively (higher approach speed, shorter idle), but telegraph rules stay (≥0.4 s; heavy ≥0.8 s).
- Heat builds faster in the first 20 s so Overdrive arrives in wave 2–3.
## 2. Camera
Look-ahead 1.2 u toward movement, critically damped follow; zoom pulses (dash +4 % out, bonk −2 %, heavy −4 %, ease 120 ms); micro-shake on heavy hits; **clamp the camera ≥ 4 u inside the slab edge** and fade/skip corner props that would cover the Core; Core ≈ 9–10 % height. Keep the showcase camera separate.
## 3. Hit juice (tiered)
| Tier | Hit-stop | Shake (u) | Sparks | Extra |
|---|---|---|---|---|
| Light | 30 ms | 0.04 | 10 | white flash 70 ms, knockback 0.3 u |
| Medium | 55 ms | 0.09 | 20 | ring pulse, shards |
| Heavy/ability | 90 ms | 0.16 | 40 | floor crack decal, zoom punch, slow-mo 0.25× for 80 ms on boss phase hits |
**Damage numbers must be clearly visible**: bold, ~22–28 px at phone, pop 0.6→1.2→1.0, float 0.8 u, soft violet shadow, orange for heavy, stack/merge on rapid hits. Kill = freeze 60 ms + pop into rust shards + gear bits + violet smoke. Combo counter with tiers (×3, ×5, ×10) pops at screen edge.
## 4. Core motion
Squash/stretch by acceleration, roll tilt, eyes lean toward movement, dash **afterimages** (3 additive violet ghosts), speed-streak lines at screen edges scaling with speed/Heat, dust puffs on turns/landing, Overdrive aura + heat shimmer, charge-dash converging particles, spin arcs with trail ribbons, stomp shockwave + radial cracks.
## 5. Enemy animation
Anticipation before every attack (squash, eyes brighten, tint, 0.4–0.8 s), saw rings spin up before lunges, thrower recoil on shot, shield wobble on hit, Grinder wind-up shake, spawn drop-in with dust ring, hurt flinch, death pop. Idle bob with per-enemy phase offsets so crowds don't sync.
## 6. Atmosphere (all cheap)
Nebula slow drift + 2-layer star parallax with twinkle, floating dust motes near camera, drifting satellites bobbing, **conduit light pulses** along beams, **neon edge cells chase-animate and brighten with Heat**, edge glow pulse on every 4th kill, slow ambient light sweep across the floor, vignette that pulses on damage, subtle Heat-tier colour grade (violet → orange tint at Overdrive). Reduce-motion/flash modes dim all of it.
## 7. Text and overlays (stylized, readable, skippable)
Wave banner slides in 0.6 s ("WAVE 2 · SAWLETS!"), "OVERDRIVE!" call-out, streak call-outs, boss intro title card with name plate ("SCRAP-REX"), phase-change roar ring + banner, upgrade-card entrance animation with spring, results screen count-up. Font: heavy italic OFL display face (e.g. Rajdhani/Teko) — log licence in `docs/ASSETS.md`.
## 8. HUD
Cooldown sweeps with ready pop, button press springs, HP bar flashes on damage, Heat arc glow, plates 16 px+ at 844×390, nothing over the Core; thumb-zone check on a real phone.
## 9. Process and gate
Order: 0 measure → budgets → 1 pace → 3 hit juice (numbers!) → 2 camera → 4/5 motion → 6 atmosphere → 7 text → 8 HUD. Each step: `pnpm shots` + a 10–20 s capture, viewed. All new values in the debug panel. Max 4 sessions.
**Gate (owner):** a 30 s clip at wave 3 with ≥5 enemies always alive; numbers/sparks/shake clearly readable; no screen-covering props; Overdrive feels like a boost; budgets met on the Mac GPU **and** the phone with fps recorded; `pnpm check` green.
## 10. What to send the reviewer (small, no zips of Spirit Call/models)
1. `docs/FEEL_REPORT.md` written by Codex: current tunables table (hit-stop, shake, particle counts, camera values, spawn timings), measured perf (Mac GPU + phone), triangle/call counts per scene.
2. A 30–45 s screen recording of wave 3–4 and a 10 s clip of Blade abilities (Q/E/X + dash variants).
3. `src/presentation/`, `src/content/` and `src/ui/` as one small zip (no `public/models`, no `ref/`, no `node_modules`).
## 11. Codex prompt
"Read docs/REDLINE_BRIEF.md and docs/FEEL_SPRINT.md. Do step 0 first (headed real-GPU perf + phone), fix budgets, then follow the order in §9. Write docs/FEEL_REPORT.md. Don't add mechanics beyond the brief; pacing numbers are content tuning with tests. Verify with pnpm shots and short captures you actually view."
