import test from 'node:test';
import assert from 'node:assert/strict';
import {combatDefaults as t,obstacles} from '../src/content/combat.ts';
import {initialState,idleCommand} from '../src/sim/schema.ts';
import {advanceHero} from '../src/sim/hero.ts';
import {createSimulation} from '../src/sim/runtime.ts';
import {initialRun} from '../src/sim/run-schema.ts';
import {stepRun} from '../src/sim/run-rules.ts';
import {makeRigidPose,wearTier} from '../src/presentation/core-surface.ts';
import {decodePreferences} from '../src/content/preferences.ts';
const step=(h,c)=>{h.prevX=h.x;h.prevZ=h.z;advanceHero(h,c,t,()=>{});};
test('rolling reaches base pace in 80ms, builds straight momentum in one second, drifts on turns and stops on release',()=>{
 const h=initialState(t).hero;h.x=-6;h.z=3;for(let i=0;i<5;i++)step(h,{x:1,z:0,dash:false});assert.ok(h.vx>=8.5&&h.vx<8.7);
 for(let i=5;i<61;i++)step(h,{x:1,z:0,dash:false});assert.equal(h.momentum.ticks,60);assert.equal(h.vx,10.5);
 step(h,{x:0,z:1,dash:false});assert.ok(h.vx>0&&h.vz>0);assert.equal(h.momentum.ticks,0);
 const before={x:h.x,z:h.z};step(h,idleCommand);assert.equal(h.vx,0);assert.equal(h.vz,0);assert.deepEqual({x:h.x,z:h.z},before);assert.deepEqual(h.momentum,{kind:'idle'});
 const analog=initialState(t).hero;analog.x=-6;analog.z=3;for(let i=0;i<65;i++)step(analog,{x:.3,z:.4,dash:false});assert.ok(Math.abs(Math.sqrt(analog.vx**2+analog.vz**2)-5.25)<1e-9);
});
test('Rush/Charge reflect from barricades and enemies without refreshing protection or hitting a target twice',()=>{
 const h=initialState(t).hero;h.x=obstacles[1].x-1.5;h.z=obstacles[1].z;h.dash={kind:'active',remaining:18,dx:1,dz:0,protected:true,protectionTicks:8,variant:'charge',distance:9,duration:18,hits:[]};step(h,idleCommand);assert.ok(h.dash.dx<0);assert.equal(h.dash.protectionTicks,8);assert.equal(h.dash.remaining,18);
 let s=initialRun(t);s.phase.nextSpawn=8;s.hero.x=s.hero.z=0;s.hero.bonkCooldown=999;s.hero.dash={kind:'active',remaining:18,dx:1,dz:0,protected:true,protectionTicks:8,variant:'rush',distance:6.5,duration:18,hits:[]};s.enemies=[{id:1,kind:'grinder',x:1.4,z:0,prevX:1.4,prevZ:0,hp:80,faceX:1,faceZ:0,behavior:{kind:'recover',remaining:50}}];s=stepRun(s,idleCommand,t);assert.ok(s.enemies[0].x>1.4);assert.ok(s.hero.dash.dx<0);assert.equal(s.hero.dash.protectionTicks,7);assert.deepEqual(s.hero.dash.hits,[1]);const hp=s.enemies[0].hp;for(let i=0;i<20;i++)s=stepRun(s,idleCommand,t);assert.equal(s.enemies[0].hp,hp);
});
test('momentum snapshots round-trip, old snapshots default to rest, and independent scripted runs agree',()=>{
 const a=createSimulation(),b=createSimulation();for(let i=0;i<30;i++)a.step({x:1,z:0,dash:false});const snap=a.snapshot();assert.ok(snap.ok);assert.ok(b.restore(JSON.parse(JSON.stringify(snap.value))).ok);assert.deepEqual(b.view(),a.view());for(let i=0;i<15;i++)assert.deepEqual(a.step({x:0,z:1,dash:false}),b.step({x:0,z:1,dash:false}));
 const old=JSON.parse(JSON.stringify(snap.value));delete old.resources['Redline/Fight'].hero.momentum;for(const key of ['momentumSpeed','momentumTicks','straightDot','turnGrip','dashBounceKnockback'])delete old.resources['Redline/Tuning'][key];assert.ok(b.restore(old).ok);assert.deepEqual(b.view().hero.momentum,{kind:'idle'});
});
test('rigid anticipation never overshoots, locomotion stays round, and impact compression ends after 80ms',()=>{
 const pose=makeRigidPose();for(let i=0;i<60;i++){const p=pose.draw(i/60,1/60,true,[],false);assert.ok(p.x>=1&&p.x<=1.06);assert.ok(p.y>=.94&&p.y<=1);}
 pose.reset();assert.deepEqual(pose.draw(0,1/60,false,[],false),{x:1,y:1,z:1});const event={id:'hurt',tick:60,kind:'hurt',amount:20,x:0,z:0};const p=pose.draw(1,1/60,false,[event],false);assert.equal(p.x,1.08);assert.equal(p.y,.92);assert.deepEqual(pose.draw(1.09,.09,false,[],false),{x:1,y:1,z:1});assert.deepEqual(pose.draw(2,1/60,true,[{...event,id:'2',tick:120}],true),{x:1,y:1,z:1});
 assert.deepEqual([100,75,50,25,80,100].map(hp=>wearTier(hp,100)),[0,1,2,3,0,0]);assert.equal(wearTier(30,120),3);
});
test('old preferences migrate to Default camera; three zoom presets persist and invalid ones are rejected',()=>{
 const legacy={version:1,reducedMotion:false,reducedFlashes:false,quality:'low'};assert.equal(decodePreferences(JSON.stringify(legacy)).zoom,'default');for(const zoom of ['close','default','wide'])assert.equal(decodePreferences(JSON.stringify({...legacy,zoom})).zoom,zoom);assert.equal(decodePreferences(JSON.stringify({...legacy,zoom:'extreme'})).zoom,'default');
});
