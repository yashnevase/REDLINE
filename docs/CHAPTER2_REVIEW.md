# Bog Moon — owner reference review
2026-11-03. Chapter 2 pre-production candidates, not runtime screenshots. The current acceptance gate is in ROUND4_AND_CHAPTER2.md; no Chapter 2 runtime or tag movement is recorded as approved yet.

Review the five directions below. Arena images define palette, atmosphere and depth; their exact pools/paths are not a collision plan. Enemy and boss images define silhouettes; final gameplay scale and readability still need in-engine evidence. The approved Core keeps exactly two white eyes and two red crown slashes, including when Frog Legs are equipped.

## C1 Arena

Purple space, teal pools and mossy stone; warm amber lamps; open combat route and deep underside.

![C1 Arena](/Users/yashnevse/Desktop/REDLINE/redline-pack/art/ch2-ref/arena-candidate-v1.png)

## C2 Enemy lineup

Five distinct orb roles: Skipper, Croaker, Bogbulb, Tongue Lasher and Heavy Toad. Floating leg parts and hero scale.

![C2 Enemy lineup](/Users/yashnevse/Desktop/REDLINE/redline-pack/art/ch2-ref/enemy-lineup-candidate-v1.png)

## C3 Bogtyrant Gulp

Large detached legs, drum belly and visible exposed weak spot; calm and enraged directions.

![C3 Bogtyrant Gulp](/Users/yashnevse/Desktop/REDLINE/redline-pack/art/ch2-ref/gulp-boss-candidate-v1.png)

## C4 Frog Legs

Lower-socket spring legs and glowing links. Extra crown strokes in this candidate are image drift; runtime Core retains two.

![C4 Frog Legs](/Users/yashnevse/Desktop/REDLINE/redline-pack/art/ch2-ref/frog-legs-candidate-v1.png)

## C1 Chaos state

Spore/splash energy with a readable hero, quiet ground and peripheral mist.

![C1 Chaos state](/Users/yashnevse/Desktop/REDLINE/redline-pack/art/ch2-ref/arena-chaos-candidate-v1.png)

## Implementation after acceptance
Follow CHAPTER2_DESIGN.md: data/registry and save compatibility; deterministic hop/pool/ring/tongue combat; models and swamp arena; Gulp; Frog Legs and missions; audio, bots, inputs, performance and owner evidence. Chapter 1 code and historical tags remain retrievable. The completion tag moves only after explicit acceptance; first-time-player results are never inferred from bot runs.

Exact generation prompts and built-in imagegen provenance: CHAPTER2_REFERENCE_PROMPTS.md. Local candidate inventory: art/ch2-ref/NOTES.md. References remain excluded from production and Git.
