import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {session,load} from './browser.mjs';
const host=await session();await mkdir('shots/options',{recursive:true});
try{for(const v of [{width:1280,height:720,name:'desktop'},{width:844,height:390,name:'phone'}]){
 const c=await host.browser.newContext({viewport:v,hasTouch:v.name==='phone',deviceScaleFactor:2,recordVideo:{dir:'shots/options',size:{width:v.width,height:v.height}}});const p=await c.newPage();const errors=await load(p,host.url,'arena');
 await p.evaluate(()=>window.__REDLINE__.play());await p.getByRole('button',{name:'Options',exact:true}).click();const before=await p.evaluate(()=>window.__REDLINE__.state());await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>window.__REDLINE__.state().tick),before.tick);
 await p.getByRole('checkbox',{name:/Reduce motion/}).check();await p.getByRole('checkbox',{name:/Reduce flashes/}).check();await p.getByRole('combobox',{name:/Graphics/}).selectOption('low');await p.screenshot({path:`shots/options/dialog-${v.name}.png`});
 // Dialog keyboard input must not trigger restart/dash or dismiss into running combat.
 await p.keyboard.press('KeyQ');await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').isVisible(),false);assert.equal(await p.evaluate(()=>window.__REDLINE__.state().tick),before.tick);assert.equal(await p.locator('.game-options').evaluate(el=>el===document.activeElement),true);
 const stored=await p.evaluate(()=>JSON.parse(localStorage.getItem('redline.preferences.v1')));assert.deepEqual(stored,{version:1,reducedMotion:true,reducedFlashes:true,quality:'low',zoom:'default'});
 await p.reload();await p.waitForFunction(()=>window.__REDLINE__?.ready);await p.getByRole('button',{name:'Options',exact:true}).click();assert.equal(await p.getByRole('checkbox',{name:/Reduce motion/}).isChecked(),true);assert.equal(await p.getByRole('combobox',{name:/Graphics/}).inputValue(),'low');await p.getByRole('button',{name:'Done',exact:true}).click();
 await p.evaluate(()=>{window.__REDLINE__.setTick(70);window.__REDLINE__.advance([{x:0,z:0,dash:false,ability:'pulse'}]);});await p.evaluate(()=>window.__REDLINE__.play());await p.waitForTimeout(300);await p.screenshot({path:`shots/options/low-${v.name}.png`});
 const canvas=await p.locator('canvas').evaluate(el=>({width:el.width,height:el.height,cssWidth:el.clientWidth}));assert.equal(canvas.width,v.width);assert.deepEqual(errors,[]);await writeFile(`shots/options/report-${v.name}.json`,JSON.stringify({pauseWhileOpen:true,dialogKeyboardIsolation:true,focusReturned:true,persistReload:true,lowCanvas:canvas,errors,physicalPhone:false},null,2));const video=p.video();await c.close();await video.saveAs(`shots/options/motion-${v.name}.webm`);
 }
 const c=await host.browser.newContext({reducedMotion:'reduce'});const p=await c.newPage();await load(p,host.url,'lobby');await p.getByRole('button',{name:'Options',exact:true}).click();assert.equal(await p.getByRole('checkbox',{name:/Reduce motion/}).isChecked(),true);await c.close();console.log('Options pause/focus/keyboard isolation, saved preferences, OS default and low-resolution render verified at desktop/phone sizes.');
}finally{await host.close();}
