# SLICE_LOCKED_DECISIONS.md — owner-approved decisions for the Chapter 1 vertical slice
> **PRECEDENCE: this file wins over every other doc** except where `DESIGN_BIBLE.md` §24 (v4 overrides) fills a gap it marks OPEN or PROPOSED. Converted verbatim from `REDLINE_Chapter_1_Vertical_Slice_Design_Document.docx` (owner, 2026-10-30). Reference-image file names in §12 map to the files in `art/` via `art/README.md`.

# REDLINE: Chapter 1 Vertical Slice Design Document

Oct 30, 2026 · @yash

## 1. Purpose and status labels

This document records every decision locked for the Chapter 1 vertical slice, so the core doc can be updated and the build agent can work from one source.

Status labels used throughout:

- **LOCKED**: the owner approved it; change it only by a new decision.

- **FIX BEFORE BUILD**: approved, but the reference art needs the named correction.

- **PROPOSED**: suggested and not yet confirmed.

- **OPEN**: undecided.

Every section gives purpose, decision, pros, cons and fixes. The slice covers the hero, four enemies, one boss, one arena and the HUD. Audio, chapters 2 to 6, the lobby, skins and final attachment art are out of scope. Reference images are indexed in section 12; place each one beside the section it supports.

## 2. Game charter

REDLINE is a fast, easy-to-learn isometric arena action game: you play the Core, a hard chrome ball, fight waves of rival spheres, beat a boss each chapter and win its ability as a bolt-on part. **LOCKED**

| Item           | Decision                                                                                               |
|----------------|--------------------------------------------------------------------------------------------------------|
| Genre and feel | Arena action; Spirit Call and Brotato for readability, Need for Speed: Most Wanted for speed and boost |
| Audience       | All ages, no gore                                                                                      |
| Platforms      | Phone (touch, landscape), keyboard, gamepad; real-time 3D in the browser                               |
| Camera         | Fixed isometric, about 45° yaw and 50° pitch; the Core is 8 to 10% of screen height                    |
| Core loop      | Move, auto-bonk, dash, use three abilities, build Heat, trigger Overdrive, beat the boss, win a part   |
| Worlds         | Six cultures and biomes, six forms, a stone-paper-scissors matchup wheel, a final Throne Engine        |
| Audio          | Out of scope for now                                                                                   |

Design pillars, derived from the brief: readable at a glance; speed and Heat; the hero is a hard ball; parts are progression; one world, one style. **PROPOSED**

**Pros:** one-thumb controls; all ages; a hero readable at tiny size; a face language no other game uses.

**Cons:** a sphere-only roster limits variety; the Spirit Call feel cannot be promised before playtests; Heat and Overdrive glow must be faked on low-end phones.

## 3. Story and world

The story in one line: a giant Engine stalled at its redline long ago, six cultures grew around its broken pieces, and the Core, the one piece still running, wakes up to restart it. **LOCKED**

1.  A giant Engine stalled at its redline long ago, and six cultures grew around its broken pieces.

2.  The Core is the one piece still running, a spare that wakes up.

3.  Each boss holds a piece of the Engine. You bolt it on and gain its ability, until you reach the Throne Engine and restart it.

| Chapter | Culture      | Biome             | Who they are                    | Form won |
|---------|--------------|-------------------|---------------------------------|----------|
| 1       | Grinders     | Foundry Scrapyard | Hoarders who sharpen everything | Blade    |
| 2       | Skyfarers    | Cloud Docks       | Wind traders                    | Wing     |
| 3       | Hoppers      | Bog Moon          | Swamp chorus                    | Frog     |
| 4       | Hammerkin    | Magma Forge       | Forge priests                   | Fist     |
| 5       | Facets       | Crystal Quarry    | Diamond monks                   | Spike    |
| 6       | Arc-Choir    | Storm Reactor     | Lightning singers               | Coil     |
| Finale  | All cultures | Throne Engine     | Everything combined             | None     |

Chapter 1 beats, **PROPOSED**: the Core wakes in the scrapyard; Grinders swarm the shiny intruder; Scrap-Rex, who hoards trophies, guards the saw piece; the Blade you win is forged from the Core's own hardened metal, so unlike enemy blades it does not snap. The lore wording for the Core as the Engine's spare flywheel bearing is also **PROPOSED**; the gameplay rule it supports is locked in section 5.

