import test from 'node:test';
import assert from 'node:assert/strict';
import {createSimulation} from '../src/sim/runtime.ts';
import {combatDefaults as defaults,obstacles} from '../src/content/combat.ts';
import {initialState,idleCommand} from '../src/sim/schema.ts';
import {stepFight,collide} from '../src/sim/rules.ts';
const tuning={...defaults};
const quiet=()=>{const s=initialState(tuning);s.enemy.x=20;s.enemy.z=5;s.enemy.behavior={kind:'recover',remaining:100000};return s;};
test('dash travels four units in twelve ticks, consumes one charge and restores after cooldown',()=>{
 let s=quiet();const origin=s.hero.x;
 for(let i=0;i<12;i++)s=stepFight(s,{x:1,z:0,dash:i===0},tuning);
 assert.ok(Math.abs(s.hero.x-origin-4)<1e-9);assert.equal(s.hero.charges,1);assert.equal(s.hero.dash.kind,'idle');
 for(let i=0;i<72;i++)s=stepFight(s,idleCommand,tuning);assert.equal(s.hero.charges,2);
});
test('movement is normalized and collisions stop both dash and walk at walls and props',()=>{
 let s=quiet();s.hero.x=22;s.hero.z=0;
 for(let i=0;i<30;i++)s=stepFight(s,{x:1,z:0,dash:i===0},tuning);
 assert.ok(s.hero.x<=tuning.arenaHalfWidth-tuning.heroRadius);
 for(const o of obstacles){const inside=collide(o.x,o.z,tuning.heroRadius,tuning);assert.ok(Math.abs(inside.x-o.x)>=o.hx+tuning.heroRadius-1e-9||Math.abs(inside.z-o.z)>=o.hz+tuning.heroRadius-1e-9);}
 let diagonal=quiet(),straight=quiet();for(let i=0;i<60;i++){diagonal=stepFight(diagonal,{x:1,z:1,dash:false},tuning);straight=stepFight(straight,{x:1,z:0,dash:false},tuning);}
 assert.ok(Math.sqrt(diagonal.hero.vx**2+diagonal.hero.vz**2)<=tuning.momentumSpeed+1e-9);assert.ok(straight.hero.vx<=tuning.momentumSpeed);
});
test('i-frames protect the complete dash, and one enemy attack can damage only once',()=>{
 let s=quiet();s.enemy.x=s.hero.x;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'lunge',remaining:30,dx:0,dz:0,hasHit:false};s.hero.bonkCooldown=100;
 s=stepFight(s,{x:1,z:0,dash:true},tuning);assert.equal(s.hero.hp,100);
 s=quiet();s.enemy.x=s.hero.x;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'lunge',remaining:30,dx:0,dz:0,hasHit:false};s.hero.bonkCooldown=100;
 for(let i=0;i<20;i++)s=stepFight(s,idleCommand,tuning);assert.equal(s.hero.hp,94);
 // Contact on the last active tick still lands.
 s=quiet();s.enemy.x=s.hero.x;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'lunge',remaining:1,dx:0,dz:0,hasHit:false};s.hero.bonkCooldown=100;
 assert.equal(stepFight(s,idleCommand,tuning).hero.hp,94);
});
test('speed-bonk damage grows with speed, respects cadence, and defeats the single Sawlet',()=>{
 let slow=quiet();slow.enemy.x=slow.hero.x+1.3;slow.enemy.z=slow.hero.z;
 const hit=stepFight(slow,idleCommand,tuning);assert.equal(hit.events.find(e=>e.kind==='bonk').amount,8);
 const fast=stepFight(slow,{x:1,z:0,dash:true},tuning);assert.equal(fast.events.find(e=>e.kind==='bonk').amount,12);
 const next=stepFight(hit,idleCommand,tuning);assert.equal(next.enemy.hp,hit.enemy.hp);
 const sim=createSimulation();for(let i=0;i<600;i++)sim.step(idleCommand);assert.equal(sim.view().enemy.behavior.kind,'defeated');assert.equal(sim.view().hitstop,0);
});
test('dash pressed during hit-stop is buffered and starts on the first unfrozen tick',()=>{
 let s=quiet();s.hitstop=3;
 s=stepFight(s,{x:1,z:0,dash:true},tuning);const x=s.hero.x;
 for(let i=0;i<2;i++)s=stepFight(s,idleCommand,tuning);assert.equal(s.hero.x,x);
 s=stepFight(s,idleCommand,tuning);assert.equal(s.hero.charges,1);assert.ok(s.hero.x>x);
});
test('replay, snapshot restore and independent runtime interleaving produce identical state',()=>{
 const commands=Array.from({length:900},(_,i)=>({x:i%180<90?1:-1,z:i%120<60?.4:-.4,dash:i%80===0}));
 const first=createSimulation(),second=createSimulation();
 for(const command of commands){first.step(command);second.step(command);}assert.deepEqual(first.view(),second.view());
 const snap=first.snapshot();assert.ok(snap.ok);const restored=createSimulation();const loaded=restored.restore(JSON.parse(JSON.stringify(snap.value)));assert.ok(loaded.ok);assert.deepEqual(restored.view(),first.view());
 for(const command of commands.slice(0,80)){first.step(command);restored.step(command);}assert.deepEqual(first.view(),restored.view());
 const view=first.view();view.hero.hp=777;assert.notEqual(first.view().hero.hp,777);
});
test('Ritmo determinism audit covers fixed-step enemy attacks, damage and defeat',async()=>{
 const {Determinism}=await import('@typeonce/ritmo-devtools');const {HostClock}=await import('@typeonce/ritmo');const {update}=await import('../src/sim/runtime.ts');
 const checked=Determinism.check(()=>({runtime:createSimulation(undefined,true).runtime,schedules:{update}}),{hostClock:HostClock.test(),schedule:'update',frames:1800});assert.ok(checked.ok,JSON.stringify(checked));
});
test('all twelve i-frame ticks protect overlapping contact, then damage resumes immediately',()=>{
 const t={...tuning,dashDistance:.001};let s=quiet();s.hero.bonkCooldown=100;s.enemy.x=s.hero.x;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'lunge',remaining:30,dx:0,dz:0,hasHit:false};
 for(let i=0;i<12;i++){s=stepFight(s,{x:1,z:0,dash:i===0},t);assert.equal(s.hero.hp,100,`dash tick ${i+1}`);}
 assert.equal(s.hero.dash.kind,'idle');assert.equal(stepFight(s,idleCommand,t).hero.hp,94);
});
test('dash without a movement direction still travels its full configured distance',()=>{
 let s=quiet();const x=s.hero.x,z=s.hero.z;
 for(let i=0;i<12;i++)s=stepFight(s,{x:0,z:0,dash:i===0},tuning);
 assert.ok(Math.abs(Math.sqrt((s.hero.x-x)**2+(s.hero.z-z)**2)-4)<1e-9);
});

