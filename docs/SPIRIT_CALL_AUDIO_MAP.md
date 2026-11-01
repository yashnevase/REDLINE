# Spirit Call audio study and REDLINE adaptation

Studied local source: `ref/spirit-call/spirit-call-main/src/presentation/sound.ts` and `audio.ts`,2026-11-02. This snapshot explicitly uses synthesized Web Audio, pre-rendered offline after unlock: there are no cue sound-file names to copy. No reference implementation or reference recordings were reused. The following is a factual recipe inventory, not shipped code. Gains are instrument envelope gains, not measured LUFS or whole-cue levels.

| Reference cue | File(s) | Layers | Mix: reverb / heavy / interval seconds | Tone peak gains |
|---|---|---|---|---|
| uiTap | No file · offline synth takes | tone | reverb: 0.1, interval: 0.035 | 0.08 |
| uiSuccess | No file · offline synth takes | tone | reverb: 0.25, interval: 0.12 | 0.12 |
| uiError | No file · offline synth takes | tone | reverb: 0.05, interval: 0.15 | 0.1 |
| uiReward | No file · offline synth takes | tone | reverb: 0.35, interval: 0.3 | 0.16 |
| sealCrack | No file · offline synth takes | crunch, tone | reverb: 0.3, interval: 0.08 | 0.1 |
| sealBurst | No file · offline synth takes | noise, tone | reverb: 0.55, heavy: true, interval: 0.3 | 0.22, 0.08, 0.06 |
| ultimateCall | No file · offline synth takes | noise, tone | reverb: 0.6, interval: 0.6 | 0.05, 0.07 |
| ultimateRelease | No file · offline synth takes | crunch, metal, noise, tone | reverb: 0.7, heavy: true, interval: 0.4 | 0.34 |
| sealRise | No file · offline synth takes | noise, tone | reverb: 0.55, interval: 0.3 | 0.07, 0.05 |
| sealGold | No file · offline synth takes | metal, noise, tone | reverb: 0.7, heavy: true, interval: 0.5 | 0.3, 0.05 |
| sealCrumble | No file · offline synth takes | crunch, tone | reverb: 0.3, heavy: true, interval: 0.3 | 0.12 |
| victory | No file · offline synth takes | noise, tone | reverb: 0.55, interval: 0.5 | 0.07 |
| defeat | No file · offline synth takes | tone | reverb: 0.5, interval: 0.5 | 0.08, 0.08 |
| star | No file · offline synth takes | noise, tone | reverb: 0.45, interval: 0.1 | 0.09, 0.04 |
| revealAspect | No file · offline synth takes | tone | reverb: 0.5, interval: 0.3 | 0.08 |
| revealCharacter | No file · offline synth takes | tone | reverb: 0.65, interval: 0.4 | 0.085, 0.07 |
| slash | No file · offline synth takes | noise, swish | reverb: 0.12 | instrument envelope |
| thrust | No file · offline synth takes | noise, swish | reverb: 0.12 | instrument envelope |
| spin | No file · offline synth takes | swish, tone | reverb: 0.22 | 0.18 |
| wave | No file · offline synth takes | metal, swish, tone | reverb: 0.35 | 0.045 |
| hit | No file · offline synth takes | click, crunch, noise, tone | reverb: 0.12, interval: 0.03 | 0.65 |
| heavyHit | No file · offline synth takes | click, crunch, noise, tone | reverb: 0.3, heavy: true, interval: 0.06 | 0.95, 0.3 |
| kill | No file · offline synth takes | click, crunch, noise, tone | reverb: 0.28, heavy: true, interval: 0.05 | 0.85, 0.07 |
| hurt | No file · offline synth takes | crunch, tone | reverb: 0.1, heavy: true | 0.12, 0.5 |
| death | No file · offline synth takes | noise, tone | reverb: 0.5, heavy: true | 0.16, 0.6 |
| dash | No file · offline synth takes | swish | reverb: 0.1 | instrument envelope |
| switch | No file · offline synth takes | swish, tone | reverb: 0.3 | 0.08, 0.07 |
| nova | No file · offline synth takes | click, crunch, metal, noise, tone | reverb: 0.5, heavy: true | 0.95, 0.06 |
| boom | No file · offline synth takes | crunch, noise, tone | reverb: 0.4, heavy: true | 0.8 |
| throw | No file · offline synth takes | swish | reverb: 0.1 | instrument envelope |
| shot | No file · offline synth takes | tone | reverb: 0.05, interval: 0.05 | 0.07 |
| charging | No file · offline synth takes | swish, tone | reverb: 0.2 | 0.05 |
| power | No file · offline synth takes | noise, swish, tone | reverb: 0.35, heavy: true | 0.6 |
| charged | No file · offline synth takes | metal, tone | reverb: 0.3 | 0.07, 0.04 |
| block | No file · offline synth takes | click, metal, noise | reverb: 0.35, interval: 0.05 | instrument envelope |
| ignite | No file · offline synth takes | crunch, noise | reverb: 0.2, interval: 0.08 | instrument envelope |
| splash | No file · offline synth takes | noise, tone | reverb: 0.2, interval: 0.08 | 0.25 |
| sizzle | No file · offline synth takes | noise | reverb: 0.3, interval: 0.1 | instrument envelope |
| slam | No file · offline synth takes | click, crunch, noise, tone | reverb: 0.35, heavy: true, interval: 0.06 | 0.9 |
| disc | No file · offline synth takes | swish, tone | reverb: 0.15, interval: 0.04 | 0.04 |
| zap | No file · offline synth takes | click, noise, tone | reverb: 0.25, interval: 0.05 | 0.12, 0.05 |
| mend | No file · offline synth takes | tone | reverb: 0.4, interval: 0.08 | 0.12, 0.06 |
| crack | No file · offline synth takes | click, crunch, noise | reverb: 0.15, interval: 0.06 | instrument envelope |
| shatter | No file · offline synth takes | click, crunch, noise, tone | reverb: 0.3, heavy: true, interval: 0.06 | 0.8 |
| quake | No file · offline synth takes | click, crunch, noise, tone | reverb: 0.45, heavy: true, interval: 0.05 | 1, 0.35 |
| waveStart | No file · offline synth takes | tone | reverb: 0.4 | 0.14, 0.08, 0.14, 0.08 |

