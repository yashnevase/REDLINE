# REDLINE look bible — FINAL_POLISH session 1

2026-11-02. Owner's FINAL_POLISH is the active three-session final pass. This is REDLINE's art direction derived from study, not copied Spirit Call art, code or measured parity. Owner approval of final comparison pairs replaces IoU as the art gate. No completion tag during this baseline step.

## Study record: observations versus decisions

Viewed local `menu-hero.png` and `combat-lava-aoe.png`, and the remaining menu/combat references through the parity board. Read Spirit Call `presentation/host.ts`, `styles.ts`, `scenery.ts`, `scene.ts`, `sound.ts`, and `ui/kit/kit.css`. Host uses orthographic framing, hemisphere/directional lighting with intensity×π, data-driven arena dressing and explicit frame-count accounting. Screens show broad quiet faces, clear top/side planes, bright silhouettes, layered coherent rings/arcs and sparse menu hierarchy. Contact/shadow layers anchor objects without coating the whole scene.

The UI source actually uses rounded pills and circles, Alegreya Sans and Barlow Condensed, short press/filter transitions, radial stage light and slow motes. REDLINE's new chamfered industrial plates are the owner's requested interpretation, not a claim that Spirit Call uses zero round controls. Preserve its hierarchy and restraint, not its character shapes or widgets.

Sound source synthesizes layered tone/noise/swish/crunch voices; comments describe pre-rendering, throttling, prioritization and capped voices. Its master gain is0.6, heavy duck depth0.45 and recovery0.18s. Those gain settings are not LUFS measurements. Detailed cue audit and REDLINE mix changes belong to P6; no source synthesis code is copied.

## One colour script

Dark neutral industrial world; cool luminous blue-violet hero; warm danger. Keep luminance hierarchy consistent across rooms. Practical authoring targets (not measurements of the reference): floor value20–35%, prop sides15–30%, top planes35–50%, hero broad body45–70%, tiny eye/specular accents85–100%. Never make an entire hero/arena white to signal power.

| Role | Palette | Application |
|---|---|---|
| Void/interface shadow | #101423 / #241e35 | Background separation, recesses, quiet plates |
| Steel floor | #373b43 / #53565b | Large readable plates; cool neutral foundation |
| Oxide | #744b3d / #91634a | Deliberate edge wear and structural accents, not an overall brown filter |
| Core | #5555a3 / #9d9ae0 / #ced7ff | Smooth chrome ramp, one crisp key reflection, subtle magenta bounce |
| Danger | #f49a46 | Enemy warnings/hazard boundaries; preserve size/timing |
| Heat | #ec5961 | Crown/Heat UI; Overdrive adds orange rim/aura while body stays violet |
| Boost/pickup | #b39aef / #8bd8cb | Chevron/light identity versus small scrap glints |

L1: neutral steel, limited oxide supports, warm lamps. L2: cooler recess, deeper occlusion and warm machinery pools; raised circulation must read in silhouette. L3: charcoal broken plates, local orange fissure bounce; do not outline every plate equally brightly. Same hero/danger values in all rooms.

## Materials and detail

Core: flawless sphere, clean painted matcap, controlled asymmetric key/specular and soft rim. Flat white eyes and sharp red crown; no pupil, belt or drawn outline. No anisotropic squash during movement, damage or leap. Scars belong to surface paint; intact shell has no all-over grime. Socket bevels catch the same key. Steel Blade attachments appear only when equipped.

Props/enemies: clean flat-shaded or three-band soft ramps, darker sides and deliberate worn bevels. Quiet baked contact/AO at joins, not dark noise across every surface. No uniform procedural grain/speckle. Allow a few chosen scrapes and large grime patches at seams and exposed edges. Topology/lighting carry depth; textures do not fake the entire arena.

Detail hierarchy: one large silhouette, two or three secondary structural masses, sparse tiny fasteners. At most eight intentional props inside the play frame; preserve spawn lanes. Dense detail stays outside. Every mover must be named and recognizable; a belt scrolls while its housing stays fixed. Small kicked debris settles and fades. Vents have a frame, grate/slit and short stack, coherent3–4u plume, local floor pool and distinct boost chevrons. No anonymous sliding squares.

## Camera, movement and VFX

Orthographic gameplay, readable Core at current approved Default framing; Far remains an owner-accessible atmosphere view. Keep Core/HUD clear at expanded boundaries with restrained foreground cutaway. Turntable front/three-quarter/side/top shares the gameplay material and geometry. Lean is rigid rotation; rolling paint follows travel. Dust/sparks are tiny and brief on fast turns, not a continuous smoke carpet. Eyes track input, then settle.

Each effect has anticipation, contact and tail. Danger is an orange outline/cone; player Pulse uses a crisp ring, triangular shock facets and short sparks; Blade Spin uses actual steel only with Blade. Rust impacts: orange shower/rust chips; chrome: blue-white ticks. Heavy contact can add a low ring, embers and a short capped light. Preserve the Core silhouette through the effect. Screen flash/chromatic/blur are reserved for major events. Reduced-motion/flash preferences suppress their respective channels, never change simulation warnings/damage.

## Interface

Industrial shaped plates: consistent8px grid, chamfered corners, thin lit edge, recessed center, sparse rivets and localized wear. No generic purple glass card stack or exposed web-form appearance. Buttons have a deliberate large silhouette and shared stroke-weight icon vocabulary. Use existing licensed heavy condensed italic display font for titles; tabular numerals for score/time. White/cream text with one accent for selected/readiness. Active-input hints remain truthful.

One primary action per screen. Left tool cards, central hero, right stat preview; avoid duplicating identity panels. HUD is compact around a clear center. Apply plates consistently to pause/results/missions/garage/options/audio. Press120ms, modest hover glow, score count-up, bar shine and readiness flash; reduced modes use static contrast. Lobby pedestal/light rays and slow parallax support the hero rather than competing with it. Transitions must preserve focus and work with keyboard/touch/controller.

## Audio

Hit: body transient plus metal/crunch; heavy adds low thump. Kill has a distinct pop/clang. Abilities: charge/whoosh, impact, tail. Combo/style raises pitch within a bounded range; saw pitch follows speed. Heavy/banner/pause duck music. Compressor and final limiter protect the mix; per-cue maximum4 voices and40ms throttle. Quiet UI ticks; stereo position is listener/screen-relative. Pause low-pass, optional big-hit room send. Music about−18 LUFS is a mixing target to measure, not a claim about raw gain. Private reference sounds/files remain ignored and excluded from public builds; every missing file has original fallback synthesis.

## Parity and closure

`shots/parity/<area>-ours.png`, `-sc.png`, `-side-by-side.png` compare combat desktop/compact, lobby, mission select, workshop, hero close-up and HUD. Record viewport, scene, state/tick, quality, loadout and reference fit/crop. Preserve aspect ratio; disclose letterboxing/crops. Judge concrete gaps, not IoU. Reference-containing outputs stay local and out of Git/runtime. Fresh judge lists gaps; owner approves final pairs. Track sessions and one targeted rejection iteration, then carry remaining wishes into POST_SLICE_BACKLOG per P9.