test('Pulse Bash hits only in range, respects cooldown, and buffers through hit-stop',()=>{
 const t={...tuning,sawletHP:100};let s=initialState(t);s.enemy.x=s.hero.x+2;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'recover',remaining:999};s.hero.bonkCooldown=999;
 s=stepFight(s,{...idleCommand,ability:'pulse'},t);assert.equal(s.enemy.hp,88);assert.equal(s.hero.pulseCooldown,120);assert.ok(s.events.some(e=>e.kind==='pulse'));
 for(let i=0;i<5;i++)s=stepFight(s,{...idleCommand,ability:'pulse'},t);assert.equal(s.enemy.hp,88);
 s=initialState(t);s.enemy.x=20;s.enemy.z=5;s=stepFight(s,{...idleCommand,ability:'pulse'},t);assert.equal(s.enemy.hp,100);assert.equal(s.hero.pulseCooldown,120);
 s=initialState(t);s.enemy.x=s.hero.x+2;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'recover',remaining:999};s.hero.bonkCooldown=999;s.hitstop=3;
 s=stepFight(s,{...idleCommand,ability:'pulse'},t);for(let i=0;i<3;i++)s=stepFight(s,idleCommand,t);assert.equal(s.enemy.hp,88);assert.equal(s.hero.abilityBuffer,null);
});
test('Stomp interrupts a lunge for its configured stun, while Boost grants no protection and collides',()=>{
 const t={...tuning,sawletHP:100};let s=initialState(t);s.hero.bonkCooldown=999;s.enemy.x=s.hero.x+1;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'lunge',remaining:20,dx:0,dz:0,hasHit:false};
 s=stepFight(s,{...idleCommand,ability:'stomp'},t);assert.equal(s.hero.hp,100);assert.equal(s.enemy.hp,80);assert.deepEqual(s.enemy.behavior,{kind:'recover',remaining:36});
 s=initialState(t);s.hero.x=0;s.hero.z=0;s.hero.faceX=1;s.hero.faceZ=0;s.hero.bonkCooldown=999;s.enemy.x=3;s.enemy.z=0;s.enemy.behavior={kind:'lunge',remaining:20,dx:0,dz:0,hasHit:false};
 s=stepFight(s,{...idleCommand,ability:'boost'},t);assert.ok(Math.abs(s.hero.x-3)<1e-9);assert.equal(s.hero.hp,94);assert.equal(s.hero.charges,2);assert.equal(s.hero.boostCooldown,180);
 s=quiet();s.hero.x=22;s.hero.z=0;s.hero.faceX=1;s.hero.faceZ=0;s=stepFight(s,{...idleCommand,ability:'boost'},tuning);assert.ok(s.hero.x<=tuning.arenaHalfWidth-tuning.heroRadius);
});
test('Overdrive spends Heat, boosts damage and restricts free dash i-frames to one per half-second',()=>{
 const t={...tuning,sawletHP:100};let s=initialState(t);s.hero.heat=89;s=stepFight(s,{...idleCommand,overdrive:true},t);assert.equal(s.hero.overdrive,0);
 s=initialState(t);s.hero.heat=90;s.hero.charges=0;s.hero.bonkCooldown=999;s.enemy.x=s.hero.x+2;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'recover',remaining:999};
 s=stepFight(s,{...idleCommand,overdrive:true,ability:'pulse'},t);assert.equal(s.enemy.hp,85);assert.equal(s.hero.heat,0);assert.equal(s.hero.overdrive,300);
 s.hitstop=0;s.enemy.x=20;s.enemy.z=5;
 s=stepFight(s,{x:1,z:0,dash:true},t);assert.equal(s.hero.charges,0);assert.equal(s.hero.dash.kind,'active');assert.equal(s.hero.dash.protected,true);
 for(let i=0;i<11;i++)s=stepFight(s,idleCommand,t);
 s=stepFight(s,{x:1,z:0,dash:true},t);assert.equal(s.hero.dash.kind,'idle');for(let i=0;i<14;i++)s=stepFight(s,idleCommand,t);s=stepFight(s,{x:1,z:0,dash:true},t);assert.equal(s.hero.dash.protected,false);
 s.enemy.x=s.hero.x;s.enemy.z=s.hero.z;s.enemy.behavior={kind:'lunge',remaining:20,dx:0,dz:0,hasHit:false};s=stepFight(s,idleCommand,t);assert.equal(s.hero.hp,94);
});
test('ability cooldowns and Overdrive survive snapshot restore and scripted replay',()=>{
 const a=createSimulation(),b=createSimulation();const commands=Array.from({length:240},(_,i)=>({x:i<90?1:0,z:0,dash:i===25,ability:i===1?'boost':i===100?'stomp':i===150?'pulse':undefined,overdrive:i===180}));
 for(const c of commands.slice(0,60))a.step(c);const saved=a.snapshot();assert.equal(saved.ok,true);assert.equal(b.restore(JSON.parse(JSON.stringify(saved.value))).ok,true);
 for(const c of commands.slice(60)){assert.deepEqual(a.step(c),b.step(c));}
});
test('Phase 1 snapshots restore with neutral ability defaults',()=>{
 const sim=createSimulation();const saved=sim.snapshot();assert.equal(saved.ok,true);const old=JSON.parse(JSON.stringify(saved.value));
 for(const key of ['heat','overdrive','iframeLock','pulseCooldown','boostCooldown','stompCooldown','abilityBuffer','abilityBufferTicks'])delete old.resources['Redline/Fight'].hero[key];
 for(const key of ['heatPerSawlet','heatThreshold','overdriveTicks','overdriveMoveBonus','overdriveDamageBonus','overdriveIframeIntervalTicks','pulseDamage','pulseRadius','pulseCooldownTicks','boostDistance','boostCooldownTicks','stompDamage','stompRadius','stompCooldownTicks','stompStunTicks'])delete old.resources['Redline/Tuning'][key];
 assert.equal(sim.restore(old).ok,true);assert.equal(sim.view().hero.heat,0);assert.equal(sim.view().hero.pulseCooldown,0);assert.equal(sim.step({...idleCommand,ability:'pulse'}).hero.pulseCooldown,120);
});

test('Overdrive input survives hit-stop and activates once on the first unfrozen tick',()=>{
 let s=quiet();s.hitstop=2;s.hero.heat=tuning.heatThreshold;
 s=stepFight(s,{...idleCommand,overdrive:true},tuning);assert.equal(s.hero.overdrive,0);
 s=stepFight(s,idleCommand,tuning);assert.equal(s.hero.overdrive,0);
 s=stepFight(s,idleCommand,tuning);assert.equal(s.hero.overdrive,tuning.overdriveTicks);assert.equal(s.hero.heat,0);assert.equal(s.hero.overdriveBuffer,false);
});
