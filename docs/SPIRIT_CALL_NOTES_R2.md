# Spirit Call study · POLISH_ROUND2 ·2026-11-02

## Chapter 2 re-study — 2026-11-03

Revisited the local, unlicensed study snapshot for each C item. Nothing copied or imported.

| ID | Studied | Original REDLINE application |
|---|---|---|
| C1 | `presentation/hazards.ts`, `assets/arena-props.ts`, moss-crossfire target | Recess actual pools into stone geometry; quiet stone/moss ground, teal secondary mass, amber rim lights, deep rock/roots and frog monuments. Paint and water shader authored here. Geometry remains deliberately simpler than the illustrated concept; owner parity review is pending. |
| C2 | `enemy-pose.ts`, `actors.ts`, ring/gap fight targets | Role silhouettes, visible windup/flight/landing/recovery, separate gold elite trim, head-projected health lanes. Original five Hopper rigs and deterministic attacks. |
| C3 | warning/recovery poses, hazard boundaries and boss-scale readability | Six original Gulp attack families with four HP phases, bounded adds, explicit belly punish and named death. Heavy attacks retain a full warning on every repeat. |
| C4 | animation state separation and projected movement feedback | Original spring-leg rig follows its own vertical jump while the approved Core keeps its sphere and crown. Shared deterministic aim target, landing ring, finite airborne protection and one extra hop. |
| C5 | collection/challenge menu hierarchy | Separate chapter mission records; clear part reward and mastery descriptions; original Bog mission copy and unlocks. |
| C6 | `sound.ts`, `effects.ts`, hazard/actor presentation boundary | Original percussion/croak/water/wet-hit synth pack through the existing capped mixer; pooled cosmetic FX read sim state and never mutate it. Input, save, replay and native budgets are measured independently of human fun/visual acceptance. |

Reference is the local study-only snapshot under ref/spirit-call/spirit-call-main. No reference implementation or art is copied. These observations guide original REDLINE work.

| Area | Observed source behavior | REDLINE adaptation |
|---|---|---|
| UI plates | ui/kit/kit.css and panel.tsx use quiet dark translucent fills, cream text, thin light lines, selected cream rows, clear heading/body/action regions and rounded controls. Focus/press states are explicit; content scrolls independently from fixed actions. | Replace the previous cut-corner/rivet/bevel system with the owner's12–16px rounded plates and pills. Preserve readable hierarchy, existing icon silhouettes and condensed heading font. |
| Enemy health/damage | presentation/actors.ts DrawEnemies projects head positions. Ordinary bars appear on damaged enemies; champions get wider differentiated bars/phase marks. Windup tint, hit flash, stagger/break and elite color are separate signals. | Original role-colored rounded bars, delayed white drain, two-second damage visibility, shield segment, elite labels; place bars above the damage-number lane. Three original visible damage tiers with bounded pooled smoke/sparks and loose-part motion. |
| Attack choreography | enemy-pose.ts maps windup/active/recovery to normalized authored clips, including recovery after a zero-duration active clip. actors.ts ramps anticipation brightness through the warning rather than hiding the warning. | Distinct crouch/aim/brace/spin-up/hot-tip poses for each REDLINE role, release/recoil/recovery and role-specific impact reactions, driven only by saved behavior/tick data. |
| Hit/kill feel | effects.ts separates directional contact sparks, weight-dependent recoil/shake and damage numbers. Death flashes, rings and body-colored ballistic chunks have a different silhouette and lifetime from ordinary hits. | Original steel/rust particle language, every-kill scrap collection/pop, escalating chain shapes, multi-kill cues and last-enemy finish; retain readability and reduced-motion/flash preferences. |
| Boss entrance/defeat | This snapshot's champion phase markers, UI Entrance/Results transitions, staged result rewards and heavy sound recipes provide the relevant pattern; it is not a Scrap-Rex boss implementation. | Build original Rex sweep/name/dim intro, saved phase-add/vent pressure, phase-break ring/parts, weak-spot feedback and staged defeat/trophy presentation. No claim that the reference contains Rex choreography. |

R3 pressure is deterministic simulation state. Difficulty and initial device cap choice belong in saved/replayed run options; adaptive render quality must not alter an existing replay's enemy cap. Warning minima remain intact. All enemy/effect pools must be measured at the new caps, with Low instancing/LOD retained.

R6 visibility: gh CLI is unavailable. The authenticated GitHub repository API, using the already configured Git credential without exposing it, returned full_name=yashnevase/REDLINE, visibility=private, private=true on2026-11-02. Reverify immediately before any audio push. Keep deployment/build audio exclusion regardless of repository visibility. Existing chapter1-complete is historical; do not replace or create a new acceptance tag without the owner's new look/feel approval.


## Round4 re-study — 2026-11-02
Study-only snapshot, no LICENSE: no code, art or sound copied.
| ID | Revisited source/target | Application in original REDLINE code |
|---|---|---|
| A1 | effects.ts dust/stone layers; combat-lava-swarm | Keep low-opacity scenery behind actors; apply world-distance and projected actor protection to every smoke pool. |
| A2 | enemy-pose.ts and combat crowd | Role silhouette/value blocks must survive a small grayscale view; identity before incidental damage details. |
| A3 | combat-stone-lightning / moss-crossfire | Broad quiet ground zones support actor/telegraph contrast instead of alternating high-contrast tiles. |
| A4 | effects.ts directional heavy-hit sparks / gravity chunks | Original bounded velocity streaks, hot cooling colour, bounce and chips; independent of damage simulation. |
| A5 | effects.ts environmental particles and layered fight target | Seeded edge activity, sparse independent rhythms, actor-safe cosmetic layers. |
| A6 | sound.ts layered metal/noise and priority limits | Original synth layers and existing voice limiter/pan; no reusable licensed SC sound assets available. |
| B1 | enemy-pose.ts windup/active/recovery | Explicit warning/active/punish states; later patterns increase composition, never reduce minimum warning. |
| B2 | combat-lava-aoe/wind readable rings/gaps | Distinct original seven-attack telegraphs and persistent returning hazards. |
| B3 | challenge/menu goals and attack readability | Separate skill mastery goals from mere completion; report measured seeded bot outcomes, human targets unverified. |
| B4 | effects.ts layered defeat events | Retain ladder; ordered slow/pull-out/explosion/trophy presentation. |
