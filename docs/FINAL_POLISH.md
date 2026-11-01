# FINAL_POLISH.md — the last pass before Chapter 1 is closed (owner review 2026-11-02)
> Same rules as NEXT_WORK / CLOSE_CHAPTER_1 (every ID DONE with evidence or BLOCKED, own `[ID]` commits so the owner can say "remove/change X", report per step, budgets). The systems are done (130 tests, soak, saves, missions, audio plumbing). What remains is **taste and polish**: the game still reads as generated/web-like next to Spirit Call. This pass fixes that. **Time-box: 3 sessions, then close Chapter 1** (see P9). Spirit Call (`ref/spirit-call/`) is the benchmark for every item: study it, then rebuild in our own style (no copying except private audio per CLOSE_CHAPTER_1 §Step 4).

## What the owner sees (the problems, in their words)
Fight audio is weak. Movement, colour shades, effects need more 3D polish. Lobby still has room. Q without Blades should not show blades. Graphics look "AI-made", UI looks like a generic chat app (Spirit Call's looks hand-crafted). Map: sometimes too much trash; vents poorly made; **plain-coloured square boxes keep sliding across the map**. The hero looks bad. Wants a polished, AAA-feeling look/feel/gameplay.

## P0 — Look Bible + parity method (first)
**P0.1** Write `docs/LOOK_BIBLE.md` from a structured Spirit Call study (screens + code: lighting rig, material ramps, colour script per room, shadow softness, glow use, camera, VFX timing, UI plates/icons/fonts/animation, audio mixing). Contents: ONE colour script (value structure: dark world, bright hero, accent colours for danger/heat/pickup), material rules (clean flat-shaded or 3-band soft ramps, controlled specular, **no uniform procedural noise**), detail rules (few, deliberate, large-to-small hierarchy), VFX rules, UI rules, audio rules. Everything below must obey it.
**P0.2 Parity captures:** for each area capture **our frame and the matching Spirit Call frame at identical size** and put them in `shots/parity/<area>-{ours,sc}.png` + a side-by-side: (a) combat desktop, (b) combat compact, (c) lobby, (d) mission/level select, (e) workshop/collection, (f) hero close-up, (g) HUD. A fresh judge lists concrete gaps per pair; the owner approves the final pairs. (Spirit Call frames stay local.)

## P1 — Hero polish (hero looks bad)
**P1.1** Rebuild the in-game Core look to the concept sheet: clean **smooth blue-violet chrome** (high-quality painted matcap with a crisp specular, soft rim, subtle magenta bounce), flawless sphere silhouette (no egg/stretch, no faceting), crisp **flat white eye shapes** with slight emissive edge, red crown slashes sharp, clean socket plates with bevel and tiny details. **Overdrive keeps the blue-violet body**; it adds an orange rim/aura and brighter slashes, it must not turn the hero white/orange blob. Blade parts: original steel blades only when equipped.
**P1.2** `core-turntable` scene (front/3-4/side/top + expressions + heat stages + scars) compared with the concept sheet and Spirit Call's hero quality; owner approves before moving on.
**P1.3** Movement polish: weighty roll, subtle lean into turns, nicer start/stop, footprints of dust and tiny sparks only on fast turns, eyes tracking. Compare feel to Spirit Call's movement notes.

## P2 — Abilities depend on equipment (bug)
**P2.1** **Blades are NOT part of the base hero.** With no Blade equipped: **Q = Pulse Bash** (the original Q): a fast radial burst that hits everything nearby with a clean ring + diamond/triangle shock facets and sparks (no blades anywhere). Base E = Boost Burst (jet), base X = Stomp. **Blade Spin, orbiting blades, blade projectiles and the two floating blades appear only when the Blade part is equipped.** Keep their unique roles (Q crowd control, E mobility, X control) for both loadouts; synergies stay.
**P2.2** Tests: unequipped Q has zero blade entities/visuals; equipped has them; workshop equip/unequip swaps cleanly; replay/hash green.

## P3 — Map cleanliness, vents, the sliding boxes
**P3.1 Find and fix the sliding boxes:** list every moving mesh with name/type/speed in a dev dump; the plain-coloured sliding squares are some drifting/conveyor/debris/haul element with no recognisable shape. **Replace or remove**; every moving thing must be a recognisable object (wreck, crate with hazard stripes, conveyor with moving belt texture, rotating gear/saw) and move believably (belt motion = texture scroll, not whole objects sliding).
**P3.2 Declutter:** inside the play frame keep only intentional props (≤8 total), clear lanes, no clutter near spawn ring; debris is small, settles, fades and never reads as an obstacle; edge/outer dressing can be dense.
**P3.3 Vents rebuilt:** a proper vent model (frame, grate with glowing slit, short stack), clean light shaft, soft smoke plume rising 3–4 u, embers, occasional steam burst with light pulse, floor glow; separated ≥9 u, seeded; boost vents clearly different (chevron plates + brighter pulse). Remove anything that looks like a floating box.
**P3.4** Keep the AM art tasks from the last review (L2 multi-level depth, irregular giants/wrecks, chipped/broken-steel finish) **inside the time-box**, judged by the owner, not by IoU (see P9).

## P4 — UI redesign (must stop looking like a chat app)
Spec for Codex, replacing generic dark-purple glass cards: **shaped plates** (chamfered corners, bevel, inner shadow, subtle rust-metal/panel texture, rivets, neon/amber edge line), **custom icon set** (one stroke weight and style, ability icons with strong silhouettes), **game typography** (heavy condensed italic for titles, tabular numerals for scores), animated states (press squash, hover glow, count-up numbers, bar fills with shine, cooldown sweep with flash on ready), **no web-style rounded rectangles/inputs**, consistent spacing grid, readable contrast. Apply to HUD, banners, pause, results, level select, workshop, options, audio popover. Compare each with Spirit Call's counterpart in P0.2.
**P4.2 Lobby polish:** hero on a lit pedestal with light rays and drifting particles, parallax slab/space background, subtle camera sway, hero idle animations (blink, look-around, little hop), menu items with plate styling and sound; transitions between screens (slide + glow), not instant swaps.

## P5 — 3D polish for the world, colour and effects
**P5.1 Colour script:** apply the Look Bible: controlled palette per room, warm/cool light contrast, accent colours reserved for danger (orange), heat (red), pickups, boosts. Remove muddy brown overlay and uniform noise; floor reads as clean plates with deliberate wear.
**P5.2 Materials/lighting:** 3-band soft shading on props and enemies with rim light, baked AO on plates, bevelled edges catching light, soft contact shadows, coloured bounce near vents/lamps, optional SSAO on High (default on desktop if budget allows), tone-mapping/grade per room.
**P5.3 Effects:** crisper, shaped, layered, and tuned like Spirit Call's (shape language of rings/arcs/shards, not blurry blobs); sparks per CLOSE §CL7; screen effects only on big events; every effect has anticipation→hit→tail.
**P5.4 Enemy/boss finish:** clean authored-looking forms (consistent bevel/rivet language), worn steel/rust per Look Bible, no noisy textures.

## P6 — Fight audio (Spirit Call as the reference)
**P6.1 `docs/SPIRIT_CALL_AUDIO_MAP.md`:** from its code/assets list every cue → sound file(s), layering, volume, pitch/randomisation, cooldown/voice limits, ducking, music behaviour, mix levels. Then replicate in our `audio-map.ts` using its sounds (private use, per CLOSE rules) plus our synth fallbacks.
**P6.2 Layered fight sound:** every hit = body + crunch/metal layer + (heavy) low thump; kills have a distinct pop/clang; abilities = whoosh/charge → impact → tail; blade/saw sounds pitched with spin speed; sparks tiny ticks; pitch rises with combo/style rank; Overdrive adds a sub swell; vents hiss ambience; last-enemy-in-wave accent; boss phase stings.
**P6.3 Mix:** master compressor + limiter (no clipping), music −18 LUFS-ish under SFX, ducking on heavy hits/banners/pause, per-cue voice limits (max 4) and 40 ms throttle, stereo pan by screen x, optional reverb send on big hits, low-pass on pause, UI sounds quiet and crisp.
**P6.4** Owner listening checklist in the report (hit, kill, Q/E/X, dash, Overdrive, boss, UI); owner approves by ear. Corner mute/volume stays.

## P7 — Review points to double check
Sound/volume controls reachable on every screen; no overlap between HUD plates and Core; no leftover debug text in production; Low/Standard/High budgets (Low ≤70/25k, Standard ≤120/60k) still pass after the polish; replay-hash green flags on/off; saves still migrate.

## P8 — Report format
Per step: ID table (DONE/BLOCKED + evidence), "Not done", tunables, budgets, `pnpm check`/build, 1 normal-play clip (30 s, normal stats), parity pairs (P0.2), audio checklist, owner-message audit against NEXT_WORK owner notes + CLOSE_CHAPTER_1 + this doc.

## P9 — Closing rule (stops endless iteration)
The **IoU/reference-match judge is replaced by owner approval** of the parity side-by-sides. After **at most 3 sessions** of this polish, Codex runs QA, tags `chapter1-complete` and finishes `CHAPTER_PIPELINE.md`; any remaining art wishes go into `docs/POST_SLICE_BACKLOG.md` as new tracked items instead of blocking closure. If the owner rejects a pair, one more targeted iteration, then it goes to the backlog.

## Codex prompt
"Read docs/REDLINE_BRIEF.md, NEXT_WORK.md, CLOSE_CHAPTER_1.md and docs/FINAL_POLISH.md. Do P0 first (LOOK_BIBLE and parity captures) and report; then P1, P2, P3, P4, P5, P6 in that order, one report per step, within 3 sessions. Then close Chapter 1 per P9."