**Pros:** gives every part and boss a reason; ties the name REDLINE, Heat and the chrome hero into one idea; works as a short text intro.

**Cons:** six chapters is a big promise for a small team; the story must be told through art and a few lines, not cutscenes.

## 4. The hero: the Core

The Core is a perfectly round blue-violet mirror-chrome sphere whose whole personality lives in two flat white eye shapes. **LOCKED** (reference: the 30-cell state sheet, saved as CORE_LOCKED_v1)

| Element    | Decision                                                                                                                                                |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Body       | Perfect sphere, mirror chrome with lavender reflections and subtle panel lines; the only mirror object in any scene                                     |
| Face       | Two plain flat white shapes; no pupils, eyebrows, mouth or nose; expression by shape change                                                             |
| Sockets    | Flush round plates on both sides and the back; attachments float beside the ball, joined by a faint glowing link; the back socket emits the boost flare |
| Underside  | Clean, no hole (the mouth-like hole was removed)                                                                                                        |
| Heat marks | Two thin red slashes high on the crown, away from the face, visible from the isometric camera; they glow with Heat                                      |
| Colour     | Blue-violet chrome only                                                                                                                                 |
| Banned     | Ring or belt line (it read as a grin and looked like a Poké Ball), legs, arms, backpack, headphones, antenna                                            |

### Expression map

| Eye sheet shape            | Meaning                    | Game use            |
|----------------------------|----------------------------|---------------------|
| 1: two circles             | Neutral, surprised         | Idle, pickups       |
| 4: small upright triangles | Alert, focused             | Targeting           |
| 5: slanted half-triangles  | Angry                      | Combat              |
| 6: rounded slants          | Determined, smug           | Dash, perfect dodge |
| 8: sharp triangles         | Furious, blazing           | Overdrive           |
| 10: big and small circles  | Hurt, confused, dizzy      | Hit reaction        |
| 12: sleepy arcs            | Sleepy, happy, knocked out | Idle, victory, KO   |

The state sheet adds stunned bars, sad droop, worried lids, a wavy scared squint and flat smug lids. Build all of them as shader shape morphs. **PROPOSED**

### States on the locked sheet

| Group       | States                                              |
|-------------|-----------------------------------------------------|
| Movement    | Rolling, floating, dashing, idle bob                |
| Attacks     | Bonk, stomp attack, heavy slam, jet-boost           |
| Part states | Spiked, saw-blade deployment, electrified, shielded |
| Heat tiers  | Cold, warm, overheated, Overdrive                   |
| Damage      | Damaged (dents and glowing cracks), knocked out     |

**Pros:** shape-only expressions are cheap and read at thumbnail size; no limbs means cheap animation and floating parts; the body is identical in every state; the face language is unique.

**Cons:** the body reads as glossy purple plastic more than chrome (**FIX BEFORE BUILD**: use a matcap in 3D); the silhouette is a plain circle, so identity relies on eyes, size and attachments; the slashes vanish in some state cells; Overdrive glow is faked on phones.

## 5. Hero logic: a hard body, brittle blades

The Core is hardened metal that cannot be cut; enemy blades chip and snap against it, and spin speed decides how much. **LOCKED**

Why players will believe it:

- The hero is the only mirror-hard object; enemies are rough rusted scrap with brittle teeth.

- Contact feedback shows the result: sparks, teeth chipping off, the Core unmarked, and a smug-lid face. **PROPOSED**

- Rolling or dashing into a blade snaps teeth in proportion to speed, and Heat raises speed. **PROPOSED**

- Enemy health shows on the body: the Sawlet's ring loses teeth, the Shieldsaw's shield dents, the Grinder's wheels crack. **PROPOSED**

How enemies still threaten, **PROPOSED**: impact, knockback, stun and Heat loss rather than cuts. The Core's damage stages are dents and cracks, never slashes. Grind sparks stay yellow-white so they are never confused with orange-and-white attack warnings.

Reward link, **PROPOSED**: the Blade attachment won from Scrap-Rex is forged from the Core's own metal, which is why it cuts where enemy blades snap.

**Pros:** a believable reason a bare body beats blades; speed becomes the skill; no health bars needed for enemies; the Blade reward feels earned.

**Cons:** if saws cannot hurt, threat must come from elsewhere or fights go soft; players may feel invincible; each later culture needs its own reason (spikes, lightning, slams); the contact feedback must be very clear to land.

