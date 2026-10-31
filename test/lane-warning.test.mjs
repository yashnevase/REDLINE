import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {makeLaneWarning} from '../src/presentation/lane-warning.ts';
import {makeBossPresentation} from '../src/presentation/boss.ts';
import {initialBoss} from '../src/sim/run-schema.ts';
import {combatDefaults as t} from '../src/content/combat.ts';
test('lane marker reaches the true endpoint in all diagonal directions',()=>{
 for(const [dx,dz] of [[.6,.8],[-.6,.8],[.6,-.8],[-.6,-.8]]){const lane=makeLaneWarning();lane.draw(3,-2,dx,dz,2,6,.5);lane.root.updateMatrixWorld(true);const edge=lane.root.children[1],p=edge.geometry.getAttribute('position');const left=new T.Vector3().fromBufferAttribute(p,2).applyMatrix4(edge.matrixWorld),right=new T.Vector3().fromBufferAttribute(p,3).applyMatrix4(edge.matrixWorld),tip=left.add(right).multiplyScalar(.5);assert.ok(Math.abs(tip.x-(3+dx*6))<1e-8);assert.ok(Math.abs(tip.z-(-2+dz*6))<1e-8);}
});
test('enraged boss warning shows the complete faster charge distance',()=>{
 const mat=new T.MeshBasicMaterial();const materials={rust:mat,rustActor:mat,rustLight:mat,dark:mat,red:mat,white:mat,steel:mat,lightSteel:mat,glow:mat};const boss=makeBossPresentation(new T.Group(),materials);const b=initialBoss(t);b.hp=100;b.behavior={kind:'chomp-warning',remaining:48,dx:.6,dz:.8};boss.draw(b,0,1,t);const lane=boss.warnings.getObjectByName('chomp-lane');assert.ok(lane);assert.equal(lane.children[1].scale.z,t.bossChompSpeed*t.bossChompTicks/60*t.bossEnrageSpeed+t.bossRadius*2);
});
