import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import {session,load} from './browser.mjs';
import {runMission} from './round2-runs.mjs';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
const dir='shots/round2/final',run=runMission(0,'normal'),h=await session({headless:false,gpu:true}),reports=[];
await mkdir(dir,{recursive:true});
try{for(const[name,viewport]of[['desktop',{width:1280,height:720}],['compact',{width:844,height:390}]]){
 const c=await h.browser.newContext({viewport,recordVideo:{dir:`${dir}/raw`,size:viewport}});
 await c.addInitScript(()=>{localStorage.setItem('redline.preferences.v1',JSON.stringify({version:1,quality:'standard',qualityMode:'manual',zoom:'far',reducedMotion:false,reducedFlashes:false}));localStorage.setItem('redline.boss-guide.v1','2');});
 const p=await c.newPage(),errors=await load(p,h.url,'arena');
 await p.evaluate(commands=>{window.__REDLINE__.setTick(0);window.__REDLINE__.queueCommands(commands);},run.commands);
 const start=Date.now(),samples=[];let multiShot=false,healthShot=false,crowdShot=false;
 while(Date.now()-start<36000){
  await p.waitForTimeout(100);
  const v=await p.evaluate(()=>{const a=window.__REDLINE__,s=a.state(),m=a.metadata();return{tick:s.tick,alive:s.enemies.filter(e=>e.hp>0&&e.behavior.kind!=='spawn').length,totalAlive:s.enemies.filter(e=>e.hp>0).length,chain:s.score.chain,notice:m.spectacle.notice,bars:[...document.querySelectorAll('.r2-health')].filter(b=>!b.hidden).map(b=>b.dataset.stage)};});samples.push(v);
  if(!crowdShot&&v.alive>=10){await p.screenshot({path:`${dir}/normal-crowd-${name}.png`});crowdShot=true;}
  if(!healthShot&&v.bars.length>=2){await p.screenshot({path:`${dir}/normal-health-${name}.png`});healthShot=true;}
  if(!multiShot&&v.notice?.multi>=2){await p.screenshot({path:`${dir}/normal-multi-${name}.png`});multiShot=true;}
 }
 const replay=await p.evaluate(()=>{window.__REDLINE__.advance([]);return window.__REDLINE__.replay();}),sim=createRunSimulation(replay.tuning,false,replay.loadout,replay.options);for(const command of replay.commands)sim.step(command);assert.deepEqual(sim.view(),replay.final);
 const report={name,normalStats:true,difficulty:replay.options.difficulty,scriptedBot:true,wallSeconds:(Date.now()-start)/1000,peakVisibleAlive:Math.max(...samples.map(s=>s.alive)),multi:Math.max(...samples.map(s=>s.notice?.multi??0)),bestChain:Math.max(...samples.map(s=>s.chain)),healthShown:healthShot,damageStages:[...new Set(samples.flatMap(s=>s.bars))],exactReplay:true,finalStateSha256:createHash('sha256').update(JSON.stringify(replay.final)).digest('hex'),errors,samples};
 assert.ok(report.peakVisibleAlive>=10);assert.ok(report.multi>=2);assert.ok(report.bestChain>=3);assert.ok(healthShot);assert.deepEqual(errors,[]);
 const video=p.video();await c.close();await copyFile(await video.path(),`${dir}/normal-${name}.webm`);reports.push(report);console.log(JSON.stringify({...report,samples:undefined}));
 await writeFile(`${dir}/capture.json`,JSON.stringify(reports,null,2));
}}finally{await h.close();}
