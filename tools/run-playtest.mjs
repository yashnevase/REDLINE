import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {session,load} from './browser.mjs';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
const run=await session();await mkdir('shots/run',{recursive:true});
try{
 for(const viewport of [{width:1280,height:720,name:'desktop'},{width:844,height:390,name:'phone'}]){
  const context=await run.browser.newContext({viewport,hasTouch:viewport.name==='phone',recordVideo:{dir:'shots/run',size:{width:viewport.width,height:viewport.height}}});const page=await context.newPage();const errors=await load(page,run.url,'arena');
  await page.evaluate(()=>window.__REDLINE__.setTick(0));assert.equal(await page.evaluate(()=>window.__REDLINE__.state().enemies.length),5);
  await page.screenshot({path:`shots/run/wave1-${viewport.name}.png`});
  // Accelerated deterministic clear is explicit debug tuning, not a normal-balance completion claim.
  await page.evaluate(()=>{window.__REDLINE__.setTick(0);const t={...window.__REDLINE__.replay().tuning,heroHP:10000,openingThreats:12,pulseRadius:60,pulseDamage:1000,pulseCooldownTicks:1};window.__REDLINE__.advance([{x:0,z:0,dash:false,tuning:t}]);window.__REDLINE__.setTick(0);window.__REDLINE__.advance([{x:0,z:0,dash:false,ability:'pulse'}]);});
  assert.equal(await page.locator('#app').getAttribute('data-result'),'upgrade');assert.equal(await page.locator('.upgrade-card').count(),3);
  await page.screenshot({path:`shots/run/upgrade-${viewport.name}.png`});
  // Verify focus/Enter activates a card without restarting the run.
  await page.locator('.upgrade-card').nth(1).focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>window.__REDLINE__.state().phase.wave),1);
  for(let wave=1;wave<3;wave++){
   await page.evaluate(()=>window.__REDLINE__.advance(Array.from({length:7},()=>({x:0,z:0,dash:false,ability:'pulse'}))));assert.equal(await page.locator('#app').getAttribute('data-result'),'upgrade');
   if(viewport.name==='phone')await page.locator('.upgrade-card').first().tap();else await page.keyboard.press('Digit1');
  }
  assert.equal(await page.evaluate(()=>window.__REDLINE__.state().phase.wave),3);
  // Reset only the presentation-facing trial tuning through a recorded validated intent.
  await page.evaluate(()=>{const t={...window.__REDLINE__.replay().tuning,heroHP:10000,pulseRadius:2.5,pulseDamage:12,pulseCooldownTicks:120};window.__REDLINE__.advance([{x:0,z:0,dash:false,tuning:t},...Array.from({length:100},()=>({x:0,z:0,dash:false}))]);});
  await page.screenshot({path:`shots/run/wave4-${viewport.name}.png`});
  await page.keyboard.press('KeyR');await page.evaluate(()=>window.__REDLINE__.play());await page.waitForFunction(()=>window.__REDLINE__.state().hero.overdrive>0);
  await page.screenshot({path:`shots/run/overdrive-${viewport.name}.png`});await page.waitForTimeout(1000);
  await page.evaluate(()=>{const t={...window.__REDLINE__.replay().tuning,openingThreats:12,pulseRadius:60,pulseDamage:1000,pulseCooldownTicks:1};window.__REDLINE__.advance([{x:0,z:0,dash:false,tuning:t},...Array.from({length:160},()=>({x:0,z:0,dash:false,ability:'pulse'}))]);});
  assert.equal(await page.locator('#app').getAttribute('data-result'),'won');await page.screenshot({path:`shots/run/clear-${viewport.name}.png`});
  const replay=await page.evaluate(()=>window.__REDLINE__.replay());const sim=createRunSimulation(replay.tuning);for(const command of replay.commands)sim.step(command);assert.deepEqual(sim.view(),replay.final);
  await writeFile(`shots/run/replay-${viewport.name}.json`,JSON.stringify(replay,null,2));assert.deepEqual(errors,[]);
  await writeFile(`shots/run/report-${viewport.name}.json`,JSON.stringify({keyboardChoice:true,enterChoice:true,touchChoice:viewport.name==='phone',fourWaves:true,overdrive:true,recordedReplay:true,acceleratedDebugBalance:true,physicalPhone:false,errors},null,2));
  const video=page.video();await context.close();await video.saveAs(`shots/run/encounter-${viewport.name}.webm`);
 }
 const page=await run.browser.newPage({viewport:{width:2560,height:760}});const target=(await readFile('art/targets/spirit-call/combat-lava-swarm.png')).toString('base64'),actual=(await readFile('shots/run/wave4-desktop.png')).toString('base64');
 await page.setContent(`<body style="margin:0;background:#17202a;color:#eee;font:16px Arial"><div style="display:flex"><section>Spirit Call study target<img width="1280" height="720" src="data:image/png;base64,${target}"></section><section>REDLINE actual Wave 4<img width="1280" height="720" src="data:image/png;base64,${actual}"></section></div></body>`);await page.screenshot({path:'shots/run/comparison.png'});
 console.log('Four-wave UI, keyboard/touch upgrade selection, Overdrive and browser-recorded replay passed; accelerated debug balance used.');
}finally{await run.close();}
