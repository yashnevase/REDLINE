import * as T from 'three';
export function makeLaneWarning(){
 const root=new T.Group();
 const material=new T.MeshBasicMaterial({color:'#ff5364',transparent:true,opacity:.2,depthWrite:false,side:T.DoubleSide,forceSinglePass:true,toneMapped:false});
 const fill=new T.Mesh(new T.PlaneGeometry(1,1),material);fill.rotation.x=-Math.PI/2;root.add(fill);
 const edge=new T.LineLoop(new T.BufferGeometry().setFromPoints([new T.Vector3(-.5,.012,0),new T.Vector3(.5,.012,0),new T.Vector3(.5,.012,1),new T.Vector3(-.5,.012,1)]),new T.LineBasicMaterial({color:'#ff9b9e',transparent:true,opacity:.85}));root.add(edge);
 function draw(x:number,z:number,dx:number,dz:number,width:number,length:number,progress:number){root.position.set(x,.04,z);root.rotation.y=Math.atan2(dx,dz);fill.scale.set(width,length,1);fill.position.z=length/2;edge.scale.set(width,1,length);material.opacity=.12+Math.max(0,Math.min(1,progress))*.2;}
 return{root,draw};
}