Shared reference mix: master0.6, reverb return0.9, heavy duck depth0.45/recovery0.18s;16 active voices,6 starts/frame, same-frame requests merged by cue and priority. Default per-cue interval0.02s when absent above. Playback pitch jitter0.96–1.04; two offline takes per requested pitch; combo step+0.067, power pitch0.85. Screen projection pans to±0.6. A generated darkening stereo impulse supplies room. This sound board has no music-bus/track/LUFS implementation; this snapshot does not provide a measured music level.

Reference event mapping: attack arc→slash, thrust/slam→thrust, spin→spin, shot→shot, disc→disc, lob→throw. Cut/blast skills→wave; plunge→dash; leap→boom; lob/barrage/totem/companions→throw/splash; vortex/mantle/lift/guard/barrier→spin/crack; elemental apply/burst/reactions→ignite/splash/zap/crack/shatter/nova/sizzle/slam. Ordinary/heavy/lethal hits→hit/heavyHit/kill, player damage/death→hurt/death; shield→block, perfect→charged, heal→mend, big explosions→nova/quake/boom.

## REDLINE mapping and mix

Every REDLINE cue remains exhaustively keyed by `CueId` in `src/content/audio-map.ts`; `src/audio/p6-synth.ts` defines original layer recipes. Optional private pack files can replace each cue via the existing validated manifest. Default variants are empty because no reference audio files exist; missing private files always synthesize. Owner music remains ignored/private and excluded from public builds.

- Hits/rear/counter/crit: body sine, short filtered crunch, metallic ring; heavy adds low thump. Kill adds falling pop and delayed clang. Spark ticks stay quiet.
- Pulse/Spin/charged release/Stomp: air onset, weight impact, metal reflection and delayed air tail. E/dash: air lead, delayed low push and short metal tail. Charge cues rise before the separately emitted release/slam.
- Overdrive/boss intro/phase/defeat: low swell plus air and delayed metal sting. Wave/last-enemy/level/upgrade/perfect/repair use distinct rising tonal accents.
- Blade saw/spin ticks use speed intensity pitch; no base-Core saw whine. Hit pitch rises with combo/style, capped1.3 before subtle jitter. Vent/wind use filtered air; machinery/heartbeat remain low and sparse. UI stays single quiet tone.
-20 grouped voices globally,4 instances per cue,≥40ms throttle; a group owns/stops all its layers. Heavy priority steals lower groups. Existing per-cue cooldown can be longer. Buffers/noise shared; ended nodes disconnected.
- Master→compressor(-16dB threshold,5:1,3ms attack/140ms release)→bounded soft limiter(ceiling0.94)→meter→output. Big cues send a little to an original0.32s room impulse. Pause low-passes the full scene at1100Hz, reduces music to25%; heavy music duck42% and banner/scene duck30%, smoothed recovery. Music track gain0.5 × saved music0.4 × master0.65 before compression; synth ambience much quieter.

Music −18 LUFS-ish is a listening/measurement target, not claimed from gain values. Private supplied tracks are not loudness-normalized here. Automated peak and spectral/voice checks appear in FINAL_P6_REPORT; owner listening remains required for taste and loudness balance.
