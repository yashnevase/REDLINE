# Spirit Call study — Phase 0.0

Source: ref/spirit-call/spirit-call-main. No project LICENSE/LICENCE found. Study only; no source or assets copied.

- Camera: src/presentation/camera.ts uses an orthographic camera aligned to floor projection; scene.ts interpolates actor/camera positions. Independently implement shared world/screen transforms and interpolation.
- Materials: targets show faceted matte forms, varied slabs and glowing channels; presentation/looks.ts centralizes appearance. Build REDLINE's five presets, chrome only for Core, with consistent light direction.
- FX: presentation/telegraphs.ts reads attack shapes/phases for floor warnings; scene.ts applies decaying camera feedback. Independently build rings/arcs, bounded particles and damage numbers from simulation events.
- UI: presentation/hud.ts accounts for safe areas and touch layout. Match quiet plates, left movement and right actions. Real simultaneous touch testing remains required.
- Performance: presentation/render-quality.ts caps render density independently of DOM controls. Adopt quality tiers and measure fixed replay frame percentiles, calls and triangles.
- Simulation: simulation.ts is headless; runtime.ts seeds RNG. Keep REDLINE sim free of DOM/Three and verify replay state. Snapshot package declares Ritmo 0.16.1 but records ritmoRelease 0.15.0; do not inherit setup.

Priority: deterministic replay and scene capture; shared camera/material presets; event-driven FX and tuning; quality budgets/perf replay. These systems are not implemented yet.

## Revision 2 comparison
Reference math/iso.ts and config/view.ts explicitly describe a 0.5 vertical squash, corresponding to 30° above the floor. REDLINE's prior 48° was the main camera mismatch. The new independent camera uses 30°/45° and records squash in shot metadata. The reference host.ts and render-assets.ts show simple hemisphere/directional lighting and matte Lambert surfaces, motivating a simpler neutral lighting/material recipe. No source copied. Menu target studied again for large 3D hero, teal stage, quiet side links and a cream action pill; REDLINE now has its own working preview lobby.
