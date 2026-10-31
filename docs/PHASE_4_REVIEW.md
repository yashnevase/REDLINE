# Accessibility and rendering finish pass

Open Options from lobby or combat. Preferences save locally in a separate version-1 record. Reduce motion defaults to the OS preference when no saved setting exists and disables camera shake/zoom pulses, idle rocking and cosmetic rotor/trail movement. Reduce flashes removes white hit flashes/shards and lowers burst-ring opacity. Damage numbers and attack warnings remain. Low graphics caps the render scale at 1, reduces ambient/spark counts and uses fewer hit shards; gameplay/simulation timing is identical.

The native modal pauses combat, contains keyboard focus, isolates gameplay shortcuts and returns focus to its opener. Closing leaves the fight paused for an explicit resume. Upgrade/victory/defeat screens focus an actionable button and announce major transitions via a polite status region. Phone HP/Heat/wave/boss labels are larger. These are tested improvements, not a comprehensive screen-reader/WCAG certification.

Fixed enemy/boss parts are merged by material in their owning group's local coordinates. Independently animated rotors and enrage cracks remain separate. Geometry tests verify world-space bounds and retained animated subgroups. Bounded active instancing avoids submitting zero-scale particles. Combat rings share prebuilt geometry, and the floating-number texture cache is capped at 64 unused/live entries while protecting currently displayed maps.

## Evidence

- `pnpm check`: 38 tests; both Ritmo schedules/source/content validation green. No gameplay rules changed.
- `pnpm playtest:options`: desktop/844×390 phone viewport, 2× device scale; pause while open, keyboard isolation, Escape/focus return, save/reload, native OS preference default and exact low-resolution canvas size passed. One first script attempt incorrectly looked for Resume after its own debug restart; removing that test-only assumption fixed it.
- `pnpm perf:boss`: deterministic 1,553-tick setup reaches an enraged 100/600-HP Rex and six live Sawlets. High initial hero HP and near-zero outgoing damage explicitly retain the load. At the measured end tick, both reports preserve the same HP/AI/events. This is a boss/add stress scenario, not all 12 threats or a real phone.
- Before actor batching: 239 calls / 57,788 triangles. After: 96 calls (~60% fewer), 57,116 Standard / 56,924 Low triangles. Standard canvas 1266×585, Low 844×390 at an emulated 844×390 viewport with 2× device pixel ratio.
- After batching, Standard p95 at 1×/4×/6× CPU throttle is approximately 50.1/50.1/50.1 ms; Low p95 approximately 33.4 ms at all three rates. Low p99 is 33.5/50/50 ms. Standard p99 still reaches 66.8 ms at 6×. The headless setup does not demonstrate 60 fps; physical-device performance remains open.
- Before report: `shots/options/boss-perf-before-batching.json`; after: `shots/options/boss-perf.json`. Options screenshots/reports/video: `shots/options/`. Current boss motion and lobby captures: `shots/boss/`.

Human work remains: actual-phone simultaneous controls, text/telegraph/crowd readability, normal run/boss balance, full screen-reader pass, final art comparison and device frame pacing. Character polish remains deferred by the owner. No new pending mechanics or reference art/code introduced.

## Readability and transition follow-up

Charge warnings now use one shared floor-lane transform instead of separate plane Euler angles. Tests cover all four diagonal directions. Scrap-Rex's marker includes its enraged speed multiplier and body extent; enemy/projectile lanes include their own body padding. This fixes the previous boss marker's normal-speed length and diagonal alignment mismatch. Charge edges, Grinder rings, sweep rims and falling-scrap circles are more distinct. These are warning markers, not character outlines; combat timing and collision rules are unchanged.

Only enemy surfaces that are both nearer the camera and overlap the Core's projected silhouette become translucent. Other enemies retain their normal materials, and warning markers remain opaque/readable. Material clones are owned by the bounded actor pools; original shared materials stay unchanged. The boss is included in this visibility treatment. This helps the Core remain identifiable inside crowds without changing its design.

Wave/boss/Overdrive banners last 75 simulation ticks (1.25 s), accept no pointer input and add no gameplay delay. Result/upgrade overlays fade in; reduced motion removes the animation/slide. Major state announcements remain available to screen readers. Combat roster now accurately labels equipped Blade.

`pnpm playtest:readability` captures the wave banner and crowded enraged charge/sweep/volley at desktop/phone sizes, records continuous motion and generates a Spirit Call side-by-side. Debug stress setup retains six adds; it is not a normal-balance victory. `test/lane-warning.test.mjs` and `test/occlusion.test.mjs` add alignment/full-travel/occlusion/material-isolation checks. Total current checks: 41 tests. User/device and final-art acceptance remain open.

Latest readability follow-up benchmark: end frame 98 calls with added warning edges; Standard p95 ~50.1 ms at 1×/4×/6×, Low ~33.4/33.4/50 ms. Low 4× p99 includes a 100 ms outlier. This supersedes the earlier timing summary for the latest build; performance pacing still needs investigation on a physical device. Build, 41-test check, browser full-loop replay and production Options/Blade smoke pass.

## Startup / restart follow-up

Added retryable warm-up loading instead of an unhandled rejection and indefinite loading. Startup capture injects one warm-up rejection into the dev module, checks tick zero/focused retry, then verifies successful readiness and repeated new runs at both viewport sizes. Explicit FX/banner resets cover restart at the same tick. Damage sprites no longer invalidate shaders each frame; regression tests verify map switching and reset behaviour. 42 tests pass; browser full-loop replay and production smoke pass. Current screenshots/report: `shots/startup/`; current crowded motion/target comparison: `shots/readability/`.

Performance measurement now includes HUD work, and separates synchronous step/render/HUD timings from rAF pacing. Earlier reports excluded HUD; use `shots/options/boss-perf-with-hud-before.json` for this pass’s baseline. Low synchronous work does not prove a GPU bottleneck; headless pacing and real-device acceptance remain open.

Latest HUD-inclusive after report (`shots/options/boss-perf.json`) matches baseline end state/events and 98 calls. Standard p95 50.1/66.7/66.7 ms at 1×/4×/6×; Low 50.1/50.1/50.1 ms. Standard 1× p99 100 ms. This run is slower than the baseline and does not demonstrate a frame-rate improvement from avoiding material invalidation. Unthrottled median synchronous step/render/HUD: Standard ~0.1/0.5/0.1 ms, Low ~0.1/0.6/0.1 ms. Headless rAF results remain variable; no 60 fps or physical-device acceptance.
