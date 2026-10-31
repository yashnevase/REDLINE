import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {initialRun} from '../src/sim/run-schema.ts';
import {combatDefaults as t} from '../src/content/combat.ts';
import {stepRun} from '../src/sim/run-rules.ts';
import {idleCommand} from '../src/sim/schema.ts';
test('Blender industrial kit has finite Y-up meshes, origin pivots and genuinely thin saw teeth',async()=>{
 const b=await readFile(new URL('../public/models/industrial-kit.glb',import.meta.url)),g=await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');g.scene.updateMatrixWorld(true);const names=[];g.scene.traverse(o=>{if(!(o instanceof T.Mesh))return;names.push(o.name);assert.ok(o.position.length()<1e-6);const bounds=new T.Box3().setFromObject(o),size=bounds.getSize(new T.Vector3());assert.ok([size.x,size.y,size.z].every(v=>Number.isFinite(v)&&v>0));if(o.name==='sawRing'){assert.ok(size.x>1.9&&size.y>1.9);assert.ok(size.z<.1);assert.ok(o.geometry.attributes.position.count>300);}});assert.deepEqual(names.sort(),['armourPlate','sawRing','shieldLower','shieldPlank','shieldUpper']);
});
test('edge spawns remain on slab and complete a harmless configured arrival before chasing',()=>{
 let s=initialRun(t);assert.ok(s.enemies.every(e=>Math.abs(e.x)>21&&Math.abs(e.x)<24));assert.ok(s.enemies.every(e=>e.behavior.kind==='spawn'));const x=s.enemies[0].x;for(let i=0;i<t.spawnDropTicks;i++)s=stepRun(s,idleCommand,t);assert.equal(s.hero.hp,100);assert.equal(s.enemies[0].x,x);assert.equal(s.enemies[0].behavior.kind,'chase');s=stepRun(s,idleCommand,t);assert.notEqual(s.enemies[0].x,x);
});
