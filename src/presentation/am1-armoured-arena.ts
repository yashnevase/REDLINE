import * as T from 'three';
import {steelBladeShape} from './bl-steel.ts';
import {batchParts} from './batch-parts.ts';
export const AM1_ENABLED=true,AM2_ENABLED=true;
// Showcase candidate: original geometry, reference pictures are never runtime textures.
export function makeArmouredArena(parent:T.Group){
 const root=new T.Group();root.name='AM1-armoured-arena';parent.add(root);
 const metal=new T.MeshLambertMaterial({color:'#62524b'}),dark=new T.MeshLambertMaterial({color:'#453c39'}),rust=new T.MeshLambertMaterial({color:'#725342'}),edge=new T.MeshBasicMaterial({color:'#b682ec',toneMapped:false}),amber=new T.MeshBasicMaterial({color:'#ffa22d',toneMapped:false}),bolt=new T.MeshLambertMaterial({color:'#82796e'});
 const mesh=(g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0,angle=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.rotation.y=angle;root.add(o);return o;};
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,m:T.Material,angle=0)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,angle);
 const shape=new T.Shape();[[-20,-24],[20,-24],[24,-20],[24,20],[20,24],[-20,24],[-24,20],[-24,-20]].forEach(([x,z],i)=>i?shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();const shell=new T.ExtrudeGeometry(shape,{depth:4.2,bevelEnabled:true,bevelSegments:1,bevelSize:.3,bevelThickness:.3,steps:1});shell.rotateX(Math.PI/2);mesh(shell,metal,0,-.5,0);
 for(let z=-23;z<24;z+=2)for(let x=-23;x<24;x+=2){if(Math.abs(x)+Math.abs(z)>43)continue;const centre=Math.abs(x)<17&&Math.abs(z)<17;box(1.96,.06,1.96,x,.025,z,centre?dark:metal);}
 for(let side=0;side<4;side++){const a=side*Math.PI/2,s=Math.sin(a),c=Math.cos(a);for(let i=-3;i<=3;i++){const k=i*5.7;box(5.5,2.7,.16,k*c+24.5*s,-2,k*-s+24.5*c,i%2?metal:rust,a);for(const dx of [-2.45,2.45])for(const y of [-.85,-3.1])mesh(new T.SphereGeometry(.075,5,3),bolt,(k+dx)*c+24.5*s,y,(k+dx)*-s+24.5*c);box(3.4,.6,.08,k*c+24.64*s,-1.8,k*-s+24.64*c,amber,a);for(let j=-2;j<=2;j++)box(.13,.72,.12,(k+j*.56)*c+24.72*s,-1.8,(k+j*.56)*-s+24.72*c,dark,a);}
  box(39,1,1.5,23.4*s,.35,23.4*c,dark,a);
  box(39,.07,.08,23*s,.9,23*c,edge,a);
  for(const end of [-1]){const x=end*21*c+21*s,z=-end*21*s+21*c;box(4.2,.9,3,x,.45,z,metal,a);mesh(new T.CylinderGeometry(.55,.65,.6,12),dark,x,1.15,z);mesh(new T.SphereGeometry(.46,12,8),amber,x,1.65,z);const light=new T.PointLight('#ff9b34',70,9,2);light.position.set(x,2,z);root.add(light);}
 }
 // Hazard frame is at the actual ±17u play boundary, not the old inset groove.
 if(AM2_ENABLED){const c=document.createElement('canvas');c.width=512;c.height=64;const ctx=c.getContext('2d')!;ctx.fillStyle='#c3a04d';ctx.fillRect(0,0,512,64);ctx.fillStyle='#252327';for(let x=-64;x<576;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+32,0);ctx.lineTo(x-32,64);ctx.lineTo(x-64,64);ctx.fill();}const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.wrapS=T.RepeatWrapping;map.repeat.x=2.5;const material=new T.MeshLambertMaterial({map,side:T.DoubleSide});for(let side=0;side<4;side++){const a=side*Math.PI/2;box(35,.08,1.4,17*Math.sin(a),.075,17*Math.cos(a),dark,a);const o=mesh(new T.PlaneGeometry(34,1.15),material,17*Math.sin(a),.13,17*Math.cos(a));o.rotation.set(-Math.PI/2,0,-a);}}
 // Corner machinery, under-hull conduits, and riveted plates.
 for(const sx of [-1,1])for(const sz of [-1,1]){const x=sx*19.5,z=sz*19.5;for(let i=0;i<3;i++){const r=.7+i*.18,g=new T.ShapeGeometry(steelBladeShape());g.rotateX(-Math.PI/2);g.scale(r/.292,1,r/.292);mesh(g,i%2?rust:bolt,x+i*.85*sx,.25,z-i*.5*sz);mesh(new T.CylinderGeometry(r*.3,r*.3,.24,8),dark,x+i*.85*sx,.3,z-i*.5*sz);}box(1.2,1.1,1.2,x-1.3*sx,.6,z,rust);for(const y of [-2.8,-3.4]){const p=mesh(new T.CylinderGeometry(.14,.14,7,8),dark,sx*23,y,sz*17);p.rotation.z=Math.PI/2;}}
 for(const side of [-1,1]){for(const x of [-12,12]){const g=new T.ShapeGeometry(steelBladeShape());g.scale(5,5,5);mesh(g,bolt,x,-2.7,side*24.8);mesh(new T.CircleGeometry(.45,16),dark,x,-2.7,side*24.84);const cable=mesh(new T.TorusGeometry(1.5,.10,6,24,Math.PI),dark,x,-3.8,side*24.7);cable.rotation.z=Math.PI;}}

 batchParts(root);return root;
}
