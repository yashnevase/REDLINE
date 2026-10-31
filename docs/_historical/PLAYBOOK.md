# CADDIS — PIPELINE & AGENT PLAYBOOK v1
### Tools · Mac M4 setup · model/effort choices · free-asset rules · loops · copy-paste prompts

> **Companion to** `CADDIS_DESIGN_BIBLE_v2.md` (what we build and how good it must be). This file is **how agents build it**.
> **Labels:** **[FACT]** verified from a source during research · **[START]** starting value · **[SUGGESTION]** my recommendation · **[UNVERIFIED]** could not confirm — check before relying on it.
> **Research date:** 2026-10-29. Prices, quotas, licenses and versions change; re-check before paying or shipping.

---

## 0. THE PIPELINE IN ONE PICTURE

```
 ref/ (10–15 style images)  ──►  STYLE.md (style bible + rubric)
          │                                │
          ▼                                ▼
  Blender (5.2 LTS) + Blender MCP + blender-skills  ──►  .glb (contract §7)
          │  (agent builds, LOOKS at viewport, compares, fixes)         │
          ▼                                                              ▼
   silhouette test + asset-validate                      Three.js game (TS, deterministic sim)
                                                                         │
        Playwright render ─► look-score + fresh judge ─► fix ONE thing ─►┘
        Bots (0.25 s / 0.4 s) ─► fairness + balance;  Human 15-min playtest ─► feel tuning
```
**Who does what:** the **ref folder** = the style · **Astra/Sol agents** = read refs, model, build, fix · **Blender** = hero/enemy/boss models + rig + clips · **Three.js game** = world, light, player, feel · **you** = taste, playtesting, final yes/no.

**Core principle (from the posts, sound in practice):** *make it exist first, then make it good.* A playable grey box beats a beautiful mockup. And: **one generator beats 100 assets** — procedural/code-built shapes where possible, hand-quality Blender models only for the hero, enemies and boss.

---

## 1. YOUR MACHINE: MAC M4, 16 GB

| Task | Fits? | Note |
|---|---|---|
| Blender 5.2 LTS (Apple Silicon build) | ✅ | Released 2026-07-14, supported until July 2028; the macOS Apple Silicon download is ~330 MB [FACT]. |
| Blender MCP + Codex/agent + Vite dev server + headless Chromium together | ✅ [SUGGESTION] | Close extra browser tabs. |
| Playwright screenshot loops | ✅ | Chromium headless is light. |
| **Local AI image-to-3D (Hunyuan3D 2.1)** | ⚠️ **Skip** | A Mac port reports it works on **M4 Pro 24 GB** (shape ~5.7 min, texture ~8.5 min, only the "Safe" preset, ~8 GB swap, ~30 GB of downloads); 24 GB is called "tight" [FACT]. On **16 GB it is unproven** [UNVERIFIED] and would likely thrash. Use code-built shapes and Blender instead. License also excludes EU/UK/South Korea [FACT]. |
| Heavy video/ML retargeting (Motion2MixamoRig, ~5 GB weights) | ⚠️ Skip for v1 | Humanoid-only, experimental (§2). |
**Disk:** keep ≥30 GB free; avoid big model downloads.
**Device access safety:** let the agent operate **only inside the project folder** (e.g. `~/dev/caddis`). Use git; commit before every big step. Anything outside that folder, any system-wide install, or any script from the internet → the agent must ask first (§9 ask-protocol). Blender MCP can run **arbitrary Python** in your live Blender session: always save the `.blend` before agent runs, and prefer safe mode (§4).

---

## 2. TOOL INVENTORY & VERDICTS (every link you sent, plus what I added)

