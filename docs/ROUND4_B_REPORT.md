# Round4 Part B — Scrap-Rex v2, difficulty and mastery
2026-11-02. Implementation/evidence handoff; owner hard-but-fair acceptance remains open. Read ROUND4_A_REPORT.md, ROUND4_AND_CHAPTER2.md and CHAPTER2_DESIGN.md.

| ID | Status | Result / evidence |
|---|---|---|
| B1 | DONE engineering; BLOCKED human targets | Four HP phases, explicit warning/active/recovery state,≥60-tick configured warnings (schema minimum48), no timer, heavy punish≥60 ticks with×2 weak spot. Per-attack hit IDs survive replay and death names the killing boss attack. Retry reuses loaded renderer/sim bootstrap. Human first-attempt≤35%,1–3losses and experienced2–3min require owner/player evidence. |
| B2 | DONE | Seven attacks: gap Saw Sweep; Slam expanding ring+locked falling circles; curved returning discs (third warned path on Redline); Roll Charge with wall bounce and≥1s exposed self-stun; staggered Trophy Barrage; sequential Vent Eruption/red light;2 Stomp-vulnerable Grinders. Phase2 Sawlets, phase3 hazards/vent/barrage, phase4 two-attack cadence+forced first Grinder summon/red arena. Normal7000HP; Core-specific boss damage factor1.4 balances its shorter reach. Normal/Chill/Redline caps remain. Diagnostic attacks: shots/round4/b/diagnostic-*.png; actual Normal all-phase clip: rex-normal-all-phases.mp4. |
| B3 | DONE engineering; human balance open | Normal default retained, recovery tempo slightly tougher (.98); mission3 and Rex produce wins/losses. Mastery goals: no-hit,3 perfect dodges, REDLINE style; stars bank the union of completed goals across runs, with validated old saves/stars preserved. Mission board shows named goals. Full seeded rates below. |
| B4 | DONE | Existing ladder/multi-kill/scrap retained; boss defeat collapse/explosion chain/trophy presentation gains30% camera pull-out. Reduced motion removes camera movement. Clip includes complete defeat/trophy. |
| B gate | BLOCKED — owner action | Owner must play Rex on Normal and judge hard-but-fair. Bot wins are not first-time-player evidence. |

## Seeded balance protocol
20 seeds (4107+i×7919), each difficulty×mission×Core/Blade:480 fresh normal-stat runs. No synthetic damage, HP gifts, deliberate failure rate or changed caps. Bot reads saved telegraphs, plans gap/line/circle escapes, uses Q/E/X, routes around barricades and avoids visible industrial/surge warnings. Original reversed boomerang dodge was fixed in the bot before final rates. JSON: shots/round4/b/bots.json; tools/round4-bots.mjs + rex-v2-bot.mjs reproduce it. All seven attacks/four phases reached; minimum newly issued warning60 ticks.

| Difficulty | M1 Core/Blade | M2 Core/Blade | M3 Core/Blade | Rex Core/Blade |
|---|---|---|---|---|
| Chill | 20/20 (100%) / 20/20 (100%) | 20/20 (100%) / 20/20 (100%) | 20/20 (100%) / 20/20 (100%) | 15/20 (75%) / 18/20 (90%) |
| Normal | 20/20 (100%) / 20/20 (100%) | 20/20 (100%) / 20/20 (100%) | 9/20 (45%) / 16/20 (80%) | 8/20 (40%) / 15/20 (75%) |
| Redline | 20/20 (100%) / 20/20 (100%) | 20/20 (100%) / 20/20 (100%) | 1/20 (5%) / 14/20 (70%) | 3/20 (15%) / 8/20 (40%) |

Normal missions:105/120 =87.5%; Rex23/40 =57.5%. Individual Normal Rex:Core40%,Blade75%; M3:Core45%,Blade80%. Normal winning Core fights150.85–186s; Blade110.9–149.3s. These are this bot/seed-set outcomes, not player skill estimates.


Campaign boss mastery starts at boss entry, excluding damage/perfect dodges from earlier missions; the regression covers this boundary. Grinder pitch continuously follows configured windup/spin speed.

