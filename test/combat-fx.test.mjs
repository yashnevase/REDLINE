import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {makeCombatFX} from '../src/presentation/combat-fx.ts';
const preferences={quality:'standard',reducedMotion:false,reducedFlashes:false};
test('damage textures switch without shader invalidation; explicit restart clears same-tick effects and trails',()=>{
 const previous=globalThis.document;
 globalThis.document={createElement:()=>({getContext:()=>({strokeText(){},fillText(){}})})};
 try{
  const world=new T.Group(),fx=makeCombatFX(world,{hot:new T.MeshBasicMaterial(),chrome:new T.MeshBasicMaterial()});
  const hero={x:0,z:0,dashing:true};
  const event={id:'first',tick:0,kind:'bonk',amount:8,x:0,z:0};
  fx.ingest([event],0);fx.draw(.05,hero,preferences);
  const number=fx.root.children.find(o=>o instanceof T.Sprite&&o.visible),version=number.material.version,map=number.material.map;
  fx.draw(.06,hero,preferences);assert.equal(number.material.version,version);assert.equal(number.material.map,map);
  fx.ingest([{...event,id:'second',amount:12}],0);fx.draw(.07,hero,preferences);
  const other=fx.root.children.filter(o=>o instanceof T.Sprite&&o.visible)[1];assert.notEqual(other.material.map,map);assert.equal(other.material.version,version);
  fx.reset();const feedback=fx.draw(0,{...hero,dashing:false},preferences);
  assert.equal(feedback.kick,0);assert.equal(feedback.heroFlash,0);
  assert.equal(fx.root.children.some(o=>(o instanceof T.Sprite||o instanceof T.Mesh&&!(o instanceof T.InstancedMesh))&&o.visible),false);
  assert.equal(fx.root.children.find(o=>o instanceof T.InstancedMesh).count,0);
  fx.ingest([{...event,id:'pulse',kind:'pulse',radius:2.5,amount:2}],0);fx.draw(.2,{...hero,dashing:false},preferences);
  const pulseRing=fx.root.children.find(o=>o instanceof T.Mesh&&o.geometry.parameters?.innerRadius===.8&&o.visible);
  assert.equal(pulseRing.scale.x,2.5);
  fx.draw(.9,{...hero,dashing:false},preferences);assert.equal(pulseRing.visible,false);
  fx.reset();
  // Reusing an event ID in a fresh run must still produce its new effect.
  fx.ingest([event],0);fx.draw(.05,{...hero,dashing:false},preferences);
  assert.equal(fx.root.children.some(o=>o instanceof T.Sprite&&o.visible),true);
 }finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
});
test('a crowded Spin retains its ability layers while hit-number slots stay bounded',()=>{
 const previous=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>({strokeText(){},fillText(){}})})};
 try{const world=new T.Group(),fx=makeCombatFX(world,{hot:new T.MeshBasicMaterial(),chrome:new T.MeshBasicMaterial()});fx.ingest([{id:'spin',tick:0,kind:'blade',amount:0,x:0,z:0,radius:2.5},...Array.from({length:12},(_,i)=>({id:`hit-${i}`,tick:0,kind:'bonk',amount:24,x:3+i,z:2}))],0);fx.draw(.1,{x:0,z:0,dashing:false},preferences);const rings=fx.root.children.filter(o=>o instanceof T.Mesh&&!(o instanceof T.InstancedMesh)&&o.visible&&o.position.x===0&&o.position.z===0);assert.ok(rings.length>=4);assert.ok(fx.root.children.filter(o=>o instanceof T.Sprite&&o.visible).length<=8);
 }finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
});