| Tool | What it actually is [FACT from its page] | License | Cost | Verdict |
|---|---|---|---|---|
| **BlenderMCP** (`ahujasid/blender-mcp`, PyPI `mcp-for-blender`) | Blender addon + MCP server. 9 tools incl. `execute_blender_code` (run Python), `look` (viewport/multi-angle/camera screenshots), `get_scene_info`, `generate_3d` (Tripo/Hunyuan3D/Rodin/Meshy), `search_assets` (Poly Haven, Sketchfab, Poly Pizza). Blender ≥3.0, Python ≥3.10, uv. ~32.5k stars. | MIT | Free (3D-gen providers need their own accounts) | **USE — core.** |
| **blender-skills** (`arjun988/blender-skills`) | 94 agent skills (director router, modeling, retopo, UV, rigging, animation, optimization, **export pipeline**, low-poly style, reference-matching loop) that run through BlenderMCP. v1.3.0, ~1k stars; Claude Code/Codex/Cursor/Kiro. | MIT | Free | **USE.** Read skills before trusting them; activity dates not visible [UNVERIFIED]. |
| **awesome-gamedev-agent-skills** (`gamedev-skills/…`) | 77 `SKILL.md` skills incl. **game-feel** (shake, hit-stop, easing, squash/stretch), **three.js** (scene, glTF loading, materials/lighting; pinned r186), game-ai, prototype-fast, performance-optimization, level-design, input, camera-systems, create-game-assets, 16 Godot skills. 5.3k stars. | Apache-2.0 | Free | **USE selectively** (list in §4). No Blender skills inside. |
| **dream-loop** (`achimala/dream-loop`) | Skill that makes an agent build a Blender scene toward a target image, screenshot it, and hand it to a **fresh judge subagent** (clean context each round, sees the last verdict from round 2) on a gated 0–10 ladder; rebuild until satisfied. Install: `npx skills add achimala/dream-loop`. Tested **only with GPT-6 Astra in Codex**; full scoring ladder was behind a paywall in the article I read. | MIT | Free | **USE as the pattern** and try the skill; our own look-score (§6) works for the web scene too. |
| **img2threejs** | Skill that rebuilds an object from **one reference image** as a **code-only procedural Three.js model** (TS factory + spec + pivots/sockets/colliders + side-by-side comparison sheets), multi-pass with a "strict-quality" gate. Honest about limits (hidden sides; strong for hard-surface; characters are stylized reconstructions). Auto-rig/LOD/exporters are **roadmap, not shipped**. ~19.6k stars, v2.0.0. | Apache-2.0 | Free | **USE for parts and props** (claws, shell, wings, fruit, platforms). Not for the Caddis face. |
| **Motion2MixamoRig** | Video/photo → motion on a **Mixamo-rigged humanoid** (`.glb` out). Needs Python 3.11, Blender 4.2+, ~5 GB weights; experimental v0.1.7. **SMPL-X is non-commercial by default.** | Apache-2.0 (code) | Free | **SKIP v1** — our bodies are insects; humanoid-only; licensing trap. |
| **DSH Blender plugin** | Direct TCP control of Blender (see/do/loop/perf/opt tools) for the **DSH (DeepSeek Harness)** host; addon not included in the repo. | BSD-3 | Free | **SKIP** — needs a different harness; BlenderMCP is simpler for Codex. |
| **Scenario for Blender** | Experimental Blender 5.0+ extension: image/3D/PBR/HDRI generation inside Blender + local MCP server. Uses **paid credits**; no free tier described; output-ownership terms not stated on the page; local MCP endpoint has **no credential**. | GPL-3.0+ | Credits | **SKIP** for the free pipeline. |
| **scenario-labs/3d-collection** (Hugging Face) | 1.34k rows of generated 3D (mostly GLB) from Meshy, Rodin, Trellis, Tripo, etc.; each row labelled `cc-by-4.0`. Source-model terms not explained. | CC BY 4.0 (label) | Free | **REFERENCE only** (see what AI meshes look like). Do not ship without checking upstream terms. |
| **mg-styles-15** | 15 motion-design "styles" made by Claude Opus 5.5 from single prompts; film styles drawn in code; has `prompts/`, `template.md`, **`rubric.md` (review prompt)**; "Signature features" section is what makes a style recognizable. Not game art. | MIT (third-party assets keep own licenses) | Free | **PATTERN:** copy the *signature features + rubric* structure for `STYLE.md`. |
| **lemo-opuscar** | 59 film styles as `STYLE.md` + demo; separate `DIRECTOR.md` (what/why) and `TECHNIQUE.md` (how); deterministic frame-by-frame rendering; **human checkpoint on one styled frame before costly work**; self-check step. Not a game. | MIT | Free | **PATTERN:** adopt the one-frame approval gate and the style/technique doc split. |
| **spritefusion-sprite-normals** | Normal maps for **pixel-art sprites** (Rust CLI/WASM). | MIT | Free | **SKIP** — we are 3D. |
| **Game Art Style** (gameartstyle.loopyhop.com) | Visual atlas: 37 styles, 104 games, official screenshots. States it **does not license the artwork**. | — | Free | **STUDY** to pick references; never ship or copy. |
| **Gameplay Atlas** (gameplayatlas.loopyhop.com) | 280 mechanics across 28 systems, each as a short loop + breakdown. Reuse license not visible. | ? | Free | **STUDY** mechanics. Check "Content & sources" before reusing text. |
| **sandromaglione.com/newsletter** | Spirit Call's author. Page announces an upcoming guide **"Indie game development with AI"** (expected 28 Oct–4 Nov 2026) covering code & ECS, 3D models/assets, gameplay, UI; says both his games were built "without writing code or drawing assets by hand." **I could not find it published yet.** | — | ? | **WATCH — highest-value upcoming source.** Re-check this week. |
| **Godot MCP Pro** | Paid MCP for the Godot editor (run scene, screenshots, input simulation); ~$15 one-time, proprietary. | Proprietary | $15 | Only if we ever switch engines. |
| **PolyFork** (polyfork.dev) | ~2.7k low-poly three.js GLB assets, free low-poly tier, API/MCP access; says "commercial licence" but full terms not on pages read (see polyfork.dev/licensing) [UNVERIFIED] | Commercial (terms TBC) | Free (HD = Pro) | **USE for props/placeholders after reading the licence**; not for hero/boss. |
| **Free CC0 2D vector characters** (rgsdev.itch.io) | Not fetched. 2D. | ? | — | **NOT REVIEWED / likely irrelevant** (we are 3D). |
| **Asset hubs in your post:** Godot site, Lospec, Mixamo, itch.io, Freesound, Game-icons, Kenney, OpenGameArt | Kenney, Mixamo and Quaternius were checked (§3). Others not individually reviewed. | varies | Free | See §3. |

