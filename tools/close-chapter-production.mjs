import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
import {writeFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
process.env.PLAYWRIGHT_BROWSERS_PATH??=fileURLToPath(new URL('../.cache/ms-playwright',import.meta.url));
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','5202','--strictPort'],{stdio:'ignore'});let browser;
try{
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:5202')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5202/?scene=arena');await page.locator('.loading').waitFor({state:'detached'});
 assert.equal(await page.evaluate(()=>typeof window.__REDLINE__),'undefined');assert.equal(await page.locator('.settings,.debug').count(),0);assert.match(await page.locator('.objective-goal strong').textContent(),/LEVEL 1/);
 await page.getByRole('button',{name:'Options',exact:true}).click();await page.getByRole('checkbox',{name:/Reduce motion/}).check();await page.getByRole('combobox',{name:/Graphics/}).selectOption('low');await page.getByRole('button',{name:'Done',exact:true}).click();await page.getByRole('button',{name:'Resume',exact:true}).click();
 await page.getByRole('button',{name:'Blade Spin',exact:true}).tap();await page.waitForTimeout(100);assert.equal(await page.locator('[data-ability=pulse]').getAttribute('aria-disabled'),'true');
 await page.waitForFunction(()=>document.querySelector('#app').dataset.result==='lost',{},{timeout:35000});await page.getByRole('button',{name:'Fight again',exact:true}).click();assert.equal(await page.locator('#app').getAttribute('data-result'),'fighting');
 await page.evaluate(()=>{localStorage.removeItem('redline.profile.v2');localStorage.setItem('redline.profile.v1',JSON.stringify({version:1,bladeUnlocked:true,equipped:'core',clears:1}));});await page.goto('http://127.0.0.1:5202/?scene=lobby');await page.locator('.loading').waitFor({state:'detached'});await page.locator('[data-equip=blade]').click();await page.reload();await page.locator('.loading').waitFor({state:'detached'});assert.equal(await page.locator('[data-equip=blade]').getAttribute('aria-pressed'),'true');await page.getByRole('link',{name:'Enter Foundry',exact:true}).click();await page.locator('.loading').waitFor({state:'detached'});await page.getByRole('button',{name:'Blade Spin',exact:true}).tap();await page.waitForTimeout(100);assert.equal(await page.locator('[data-ability=pulse]').getAttribute('aria-disabled'),'true');
  await mkdir('shots/close-chapter/production',{recursive:true});await page.screenshot({path:'shots/close-chapter/production/production-phone.png'});assert.deepEqual(errors,[]);await writeFile('shots/close-chapter/production/production.json',JSON.stringify({optionsProduction:true,noDebugAPI:true,noSettings:true,firstWave:true,touchAbility:true,lossRetry:true,seededProfileBladeReload:true,bladeAbility:true,physicalPhone:false,errors},null,2));console.log('Production run startup, no debug exposure, touch ability and loss/retry passed.');
}finally{await browser?.close();server.kill();await once(server,'exit');}
