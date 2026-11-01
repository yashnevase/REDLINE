# REDLINE · Chapter 1

Original Three.js arena action game: three score-gated levels, twelve run upgrades, Scrap-Rex, selectable missions and a saved Blade loadout. Keyboard, touch and gamepad controls, replaceable local audio, and no online services.

Current review: a ±21u fighting deck extends beyond the hazard frame, with eight opening enemies (12 live, three attacking). Shared seeded vents, hazards, pickups, style/ricochet/graze bonuses, reactive scenery and three room layouts are active. Spin/Boost/Stomp have distinct roles and timed synergies. Goals remain10,000 /24,000 /40,000 with minimum3 /4 /5 waves. Missions and Rex are selectable from the start; only Rex unlocks Blade. The garage offers saved equipment and star cosmetics; profile JSON can be exported/imported. Reports: [combat](docs/CLOSE_STEP_3_REPORT.md), [audio](docs/CLOSE_STEP_4_REPORT.md), [saves/garage](docs/CLOSE_STEP_5_REPORT.md). Full reference-art match and human acceptance remain open; Chapter1 is not tagged complete.

Owner music is copied locally from `close1/public/audio/music/` into ignored `public/audio/music/`. Run `pnpm audio:scan` after adding tracks; optional BPM/loop points live in the private manifest. M or the speaker button controls the saved mix. Public `pnpm build` excludes the entire private audio folder and uses original synth fallbacks; build validation rejects audio files in dist. Never publish private audio folders. No reference code/art or third-party audio is shipped.

## Run locally

Use Node 24+ and pnpm 11.25.0, then:

```sh
pnpm install --frozen-lockfile
pnpm dev --host
```

Open the Vite address. For a phone on the same Wi-Fi, use the Mac's LAN address printed by Vite. Progress lives in that browser's local storage; different origins have separate saves.

Move with WASD/arrows (8.5 u/s, rising to10.5 after straight rolling), tap Space to dash, double-tap for Rush, hold/release for Charge. Q Spin / E Boost / X Stomp use abilities; R activates ready Overdrive; P pauses. C/V, mouse wheel, pinch or the +/− camera buttons select saved Close/Default/Wide/Far views. Keyboard bindings are saved in Options. Options offers Low/Standard/High and reduced motion/flashes. The development settings button exposes tuning. Production omits the workbench and replay API.

```sh
pnpm check
pnpm build
pnpm shots
pnpm perf
```

For browser evidence tools, install the browser once with `PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright pnpm exec playwright install chromium`.

`pnpm perf` opens headed Chromium and checks the actual GPU renderer; it records desktop and phone-sized Mac measurements. The owner waived the physical-phone gate; these browser measurements do not certify every physical device. Browser tools use the project Playwright cache, port 5201, and write evidence under `shots/`.

## History and review

- `next-work-s2` preserves all sixteen Session 2 items; `docs/S2_REPORT.md` has the item ledger, clips, budgets and owner-note audit.
- `docs/CLOSE_CHAPTER_1.md` is the active ordered closure plan. It retains unfinished Sessions 3/4 from `docs/NEXT_WORK.md`; Step 1 clarity is ready for owner review.

- `chapter1-before-feel` preserves the complete pre-sprint source and original authored Blender assets.
- `feel-sprint` preserves the FEEL_SPRINT implementation checkpoint.
- `feel-sprint-2` preserves focused combat, stronger impacts/speed feedback, Rally pacing and responsive input/HUD polish.
- `docs/FEEL_REPORT.md` records measurements, tuning, captures and remaining acceptance gates.
- `docs/STATE.md` is the continuation entry point; `docs/REDLINE_BRIEF.md` remains the design authority.

Inspect old code without changing your current working files:

```sh
git show chapter1-before-feel:src/presentation/scene.ts
git diff chapter1-before-feel..main
```

Create an independent baseline checkout when needed:

```sh
git worktree add ../REDLINE-before-feel chapter1-before-feel
```

Source review ZIP intentionally contains only `src/presentation`, `src/content`, and `src/ui`; the full runnable project is in this repository. Reference material, generated caches and dependency folders are excluded from Git. Asset provenance and the bundled display font's OFL licence are documented in `docs/ASSETS.md`.

Sprint 2 review: `review/focus/waves2-3-desktop.mp4` and `waves2-3-compact.mp4` show normal-HP waves 2–3; `review/focus/steps/` contains six 10-second checkpoints. Input checks: `node tools/focus-inputs.mjs`; paced replay capture: `node tools/focus-review.mjs`. Run browser harnesses one at a time (shared port 5201). The owner waived physical-phone/deployment gating for this sprint; device-size and emulated input checks are documented separately from hardware FPS.

`depth-sprint-a` preserves DEPTH_SPRINT session1 (A1–A6). `docs/DEPTH_PROGRESS.md` tracks the remaining approved sessions. Movement study: `docs/SPIRIT_CALL_MOVEMENT_NOTES.md`. Review: `review/depth-a/movement-desktop.mp4` and compact/portrait variants. Reproduce camera/dash/wear checks with `node tools/depth-movement-review.mjs`; extra Close/Wide quarter-HP budgets with `node tools/depth-movement-perf.mjs`. Run browser harnesses sequentially.
