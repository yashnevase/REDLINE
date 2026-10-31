# DECISIONS.md — spike results and design decisions (with evidence)
| Date | Decision | Evidence (links, screenshots, test output) | Who decided |
|---|---|---|---|


## 2026-10-30 — Phase 0 implementation
- Owner authorized dependency downloads in chat. Installed pinned project dependencies and project-local Playwright browsers; no paid services, logins, pushes or outside-project tools installed.
- Implemented original procedural scene only. Core and Sawlet identity follow the brief. No Spirit Call code/assets copied; no gameplay engine selected.
- Three.js MIT licence retained in public/THIRD_PARTY_NOTICES.txt for production distribution.
- Sim/input directories reserved for Phase 1. Current check covers deterministic layout, not gameplay replay. Current perf covers static rendering, not worst-case combat.
- Scene settings are development-only; no debug API or workbench ships. The current production app remains explicitly a visual study, with inactive layout previews for controls.
- Pending scope/rules remain pending. No implicit approval inferred from permission to download dependencies.


## 2026-10-30 — owner-directed visual revision 2
Owner explicitly requested closer camera, character polish, terrain, effects, animated 3D lobby and self-comparison to Spirit Call. Implemented an original visual revision and preview lobby; no pending gameplay design inferred approved. Brief unchanged. Camera now 30° with 0.5 squash, based on studied projection principles. No source/assets copied. See VISUAL_REVIEW.md and STATE.md for evidence and remaining gates.


## 2026-10-30 — owner accepts early visual baseline; revision 3
Owner said the early stage looks good and authorized proceeding/improving, requested a bigger area inspired by Spirit Call, and explicitly changed the hero to silver-grey with less shine. Treat the early visual direction as accepted and carry these requested refinements forward; do not ask for the same baseline approval again. This does not approve pending gameplay scope/rules or engine selection.
- Updated REDLINE_BRIEF §3 with this named owner change rather than preserving the superseded blue-violet requirement. Internal `chrome` preset key retained for compatibility; appearance is satin silver-grey.
- Expanded procedural floor footprint from ~24.65×24.65 to 47.85×47.85 u; clear channel-to-channel lane from 12.96 to 15.96 u; camera view height from 12.4 to 14.6 u, while retaining 30° elevation / 0.5 squash. Core radius .62 maintains ~8.5% screen height.
- Original low-sheen neutral matcap; sheen is exposed in development settings. No reference code or assets reused.

## Phase 1 — First Contact trial
Latest owner instruction authorizes proceeding and defers character work. Installed/pinned Ritmo 0.19.1 after successful isolated clean-install move/dash/collision/replay/browser-draw smoke; sim-only per brief. Zod validates saved state/tuning; matching source/schedule lints are in check. Implemented the locked Phase 1 verbs and one Sawlet with START tuning. Added only the retry/pause/input/HUD tools needed to playtest that round; no wave/progression/pending rules inferred approved. Physical-phone/human feel gate remains open. See STATE.md for evidence and measured limitations.

## 2026-10-31 — Phase 2 ability foundation
Owner explicitly approved the proposed 12-enemy / 3-attacker caps, full-clear + upgrade wave gate, ~12 upgrades and half-second Overdrive iframe policy. Recorded in current brief. Implemented Q/E/X, Heat/Overdrive rules, keyboard/touch/gamepad mapping, cooldown/Heat HUD and original ring feedback. 16 headless tests, check, build, existing browser playtest and ability browser checks pass. Viewed desktop/phone screenshots + reference comparison and motion frame; no actual-phone or quality-parity claim. Multi-enemy waves, remaining enemy types and upgrades are next, not represented as complete. Character polish remains deferred.

## 2026-10-31 — four-wave encounter and upgrade pool
Owner explicitly selected “Use this upgrade pool” for the twelve proposed run-only stat upgrades. START bonus sizes are data, debug-tunable and shown numerically on cards. Added a separate saved Run resource/runtime for multi-enemy progression; shared movement/ability timers are extracted into sim/hero.ts and collision into sim/geometry.ts. Preserved the existing one-Sawlet trial via ?trial=1. Projectile owners occupy engagement slots until their projectiles retire, so ranged attacks cannot bypass the approved three-attacker cap. The final wave currently ends with an explicit combat-slice result; boss/reward/save remain Phase 3. No pending perfect-dodge or hard-body systems inferred approved.

Final content audit found unreachable options in the initial deterministic offer rotation. Offers now incorporate prior choices, and an exhaustive three-selection-path test proves every one of the twelve upgrades can appear. No randomness, rerolls or persistent upgrades added.

