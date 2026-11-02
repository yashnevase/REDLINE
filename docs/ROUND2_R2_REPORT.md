# R2 — enemy identity, bars and damage

| ID | Status | Evidence |
|---|---|---|
|R2 lineup/materials|DONE candidate|Original faceted rust shells with distinct silhouettes, panel seams/bolts/gear emblems, contrasting steel rings/discs, dark yellow-studded shield, amber barrel and role accents. Approved Core unchanged.|
|R2 health|DONE|Twenty-node bounded DOM pool; damaged-only role bars, white drain, two-second fade, shield segment. Projected bar placement avoids actual rendered damage-number rectangles and other bars. History resets on role/max-HP identity changes and rewind.|
|R2 damage stages|DONE candidate|100–66 scratches;66–33 localized dent/crack and wound sparks; below33 smoke/eye flicker/wobble/loose rotor. Shader-driven chips and damage on existing batched geometry; pooled heavy-hit armour fragments persist/fall/fade. Reduced-motion/flash respected.|
|R2 parity|BLOCKED owner verdict|Local shots/round2/parity/r2-enemies-pair.png compares the lineup with the approved concept. Actual fight/three stages and both sizes in shots/round2/r2. No self-approved art match.|

Pre-R3 check/build pass (137 baseline tests). Additional geometry/stage-boundary test accompanies this commit; final combined test count is recorded later. Browser verifies all five role bars in all three stages, correct fade after120 ticks, lineup and zero page/shader errors. Final density budgets and30-second normal-stat clip follow R3/R4.

Tunables: R2_ENABLED; palette and stage thresholds in r2-enemy-finish;20 smoke/64 wound sparks/24 fragment capacity; Low omits smoke and caps fragments12. Damage stages use BatchedMesh instance alpha as internal metadata and restore shader alpha to1; no extra per-enemy draw submission. Body shells80 triangles each replace smooth12×8 spheres. No simulation state/rules altered by R2.

Not done: owner enemy verdict and final raised-cap budgets. Later R3 adds elite names/max-HP to these bars. No concept/reference pixels, models or implementation copied; source study first in SPIRIT_CALL_NOTES_R2.
