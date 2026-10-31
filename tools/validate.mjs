import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { defaults, palettes, scenes, floorLayout, foundry } from '../src/content/scene.mjs';
assert.equal(Object.keys(palettes).length, 5);
for (const value of Object.values(defaults)) assert.ok(Number.isFinite(value) && value >= 0);
assert.equal(new Set(scenes).size, scenes.length);
const layout = floorLayout();
assert.equal(new Set(layout.map(t => `${t.x},${t.z}`)).size, layout.length);
for (const axis of ['x','z']) {
 const span = (Math.max(...layout.map(t => t[axis])) - Math.min(...layout.map(t => t[axis])) + 1) * foundry.tileSpacing;
 assert.ok(span >= 47 && span <= 49, 'Foundry footprint must stay near 48 world units');
}
for (const folder of ['src/app', 'src/content', 'src/presentation', 'src/ui']) {
  for (const file of await readdir(folder)) {
    const source = await readFile(`${folder}/${file}`, 'utf8');
    assert.ok(!/from\s+['"][^'"]*(?:ref\/|art\/)/.test(source), `Forbidden reference import: ${folder}/${file}`);
    assert.ok(!/https?:\/\//.test(source), `Unexpected network asset: ${folder}/${file}`);
  }
}
console.log('Content and source asset validation passed. Trial and encounter simulations are covered by replay/combat tests and Ritmo lints.');