## 6. Combat and game rules

Fights are simple to read: one thumb moves, the Core bonks automatically, and every enemy attack is warned in advance. **LOCKED** (values from the concept brief)

| Rule         | Decision                                                                                                                                                                                          |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Move         | One thumb; the Core rolls, squashes and stretches                                                                                                                                                 |
| Basic attack | Automatic bonk on the nearest enemy: short lunge, squash, ring spark                                                                                                                              |
| Dash         | Brief invulnerability, stretch and ribbon trail; dashing through a hit at the last moment is a perfect dodge with a slow-mo flash                                                                 |
| Abilities    | Q, E and X with cooldowns of 2 s, 3 s and 4 s; defaults are Pulse Bash (ring shockwave), Boost Burst (jet flare from the back socket) and Stomp (squash slam and ground ring); parts replace them |
| Heat         | Rises with kills and clean dodges, falls when hit; four tiers: cold, warm, overheated, Overdrive                                                                                                  |
| Overdrive    | At max Heat: speed streaks, radial blur, field-of-view kick, chromatic edge, white-hot slashes, blazing eyes                                                                                      |
| Telegraphs   | Every attack warns at least 0.4 s; heavy and boss attacks at least 0.8 s; eyes flash a warning colour and an orange-and-white ground decal brightens to lock; no timers, no surprise damage       |
| Limits       | Maximum 12 enemies on screen; spawn rings show 0.5 s before enemies appear                                                                                                                        |
| Matchups     | Soft wheel, x1.3 against a beaten form and x0.85 against a beating form; visible from Chapter 2 because Chapter 1 has only Blade enemies                                                          |

Colour roles: the Core is the only mirror chrome; enemies are rough painted metal in biome colours; attack warnings are orange and white with sharp edges; pickups are mint green; neon signs are pink or violet-blue and sparse.

Chapter 1 tactics: hit the Shieldsaw from behind, dash through the Grinder's sweep, sidestep the Rivet Thrower's arcs. The first part won, the Blade, replaces Q. **PROPOSED**

**Pros:** fair and readable; fights are interesting before any part exists; Heat gives a clear reward loop.

**Cons:** the numbers (health, damage, speeds, Heat rates, waves) are **OPEN**; the matchup wheel is invisible in Chapter 1 unless a guest enemy of another form is added (**OPEN**); keyboard and gamepad feel need testing.

## 7. Chapter 1 enemies

Four Grinder enemies teach four tactics, and all of them read at a glance as matte rusty balls with narrow crimson triangle eyes. **LOCKED** with one fix

| Enemy         | Look                                                            | Behaviour                  | Counter                              |
|---------------|-----------------------------------------------------------------|----------------------------|--------------------------------------|
| Sawlet        | Small rusty ball with a spinning saw-tooth ring like a hat brim | Fast dash                  | Time a bonk at speed; teeth snap off |
| Rivet Thrower | Short cannon snout on one side, rivet drum on top, no mouth     | Throws rivets in arcs      | Sidestep the arc                     |
| Shieldsaw     | Ball behind a big scrap shield, saw ring on its back            | Advances behind the shield | Hit it from behind                   |
| Grinder       | Larger ball with two huge counter-rotating saw wheels           | Slow wide sweeps           | Dash through the sweep               |

Shared language: rough matte painted metal, glowing crimson triangle eyes, an invented gear-and-tooth sigil, no mouth, and the hero as the only shiny object. A kill pops into gear bits and sparks in the enemy colour. Each damage state shows broken teeth as separate pieces.

Proposed eye families for later cultures, **PROPOSED**: Grinders narrow sharp triangles, Hoppers wide half-circles, Hammerkin heavy rectangles, Skyfarers tall ovals, Facets diamonds, Arc-Choir zigzag bolts.

**Pros:** silhouettes differ at 64 px; matte against shiny gives strong contrast; each shape tells its role; every attack has a counter.

**Cons:** **FIX BEFORE BUILD**: red eyes on brown rust may vanish at 32 px, so give them a white-hot core; the Rivet Thrower's drum reads like a bucket; telegraph, spawn, kill-pop and damage art are not yet generated; four blade enemies are limited variety.

## 8. Boss: Scrap-Rex

Scrap-Rex is a huge rusty armored ball that hoards scrap trophies and is the chapter's single big test. **LOCKED** with one change

