import * as T from 'three';
import {steelBladeShape} from './bl-steel.ts';
import {C3_KIT_ENABLED} from '../content/items/c-world.ts';
type Part=(g:T.BufferGeometry,x:number,y:number,z:number,sx:number,sy:number,sz:number,tint:string,rx?:number,ry?:number,rz?:number,giant?:boolean)=>void;
type Box=(x:number,y:number,z:number,w:number,h:number,d:number,tint:string,rz?:number,giant?:boolean)=>void;
export const catalogue=['crushed-car','ribbed-container','roller-conveyor','pendulum-saw','gear-train','crane-cables','abstract-neon-board','passing-hauler','meteor-scrap'] as const;
// Original compact geometry; all pieces join the existing vertex-colour world batch.
export function addScrapCatalogue(i:number,x:number,y:number,z:number,part:Part,box:Box,motion:(mode:number)=>void){
 if(!C3_KIT_ENABLED)return;const kind=i%catalogue.length;
 if(kind===0){box(x,y+1,z,4.2,.7,2.2,'#7a4938',.08);box(x-.3,y+1.7,z,2.1,.9,1.9,'#4d4a50',-.12);box(x-.4,y+1.8,z+1,1.6,.45,.05,'#262c34');for(const side of [-1,1])for(const end of [-1,1])part(new T.CylinderGeometry(.55,.55,.3,8),x+end*1.4,y+.6,z+side*1.1,1,1,1,'#292830',Math.PI/2);}
 if(kind===1){box(x,y+1.7,z,4.8,2.6,2.4,'#6b3b30');for(let j=0;j<9;j++)for(const side of [-1,1])box(x-2.1+j*.52,y+1.7,z+side*1.24,.08,2.5,.1,'#806554');box(x,y+3.1,z,5,.12,2.5,'#97816a');}
 if(kind===2){box(x,y+1,z,6,.25,2.5,'#413c40');for(let j=0;j<6;j++)part(new T.CylinderGeometry(.25,.25,2.4,6),x-2.5+j,y+1.3,z,1,1,1,'#8c8272',Math.PI/2);for(const side of [-1,1])box(x,y+1.6,z+side*1.3,6,.16,.15,'#a38150');motion(10.3);part(new T.ShapeGeometry(steelBladeShape()),x,y+1.7,z,2,2,2,'#b29b75',-Math.PI/2);}
 if(kind===3){box(x,y+5,z,6,.3,.4,'#8c6650');for(const side of [-1,1])box(x+side*2.7,y+2.4,z,.3,5,.35,'#5d4d47');motion(20.3);for(let j=0;j<7;j++)part(new T.TorusGeometry(.12,.035,3,6),x,y+4.8-j*.45,z,1,1,1,'#aaa090',0,j%2*Math.PI/2);part(new T.ShapeGeometry(steelBladeShape()),x,y+1.2,z,6,6,6,'#aa9481');}
 if(kind===4){motion(10.4);for(let j=0;j<3;j++){const g=new T.ShapeGeometry(steelBladeShape());part(g,x-1.7+j*1.7,y+1.3,z,4,4,4,j%2?'#736766':'#9d7a59',-Math.PI/2);part(new T.CylinderGeometry(.24,.24,.3,6),x-1.7+j*1.7,y+1.35,z,1,1,1,'#4c4243');}}
 if(kind===5){box(x,y+4,z,6,.3,.35,'#9a7857',.15);for(let j=0;j<3;j++){const curve=new T.CatmullRomCurve3([new T.Vector3(-2+j*1.6,4,0),new T.Vector3(-2+j*1.6,2.2,1),new T.Vector3(-1+j*1.6,.5,0)]);motion(20.2);part(new T.TubeGeometry(curve,5,.045,3,false),x,y,z,1,1,1,'#514957');}part(new T.TorusGeometry(.35,.09,4,10,Math.PI*1.6),x-1,y+.4,z,1,1,1,'#af916f');}
 if(kind===6){box(x,y+3,z,4,2.5,.2,'#2d2737');for(const side of [-1,1])box(x+side*2.1,y+3,z,.08,2.7,.3,'#aa78ff');for(let j=0;j<4;j++){box(x-1.3+j*.85,y+3+Math.sin(j*3)*.6,z+.15,.4,.12,.08,'#aa78ff',j*.7);box(x-1.3+j*.85,y+2.8,z+.15,.1,.55,.08,'#ff8639');}box(x,y+1,z,.3,3,.3,'#685953');}
 if(kind===7){motion(30.2);for(const side of[-1,1]){part(new T.CylinderGeometry(1,1,.2,3),x-1,y+1.9,z+side*2,2,1,2.3,'#6d7580',0,side*.5,Math.PI/2);part(new T.CylinderGeometry(.48,.7,1,6),x-3.7,y+2,z+side*.7,1,1,1,'#a39b87',0,0,Math.PI/2);}box(x,y+2,z,7,1.2,2.4,'#604c40');box(x+2.2,y+2.8,z,2,1.2,2,'#7e5f44');for(const side of [-1,1])box(x-1,y+1.2,z+side*1.1,5,.2,.3,'#aa78ff');box(x+3.3,y+2.7,z,.1,.25,1.5,'#ff8639');}
 if(kind===8){motion(30.7);for(let j=0;j<6;j++){part(new T.IcosahedronGeometry(.35,0),x+j*1.2,y+1+j*.4,z,1.2,.7,1,'#78523c');box(x-1+j*1.2,y+1+j*.4,z,1.5,.035,.04,'#ff8639',.3);}}
}
