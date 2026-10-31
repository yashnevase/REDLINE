import * as T from 'three';
import {random} from '../content/scene.mjs';
import {scrapyard} from '../content/chapters/scrapyard.ts';
export const GROUND_ENABLED=true;
export const C2_ENABLED=true;
export const C0_ENABLED=true;
// One instanced plate pass; authored atlas gives broad grime and quiet seams.
export function makeScrapGround(parent:T.Group){
 const rng=random(4107),canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const c=canvas.getContext('2d')!;
 c.fillStyle=scrapyard.palette.floor;c.fillRect(0,0,1024,1024);
 for(let k=0;k<4;k++){const x=k%2*512,y=Math.floor(k/2)*512;const g=c.createLinearGradient(x,y,x+512,y+512);g.addColorStop(0,'#594941');g.addColorStop(.55,'#50423c');g.addColorStop(1,'#483a34');c.fillStyle=g;c.fillRect(x,y,512,512);c.strokeStyle='#2b2422';c.lineWidth=4;c.strokeRect(x+3,y+3,506,506);
  for(let i=0;i<9;i++){const px=x+12+i*61;for(const py of [y+12,y+500]){c.fillStyle='#292725';c.beginPath();c.arc(px,py,3,0,7);c.fill();c.fillStyle='#796e61';c.fillRect(px-1,py-2,2,1);}}
  if(k===1){c.strokeStyle='#65574b';c.lineWidth=2;for(let i=30;i<490;i+=22)for(let j=30;j<490;j+=28){c.beginPath();c.moveTo(x+i,y+j);c.lineTo(x+i+9,y+j+9);c.stroke();}}
  if(k===2){c.fillStyle='#39322f';c.fillRect(x+90,y+100,250,260);c.strokeStyle='#61534a';for(let i=0;i<18;i++){c.beginPath();c.moveTo(x+95+i*14,y+105);c.lineTo(x+95+i*14,y+355);c.stroke();}}
  if(k===3){c.fillStyle='#554b44';c.fillRect(x+240,y+270,150,140);c.strokeStyle='#88715a';c.lineWidth=3;c.strokeRect(x+240,y+270,150,140);c.fillStyle='#796644';for(let i=0;i<6;i++)c.fillRect(x+80+i*30,y+70,16,8);}
  const stain=c.createRadialGradient(x+300,y+340,4,x+300,y+340,170);stain.addColorStop(0,'#17151380');stain.addColorStop(1,'#17151300');if(k===3){c.fillStyle=stain;c.fillRect(x,y,512,512);}
  for(let i=0;i<250;i++){c.fillStyle=i%3?'#241d1910':'#a58c7010';c.fillRect(x+rng()*510,y+rng()*510,2+rng()*35,1);}
 }
 const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;
 const geometry=new T.PlaneGeometry(1,1).rotateX(-Math.PI/2),uv=geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*.5,uv.getY(i)*.5);
 const offsets=new Float32Array(576*2);geometry.setAttribute('plateUv',new T.InstancedBufferAttribute(offsets,2));const material=new T.MeshLambertMaterial({map,color:'#ffffff'});material.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 plateUv;').replace('#include <uv_vertex>','#include <uv_vertex>\nvMapUv += plateUv;');};material.customProgramCacheKey=()=> 'scrapyard-ground-v1';
 const mesh=new T.InstancedMesh(geometry,material,576),dummy=new T.Object3D();parent.add(mesh);const used=new Set<string>();let n=0;
 for(let z=0;z<24;z++)for(let x=0;x<24;x++){if(used.has(`${x},${z}`))continue;const w=x<23&&rng()>.5?2:1,d=z<23&&rng()>.65?2:1;let width=w,depth=d;for(let j=0;j<d;j++)for(let i=0;i<w;i++)if(used.has(`${x+i},${z+j}`)){width=1;depth=1;}for(let j=0;j<depth;j++)for(let i=0;i<width;i++)used.add(`${x+i},${z+j}`);
  dummy.position.set(-24+(x+width/2)*2,.005+rng()*.004,-24+(z+depth/2)*2);dummy.rotation.y=(rng()-.5)*.004;dummy.scale.set(width*2-.04,1,depth*2-.04);dummy.updateMatrix();mesh.setMatrixAt(n,dummy.matrix);const type=(rng()>.85?[0,1,3][Math.floor(rng()*3)]:2);offsets[n*2]=type%2*.5;offsets[n*2+1]=Math.floor(type/2)*.5;mesh.setColorAt(n,new T.Color().setScalar(.94+rng()*.10));n++;
 }mesh.count=n;mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();return mesh;
}
