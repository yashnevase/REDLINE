import {hazardState} from '../src/sim/s4-extras.ts';
import {chapterCommand} from './close-mission-runs.mjs';import {combatDefaults as t} from '../src/content/combat.ts';
const unit=(x,z)=>{const d=Math.hypot(x,z)||1;return{x:x/d,z:z/d};};
export function skilledCommand(s){if(s.phase.kind!=='boss'){const c=chapterCommand(s);if(s.phase.kind!=='fight')return c;const h=s.hero,surge=s.director.surge.kind==='idle'?undefined:s.director.surge.points.find(p=>Math.hypot(p.x-h.x,p.z-h.z)<3);if(surge)return{...c,...unit(h.x-surge.x||.1,h.z-surge.z||.1),dash:s.director.surge.kind==='active'&&h.charges>0};const world=hazardState(s,t);if((world.warning||world.active)&&Math.abs(h.z-world.cart.z)<1.6&&Math.abs(h.x)<12)return{...c,x:0,z:Math.sign(h.z-world.cart.z||1),dash:world.active&&h.charges>0};const aoe=s.enemies.find(e=>e.hp>0&&e.kind==='grinder'&&e.behavior.kind==='windup'&&e.behavior.remaining<18&&Math.hypot(e.x-h.x,e.z-h.z)<3.8);if(aoe){const d=unit(h.x-aoe.x,h.z-aoe.z);return{...c,...d,dash:h.charges>0&&aoe.behavior.remaining<8};}return c;}
 const h=s.hero,b=s.phase.boss,r=b.rex;if(!r)return chapterCommand(s);let dx=b.x-h.x,dz=b.z-h.z,dist=Math.hypot(dx,dz),dash=false;
 const nearby=s.enemies.filter(e=>e.hp>0&&e.behavior.kind!=='spawn').sort((a,c)=>Math.hypot(a.x-h.x,a.z-h.z)-Math.hypot(c.x-h.x,c.z-h.z))[0];
 if(nearby&&Math.hypot(nearby.x-h.x,nearby.z-h.z)<4&&r.mode==='recovery'){dx=nearby.x-h.x;dz=nearby.z-h.z;}
 if(r.mode==='warning'||r.mode==='active'){
  if(r.attack==='sweep'){dx=b.x+r.dx*3.1-h.x;dz=b.z+r.dz*3.1-h.z;dash=r.mode==='warning'&&r.remaining<10&&Math.hypot(dx,dz)>1;}
  if(r.attack==='slam'){
   const radius=r.elapsed/60*t.rexRingSpeed;const danger=r.mode==='warning'?r.targets.some(p=>Math.hypot(p.x-h.x,p.z-h.z)<2.4):Math.abs(dist-radius)<1.5;
   if(danger||r.mode==='warning'&&dist<5){const a=Math.atan2(h.z-b.z,h.x-b.x)+.35;dx=Math.cos(a);dz=Math.sin(a);dash=r.mode==='active'&&Math.abs(dist-radius)<1.3||r.mode==='warning'&&r.remaining<8;}
  }
  if(r.attack==='boomerang'){const across=(h.x-r.origin.x)*r.dz-(h.z-r.origin.z)*r.dx;if(Math.abs(across)<3.4){dx=r.dz*Math.sign(across||1);dz=-r.dx*Math.sign(across||1);}const saw=r.saws.find(p=>Math.hypot(p.x-h.x,p.z-h.z)<2);if(saw){dx=h.x-saw.x;dz=h.z-saw.z;dash=true;}}
  if(r.attack==='roll'){const across=(h.x-b.x)*r.dz-(h.z-b.z)*r.dx;if(Math.abs(across)<3.3){const sign=Math.sign(across||1);dx=r.dz*sign;dz=-r.dx*sign;dash=r.mode==='active'&&dist<5;}else{dx=0;dz=0;}}
  if(r.attack==='barrage'||r.attack==='vent'){const p=r.targets.find(p=>Math.hypot(p.x-h.x,p.z-h.z)<(r.attack==='vent'?3:2.5));if(p){dx=h.x-p.x;dz=h.z-p.z;if(!Math.hypot(dx,dz)){dx=1;dz=1;}dash=r.mode==='active'&&r.attack==='vent';}}
 }
 const grinder=s.enemies.find(e=>e.hp>0&&e.kind==='grinder'&&e.behavior.kind==='windup'&&Math.hypot(e.x-h.x,e.z-h.z)<3.7);if(grinder&&grinder.behavior.remaining<18){dx=h.x-grinder.x;dz=h.z-grinder.z;dash=grinder.behavior.remaining<8;}
 const direction=unit(dx,dz),ability=grinder&&grinder.behavior.remaining>=22&&h.stompCooldown===0?'stomp':dist<3.4&&h.pulseCooldown===0?'pulse':h.stompCooldown===0&&(dist<3.2&&b.exposed>0||nearby?.rexAdd&&Math.hypot(nearby.x-h.x,nearby.z-h.z)<3)?'stomp':dist>4&&r.mode==='recovery'&&h.boostCooldown===0?'boost':undefined;
 if(dist<2.5&&r.mode==='recovery'&&!nearby){direction.x=0;direction.z=0;}
 return{...direction,dash:dash&&h.charges>0,ability,overdrive:h.heat>=t.heatThreshold};
}