| Item       | Decision                                                                                                                          |
|------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Look       | Huge matte rusty ball, enormous scrap arms, one toothy saw-jaw arm, huge glowing crimson eyes, scrap trophies hanging on the body |
| Telegraphs | At least 0.8 s for heavy and boss attacks, with ground decals                                                                     |
| Reward     | The Blade attachment, which replaces Q                                                                                            |
| Budget     | 6k triangles or fewer                                                                                                             |

| Phase | Attacks                      | Look                                    |
|-------|------------------------------|-----------------------------------------|
| 1     | Chomp-lunge                  | Calm                                    |
| 2     | Saw-sweep with a ground ring | Calm                                    |
| 3     | Falling-scrap volleys        | Calm                                    |
| 4     | Enraged final phase          | Steam, glowing red cracks, blazing eyes |

**FIX BEFORE BUILD:** the concept sheet gives him legs and jointed arms. Use floating arms and no legs, matching the hero's part language and avoiding a skeleton rig. **PROPOSED**

**Pros:** the scale test beside the hero works; calm and enraged are clearly different; the silhouette test holds.

**Cons:** legs and chains add rigging and detail beyond the budget; the saw arm reads as a real chainsaw, so keep it jaw-like with chunky teeth; the exact phase order and health are **OPEN**.

## 9. Foundry Scrapyard arena

The arena is a floating dark-purple slab in deep space, with props only at the edges so the middle stays clean for fighting. **LOCKED** with fixes

| Item               | Decision                                                             |
|--------------------|----------------------------------------------------------------------|
| Palette            | Dark purple slab, rust, steel, crimson, neon pink                    |
| Frame              | Violet neon edge lights, galaxy sky, floating neighbouring platforms |
| Props (edges only) | Scrap heaps, gears, pipes, crates, a saw sign                        |
| Hazards            | Falling crates with orange warning circles; conveyor strips          |
| Spawns             | Ground rings 0.5 s before enemies appear                             |
| Rules              | Clean empty middle; no faces on props; no text in the art            |

**FIX BEFORE BUILD:** remove the eyes on the sign, crates and corner bolt, or players will mistake props for enemies; remove the leaked text on the sign.

**Pros:** strong contrast with the shiny hero; the neon edge frames the play area; the same framing will carry across all six biomes.

**Cons:** the edge lights are bright enough to compete with the fight area; the two floor grates in the middle must stay flat and low-contrast; hazard, telegraph and pickup art is not yet generated; neighbouring platforms are plain.

## 10. HUD

The HUD uses dark-steel plates with neon violet edges, and its Heat arc echoes the hero's red slashes. **LOCKED** as a layout reference, with fixes

| Element              | Position      | Notes                                                               |
|----------------------|---------------|---------------------------------------------------------------------|
| Health bar           | Top-left      | Green segments with a numeric readout                               |
| Score and multiplier | Top-centre    | Chunky readable numbers                                             |
| Boss bar             | Top-right     | Name and health                                                     |
| Heat meter           | Bottom-centre | Arc of red slash ticks that glow as it fills, with a MAX HEAT pulse |
| Move stick           | Bottom-left   | Thumb joystick                                                      |
| Abilities            | Bottom-right  | Three round buttons with radial cooldown rings                      |
| Dash                 | Bottom-right  | Chevron button                                                      |
| Overdrive            | Bottom-right  | Large button that glows when ready                                  |
| Damage numbers       | In the arena  | Up and down arrows for good and bad matchup                         |

**FIX BEFORE BUILD:** the mock shows only two ability buttons, so add the third; add a pause button and damage numbers; the mock uses the old hero eyes and an invented boss name, so treat it as layout only. The HUD is built in code, not from the image.

**Pros:** clear thumb zones; the Heat arc ties the HUD to the hero; the layout stays out of the fight area.

**Cons:** small numeric text on phones; the ability and Overdrive icons are placeholders; the final frame style is **OPEN**.

## 11. Pros, cons and fixes at a glance

The hero, logic, enemies, boss, arena and HUD are ready to build from; the fixes below are small and none blocks the slice.

