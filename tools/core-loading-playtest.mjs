import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {session} from './browser.mjs';
const host=await session();try{
 const page=await host.browser.newPage({viewport:{width:844,height:390}});let attempts=0;const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/models/core-sockets.glb',async route=>{attempts++;if(attempts===1)await route.fulfill({status:503,body:'Injected asset load failure'});else await route.continue();});
 await page.goto(`${host.url}/?scene=core-studio&capture=1`);const retry=page.getByRole('button',{name:'Try again',exact:true});await retry.waitFor();assert.equal(await page.evaluate(()=>window.__REDLINE__.ready),false);assert.equal(await page.evaluate(()=>window.__REDLINE__.metadata().core.socketsLoaded),false);
 await retry.click();await page.waitForFunction(()=>window.__REDLINE__?.ready);assert.equal(attempts,2);assert.equal(await page.evaluate(()=>window.__REDLINE__.metadata().core.socketsLoaded),true);assert.equal(await page.locator('.loading').count(),0);assert.deepEqual(errors,[]);
 await writeFile('art/match/core/loading-report.json',JSON.stringify({injected503:true,retryReady:true,attempts,noUnhandledErrors:true,phoneViewport:true,physicalPhone:false},null,2));console.log('Core asset load failure/retry and readiness verified.');
}finally{await host.close();}
