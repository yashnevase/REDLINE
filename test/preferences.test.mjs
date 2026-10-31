import test from 'node:test';
import assert from 'node:assert/strict';
import {decodePreferences,defaultPreferences} from '../src/content/preferences.ts';
test('preferences use OS motion default and reject corrupt/future/out-of-range values',()=>{
 assert.equal(decodePreferences(null,true).reducedMotion,true);for(const raw of ['{','{"version":2}','{"version":1,"quality":"ultra"}'])assert.deepEqual(decodePreferences(raw),defaultPreferences());const wanted={version:1,reducedMotion:true,reducedFlashes:true,quality:'low',zoom:'default'};assert.deepEqual(decodePreferences(JSON.stringify(wanted)),wanted);
});
