# REDLINE · Chapter 1

Original Three.js arena action prototype. Four waves, twelve run upgrades, Scrap-Rex, and a locally saved Blade loadout. Keyboard, touch and gamepad controls; no audio or online services.

## Run locally

Use Node 24+ and pnpm 11.25.0, then:

```sh
pnpm install --frozen-lockfile
pnpm dev --host
```

Open the Vite address. For a phone on the same Wi-Fi, use the Mac's LAN address printed by Vite. Progress lives in that browser's local storage; different origins have separate saves.

Move with WASD/arrows (8.5 u/s, rising to10.5 after straight rolling), tap Space to dash, double-tap for Rush, hold/release for Charge. Q/E/X use abilities; R activates ready Overdrive; P pauses. C/V, mouse wheel, pinch or the +/− camera buttons select saved Close/Default/Wide views. Options offers Low/Standard/High and reduced motion/flashes. The development settings button exposes tuning. Production omits the workbench and replay API.

```sh
pnpm check
pnpm build
pnpm shots
pnpm perf
```

For browser evidence tools, install the browser once with `PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright pnpm exec playwright install chromium`.

`pnpm perf` opens headed Chromium and checks the actual GPU renderer; it records desktop and phone-sized Mac measurements. This does **not** replace a real-phone test. Browser tools use the project Playwright cache, port 5201, and write evidence under `shots/`.

## History and review

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
