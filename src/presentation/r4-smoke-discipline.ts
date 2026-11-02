import {chapterLayout} from '../content/chapters/layout.ts';
import * as T from 'three';
import type {RunState} from '../sim/run-schema.ts';
// Applies after all cosmetic pools rebuild their matrices; never writes simulation state.
export function tagSmoke(mesh:T.InstancedMesh,source:string,mixed=false){
 mesh.userData.smokeSource=source;mesh.userData.smokeMixed=mixed;
 const alpha=new T.InstancedBufferAttribute(new Float32Array(mesh.instanceMatrix.count).fill(1),1);mesh.geometry.setAttribute('smokeGuardAlpha',alpha);mesh.geometry.setAttribute('smokeGuardLimit',new T.InstancedBufferAttribute(new Float32Array(mesh.instanceMatrix.count).fill(mixed?1:.35),1));
 const install=(s:{vertexShader:string;fragmentShader:string})=>{s.vertexShader='attribute float smokeGuardAlpha;attribute float smokeGuardLimit;varying float vSmokeGuardAlpha;varying float vSmokeGuardLimit;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace(/void main\s*\(\s*\)\s*\{/,m=>m+'vSmokeGuardAlpha=smokeGuardAlpha;vSmokeGuardLimit=smokeGuardLimit;');s.fragmentShader='varying float vSmokeGuardAlpha;varying float vSmokeGuardLimit;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace(/}\s*$/, 'gl_FragColor.a=min(gl_FragColor.a,vSmokeGuardLimit)*vSmokeGuardAlpha;}');};
 const material=mesh.material as T.Material;if(material instanceof T.ShaderMaterial)install(material);else{const prior=material.onBeforeCompile;material.onBeforeCompile=(s,r)=>{prior.call(material,s,r);install(s);};const key=material.customProgramCacheKey;material.customProgramCacheKey=()=>key.call(material)+'-actor-safe-smoke';}material.needsUpdate=true;
 return mesh;
}
export function makeSmokeDiscipline(root:T.Object3D){
 const matrix=new T.Matrix4(),point=new T.Vector3(),scale=new T.Vector3(),rotation=new T.Quaternion();let stats:{source:string;total:number;suppressed:number;minAlpha:number}[]=[];
 return{draw:(state:RunState|null,camera:T.Camera,hero:{x:number;z:number})=>{
  const vents=chapterLayout(state?.objective.level??0,state?.extras.seed??4107).vents;const actors=[{...hero,radius:.7},...(state?.enemies.filter(e=>e.hp>0).map(e=>({x:e.x,z:e.z,radius:e.kind==='grinder'?1:.8}))??[])];if(state?.phase.kind==='boss')actors.push({...state.phase.boss,radius:2.2});
  const projected=actors.map(a=>({p:new T.Vector3(a.x,.8,a.z).project(camera),r:a.radius}));const accepted:{x:number;y:number;rx:number;ry:number}[]=[];stats=[];root.updateWorldMatrix(true,true);
  root.traverseVisible(o=>{if(o instanceof T.InstancedMesh&&o.userData.ambientActorSafe){for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);point.setFromMatrixPosition(matrix).applyMatrix4(o.matrixWorld);const p=point.clone().project(camera),core=projected[0].p;if(Math.hypot(point.x-hero.x,point.z-hero.z)<4||Math.hypot(p.x-core.x,p.y-core.y)<.19){o.getMatrixAt(i,matrix);matrix.scale(new T.Vector3(0,0,0));o.setMatrixAt(i,matrix);}}o.instanceMatrix.needsUpdate=true;return;}if(!(o instanceof T.InstancedMesh)||!o.userData.smokeSource)return;const attribute=o.geometry.getAttribute('smokeGuardAlpha') as T.InstancedBufferAttribute;attribute.array.fill(1);const limits=o.geometry.getAttribute('smokeGuardLimit') as T.InstancedBufferAttribute;limits.array.fill(1);const report={source:String(o.userData.smokeSource),total:0,suppressed:0,minAlpha:1};o.geometry.computeBoundingSphere();const geometryRadius=o.geometry.boundingSphere?.radius??1;
   for(let i=0;i<o.count;i++){if(o.userData.smokeMixed&&!(o.userData.smokeIndices as number[]).includes(i))continue;report.total++;limits.setX(i,.35);o.getMatrixAt(i,matrix);matrix.premultiply(o.matrixWorld);matrix.decompose(point,rotation,scale);const radius=geometryRadius*Math.max(scale.x,scale.y,scale.z),p=point.clone().project(camera),edge=point.clone().add(new T.Vector3(radius,0,0)).project(camera),screenRadius=Math.abs(edge.x-p.x)*1.5,up=point.clone().add(new T.Vector3(0,radius,0).applyQuaternion(camera.quaternion)).project(camera),screenY=Math.max(screenRadius,Math.abs(up.y-p.y));let fade=Math.abs(point.x)>21||Math.abs(point.z)>21||vents.some(v=>Math.hypot(v.x-point.x,v.z-point.z)<1.8)?1:0;
    actors.forEach((a,j)=>{fade=Math.min(fade,Math.max(0,Math.min(1,(Math.hypot(a.x-point.x,a.z-point.z)-radius-a.radius-4)/2)));const ap=projected[j].p;if(Math.hypot((p.x-ap.x)/(screenRadius+.12),(p.y-ap.y)/(screenY+.19))<1)fade=0;});
    // No stacked translucent plumes over the deck: each accepted footprint owns its region.
    if(accepted.some(a=>Math.abs(a.x-p.x)<a.rx+screenRadius&&Math.abs(a.y-p.y)<a.ry+screenY))fade=0;if(fade>0)accepted.push({x:p.x,y:p.y,rx:screenRadius,ry:screenY});attribute.setX(i,fade);if(fade<1)report.suppressed++;report.minAlpha=Math.min(report.minAlpha,fade);
   }attribute.needsUpdate=limits.needsUpdate=true;stats.push(report);
  });
 },metadata:()=>({minimumActorClearance:4,maximumLayerOpacity:.35,sources:stats})};
}