| Area            | Strongest point                                      | Main risk                             | Fix before build                                               | Priority |
|-----------------|------------------------------------------------------|---------------------------------------|----------------------------------------------------------------|----------|
| Hero            | Shape-only expressions, identical body in all states | Plastic look, plain circle silhouette | Matcap chrome; keep eyes big and high-contrast                 | High     |
| Hard-body logic | A believable reason a bare body wins                 | Enemies stop being a threat           | Impact, knockback and Heat-loss damage; clear contact feedback | High     |
| Enemies         | Distinct silhouettes, matte against shiny            | Red eyes lost at 32 px                | White-hot eye core; telegraph and damage art                   | High     |
| Boss            | Scale and phase contrast                             | Rig and detail cost                   | Floating arms, no legs                                         | Medium   |
| Arena           | Contrast and frame                                   | Props with faces, leaked text         | Remove eyes and text; add hazard art                           | High     |
| HUD             | Readable zones, Heat arc                             | Missing third ability and pause       | Add both, plus damage numbers                                  | Medium   |
| Attachments     | Fists and frog legs show the floating-part style     | Wings, rods and saws are weak         | Redo per form after the slice                                  | Low      |
| Effects         | Direction is clear                                   | Rings and trails are thin             | Dedicated effects pass                                         | Low      |

## 12. Reference image index

These are the images to attach beside each section; keep the file names so the agent and the image generator use the same references. Images could not be embedded automatically, so add each one under its section.

| Image (file name to use) | Shows                                                                                       | Status                                                                    | Attach for                     |
|--------------------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|--------------------------------|
| CORE_LOCKED_v1           | 30-cell hero state sheet: expressions, actions, part states, heat tiers, damage, silhouette | LOCKED                                                                    | Section 4 and all hero prompts |
| CORE_TURNAROUND_v5       | Hero turnaround with flush sockets, clean bottom, crown slashes                             | Body LOCKED; its mismatched eyes are superseded                           | Section 4                      |
| COMPOSITION_GRID_v5      | Eye shapes, ring, shell and colourway options in one image                                  | Eye picks 1, 4, 5, 6, 8, 10, 12 locked; ring rejected; blue chrome locked | Sections 4 and 13              |
| FROG_LEGS_v1             | Crouch and leap legs with flat pad feet                                                     | Concept for the Frog form, not final                                      | Section 15                     |
| EARLIER_PARTS_SHEETS     | Gauntlet fists, saw discs and heat states from the first round                              | Style reference for floating parts                                        | Section 15                     |
| FOUNDRY_ARENA_v1         | Empty arena key art                                                                         | LOCKED with fixes                                                         | Section 9                      |
| ENEMY_LINEUP_v1          | Four enemies beside the hero, with silhouettes                                              | LOCKED with fix                                                           | Section 7                      |
| SCRAP_REX_v1             | Boss calm and enraged, hero scale, silhouette test                                          | LOCKED with change                                                        | Section 8                      |
| HUD_MOCK_v1              | HUD layout                                                                                  | Layout reference with fixes                                               | Section 10                     |
| REJECTED                 | Grey drone sheet, ring and gauge seams, split-shell Overdrive                               | Rejected: dull, or the seam reads as a mouth                              | Do not use                     |

## 13. Prompt kit

Every image prompt starts with the style block, repeats the character lock for hero shots and ends with the standard negatives.

**Style block**

Chunky toon-shaded stylized game art, thick clean dark outlines, bold 3-band cel shading, simple readable shapes, big glossy cartoon eyes with highlights, spheres as bodies, warm key light with cool violet fill, neon violet rim accents, dark purple space background, readable silhouette at tiny size, mobile game asset, no real-world flags or brands.

**Character lock (hero shots)**

A perfectly round glossy blue-violet mirror-chrome sphere with lavender reflections and subtle panel lines. One flush round socket plate on each side and one on the back. Two thin short red slashes high on the crown, far from the eyes. Clean underside. The face is only two plain flat white shapes with no pupils, no eyebrows, no mouth, no nose. The base ball has no legs, arms, ring, belt line, backpack, antenna or headphones. Attachments float separately beside the ball, joined to the side sockets by a faint glowing link.

**Standard negatives**

ring, belt line, mouth, nose, eyebrows, pupils, legs or arms on the base ball, backpack, headphones, antenna, text other than numbers, real flags or brands

