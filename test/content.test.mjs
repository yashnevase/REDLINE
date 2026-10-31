import test from 'node:test';
import assert from 'node:assert/strict';
import { floorLayout, random } from '../src/content/scene.mjs';
test('layout is reproducible regardless of earlier calls', () => {
  const first = floorLayout(4107); floorLayout(91);
  assert.deepEqual(floorLayout(4107), first);
  assert.notDeepEqual(floorLayout(4108), first);
});
test('seeded generator stays finite and normalized', () => {
  const rng = random(0); for (let i = 0; i < 10000; i++) { const n = rng(); assert.ok(n >= 0 && n < 1); }
});
