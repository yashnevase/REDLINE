# POLISH_ROUND2 — final handoff

Two logical sessions: R1–R3, then R4–R6 with final QA. The approved blue-violet Core is retained. Source study preceded implementation; all new geometry, shaders, UI and synth cues are original REDLINE work.

| ID | Result | Report |
|---|---|---|
| R1 | Rounded plates/pills throughout; owner approved | ROUND2_R1_REPORT.md |
| R2 | Faceted role identity, damage stages, ghost/shield health bars and elite labels; owner approved | ROUND2_R2_REPORT.md |
| R3 | Saved10/3 Chill,14/4 Normal,20/5 Redline; Low starts10/3; deterministic director/elites/surges | ROUND2_R3_REPORT.md |
| R4 | Role windups/recoil, scrap collection, chain/multi-kill feedback, Rex intro/phase/defeat/trophy | ROUND2_R4_REPORT.md |
| R5 | Five vent fixtures inside frame; all static footprints outside central±12u; outer travel retained | ROUND2_R5_REPORT.md |
| R6 | Owner songs included in verified-private Git; public builds exclude audio; acceptance tag held | ROUND2_R6_REPORT.md |

## Verification

`pnpm check`:143 tests, TypeScript, source/content validation, both deterministic-simulation audits. Director vent warnings enforce≥48 ticks (default60), including debug tuning. `pnpm build` and distribution validation pass; dist contains an empty music manifest and no private audio/reference/debug assets. All three tracked songs match the owner originals byte-for-byte.

The54-case native Mac matrix covers three rooms, desktop/compact, Low/Standard/High and crowd/Rex/corner at the new caps. Conservative peaks before the last redundant flat-plane pass removal:

| Tier | Calls | Triangles | Limit |
|---|---:|---:|---|
| Low |50|21,261|70 /25,000|
| Standard |76|58,860|120 /60,000|
| High, separate |158|117,686|Optional higher tier|

Matrix p95≤18.7ms on this Mac; this is measurement, not a universal60fps claim. Final full-cap Low fallback and max-pool burst checks separately cover the final render path; the all-room fallback peaks52calls/23,241tri. Standard max burst66calls/57,886tri; Low43/22,663tri, with64 fragments/32 scrap/8 rings simultaneously. The director/capacity stays replay-stable when rendering quality drops. Sparse surviving enemies and their dying slots retain the crowd LOD; faded actors also use it. Rex Low mesh preserves finite hull/weapon bounds and restores full detail correctly.

Two36-second Normal recordings use normal player/enemy stats and scripted input, with14 active enemies, health bars, damage stages, multi-kills (up to5), chain46 and exact per-recording headless replays/SHA256. Desktop captures all three damage stages; the compact normal recording samples stages1/2, with all three compact stages separately captured in R2. Controlled feature/stress fixtures are labeled separately; they are not normal-play proof. The recordings contain no audio; original cue-listening.wav and the live preview supply the audio review.

All four clean/migrated browser missions clear with exact replays; Blade unlock/equip/reload, workshop cosmetics, JSON export/import, corrupt backup, IndexedDB fallback and absent-file synth pass. Four-size Core bounds/HUD, keyboard, simultaneous touch and emulated controller/replay checks pass. Four-size mission/options sound controls, saved four-bus sliders and M access pass. Production has no debug API/settings; touch ability, loss/retry and saved Blade pass.

Original22-cue audio burst:20-voice/four-per-cue limits, measured peak0.589 below0.94 ceiling, settles to0 voices, pause lowpass verified. Offline sampler peak0.280. Owner listening acceptance is separate.

Normal-stat fairness bot: Chill4/4 missions clear; Normal4/4 clear (Mission3 ends63HP); Redline3/4 clear, Mission3 loses at21.92s. Peaks10/14/20 and attacker caps3/4/5 hold. Alive/HP/pressure samples every simulated second and exact hashes are in final/fairness.json. This is automated evidence, not human balance approval.

Stability: real600.064-second render/simulation/audio reset soak,20 samples, zero browser errors. Post-warmup post-GC JS heap36,116,176–37,325,872 bytes (1.154MiB range); sampled maxima6 debris/29 dust/7 voices, all within caps. This measures JS heap variation, not total native/GPU memory. The subsequent warning-floor schema validation does not change the measured rendering/pool topology.

## Evidence

Own engine captures only; study comparisons remain local and unshipped.

- `shots/round2/final/normal-desktop.webm`, `normal-compact.webm`, `capture.json`.
- `shots/round2/r4/feedback-{desktop,compact}.webm`, phase/defeat/trophy screenshots and report.json.
- `shots/round2/final/map-{1,2,3}-{1280,844}.png`; R1/R2 approved captures remain under their own folders.
- `shots/round2/final/{perf,adaptive,burst,bars,fairness,functional}.json`; `inputs/`, `modal-audio/`, `production/`, `audio/`, `soak.json`.
- Reproducible `tools/round2-*.mjs`; run browser tools serially on port5201.

## Not done

Owner final overall look/feel/listening acceptance and first-time-player review remain open. R1 UI, R2 enemies and the earlier Core approval are already recorded and are not reopened. Exact reference-image parity, human balance and all-device performance are not self-certified. Physical-phone/deployment gates remain owner-waived; no Chapter2 work or public deployment was added.

The existing chapter1-complete tag is historical and remains unchanged until explicit owner acceptance. This is the only remaining requested closing action that needs that acceptance. Preserve unrelated user-owned close1/ and docs/NEXT_WORK (1).md.
