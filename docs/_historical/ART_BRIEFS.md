# ART_BRIEFS.md (v4) — prompt kit for image generation and asset builds
Generated images are **targets for the human and Codex to compare against**, never textures. Style block (prepend to every prompt):
> "Stylized 3D game render, faceted low-poly shapes with flat shading and bevelled edges, NO outlines, matte surfaces, soft top-left key light, subtle ambient occlusion, clean readable silhouettes, isometric camera, mobile-game polish, same visual family as a polished Three.js action game."
## Prompts
1. **Core turnaround (front, 3/4, side, top):** "A smooth hard blue-violet chrome sphere with a soft studio reflection, two flat white eye shapes, two small red slash marks on the crown, flush socket plates on both sides, no ring, no belt, no pupils, no limbs, no outlines, neutral grey background."
2. **Core with Blade parts:** same Core, two floating curved metal blades beside it joined by a faint glowing link; no arms.
3. **Enemy lineup:** "Four faceted matte rust-metal creatures on a neutral stage: (1) small ball with a toothed saw ring around its middle, (2) rounded body with a rivet launcher barrel, (3) body behind a plank shield, (4) large body with two upright floating saw discs. White-hot eyes with red slant. No outlines, no text."
4. **Scrap-Rex boss:** "Huge faceted rust-metal brute made of scrap, no legs, hovering, two big floating saw-arms detached from the body, trophy plates on its back, calm and enraged variants."
5. **Foundry arena target frame (most important):** "Isometric top-down action game screenshot: large tiled dark-purple slab floor with varied tile tones, bevelled brick walls, orange vent channels, rust gears, pipes and crates (no faces, no text), sparse violet neon edge, small blue-violet chrome ball hero in the middle fighting small rust enemies, orange telegraph rings, yellow spark bursts, floating damage numbers, phone HUD with left stick and right buttons."
6. **Hit-effect sheet:** layered ring, spark, shard, number pop, speed streaks, Heat glow tiers (orange → white).
7. **HUD sheet:** HP bar, Heat arc, wave counter, pause, Q/E/X buttons with icons, dash, Overdrive, upgrade 1-of-3 cards, results screen; Spirit Call-like calm plates, violet accent.
## Rules
- Generate 4 variants, pick one, crop; never ask the image tool for text.
- Approved crop → `art/` with a line in `art/targets/NOTES.md` (purpose, approved features, ignored features, status).
- Archive any image that contains banned features.
## Building assets (Codex)
Code-built geometry for Core, rings, teeth, sockets, simple props, effects. Blender (`build.py` + `.blend` + `.glb`) for the boss and complex parts; validate bounds, pivots, materials, triangle count, sockets in file **and** in game. No rigs; parts float. Eyes: shader on the Core; batched geometry/masks on enemies.
