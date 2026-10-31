import test from 'node:test';
import assert from 'node:assert/strict';
import {combatDefaults as t} from '../src/content/combat.ts';
import {initialState,idleCommand,heroSchema} from '../src/sim/schema.ts';
import {advanceHero,endDash} from '../src/sim/hero.ts';
import {initialRun} from '../src/sim/run-schema.ts';
import {stepRun} from '../src/sim/run-rules.ts';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
const intent=(dashInput)=>({...idleCommand,x:1,dashInput});
function hero(){const h=initialState(t).hero;h.x=h.prevX=0;h.z=h.prevZ=0;return h;}
function tick(h,c=idleCommand){h.prevX=h.x;h.prevZ=h.z;advanceHero(h,c,t,()=>{});endDash(h);}
test('tap travels 4u, shared lock prevents chaining, double-tap commits one Rush',()=>{
 let h=hero();tick(h,intent('press'));tick(h,intent('release'));assert.equal(h.dash.variant,'tap');const start=h.prevX;for(let i=0;i<11;i++)tick(h);assert.ok(Math.abs(h.x-start-4)<1e-8);assert.equal(h.charges,1);tick(h,{...idleCommand,dash:true});assert.equal(h.dash.kind,'idle');
 h=hero();tick(h,intent('press'));tick(h,intent('release'));tick(h,intent('press'));tick(h,intent('release'));assert.equal(h.dash.variant,'rush');assert.equal(h.dash.distance,6.5);assert.equal(h.charges,1);for(let i=0;i<11;i++)tick(h);assert.equal(h.dash.protected,false);assert.equal(h.dash.kind,'active');
});
test('hold threshold, maximum Charge, protection expiry and Q cancellation are deterministic',()=>{
 let h=hero();tick(h,intent('press'));for(let i=0;i<35;i++)tick(h);tick(h,intent('release'));assert.equal(h.dash.variant,'charge');assert.equal(h.dash.distance,9);assert.equal(h.dashCooldown,78);for(let i=0;i<11;i++)tick(h);assert.equal(h.dash.protected,false);assert.equal(h.dash.kind,'active');
 h=hero();tick(h,intent('press'));for(let i=0;i<15;i++)tick(h);h.abilityBuffer='pulse';h.abilityBufferTicks=5;tick(h,{...idleCommand,ability:'pulse'});assert.equal(h.dash.kind,'idle');assert.equal(h.charges,2);assert.equal(h.pulseCooldown,120);tick(h,intent('release'));assert.equal(h.dash.kind,'idle');assert.equal(h.charges,2);
});
test('Rush swept hits each target once; Blade Spin hits behind and cannot repeat damage',()=>{
 let s=initialRun({...t,sawletHP:100});s.enemies=s.enemies.slice(0,2);s.enemies.forEach((e,i)=>{e.x=i?1.1:-1.1;e.z=0;e.hp=100;e.behavior={kind:'recover',remaining:999};});s.hero.x=s.hero.z=0;s.hero.bonkCooldown=999;
 s.loadout='blade';s=stepRun(s,{...idleCommand,ability:'pulse'},{...t,sawletHP:100});assert.deepEqual(s.enemies.map(e=>e.hp),[76,76]);for(let i=0;i<30;i++)s=stepRun(s,idleCommand,{...t,sawletHP:100});assert.deepEqual(s.enemies.map(e=>e.hp),[76,76]);
 s=initialRun({...t,sawletHP:100});s.enemies=s.enemies.slice(0,1);const e=s.enemies[0];e.x=1;e.z=0;e.hp=100;e.behavior={kind:'recover',remaining:999};s.hero.x=s.hero.z=0;s.hero.bonkCooldown=999;s.hero.dash={kind:'active',remaining:18,dx:1,dz:0,protected:true,protectionTicks:12,variant:'rush',distance:6.5,duration:18,hits:[]};for(let i=0;i<15;i++){s.hitstop=0;s=stepRun(s,idleCommand,{...t,sawletHP:100});}assert.equal(s.enemies[0].hp,82);
});
test('Charge + spin/hop saved state round-trips; legacy hero defaults; replay matches',()=>{
 const a=createRunSimulation(),b=createRunSimulation();a.step(intent('press'));for(let i=0;i<19;i++)a.step(idleCommand);const saved=a.snapshot();assert.ok(saved.ok);assert.ok(b.restore(JSON.parse(JSON.stringify(saved.value))).ok);for(const c of [intent('release'),...Array.from({length:100},()=>idleCommand)])assert.deepEqual(a.step(c),b.step(c));
 const old=initialState(t).hero;for(const k of ['dashCooldown','tapWindow','dashReleaseBuffer','special'])delete old[k];const parsed=heroSchema.parse(old);assert.equal(parsed.dashCooldown,0);assert.deepEqual(parsed.special,{kind:'idle'});
});
test('release buffered during hit-stop commits once; ability cancels held charge without spending a cell',()=>{
 let s=initialRun(t);s.hero.dash={kind:'charging',ticks:30};s.hitstop=2;s=stepRun(s,intent('release'),t);assert.equal(s.hero.dashReleaseBuffer,true);s=stepRun(s,idleCommand,t);s=stepRun(s,idleCommand,t);assert.equal(s.hero.dash.variant,'charge');assert.equal(s.hero.charges,1);s=initialRun(t);s.hero.dash={kind:'charging',ticks:30};s.hitstop=1;s=stepRun(s,{...idleCommand,ability:'pulse'},t);s=stepRun(s,idleCommand,t);assert.equal(s.hero.dash.kind,'idle');assert.equal(s.hero.charges,2);
});
test('Boost hop and Spin overlap without truncating the approved 0.7-second attack',()=>{
 let s=initialRun(t,'blade');s=stepRun(s,{...idleCommand,ability:'pulse'},t);s=stepRun(s,{...idleCommand,ability:'boost'},t);assert.equal(s.hero.special.kind,'spin');assert.equal(s.hero.special.remaining,41);assert.equal(s.hero.special.hopRemaining,t.boostHopTicks);const sim=createRunSimulation(t,false,'blade'),saved=sim.snapshot();assert.ok(saved.ok);saved.value.resources['Redline/Run']=s;assert.ok(sim.restore(JSON.parse(JSON.stringify(saved.value))).ok);assert.deepEqual(sim.view().hero.special,s.hero.special);
});
test('legacy snapshots without dash-family or special state restore with neutral defaults',()=>{
 const sim=createRunSimulation(),saved=sim.snapshot();assert.ok(saved.ok);const state=saved.value.resources['Redline/Run'];for(const key of ['special','dashCooldown','tapWindow','dashReleaseBuffer','dashReleaseSuppressed'])delete state.hero[key];for(const key of ['dashSharedCooldownTicks','dashDoubleTapTicks','dashHoldTicks','dashChargeTicks','rushDistance','rushTicks','rushDamageFactor','chargeMaxDistance','chargeDashTicks','chargeCooldownTicks','bladeSpinTicks','bladeSpinRadius','bladePull','boostDamage','boostConeDot','boostRadius','boostHopTicks','spawnDropTicks'])delete saved.value.resources['Redline/Tuning'][key];assert.ok(sim.restore(JSON.parse(JSON.stringify(saved.value))).ok);const h=sim.step(idleCommand).hero;assert.equal(h.dashCooldown,0);assert.deepEqual(h.special,{kind:'idle'});assert.equal(h.dashReleaseSuppressed,false);
});
test('gamepad A upgrade release cannot create an unintended new-wave dash',()=>{
 let s=initialRun(t);for(const e of s.enemies){e.hp=0;e.behavior={kind:'defeated'};}s=stepRun(s,idleCommand,t);assert.equal(s.phase.kind,'upgrade');s=stepRun(s,{...idleCommand,choice:0,upgrade:s.phase.choices[0],dashInput:'press'},t);assert.equal(s.phase.kind,'fight');s=stepRun(s,intent('release'),t);assert.equal(s.hero.dash.kind,'idle');assert.equal(s.hero.charges,t.dashCharges);s=stepRun(s,intent('press'),t);s=stepRun(s,intent('release'),t);assert.equal(s.hero.dash.kind,'active');assert.equal(s.hero.charges,t.dashCharges-1);
});
