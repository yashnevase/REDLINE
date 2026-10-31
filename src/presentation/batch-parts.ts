import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
// Bake fixed descendants in the group's own coordinates; animated subgroups stay separate.
export function batchParts(root:T.Group,excluded:readonly T.Object3D[]=[]){
 root.updateWorldMatrix(true,true);const inverse=root.matrixWorld.clone().invert();
 const buckets=new Map<T.Material,{geometry:T.BufferGeometry;source:T.Mesh}[]>();
 function visit(object:T.Object3D){
  if(excluded.includes(object))return;
  if(object instanceof T.Mesh&&!Array.isArray(object.material)){
   const geometry=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();
   for(const name of Object.keys(geometry.attributes))if(name!=='position'&&name!=='normal'&&!(name==='uv'&&'map' in object.material&&object.material.map)&&!(name==='color'&&'vertexColors' in object.material&&object.material.vertexColors))geometry.deleteAttribute(name);
   if(!geometry.getAttribute('normal'))geometry.computeVertexNormals();geometry.clearGroups();geometry.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,object.matrixWorld));
   const bucket=buckets.get(object.material)??[];bucket.push({geometry,source:object});buckets.set(object.material,bucket);
  }
  for(const child of object.children)visit(child);
 }
 for(const child of root.children)visit(child);
 for(const [material,parts] of buckets){
  const merged=mergeGeometries(parts.map(p=>p.geometry),false);if(!merged)throw new Error('Incompatible fixed actor geometry');
  for(const {source,geometry} of parts){source.removeFromParent();geometry.dispose();source.geometry.dispose();}
  const mesh=new T.Mesh(merged,material);mesh.castShadow=parts.some(p=>p.source.castShadow);mesh.receiveShadow=parts.some(p=>p.source.receiveShadow);root.add(mesh);
 }
}
