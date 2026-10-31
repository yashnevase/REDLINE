# STYLE.md (v4) — the look, in rules. Targets: `art/targets/`. Authority: REDLINE_BRIEF §2–3.
## Principles
- **Faceted, no outlines.** Flat-shaded low-poly shapes, bevelled edges, silhouette read by value contrast and rim/accent light, not ink lines.
- **Hero pops by material:** smooth chrome Core against matte faceted rust enemies and a quiet floor.
- **Big, varied, alive floor:** tiled slabs with 3–5 tone variants, subtle stains/decals, bevelled walls, pillars, props, a strong second colour (orange vents/lava channels) and sparse violet neon edge. Something happening in the background (steam, sparks, moving gears) but low contrast.
- **Scale:** Core 8–10 % of screen height; enemies 6–12 %; boss 25–35 %. Orthographic iso camera, ~12 u view.
- **Layered FX, each readable:** telegraph (ring/cone/line, ≥0.4 s, heavy ≥0.8 s) → impact flash → spark/shard particles → ring pulse → damage number → camera punch/zoom pulse (orthographic) → hit-stop. Speed streaks at screen edges scale with Heat.
- **UI plates:** soft dark rounded plates, thin violet edge, big touch buttons (left stick; right: dash, Q/E/X, R), HP bar bottom centre, Heat arc, wave counter, pause top-left. Never covers the Core.
## Palette (Chapter 1)
Floor `#2b2440 → #3a2f55` tone variants · rust `#8a4b2a/#c98a5e/#4a2414` · steel `#a9b0b8` · violet accent `#9b5cff` · Heat `#e5322d → #ff8a3c → #ffffff` · telegraph orange `#ff5a1f` · Core chrome blue-violet `#6a72d8` with `#e8ebff` highlight.
## Material presets (only these)
`chrome` (matcap, light dir matches scene) · `rust` (matte, flat-shaded, slight vertex tint) · `steel` · `stone` (floor/walls) · `glow` (additive, unlit). New preset = ask.
## Core
Smooth chrome ball; two flat white eye shapes (shader shape morph: neutral, angry, happy, hurt, smug, dizzy); two red crown slashes; flush socket plates; floating Blade parts with faint link glow. Face and marks do not roll with the ball.
## Enemies
Faceted matte rust; shape tells the role (Sawlet saw ring, Thrower launcher, Shieldsaw plank shield, Grinder twin saws). Eyes: white-hot core, red slant. No outlines.
## Banned
Outlines, ring/belt/pupils/limbs/backpack/antenna on the Core, faces or text on props, photoreal textures, full-screen bloom on low tier, Spirit Call characters/names/art.
## Review checklist (every visual change)
Hero findable in 1 s at 300 px · enemy/hero separated by material · telegraphs visible in busiest frame · HUD not occluding · floor not noisier than characters · light direction consistent · looks right **in motion**, not only still.
