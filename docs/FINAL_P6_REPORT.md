# P6 — mechanical fight mix

| ID | Status | Evidence |
|---|---|---|
| P6.1 | DONE study/adaptation | SPIRIT_CALL_AUDIO_MAP.md inventories every reference cue, layers, gains, mix intervals, global limits, pitch, screen pan and ducking. The actual snapshot uses synth recipes, not sound files. REDLINE uses original synthesis and optional private pack overrides; absent files remain playable. |
| P6.2 | DONE implementation | Body+metal+air impacts; heavy sub thump; kill pop/clang; layered abilities and separate charge/release cues; style/combo pitch, Blade-only speed whine, tiny spark ticks, OD sub, vent air, last-enemy accent and boss stings. |
| P6.3 | DONE implementation; measured test below | Compressor and bounded soft limiter, screen-projected pan, grouped20-voice global/four-per-cue cap,≥40ms throttle, big-hit room send, smooth music duck, pause lowpass. Quiet UI and persistent corner controls remain. |
| P6.4 | Owner listening pending | Original cue sampler below and normal-play clips in P7. Approval by ear cannot be automated. |

Browser missing-file test:111 cue starts/1169 throttled or budget-dropped in deliberately excessive burst;20 active groups max and0 after settling. Post-limiter measured peak0.553 at full master/SFX; tested output below0.94 ceiling. Offline original sampler peak0.2805. Pause lowpass settles1100Hz. No console/page errors. Audio layers own/disconnect all their sources; shared noise and impulse are bounded.135-test/check and build pass. P7 reruns checks after final adjustments and soak for resource stability.

Listen to `shots/final-p6/original-cue-listening.wav`: hit light, heavy, kill, base Pulse, Blade Spin, Boost, Stomp charge/slam, tap dash, charged dash release, Overdrive, boss intro/phase/defeat, last-enemy, UI confirm (1.1s per cue). This sampler is original REDLINE synth, without private music. Automation validates signal/limits, not sound quality. Metadata in mix.json.

Owner checklist: impact weight/metal clarity; distinct kill; Q/E/X anticipation-hit-tail; tap/charged dash; OD sub without masking; boss sting; quiet UI; mute/master/music/effects/UI reachability; private music balance. Private source music is now measured with ffmpeg and calibrated to−18 LUFS **before user music/master sliders**: all three verified at−18.00 LUFS, true peaks−8.29/−9.49/−7.23dBTP after trim. `music-loudness.json` records source/trim/verification. Source files are unchanged; optional manifest LUFS/truePeak drives playback gain. Final mixed-output integrated loudness is not asserted from slider values. No reference sound file/code was copied. Public builds exclude private audio and use synthesis.

Tunables: audio-map cue gain/frequency/duration/jitter/cooldown/priority; p6-synth recipe layer Hz/gain/delay/attack/tail; mixer ceiling0.94, threshold−16dB,ratio5:1; room0.32s/send0.16; duck0.42/0.25s; pause1100Hz/music25%. No new sim state or save migration; audio settings schema unchanged. Final owner audio verdict remains open; P9 bounded closure records that honestly.
