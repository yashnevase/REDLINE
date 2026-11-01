# CLOSE Step 4 — replaceable audio

| ID | Status | Evidence and behavior |
|---|---|---|
| CL10 | DONE | `src/audio/AudioManager.ts`, `src/content/audio-map.ts`, cue bus: first-gesture WebAudio; master/music/sfx/ui gains; ducking; 20-voice priority cap; cooldowns, pan, ±6% pitch jitter; validated swappable pack manifests; per-cue independent synthesis; music crossfades. |
| CL11 | DONE | Exhaustive typed map covers hit tiers, crit/kill, dash family, Spin/Stomp/Boost, OD entry/exit, perfect/counter/rear, pickup/repair, wave/level/boss, UI/upgrade, vent/machinery/wind/saw and heartbeat. `test/chapter-close.test.mjs`; runtime voice bounds in soak. |
| CL12 | DONE | `pnpm audio:scan`; owner theme and two battle tracks indexed locally, shuffle avoids immediate repeats when alternatives exist, boss/results fallback, pause duck, optional BPM beat callbacks off by default. No BPM is guessed for owner tracks. |
| CL13 | DONE | Speaker popover on every screen, M mute, separate saved bus sliders, pack selection, track name/skip and optional beat pulses. Settings apply before context unlock. Browser first-gesture/mute test and missing-file synthesis test. |

## Files and public builds

Owner files `theme.mp3`, `battle-01.mp3`, `battle-02.mp3` were copied from `close1/public/audio/music/` to ignored `public/audio/music/` **after** build exclusion was added. Source/rights: owner-supplied, private use, not redistributable. No Spirit Call code, SFX or commercial song was downloaded/copied; the shipped fallback synthesis is original. ASSETS records each private file.

`vite.config.mjs` disables Vite's automatic public copy for builds and copies public assets except `audio/`. The distribution gets an empty music manifest; `validate-build.mjs` rejects any audio file extension in dist. Gitignore alone is not the deploy safeguard. Default builds work using synth ambience/effects without private files. Never publish the private folders.

Create a private sound pack at `public/audio/packs/<name>/manifest.json` with `{ "cues": { "hit_light": { "variants": ["/audio/sfx/example.ogg"], "volume": 0.12, "cooldown": 0.06 } } }`. Choose its name in Sound settings. Missing or invalid files fall back per cue. Alternatively edit the one typed audio map. Put owner music in `public/audio/music/`, run the scan, then optionally annotate BPM/loopStart/loopEnd in the ignored manifest. No installation or account is needed.

## Evidence and limitations

130-test check and production exclusion validation pass. Four-size browser smoke verifies unlock and mute. The ten-minute soak loads the three private tracks, changes encounters and exercises bounded synth voices; output master is zero during automated soak. Functional QA also routes all audio files absent and verifies active synth fallback. Optional beat visuals stay off, so no beat synchronization is claimed without a track BPM. Hearing/mix preference remains owner review.

Tunables are in the typed map and saved audio settings; rendering budgets are unchanged by audio. No new dependency or external network service. **Not done:** owner listening review, not fabricated by automated tests.
