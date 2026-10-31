import test from 'node:test';
import assert from 'node:assert/strict';
import {combatDefaults as t,obstacles} from '../src/content/combat.ts';
import {spawnEnemy,initialRun} from '../src/sim/run-schema.ts';
import {stepRun} from '../src/sim/run-rules.ts';
import {idleCommand} from '../src/sim/schema.ts';
import {makeCameraFollow} from '../src/presentation/camera-follow.ts';
import {defaults} from '../src/content/scene.mjs';
test('combat ring, obstacle lanes, hero leash and camera focus retain scenery outside gameplay',()=>{
 assert.equal(t.arenaHalfWidth,17);for(let i=0;i<12;i++){const e=spawnEnemy('sawlet',i,1,t),r=Math.hypot(e.x,e.z);assert.ok(r>=14-1e-8&&r<=17);assert.ok(Math.abs(e.x)<=17&&Math.abs(e.z)<=17);}
 assert.ok(obstacles.every(o=>17-Math.max(Math.abs(o.x)+o.hx,Math.abs(o.z)+o.hz)>=4));
 let s=initialRun(t);s.enemies=[];s.phase.nextSpawn=8;s.hero.x=16.3;s.hero.z=10;const old=s.hero.x;s=stepRun(s,idleCommand,t);assert.ok(s.hero.x<old&&s.hero.x>15);for(let i=0;i<240;i++)s=stepRun(s,{x:1,z:1,dash:i%70===0},t);assert.ok(Math.abs(s.hero.x)<17&&Math.abs(s.hero.z)<17);
 const c=makeCameraFollow().update({x:17,z:-17,vx:6,vz:-6},0,defaults.cameraLookAhead,defaults.cameraDamping,defaults.cameraInset);assert.deepEqual(c,{x:13,z:-13});for(const h of [defaults.viewHeight,defaults.phoneViewHeight])assert.ok(2*defaults.coreRadius/h>=.11&&2*defaults.coreRadius/h<=.12);
});
test('Rally closes at +40%, skips natural idle, preserves Stomp stun and never shortens a warning',()=>{
 let s=initialRun(t);s.phase.nextSpawn=8;s.enemies=s.enemies.slice(0,1);Object.assign(s.enemies[0],{x:8,z:0,prevX:8,prevZ:0,behavior:{kind:'chase'}});s.hero.x=s.hero.z=0;s.hero.bonkCooldown=999;const next=stepRun(s,idleCommand,t);assert.ok(Math.abs(next.enemies[0].x-(8-t.sawletSpeed*1.4/60))<1e-10);
 s.enemies[0].behavior={kind:'recover',remaining:50,rallyEligible:true};assert.equal(stepRun(s,idleCommand,t).enemies[0].behavior.kind,'chase');s.enemies[0].behavior={kind:'recover',remaining:36};assert.deepEqual(stepRun(s,idleCommand,t).enemies[0].behavior,{kind:'recover',remaining:35});s.enemies[0].behavior={kind:'windup',remaining:24,dx:-1,dz:0};assert.equal(stepRun(s,idleCommand,t).enemies[0].behavior.remaining,23);
 s=initialRun(t);s.enemies=s.enemies.slice(0,4);s.phase.nextSpawnIn=90;assert.ok(stepRun(s,idleCommand,t).phase.nextSpawnIn<=72);
});
test('normal-HP moving bot clears waves 1–3 with no bonk gap above two seconds',async()=>{
 const {botRun}=await import('../tools/focus-bot.mjs');const run=botRun();assert.equal(run.state.phase.kind,'boss');assert.ok(run.state.hero.hp>0&&run.state.hero.hp<=100);for(const wave of [1,2,3]){const gaps=run.gaps.filter(g=>g.wave===wave);assert.ok(gaps.length>0);assert.ok(Math.max(...gaps.map(g=>g.ticks))<=120,`wave ${wave}`);}
});
