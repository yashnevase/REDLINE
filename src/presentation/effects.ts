import * as T from 'three';
import type { Materials } from './materials.ts';
import type { Tuning } from './scene.ts';

// Authored visual loop only: no damage, collision, or gameplay state is simulated here.
export function makeEffects(world: T.Group, materials: Materials, tuning: Tuning) {
  const root = new T.Group(); world.add(root);
  const pulse = new T.Group(), warning = new T.Group(); root.add(pulse, warning);
  const basic = (color: string, opacity: number) => new T.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: T.DoubleSide, toneMapped: false });
  const fill = basic('#83beff', .1), outer = basic('#b3ccff', .8), inner = basic('#c8d9ff', .45), edge = basic('#7868ff', .5), redFill = basic('#ff4551', .12), redEdge = basic('#ff6875', .7);
  const ring = (radius: number, width: number, mat: T.Material, parent: T.Group, start = 0, length = Math.PI * 2) => {
    const mesh = new T.Mesh(new T.RingGeometry(radius - width, radius, 128, 1, start, length), mat); mesh.rotation.x = -Math.PI / 2; mesh.position.y = .035 + parent.children.length * .004; parent.add(mesh); return mesh;
  };
  ring(1, .98, fill, pulse); ring(1,.045,outer,pulse);ring(.92,.035,inner,pulse);ring(.74,.035,inner,pulse);
  const band = basic('#889fff', .18); ring(.995,.065,band,pulse);
  const rayGeo = new T.BufferGeometry(); rayGeo.setAttribute('position', new T.Float32BufferAttribute([-.008,.3,0,.008,.3,0,0,.56,0],3));
  const rays = new T.InstancedMesh(rayGeo, inner, 16); pulse.add(rays);
  const ray = new T.Object3D(); for (let i=0;i<16;i++) { ray.rotation.set(-Math.PI/2,0,i*Math.PI/8); ray.position.y=.06; ray.updateMatrix(); rays.setMatrixAt(i,ray.matrix); }
  const arcs = [ring(1.06,.025,edge,pulse,.1,1.4),ring(1.06,.025,edge,pulse,2.2,1.3),ring(.6,.03,inner,pulse,3.8,1.8)];
  ring(1.15,1.14,redFill,warning,-.75,1.5);ring(1.15,.022,redEdge,warning,-.75,1.5);
  const slashMat = basic('#d7edff', .8);
  const slash = ring(1.1,.16,slashMat,root,-.8,1.9); slash.rotation.z=.2; slash.position.y=.33;
  const shards = new T.InstancedMesh(new T.OctahedronGeometry(.055),materials.white,18);shards.instanceMatrix.setUsage(T.DynamicDrawUsage);root.add(shards);
  const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d')!;
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 72px Arial';ctx.lineWidth=9;ctx.strokeStyle='#3b2f42';ctx.strokeText('8',64,64);ctx.fillStyle='#fff0bd';ctx.fillText('8',64,64);
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
  const numberMaterial=new T.SpriteMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false});const number=new T.Sprite(numberMaterial);number.scale.set(.65,.65,1);root.add(number);
  const dummy=new T.Object3D();
  function update(time:number,hero:T.Vector3,enemy:T.Vector3) {
    const phase=time%4; const progress=Math.max(0,Math.min(1,(phase-1.35)/1.4));const active=phase>=1.35&&phase<3;
    pulse.position.set(hero.x,0,hero.z);pulse.visible=active;
    pulse.scale.setScalar(tuning.effectRadius*(.4+Math.sqrt(progress)*.6));
    const fade=active?Math.max(0,1-progress*.85):0;
    fill.opacity=.34*fade;band.opacity=.22*fade;outer.opacity=.95*fade;inner.opacity=.6*fade;edge.opacity=.7*fade;
    arcs.forEach((arc,i)=>arc.rotation.z=time*(i%2?-.4:.3));
    warning.position.set(enemy.x,.008,enemy.z);warning.rotation.y=-.8;warning.visible=phase<1.55;
    slash.visible=active&&progress<.7;slash.position.x=hero.x+.8;slash.position.z=hero.z-.6;slash.scale.setScalar(1.4+progress);slashMat.opacity=.85*fade;slash.rotation.z=progress*1.8-.5;
    shards.visible=active;for(let i=0;i<18;i++){const a=i*Math.PI*2/18;dummy.position.set(enemy.x+Math.sin(a)*progress*1.6,.5+Math.sin(progress*Math.PI)*(.35+(i%3)*.15),enemy.z+Math.cos(a)*progress*1.6);dummy.rotation.set(i+time,i*.4,time);dummy.scale.setScalar(fade*(i%2?.7:1));dummy.updateMatrix();shards.setMatrixAt(i,dummy.matrix);}shards.instanceMatrix.needsUpdate=true;
    number.visible=phase>1.65&&phase<3;number.position.set(enemy.x,1.2+progress*.65,enemy.z);numberMaterial.opacity=fade;
  }
  return {root,update};
}
