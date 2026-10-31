import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {session,load} from './browser.mjs';
import {feelFixture} from './feel-fixture.mjs';
import {combatDefaults as defaults} from '../src/content/combat.ts';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const host=await session({headless:false,gpu:true});await mkdir('review/feel',{recursive:true});const selected=process.argv[2];const evidence=selected?JSON.parse(await readFile('review/feel/capture-report.json','utf8')).filter(r=>r.label!==selected):[];
try{
 for(const [label,seconds,blade,retained,phone] of [['wave3-4',38,false,false,false],['blade',12,true,true,true],['density',30,false,true,true],['corner-atmosphere',12,false,true,false]]){
  if(selected&&label!==selected)continue;const viewport=phone?{width:844,height:390}:{width:1280,height:720};
  const context=await host.browser.newContext({viewport,deviceScaleFactor:2,recordVideo:{dir:'shots/feel/raw',size:viewport},hasTouch:phone});
  await context.addInitScript(blade=>{localStorage.setItem('redline.preferences.v1',JSON.stringify({version:1,reducedMotion:false,reducedFlashes:false,quality:'standard'}));if(blade)localStorage.setItem('redline.profile.v1',JSON.stringify({version:1,bladeUnlocked:true,equipped:'blade',clears:1}));},blade);
  const page=await context.newPage();await page.route('**/favicon.ico',r=>r.fulfill({status:204}));await load(page,host.url,'arena');
  const fixture=feelFixture(2,{retained,blade});await page.evaluate(commands=>{const a=window.__REDLINE__;a.advance([commands[0]]);a.setTick(0);a.advance(commands);a.play();},fixture.commands);
  if(blade)assert.equal(await page.evaluate(()=>window.__REDLINE__.state().loadout),'blade');
  const states=[];await page.evaluate(({seconds,label})=>{const a=window.__REDLINE__;window.__feelSamples=[];window.__feelTimer=setInterval(()=>{const s=a.state();window.__feelSamples.push({tick:s.tick,phase:s.phase,live:s.enemies.filter(e=>e.hp>0).length,hp:s.hero.hp});},250);window.__feelDriver=setInterval(()=>{const s=a.state();if(s.phase.kind==='upgrade')a.advance([{x:0,z:0,dash:false,upgrade:s.phase.choices[0]}]);a.play();},300);}, {seconds,label});
  const start=Date.now();let n=0,cleared=false;
  while(Date.now()-start<seconds*1000){
   // Real keyboard mapping drives the normal host. Alternate orbit directions, then use Q/E/X and all dash gestures.
   if(label==='wave3-4'&&!cleared&&Date.now()-start>29000){cleared=true;await page.evaluate(base=>{const a=window.__REDLINE__,idle={x:0,z:0,dash:false},before=a.state();if(before.phase.kind==='fight'&&before.phase.wave===2){a.advance([{...idle,tuning:{...base,heroHP:10000,pulseDamage:1000,pulseRadius:60,pulseCooldownTicks:1}}]);for(let i=0;i<300&&a.state().phase.kind==='fight';i++)a.advance([{...idle,ability:'pulse'}]);a.advance([{...idle,tuning:{...base,heroHP:10000}}]);const s=a.state();if(s.phase.kind==='upgrade')a.advance([{...idle,upgrade:s.phase.choices[0]}]);}a.play();},defaults);}
   const direction=label==='corner-atmosphere'?'ArrowRight':['ArrowDown','ArrowLeft','ArrowUp','ArrowRight'][Math.floor(n/4)%4];
   await page.keyboard.down(direction);await page.waitForTimeout(label==='corner-atmosphere'?500:240);await page.keyboard.up(direction);
   if(n%5===0)await page.keyboard.press('KeyQ');if(n%7===2)await page.keyboard.press('KeyX');if(n%7===4)await page.keyboard.press('KeyE');if(n%4===0)await page.keyboard.press('KeyR');
   if(n%9===1){await page.keyboard.press('Space');await page.waitForTimeout(90);await page.keyboard.press('Space');}
   else if(n%9===4){await page.keyboard.down('Space');await page.waitForTimeout(660);await page.keyboard.up('Space');}
   else if(n%9===7)await page.keyboard.press('Space');
   if(n%8===3)await page.screenshot({path:`review/feel/${label}-${n}.png`});n++;
  }
  await page.evaluate(()=>{clearInterval(window.__feelTimer);clearInterval(window.__feelDriver);});states.push(...await page.evaluate(()=>window.__feelSamples));
  const replay=await page.evaluate(()=>window.__REDLINE__.replay()),metadata=await page.evaluate(()=>window.__REDLINE__.metadata());
  const sim=createRunSimulation(replay.tuning,false,replay.loadout),variants=new Set(),eventCounts={};for(const command of replay.commands){const s=sim.step(command);if(s.hero.dash.kind==='active')variants.add(s.hero.dash.variant);for(const event of s.events)eventCounts[event.kind]=(eventCounts[event.kind]??0)+1;}assert.deepEqual(sim.view(),replay.final);await writeFile(`shots/feel/replay-${label}.json`,JSON.stringify(replay));
  const video=page.video();await context.close();await video.saveAs(`review/feel/${label}.webm`);
  evidence.push({label,viewport,seconds,retainedEnemyHP:retained?600:null,heroHP:10000,minimumLive:Math.min(...states.filter(s=>s.phase.kind==='fight').map(s=>s.live)),phases:[...new Set(states.map(s=>s.phase.kind==='fight'?`wave-${s.phase.wave+1}`:s.phase.kind))],replayVerified:true,dashVariants:[...variants],eventCounts,acceleratedWave3Cleanup:label==='wave3-4',events:replay.commands.filter(c=>c.ability||c.dashInput||c.overdrive).length,metadata,samples:states});await writeFile('review/feel/capture-report.json',JSON.stringify(evidence,null,2));
 }
 await writeFile('review/feel/capture-report.json',JSON.stringify(evidence,null,2));console.log(evidence.map(({label,minimumLive,phases})=>({label,minimumLive,phases})));
}finally{await host.close();}
