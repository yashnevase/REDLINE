# Engine evaluation — Phase 1

Decision: use @typeonce/ritmo 0.19.1 for simulation only, pinned exactly. This meets REDLINE_BRIEF §5's conditional engine requirement. The owner's current instruction authorizes proceeding after the accepted visual baseline; no second baseline approval is needed.

Clean install: tools/engine-smoke/package.json + package-lock.json, `npm ci --prefix tools/engine-smoke --ignore-scripts --no-audit --no-fund`. The initial nested pnpm command treated the parent workspace as its install target, so isolation was performed with npm ci instead. No engine API defect was found.

Checks: move at 6 u/s, dash at 20 u/s for 12 fixed ticks, wall collision, two independent runs with the same 180 tick commands, and actual WebGL rendering of the resulting position. Evidence: shots/engine-smoke.png and engine-smoke.json. Headless runner: tools/engine-smoke/smoke.mjs; browser runner: tools/engine-smoke/index.html. Version differs from the study snapshot; no snapshot setup/code was reused.

Production implementation: one validated Fight resource and one validated tuning resource; typed intent service; explicit fixed schedule; one detached read-only inspector projection. Per-run command state belongs to the host factory. Saved state is plain serializable data with integer tick timers. Gameplay uses no DOM, Three, wall clock, random globals, or approximate trig. Actual gameplay has no random decisions yet; the floor seed remains presentation content.

Ritmo is kept out of the Three/UI adapter. The established renderer consumes plain snapshots, interpolates positions and owns camera/FX state; it cannot write the runtime. The optional ritmo-render package was evaluated but removed because this brief calls for Ritmo in the sim only and the current renderer already consumes snapshots.

Checks now include the matched 0.19.1 Ritmo lint plugin and devtools schedule lint, plus Determinism.check, command replay and JSON snapshot/restore tests. Main Ritmo skill is linked to the installed package under .agents/skills. No prototype-mode shortcut or reduced checks used. MIT notices for Ritmo, Zod and Three ship in public/THIRD_PARTY_NOTICES.txt. No Spirit Call source or assets copied.
