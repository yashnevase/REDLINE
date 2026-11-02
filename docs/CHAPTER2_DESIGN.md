# Chapter 2 design and runtime — Bog Moon / Hoppers
Design dated2026-11-02; runtime authorized2026-11-03 by the explicit owner answer “Accept Chapter 1 and the candidates; start Chapter 2.” C1–C6 are now implemented and in final QA. The five concepts are approved look targets; the runtime art/feel candidate still needs owner review. Prompt set: CHAPTER2_REFERENCE_PROMPTS.md; local art: art/ch2-ref/.

## Progression and identity
Foundry / Blade → Bog Moon / Frog Legs → Cloud Docks / Wing → Magma Forge / Fist → Crystal Quarry / Spike → Storm Reactor / Coil → Throne Engine finale. Existing Chapter 1 saves and unlocks remain valid; the registry records future chapter order without implementing Chapters3–6 or the finale.
Each chapter changes decisions: hop-and-dodge + slow bog; wind and narrow decks + kites; crushers and heat; reflection and shattering; conduction/chain lightning/overload; finale combines learned rules. Never recolour Foundry and reuse its encounters unchanged.

## C1 Look Bible / colour script
Purple void remains the connective world. Ground: quiet mossy grey stone (#465d56), dark wet pools (#123e43), teal water edges (#2a9d91). Acid green (#b9d94b) is sparse biological energy, amber lamps (#ffc06a) give warm wayfinding. Core stays approved blue-violet with two flat eyes/two crown slashes. Enemies are faceted/matte; no outlines. No rust tile patchwork. Reserve the lightest values for hero, warnings and punish weak spots.
Playfield: central stone route with shallow slowing pools and low lily-pad islands. Totems, ruins, logs and vines belong at rim; no collision maze. Large frog statues sit beyond the playable slab, clearly scenery. Show a deep broken rock underside, water spills and hanging roots. Peripheral mist follows the actor protection policy; spores/fireflies/bubbles never obscure the Core. Normal → pressure → chaos: green flickers and splashes grow, central value range stays quiet. Reduced motion removes drift; reduced flash dims energy without hiding warnings.
Candidate review notes: arena concepts communicate depth/palette, not exact collision layout. Boss sheet has floating detached legs and belly loop. Frog-leg concept has extra crown strokes: preserve the runtime Core's TWO marks, do not copy that drift. Enemy sheets are identity directions; owner chooses scale/silhouettes before model work.

## C2 Hoppers: original state-machine plan
The owner-authorized START values below were used for implementation and tuning; owner-specified timing/mechanics remain locked. New deterministic chapter config owns values, not presentation code.
| Role | Read and attack | Warning / punish | Counter / START proposal |
|---|---|---|---|
| Skipper | Low green orb, spring legs; lock landing point, hop in, strike, hop away | **48 ticks landing warning,36 ticks recovery,×2 punish** | Blade catches retreat; Pulse at landing. Proposed24HP, radius.65, hop4u. |
| Croaker | Tall olive drum arms; expanding pulse ring with a fixed visible gap | Proposed60 ticks warning,48 recovery | Sidestep gap, Blade range; proposed36HP. |
| Bogbulb | Round translucent spore bulbs; drops slow pools and death spores | Proposed60 ticks new-pool warning;36 recovery | Stomp clears pools, proposed44HP; pool speed.65×, lifetime6s, cap6. |
| Tongue Lasher | Narrow high orb, visible tongue coil; fixed pull line | Proposed60 ticks warning,54 recovery | Dash crossing cuts tongue, no homing after lock; proposed48HP. |
| Heavy Toad | Broad dark body, big separated legs; giant landing zone | Proposed72 ticks warning,72 recovery | Long belly punish; proposed120HP; landing radius3u. |
| Elites | Gold/amber trim, larger bar, armour or second hop | Each second landing still48+ ticks | Separate second ring; no invisible extra strike. |
RPS: chasing only with bonk is inefficient. Blade projectiles punish hop-away; Stomp owns a landing/clears bog; Pulse needs timing. Base Core remains fully playable through gap/path reading and recovery windows. No hard equipment requirement or unavoidable ranged damage.
Bounds and landing search must preserve an escape route around each warned zone. Pools change speed, never input direction. Shared live/attacker caps and low-spec caps remain; all active hazards are counted separately and bounded. Avoid simultaneous unavoidable tongue + landing + ring overlaps.

## C3 Bogtyrant Gulp — four phases, six attack families
Huge frog orb; large floating leg parts; drum-skin belly. Hop-away kiting moves the punish target rather than constantly chasing the hero.
| Phase | Attacks / arena twist | Learnable punish |
|---|---|---|
|1 >70% | Leap Slam, Tongue Lash, Gulp barrage; shallow edge pools | Belly opens after Leap Slam for≥60 ticks,×2. |
|2 ≤70% | Drum Call adds Croakers + expanding gap rings | Drum recovery and exposed belly; bounded adds. |
|3 ≤40% | Bog Flood spreads from edges, safe islands shrink | Warn every flood step≥48 ticks; connected escape path survives. |
|4 ≤20% | Double leaps and two-attack chains | Both landing sites warned independently≥48 ticks; final slam exposes belly; no timers. |
Gulp swallows a visible ball-sized hazard then spits fixed warned targets. Tongue shows line before pulling, dash cuts it. No target follows the player during active damage. Heavy attacks always end in a readable punish. Shared boss contract:4 phases,5–7 families,48-tick minimum telegraphs,×2 punish, no timer, named killing attack, retry under2s. Human targets remain1–3 losses/new-player first-attempt≤35%, experienced2–3min; bots do not certify these.

## C4 Frog Legs — reward contract, future runtime
Legs slot; workshop equip/unequip like Blade, saved validated part ID. X becomes aimed Leap Slam: up to8u,30 ticks airborne, invulnerable only while airborne; landing shock scales with travelled distance and briefly stuns. Direction comes from the same keyboard/touch/gamepad movement/aim abstraction; zero direction uses facing. Second Dash tap while airborne triggers one mini hop across obstacles/enemies; base Space dash remains available on ground. Keep cooldown/charge ownership explicit; no infinite re-hop/invulnerability loop.
Proposed START (not locked): X cooldown300 ticks,20–36 damage from0–8u, radius2.4u, stun30 ticks, one airborne mini-hop. Collision checks landing footprint before committing; blocked target clamps to a legal landing. Damage cannot happen during menus, and air state survives snapshot/replay. Test all eight input directions, held/tapped controls, edge/corner clamps and pause transitions. Blade+Legs combination must preserve separate Q/X ownership.

## C5 Missions and rewards
| Mission | Roster / twist | Proposed target |
|---|---|---|
|1 Lily Crossing | Skippers/Croakers; hop landing and ring gaps |14k,3+waves |
|2 Spore Basin | +Bogbulbs, slowly introduced connected slow pools |30k,4+waves |
|3 Tongue Marsh | +Lashers/Heavy Toads, mixed landing lanes |50k,5+waves |
|Boss Gulp | Four-phase boss arena, no score/time gate |Frog Legs + Gulp trophy |
Blade recommended; a Core-only skill clear remains a required bot/manual scenario. Mastery uses no-hit/3 perfect dodges/REDLINE style, distinct from completion. Trophies unlock cosmetic finishes; no chapter reward from fixture/debug previews.

## C6 Build and evidence sequence (gated)
1. Owner accepts Chapter 1 and selects/corrects the five concept references. Update local NOTES statuses; never infer acceptance from generation.
2. Add data-only chapter config/roster/part registry and save migration preserving Blade, mastery and old profiles. Update CHAPTER_PIPELINE and Look Bible. Keep Chapter1 replay path explicit.
3. Greybox deterministic pools/hops/rings/tongue/landing, then model-match each enemy against selected images (front/side/isometric; hero-scale); approved Core geometry unchanged.
4. Build arena slab/depth/prop kit and calm/pressure/chaos palette states. Capture desktop+compact screenshots/motion, target pairs and300px squint. Generated art is not a texture or proof of engine parity.
5. Map original audio pack through audio-map: croak attack calls, drum ring starts, watery landings/wet impacts, bubble/spore/pool clears, tongue snap, leg spring and flood bed. Music: swamp percussion/low drone; no copied SC audio. Synth fallback complete when files absent; owner songs keep private-build exclusion.
6. Fairness bots20+fixed seeds/difficulty/loadout (Core, Blade, Legs, combination), exact snapshot/replay, damage source/telegraph/escape/cap audits. Target70–90%Normal missions,40–60%Normal boss, report each loadout; human targets need humans.
7. Input/save/Options/retry/boss reward parity; keyboard, simultaneous touch, controller at four viewport sizes. Low≤70calls/25k triangles, Standard≤120/60k; shader warmup, bounded FX/audio, native stress and10min stability evidence. Physical-device coverage remains limited, not universally certified.
8. Owner normal-play and hard-but-fair Gulp review, then3–5person PLAYTEST_SCRIPT. No completion tag or next chapter runtime until acceptance.

## Not done / gate
C1–C6 runtime, original models/biome/audio synthesis, missions, Frog Legs and v3 profile migration are implemented. See CHAPTER2_REPORT.md for measured QA and per-loadout bot outcomes. Runtime parity/feel acceptance and human3–5person playtest remain open. The artwork is simpler than the illustrated target, not an exact-match claim. No downloaded/recorded Bog music pack, physical-device certification or Chapter3 runtime is claimed. Chapter1 acceptance tag05cff46 is preserved.


Implementation choice,2026-11-03: Leap Slam aim-line uses the nearest living enemy/locked landing target in the forward cone within8u; with no target it uses full8u facing. This gives the same assisted short/long landing control on keyboard, touch and controller; walls clamp the landing. All aim calculations are deterministic and shared with the presentation.
