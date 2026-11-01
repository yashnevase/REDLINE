# CLOSE Step 6 — QA checkpoint, 2026-11-02

This is a systems review checkpoint. Chapter 1 is **not officially closed** and no `chapter1-complete` tag is created.

| ID | Status | Evidence |
|---|---|---|
| CL17 automated checks | DONE | 130 tests, TypeScript, Oxlint, both Ritmo audits, content validation and production build. Clean/v1-migrated browser runs clear all four missions, reproduce headlessly, preserve Rex-only Blade reward, and pass equipment reload, JSON export/import, corrupt backup, IndexedDB fallback and missing-audio synthesis. |
| CL17 input/render checks | DONE for tested browser cases | Four-size keyboard/mouse zoom, simultaneous touch and emulated controller routing/replays; Core bounds and HUD separation at sixteen corners. Desktop/compact/portrait/ultrawide navigation captures. Physical input hardware is not certified; phone gate remains waived. |
| CL17 soak | DONE | `shots/close-chapter/soak.json`: 600.06 real seconds, 20 post-GC samples, no errors. Steady heap range 31,726,008–32,024,648 bytes (0.285 MiB variation); sampled maxima19 debris/17 dust/7 voices, below48/32/20 caps. Standard render/simulation resets cycle the three rooms and crowd/Rex/corner workloads with private music and fallback effects. |
| CL17 human/art acceptance | BLOCKED / unverified | Automated bots and captures cannot supply owner acceptance or first-time-player responses. Full reference-match judge still fails the world art; see outstanding work below. |
| CL18 | DONE | `docs/PLAYTEST_SCRIPT.md` contains the five questions and a 3–5-person owner procedure. The interviews have not been conducted. |
| CL19 | BLOCKED for official closure | STATE, brief execution note, reports and `CHAPTER_PIPELINE.md` prepared. Completion tag intentionally withheld while required gates remain open. |

## Rendering and final verification

54 stress cases plus18 final crowd cases: 3 rooms, desktop1280×720/compact844×390, Standard/Low/High, mixed12/Rex+6/corner. Standard maximum **92 calls /58,698 triangles**; Low **70 /24,292**; High separately **179 /115,674**. Final matrix p95≤17.8ms on this Mac. This is not a universal device performance claim. Optional SSAO is off by default and smoke-tested separately. Cached room-entry shadow work is excluded from steady counts.

The real ten-minute soak precedes final small shader/UI fixes. Subsequent tests, browser missions, input/corner captures and the18-case crowd matrix cover the foreground cutaway and corrected shell finishes; the soak is not represented as a ten-minute retest of those final changes. Latest cleanup only relocates workshop/audio controls and corrects diagnostic metadata.

The old hull estimate uses a48u×48u×6u box, not actual visible pixels. It reaches27.8% at the newly accessible outer corner. The historical ≤15% corner assertion is **not passed** or silently relabelled as passed: the corner audit now records that estimate while retaining Core bounds/HUD assertions. Actual AM hull is not globally hidden in portrait; metadata now reflects that. Foreground machinery uses a stable cutaway to keep the Core visible. Outer-edge framing remains a review concern alongside the art gate.

Production smoke passes startup/no debug API, Options, touch Spin, loss/retry and migrated Blade reload. Private audio is excluded by the build, and distribution validation rejects audio extensions. Normal builds use original synth fallback; local dev can play the three ignored owner tracks. No deployment, online service or new dependency.

## Evidence

- `shots/close-chapter/{perf,perf-final,smoke,functional,mission-runs,soak,capture}.json`.
- `shots/close-chapter/inputs/report.json`, `production/production.json`.
- `normal-desktop.webm`, `normal-compact.webm`:32-second real-time, normal-stat scripted bot footage, not human play.
- `abilities-desktop.webm`, `abilities-compact.webm`: controlled feature snapshots in motion.
- Four-size lobby/mission/garage frames, real normal-fight frames, High+AO, unlocked Satin Silver garage and expanded-edge captures were viewed. Reference-containing comparisons remain local under `art/match/close-step2/`; targets are not shipped.
- `review/close-flags-audit.log`: isolated source copy with new combat/addition flags off,2,400 ticks with matching independent replays. Default-on snapshots/replays are covered by the main tests and functional audit.

## Outstanding work and owner-message audit

**Not done:** full reference-art match; conclusive six-independent-mover normal-play proof; owner art/feel/listening acceptance; first-time-player interviews. Independent iteration7 review identifies L2 multi-level machinery/circulation depth, irregular giant/wreck silhouettes and chipped/broken-steel finish. Those are concrete art tasks, not merely a request for approval. Next work should improve and recapture those areas before seeking closure.

Shared host/schema integration spans several IDs; switches isolate the new sim features, but not every ID currently supports a standalone Git revert. Integration commits identify their IDs. Further separation is required to meet the strict per-item revert contract fully.

Owner requests retained: beyond-frame travel±21, eight opening threats,12/3 caps, longer score/minimum-wave structure, chapter-specific rust/steel world, seeded vents, varied damaged floor, living background, readable tools/upgrades/health, repair, orbitable garage, active-input hints/bindings, zoom, angle/punish/perfect combat, three missions→Rex→Blade, saw projectiles, damage wear, effects, audio, saved progression and multi-device layouts. No supplied owner request is declared removed. Exact arena fidelity remains explicitly unfinished.

**BLOCKED:** official Chapter1 closure. **OPTIONS:** continue the listed art work; use this systems checkpoint for owner playtesting. **RECOMMENDATION:** retain the review checkpoint and continue those art tasks using the existing comparisons. **NEED FROM OWNER:** eventual art/feel/listening and player-test observations; no intermediate permission is requested for already approved implementation.
