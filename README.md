# REDLINE · Chapter 1

Original Three.js arena action prototype. Four waves, twelve run upgrades, Scrap-Rex, and a locally saved Blade loadout. Keyboard, touch and gamepad controls; no audio or online services.

## Run locally

Use Node 24+ and pnpm 11.25.0, then:

```sh
pnpm install --frozen-lockfile
pnpm dev --host
```

Open the Vite address. For a phone on the same Wi-Fi, use the Mac's LAN address printed by Vite. Progress lives in that browser's local storage; different origins have separate saves.

Move with WASD/arrows, tap Space to dash, double-tap for Rush, hold/release for Charge. Q/E/X use abilities; R activates ready Overdrive; P pauses. Options offers Low/Standard/High and reduced motion/flashes. The development settings button exposes tuning. Production omits the workbench and replay API.

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
