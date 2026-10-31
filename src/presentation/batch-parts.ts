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
   for(const name of Object.keys(geometry.attributes))if(name!=='position'&&name!=='normal'&&name!=='actorGlow'&&!(name==='uv'&&'map' in object.material&&object.material.map)&&!(name==='color'&&'vertexColors' in object.material&&object.material.vertexColors))geometry.deleteAttribute(name);
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

// Palette bake for small gameplay actors: two surfaces instead of one call per bolt/paint colour.
export function batchActor(root:T.Group,paint:T.Texture,excluded:readonly T.Object3D[]=[],emission=true){
 const lit=new T.MeshLambertMaterial({map:paint,vertexColors:true});
 lit.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float actorGlow; varying float vActorGlow;').replace('#include <begin_vertex>','#include <begin_vertex>\nvActorGlow=actorGlow;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float vActorGlow;').replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance += vColor.rgb * vActorGlow; diffuseColor.rgb *= 1. - vActorGlow;');};lit.customProgramCacheKey=()=> 'redline-actor-palette-v1';
 function visit(object:T.Object3D){
  if(excluded.includes(object))return;
  if(object instanceof T.Mesh&&!Array.isArray(object.material)){
   const source=object.material;
   if(source instanceof T.MeshBasicMaterial||source instanceof T.MeshLambertMaterial||source instanceof T.MeshMatcapMaterial){
    const unlit=emission&&source instanceof T.MeshBasicMaterial;
    const g=object.geometry.clone(),p=g.attributes.position,old=g.attributes.color,values:number[]=[];
    const colour=source.color.clone();if(source instanceof T.MeshMatcapMaterial&&colour.r>.9&&colour.g>.9)colour.set('#a37765');
    for(let i=0;i<p.count;i++)values.push(colour.r*(old?.getX(i)??1),colour.g*(old?.getY(i)??1),colour.b*(old?.getZ(i)??1));
    g.setAttribute('color',new T.Float32BufferAttribute(values,3));if(!g.attributes.uv)g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(p.count*2),2));
    g.setAttribute('actorGlow',new T.Float32BufferAttribute(new Float32Array(p.count).fill(unlit?1:0),1));object.geometry=g;object.material=lit;
   }
  }
  for(const child of object.children)visit(child);
 }
 for(const child of root.children)visit(child);batchParts(root,excluded);
}