---

## 3. FREE ASSETS & LICENSE RULES

**Rule:** log every asset in `docs/ASSETS.md`: *file · source URL · author · license · date · modified?* Anything with an unknown or non-commercial license is **flagged and kept out of the shipping build**. Reference images never ship.

| Source | License [FACT unless noted] | Use for us |
|---|---|---|
| **Kenney** (kenney.nl) | CC0 (checked on the Animated Characters pack page) | Props, UI, placeholder characters; stylistic fit varies |
| **Quaternius** (e.g. LowPoly Animated Monsters) | CC0; OBJ/FBX/Blend; user comments mention import/animation hiccups | Blockout, rig/animation references, creature proportions |
| **Poly Haven** (via BlenderMCP) | CC0 [from my knowledge; verify per asset] | HDRIs/lighting study, textures (we mostly skip textures) |
| **Mixamo** | A 2022 Adobe community post says: free for commercial games, no royalties, **can't redistribute raw character/animation files**, **no ML training use**. Page is dated; **verify on Adobe's current FAQ** [UNVERIFIED] | Humanoid animation reference only (our hero is an insect) |
| **OpenGameArt, itch.io** | **Varies per asset** | Check each; prefer CC0 |
| **Game-icons.net** | I recall CC BY 3.0 (attribution) [UNVERIFIED — check] | UI icons if attributed |
| **Freesound / sfxr tools** | Varies (CC0 / CC BY) | Minimal SFX, last phase |

