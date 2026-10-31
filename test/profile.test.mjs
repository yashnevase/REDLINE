import test from 'node:test';
import assert from 'node:assert/strict';
import {freshProfile,decodeProfile,awardBlade,equipProfile} from '../src/content/profile.ts';
test('profile starts locked, rejects corrupt/future/forged data and round-trips unlock/equipment',()=>{
 const fresh=freshProfile();assert.equal(equipProfile(fresh,'blade').equipped,'core');
 for(const text of [null,'{broken','{"version":2}','{"version":1,"bladeUnlocked":false,"equipped":"blade","clears":0}'])assert.deepEqual(decodeProfile(text),fresh);
 const cleared=awardBlade(fresh);assert.equal(cleared.bladeUnlocked,true);assert.equal(cleared.clears,1);const equipped=equipProfile(cleared,'blade');assert.deepEqual(decodeProfile(JSON.stringify(equipped)),equipped);assert.equal(equipProfile(equipped,'core').bladeUnlocked,true);
});
