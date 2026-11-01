# P4 — interface and hangar

| ID | Status | Evidence |
|---|---|---|
| P4.1 | DONE implementation; owner taste review remains | Chamfered steel plates, inner bevel lines, rivets, amber selection/launch hierarchy, licensed condensed italic titles and tabular numbers. HUD, pause/results/upgrades, missions, workshop, options and audio share the plate language. Strong ability SVG silhouettes; base Q icon follows equipment. Press/hover and ready/cooldown states retained. |
| P4.2 | DONE implementation; owner taste review remains | Larger rigid Core, smaller lit pedestal, two faint light shafts, drift particles, orbit/parallax, idle look/blink and small hop. Reduced-motion honors stillness. Screen links animate a brief exit/entry. Development scene tabs hidden. |

Missions now select a brief/reward, then use one Enter Mission action. Workshop list stays scrollable at compact size, equipment and finish controls retain their save behavior. Compact HUD health and announcements moved to separate zones. The generic scene switch is hidden; actual hangar/workshop navigation remains.

Evidence: four-size screenshots and smoke.json in shots/final-p4. Desktop mission brief and compact workshop viewed; subsequent final parity captures cover final lobby/HUD.135 tests and build pass; smoke covers all four sizes, mission navigation, locked Blade, High+AO, daily seed and gesture-unlocked mute. No simulation state or mechanics changed here. Lobby rays add two calls only to lobby/workshop, never combat. Final performance and30s normal-stat clip are P7.

Not done: owner final parity/audio acceptance; universal hardware certification. Custom icon work reuses original SVG paths with consistent stroke, rather than adding external assets. Score now eases toward earned totals (immediate in reduced motion); plate bars have a restrained end shine, and cooldown-ready flashes remain. Historical pre-P4 feature captures accidentally copied into this directory were removed; current lobby/mission/workshop/fight smoke captures are retained. Ref images are local only.

Final P7 cleanup: compact Heat ticks fit their slot, settings/pause separate, lobby plates/hints fit, and loadout controls use the steel shape. Native mission/options dialogs now offer Sound in their headers with the same mute/master/music/effects/UI panel; root-only observation avoids per-frame HUD churn. M mute works during dialogs. Four-size DOM and real keyboard/slider audits pass.

Shared final evidence: FINAL_P7_REPORT.md;137 tests/build,54-case graphics matrix, four-size inputs/saves/production,30+second normal-stat desktop/compact clips, all3 room captures, local final parity pairs and real ten-minute soak. Per-step measurements above remain their historical checkpoints. Owner final pairs/listening remain for review.
