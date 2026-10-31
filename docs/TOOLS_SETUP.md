# Local development — Phase 0

From redline-pack:

```sh
pnpm install --frozen-lockfile
PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright pnpm exec playwright install chromium
pnpm dev --host --port 5199
pnpm check
pnpm shots
pnpm perf
pnpm build
```

Open http://localhost:5199. Implemented scenes: lobby, arena, core-studio, enemy-lineup, combat-readability (URL ?scene=...). Settings button opens visual tuning in development. Production omits the workbench and capture API. Everything is original procedural geometry; no reference images load in the app.

check runs TypeScript, oxlint, deterministic layout tests, content validation and source asset checks. It does not claim simulation tests: gameplay and engine choice remain pending. shots captures all five implemented scenes at 1280×720 and 844×390, JSON metadata, and arena, lobby and effects idle WebMs after a ready signal. perf measures static arena requestAnimationFrame intervals at 1×/4×/6× CPU throttle. It is not the eventual worst-case gameplay replay and does not establish real-phone frame rates.

The app is a Phase 0 visual study with animated presentation loops. Controls are layout previews; movement, dash and combat are not active. The phase requires owner look approval before gameplay work. The brief's pending scope/rule choices remain unchanged.

Dependencies are pinned. Renderer typings use @types/three 0.186.0 (latest available at setup) with Three 0.187.0; only shared APIs are used and checked by TypeScript.

Default entry is the 3D lobby. Enter Foundry opens the arena; Effects and the Pulse Bash control open the authored FX loop. Character links open the Core/Sawlet model views. These are functional preview routes; combat is not implemented. The prior arena capture is retained in shots/previous for before/after review.


Phase 1 supersedes the earlier static-only notes: Arena is now First Contact, an actual one-Sawlet fight. `pnpm playtest` verifies keyboard/dash/pause/retry/loss, recorded replay, simultaneous touch, and gamepad mapping under emulation. `pnpm check` includes Ritmo schedule/source lints plus 11 tests. The browser `__REDLINE__` API exposes recorded commands and detached fight state only in development. `pnpm perf` now steps a fixed-command one-enemy replay at 1×/4×/6× CPU throttle; it is not the future full-Chapter stress case. Scene perf-worst uses the same real simulation. See PHASE_1_PLAYTEST.md.
