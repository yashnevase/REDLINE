import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {makeAbilityEffects} from '../src/presentation/b4-ability-effects.ts';
import {combatDefaults as tuning} from '../src/content/combat.ts';
import {initialRun} from '../src/sim/run-schema.ts';
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
  const sprites=fx.root.children.filter(o=>o instanceof T.Sprite&&o.visible);assert.equal(sprites.length,1);const other=sprites[0];assert.notEqual(other.material.map,map);assert.equal(other.material.version,version);
  fx.reset();const feedback=fx.draw(0,{...hero,dashing:false},preferences);
  assert.equal(feedback.kick,0);assert.equal(feedback.heroFlash,0);
  assert.equal(fx.root.children.some(o=>(o instanceof T.Sprite||o instanceof T.Mesh&&!(o instanceof T.InstancedMesh))&&o.visible),false);
  assert.equal(fx.root.children.find(o=>o instanceof T.InstancedMesh).count,0);
  fx.ingest([{...event,id:'pulse',kind:'pulse',radius:2.5,amount:2}],0);fx.draw(.2,{...hero,dashing:false},preferences);
  const pulseRing=fx.root.children.find(o=>o instanceof T.Mesh&&o.geometry.parameters?.innerRadius===.68&&o.visible);
  assert.equal(pulseRing,undefined); // Dedicated instanced ability pass owns Spin now.
  fx.draw(.9,{...hero,dashing:false},preferences);assert.equal(fx.root.children.some(o=>o instanceof T.Mesh&&o.geometry.parameters?.innerRadius===.68&&o.visible),false);
  fx.reset();
  // Reusing an event ID in a fresh run must still produce its new effect.
  fx.ingest([event],0);fx.draw(.05,{...hero,dashing:false},preferences);
  assert.equal(fx.root.children.some(o=>o instanceof T.Sprite&&o.visible),true);
 }finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
});
test('a crowded Spin retains its ability layers while hit-number slots stay bounded',()=>{
 const previous=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>({strokeText(){},fillText(){}})})};
 try{const world=new T.Group(),fx=makeCombatFX(world,{hot:new T.MeshBasicMaterial(),chrome:new T.MeshBasicMaterial()});fx.ingest([{id:'spin',tick:0,kind:'blade',amount:0,x:0,z:0,radius:2.5},...Array.from({length:12},(_,i)=>({id:`hit-${i}`,tick:0,kind:'bonk',amount:24,x:3+i,z:2}))],0);fx.draw(.1,{x:0,z:0,dashing:false},preferences);const rings=fx.root.children.filter(o=>o instanceof T.Mesh&&!(o instanceof T.InstancedMesh)&&o.visible&&o.position.x===0&&o.position.z===0);assert.equal(rings.length,0);const ability=makeAbilityEffects(world),run=initialRun(tuning);run.hero.special={kind:'spin',remaining:36,hopRemaining:0};ability.draw(run,tuning,new T.PerspectiveCamera(),false,false,false);assert.ok(ability.metadata().instances>=4);assert.ok(fx.root.children.filter(o=>o instanceof T.Sprite&&o.visible).length<=8);
 }finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
});
test('crowded killing blows retain readable damage and death debris; Low reserves a number beside ability FX',()=>{
 const previous=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>({strokeText(){},fillText(){}})})};
 try{const fx=makeCombatFX(new T.Group(),{hot:new T.MeshBasicMaterial(),chrome:new T.MeshBasicMaterial()});const events=[{id:'pulse',tick:0,kind:'pulse',amount:0,x:0,z:0,radius:2.5},{id:'stomp',tick:0,kind:'stomp',amount:0,x:0,z:0,radius:2}];for(let i=0;i<12;i++)events.push({id:`bonk${i}`,tick:0,kind:'bonk',amount:24,x:i+2,z:0},{id:`kill${i}`,tick:0,kind:'defeat',amount:0,x:i+2,z:0});fx.ingest(events,0);fx.draw(.1,{x:0,z:0,dashing:false},preferences);assert.ok(fx.root.children.some(o=>o instanceof T.Sprite&&o.visible));assert.ok(fx.root.children.some(o=>o instanceof T.InstancedMesh&&o.geometry.type==='IcosahedronGeometry'&&o.count>0));fx.draw(.12,{x:0,z:0,dashing:false},{...preferences,quality:'low'});assert.ok(fx.root.children.some(o=>o instanceof T.Sprite&&o.visible));
 }finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
});
test('moving pooled FX refresh their culling bounds on both sides of the play zone',()=>{
 const previous=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>({strokeText(){},fillText(){}})})};
 try{const fx=makeCombatFX(new T.Group(),{hot:new T.MeshBasicMaterial(),chrome:new T.MeshBasicMaterial()});for(const [tick,x] of [[0,16],[60,-16]]){fx.ingest([{id:String(tick),tick,kind:'bonk',amount:8,x,z:x}],tick);fx.draw(tick/60+.05,{x,z:x,dashing:false},preferences);const sparks=fx.root.children.find(o=>o instanceof T.InstancedMesh&&o.instanceMatrix.count===320);assert.ok(sparks.boundingSphere);assert.ok(Math.abs(sparks.boundingSphere.center.x-x)<2);assert.ok(Math.abs(sparks.boundingSphere.center.z-x)<2);}}
 finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
});
