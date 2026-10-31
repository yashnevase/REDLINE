import test from 'node:test';
import assert from 'node:assert/strict';
import {combatDefaults as t,obstacles} from '../src/content/combat.ts';
import {collide} from '../src/sim/geometry.ts';
test('space slab has an open centre, separated cover and a traversable perimeter circuit',()=>{
 assert.equal(t.arenaHalfWidth,t.laneHalfWidth);
 assert.ok(obstacles.every(o=>Math.abs(o.x)-o.hx>=11.2||Math.abs(o.z)-o.hz>=11.2));
 assert.ok(obstacles.reduce((area,o)=>area+o.hx*o.hz*4,0)/(t.arenaHalfWidth*t.laneHalfWidth*4)<.08);
 for(let i=0;i<obstacles.length;i++)for(let j=i+1;j<obstacles.length;j++)assert.ok(Math.hypot(obstacles[i].x-obstacles[j].x,obstacles[i].z-obstacles[j].z)>=8);
 let p={x:-14,z:-14};for(const target of [{x:14,z:-14},{x:14,z:14},{x:-14,z:14},{x:-14,z:-14}]){for(let i=0;i<800&&Math.hypot(target.x-p.x,target.z-p.z)>.1;i++){const length=Math.hypot(target.x-p.x,target.z-p.z);p=collide(p.x+(target.x-p.x)/length*.1,p.z+(target.z-p.z)/length*.1,t.heroRadius,t);}assert.ok(Math.hypot(target.x-p.x,target.z-p.z)<=.1);}
 for(const x of [-22,0,22])for(const z of [-22,0,22]){const p=collide(x,z,t.heroRadius,t);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.z));assert.ok(Math.abs(p.x)<=t.arenaHalfWidth-t.heroRadius&&Math.abs(p.z)<=t.laneHalfWidth-t.heroRadius);}
});
