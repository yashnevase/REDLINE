import {session,load} from './browser.mjs';
import {readFile} from 'node:fs/promises';
const host=await session();try{
 for(const v of [{width:1280,height:720,name:'desktop'},{width:844,height:390,name:'phone'}]){
  const c=await host.browser.newContext({viewport:v,recordVideo:{dir:'shots/boss',size:{width:v.width,height:v.height}}});const p=await c.newPage();await load(p,host.url,'arena');
  await p.evaluate(()=>{const a=window.__REDLINE__,idle={x:0,z:0,dash:false};a.setTick(0);a.advance([{...idle,tuning:{...a.replay().tuning,heroHP:10000,pulseDamage:1000,openingThreats:12,pulseRadius:60,pulseCooldownTicks:1}}]);a.setTick(0);for(let i=0;i<80;i++){const s=a.state();if(s.phase.kind==='boss')break;a.advance([s.phase.kind==='upgrade'?{...idle,upgrade:s.phase.choices[0]}:{...idle,ability:'pulse'}]);}a.advance([{...idle,tuning:{...a.replay().tuning,pulseDamage:12,pulseRadius:2.5,pulseCooldownTicks:120,bonkDamage:8}}]);a.play();});
  await p.waitForTimeout(4000);await p.screenshot({path:`shots/boss/motion-${v.name}.png`});
  await p.evaluate(()=>localStorage.setItem('redline.profile.v1',JSON.stringify({version:1,bladeUnlocked:true,equipped:'blade',clears:1})));await load(p,host.url,'lobby');await p.screenshot({path:`shots/boss/final-lobby-${v.name}.png`});
  const video=p.video();await c.close();await video.saveAs(`shots/boss/continuous-${v.name}.webm`);
 }
 const p=await host.browser.newPage({viewport:{width:2560,height:760}});const a=(await readFile('art/targets/spirit-call/combat-lava-aoe.png')).toString('base64'),b=(await readFile('shots/boss/phase4-desktop.png')).toString('base64');await p.setContent(`<body style="margin:0;background:#17202a;color:#eee;font:16px Arial"><div style="display:flex"><section>Spirit Call study target<img width="1280" height="720" src="data:image/png;base64,${a}"></section><section>REDLINE actual boss phase 4 · debug HP for capture<img width="1280" height="720" src="data:image/png;base64,${b}"></section></div></body>`);await p.screenshot({path:'shots/boss/comparison.png'});console.log('Continuous boss motion and current Blade lobby captured at desktop/phone sizes.');
}finally{await host.close();}
