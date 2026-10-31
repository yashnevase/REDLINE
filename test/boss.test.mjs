import test from 'node:test';
import assert from 'node:assert/strict';
import {combatDefaults as t} from '../src/content/combat.ts';
import {initialRun,initialBoss} from '../src/sim/run-schema.ts';
import {stepRun} from '../src/sim/run-rules.ts';
import {bossStage} from '../src/content/boss.ts';
import {idleCommand} from '../src/sim/schema.ts';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
function arena(){const s=initialRun(t);s.enemies=[];s.phase={kind:'boss',boss:initialBoss(t)};s.hero.x=0;s.hero.z=0;s.hero.bonkCooldown=9999;s.phase.boss.x=2;s.phase.boss.z=0;return s;}
test('approved HP thresholds unlock attacks and enrage without shortening warnings',()=>{
 assert.deepEqual([600,420,240,120].map(hp=>bossStage(hp,t)),[1,2,3,4]);
 for(const hp of [600,400,200,100]){let s=arena();const moves=new Set();for(let i=0;i<5;i++){s.phase.boss.hp=hp;s.phase.boss.behavior={kind:'recover',remaining:1};s=stepRun(s,idleCommand,t);moves.add(s.phase.boss.behavior.kind);assert.ok(s.phase.boss.behavior.remaining>=48);}
 assert.ok(moves.has('chomp-warning'));assert.equal(moves.has('sweep-warning'),hp<420);assert.equal(moves.has('volley-warning'),hp<240);}
});
test('sweep gap is safe, the sector damages once and dash protects',()=>{
 for(const [z,dash,expected] of [[2,false,100],[-2,false,80],[-2,true,100]]){let s=arena();s.phase.boss.x=0;s.phase.boss.z=0;s.hero.z=z;s.phase.boss.behavior={kind:'sweep-warning',remaining:1,gapX:0,gapZ:1};s=stepRun(s,{...idleCommand,dash},t);assert.equal(s.hero.hp,expected);assert.equal(s.phase.boss.behavior.kind,'recover');}
});
test('boss chomp hits once, volleys lock five targets and summons respect caps',()=>{
 let s=arena();s.phase.boss.behavior={kind:'charge',remaining:20,dx:0,dz:0,hasHit:false};for(let i=0;i<12;i++)s=stepRun(s,idleCommand,t);assert.equal(s.hero.hp,75);
 s=arena();s.phase.boss.hp=200;s.phase.boss.sequence=2;s.phase.boss.behavior={kind:'recover',remaining:1};s=stepRun(s,idleCommand,t);assert.equal(s.phase.boss.behavior.kind,'volley-warning');const targets=JSON.stringify(s.phase.boss.behavior.targets);s=stepRun(s,{x:-1,z:0,dash:false},t);assert.equal(JSON.stringify(s.phase.boss.behavior.targets),targets);
 s=arena();s.phase.boss.behavior={kind:'summon-warning',remaining:1,targets:[{x:4,z:4},{x:1,z:4},{x:-2,z:4}]};s=stepRun(s,idleCommand,{...t,enemyCap:3});assert.equal(s.enemies.length,2);assert.ok(s.enemies.every(e=>e.kind==='sawlet'));
});
test('Blade Q starts a timed spin in either facing direction and respects cooldown',()=>{
 for(const face of [1,-1]){let s=arena();s.loadout='blade';s.bladeFireIn=999;s.hero.faceX=face;s.phase.boss.faceX=0;s.phase.boss.faceZ=1;s=stepRun(s,{...idleCommand,ability:'pulse'},t);assert.equal(s.phase.boss.hp,588);assert.equal(s.hero.pulseCooldown,120);assert.ok(s.events.some(e=>e.kind==='blade'));assert.equal(s.hero.special.remaining,42);}
});
test('boss victory alone grants a reward, clears hazards, and snapshot restores boss/Blade state',()=>{
 let s=arena();s.phase.boss.hp=2;s=stepRun(s,{...idleCommand,ability:'pulse'},t);assert.deepEqual(s.phase,{kind:'complete',reward:'blade'});assert.equal(s.enemies.length,0);assert.equal(s.projectiles.length,0);
 const sim=createRunSimulation(t,false,'blade');const saved=sim.snapshot();assert.ok(saved.ok);saved.value.resources['Redline/Run']=arena();saved.value.resources['Redline/Run'].loadout='blade';assert.ok(sim.restore(JSON.parse(JSON.stringify(saved.value))).ok);const copy=createRunSimulation(t);const again=sim.snapshot();assert.ok(again.ok);assert.ok(copy.restore(JSON.parse(JSON.stringify(again.value))).ok);for(let i=0;i<400;i++)assert.deepEqual(sim.step(idleCommand),copy.step(idleCommand));
});
test('replacement Q receives Q upgrades and legacy run snapshots default to Core',async()=>{
 const {upgradedTuning}=await import('../src/content/upgrades.ts');const tuned=upgradedTuning(t,['pulse-power','pulse-radius','pulse-recharge']);assert.equal(tuned.bladeDamage,30);assert.ok(Math.abs(tuned.bladeSpinRadius-3)<1e-9);assert.equal(tuned.bladeCooldownTicks,96);
 const sim=createRunSimulation();const saved=sim.snapshot();assert.ok(saved.ok);delete saved.value.resources['Redline/Run'].loadout;assert.ok(sim.restore(JSON.parse(JSON.stringify(saved.value))).ok);assert.equal(sim.view().loadout,'core');
});
test('Ritmo audits sustained enraged boss attacks deterministically',async()=>{
 const {Determinism}=await import('@typeonce/ritmo-devtools');const {HostClock}=await import('@typeonce/ritmo');const {runUpdate}=await import('../src/sim/run-runtime.ts');
 const make=()=>{const config={...t,heroHP:10000,bonkDamage:.001};const sim=createRunSimulation(config,true);const saved=sim.snapshot();assert.ok(saved.ok);const s=arena();s.hero.hp=10000;s.phase.boss.hp=100;saved.value.resources['Redline/Run']=s;assert.ok(sim.restore(saved.value).ok);return{runtime:sim.runtime,schedules:{update:runUpdate}};};
 const result=Determinism.check(make,{hostClock:HostClock.test(),schedule:'update',frames:2400});assert.ok(result.ok,JSON.stringify(result));
});
