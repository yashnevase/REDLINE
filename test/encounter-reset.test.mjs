import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {makeEncounterPresentation} from '../src/presentation/encounter.ts';
import {initialRun} from '../src/sim/run-schema.ts';
import {combatDefaults as t} from '../src/content/combat.ts';
test('retry clears future enemy flash/death timers even when IDs are reused',async()=>{
 const m=Object.fromEntries(['chrome','rust','rustActor','rustLight','dark','red','white','steel','lightSteel','glow','hot','violetRim'].map(key=>[key,new T.MeshBasicMaterial()]));m.rustPaint=null;
 const view=makeEncounterPresentation(new T.Group(),m),s=initialRun(t);await view.finalize();s.tick=100;const e=s.enemies[0];s.events=[{id:'100:0',tick:100,kind:'bonk',x:e.x,z:e.z,amount:8}];view.draw(s,1,t);const flashes=()=>{const result=[];view.root.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material)&&o.material.userData.actorHit)result.push(o.material.userData.actorHit.value);});return result;};assert.ok(flashes().some(value=>value>0));view.reset();view.draw(initialRun(t),1,t);assert.ok(flashes().every(value=>value===0));
});
test('camera occlusion fades the live merged meshes after hardware finalization',async()=>{
 const m=Object.fromEntries(['chrome','rust','rustActor','rustLight','dark','red','white','steel','lightSteel','glow','hot','violetRim'].map(key=>[key,new T.MeshBasicMaterial()]));m.rustPaint=null;const view=makeEncounterPresentation(new T.Group(),m);await view.finalize();const s=initialRun(t),e=s.enemies[0];e.x=e.prevX=0;e.z=e.prevZ=1;e.behavior={kind:'recover',remaining:999};const camera=new T.OrthographicCamera(-10,10,6,-6,.1,100);camera.position.set(0,10,10);camera.lookAt(0,0,0);camera.updateMatrixWorld();view.draw(s,1,t,false,false,camera,{x:0,y:.66,z:0,radius:.62});const actor=view.root.children[0],materials=()=>{const a=[];actor.traverseVisible(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material))a.push(o.material);});return a;};assert.ok(materials().some(m=>m.transparent&&m.opacity===.22));e.z=e.prevZ=-4;view.draw(s,1,t,false,false,camera,{x:0,y:.66,z:0,radius:.62});assert.ok(materials().every(m=>m.opacity!==.22));
});
