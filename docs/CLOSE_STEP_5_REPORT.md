# CLOSE Step 5 — saves, missions and garage

| ID | Status | Evidence and behavior |
|---|---|---|
| CL14 | DONE | Version-2 validated profile; v1 migration preserves unlock/equipment/clears. Four mission scores/stars, cosmetics, last mission, tutorial/settings/daily fields. localStorage plus asynchronous IndexedDB copy/fallback; corrupt raw backup; validated JSON export/import with size bound. `test/chapter-close.test.mjs`, functional browser audit. |
| CL15 | DONE | All three missions and Rex selectable from a clean save, visible goals/stars/bests/tools, Continue last mission and full-chapter route. Mission mode is saved simulation state; levels finish without a Blade reward, Rex alone unlocks it. Clean/existing browser runs replay headlessly. |
| CL16 | DONE | Rotatable 3D garage, registry-driven Arms/Q, Back/E, Legs/X cards, Core/Blade equip/default restoration, future chapter silhouettes, stat preview, socket snap feedback, star-gated finishes/trails/eyes and Rex trophy stripes. Unlock/equipment/cosmetics survive reload. |

The old core/blade equipment controls remain in the hangar; garage hides duplicate legacy panels. Narrow screens scroll parts/specs rather than covering the Core. Default Back/Legs are the available Chapter 1 parts; future slots are labelled and disabled. There is no Chapter 2 implementation or arbitrary runtime loadout change.

`src/content/parts.ts` owns part/cosmetic/mission content; pure profile validation/recording is in `content/profile.ts`; browser storage in `save/profile.ts`; new run options are validated state. Rendering reads cosmetics and cannot grant stars/equipment. Only a real boss→complete reward transition writes the unlock. Old v1 profile key remains readable; new writes use `redline.profile.v2`.

Evidence: 130 tests/check/build, `shots/close-chapter/mission-runs.json` and `functional.json`, four-size mission/garage captures, clean/migrated unlock/equip/import/export checks. Existing 54-case rendering budgets remain: Standard92/58,698, Low70/24,292, High separate. Profile import validation is not an anti-cheat system; saves are local owner data.

Owner audit: lobby orbit, understandable tools/upgrades/goals, input glyphs/bindings, wave repair, three levels→Rex→Blade, replayability, non-mobile-only layouts and reversible ID commits are retained. **Not done:** final owner garage/art/feel acceptance; no human test results are invented.
