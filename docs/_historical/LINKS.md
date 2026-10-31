# LINKS.md — reference index for the agent (read at the phase listed; do not bulk-read everything)
> **Newer than PLAYBOOK §12 and Bible §11 where they differ (Ritmo, Spirit Call code).**
> **Rules:** (1) read only what the current phase needs; (2) if a link cannot be fetched, ask the human to paste the page; (3) licences below are what was verified on 2026-10-29/30 — re-check before shipping; (4) never copy code or art without logging it in `docs/ASSETS.md`. Verdicts: **USE** · **SPIKE** (test first) · **STUDY** (read for ideas) · **SKIP**.

## A. The benchmark: Spirit Call — STUDY in Phase 0 (the owner places the full repo in `reference/spirit-call/`; follow `docs/SPIRIT_CALL_REFERENCE.md`; write `docs/SPIRIT_CALL_LESSONS.md` + `docs/ARCHITECTURE_MAP.md`)
- https://github.com/SandroMaglione/spirit-call — the repo (licence unverified by me: check `LICENSE` first)
- https://github.com/SandroMaglione/spirit-call/blob/main/docs/vision.md — pillars, no timers, fairness
- https://github.com/SandroMaglione/spirit-call/blob/main/docs/models.md — glTF model contract (we reuse it)
- https://github.com/SandroMaglione/spirit-call/blob/main/docs/enemies.md — enemy design, telegraph floors
- https://github.com/SandroMaglione/spirit-call/blob/main/DEVELOPMENT.md and AGENTS.md — how it was built with agents
- https://www.sandromaglione.com/newsletter — announced guide "Indie game development with AI" (check if published)

## B. Agent skills & MCP tools
| Link | Use | Phase | Notes |
|---|---|---|---|
| https://github.com/gamedev-skills/awesome-gamedev-agent-skills | **USE** | 0 | Apache-2.0; skills: game-feel, three.js, game-ai, prototype-fast, performance-optimization, level-design, input, camera-systems, create-game-assets |
| https://github.com/ahujasid/blender-mcp (PyPI `mcp-for-blender`) | **USE** | 0, 4 | MIT; `codex mcp add blender -- uvx mcp-for-blender`; safe mode; no auth on the socket |
| https://pypi.org/project/blenderlens-mcp/ | **USE (asset gate)** | 0, 4 | Apache-2.0, beta 0.2.0, CLI `check` exit codes; pin version |
| https://github.com/arjun988/blender-skills | **USE** | 4 | MIT; modeling/export/reference-match skills |
| `npx threejs-devtools-mcp` (glama.ai/mcp/servers/Rao419/threejs-devtools-mcp) | **USE (optional)** | 0, 5 | MIT, 59 tools; needs the game tab open; name your objects |
| https://github.com/img2threejs/img2threejs | **USE** | 4 | Apache-2.0; code-built props/parts from an image |
| https://github.com/achimala/dream-loop (`npx skills add achimala/dream-loop`) | **USE** | 0, 4 | critic loop with a fresh judge; MIT |
| https://github.com/sloemo01/diorama | **STUDY/SPIKE** | 0 | pixel look dropped; borrow "frame = pure function of time" + QA harness idea; verify licence |
| https://github.com/typeonce-dev/ritmo · https://ritmo.typeonce.dev/ | **SPIKE S2** | 0 | MIT; README packages: ritmo, ritmo-math, ritmo-browser, ritmo-render (generic bridge), ritmo-pixi, ritmo-devtools; site claims multiplayer + rollback netcode and a two-player Town demo, but no netcode package is listed in the README: verify in code; `npx @typeonce/ritmo-tools` is for pixel/sound tools (not needed) |
| https://www.spritecook.ai/agents | **SKIP for now** | — | pixel-art oriented; free tier outputs public; only if icons can't be done in code |
| https://github.com/lemomo-ai/lemo-opuscar, https://github.com/Vincentwei1021/mg-styles-15 | **STUDY** | 0 | one-frame approval gate, STYLE/rubric patterns |
| https://github.com/Vincentwei1021/mg-styles-15, https://github.com/MaxLiu22/Motion2MixamoRig, https://github.com/sixtysevenlf/dsh-blender-plugin, https://github.com/scenario-labs/blender-plugin, VibeIncStudio/ai-art-team | **SKIP** | — | humanoid-only / non-commercial / needs GPU / paid (see PLAYBOOK §12) |

## C. Asset sources
| Link | Licence (verified) | Use |
|---|---|---|
| https://polyfork.dev/assets (licence: https://polyfork.dev/licensing) | games OK, no attribution, no resale/redistribution, no training a commercial generator; fetch on demand, send a User-Agent, back off on 429 | props only; log each file |
| https://kenney.nl/assets | CC0 | placeholders, UI |
| https://quaternius.itch.io/ | CC0 | reference/blockout |
| https://game-icons.net | verify (attribution likely) | icons only if needed |
| Mixamo, Freesound, OpenGameArt, itch.io, Lospec | per asset/terms | not needed for the slice (no humanoids, no audio) |
| AI mesh generators (Meshy/Tripo/TRELLIS) | free tiers attribution/non-commercial | **reference only, never shipped** |

## D. Style & mechanics study
- https://gameartstyle.loopyhop.com/ — style atlas (does not license art)
- https://gameplayatlas.loopyhop.com/ — 280 mechanics (check reuse terms)
- Three.js docs: https://threejs.org/docs/ (toon/outline: `ToonOutlinePassNode`; matcap material `MeshMatcapMaterial`)
- Blender 5.2 LTS: https://www.blender.org/releases/5-2/

## E. Models (Codex)
Astra for pipeline setup/Blender loops/final audits; Sol as default coder; Luna for bulk. Raise effort before switching model. See `docs/PLAYBOOK.md` §5 and `docs/PHASES.md`.
