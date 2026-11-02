# R5 — open center and quieter fixtures

The complete static inventory is now five vent fixtures inside the ±17u hazard frame. Four collision barricades moved from ±12u to ±19u; the three smashable barrels moved to (18,6), (−18,−6), (6,−18). Both simulation and rendering read these shared positions. Outer travel remains available to ±21u, with machinery corner protection retained.

All vent footprints are outside the central ±12u square, with at least9u separation. Their seeded placement stays deterministic. Cosmetic props remain beyond±21u. Barricade tops and barrel bodies use muted grey/brown steel; orange/red remains on heat/danger cues and outer scenery. No extra collision props were added.

`pnpm check`:142 passing tests, including a full inventory of barricades + barrels + vents + cosmetic props across300 level/seed combinations, footprint exclusion and exact layout regeneration. Movement/bank tests now target the relocated shared barricade or a clear perimeter lane. Viewed desktop/compact `shots/round2/final/map-1-{1280,844}.png`; three-room final captures and the new-cap budget matrix are recorded by round2-perf.mjs. These are actual engine renders, not target paintings.

The stricter full-object cap resolves the prior ART-06 density omission. Historical reports retain their original counts rather than rewriting old evidence. Final owner map/feel review and R6 repository/audio delivery follow.