## 2026-10-31 — Phase 3 independent preparation
Built validated local-profile storage/loadout states and original Scrap-Rex visual preview while awaiting explicit boss-phase and Blade-attack choices. No boss fight or reward grant connected yet; four-wave gameplay retains its old endpoint. 29 tests, build, profile reload and desktop/phone preview checks pass; screenshots, motion frame and reference comparison viewed. See STATE.md for pending questions.

## Phase 3 design approvals and implementation
Owner explicitly approved the proposed four HP phases and 24-damage / 3-u / 2-s Blade cleave. Boss warnings retain their full START duration in enrage. Boss occupies an attack-owner slot, summons respect six-add and total live caps, and four-wave clear enters boss instead of awarding victory. Boss defeat alone emits the Blade reward. Equipped form is fixed at run creation; profile save is host-only, with a validated versioned schema. Q upgrades also affect the replacement Blade Q to avoid dead upgrades. Boss recovery movement stops outside the Core rather than walking through it.

The browser phase-capture step failed twice. Following AGENTS.md, capture retries stopped and a separate headless trace diagnosed the setup: raising max HP did not heal the current 100-HP hero. Fresh high-HP initialization fixed the trace; normal-game healing rules were not changed. No owner permission was inferred necessary to diagnose within the already approved work.

## Phase 4 — options/accessibility and rendering pass
Added persisted user-facing motion/flash/quality controls, native dialog pause/focus isolation, larger phone HUD, focused/announced result/upgrade transitions. Shared FX geometry and bounded number textures; batched fixed actor parts while keeping animated groups. 38 tests pass. Identical enraged Rex + six-add benchmark drops 239→96 draw calls; Low p95 ~33.4 ms in headless 1×/4×/6× tests. This is not physical-phone/60fps or final-look acceptance. Character polish remains deferred. See PHASE_4_REVIEW.md.

## Phase 4 readability/transition follow-up
Found a boss warning mismatch: the old marker ignored enraged charge speed and used a separate diagonal plane rotation. Replaced it with a shared local-Z lane transform, padded for swept-body extent, and tested all diagonal directions. Increased danger-marker boundaries without changing sim. Added camera-relative occluder fading on enemy materials only, preserving the original Core and opaque hazard cues. Nonblocking banners use simulation ticks for reproducible captures; no gameplay delays added. Character redesign remains deferred.

## Startup and rendering lifecycle

Renderer warm-up rejection leaves the sim unready until an explicit user retry succeeds. Fresh-run host state (FX, trail/event deduplication, banners and frame clock) resets explicitly rather than relying only on backwards ticks. Always-textured number sprites can change maps without shader invalidation; cached textures remain bounded. No combat-rule or character changes.

## Look Lock override and safety of presentation

The owner explicitly answered yes to executing the supplied sprint with satin silver-grey Core and unchanged gameplay timing. Recorded in brief/local sprint copy. No blue-violet conversion, damage/knockback/hit-stop changes or anticipation delay. Pooled ground effects follow existing events; actor contact shadows consume detached snapshots. Prop-only vertex-colour material clones prevent shading from leaking into actors/floor. Low and accessibility controls retain reduced layers/motion.

## Sprint 2 explicit supersession
Owner answered yes to adopting Sprint 2 including blue-violet hero and gameplay changes. Brief A1–A4 now overrides older silver/no-gameplay-change/lava guidance. Perfect dodge remains pending. Main collision bounds are square; four visible low obstacles derive from shared collision data. New moves remain a separate deterministic-state implementation step.

## Reference-match approval boundary

REFERENCE_MATCH supersedes feel-based polish workflow. Owner explicitly chose 8–10% Core height; use 13.8 u vertical span and report actual horizontal widths. Candidate Core is isolated in core-studio until owner approval. Five comparisons reached; do not continue to Sawlet or claim asset approval from IoU/palette alone. Eye surrounds are tonal curved surfaces, not an inverted-hull ink outline.

## Owner-directed Core continuation

Treated latest proceed + hero improvement as authorization for another Core refinement cycle, not prior asset approval. Retained studio isolation. Softened/removed the mouth-like lower shape; used real Blender-built sockets and surface-following crown paint. Preserved a faint glow link because owner requires it even when a judge suggested removing it. Final comparison10 awaits owner asset approval before Sawlet.

## 2026-10-31 — complete all approved phases, review at end
Owner explicitly requested returning to the Markdown phase flow and finishing all phases without stopping for intermediate approval. Recorded as a supersession in the brief. Core refinement 10 may be promoted and later assets integrated; comparisons and fresh visual review remain evidence, not self-issued owner approval. Implemented Sprint 2 dash family and Blade specials. Double-tap reuses the first paid tap's charge; no second charge is required for one Rush gesture. Pending perfect dodge/hard-body/rerolls and beyond-Chapter-1 work remain excluded.