| Prompt ID                                                   | Purpose                                                    | Status                   |
|-------------------------------------------------------------|------------------------------------------------------------|--------------------------|
| HERO-EYES, HERO-RING, HERO-SHELL, HERO-COLOR, HERO-CONCEPTS | Design exploration; picks recorded in the composition grid | Generated, picks locked  |
| CORE-MASTER-SHEET                                           | 30-cell state sheet                                        | Generated, LOCKED        |
| BIOME-FOUNDRY                                               | Empty Chapter 1 arena                                      | Generated, fixes needed  |
| ENEMY-FOUNDRY                                               | Four-enemy lineup                                          | Generated, fix needed    |
| BOSS-FOUNDRY                                                | Scrap-Rex calm and enraged                                 | Generated, change needed |
| UI-HUD                                                      | HUD layout                                                 | Generated, fixes needed  |
| CORE-TURNAROUND-FINAL                                       | Orthographic hero reference with circle eyes               | Not yet generated        |
| SCENE-FIGHT                                                 | In-context test: hero findable at 300 px                   | Not yet generated        |
| ENEMY-DAMAGE                                                | Blade breakage states as enemy health                      | Not yet generated        |
| FX-GRIND                                                    | Blades breaking against the hero                           | Not yet generated        |

Generator tips: cells merge above about 30 per image, so split big sheets into runs of 12, 12 and 6; ask for numbers only and add labels in a design tool afterwards.

## 14. Technical constraints and build handoff

The agent builds everything from primitives and particles; the concept art is a style target, not a texture source. **LOCKED** (budgets from the brief)

| Area      | Constraint                                                                                                       |
|-----------|------------------------------------------------------------------------------------------------------------------|
| Rendering | Real-time 3D in a phone browser: toon shader, outlines, matcap chrome, additive particles                        |
| Glow      | Emissive materials and additive sprites; no full-screen bloom on low-end devices                                 |
| Budgets   | Core 3k triangles or fewer; enemies 1.5k to 2k; boss 6k                                                          |
| Textures  | None heavy; simple shapes, bolts and seams                                                                       |
| Animation | Procedural squash and stretch; parts lag behind the body like springs; hit-stop; floating parts, no skeleton rig |
| Face      | Eyes as a shader shape morph, not separate meshes. **PROPOSED**                                                  |
| HUD       | Built in code (HTML, CSS or canvas); the mock is layout only                                                     |
| Camera    | Fixed isometric, about 45° yaw and 50° pitch                                                                     |

Acceptance tests for the slice, **PROPOSED**:

- The hero is findable within one second in a 300 px wide frame.

- Every enemy attack shows at least 0.4 s of warning; boss attacks at least 0.8 s.

- No more than 12 enemies are alive at once.

- Only the hero is mirror chrome, and no prop has a face.

- A blade touching the hero never marks the hero and always damages the blade.

- Every expression reads with no mouth.

What the agent still needs from the owner: the numbers listed in section 15.

## 15. Open items and what comes next

The slice needs one set of numbers and a few fixes; everything else here is after-slice work.

**Decisions and numbers needed (OPEN)**

- Health, damage, speeds, Heat gain and loss, wave sizes and boss health.

- Scrap-Rex: floating arms and no legs, yes or no; final phase order.

- Whether the red crown slashes stay as the Heat indicator.

- Whether Chapter 1 gets one or two guest enemies of another form to show the matchup wheel.

**Art still to generate:** telegraph decals and hazard crates, pickups, spawn and kill-pop effects, damage numbers, enemy damage states, grind effects, the fight-scene test and the orthographic hero turnaround.

**After the slice**

- Lobby: a garage built into a broken Engine piece, the Core on a lift, parts on a rack. **PROPOSED**

- Results screen and chapter map.

- Attachments and effects pass, one form at a time.

- Biomes 2 to 6 with their enemies, bosses and eye families.

| Form  | Attachment                   | Colour                   | Beats       | Loses to    |
|-------|------------------------------|--------------------------|-------------|-------------|
| Blade | Saw discs or blade ring      | Steel and crimson        | Frog, Fist  | Wing, Coil  |
| Fist  | Two gauntlet fists           | Ember orange             | Spike, Coil | Blade, Frog |
| Frog  | Hind legs with flat pad feet | Acid green               | Fist, Spike | Wing, Blade |
| Wing  | Mechanical fan-wings         | Sky cyan and white       | Blade, Frog | Spike, Coil |
| Spike | Crystal spikes               | Amethyst violet          | Coil, Wing  | Fist, Frog  |
| Coil  | Tesla rods and rings         | Electric yellow and blue | Wing, Blade | Spike, Fist |
