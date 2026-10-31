import assert from 'node:assert/strict';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {combatDefaults as defaults} from '../src/content/combat.ts';
export function feelFixture(wave=2,{retained=false,blade=false,all=false}={}){
 const setup={...defaults,heroHP:10000,openingThreats:12,bladeDamage:1000,bladeSpinRadius:60,bladeCooldownTicks:1,pulseDamage:1000,pulseRadius:60,pulseCooldownTicks:1};
 const sim=createRunSimulation(setup,false,blade?'blade':'core'),commands=[],idle={x:0,z:0,dash:false};const step=command=>{commands.push(command);return sim.step(command);};let s=step({...idle,tuning:setup});
 for(let i=0;i<150&&!(s.phase.kind==='upgrade'&&s.phase.wave===wave-1);i++)s=step(s.phase.kind==='upgrade'?{...idle,upgrade:s.phase.choices[0]}:{...idle,ability:'pulse'});
 assert.equal(s.phase.kind,'upgrade');assert.equal(s.phase.wave,wave-1);
 const combat={...defaults,heroHP:10000,openingThreats:all?12:5,...(retained?{sawletHP:600,throwerHP:600,shieldsawHP:600,grinderHP:600}:{})};
 step({...idle,tuning:combat});s=step({...idle,upgrade:s.phase.choices[0]});assert.equal(s.phase.kind,'fight');assert.equal(s.phase.wave,wave);
 return{commands,state:s};
}
