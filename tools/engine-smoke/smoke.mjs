import assert from 'node:assert/strict';
import { createSmoke, commands } from './runtime.mjs';
const first=createSmoke(),second=createSmoke();
for(const command of commands) assert.deepEqual(first.step(command),second.step(command));
assert.equal(first.view().x,4);assert.equal(first.view().collided,true);assert.equal(first.view().charges,1);
const dash=createSmoke();dash.step({x:1,dash:true});assert.equal(dash.view().remaining,12);assert.ok(dash.view().x>6/60);
console.log('Ritmo 0.19.1: move/dash/collision/replay passed; WebGL draw checked separately.');
