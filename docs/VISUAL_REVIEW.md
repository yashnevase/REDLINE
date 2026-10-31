# Visual revision 2 — 2026-10-30

Owner requested independent comparison and refinement of camera, characters, terrain, effects, lobby and animation. Implemented these visual changes without altering the gameplay brief or inferring approval of pending rules.

| Area | Observed gap | Revision |
|---|---|---|
| Camera | 48° elevation, overly tall floor diamonds | 30° above floor, 45° azimuth, sin(30°)=0.5 squash, same projection principle found in reference math/iso.ts and config/view.ts. Original implementation. |
| Floor | Dense, dark beveled grid and whole-island framing | Larger 1.45 u grid, small non-overlapping bevels, restrained tone variation, continuous floor beyond view. |
| Terrain | Channels at distant edges, sparse depth | Broad channels across foreground/background; segmented rust retaining walls, collar posts, vents and machinery. Warm secondary color with sparse violet accents. |
| Sawlet | Upright wheel model missed identity sheet | Faceted round shell, horizontal spinning saw disc, steel teeth, flush red/white eyes, side hubs. Separate nonintersecting shell halves. |
| Core | Hard equatorial reflection read as a belt; floating flat facial patches | Broad softbox chrome reflection; subdivided eyes/crown project flush onto sphere; inset side sockets, gentle idle orientation, deterministic blink. No belt, pupils or limbs. |
| Lighting | Heavy violet cast, harsh unbalanced scene | Warm key + neutral hemisphere + restrained cool fill; matte Lambert preset variants; cached scenery shadows and independent contact shadows. |
| Effects | No ability presentation to compare | Authored Pulse Bash preview: red windup sector, layered violet/blue floor rings, moving arcs, radial rays, slash, instanced shards and damage label. No gameplay or damage is simulated. |
| Lobby | Empty studio view rather than composed menu | Real 3D Core on teal gradient, quiet navigation, chapter card, cream Enter Foundry pill, live model/arena/effect navigation, idle motion and motes. No invented currencies or saves. |

Evidence: shots/camera-comparison.png, target-comparison.png, lobby-comparison.png, before-after.png; five scenes at desktop and landscape phone; motion recordings for arena, lobby and effects plus four effect-phase frames. art and ref remain excluded from production.

Remaining: visual review candidate, not parity approval. Effects are authored loops, not event-driven gameplay. No real-phone playtest; no worst-case combat benchmark. Gameplay engine and Phase 1 remain pending. Reduced-motion preference freezes the preview at a readable pose.


## Revision 3 — owner material and scale update
Early visual baseline accepted by owner, with refinements requested. The Core is now satin silver-grey with low-contrast soft shading (sheen .18), rather than saturated blue-violet with hard reflections. White eyes, red crown slashes and flush sockets retained. Lobby portrait palette now neutral. Map footprint 47.85×47.85 u, clear lane 15.96 u, camera view height 14.6 u; actor diameter ~8.5% of screen height. Larger background floor/machinery makes the space continue beyond the current view. No change to pending gameplay rules.
