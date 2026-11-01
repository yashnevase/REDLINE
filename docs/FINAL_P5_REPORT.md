# P5 — steel, depth and readable impacts

| ID | Status | Evidence |
|---|---|---|
| P5.1 | DONE implementation | Removed the repeated brown bitmap overlay; cooler plate atlas, sparse edge wear, quiet central lanes. Neutral steel replaces muddy brown slab tint. Rust stays on authored machinery/enemy accents. |
| P5.2 | DONE implementation | Soft three-band actor/prop light, restrained cool view rim, warm key/cool fill, existing plate AO/bevels/contact and cached sun shadows. High AO defaults on fresh desktop preferences and remains optional; auto tier can fall back. |
| P5.3 | DONE implementation | Base Q has layered ring/facets, Blade retains original steel silhouettes. Enemy hit flash reduced0.7→0.32; screen speed streaks restricted to Dash/Boost/Overdrive. Existing timed warning/impact/tails retained. |
| P5.4 | DONE implementation | Enemy paint reduced to deliberate marks; removed uniform speckles/matcap grain. Existing bevel/rivet forms retain silhouette rather than being washed out by hit flash. |
| P3.4 | DONE bounded iteration; owner art verdict open | L2 lower terraces, descending stairs, motors/supports and light strips join pit geometry. L3 varied joints and sparse broken edges. Giants gain asymmetric saw arm/back silhouette; hauler gains fins/thrusters. All original geometry, merged batches. |

135 tests and production build pass. Four-size interface/High+AO smoke passed without shader errors. Viewed clean fractured-deck desktop screenshot (shots/final-p4/fight-desktop.png); final P7 captures refresh all rooms and parity. These screenshots were taken after P5, so P4 evidence also shows the new world.

Tunables: layer rim/band strength in p5-finish.ts (P5_ENABLED), sparse atlas marks in am3-surface; L2 extra structures Standard/High only; Low keeps existing pit LOD. No new combat material submission from the shading finish; merged geometry adds triangles. Final P7 measured budgets take precedence over baseline claims. Normal-stat clip is captured in P7.

Not done: exact reference reproduction or owner final art approval; no such approval is self-certified. Private refs never ship. Remaining art wishes after the third session belong in POST_SLICE_BACKLOG per P9, rather than restarting an IoU loop.

Shared final evidence: FINAL_P7_REPORT.md;137 tests/build,54-case graphics matrix, four-size inputs/saves/production,30+second normal-stat desktop/compact clips, all3 room captures, local final parity pairs and real ten-minute soak. Per-step measurements above remain their historical checkpoints. Owner final pairs/listening remain for review.
