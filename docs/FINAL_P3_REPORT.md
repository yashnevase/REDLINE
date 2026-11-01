# P3 — cleanup, moving-object identity and vents

| ID | Status | Evidence |
|---|---|---|
| P3.1 | DONE for identified offenders | Dev world metadata now includes a named moving-mesh inventory, types, speed/timing source and caps; dump `shots/final-p3/moving-mesh-dump.json`. The saw-cart was an oversized chip box; magnetic scrap also used box geometry. They now use an original wheeled/toothed carriage and small faceted pickups. Static barrels/bumpers/cart no longer inherit arbitrary continuous yaw. |
| P3.2 | DONE | Cosmetic props moved outside the±17 frame, away from the14–17 spawn ring, and reduced12→8 outside dressing instances. Inside:5 vents +3 intentional barrels. Rail/crusher moved to the accessible outer belt; bumpers already outside. Barrel positions moved inward off the spawn ring. Broken debris settles and fades at2–3s; kicked fragments remain0.6s. |
| P3.3 | DONE, owner taste review pending | Vent frame/grate and short capped illuminated stack at each shared seeded position; boost chevrons and brighter differentiated pools retained. Local plumes narrowed to rise about3–4u; dense/tall chaos plumes stay at the outer edge. Separation≥9u retained. |
| P3.4 | Active in P5 | L2 multi-level composition, irregular giant/wreck silhouettes and broken-steel finish remain inside this pass, not moved to backlog or declared exact matches. |

135 tests/check and build pass. New tests validate inside-frame count, outer dressing/spawn separation, vent spacing, outer-belt hazard placement and finite recognizable replacement geometry. Desktop/compact screenshots and short world clips viewed under `shots/final-p3/`. No new batch submission; original replacement geometry joins existing world batch. Final P7 stress tests still required after P4–P6.

Tunables: eight outer cosmetic props; rail z19, crusher distance19 (validated debug fields), barrels at(8,6),(-8,-6),(6,-8). Warnings/damage/caps unchanged. Debris fade and plume shaping are presentation-only. Seeded world layout remains shared between simulation/rendering. Normal-stat bot was updated to spend a spare dash for gap-closing when Boost is unavailable; after restoring original base Pulse, pursuing a fleeing Thrower exposed a2.05s gap. This uses normal player intents, not altered stats or a relaxed two-second assertion.

Moving catalogue retains named outer cars/containers/conveyors/gears/cranes/haulers/meteors in three depth bands. Six near kinetic assemblies/outer rotors, smoke/embers, cosmetic bob/rattle and chip/pickup motion remain bounded. The dump groups packed/batched subparts by their behavior family; it is not a claim that every vertex is a separate mesh. Further silhouette/material finish is P5.

**Not done:** P3.4 finish/owner review, final whole-polish normal-play clip/stress suite. Earlier32s normal-stat P1 clip exists; final P7 will capture the completed game. All Spirit Call/arena-reference side-by-sides stay local. The owner's sliding-square and central clutter complaints are directly addressed; generic UI and weak sound remain P4/P6.
