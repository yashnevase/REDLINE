import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {session,load} from './browser.mjs';
import {bossFixture} from './boss-fixture.mjs';
const fixture=bossFixture(),host=await session();await mkdir('shots/readability',{recursive:true});
try{
 for(const v of [{width:1280,height:720,name:'desktop'},{width:844,height:390,name:'phone'}]){
  const c=await host.browser.newContext({viewport:v,hasTouch:v.name==='phone',recordVideo:{dir:'shots/readability',size:{width:v.width,height:v.height}}});const p=await c.newPage();const errors=await load(p,host.url,'arena');
  await p.evaluate(()=>window.__REDLINE__.setTick(40));assert.equal(await p.locator('.encounter-banner b').textContent(),'Wave 1');assert.equal(await p.locator('.encounter-banner').isVisible(),true);await p.screenshot({path:`shots/readability/wave-${v.name}.png`});
  await p.evaluate(commands=>{const a=window.__REDLINE__;a.advance([commands[0]]);a.setTick(0);a.advance(commands);},fixture.commands);
  for(const kind of ['chomp-warning','sweep-warning','volley-warning']){
   const state=await p.evaluate(kind=>{const a=window.__REDLINE__;for(let i=0;i<2000;i++){const s=a.state();if(s.phase.kind!=='boss')throw new Error('Stress setup left boss phase');if(s.phase.boss.behavior.kind===kind&&s.phase.boss.behavior.remaining<25)return s;a.advance([{x:0,z:0,dash:false}]);}throw new Error(`No ${kind} reached`);},kind);
   await p.screenshot({path:`shots/readability/${kind}-${v.name}.png`});assert.equal(state.phase.boss.behavior.kind,kind);
  }
  await p.evaluate(()=>window.__REDLINE__.play());await p.waitForTimeout(1500);assert.deepEqual(errors,[]);await writeFile(`shots/readability/${v.name}.json`,JSON.stringify({banner:true,phases:3,debugStressSetup:true,physicalPhone:false,errors},null,2));const video=p.video();await c.close();await video.saveAs(`shots/readability/motion-${v.name}.webm`);
 }
 const p=await host.browser.newPage({viewport:{width:2560,height:760}});const target=(await readFile('art/targets/spirit-call/combat-lava-aoe.png')).toString('base64'),actual=(await readFile('shots/readability/sweep-warning-desktop.png')).toString('base64');await p.setContent(`<body style="margin:0;background:#17202a;color:#eee;font:16px Arial"><div style="display:flex"><section>Spirit Call study target<img width="1280" height="720" src="data:image/png;base64,${target}"></section><section>REDLINE current sweep boundary · stress capture<img width="1280" height="720" src="data:image/png;base64,${actual}"></section></div></body>`);await p.screenshot({path:'shots/readability/comparison.png'});console.log('Wave banner, full-length boss charge, sweep boundary and volley warnings captured at desktop/phone sizes.');
}finally{await host.close();}
