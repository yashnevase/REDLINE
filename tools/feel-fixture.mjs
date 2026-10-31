import assert from 'node:assert/strict';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {combatDefaults as defaults} from '../src/content/combat.ts';
export function feelFixture(wave=2,{retained=false,blade=false,all=false}={}){
 const setup={...defaults,heroHP:10000,openingThreats:12,bonkDamage:1000,bladeDamage:1000,bladeSpinRadius:60,bladeCooldownTicks:1,pulseDamage:1000,pulseRadius:60,pulseCooldownTicks:1,scoreSawlet:3000,scoreThrower:3000,scoreShield:3000};
 const sim=createRunSimulation(setup,false,blade?'blade':'core'),commands=[],idle={x:0,z:0,dash:false};const step=c=>{commands.push(c);return sim.step(c);};let s=step({...idle,tuning:setup});
 const command=()=>s.phase.kind==='upgrade'?{...idle,upgrade:s.phase.choices[0]}:s.phase.kind==='level-complete'?{...idle,continue:true}:{...idle,ability:'pulse'};
 for(let i=0;i<3000&&!(s.phase.kind==='level-complete'&&s.phase.level===1);i++)s=step(command());assert.equal(s.phase.kind,'level-complete');assert.equal(s.phase.level,1);
 const lowScore={...setup,scoreSawlet:1,scoreThrower:1,scoreShield:1,scoreGrinder:1,scoreWhirler:1};s=step({...idle,tuning:lowScore});s=step({...idle,continue:true});
 for(let i=0;i<3000&&!(s.phase.kind==='upgrade'&&s.phase.wave===wave-1);i++)s=step(command());assert.equal(s.phase.kind,'upgrade');assert.equal(s.phase.wave,wave-1);
 const combat={...defaults,heroHP:10000,openingThreats:all?12:5,...(retained?{sawletHP:600,throwerHP:600,shieldsawHP:600,grinderHP:600,whirlerHP:600}:{})};s=step({...idle,tuning:combat});s=step({...idle,upgrade:s.phase.choices[0]});assert.equal(s.phase.kind,'fight');assert.equal(s.phase.wave,wave);return{commands,state:s};
}
