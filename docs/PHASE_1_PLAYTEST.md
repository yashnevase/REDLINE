# First Contact — Phase 1 playtest

Open the lobby at http://localhost:5199 and choose Enter Foundry, or go directly to http://localhost:5199/?scene=arena. Start the server from redline-pack with `pnpm dev --host --port 5199` if needed.

- Keyboard: WASD/arrows move; Space/Shift dash; P/Escape pause; Enter restarts the round.
- Touch: hold/drag the left stick; press the large right dash button with another finger.
- Gamepad: left stick moves; A or right bumper dashes; Start pauses.
- Move close to auto-bonk. Faster contact deals more damage. Two dash charges recharge one at a time. Dash protects for its entire 0.2 s.
- Sawlet shows its locked lunge path before charging. It can damage once per lunge. No perfect-dodge scoring or slow motion has been implemented.
- One Sawlet per round. Defeat it or lose integrity, then Fight again. No waves/upgrades/Heat/Overdrive yet.

Please judge responsiveness, dash direction, readability of the red warning, hit feedback and simultaneous touch movement/dash. The brief requires a real-phone playtest before Phase 1 closes; browser touch emulation is evidence of input plumbing, not physical-device feel/performance.

Local network: use the Network URL printed by Vite on a phone on the same network. The current Mac's previously printed address is http://192.168.29.232:5199; use Vite's current address if it changes.

Developer commands: `pnpm check` (types/lints/11 tests/content/assets), `pnpm playtest` (browser controls/results/replay/touch/gamepad emulation), `pnpm shots`, `pnpm perf`, `pnpm build`. Scene `perf-worst` is the Phase 1 one-enemy command replay, not a future full-Chapter stress test. Presentation-only scenes remain available for Core/Sawlet/effects review.
