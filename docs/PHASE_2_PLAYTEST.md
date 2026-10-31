# Four-wave combat slice — playtest candidate

Open http://localhost:5199/?scene=arena . The lobby's Enter Foundry button now opens this run. The preserved one-Sawlet regression trial is http://localhost:5199/?scene=arena&trial=1 .

Move with WASD/arrows or the left stick. Space/Shift or gamepad A/RB dashes. Q/X button fires Pulse Bash, E/B boosts, X/Y stomps. R/LB activates Overdrive when Heat is full. Touch uses the left stick and the labelled right buttons. P/Escape/Start pauses; losing focus pauses automatically. Upgrade selection works by click/tap, keyboard 1/2/3 or focused card + Enter, and gamepad A/B/Y.

Four formations use the START roster: 8 Sawlets; 6 Sawlets + 2 Throwers; 4 Sawlets + 2 Shieldsaws + 1 Thrower; 5 Sawlets + 2 Throwers + 2 Shieldsaws + 1 Grinder. At most 12 live enemies and 3 engaged attack owners, including flying rivets. Every wave must clear; choose one of three upgrades before another starts. There are three upgrade selections between four waves. Heat and chosen upgrades persist for the run. Retrying resets them.

Look for the attack warnings: Sawlet rectangular lunge path, Thrower thin fixed aim line and hot rivet, Shieldsaw wide charge path, Grinder ground ring followed by sweep. Shieldsaw takes 10% damage from its frontal 120° sector; approach from behind or use Stomp to interrupt a charge. All starting enemy values, upgrade effects and caps are exposed in development settings. No perfect-dodge bonus, hard-body dent/teeth logic or audio has been added.

The current end screen says four waves cleared. Scrap-Rex, Blade reward/equip and local save belong to Phase 3 and are not implemented. This is a Phase 2 implementation candidate, not a declaration that the human feel, final art or physical-phone gate passed.

## Evidence and limits

`pnpm check` includes both Ritmo schedule audits and headless trial/run tests. Run cases cover the engagement cap with projectile owners, fixed aim and full warnings, directional armour, Stomp interruption, all-clear upgrade gate, invalid/repeated choices, content effects, Heat carryover, snapshot/replay and isolated 0.25/0.4-second perpendicular dodge scenarios. These scenarios do not prove that every combined attack arrangement is avoidable.

`pnpm playtest:run` exercises browser UI, keyboard and touch choices, focused Enter, Overdrive and browser-command replay at desktop/landscape-phone sizes. To cover the complete UI quickly it explicitly uses accelerated debug damage/radius and high hero HP; it is not evidence of a normal-tuning human victory. `tools/run-balance.mjs` is a simple normal-tuning diagnostic bot: it reached Wave 4, activated Overdrive once and lost after 1,632 ticks / 15 hits. No tuning was changed to force a win.

Required human checks remain: simultaneous movement/ability input on a physical phone; whether warnings, projectile paths and the Core remain readable in crowds; whether front armour is understandable; whether three upgrades materially change a run; and whether the four-wave difficulty curve feels fair. Record device/browser and specific awkward attacks before tuning. Character and final effects polish remain deferred by the owner.
