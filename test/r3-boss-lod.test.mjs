import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {makeBossPresentation} from '../src/presentation/boss.ts';import {initialBoss} from '../src/sim/run-schema.ts';import {combatDefaults as t} from '../src/content/combat.ts';
test('Low Rex retains finite hull/weapon bounds and reduces real rendered geometry, then restores full detail',async()=>{
 const mat=new T.MeshLambertMaterial(),m={rust:mat,rustActor:mat,rustLight:mat,dark:mat,red:mat,white:mat,steel:mat,lightSteel:mat,glow:mat,rustPaint:new T.Texture()};
 const boss=makeBossPresentation(new T.Group(),m);await boss.finalize();const state=initialBoss(t);
 const count=()=>{let n=0;boss.root.traverseVisible(o=>{if(o instanceof T.Mesh){assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite));n+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;}});return n;};
 boss.draw(state,0,1,t);const high=count(),bounds=new T.Box3().setFromObject(boss.root);
 boss.draw(state,0,1,t,false,undefined,undefined,false,true);const low=count(),reduced=new T.Box3().setFromObject(boss.root);
 assert.ok(low<high*.8);assert.ok(bounds.min.distanceTo(reduced.min)<.5&&bounds.max.distanceTo(reduced.max)<.5);
 boss.draw(state,0,1,t);assert.equal(count(),high);
});