Normal aggregate missions and boss targets are assessed across both loadouts; individual rows expose uneven challenge. Early missions remain easy for this bot; M3/Core remains harder than the70–90% target for an individual mission. Do not hide that in the aggregate. Human first-attempt rate remains unverified. Winning fight duration may exceed3min on some seeds; report actual range, not a universal promise. No encounter timer was introduced.

## Final verification
- `pnpm check`:153 tests pass, types/content/source validation and both Ritmo audits pass. Existing historical lint warnings remain; no new warning from Round4. `pnpm build`:passes; debug/reference/private-audio exclusion passes; existing large-chunk warning remains. Logs:review/round4-check.log and round4-build.log (local); final summary JSON is retained with evidence.
- Native M4/Metal36 stress cases (3rooms×2sizes×2tiers×crowd/Rex/corner):Low max52 calls/20,803tri (limits70/25k); Standard max77/59,112 (120/60k). Maximum p95 frame interval18.6ms in both tiers. Normal clips add a79-call peak, within Standard. This is not universal60fps certification. High is optional and outside these tier caps.
- Final Normal32s desktop/compact captures reach14 in view; latest exact coverage and source fingerprint in shots/round4/motion.json. Full Normal Core Rex seed19945 captures all4phases/all7attacks/victory, exact browser/headless replay. Screenshots and clips actually viewed through captures/extracted frames. B clip includes defeat pull-out/explosion/trophy. Recorded end time includes4.5s terminal presentation after the fight.
- Four viewport sizes (1280×720,844×390,640×360,390×844):Core bounds/HUD,16corners, keyboard/multitouch/emulated controller and replay pass. No physical-phone claim.
- Fresh and v1-migrated profiles complete all4missions through real command traces; unlock/equip/reload, JSON import/export, corrupt backup, IndexedDB fallback and missing-audio synthesis pass. Goal stars now bank across runs; older stars preserved.
- Production startup/Options/touch/loss-retry/Blade-save/no-debug checks pass. Dedicated Normal boss retry248ms (<2s), named killing attack and hidden wave header during boss pass. Base atlas adjacent-tile HSL lightness max2.42percentage points (<8); full base-atlas range6.64points, excluding intentional marks/stains. details.json records method.
- Audio stress20 voices/four per cue, peak.5834 (<.94),0settled; original offline render peak.2872. Reduced-flash/motion paths preserve warnings; capped320 impact streaks/180yard (Low72),3saws/5targets and21contact shadows cover allowed actor caps. Final heavy-streak regression verifies48particles/40%Low and≥.4u rendered length at50ms.
- Legacy saved bosses without rex state retain original behavior; new capture formatv5 identifies the changed rules. Historical command recordings belong to their pinned code revision. No cross-revision replay equivalence is claimed.


## Chapter2 pre-production (C1–C6)
CHAPTER2_DESIGN.md contains the new chapter order, swamp look bible, five Hopper roles/counters, Gulp's four phases, Frog Legs input/state contract, three missions/boss, audio plan and build/test pipeline. Five built-in imagegen candidates saved/viewed locally in art/ch2-ref/; prompts/provenance: CHAPTER2_REFERENCE_PROMPTS.md. Extra crown strokes in the Legs concept are explicitly not permission to alter the approved two-mark Core. No Chapter2 runtime, reorder migration, models, part unlock or missions shipped.

## Owner-message audit / Not done
Current owner request authorizes A/B and pre-production C. It explicitly gates playable Chapter2 on Chapter1 acceptance/reference selection. Historical Round2 acceptance does not approve Round4. Completion tag remains at its previous object, unchanged. Next: review A pair/Normal clips,15min owner play with IDs, hard-but-fair Rex judgement and3–5person PLAYTEST_SCRIPT. Only explicit acceptance authorizes tag advancement; remaining wishes go POST_SLICE_BACKLOG.md.
Not done: owner art/listening/boss acceptance, first-time-player rates,3–5person playtest, universal-device certification, Chapter2 runtime. Existing physical-phone gate is waived, not silently passed. No new deployment, SC asset/code/audio reuse or external package install. Private owner music remains excluded from public builds.
