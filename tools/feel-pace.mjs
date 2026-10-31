import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {combatDefaults as defaults} from '../src/content/combat.ts';
import {writeFile,mkdir} from 'node:fs/promises';
const sim=createRunSimulation({...defaults,heroHP:10000});let s=sim.view(),lastBonk=0,firstBonk=0,odReady=0,odWave=0,oldPhase='fight-0';const combatGaps=[],live=[],phases=[];
for(let i=0;i<9000;i++){
 if(s.phase.kind==='boss'||s.phase.kind==='complete')break;
 if(s.phase.kind==='upgrade'){s=sim.step({x:0,z:0,dash:false,upgrade:s.phase.choices[0]});lastBonk=s.tick;continue;}
 const target=s.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-s.hero.x,a.z-s.hero.z)-Math.hypot(b.x-s.hero.x,b.z-s.hero.z))[0],dx=target?target.x-s.hero.x:0,dz=target?target.z-s.hero.z:0,d=Math.hypot(dx,dz);
 s=sim.step({x:d>1.1?dx/d:0,z:d>1.1?dz/d:0,dash:false,ability:d<2.9&&s.hero.pulseCooldown===0?'pulse':d<2.5&&s.hero.stompCooldown===0?'stomp':undefined,overdrive:s.hero.heat>=90});
 if(s.hero.heat>=90&&!odReady){odReady=s.tick;odWave=s.phase.kind==='fight'?s.phase.wave+1:0;}
 const key=s.phase.kind==='fight'?`fight-${s.phase.wave}`:s.phase.kind;if(key!==oldPhase){phases.push({phase:key,tick:s.tick});oldPhase=key;}
 if(s.events.some(e=>e.kind==='bonk')){if(!firstBonk)firstBonk=s.tick;combatGaps.push({wave:s.phase.kind==='fight'?s.phase.wave+1:null,ticks:s.tick-lastBonk});lastBonk=s.tick;}
 if(s.phase.kind==='fight')live.push({tick:s.tick,wave:s.phase.wave+1,live:s.enemies.filter(e=>e.hp>0).length,spawned:s.phase.nextSpawn});
}
const idle=createRunSimulation();let idleContact=0;for(let i=0;i<180;i++){const s=idle.step({x:0,z:0,dash:false});if(s.events.some(e=>e.kind==='bonk')){idleContact=s.tick;break;}}
const report={kind:'Greedy approach bot, normal enemy tuning/damage and upgrades; 10,000 hero HP; no dash. Diagnostic, not human acceptance.',firstBonkSeconds:firstBonk/60,idleFirstContactSeconds:idleContact/60,firstOverdriveReadySeconds:odReady/60,firstOverdriveWave:odWave,maxBonkGapSeconds:Math.max(...combatGaps.map(g=>g.ticks))/60,minimumLive:Math.min(...live.map(r=>r.live)),finalPhase:s.phase.kind,elapsedSeconds:s.tick/60,phases,samples:live.filter((_,i)=>i%30===0),bonkGaps:combatGaps};await mkdir('shots/feel',{recursive:true});await writeFile('shots/feel/pace-bot.json',JSON.stringify(report,null,2));console.log({...report,samples:undefined,bonkGaps:undefined});
