import assert from 'node:assert/strict';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {combatDefaults as defaults} from '../src/content/combat.ts';
export function bossFixture(){
 const config={...defaults,heroHP:10000,bonkDamage:.001,pulseDamage:1000,openingThreats:12,pulseRadius:60,pulseCooldownTicks:1};const sim=createRunSimulation(config),commands=[],idle={x:0,z:0,dash:false};
 const step=c=>{commands.push(c);return sim.step(c);};let s=step({...idle,tuning:config});
 for(let i=0;i<80&&s.phase.kind!=='boss';i++)s=step(s.phase.kind==='upgrade'?{...idle,upgrade:s.phase.choices[0]}:{...idle,ability:'pulse'});
 assert.equal(s.phase.kind,'boss');s=step({...idle,tuning:{...config,pulseDamage:500}});
 for(let i=0;i<10&&s.phase.boss.hp>120;i++)s=step({...idle,ability:'pulse'});
 s=step({...idle,tuning:{...defaults,heroHP:10000,bonkDamage:.001,pulseDamage:.001,stompDamage:.001}});
 for(let i=0;i<3000&&s.enemies.filter(e=>e.hp>0).length<6;i++)s=step(idle);
 assert.equal(s.phase.kind,'boss');assert.equal(s.enemies.filter(e=>e.hp>0).length,6);assert.ok(s.hero.hp>0);return{commands,state:s};
}
