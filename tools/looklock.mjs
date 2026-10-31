import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {session,load} from './browser.mjs';
import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {combatDefaults} from '../src/content/combat.ts';
const tuning={...combatDefaults,heroHP:10000,bonkDamage:20};const sim=createRunSimulation(tuning),commands=[];let state=sim.view();
for(let i=0;i<1600&&state.enemies.filter(e=>e.hp>0).length>5;i++){
 const target=state.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-state.hero.x,a.z-state.hero.z)-Math.hypot(b.x-state.hero.x,b.z-state.hero.z))[0];
 const dx=target.x-state.hero.x,dz=target.z-state.hero.z,length=Math.hypot(dx,dz)||1;const command={x:dx/length,z:dz/length,dash:false,...(i===0?{tuning}:{})};commands.push(command);state=sim.step(command);
}
assert.equal(state.enemies.filter(e=>e.hp>0).length,5);
const host=await session();await mkdir('shots/looklock',{recursive:true});
try{
 for(const viewport of [{width:1280,height:720,name:'desktop'},{width:844,height:390,name:'phone'}]){
  const context=await host.browser.newContext({viewport,hasTouch:viewport.name==='phone',recordVideo:{dir:'shots/looklock',size:viewport}}),page=await context.newPage();const errors=await load(page,host.url,'arena');
  await page.evaluate(()=>window.__REDLINE__.setTick(20));await page.screenshot({path:`shots/looklock/opening-${viewport.name}.png`});
  const final=await page.evaluate(({commands,tuning})=>{const api=window.__REDLINE__;api.advance([{x:0,z:0,dash:false,tuning}]);api.setTick(0);api.advance(commands);api.advance([{x:0,z:0,dash:false,tuning:{...tuning,bonkDamage:.001,pulseDamage:2}}]);api.advance(Array.from({length:60},()=>({x:0,z:0,dash:false})));api.advance([{x:0,z:0,dash:false,ability:'pulse'}]);api.advance(Array.from({length:12},()=>({x:0,z:0,dash:false})));return api.state();},{commands,tuning});
  assert.equal(final.enemies.filter(e=>e.hp>0).length,5);await page.screenshot({path:viewport.name==='desktop'?'shots/looklock.png':'shots/looklock/phone.png'});
  await writeFile(`shots/looklock/${viewport.name}.json`,JSON.stringify({metadata:await page.evaluate(()=>window.__REDLINE__.metadata()),fixture:'High initial hero HP, three enemies defeated by scripted pursuit; negligible outgoing damage then retains five enemies. Not normal balance.',errors,physicalPhone:false},null,2));
  await page.evaluate(()=>window.__REDLINE__.play());await page.waitForTimeout(3000);assert.deepEqual(errors,[]);const video=page.video();await context.close();await video.saveAs(`shots/looklock/motion-${viewport.name}.webm`);
 }
 const page=await host.browser.newPage({viewport:{width:2560,height:760}});
 for(const [left,right,name] of [['art/targets/spirit-call/combat-lava-aoe.png','shots/looklock.png','comparison'],['art/targets/redline-current/baseline-01.png','shots/looklock/opening-desktop.png','before-after']]){
 const a=(await readFile(left)).toString('base64'),b=(await readFile(right)).toString('base64');await page.setContent(`<body style="margin:0;background:#17202a;color:#eee;font:16px Arial"><div style="display:flex"><section>${name==='comparison'?'Spirit Call study target':'REDLINE before'}<img width="1280" height="720" src="data:image/png;base64,${a}"></section><section>REDLINE visual sprint<img width="1280" height="720" src="data:image/png;base64,${b}"></section></div></body>`);await page.screenshot({path:`shots/looklock/${name}.png`});
 }
 console.log('Five-enemy Pulse look-lock, before/after, target comparison and three-second desktop/phone motion captured.');
}finally{await host.close();}
