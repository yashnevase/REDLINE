# P2 — equipment-specific abilities

Owner approved the P1 Core candidate and explicitly directed continuation through P2–P6 on2026-11-02. P1's owner gate is passed; no further approval is needed for the already-authorized implementation.

| ID | Status | Evidence |
|---|---|---|
| P2.1 | DONE | Base Q restores original Pulse Bash: immediate12-damage radial burst, clean ring/diamond facets, no Spin state. E/X stay Boost/Stomp. Blade-equipped Q retains three-tick Spin/pull/orbiters/auto-fire. Stunned/marked bonuses apply to both Q roles. Labels, registry, announcements, bindings, upgrades and cue routing distinguish the loadouts. |
| P2.2 | DONE | `test/p2-equipment.test.mjs`: radial hits both sides, zero base blade events/entities, legacy Core-Spin snapshot neutralization, Blade state/orbiters, synergy preservation, snapshot/replay SHA256 agreement. Browser captures assert actual blade-instance count0 for Core and positive for Blade, including Blade→Core fixture transition and real garage equip/unequip. |

133 tests/check and build pass. Controlled desktop/compact images and short equipment clips: `shots/final-p2/`; zero-instance/projectile counts in report.json. Existing tests expecting the intentionally replaced base Spin were updated to Pulse's12 damage; Blade-specific tests explicitly use Blade and isolate projectile damage. No warning, armour, perfect-dodge, cooldown or save gate was weakened.

`content/items/p2-equipment.ts` owns the P2 switch/name mapping. Existing Pulse tuning remains12 damage /2.5u /120 ticks; Blade remains24 total Spin damage /42 ticks. Upgrades affect the active Q. Original base Pulse damage is lower than the previously unintended24-damage Spin; normal-stat pacing/balance is rechecked in P7.

No new render mesh/pass/capacity: Pulse facets reuse the64-slot ability plane pool; base blade batch is explicitly reset/empty even for stale visual snapshots. Full stress budgets remain for final P7; do not call controlled screenshots a stress measurement. World/UI/audio styling in these images still awaits P3–P6.

**Not done:** no P2 requirement intentionally deferred; remaining FINAL_POLISH steps remain active. Current clips are short controlled feature captures; P1 provides the32-second normal-stat clip and P7 will refresh the final complete-game clip. Parity comparisons are local-only under `shots/parity/`; owner notes about weak sound, clutter/vents and generic UI remain assigned to their respective steps.

Shared final evidence: FINAL_P7_REPORT.md;137 tests/build,54-case graphics matrix, four-size inputs/saves/production,30+second normal-stat desktop/compact clips, all3 room captures, local final parity pairs and real ten-minute soak. Per-step measurements above remain their historical checkpoints. Owner final pairs/listening remain for review.
