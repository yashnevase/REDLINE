# R3 — saved difficulty and deterministic pressure

| ID | Status | Evidence |
|---|---|---|
|Difficulty/caps|DONE|Saved next-run selector in Options. Chill10/3, Normal14/4, Redline20/5. New runs starting on Low use10/3; this capacity choice is recorded in replay options. In-run adaptive graphics never silently rewrites simulation caps.|
|Director|DONE|Saved pressure responds to HP/style at fixed simulation intervals, scales approach/recovery/spawn cadence, and preserves original warning lengths. Old snapshots/replays without rules use explicit legacy behavior.|
|Variety/density|DONE|Seeded armoured/fast/double-blade elites, HP/name/armour bars, extra steel blade, two-sided staggered drops, larger mission formations/goals, crossfire and retained rally. Fast elites change approach/recovery; double blade increases strike damage; armour has a Stomp/break counter.|
|Boss pressure/surges|DONE|Adds refill to phase-specific targets within the cap. Mission3/Rex receive seeded vent eruptions with60-tick warnings and once-per-active-phase damage; rings reflect saved warning/active state.|
|Fairness/replay/performance|DONE automated scope|140 checks/tests pass; browser verifies actual difficulty/Low bootstrap and records options. Dense-cap stress at all six settings: Standard max72 calls/57,366 triangles, Low47/18,607, p95≤17.6ms on this Mac. Final full-room matrix follows R4/R5.|

Evidence: shots/round2/r3/perf.json, fairness.json and six captures. Alive-over-time samples every60 simulation ticks. Normal peaks13/14/14 in Missions1–3; Redline reaches20. The baseline greedy bot clears all Chill missions, Normal1/2/Rex and Redline1/2/Rex, but loses Normal/Redline Mission3. This is reported, not hidden or labeled human balance acceptance. No player HP/damage cheat was used. Final fairness checks also assert caps, warnings, restore and exact replay.

Dense crowds retain instancing with simplified mesh LOD above12 enemies. Batched per-instance metadata carries wounds and hit flash, keeping flashes out of separate per-enemy submissions. Bars use actual elite max HP. Source data/flags: r3-difficulty.ts; director state/logic and seeded spawn code are simulation-owned. Difficulty is optional/defaulted in v2 profiles; older unlocks/cosmetics survive. Recorded run options include difficulty/capacity/director; no host RNG enters gameplay.

Not done: final all-room/R4–R5 budgets, final30-second Normal clip and owner overall feel acceptance. Low cap selection applies at run creation; adaptive quality changes LOD during an existing run. No new completion tag. UI and enemy candidates are already owner-approved.

Final follow-up after R5: the normal-stat bot now clears all four Normal missions (Mission3 finishes63HP) and all Chill missions. Redline Mission3 remains a loss at21.92s; other Redline missions clear. Exact replay SHA256 and alive/HP/pressure samples are in shots/round2/final/fairness.json; this supersedes the earlier baseline outcomes above, without claiming human balance.

The initial full-cap matrix exposed a small Standard overrun; denser mesh LOD fixes it. An extra adaptive test then caught full-cap Low + Rex exceeding25k. Final presentation fixes include a further crowd LOD for Low when an existing20-cap run drops quality, matching LOD on faded actors, a Low mesh for Rex body/arms, and keeping dying slots at crowd LOD throughout their16-tick animation. Thin transparent warning/ring planes use one double-sided pass. No gameplay cap changes mid-run. The new Rex LOD test verifies finite hull/weapon bounds, real geometry reduction and restoration of full detail. Final Low19-adds+Rex peaks23,241tri across all three rooms; a max64-shard/32-scrap/8-ring burst stays within both budgets. Full results are in ROUND2_FINAL_REPORT.md.

Final rule validation enforces a48-tick minimum on director vent warnings (default60), including when changing debug tuning; tests reject47 and accept48. This schema-only follow-up leaves the measured rendering/pool topology unchanged.
