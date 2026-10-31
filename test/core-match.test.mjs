import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {makeCore} from '../src/presentation/models.ts';
import {defaults} from '../src/content/scene.mjs';
test('Core factory preserves legacy geometry and six matched expressions; gameplay framing is 11–12 percent',()=>{
 const m=Object.fromEntries(['chrome','white','red','steel','dark','lightSteel','glow'].map(k=>[k,new T.MeshBasicMaterial()]));
 const live=makeCore(m),candidate=makeCore(m,true);assert.equal(live.expressions.length,0);assert.equal(candidate.expressions.length,6);assert.equal(candidate.expressions.filter(e=>e.visible).length,1);
 const signatures=candidate.expressions.map(group=>group.children.map(mesh=>Array.from(mesh.geometry.attributes.position.array).slice(0,24).join(',')).join('|'));assert.equal(new Set(signatures).size,6);
 for(const mesh of candidate.body.children){if(mesh instanceof T.Mesh){const attr=mesh.geometry.attributes.position;for(let i=0;i<attr.count;i++){assert.ok(Number.isFinite(attr.getX(i)));assert.ok(Number.isFinite(attr.getY(i)));assert.ok(Number.isFinite(attr.getZ(i)));}}}
 const ratio=defaults.coreRadius*2/defaults.viewHeight;assert.ok(ratio>=.11&&ratio<=.12);
});

test('Blender Core sockets preserve origin, small shell bounds, outward normals and expected surfaces',async()=>{
 const {readFile}=await import('node:fs/promises');const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
 const bytes=await readFile(new URL('../public/models/core-sockets.glb',import.meta.url));
 const data=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),gltf=await new GLTFLoader().parseAsync(data,'');gltf.scene.updateMatrixWorld(true);
 const names=new Set();let count=0;const v=new T.Vector3(),normal=new T.Vector3(),normalMatrix=new T.Matrix3();
 gltf.scene.traverse(o=>{if(!(o instanceof T.Mesh))return;names.add(o.material.name);assert.ok(o.position.length()<1e-5);normalMatrix.getNormalMatrix(o.matrixWorld);const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);normal.fromBufferAttribute(n,i).applyNormalMatrix(normalMatrix);assert.ok(v.length()>=1&&v.length()<=1.04);assert.ok(v.dot(normal)>0);count++;}});
 assert.deepEqual([...names].sort(),['SocketBolt','SocketDeck','SocketPanel','SocketRecess','SocketRim']);assert.ok(count>1000);
 const bounds=new T.Box3().setFromObject(gltf.scene);assert.ok(bounds.min.x<-1&&bounds.max.x>1);assert.ok(bounds.max.y<.8&&bounds.min.y>-.8);assert.ok(bounds.max.z<.6&&bounds.min.z>-.3);
});

test('candidate Blade has a visible floating gap and reference-like scale apart from its link',()=>{
 const m=Object.fromEntries(['chrome','white','red','steel','dark','lightSteel','glow'].map(k=>[k,new T.MeshBasicMaterial()]));
 const hero=makeCore(m,true);hero.body.scale.set(defaults.coreRadius*defaults.coreStudioWidth,defaults.coreRadius*defaults.coreStudioSquash,defaults.coreRadius);hero.body.position.y=.66;hero.attachment.visible=true;hero.root.updateMatrixWorld(true);
 const blade=new T.Box3().setFromObject(hero.rotor),core=new T.Box3().setFromObject(hero.body);
 assert.ok(core.min.x-blade.max.x>.2);const ratio=blade.getSize(new T.Vector3()).y/(defaults.coreRadius*2);assert.ok(ratio>.3&&ratio<.6);
});
test('gameplay Core LOD keeps all expressions while cutting visible geometry by more than half',()=>{
 const m=Object.fromEntries(['chrome','white','red','steel','dark','lightSteel','glow'].map(k=>[k,new T.MeshBasicMaterial()]));const high=makeCore(m,true),low=makeCore(m,true,undefined,false);const triangles=root=>{let sum=0;root.traverseVisible(o=>{if(o instanceof T.Mesh)sum+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;});return sum;};assert.ok(triangles(low.root)<triangles(high.root)*.5);assert.equal(low.expressions.length,6);const a=new T.Box3().setFromObject(high.body),b=new T.Box3().setFromObject(low.body);assert.ok(a.min.distanceTo(b.min)<.01&&a.max.distanceTo(b.max)<.01);
});
