import * as T from 'three';
import {worldPlateUV,AM3_ENABLED} from './am3-surface.ts';
export const AM4_ENABLED=true;
export function addLevelDetail(root:T.Group,level:number,low=false){
 const steel=new T.MeshLambertMaterial({color:'#8794a5'}),dark=new T.MeshLambertMaterial({color:'#25242b'}),glow=new T.MeshBasicMaterial({color:'#ff9f38',toneMapped:false});
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,m:T.Material)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);root.add(o);return o;};
 if(level===1&&AM4_ENABLED){
  const light=new T.PointLight('#ff8738',90,12,2);light.position.set(0,-2.6,0);root.add(light);box(16,.4,16,0,-4.1,0,dark);
  if(!low){for(const side of [-1,1]){box(16,.22,.28,0,.03,side*8.1,steel);box(.28,.22,16,side*8.1,.03,0,steel);box(16,.04,.06,0,-.13,side*7.8,glow);box(.06,.04,16,side*7.8,-.13,0,glow);}box(16,.16,1.3,0,-.075,0,steel);box(1.3,.16,16,0,-.075,0,steel);for(let j=0;j<7;j++)box(2.1,.2,.75,5.8,-.2-j*.48,6.7-j*.8,dark);for(const side of [-1,1]){box(8,.14,.2,side*28,.5,3.7,steel);box(8,.14,.2,side*28,.5,-3.7,steel);box(.2,1.5,7.4,side*31.6,-.25,0,dark);box(2,1.7,1.6,side*28,1,1.5,steel);box(1.4,1.1,1.4,side*29,.7,-1.2,dark);}}
  if(!low)for(const side of[-1,1]){box(2,.24,12,side*6.8,-1.45,0,steel);box(.15,2.1,12,side*7.65,-2.6,0,dark);for(let j=0;j<4;j++){box(1.7,.18,.75,side*(6.1-j*.5),-.3-j*.32,-6.5,steel);}const motor=new T.Mesh(new T.CylinderGeometry(.65,.65,3.6,8),steel);motor.rotation.x=Math.PI/2;motor.position.set(side*4.7,-2.7,-3);root.add(motor);box(.15,.15,6,side*6.2,-1.2,0,glow);}
  for(const side of [-1,1]){box(16,4,.4,0,-2,side*8,steel);box(.4,4,16,side*8,-2,0,steel);}
  for(let i=0;i<11;i++){const grate=new T.Mesh(new T.PlaneGeometry(.12,16),steel);grate.rotation.x=-Math.PI/2;grate.position.set(-7.5+i*1.5,0,0);root.add(grate);}
  for(const x of [-4,4]){const gear=new T.Mesh(new T.CylinderGeometry(2.3,2.3,.25,16),steel);gear.position.set(x,-3.2,0);root.add(gear);for(let i=0;i<(low?0:12);i++){const a=i*Math.PI/6;box(.4,.3,.4,x+Math.sin(a)*2.4,-3.2,Math.cos(a)*2.4,steel);}box(4,.04,.22,x,-3.5,0,glow);}
  for(const x of [5.7,6.5])box(.08,3.6,.08,x,-2,7.7,steel);for(let i=0;i<(low?5:10);i++)box(.9,.07,.1,6.1,-.5-i*(low?.65:.33),7.7,glow);
  for(const side of [-1,1]){box(low?6:13,low?.6:1.6,low?6:10,side*28,-.3,0,steel);for(let i=0;i<5;i++)box(1,.2,5,side*(24+i),-.1-i*.18,0,steel);box(1.8,1.4,1.8,side*28,.7,1,steel);}
 }
 if(level===2&&AM3_ENABLED){
  // Shared irregular joints, physically separated chunks and a lower emissive layer.
  let seed=8531;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const seeds=Array.from({length:64},(_,i)=>new T.Vector2(-16.5+(i%8+.5)*4.125+(random()-.5)*2.5,-16.5+(Math.floor(i/8)+.5)*4.125+(random()-.5)*2.5));
  function clip(poly:T.Vector2[],normal:T.Vector2,limit:number){const out:T.Vector2[]=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=a.dot(normal)-limit,db=b.dot(normal)-limit;if(da<=0)out.push(a);if((da<=0)!==(db<=0))out.push(a.clone().lerp(b,da/(da-db)));}return out;}
  const plate=new T.MeshLambertMaterial({color:'#525c69'});
  for(const seed of seeds){
   let corners=[new T.Vector2(-16.5,-16.5),new T.Vector2(16.5,-16.5),new T.Vector2(16.5,16.5),new T.Vector2(-16.5,16.5)];
   for(const other of seeds)if(other!==seed)corners=clip(corners,other.clone().sub(seed),(other.lengthSq()-seed.lengthSq())*.5);
   const centre=corners.reduce((a,p)=>a.add(p),new T.Vector2()).multiplyScalar(1/corners.length),shape=new T.Shape(),inset=.90+random()*.075,elevation=random();
   corners.forEach((p,i)=>{const q=p.clone().sub(centre).multiplyScalar(inset).add(centre);if(i)shape.lineTo(q.x,-q.y);else shape.moveTo(q.x,-q.y);if(!low&&seeds.indexOf(seed)%5===0&&i===1){const next=corners[(i+1)%corners.length].clone().sub(centre).multiplyScalar(inset).add(centre),chip=q.clone().lerp(next,.45).lerp(centre,.09);shape.lineTo(chip.x,-chip.y);}});shape.closePath();
   const g=low?new T.ShapeGeometry(shape):new T.ExtrudeGeometry(shape,{depth:.28,bevelEnabled:true,bevelSize:.035,bevelThickness:.02,bevelSegments:1,steps:1});g.rotateX(-Math.PI/2);worldPlateUV(g,0,0);g.setAttribute('floorCentre',new T.Float32BufferAttribute(Array.from({length:g.attributes.position.count},()=>[centre.x,centre.y,1]).flat(),3));const chunk=new T.Mesh(g,plate);chunk.position.y=low?0:-.30+elevation*.015;root.add(chunk);
  }
  const mat=new T.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:'varying vec2 p;void main(){p=uv*12.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 p;uniform float time;void main(){float fire=.85+sin(p.x*3.+p.y*5.+time*.7)*.06+sin(p.y*9.-time*.4)*.03;gl_FragColor=vec4(1.,.45*fire,.035,1.);}'});const floor=new T.Mesh(new T.PlaneGeometry(33.4,33.4),mat);floor.rotation.x=-Math.PI/2;floor.position.y=low?-.09:-.18;root.add(floor);
  const light=new T.PointLight('#ff9239',28,10,2);light.position.set(-3,1,5);root.add(light);
 }
}
