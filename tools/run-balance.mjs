import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {writeFile,mkdir} from 'node:fs/promises';
const sim=createRunSimulation();let s=sim.view();const visited=new Set();let hits=0,overdrives=0;
for(let tick=0;tick<18000;tick++){
 if(s.phase.kind==='complete'||s.phase.kind==='lost')break;
 if(s.phase.kind==='upgrade'){s=sim.step({x:0,z:0,dash:false,upgrade:s.phase.choices[0]});continue;}
 visited.add(s.phase.wave+1);const target=s.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-s.hero.x,a.z-s.hero.z)-Math.hypot(b.x-s.hero.x,b.z-s.hero.z))[0];
 const dx=target?target.x-s.hero.x:0,dz=target?target.z-s.hero.z:0,dist=Math.hypot(dx,dz);const danger=s.enemies.some(e=>e.hp>0&&(e.behavior.kind==='windup'&&e.behavior.remaining<10||e.behavior.kind==='lunge')&&Math.hypot(e.x-s.hero.x,e.z-s.hero.z)<4);
 const command={x:dist>1.1?dx/dist:0,z:dist>1.1?dz/dist:0,dash:danger&&s.hero.charges>0,ability:dist<2.8&&s.hero.pulseCooldown===0?'pulse':dist<2.4&&s.hero.stompCooldown===0?'stomp':undefined,overdrive:s.hero.heat>=90};
 s=sim.step(command);hits+=s.events.filter(e=>e.kind==='hurt').length;overdrives+=s.events.filter(e=>e.kind==='overdrive').length;
}
const report={kind:'Simple greedy diagnostic bot with normal START tuning; not a human fairness/feel verdict',phase:s.phase,ticks:s.tick,hp:s.hero.hp,wavesVisited:[...visited],hits,overdrives};await mkdir('shots/run',{recursive:true});await writeFile('shots/run/balance-bot.json',JSON.stringify(report,null,2));console.log(report);
