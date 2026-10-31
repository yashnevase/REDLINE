# PHASES.md (v3) — follows REDLINE_BRIEF §7. One work session per milestone; update STATE.md at the end.
## Phase 0 — Setup, cleanup, first target frame
0.0 Move old docs to `docs/_historical/`; fix `ref/` paths; move `art/other_*` to `art/_archive/`.
0.1 Read `art/targets/`, write `art/targets/NOTES.md`.
0.2 Study Spirit Call (`ref/spirit-call/`): write `docs/SPIRIT_CALL_LESSONS.md` (≤2 pages: lighting, materials, camera, FX, UI, perf) and `docs/ARCHITECTURE_MAP.md`. No copying.
0.3 Scaffold Vite+TS+Three+pnpm; make `dev`, `check`, `shots`, `perf`, `build` real. Ritmo smoke test (move, dash, collide, replay, draw); else own fixed-step sim.
0.4 One static frame: chrome Core, one Sawlet, tiled floor, walls, props, HUD. `pnpm shots` desktop + phone.
**Gate:** screenshots viewed, side-by-side with a Spirit Call shot, clean install works, **owner approves look**. Model: strongest for 0.2–0.4, default for the rest.
## Phase 1 — Small polished fight
Core movement, dash with i-frames, auto-bonk, one Sawlet, hit FX layers, camera punch, squash/stretch, touch + keyboard + gamepad, debug panel.
**Gate:** replay-hash test, real-phone session, motion capture looks attractive and readable, 60 fps target recorded by `pnpm perf`.
## Phase 2 — Combat slice
Thrower, Shieldsaw, Grinder, waves (clear → upgrade → next), Heat/Overdrive, 12 upgrades, abilities Q/E/X. Bots test fairness on specific cases (spawn overlap, wall escape).
**Gate:** timing/cap/collision tests, human playtest, enemies ≤12, attackers ≤3.
## Phase 3 — Complete loop
Scrap-Rex (4 phases, telegraphs ≥0.8 s), Blade reward, retry <2 s, local save, minimal start/equip/results.
**Gate:** end-to-end win/lose/unlock/save/retry; boss readable in screenshots and motion.
## Phase 4 — Finish
Arena dressing, transitions, reduce-flash and assist options, quality tiers, device evidence, first-time-player observations, Chapter 2 teaser.
**Gate:** owner's slice acceptance (hero findable in 1 s at 300 px, feels as polished as the targets).
## Rules for every phase
Visual evidence required; ask on product decisions; routine reversible choices are the agent's; never mark a gate passed without evidence; pending items in the brief need owner yes.
