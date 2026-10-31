import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {Materials} from './materials.ts';
// Original Blender-built hardware; shared by the live and studio matched Core.
export async function loadCoreSockets(materials:Materials){
 const asset=await new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}models/core-sockets.glb`);
 const tints:Record<string,string>={SocketPanel:'#faf7ff',SocketRim:'#ddd8ee',SocketDeck:'#bcb6d6',SocketRecess:'#8f86b1',SocketBolt:'#ece7fa'};
 const converted=new Map<string,T.MeshMatcapMaterial>();
 asset.scene.name='core-sockets';
 asset.scene.traverse(object=>{if(!(object instanceof T.Mesh))return;
  const convert=(source:T.Material)=>{const key=source.name;if(!tints[key])throw new Error(`Unexpected Core socket surface: ${key}`);let mat=converted.get(key);if(!mat){mat=materials.chrome.clone();mat.color.set(tints[key]);mat.name=key;converted.set(key,mat);}return mat;};
  const isPanel=!Array.isArray(object.material)&&object.material.name==='SocketPanel';
  if(isPanel){
   object.updateWorldMatrix(true,false);const p=object.geometry.attributes.position,colour:number[]=[],v=new T.Vector3();
   for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(object.matrixWorld).normalize();const side=v.x>=0?1:-1,u=v.y/.72,w=(v.x*.2-v.z*side*.9799)/.30,r=Math.hypot(u,w);const a=Math.max(0,Math.min(1,(1-r)/.07));colour.push(1,1,1,a*a*(3-2*a));}
   object.geometry.setAttribute('color',new T.Float32BufferAttribute(colour,4));
  }
  object.material=Array.isArray(object.material)?object.material.map(convert):convert(object.material);
  if(isPanel&&object.material instanceof T.MeshMatcapMaterial){object.material.vertexColors=true;object.material.transparent=true;object.material.depthWrite=false;}
 });
 return asset.scene;
}