**AI mesh generators — the license trap**
| Service | Free tier terms |
|---|---|
| **Meshy** | **100 credits/month**; free models are **CC BY 4.0** — "commercial use allowed *with attribution*"; paid plans give private models + full commercial use (official pricing doc) [FACT]. Support-article pages failed to load. |
| **Tripo** | Third-party summary: **200 credits/month (~13 models)**, free output is **public / non-commercial, CC BY 4.0**, 15 downloads/month [FACT-ish: medium confidence; check Tripo's own terms] |
| **Hunyuan3D (local)** | Free, but heavy and see §1; community license has regional/scale limits [FACT] |
**Policy [SUGGESTION]:** use AI meshes only for **concept/blockout reference**. Final shipping models are **hand-built in Blender (agent-scripted) or code-built**, so no license ambiguity. If a free-tier mesh is ever used, record its CC BY attribution and keep a clean-room rebuild as the plan.

---

## 4. SETUP (Phase 0) — step by step

> Commands below come from each project's README unless marked **[from my knowledge]**. Have the agent **print each command and wait** before running anything that downloads and executes scripts.

1. **Install Blender 5.2 LTS** (Apple Silicon `.dmg`) from blender.org. Open it once. [FACT: LTS, July 2026]
2. **Install uv** with its official installer (the BlenderMCP README says *not* `pip install uv`). [`brew install uv` or Astral's installer — **from my knowledge**, inspect before running]
3. **Install Node (LTS) and git**; create `~/dev/caddis`; `git init`.
4. **Register the Blender MCP with Codex** (README): `codex mcp add blender -- uvx mcp-for-blender`
5. **Install the Blender addon** (README): `uvx mcp-for-blender install-addon`, then in Blender: *Edit → Preferences → Add-ons → enable "Interface: MCP for Blender"*; press **N** in the 3D viewport → **MCP for Blender** tab → **Start MCP Server**.
   *Avoid the `curl … | sh` one-liner installer unless the agent shows you the script first.*
6. **Security flags** (README): set `BLENDER_MCP_SAFE_MODE=1` (screens risky scripts) and `DISABLE_TELEMETRY=true`. Run **only one MCP server instance** at a time. The addon socket has **no auth/encryption**: keep it on localhost.
7. **Install skills:** `npx skills add achimala/dream-loop` (from the article); for **blender-skills** and **awesome-gamedev-agent-skills**, have the agent read each repo's install guide for Codex (the README I read only describes the Claude `.claude/skills` copy). Keep these skills active: `game-feel`, `threejs-scene-setup`, `threejs-gltf-loading`, `threejs-materials-lighting`, `game-ai`, `prototype-fast`, `performance-optimization`, `level-design`, `input`, `camera-systems`, `create-game-assets`; Blender: `blender-director`, `export-pipeline`, `asset-optimization`, low-poly style, rigging, animation.
8. **Playwright for the look/QA loops** [from my knowledge]: `npm i -D playwright` then `npx playwright install chromium`.
9. **Scaffold the repo** per Bible §13 (Vite + TS + Three, `ref/`, `art/`, `tools/`, `docs/`, `AGENTS.md`, `docs/ASSETS.md`).
10. **Fill `ref/`** with 10–15 images + `REFERENCES.md` (hero look = your demon image; plus enemy silhouettes, light shafts/mood, VFX, UI, isometric camera). A folder of 10 good refs beats paragraphs of adjectives.
11. **Phase-0 acceptance test** (agent must prove all four and write `SETUP_REPORT.md`):
    a. `npm run dev` runs; Playwright screenshots the page.
    b. Blender MCP `get_scene_info` + a viewport `look` screenshot work.
    c. The agent builds a **test cube with one socket empty**, exports `.glb` per §7, and the game loads and renders it.
    d. `npm run check` passes.

---

## 5. WHICH MODEL, WHAT EFFORT (as of the sources dated 2026-10-22; **quotas and prices vary by plan**)

**Lineup [FACT from the Codex model-selection page and a Batch article]**
- **GPT-6 Astra** — most capable; best for the hardest multi-step work across tools/apps. API ~ $10 in / $50 out per M tokens.
- **GPT-6.1 Sol** — near-Astra on agentic coding at about **one-fifth the cost** ($2/$10); the recommended **default** for complex coding.
- **GPT-6 Luna** — lightweight, high-volume: extraction, transformation, repetitive work.
- **GPT-5.6 Terra** — balanced everyday model (older generation).
- **Effort levels:** low/light · medium · high · max · ultra. *Max* = one very hard task; *Ultra* = splits work across subagents (rarely needed).
- **Advice from the sources:** start with 6.1 Sol at default; **raise effort before changing models**; use Astra only for the hardest multi-stage work. One benchmark write-up suggests **Astra at medium** as the default and "high" only for long agentic loops where medium measurably failed.

**Recommended use in this project [SUGGESTION]**
| Job | Model | Effort | Why |
|---|---|---|---|
| Phase 0 setup (installs, MCP, skills, scaffold, acceptance test) | **Astra** | medium (high if stuck) | Many tools/devices at once; one-time cost |
| Architecture, ambiguous bugs, hard refactors, design review | **6.1 Sol** | default → high | Best value for deep reasoning |
| Daily features: enemy states, parts, upgrades, UI, tests | **6.1 Sol** | low–medium | Well-defined work; cheap |
| Blender modeling loops (build → look → compare → fix) | **Astra** (or Sol high) | medium; high only for long loops | Long, vision + tool loops; dream-loop was tested on Astra [FACT] |
| Look-judge subagent (fresh context) | **Sol** | low–medium | Compares two images and returns a rubric; independence matters more than power. [UNVERIFIED whether Luna judges images well enough] |
| Bulk/mechanical: renaming, data entry (`parts.json`), doc formatting, batch export | **Luna** | default | Cheap, high volume |
| Security/performance/final audit before release | **Astra** | high | Rare, high-stakes |
**Cost discipline:** keep prompts short and file-referenced (point at the docs, don't paste them); one milestone per conversation; commit between milestones; check your plan's usage meter. Sol quotas on Plus/Business were listed as roughly 15–160 local messages per 5 hours [FACT from one page; may differ for you].

---

## 6. THE FOUR LOOPS

### 6.1 LOOK LOOP (reference-scored; from the "score the render against the reference" idea)
1. **Pick one target** (`ref/target_arena.png`, `ref/target_hero.png`). Get the human to approve **one styled frame** before building much (lemo-opuscar checkpoint).
2. **Deterministic capture mode:** `?look=1&seed=N&cam=<preset>`: time frozen, UI hidden, fixed camera/light.
3. **`tools/look-score.mjs`** (Playwright → PNG): compare global statistics, because content differs from the reference. **Score 0–100** [START weights]: palette distance (Lab, 8-color k-means) 30 · luminance histogram 20 · contrast 15 · edge/outline density 15 · mean saturation 10 · light/dark composition by thirds 10. Output: JSON + side-by-side PNG + difference heatmap.
4. **Fresh judge subagent** (clean context each round; from round 2 sees the previous screenshot + verdict) reads the side-by-side and returns `{silhouette, palette, lighting, outline, readability}` 0–10 each + the **top 3 fixes** (dream-loop pattern).
5. **Change ONE thing per iteration.** Order: **lighting/haze → layout/composition → materials/palette → outline → final color grade (auto-fit LUT)**. Log each iteration in `look-log.md` (score before/after).
6. **Stop** after 3 iterations with <2-point gain, or when the human says yes.
**Caveats:** the score measures *similarity to the image*, not fun or readability; don't overfit (e.g., cloning the reference's exact colors); the **human approves**. Never ship reference images.

### 6.2 ASSET LOOP (Blender MCP) — per model
1. **Reference sheet** in `ref/<asset>/` (front/side/¾). Human approves one concept frame.
2. **Blockout with primitives → silhouette test:** render black silhouettes from the isometric camera at **128, 64, 32 px**; must be recognizable.
3. **Detail pass within the tri budget** (Caddis ≤5k; enemy ≤2k; boss ≤6k; part ≤1.5k). Stitches = small beveled strips/vertex colors, **not textures**. Vertex colors or one palette.
4. **Rig:** ≤12 bones (enemies), ≤4 weights/vertex; sockets as empties.
5. **Clips** (in place): fixed names (`idle`, `run`, `dash`, `hit`, `telegraph`, `attack`…). Death = particles, no clip.
6. **Export** `.glb` per §7; run `tools/asset-validate.mjs`.
7. **In-game check:** screenshot at the isometric camera, phone viewport, next to the reference; fix; repeat.
Use the BlenderMCP `look` tool (multi-angle) after each build step; the agent should "build, look, compare, fix" inside Blender, not export blind.

### 6.3 FEEL LOOP (human + bots)
- Debug panel presets `feel.vN.json`; every playtest ends with **3 notes → 3 changes**.
- **15-minute checklist:** Does dash respond on the first frame? Can I tell light from heavy hits? Do I know why I died? Is retry instant? Does the Sunburst feel earned? Do telegraphs read at a glance?
- **Bots (fairness only):** quick 0.25 s and learning 0.4 s reaction bots; per-part-alone matchup run; log time-to-kill, damage taken, unavoidable-damage count. Bots can't judge fun.
- **Metrics log** per hit: feedback layers fired (must be ≥3), hit-stop ms, shake trauma.

### 6.4 QA LOOP
Playwright smoke at 3 viewports (phone portrait/landscape, desktop) with **4× CPU throttle**: no console errors, frame-time sampler, entity count. Then the **real-device matrix**: iPhone Safari, Android Chrome, desktop Chrome/Firefox, a gamepad. Throttled desktop ≠ real phone.

### 6.5 NEW-LEVEL TEMPLATE (reuse for Levels 2–5)
1. Style delta (palette, sun type) in `STYLE.md` → 2. 3–4 enemy archetypes, each asking the player *one question* → 3. data entries (waves, enemies) → 4. models via Asset Loop → 5. Look Loop → 6. bots (G3, G6) → 7. 15-minute playtest → 8. ship.

---

## 7. GLB CONTRACT & VALIDATOR (copied from Spirit Call's model contract [FACT])
- glTF binary `.glb`; **meters; +Y up; facing +Z; origin between the feet**; embedded textures; **no Draco**; no lights/cameras/helpers.
- Few materials (vertex colors or one palette texture). One armature; ≤4 weights/vertex; ≤12 bones (enemies).
- **In-place clips; no root motion.** Loops omit their closing key (store loop length in metadata).
- Sockets are named empties: `socket_arm_R`, `socket_arm_L`, `socket_leg_R`, `socket_leg_L`, `socket_back`.
- Heights [START, game units = meters]: Caddis 1.0 · gnat 0.5 · fruit fly 0.8 · bluebottle 1.4 · Fly Queen 3.5.
- Blender is Z-up: use the exporter's **+Y Up** setting; apply modifiers; export vertex colors (check the option name in this Blender version [UNVERIFIED]).
**`tools/asset-validate.mjs`** (Node; e.g., with the `@gltf-transform` libraries) fails the build if: tri count over budget · bones >12 · weights >4 · required clips missing · root-motion tracks present · bbox height outside ±10% of spec · min-Y ≠ ~0 · Draco/lights/cameras present · sockets missing.
`test/looks.test.ts` (Spirit Call pattern): every model has the clips its spec lists; every content id has a look.

---

## 8. `AGENTS.md` TEMPLATE (drop in repo root)
```
# Agent rules — CADDIS
Read first: docs/DESIGN_BIBLE.md (§0 rules, §2 pillars), docs/PLAYBOOK.md.
- Feel first. Order: controls → dash → hit feel → enemy AI → hero/enemy art → transitions/VFX → backgrounds → audio (last).
- sim/ is deterministic + headless: fixed step, seeded RNG, no clocks, no Math.random, no three/ui imports.
- Content is data in src/content/. Visuals only via src/render/looks.ts. No asset paths in content.
- Animation follows sim: timings in data; clips stretch to fit; no root motion; no hitboxes from clips.
- Crowds are instanced/baked; never one mixer per enemy.
- Every tunable lives in the debug panel (dev-only). No magic numbers.
- Run `npm run check` before every commit; run bots when data changes. Small commits, explain why.
- Log every asset in docs/ASSETS.md (source, license). Unknown/non-commercial → flag, don't ship.
- Do not add features outside Bible §14. Ask instead of guessing (use the ask-protocol).
- Verify in a real browser at phone viewport with touch. Never push or deploy unless asked.
- Stay inside ~/dev/caddis. Ask before any system-wide install or unknown script.
```

---

## 9. PROMPT LIBRARY (copy/paste; fill the `<…>`)

### 9.0 The ask-protocol (include in every prompt)
```
If you are blocked or a decision is mine, STOP and ask in this exact format:
BLOCKED: <one line>
OPTIONS: A) … B) … (max 3)
RECOMMENDATION: <which and why>
NEED FROM ME: <exact thing: a file, a yes/no, a login, a screenshot>
Do not guess on license, scope, or anything outside ~/dev/caddis.
```

### 9.1 MASTER SETUP PROMPT — for GPT-6 Astra, medium effort (Phase 0)
```
Goal: set up the full free asset + game pipeline for the game in docs/DESIGN_BIBLE.md and docs/PLAYBOOK.md.
Read both files completely first, then restate in 8 lines what we're building and the Phase-0 acceptance test.
Constraints: work only in ~/dev/caddis on this Mac (Apple M4, 16 GB). Before any install or any script downloaded from the internet, print the exact command and what it does, and wait for my OK. Save-before-run for Blender. Use BLENDER_MCP_SAFE_MODE=1 and DISABLE_TELEMETRY=true.
Do, in order: (1) check what's already installed (Blender, uv, Node, git, Playwright) and list versions; (2) install/register what's missing per PLAYBOOK §4; (3) scaffold the repo per Bible §13 with AGENTS.md, docs/, ref/, art/, tools/, docs/ASSETS.md; (4) install the skills listed in PLAYBOOK §4.7 (read each repo's install instructions for Codex first); (5) create a Vite+TS+Three scene, a Playwright screenshot script, and tools/asset-validate.mjs stub; (6) via Blender MCP build a test cube with one socket empty, export a .glb per PLAYBOOK §7, load it in the game, screenshot both Blender and the game.
Deliver: SETUP_REPORT.md (versions, commands run, results, anything that failed, anything I must do by hand) and a passing `npm run check`.
Do not build gameplay yet. <ask-protocol>
```

### 9.2 BLENDER ASSET PROMPT (adapted from the hatchet example) — Astra, medium
```
Using Blender through Blender MCP, make a game-ready low-poly model of <ASSET> from the references in ref/<asset>/ and the style in docs/STYLE.md. Work directly in Blender: build, look (multi-angle viewport screenshots), compare with the reference, fix. Repeat until it matches in shape, proportions, colors and mood.
What it is: <role in game, e.g. "Fruit Fly enemy: small angry diving fly">. Seen from a fixed isometric camera on a phone, so the SILHOUETTE must read at 32 px — run the silhouette test (black render at 128/64/32 px) before detailing.
Keep: <3–5 signature details, e.g. big glossy angry eyes with highlights, stitched seam across the thorax, glowing wing-root joints>.
Requirements: meters; height <H> m; +Y up facing +Z; origin between the feet; ≤<N> triangles; vertex colors or one palette (no textures); one armature ≤<B> bones, ≤4 weights/vertex; sockets as empties <names>; in-place clips named idle, move, telegraph, attack, hit (no root motion; death = particles, no clip); embedded textures, no Draco.
Process: concept frame → I approve → blockout → silhouette test → detail → rig → clips → export .glb → run tools/asset-validate.mjs → import via src/render/looks.ts → screenshot in game at phone viewport next to the reference → fix.
Save the .blend and export script in art/<asset>/. Log sources/licenses in docs/ASSETS.md. <ask-protocol>
```

### 9.3 LOOK-LOOP PROMPT — Astra medium (+ Sol low judge)
```
Run the Look Loop (PLAYBOOK §6.1) for <scene> against ref/<target>.png.
1) Build tools/look-score.mjs (Playwright, ?look=1&seed=<N>&cam=<preset>, 1280x720) producing a 0–100 score from palette/luminance/contrast/edges/saturation/composition, a side-by-side PNG and a heatmap.
2) Show me ONE styled frame first and wait for my OK.
3) Loop: capture → score → spawn a FRESH judge subagent with only the side-by-side (+ last verdict) to return {silhouette,palette,lighting,outline,readability}/10 and top-3 fixes → apply ONE fix → log in look-log.md. Order: lighting/haze → layout → materials/palette → outline → final color grade.
Stop at 3 iterations with <2 points gain or when I approve. Do not copy the reference's exact colors/characters; do not add the reference to the build. <ask-protocol>
```

### 9.4 FEEL-TUNING PROMPT — Sol, low–medium
```
Implement/adjust the combat-feel stack from Bible §6.3 for <feature>. Every value must come from the debug panel and src/content, with the Bible's [START] numbers as defaults. Add per-hit logging of feedback layers (must be ≥3). Add presets feel.vN.json. Then write the 15-minute playtest checklist results template. Do not change gameplay rules. Run `npm run check`. <ask-protocol>
```

### 9.5 ENEMY AI PROMPT — Sol, medium
```
Implement enemy <name> per Bible §9 in src/sim (pure, deterministic). States: idle→alert→chase/skirmish→telegraph→attack→recover→die. Respect engagement slots (max 3 attackers), the 12-enemy cap with spawn queue, the 70%-cleared wave rule, and telegraph ≥0.4 s (heavy ≥0.8 s). Timings (windup_ms/hit_ms/recover_ms) live in src/content. Add bot tests with 0.25 s and 0.4 s reaction times proving no unavoidable damage. Visuals only through looks.ts. <ask-protocol>
```

### 9.6 BUG-FIX PROMPT — Sol, default
```
Bug: <what happened, on which device>. Expected: <…>. Steps: <…>.
First reproduce it (Playwright or a bot run) and show me the failing evidence. Then fix with the smallest change, add a regression test, run `npm run check`, and explain the cause in 3 lines. Do not refactor unrelated code. <ask-protocol>
```

### 9.7 FRESH-JUDGE PROMPT (visual critic)
```
You are an independent art-director judge. You see only: image A (reference) and image B (current game render). Score B against A 0–10 on: silhouette readability, palette, lighting, outline quality, overall readability at phone size. Then list the 3 highest-impact, concrete fixes (a single change each). Be strict; do not praise. Do not suggest copying A's characters or exact colors.
```

### 9.8 MODEL-HANDOFF NOTE (any new session)
```
Read docs/DESIGN_BIBLE.md §0–§2 and docs/PLAYBOOK.md §8 first. Current phase: <N>. Last gate passed: <G#>. Open items: <list>. Do only the task below.
```

---

## 10. WHAT I COULD NOT VERIFY (check before relying)
- Godot web-export details (size, threads/cross-origin headers, iOS quirks): the page I fetched was truncated.
- Tripo's **official** terms (only a third-party summary); Meshy's support articles (failed to load; I used its pricing doc).
- Hunyuan3D on **16 GB** Macs (reported only on 24 GB).
- The exact **quotas/prices** for Astra/Sol/Luna on *your* plan.
- blender-skills **activity/recency** and how its skills install for Codex; dream-loop's **full scoring ladder** (paywalled); whether Luna can judge images.
- Mixamo's **current** terms (the source post is from 2022); Game-icons' current license; Poly Haven license per asset.
- The `rgsdev` itch.io pack (not opened) and several asset-hub sites (not individually reviewed).
- **Sandro's "Indie game development with AI" guide** — announced for ~28 Oct–4 Nov 2026, not found published yet.
- **Claims in the pasted social posts** (e.g., "churned 33 minutes", "2–3 days") — unverified; treat as inspiration, not schedule evidence.
- All numeric tuning values marked **[START]**.

---

## 11. SOURCES (read this session)
**Spirit Call (author's repo docs):** [vision.md](https://github.com/SandroMaglione/spirit-call/blob/main/docs/vision.md) · [models.md](https://github.com/SandroMaglione/spirit-call/blob/main/docs/models.md) · [enemies.md](https://github.com/SandroMaglione/spirit-call/blob/main/docs/enemies.md) · [DEVELOPMENT.md](https://github.com/SandroMaglione/spirit-call/blob/main/DEVELOPMENT.md) · [AGENTS.md](https://github.com/SandroMaglione/spirit-call/blob/main/AGENTS.md) · [author newsletter](https://www.sandromaglione.com/newsletter)
**Tools:** [BlenderMCP](https://github.com/ahujasid/blender-mcp) · [blender-skills](https://github.com/arjun988/blender-skills) · [awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) · [dream-loop write-up](https://alphasignal.ai/news/dream-loop-gives-coding-agents-a-gated-critic-loop-for-aaa-3d-visuals) · [img2threejs](https://github.com/img2threejs/img2threejs) · [Motion2MixamoRig](https://github.com/MaxLiu22/Motion2MixamoRig) · [DSH Blender plugin](https://github.com/sixtysevenlf/dsh-blender-plugin) · [Scenario Blender plugin](https://github.com/scenario-labs/blender-plugin) · [Scenario for Blender](https://blender.scenario.com/) · [scenario 3d-collection](https://huggingface.co/datasets/scenario-labs/3d-collection) · [mg-styles-15](https://github.com/Vincentwei1021/mg-styles-15) · [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) · [spritefusion-sprite-normals](https://github.com/Hugo-Dz/spritefusion-sprite-normals) · [Game Art Style](https://gameartstyle.loopyhop.com/) · [Gameplay Atlas](https://gameplayatlas.loopyhop.com/) · [Godot MCP Pro](https://github.com/youichi-uda/godot-mcp-pro)
**Engines/rendering:** [Blender 5.2 LTS](https://www.blender.org/releases/5-2/) · [three.js ToonOutlinePassNode](https://threejs.org/docs/pages/ToonOutlinePassNode.html) · [Godot 4.7 web export](https://docs.godotengine.org/en/4.7/tutorials/export/exporting_for_web.html)
**Assets & licenses:** [Kenney animated characters](https://kenney.nl/assets/animated-characters-protagonists) · [Quaternius monsters](https://quaternius.itch.io/lowpoly-animated-monsters) · [Meshy pricing & licenses](https://docs.meshy.ai/en/webapp/pricing) · [Tripo free plan (third-party)](https://costbench.com/software/ai-3d-generation/tripo-ai/free-plan/) · [Hunyuan3D 2.1 Mac port](https://raw.githubusercontent.com/VladimirTalyzin/hunyuan3d-2.1-mac/main/README.md) · [Mixamo licensing FAQ (2022 post)](https://community.adobe.com/t5/mixamo-discussions/mixamo-faq-licensing-royalties-ownership-eula-and-tos/td-p/13234775)
**Models:** [Codex model selection](https://ai.giftx.co.jp/blog/codex-model-selection/) · [Astra reasoning-effort guide](https://ilikekillnerds.com/2026/09/06/gpt-5-6-sol-to-gpt-6-astra-reasoning-effort/) · [Sol vs Astra (The Batch)](https://www.deeplearning.ai/the-batch/sol-nearly-eclipses-astra)

---

## 12. ADDENDUM 2026-10-30 — TOOL RESEARCH (supersedes inventory rows above where they differ)
> This playbook was written for the earlier Caddis design; the game is now **REDLINE** (`DESIGN_BIBLE.md`). Tool facts below were checked on 2026-10-30 unless marked **[user-supplied]** (from another assistant's summary, not verified by me) or **[UNVERIFIED]**.

| Tool | Verified facts | Verdict |
|---|---|---|
| **PolyFork** (polyfork.dev) | Licensing page: use in personal/commercial projects "games, apps, websites"; **no attribution**; **no resale/redistribution of the asset files**; **no using assets to build/train a commercial asset generator**; downloaded files stay yours; hotlinking the CDN is not redistribution but fetch on demand (no bulk-downloading the catalogue), send a User-Agent naming the product, back off on HTTP 429. Page says "every low poly model is free". **The "600-triangle free tier" figure [user-supplied] is not on that page** — treat all low-poly as free, HD as Pro, and re-read polyfork.dev/licensing before shipping. Pro price [user-supplied]: ~$10–15/mo. | **USE for props** (crates, pipes, debris). Not for hero/enemies/boss. Log every file in ASSETS.md. |
| **threejs-devtools-mcp** (DmitriyGolub) | MCP server to inspect/edit a **live Three.js scene**: **59 tools** (not 69), v0.4.1, **MIT**; `npx threejs-devtools-mcp`; needs the dev server running and a **browser tab left open** (close tab = tools stop); name your objects or they show "(unnamed)". Works with vanilla Three.js. | **USE (optional but recommended)** for debugging materials, scene tree, perf stats. Keep Playwright for headless screenshots/CI. |
| **BlenderLens** (`blenderlens-mcp`, PyPI) | **0.2.0 (2026-10-10), Beta, Apache-2.0**, one maintainer, no provenance attestation. 40 tools: build/edit meshes, materials, vertex colours, `check_asset` (triangle budget, rules), `measure_objects`, `render_preview`, `export_glb` (reads the file back and warns), `run_python`. CLI `blenderlens-mcp check` exits 0 pass / 1 fail / 2 cannot check. Needs Blender 4.2+ and Python 3.10+ or Node 18+. | **USE as the asset gate** (CLI check in `npm run check`). Pin the version; review before allowing `run_python`. Can complement BlenderMCP (do not run two Blender-controlling servers on the same Blender instance at once). |
| **blender-ai-mcp** | Not reviewed by me. | Optional alternative; only if BlenderMCP/BlenderLens fall short. |
| **VibeInc AI Art Team** (`VibeIncStudio/ai-art-team`) | Open-source Blender toolkit, 28 tools, **v0.1.0**; autorig and sound generation are **stubs**; mesh generation needs a **local GPU** (TRELLIS.2); **TRELLIS output is not cleared for commercial use** (nvdiffrast non-commercial; the tool itself refuses paid listings); concept step needs a ChatGPT plan or OpenAI API key. Mac 16 GB not addressed. | **SKIP** (GPU + licence + immaturity). |
| **SpriteCook** (spritecook.ai) | Pricing page: **Free 40 credits/30 days**, no rollover, free outputs appear in a **public gallery**, **engine exports not included**; Starter $8/mo (800 credits, private assets, Unity/Godot/sprite-sheet exports). Images cost 8–12 credits, animations 20–26. Page says commercial use allowed on every plan, no credit needed; **ownership wording not explicit — read the Terms**. Pixel-art/2D oriented. MCP plugin for Claude; Codex support [UNVERIFIED]. | **OPTIONAL / SPIKE S4** — only if the chosen look is pixel/dither (Option B) or for icon sheets. For smooth-toon (Option A) it likely mismatches. |
| **Diorama** (`sloemo01/diorama`) | My fetches were blocked. **[user-supplied]** pixel-art isometric diorama playbook + code kit for Three.js with SKILL.md; orthographic isometric camera; 64-colour palette; ordered dither; inked outlines; frame = pure function of time; QA harness. | **SPIKE S1.** Borrow its *process* (freeze frame → screenshot → compare) regardless of look. Check licence in the repo. |
| **Ritmo** (`typeonce-dev/ritmo`) | MIT, TypeScript ECS runtime; fixed-step loop; input; math (swept collision, spatial grid, deterministic random); headless devtools; Pixi adapter. **My read: netcode not mentioned; only Pixi adapter named; 79 stars.** **[user-supplied]** says `ritmo-netcode` (WebRTC, rollback/lockstep) and a generic render bridge exist. | **SPIKE S2** before adopting. |
