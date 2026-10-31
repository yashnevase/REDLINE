import * as T from 'three';
type Sphere={x:number;y:number;z:number;radius:number};
export function coversHero(camera:T.Camera,hero:Sphere,other:Sphere){
 const a=new T.Vector3(hero.x,hero.y,hero.z).applyMatrix4(camera.matrixWorldInverse),b=new T.Vector3(other.x,other.y,other.z).applyMatrix4(camera.matrixWorldInverse);
 const radius=hero.radius+other.radius*.9;return b.z>a.z+.05&&(a.x-b.x)**2+(a.y-b.y)**2<radius*radius;
}
export function makeOcclusionFade(root:T.Group){
 const entries:{mesh:T.Mesh;original:T.Material}[]=[];root.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material))entries.push({mesh:o,original:o.material});});
 const faded=new Map<T.Material,T.Material>();let active=false;
 return(occluded:boolean)=>{if(active===occluded)return;active=occluded;for(const {mesh,original} of entries){if(!occluded){mesh.material=original;continue;}let material=faded.get(original);if(!material){material=original.clone();material.onBeforeCompile=original.onBeforeCompile;material.customProgramCacheKey=original.customProgramCacheKey;material.userData=original.userData;material.transparent=true;material.opacity=.22;material.depthWrite=false;faded.set(original,material);}mesh.material=material;}};
}
