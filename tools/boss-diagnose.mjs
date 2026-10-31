import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {combatDefaults as base} from '../src/content/combat.ts';
const sim=createRunSimulation({...base,heroHP:10000});const idle={x:0,z:0,dash:false};const advance=c=>sim.step(c);let s=sim.view();
advance({...idle,tuning:{...base,heroHP:10000,bonkDamage:.001,openingThreats:12,pulseRadius:60,pulseDamage:1000,pulseCooldownTicks:1}});
for(let i=0;i<80;i++){s=sim.view();if(s.phase.kind==='boss')break;advance(s.phase.kind==='upgrade'?{...idle,upgrade:s.phase.choices[0]}:{...idle,ability:'pulse'});}
advance({...idle,tuning:{...base,heroHP:10000,bonkDamage:.001,openingThreats:12,pulseRadius:60,pulseCooldownTicks:1}});
for(const [stage,damage,kind] of [[1,0,'chomp-warning'],[2,210,'sweep-warning'],[3,210,'volley-warning'],[4,90,'sweep-warning']]){
 console.log('begin',stage,JSON.stringify(sim.view().phase));if(damage){advance({...idle,tuning:{...base,heroHP:10000,bonkDamage:.001,openingThreats:12,pulseRadius:60,pulseCooldownTicks:1,pulseDamage:damage}});for(let i=0;i<10;i++){const b=sim.view();if(b.phase.kind!=='boss'){console.log('left boss while damage',b);process.exit(1);}const before=b.phase.boss.hp;s=advance({...idle,ability:'pulse'});console.log('damage',stage,i,s.phase.kind,s.phase.kind==='boss'?s.phase.boss.hp:null);if(s.phase.kind!=='boss'||s.phase.boss.hp<before)break;}}
 for(let i=0;i<1000;i++){s=sim.view();if(s.phase.kind!=='boss'){console.log('left boss waiting',stage,i,JSON.stringify(s));process.exit(1);}if(s.phase.boss.behavior.kind===kind&&s.phase.boss.behavior.remaining<30){console.log('captured',stage,s.tick,s.phase.boss.hp);break;}advance(idle);}
}
