# R4 — fight and Rex feedback

Implemented after the R1/R2 owner approvals. Spirit Call choreography/reward principles were studied in SPIRIT_CALL_NOTES_R2; all code, geometry and procedural cues here are original.

Sawlet crouch/lunge, Thrower aim/recoil, Shieldsaw brace/shove, Grinder spin-up floor sparks and Whirler hot tips supplement the existing distinct hit reactions. Each kill produces bounded metal fragments, scrap travelling to the Core, a score pop and ring. Chains escalate at 3/5/10; kills within 24 simulation ticks trigger DOUBLE/TRIPLE/SCRAP SPREE, a rising cue and a short host-only slow-down. The wave finisher also slows briefly.

Rex receives a 1.5-second camera/name/light introduction, phase pulses and flying parts, then a staged collapse with eight explosions, score tally, trophy reveal and results. Initial adds wait through the introduction. Intro/defeat clocks pause with Options/pause. Reduce-motion suppresses flying pieces/camera movement; reduce-flash lowers ring intensity and disables wound flicker. Pools initialize empty in lobby/studio and reset on restart.

Validation: `pnpm check` passes 142 tests. `tools/round2-r4.mjs` verifies multi-kill, introduction, actual killing hit, hidden results during collapse, visible trophy and eventual results at 1280×720 and 844×390, with no browser errors. Viewed compact trophy and desktop/compact feedback captures. `shots/round2/r4/report.json`, screenshots and two motion recordings contain controlled feature fixtures; they are not the final normal-stat gameplay clip. Two focused tests cover deduplication, chain thresholds, pool bounds, clock pause/reset and absence of simulation mutation.

Source switches: R4_ENABLED; bounded pools64 shards/32 pickups/8 rings, Low fewer pieces. All timing is presentation-only. R5 and final crowd budgets/replays follow; owner final look/feel acceptance remains open.
