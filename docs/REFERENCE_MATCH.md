# REFERENCE_MATCH.md — match the concept art, asset by asset (replaces the "polish by feel" approach)
> Owner verdict on Sprint 2: still far from the references. Cause: Codex tuned by feel and zoomed the camera out. From now on every visual asset is **matched against a specific reference image with a measured loop**, like Spirit Call's `sheet → build → overlay → export` pipeline. Phases stay paused until the gate (§6) passes. Authority: REDLINE_BRIEF; this doc supersedes POLISH_SPRINT(_2) where they differ.

## 1. Two cameras (do not confuse them)
- **Showcase camera** = the concept hero shot (arena slab seen whole, ~30° elevation iso). Used for the `arena-showcase`, lobby and workshop scenes. Must match the concept arena image.
- **Gameplay camera** = ortho, follows the Core, **view ≈ 16–18 u wide**, Core ≈ 8–10 % screen height. Sprint 2's capture zoomed out to the whole 48 u slab: wrong. Fix first.
Both use the same assets; the gameplay frame is simply closer.

## 2. The loop (per asset, max 5 iterations, then ask)
1. Crop the reference to `art/match/<asset>/ref.png` (note which image + which cell).
2. Build in a dedicated scene (`<asset>-studio`) with a camera matched to the reference angle and size.
3. `pnpm shots` → `art/match/<asset>/iter-N.png` + side-by-side `cmp-N.png`.
4. Measure: silhouette overlap (IoU ≥ 0.80 against the reference silhouette mask; Spirit Call's `tools/overlay.py` is the model), palette check (dominant colours within ~10 % of reference), and the **feature checklist** below.
5. A fresh judge agent (no build context; dream-loop style) lists every missing feature; the builder fixes; repeat. Owner approves the final `cmp-N.png`.
Only after approval is the asset used in gameplay. Log in `art/match/MANIFEST.md`.
**Outlines:** the concept art has ink outlines; the owner dropped thick outlines. Shapes, proportions, colours, details and lighting must match exactly; if the owner wants the cartoon-ink look too, add a thin inverted-hull outline (cheap) — owner decides after seeing the first match.
**Lighting tier:** concept glow is a core part of the look. On `high` tier use **selective bloom** (emissive layer only, half-res); `low` tier uses additive glow sprites. (This amends the "no bloom" rule for high tier only.)

## 3. Reference → asset map and feature checklists
### A. Arena slab (reference: `1793338596294_image.png`, floating Foundry arena)
Palette: floor mauve-grey `#6b5a82 → #4a3d66` (**much lighter and warmer than the current near-black navy**), edge neon `#b36bff`, void `#140c36 → #2b1458` with magenta/blue nebula, warm key light top-left tinting the slab.
Checklist: thick slab with riveted rusty panel sides and under-hull cables/vents · **top edge = continuous row of glowing violet rectangular light cells (~40/side) with visible glow spill** · inset darker centre panel with a rounded-rectangle groove · 2 vent grates · rust stains/scuffs · corner prop clusters (gears, pipes, pink-magenta crates, barrels) **taller and denser than cubes** · neon saw sign (glowing saw blade emblem; **no text/eyes**) · 4–6 floating satellite platforms with pipes and faint purple conduit beams joining them · starfield + galaxy nebula.
Play zone inside the slab: big open square, uneven tile tones, sparse obstacles (see Sprint 2 §2).
### B. Core (references: Core sheets `Gemini_Generated…d0xrt`, `1793337085492`, hero scale in the HUD mock)
Checklist: glossy **blue-violet** sphere (`#2e3380 → #6a72d8 → #e8ebff` highlight) with a strong top-left specular, cool rim, faint magenta bounce · two red crown slashes · eyes flat white (neutral round, angry slanted, etc.; 6 expressions) · side socket plate · soft shadow · Heat tiers glow orange→white · Blade parts float with faint link. Must be the brightest, most saturated object.
### C. Enemies (reference: `1793338592710_image.png` lineup)
Sawlet: rust ball, **thin real saw ring** around its middle (chamfered teeth), gear emblem on side, red-white slanted eyes. Rivet Thrower: rust ball, knobbed rivet cap on top, short cannon barrel front. Shieldsaw: ball half-hidden behind riveted plank shield, saw disc at side. Grinder: bigger ball between two upright saw discs with hub caps. All: rust-brown with panel seams, bolts, darker grooves, violet rim light, glowing eyes; faceted but smooth enough to read as the concept. Scale vs Core as on the sheet (Core 1.0×).
### D. Scrap-Rex (reference: `1793338588856_image.png`)
Big rust-plated sphere with panel plating, narrow glowing crimson visor eyes, chain-and-claw arms, saw-jaw arm, trophy plates. **No legs: arms float** (owner rule). Enraged phase: glowing red cracks + steam puffs.
### E. Lobby + Workshop (reference: workshop/garage concept `h9drd…` + HUD mock)
Dark nebula stage, the slab seen from the showcase camera, Core on a pedestal ring, left panel of upgrade cards, right panel of stats, tabs, Play pill. Spirit Call menus for UI quality (plates, spacing, animation), not for colour.
### F. FX (references: Spirit Call combat shots for structure; Core sheet states for colour)
Use Sprint 1 §3 recipe in violet/white/orange. Checklist: ≥5 distinct layers on every ability, thick gradient discs, floor-crack decal, shards, numbers with pop, dash trail, Heat glow tiers, enemy hit flash.
### G. HUD (reference: HUD mock + Spirit Call plates)
Add third ability, pause, damage numbers; plates 16 px+ text at 844×390; never over the Core.

## 4. Order of work
1 gameplay-camera fix → 2 Core → 3 Sawlet → 4 arena slab showcase (match A) → 5 gameplay arena on the same assets → 6 other enemies → 7 FX → 8 HUD → 9 lobby/workshop → 10 Scrap-Rex (with the boss phase). One approved `cmp` per asset before the next.
## 5. Tools for this (use, don't just install)
Blender for the saw rings, shield planks, boss plating (`build.py` + `.blend` + `.glb`, bounds/pivot checks) · img2threejs for hard-surface parts · dream-loop-style fresh judge · Playwright `pnpm shots` with fixed seed/tick · `overlay` script for silhouette IoU. Hero shot and studio scenes first, gameplay later.
## 6. Gate (owner approves; Codex cannot self-pass)
Each asset's `cmp-N.png` shows a near-identical match to its reference (silhouette IoU ≥ 0.80, checklist complete) · `arena-showcase` side-by-side with the concept arena looks like the same place · gameplay frame (Core 8–10 %) shows the same assets, glow, and a busy fight · 60 fps recorded on the phone. If the owner says "not close enough", one more iteration; after 5, Codex proposes options.
## 7. Codex prompt
"Read docs/REDLINE_BRIEF.md and docs/REFERENCE_MATCH.md. Pause gameplay phases. First fix the gameplay camera (view ≈16–18 u, Core 8–10 %). Then run the reference-match loop in the order in §4, one asset at a time, producing art/match/<asset>/cmp-N.png and the checklist results. Do not move on until the owner approves each comparison. Ask only for product decisions."
