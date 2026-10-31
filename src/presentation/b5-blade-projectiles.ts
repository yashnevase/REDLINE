import * as T from 'three';
import {B5_ENABLED} from '../content/items/switches.ts';
import {steelShotGeometry,BL2_ENABLED} from './bl-steel.ts';
import type {RunState} from '../sim/run-schema.ts';
export function makeBladeProjectileView(parent:T.Group){
 const geometry=BL2_ENABLED?steelShotGeometry():new T.CircleGeometry(.3,16),mat=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}),mesh=new T.InstancedMesh(geometry,mat,128);mesh.count=0;parent.add(mesh);const dummy=new T.Object3D(),color=new T.Color();
 return{draw:(s:RunState,alpha:number)=>{mesh.count=0;if(B5_ENABLED)for(const p of s.bladeProjectiles){const x=p.prevX+(p.x-p.prevX)*alpha,z=p.prevZ+(p.z-p.prevZ)*alpha;for(let trail=0;trail>=0;trail--){dummy.position.set(x-p.dx*trail*.075,.75-trail*.015,z-p.dz*trail*.075);dummy.rotation.set(Math.PI/6,s.tick*.35,trail*.12);dummy.scale.setScalar(1-trail*.19);dummy.updateMatrix();mesh.setMatrixAt(mesh.count,dummy.matrix);mesh.setColorAt(mesh.count,color.set('#ffffff'));mesh.count++;}}mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;if(mesh.count)mesh.computeBoundingSphere();},reset:()=>{mesh.count=0;}};
}
