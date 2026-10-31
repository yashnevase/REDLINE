import * as T from 'three';
// One camera-space instanced pass, with an empty centre and no simulation state.
export function makeSpeedLines(scene:T.Scene,camera:T.OrthographicCamera){
 const material=new T.MeshBasicMaterial({color:'#e9daff',transparent:true,opacity:0,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,toneMapped:false});
 const geometry=new T.PlaneGeometry(1,.022,2,1),colours:number[]=[];for(let i=0;i<geometry.attributes.position.count;i++){const x=geometry.attributes.position.getX(i);colours.push(1,1,1,1-Math.abs(x)*2);}geometry.setAttribute('color',new T.Float32BufferAttribute(colours,4));material.vertexColors=true;
 const mesh=new T.InstancedMesh(geometry,material,32);mesh.count=0;mesh.frustumCulled=false;mesh.renderOrder=20;camera.add(mesh);scene.add(camera);const dummy=new T.Object3D();
 return{reset:()=>{mesh.count=0;},draw:(time:number,strength:number,heat:number,quiet:boolean,flashQuiet:boolean,low:boolean)=>{
  mesh.count=quiet||strength<=0?0:low?16:32;material.opacity=strength*(flashQuiet?.1:.65)*(1+heat*.25);
  const width=(camera.right-camera.left)/camera.zoom,height=(camera.top-camera.bottom)/camera.zoom;
  for(let i=0;i<mesh.count;i++){const a=i*2.399963229728653,r=.82+((time*(.8+strength)+i*.137)%1)*.36,dx=Math.cos(a)*width/2,dy=Math.sin(a)*height/2;dummy.position.set(dx*r,dy*r,-.5);dummy.rotation.set(0,0,Math.atan2(dy,dx));dummy.scale.set(height*(.07+strength*.1),1,1);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);}mesh.instanceMatrix.needsUpdate=true;
 },metadata:()=>({count:mesh.count,opacity:material.opacity})};
}
