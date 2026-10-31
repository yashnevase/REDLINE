# Chapter 1 loop — Phase 3 candidate

Play http://localhost:5199/?scene=arena . Clear the four waves and three between-wave upgrade selections; Scrap-Rex then enters with 600 HP. Your integrity, Heat and run upgrades carry into the boss encounter. No boss-stage heal is added. Losing/retrying starts a fresh run using the equipment selected before the run.

Scrap-Rex starts with chomp-lunge and summons. At 70% HP it adds the gap sweep; at 40% it adds five falling scrap targets; at 20% it enrages with faster charges/recovery and increased damage/narrower gaps. All boss warnings retain at least 0.8 seconds. Watch the wide charge lane, the open sweep sector and the five fixed landing circles. The boss occupies an engagement slot; adds still share the three-owner cap. Summons are limited by six live adds and the total live cap. Floating arms and faceted rust geometry are original project art; final character polish is deferred.

Defeating Scrap-Rex clears remaining hazards and unlocks Blade. The result offers a lobby link, retry and Chapter 2 “Coming soon”. In the lobby, choose Blade or Core before entering the next run. Blade has a floating saw attachment and replaces Q with a 24-damage, 3-u forward cleave on a 2-second cooldown. It does not hit targets behind the Core. Pulse/Q upgrades also improve the replacement Blade Q. E, X, dash and auto-bonk remain available.

Unlock/equipment/clear count save automatically on this browser/device using a validated versioned local profile. This is not run-progress resume or cross-device saving. A failed storage write shows a message rather than crashing; when saving is unavailable, the result does not offer a misleading equip-after-navigation link. Old run snapshots without loadout default to Core; old complete snapshots do not manufacture a boss reward.

## Automated evidence and limits

`pnpm check`: 36 tests, both simulation/schedule audits. Boss cases cover phase thresholds/full warning timings, safe sweep gap versus dangerous sector/dash, once-per-chomp contact, locked volley targets, summon caps, forward-only Blade, Q upgrade inheritance, actual boss reward, snapshot restore/replay and a 2,400-tick enraged-boss determinism audit. Profile cases reject corrupt/future/impossible equipment data.

`pnpm playtest:boss`: both desktop and 844×390 phone viewports passed all four phase captures, actual boss-victory unlock, clear count saved once, lobby equip, reload, Blade new run and headless replay of browser commands. The test uses high initial HP and accelerated wave/damage setup to cover UI paths. It is not proof of a normal-balance victory. Two initial capture attempts failed; a separate trace found the hero had only its original 100 HP because changing max HP does not heal. Fresh high-HP initialization corrected the test without changing normal rules.

`node tools/production-playtest.mjs`: production startup, absence of debug API/settings, touch ability, actual loss/retry and seeded-profile Blade equip/reload/ability passed. Seeded profile is an explicit production-test fixture, not an actual boss unlock test; the latter is covered by the browser full loop above.

`node tools/boss-motion.mjs`: four seconds of continuously advancing boss motion at desktop/phone sizes, plus current Blade lobby screenshots. Viewed boss warning/enrage/volley, reward, Blade lobby/fight desktop/phone screenshots, actual motion frame and Spirit Call side-by-side. No visual-parity claim.

Required human checks remain: normal four-wave + boss difficulty curve, whether sweep gaps and overlapping add warnings read clearly, whether 600 HP feels appropriate, whether Blade's direction is intuitive, physical-phone simultaneous inputs and device performance. The old Wave 4 perf report is not a fresh boss/add worst-case measurement. Phase 4 remains final visual, accessibility and performance work; do not treat this implementation as human acceptance.
