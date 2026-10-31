import * as T from 'three';
import type {Materials} from './materials.ts';
import type {EnemyKind} from '../content/encounter.ts';
import {part,saw} from './industrial.ts';
import {shellPatch} from './models.ts';
// Shared body kit: rust panels, narrow grooves, violet rim, red-white eyes.
export function makeEnemy(kind:EnemyKind,m:Materials){
 const root=new T.Group(),body=new T.Group();root.add(body);body.position.y=kind==='grinder'||kind==='shieldsaw'?1:.7;const radius=kind==='grinder'?.94:.67;
 const shell=new T.SphereGeometry(radius,16,10),colours:number[]=[],positions=shell.attributes.position;for(let i=0;i<positions.count;i++){const y=positions.getY(i)/radius,noise=Math.sin(Math.round(positions.getX(i)*30)*17+Math.round(positions.getZ(i)*30)*13)*.025;const shade=.88+Math.max(0,y)*.28+noise;colours.push(shade,shade,shade);}shell.setAttribute('color',new T.Float32BufferAttribute(colours,3));const rust=m.rustActor.clone();rust.vertexColors=true;part(body,shell,rust);
 const seam=part(body,new T.TorusGeometry(radius*.975,.017,4,32),m.dark,0,-radius*.2,0);seam.rotation.x=Math.PI/2;
 const rim=part(body,new T.TorusGeometry(radius*.97,.013,4,32,Math.PI),m.violetRim,0,0,-.05);rim.rotation.y=Math.PI/2;
 const face=new T.Group();face.scale.setScalar(radius);body.add(face);
 for(const side of [-1,1]){shellPatch(face,[[side*.63,.08],[side*.12,-.11],[side*.29,-.32],[side*.52,-.23]],m.red,.015);shellPatch(face,[[side*.52,.01],[side*.22,-.12],[side*.32,-.22]],m.white,.028);for(const y of [-.42,.5]){const b=part(body,new T.SphereGeometry(.035,6,4),m.lightSteel,side*.32,y,Math.sqrt(Math.max(.01,radius*radius-.32**2-y*y))+.02);b.scale.z=.5;}}
 const symbol=new T.Group();body.add(symbol);symbol.scale.setScalar(radius);const cx=kind==='grinder'?-.12:kind==='shieldsaw'?0:.70,cy=kind==='grinder'?.43:kind==='shieldsaw'?.35:-.18;const points=Array.from({length:32},(_,i)=>{const a=i*Math.PI/16,r=i%4<2?.20:.16;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r];});shellPatch(symbol,points,m.dark,.015,3);shellPatch(symbol,Array.from({length:20},(_,i)=>[cx+Math.cos(i*Math.PI/10)*.08,cy+Math.sin(i*Math.PI/10)*.08]),m.rustLight,.023,3);
 if(kind==='shieldsaw')for(const child of body.children){child.scale.multiplyScalar(1.08);child.position.multiplyScalar(1.08);}
 const rotor=new T.Group();rotor.name='rotor';body.add(rotor);
 if(kind==='sawlet'){const ring=saw(rotor,m,1.02,0,.15,0);ring.rotation.x=Math.PI/2;rotor.rotation.z=-.12;}
 if(kind==='thrower'){
  const cap=part(body,new T.CylinderGeometry(.29,.33,.38,12),m.steel,0,.72,0);cap.rotation.z=-.18;
  for(let i=0;i<8;i++){const a=i*Math.PI/4;part(body,new T.SphereGeometry(.055,6,4),m.lightSteel,Math.cos(a)*.29,.70+(i%2)*.16,Math.sin(a)*.29);part(body,new T.SphereGeometry(.042,6,4),m.lightSteel,Math.cos(a)*.19,.92,Math.sin(a)*.19);}
  const barrel=part(body,new T.CylinderGeometry(.22,.26,.64,12),m.rustLight,-.28,.03,.78);barrel.rotation.x=Math.PI/2;
  part(body,new T.RingGeometry(.15,.22,20),m.lightSteel,-.28,.03,1.11);part(body,new T.CircleGeometry(.15,20),m.dark,-.28,.03,1.115);
 }
 if(kind==='shieldsaw'){
  const shield=m.steel.clone();shield.color.set('#9b898a');shield.map=m.rustPaint;
  for(const upper of [true,false]){const plank=part(body,new T.BoxGeometry(1.4,.8,.2),shield,0,0,0);plank.name=upper?'kit-shieldUpper':'kit-shieldLower';for(const a of [-.8,0,.8]){const bolt=part(body,new T.SphereGeometry(.039,6,4),m.lightSteel,Math.sin(a)*.84,upper?.82:-.82,Math.cos(a)*.84);bolt.scale.z=.5;const scratch=part(body,new T.BoxGeometry(.025,.28,.012),m.rust,Math.sin(a)*.83,upper?.73:-.7,Math.cos(a)*.83+.01);scratch.rotation.z=.13;}}
  const disc=saw(body,m,.54,.45,0,-.25);disc.rotation.y=.3;
 }
 if(kind==='grinder')for(const side of [-1,1]){const disc=saw(rotor,m,1.15,side*.94,0,0);disc.rotation.y=Math.PI/2;}
 const flash=part(body,new T.SphereGeometry(radius*1.02,16,10),new T.MeshBasicMaterial({color:'#fff',transparent:true,opacity:0,depthWrite:false}));flash.name='hit-flash';flash.visible=false;return{root,body,blade:rotor};
}
