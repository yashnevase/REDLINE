import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {coversHero,makeOcclusionFade} from '../src/presentation/occlusion.ts';
test('only nearer overlapping enemies fade, and shared source materials stay unchanged',()=>{
 const camera=new T.OrthographicCamera(-10,10,10,-10,.1,100);camera.position.set(10,10,10);camera.lookAt(0,0,0);camera.updateMatrixWorld();const hero={x:0,y:0,z:0,radius:.62};assert.equal(coversHero(camera,hero,{x:1,y:1,z:1,radius:.7}),true);assert.equal(coversHero(camera,hero,{x:-1,y:-1,z:-1,radius:.7}),false);assert.equal(coversHero(camera,hero,{x:8,y:0,z:-8,radius:.7}),false);
 const material=new T.MeshBasicMaterial(),root=new T.Group(),mesh=new T.Mesh(new T.BoxGeometry(),material);root.add(mesh);const fade=makeOcclusionFade(root);fade(true);assert.notEqual(mesh.material,material);assert.equal(mesh.material.opacity,.22);assert.equal(material.opacity,1);fade(false);assert.equal(mesh.material,material);
});
