# POLISH_SPRINT_2.md — Identity, Arena, Moves, FX pass (owner feedback 2026-10-31)
> Pause phases again for this sprint. Owner approved these changes; Codex applies **A1–A4** to `REDLINE_BRIEF.md` first and logs them in `STATE.md`. Spirit Call = our **polish, scale and feel** bar. The concept art (arena slab, enemy lineup, boss, lobby/workshop, Core sheets) = our **identity**. Earlier brief text that told you to copy Spirit Call's brown/lava palette is **withdrawn**.

## Amendments to the brief
- **A1 Theme:** outer-space neon purple. A floating industrial slab in a nebula void; violet neon edge; purple-slate floor. Orange is an accent only (enemy glow, Heat, telegraphs, vents). **No lava, no brown dirt floor.**
- **A2 Lighting:** stylized, not photoreal. No PBR world, no realistic environment reflections or AO. Soft key + violet rim, soft blob shadows, painted-looking gradients, glow by additive sprites.
- **A3 Arena:** one big open main square, few obstacles (see §2).
- **A4 Moves:** Space-bar dash variants and Q/E/X specials (see §3). Treat as approved scope; numbers are tunable.

## 1. Look (match the concept arena + Spirit Call polish)
- **Void:** deep indigo gradient, starfield (2 layers, slow parallax), a nebula smear, 4–6 distant floating platforms with pipes/pylons drifting slowly. No hard horizon.
- **Slab:** thick bevelled edge with rusty panel sides and cable bundles underneath; top edge = row of emissive violet light segments (instanced quads) with a soft additive glow spill on the floor (~1.5 u, 25 %).
- **Floor tiles:** `InstancedMesh`, per-instance colour from a violet-slate ramp (`#241c3f → #3a2f5e → #2d3a66`, ±5 % lightness, some darker scuffed, rare rust stains/bolts/vents), uneven tile sizes in places, a faint inset central plate and 2 vent grates. Bevel edges. Quiet in the middle, busier toward the corners.
- **Props (Foundry culture):** crates (pink-rust, **no faces, no text**), gears, pipes, pylons, a neon sign shape with **no text/eyes** (blank glowing saw emblem). Rust metal + violet accents.
- **Hero:** blue-violet chrome (currently reads grey). Painted matcap: dark navy base, mid `#6a72d8`, bright specular top-left, thin cool rim, faint magenta bounce below; slightly higher contrast; subtle violet halo sprite under it. It must be the most saturated, brightest thing on the floor. Crown slashes red, eyes flat white.
- **Enemies:** match the concept lineup in 3D without outlines: rust-brown faceted bodies (12–16 segments) with panel seams (bevel + darker vertex-colour grooves), bolts, a gear emblem on the body, real saw rings with chamfered teeth, rivet-launcher knobs, plank shield with nails, twin saw discs; slight violet rim light so they pop from the slab; red-white eyes with glow. Per-enemy colour jitter ±6 %.
- **Lobby/Workshop (Phase 4, but restyle the lobby now):** dark nebula stage with the floating slab, hero on a pedestal ring, cards/plates left, stats right, Play pill, per `art/` workshop concept. Replace teal.

## 2. Arena layout (big, open, readable)
- Slab 48×48 u; **camera shows ~16–18 u** around the hero (orthographic) so it feels large; test 844×390 and 1280×720.
- Centre **open square ~26×26 u**, uneven tiles, nothing blocking.
- **4 corner prop clusters** (decor + light cover) outside the main fight zone.
- **3–4 mid-field obstacles**: low walls/pylons ≈ 2×1 u, ≥ 8 u from each other, ≥ 4 u clear lanes everywhere, never block spawns or trap enemies. Total obstacle area ≤ 8 % of walkable area.
- Spawn from slab edges with a drop-in + dust ring; no popping in view.
- Test: bot can circle the whole arena without getting stuck; Core never trapped; telegraphs visible on open floor.

## 3. Moves (all tunable; sim implements, tests cover cooldown/i-frames)
**Space = dash family** (like Spirit Call):
| Input | Move | Rules (START values) |
|---|---|---|
| Tap | **Dash** | 4 u, 0.2 s i-frames, 2 charges, 1.2 s recharge |
| Double-tap | **Roll Rush** | 6.5 u low-profile roll, bonks everything in path (speed-bonk ×1.5), 1 charge, 0.2 s i-frames at start only |
| Hold (≥0.25 s) → release | **Charge Dash** | charge up to 0.6 s (squash, violet glow, speed streaks); release = long dash 4–9 u scaled by charge, piercing bonk, 1 s cooldown after; cancel by tapping Q/E/X |
After any dash variant a short shared cooldown applies (0.5 s) so it can't be chained infinitely; Overdrive halves it. Touch: dash button tap / double-tap / hold-and-release.
**Q/E/X (Blade form, CD 2/3/4 s):** **Q Blade Spin** — 360° spin 0.7 s, hits all within r 2.5, small pull-in; **E Boost Burst** — hop + forward shockwave cone; **X Stomp** — slam, ring AoE r 2, 0.6 s stun. Each has anticipation, burst, aftermath and a cooldown ring on the button.
Perfect dodge, Heat and Overdrive stay as in the brief.

## 4. FX in the purple theme (use the layered recipe from POLISH_SPRINT §3)
- Palette: Core abilities violet `#9b5cff` + white core; hits yellow-white sparks; Heat tiers violet → orange → white; enemy telegraphs orange `#ff5a1f` (readable on purple); damage numbers white with soft violet shadow, crits orange, big overshoot pop.
- Ability burst: filled gradient disc + 2 thick rings + arc streaks + shard/spark burst + glowing floor-crack decal (violet, fades 1.2 s) + camera punch.
- Spin: rotating blade arcs with trail ribbon + sparks along the edge. Stomp: shockwave ring + dust + radial cracks. Charge dash: converging particles → burst + streak trail.
- Enemy hit: white flash 70 ms, squash, knockback, rust shards + gear bits, tooth/saw snaps. Death: pop into shards + violet smoke puff.
- Particle budget ≤ 1,024; reduce-flash mode dims flashes/shake.

## 5. Process and gate
Order: A1–A4 → look (§1) → arena (§2) → moves (§3) → FX (§4). `pnpm shots` after each, view images. Max 4 sessions. **Gate (owner approves):** screenshot reads as outer-space neon purple at first glance · hero is blue-violet chrome and brightest · arena big with an open centre · enemies match the concept lineup in feel · dash tap/double/hold and Q/E/X work with visible FX and cooldown rings · replay-hash and `pnpm check` green · 60 fps on the phone, tier recorded.
## 6. Codex prompt
"Read docs/REDLINE_BRIEF.md, docs/POLISH_SPRINT.md and docs/POLISH_SPRINT_2.md. Apply amendments A1–A4 to the brief and log them in STATE.md. Run sprint 2 in the stated order; verify with pnpm shots and compare with art/ concept arena/enemy images and art/targets/spirit-call/. Report with before/after screenshots and the gate checklist."
