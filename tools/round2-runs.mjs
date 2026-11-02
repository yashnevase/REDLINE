import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {initialRun} from '../src/sim/run-schema.ts';
import {stepRun} from '../src/sim/run-rules.ts';
import {combatDefaults as t} from '../src/content/combat.ts';
import {difficultyTuning} from '../src/content/r3-difficulty.ts';
import {chapterCommand} from './close-mission-runs.mjs';
export function runMission(mission=0,difficulty='normal',loadout='core',lowSpec=false){
 const options={mission,difficulty,lowSpec};let s=initialRun(t,loadout,options);const commands=[],alive=[],kills=[];
 let peak=0,peakAttackers=0,multi=0,damagedFrames=0,bestChain=0;
 for(let i=0;i<24000&&!['complete','lost'].includes(s.phase.kind);i++){
  const c=chapterCommand(s);commands.push(c);s=stepRun(s,c,t);
  const live=s.enemies.filter(e=>e.hp>0),attackers=live.filter(e=>['windup','lunge'].includes(e.behavior.kind)).length;
  const caps=difficultyTuning(t,s.rules,s.director.pressure);assert.ok(live.length<=caps.enemyCap);assert.ok(attackers<=caps.attackerCap);
  peak=Math.max(peak,live.length);peakAttackers=Math.max(peakAttackers,attackers);
  if(live.some(e=>e.hp<(e.maxHP??e.hp)))damagedFrames++;
  for(const e of s.events)if(e.kind==='defeat')kills.push(s.tick);
  while(kills.length&&s.tick-kills[0]>24)kills.shift();multi=Math.max(multi,kills.length);bestChain=Math.max(bestChain,s.score.chain);
  if(s.tick%60===0)alive.push({second:s.tick/60,alive:live.length,hp:s.hero.hp,pressure:s.director.pressure});
 }
 let replay=initialRun(t,loadout,options);for(const c of commands)replay=stepRun(replay,c,t);assert.deepEqual(replay,s);
 return{commands,state:s,options,report:{mission,difficulty,loadout,lowSpec,phase:s.phase.kind,hp:s.hero.hp,seconds:s.tick/60,score:s.score.points,peakAlive:peak,peakAttackers,multi,damagedFrames,bestChain,exactReplay:true,finalStateSha256:createHash('sha256').update(JSON.stringify(s)).digest('hex'),alive}};
}
if(process.argv[1]?.endsWith('/round2-runs.mjs')){
 const reports=[];for(const difficulty of['chill','normal','redline'])for(const mission of[0,1,2,3]){const r=runMission(mission,difficulty);reports.push(r.report);console.log(JSON.stringify({...r.report,alive:undefined}));}
 await mkdir('shots/round2/final',{recursive:true});await writeFile('shots/round2/final/fairness.json',JSON.stringify(reports,null,2));
}
