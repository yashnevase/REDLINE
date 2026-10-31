import test from 'node:test';
import assert from 'node:assert/strict';
import {combatDefaults as t} from '../src/content/combat.ts';
import {initialRun,runSchema} from '../src/sim/run-schema.ts';
import {stepRun} from '../src/sim/run-rules.ts';
import {idleCommand} from '../src/sim/schema.ts';
import {waves} from '../src/content/encounter.ts';
import {makeCameraFollow} from '../src/presentation/camera-follow.ts';
test('staggered queue survives JSON restore, observes cadence, and never skips the full-clear gate',()=>{
 let s=initialRun(t);assert.equal(s.enemies.length,5);let previousCount=5,lastSpawn=0;const intervals=[];
 for(let i=0;i<400;i++){const before=s;s=stepRun(JSON.parse(JSON.stringify(s)),idleCommand,{...t,heroHP:10000,bonkDamage:.001});if(s.phase.kind==='fight'&&s.phase.nextSpawn>previousCount){intervals.push(s.tick-lastSpawn);lastSpawn=s.tick;previousCount=s.phase.nextSpawn;}assert.ok(s.enemies.length<=12);assert.equal(before.phase.kind,'fight');}
 assert.equal(previousCount,8);assert.equal(intervals.length,3);assert.ok(intervals.every(n=>n>=48&&n<=90));assert.equal(s.phase.kind,'fight');
 const legacy=initialRun(t);delete legacy.phase.nextSpawnIn;assert.equal(runSchema.parse(legacy).phase.nextSpawnIn,0);
 assert.deepEqual(waves.map(w=>w.length),[8,9,11,12]);
});
test('default opening closes to bonk range before three seconds without attacking slots exceeding three',()=>{
 let s=initialRun(t),contact=0;for(let i=0;i<180;i++){s=stepRun(s,idleCommand,t);if(s.events.some(e=>e.kind==='bonk')){contact=s.tick;break;}assert.ok(s.enemies.filter(e=>['lunge','windup'].includes(e.behavior.kind)).length<=3);}assert.ok(contact>0&&contact<180,`first bonk tick ${contact}`);
});
test('camera follow stays inside the slab, converges without overshoot, and resets on a new run',()=>{
 const follow=makeCameraFollow();follow.update({x:0,z:0,vx:0,vz:0},0,1.2,.16,4);let previous=0,result;
 for(let i=0;i<120;i++){result=follow.update({x:23,z:-23,vx:6,vz:-6},1/60,1.2,.16,4);assert.ok(result.x>=previous&&result.x<=20);assert.ok(result.z>=-20);previous=result.x;}assert.ok(result.x>19.99);follow.reset();assert.deepEqual(follow.update({x:0,z:0,vx:0,vz:0},0,1.2,.16,4),{x:0,z:0});
});
test('armour reduces ability damage while preserving heavy hit-stop; debug tuning cannot shorten warnings',async()=>{
 const {tuningSchema}=await import('../src/content/combat.ts');let s=initialRun(t);s.hero.x=0;s.hero.z=0;s.enemies=[{id:0,kind:'shieldsaw',x:-2,z:0,prevX:-2,prevZ:0,hp:40,faceX:1,faceZ:0,behavior:{kind:'chase'}}];s.phase.nextSpawn=8;
 s=stepRun(s,{...idleCommand,ability:'pulse'},t);assert.equal(s.enemies[0].hp,38.8);assert.equal(s.hitstop,t.heavyHitstopTicks);
 for(const [key,value] of [['windupTicks',23],['throwerWindupTicks',23],['shieldWindupTicks',23],['grinderWindupTicks',47]])assert.equal(tuningSchema.safeParse({...t,[key]:value}).success,false);
});
