import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {session} from './browser.mjs';
const host=await session();await mkdir('shots/startup',{recursive:true});
try{
 for(const viewport of [{width:1280,height:720,name:'desktop'},{width:844,height:390,name:'phone'}]){
  const context=await host.browser.newContext({viewport,hasTouch:viewport.name==='phone'}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Inject one rejected renderer warm-up, without altering shipped source or gameplay.
  await page.route('**/src/presentation/scene.ts',async route=>{
   const response=await route.fetch(),source=await response.text();
   const pattern=/warmUp:\s*\(\)\s*=>\s*warmUp\(\)/;
   assert.match(source,pattern);
   await route.fulfill({response,body:source.replace(pattern,'warmUp: () => { if (!globalThis.__warmFailed) { globalThis.__warmFailed=true; return Promise.reject(new Error("Injected warm-up failure")); } return warmUp(); }')});
  });
  await page.goto(`${host.url}/?scene=arena&capture=1`);
  const retry=page.getByRole('button',{name:'Try again',exact:true});await retry.waitFor();
  assert.equal(await page.evaluate(()=>window.__REDLINE__.state().tick),0);
  assert.equal(await retry.evaluate(el=>el===document.activeElement),true);
  await page.screenshot({path:`shots/startup/retry-${viewport.name}.png`});
  await retry.click();await page.waitForFunction(()=>window.__REDLINE__?.ready);
  assert.equal(await page.locator('.loading').count(),0);
  await page.evaluate(()=>{window.__REDLINE__.setTick(40);window.__REDLINE__.advance([{x:0,z:0,dash:true,ability:'pulse'}]);window.__REDLINE__.setTick(0);window.__REDLINE__.setTick(0);window.__REDLINE__.advance(Array.from({length:20},()=>({x:0,z:0,dash:false})));});
  assert.equal(await page.locator('.encounter-banner b').textContent(),'WAVE 1 · SAWLETS!');
  assert.equal(await page.locator('.encounter-banner').isVisible(),true);
  await page.screenshot({path:`shots/startup/restarted-${viewport.name}.png`});
  assert.deepEqual(errors,[]);await context.close();
 }
 await writeFile('shots/startup/report.json',JSON.stringify({injectedFailure:true,retry:true,noSimulationBeforeReady:true,repeatedRestart:true,desktop:true,phoneViewport:true,physicalPhone:false},null,2));
 console.log('Startup failure/retry, readiness and repeated restart verified at desktop/phone sizes.');
}finally{await host.close();}
