import test from 'node:test';
import assert from 'node:assert/strict';
import {combatDefaults as t} from '../src/content/combat.ts';
import {enemyStats,waves} from '../src/content/encounter.ts';
import {upgrades,upgradedTuning,upgradeChoices} from '../src/content/upgrades.ts';
import {initialRun,spawnEnemy} from '../src/sim/run-schema.ts';
import {stepRun} from '../src/sim/run-rules.ts';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {idleCommand} from '../src/sim/schema.ts';
function scenario(kind,x=0,z=0){const s=initialRun(t);s.hero.x=0;s.hero.z=0;s.hero.bonkCooldown=99999;s.enemies=[spawnEnemy(kind,0,0,t)];Object.assign(s.enemies[0],{x,z,prevX:x,prevZ:z,faceX:1,faceZ:0,behavior:{kind:'chase'}});s.phase={kind:'fight',wave:0,nextSpawn:waves[0].length};return s;}
test('all three attack slots are shared with flying rivets; the live spawn cap stays bounded',()=>{
 let s=scenario('thrower');s.enemies=Array.from({length:8},(_,i)=>({...spawnEnemy('thrower',i,0,t),x:i*.02,z:2,behavior:{kind:'chase'}}));
 s=stepRun(s,idleCommand,t);assert.equal(s.enemies.filter(e=>e.behavior.kind==='windup').length,3);
 for(let i=0;i<200;i++){
  s=stepRun(s,idleCommand,{...t,heroHP:100000});
  const owners=new Set(s.projectiles.map(p=>p.owner));for(const e of s.enemies)if(e.behavior.kind==='windup'||e.behavior.kind==='lunge')owners.add(e.id);
  assert.ok(owners.size<=3);assert.ok(s.enemies.filter(e=>e.hp>0).length<=12);
 }
 let q=initialRun({...t,enemyCap:3});assert.equal(q.enemies.length,3);q.enemies[0].hp=0;q.enemies[0].behavior={kind:'defeated'};q=stepRun(q,idleCommand,{...t,enemyCap:3});assert.equal(q.enemies.filter(e=>e.hp>0).length,3);assert.equal(q.phase.nextSpawn,4);
});
test('Thrower aim locks for the full warning before emitting a bounded projectile',()=>{
 let s=scenario('thrower',6,0);s=stepRun(s,idleCommand,t);assert.equal(s.enemies[0].behavior.kind,'windup');
 const aim={...s.enemies[0].behavior};for(let i=0;i<t.throwerWindupTicks-1;i++)s=stepRun(s,{x:0,z:1,dash:false},t);assert.equal(s.projectiles.length,0);
 assert.equal(s.enemies[0].behavior.dx,aim.dx);assert.equal(s.enemies[0].behavior.dz,aim.dz);
 s=stepRun(s,idleCommand,t);assert.equal(s.projectiles.length,1);assert.equal(s.projectiles[0].dx,aim.dx);assert.equal(s.projectiles[0].dz,aim.dz);
});
test('Shieldsaw armour reduces only frontal damage and Stomp interrupts the charge',()=>{
 let front=scenario('shieldsaw',-2,0),back=scenario('shieldsaw',2,0);front=stepRun(front,{...idleCommand,ability:'pulse'},t);back=stepRun(back,{...idleCommand,ability:'pulse'},t);
 assert.equal(front.enemies[0].hp,38.8);assert.equal(back.enemies[0].hp,28);
 let s=scenario('shieldsaw',1,0);s.enemies[0].behavior={kind:'lunge',remaining:60,dx:-1,dz:0,hasHit:false};s=stepRun(s,{...idleCommand,ability:'stomp'},t);assert.equal(s.enemies[0].behavior.kind,'recover');assert.equal(s.hero.hp,100);
});
test('Grinder cannot hit before its complete warning and dash protects the sweep',()=>{
 let s=scenario('grinder',2,0);s=stepRun(s,idleCommand,t);for(let i=0;i<t.grinderWindupTicks-1;i++)s=stepRun(s,idleCommand,t);assert.equal(s.hero.hp,100);
 s=stepRun(s,idleCommand,t);assert.equal(s.hero.hp,80);assert.equal(s.enemies[0].behavior.kind,'recover');
 s=scenario('grinder',2,0);s.enemies[0].behavior={kind:'windup',remaining:1,dx:-1,dz:0};s=stepRun(s,{...idleCommand,dash:true},t);assert.equal(s.hero.hp,100);
});
test('all-clear gates upgrades, rejects forged choices, freezes combat and advances exactly once',()=>{
 let s=initialRun(t);for(const e of s.enemies.slice(0,-1)){e.hp=0;e.behavior={kind:'defeated'};}s=stepRun(s,idleCommand,t);assert.equal(s.phase.kind,'fight');
 for(const e of s.enemies){e.hp=0;e.behavior={kind:'defeated'};}s.projectiles=[];s=stepRun(s,idleCommand,t);assert.equal(s.phase.kind,'upgrade');
 const before=s.hero.x,cd=s.hero.pulseCooldown,choice=s.phase.choices[0];s=stepRun(s,{x:1,z:0,dash:true,upgrade:'forged'},t);assert.equal(s.phase.kind,'upgrade');assert.equal(s.hero.x,before);assert.equal(s.hero.pulseCooldown,cd);
 s=stepRun(s,{...idleCommand,upgrade:choice},t);assert.equal(s.phase.kind,'fight');assert.equal(s.phase.wave,1);assert.deepEqual(s.upgrades,[choice]);assert.equal(s.enemies.length,8);
 s=stepRun(s,{...idleCommand,upgrade:choice},t);assert.equal(s.upgrades.length,1);
});
test('all twelve upgrades affect their stated stat and offers contain three unique unpicked choices',()=>{
 assert.equal(upgrades.length,12);for(const u of upgrades){const after=upgradedTuning(t,[u.id]);assert.notEqual(after[u.stat],t[u.stat]);}
 const picked=[];for(let wave=0;wave<3;wave++){const choices=upgradeChoices(wave,picked);assert.equal(new Set(choices).size,3);assert.ok(choices.every(id=>!picked.includes(id)));picked.push(choices[0]);}
});
test('Heat persists across upgrades and four cleared waves enter the boss',()=>{
 let s=initialRun(t);s.hero.heat=90;
 for(let wave=0;wave<4;wave++){
  for(const e of s.enemies){e.hp=0;e.behavior={kind:'defeated'};}s.phase.nextSpawn=waves[wave].length;s=stepRun(s,idleCommand,t);
  if(wave<3){assert.equal(s.phase.kind,'upgrade');s=stepRun(s,{...idleCommand,upgrade:s.phase.choices[0]},t);assert.equal(s.phase.wave,wave+1);assert.equal(s.hero.heat,90);}
 }
 assert.equal(s.phase.kind,'boss');assert.equal(s.phase.boss.hp,t.bossHP);assert.ok(s.enemies.every(e=>e.hp===0));
});
test('run replay, JSON snapshots and detached projections agree through wave transitions',()=>{
 const config={...t,heroHP:10000,bonkDamage:1000,pulseDamage:1000,pulseRadius:60,pulseCooldownTicks:1};const a=createRunSimulation(config),b=createRunSimulation(config);let s=a.view();
 const commands=[];for(let i=0;i<240;i++){const c=s.phase.kind==='upgrade'?{...idleCommand,upgrade:s.phase.choices[0]}:{...idleCommand,ability:'pulse',overdrive:true};commands.push(c);s=a.step(c);b.step(c);}
 assert.deepEqual(a.view(),b.view());assert.equal(s.phase.kind,'complete');assert.ok(s.upgrades.length===3);
 const saved=a.snapshot();assert.ok(saved.ok);const restored=createRunSimulation(config);assert.ok(restored.restore(JSON.parse(JSON.stringify(saved.value))).ok);assert.deepEqual(restored.view(),s);const v=restored.view();v.hero.hp=1;assert.notEqual(restored.view().hero.hp,1);
 assert.ok(commands.some(c=>c.upgrade));
});
test('enemy kind data cover all four roles',()=>{for(const kind of ['sawlet','thrower','shieldsaw','grinder']){const stats=enemyStats(kind,t);assert.ok(stats.hp>0&&stats.windup>=24&&stats.recovery>0);}});
test('isolated warnings allow a perpendicular dodge after 0.25 s and 0.4 s reaction delays',()=>{
 for(const kind of ['sawlet','thrower','shieldsaw','grinder'])for(const delay of [15,24]){
  let s=scenario(kind,kind==='thrower'?6:2,0);s=stepRun(s,idleCommand,t);
  for(let i=0;i<120;i++)s=stepRun(s,{x:0,z:i>=delay?1:0,dash:i===delay},t);
  assert.equal(s.hero.hp,100,`${kind}, ${delay/60}s reaction`);
 }
});
test('Ritmo determinism audit covers sustained multi-enemy attacks',async()=>{
 const {Determinism}=await import('@typeonce/ritmo-devtools');const {HostClock}=await import('@typeonce/ritmo');const {runUpdate}=await import('../src/sim/run-runtime.ts');
 const result=Determinism.check(()=>({runtime:createRunSimulation({...t,heroHP:10000},true).runtime,schedules:{update:runUpdate}}),{hostClock:HostClock.test(),schedule:'update',frames:2400});assert.ok(result.ok,JSON.stringify(result));
});
test('every upgrade is reachable through the three between-wave offers',()=>{
 const seen=new Set();function visit(picked=[]){if(picked.length===3)return;for(const id of upgradeChoices(picked.length,picked)){seen.add(id);visit([...picked,id]);}}visit();assert.equal(seen.size,upgrades.length);
});
