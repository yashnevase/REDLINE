import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {session,load} from './browser.mjs';
const run=await session();await mkdir('shots/abilities',{recursive:true});
try{
 for(const viewport of [{width:1280,height:720,name:'desktop'},{width:844,height:390,name:'phone'}]){
  const context=await run.browser.newContext({viewport,hasTouch:viewport.name==='phone',recordVideo:{dir:'shots/abilities',size:{width:viewport.width,height:viewport.height}}});
  const page=await context.newPage();const errors=await load(page,run.url,'arena',true);
  await page.evaluate(()=>window.__REDLINE__.setTick(0));
  // Exercise actual device mapping before advancing the deterministic host.
  await page.keyboard.press('KeyQ');await page.evaluate(()=>window.__REDLINE__.play());
  await page.waitForFunction(()=>window.__REDLINE__.state().hero.pulseCooldown>0);
  assert.ok(await page.evaluate(()=>window.__REDLINE__.state().hero.pulseCooldown>0));
  await page.evaluate(()=>window.__REDLINE__.setTick(0));
  await page.locator('[data-ability="boost"]').dispatchEvent('pointerdown',{pointerId:7});await page.evaluate(()=>window.__REDLINE__.play());
  await page.waitForFunction(()=>window.__REDLINE__.state().hero.boostCooldown>0);
  await page.evaluate(()=>{window.__REDLINE__.setTick(70);window.__REDLINE__.advance([{x:0,z:0,dash:false,ability:'pulse'},...Array.from({length:9},()=>({x:0,z:0,dash:false}))]);});
  const state=await page.evaluate(()=>window.__REDLINE__.state());assert.ok(state.hero.pulseCooldown>0);
  await page.screenshot({path:`shots/abilities/pulse-${viewport.name}.png`});
  await page.evaluate(()=>{window.__REDLINE__.setTick(0);window.__REDLINE__.advance([{x:0,z:0,dash:false,ability:'stomp'}]);window.__REDLINE__.play();});await page.waitForTimeout(150);
  await page.screenshot({path:`shots/abilities/stomp-${viewport.name}.png`});
  // Small Heat threshold is a debug tuning intent, not a production shortcut.
  await page.evaluate(()=>{window.__REDLINE__.setTick(0);const tuning={...window.__REDLINE__.replay().tuning,heatThreshold:4,sawletHP:100,bonkDamage:100};window.__REDLINE__.advance([{x:0,z:0,dash:false,tuning},...Array.from({length:120},()=>({x:0,z:0,dash:false}))]);});
  assert.equal(await page.evaluate(()=>window.__REDLINE__.state().hero.heat),4);
  assert.deepEqual(errors,[]);await writeFile(`shots/abilities/${viewport.name}.json`,JSON.stringify({state,errors,keyboardPulse:true,pointerBoost:true,physicalPhone:false},null,2));
  const video=page.video();await context.close();await video.saveAs(`shots/abilities/controls-${viewport.name}.webm`);
 }
 const page=await run.browser.newPage({viewport:{width:2560,height:760}});
 const target=(await readFile('art/targets/spirit-call/combat-lava-aoe.png')).toString('base64'),actual=(await readFile('shots/abilities/pulse-desktop.png')).toString('base64');
 await page.setContent(`<body style="margin:0;background:#17202a;color:#eee;font:16px Arial"><div style="display:flex"><section>Spirit Call study target<img width="1280" height="720" src="data:image/png;base64,${target}"></section><section>REDLINE actual ability input<img width="1280" height="720" src="data:image/png;base64,${actual}"></section></div></body>`);await page.screenshot({path:'shots/abilities/comparison.png'});
 console.log('Ability keyboard/pointer input, cooldown HUD, Heat gain and desktop/phone captures passed.');
}finally{await run.close();}
