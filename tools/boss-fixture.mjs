import assert from 'node:assert/strict';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {combatDefaults as defaults} from '../src/content/combat.ts';
export function bossFixture(){
 const config={...defaults,heroHP:10000,bonkDamage:.001,bonkCooldownTicks:99999,pulseDamage:1000,bladeSpinRadius:60,openingThreats:12,pulseRadius:60,pulseCooldownTicks:1,scoreSawlet:3000,scoreThrower:3000,scoreShield:3000,scoreGrinder:3000,scoreWhirler:3000};const sim=createRunSimulation(config),commands=[],idle={x:0,z:0,dash:false};const step=c=>{commands.push(c);return sim.step(c);};let s=step({...idle,tuning:config});
 for(let i=0;i<3000&&s.phase.kind!=='boss';i++)s=step(s.phase.kind==='upgrade'?{...idle,upgrade:s.phase.choices[0]}:s.phase.kind==='level-complete'?{...idle,continue:true}:{...idle,ability:'pulse'});assert.equal(s.phase.kind,'boss');s=step({...idle,tuning:{...config,pulseDamage:20}});
 for(let i=0;i<2000&&s.phase.kind==='boss'&&s.phase.boss.hp>120;i++)s=step({...idle,ability:'pulse'});assert.equal(s.phase.kind,'boss');assert.ok(s.phase.boss.hp>0&&s.phase.boss.hp<=120);
 s=step({...idle,tuning:{...defaults,heroHP:10000,bonkDamage:.001,bonkCooldownTicks:99999,pulseDamage:.001,stompDamage:.001}});for(let i=0;i<3000&&s.enemies.filter(e=>e.hp>0).length<6;i++)s=step(idle);assert.equal(s.phase.kind,'boss');assert.equal(s.enemies.filter(e=>e.hp>0).length,6);assert.ok(s.hero.hp>0);return{commands,state:s};
}
