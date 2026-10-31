import {session,load} from './browser.mjs';
import {bossFixture} from './boss-fixture.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const fixture=bossFixture(),host=await session();try{
 const reports=[];for(const quality of ['standard','low']){
  const c=await host.browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:2});await c.addInitScript(value=>localStorage.setItem('redline.preferences.v1',JSON.stringify({version:1,reducedMotion:false,reducedFlashes:false,quality:value})),quality);
  const p=await c.newPage();await load(p,host.url,'perf-worst');const cdp=await c.newCDPSession(p);const samples=[];
  for(const rate of [1,4,6]){await cdp.send('Emulation.setCPUThrottlingRate',{rate});await p.evaluate(commands=>window.__REDLINE__.measure(30,commands),fixture.commands);const frames=await p.evaluate(commands=>window.__REDLINE__.measure(120,commands),fixture.commands);const work=await p.evaluate(()=>window.__REDLINE__.metadata().benchmarkWork);const cpuWork=Object.fromEntries(Object.entries(work).map(([key,values])=>{values.sort((a,b)=>a-b);return[key,{p50:values[Math.floor(values.length*.5)],p95:values[Math.floor(values.length*.95)],max:values.at(-1)}];}));frames.sort((a,b)=>a-b);samples.push({cpuThrottle:rate,cpuWork,p50:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)],p99:frames[Math.floor(frames.length*.99)]});}
  const metadata=await p.evaluate(()=>window.__REDLINE__.metadata());const canvas=await p.locator('canvas').evaluate(el=>({width:el.width,height:el.height}));reports.push({quality,canvas,metadata:{...metadata,benchmarkWork:undefined},samples});await c.close();
 }
 await mkdir('shots/completion',{recursive:true});const report={kind:'Enraged Scrap-Rex + six live Sawlets; deterministic setup, high hero HP and near-zero outgoing damage retain load. rAF intervals including HUD; CPU work excludes asynchronous GPU execution; emulated 2x pixel ratio, not real-phone or 60fps acceptance.',setupTicks:fixture.state.tick,reports};await writeFile('shots/completion/boss-perf.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await host.close();}
