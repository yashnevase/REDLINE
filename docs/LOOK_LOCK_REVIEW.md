# Look Lock visual sprint — 2026-10-31

Owner approved the supplied sprint with two overrides: retain satin silver-grey Core; keep all gameplay timing/rules unchanged. Blue-violet chrome and suggested changes to knockback/hit-stop/anticipation are excluded. The brief records this named approval. No reference code/assets copied.

Implemented: warm key/cool fill balance; lower ambient light; five-tone slabs with bevel and broad spatial falloff; procedural two-octave lava with additive floor spill; material-isolated prop vertex shading; extra edge crates/gears; instanced crowd/boss contact shadows; eight bounded layered impact slots; damage-number shadow/pop/fade; subtle movement stretch; press feedback; darker, larger HUD/control plates; damaged-only enemy health pips. Existing actor identities and locked camera remain.

The detailed animation table is only partly implemented. Enemy spawn drops, dedicated hurt eye shapes/white flashes on every enemy, gear-bit deaths, a continuous ribbon trail, Heat-arc HUD and full spring animation across all menus remain follow-ups. No claim that all ten recipes or final art parity are complete. Camera motion obeys reduced motion; impact arcs/shards obey reduced flashes; Low omits arc/scorch layers. More polish cannot justify changing combat rules.

Evidence: previous in-engine baselines in `art/targets/redline-current/`; full scene captures in `shots/`; exact five-enemy Pulse capture `shots/looklock.png`; phone capture, before/after, target comparison, three-second motion and fixture metadata in `shots/looklock/`. Fixture uses high initial HP and scripted pursuit to defeat three Sawlets, then limits damage to retain five; this is not normal-balance victory evidence.

| Gate | Status |
|---|---|
| Silver-grey satin Core retained (owner override) | Captured; final visual judgment remains with owner |
| Depth from shadows, tonal floor and falloff | Captured; owner review open |
| Lava spill onto surroundings | Floor spill implemented; vertical wall illumination still limited |
| Five distinct burst layers | Implemented disc, rings, arcs, shards, scorch and numbers; capture review required |
| HUD at 844×390 | Integrity/Heat at 16 px; other secondary text varies; physical-device review open |
| Enemies readable at 300 px | Existing distinct roles retained; no completed 300 px gate |
| 60 fps on target phone / quality recorded | Unverified; headless timings cannot pass this |
| Owner look-lock approval | Open |

One capture iteration exposed black floor/actors from globally enabling vertex colours on meshes without colour attributes. Environment-only cloned materials fixed it; subsequent desktop/phone views checked. No combat state was modified for rendering.

Validation: `pnpm check` green, 42 tests; `pnpm build` green with existing chunk-size warning (~875.8 kB JS / 236.8 kB gzip). Full-loop browser replay, Options/accessibility preferences and production startup/touch/loss-retry/Blade-save smoke passed. Final `pnpm shots` captures seven scenes × desktop/phone and motion; `tools/looklock.mjs` captures the exact five-enemy Pulse. Viewed updated before/after, Spirit Call comparison, phone Pulse and actual motion frame. Pulse reaches its existing full visual radius in 120 ms, now adjustable in workbench and covered by a regression assertion; no damage radius/timing changed.

Final HUD-inclusive enraged Rex/six-add stress matches the earlier deterministic end state. Standard 159 calls, p95 ~50.1/66.7/83.3 ms at 1×/4×/6× CPU throttle (p99 up to 116.7 ms); Low 135 calls, p95 ~33.4/50/50.1 ms. Added visual layers increase rendering cost versus the earlier 98-call build. Performance is not passed; next optimization should batch these layers before adding more effects. Report: `shots/looklock/boss-perf.json`. No real-phone/60 fps claim.
