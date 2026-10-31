import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {batchParts} from '../src/presentation/batch-parts.ts';
test('actor batching preserves transformed bounds and independently animated groups',()=>{
 const root=new T.Group(),nested=new T.Group(),rotor=new T.Group();root.position.set(4,2,-1);root.rotation.y=.3;nested.position.set(1,.7,2);nested.rotation.z=.5;root.add(nested,rotor);const material=new T.MeshBasicMaterial();
 for(let i=0;i<4;i++){const mesh=new T.Mesh(new T.BoxGeometry(.5,.8,.2),material);mesh.position.set(i*.6,0,0);nested.add(mesh);}const moving=new T.Mesh(new T.BoxGeometry(.2,.2,.2),material);rotor.add(moving);rotor.position.x=-2;
 const before=new T.Box3().setFromObject(root,true);batchParts(root,[rotor]);const after=new T.Box3().setFromObject(root,true);assert.ok(before.min.distanceTo(after.min)<1e-6);assert.ok(before.max.distanceTo(after.max)<1e-6);assert.equal(root.children.filter(c=>c instanceof T.Mesh).length,1);assert.equal(rotor.children[0],moving);rotor.rotation.y=1;assert.equal(rotor.rotation.y,1);
});
test('batching retains actor vertex colours and mapped geometry UVs',()=>{
 const root=new T.Group(),g=new T.SphereGeometry(1,12,8),colours=[];for(let i=0;i<g.attributes.position.count;i++)colours.push(.8,.6,.5);g.setAttribute('color',new T.Float32BufferAttribute(colours,3));root.add(new T.Mesh(g,new T.MeshLambertMaterial({vertexColors:true})));const texture=new T.Texture(),mapped=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:texture}));root.add(mapped);batchParts(root);const mappedResult=root.children.find(c=>c.material.map===texture);assert.ok(mappedResult.geometry.attributes.uv);const shell=root.children.find(c=>c!==mappedResult);assert.ok(shell.geometry.attributes.color);assert.ok(Math.abs(shell.geometry.attributes.color.getX(0)-.8)<1e-6);
});
