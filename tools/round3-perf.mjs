import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {session,load} from './browser.mjs';
import {stress} from './round2-fixtures.mjs';
const dir='shots/round3/final',h=await session({headless:false,gpu:true}),reports=[];
await mkdir(dir,{recursive:true});
try{
 for(let level=0;level<3;level++)for(const viewport of[{width:1280,height:720},{width:844,height:390}])for(const quality of['standard','low'])for(const kind of['crowd','rex','corner']){
  const c=await h.browser.newContext({viewport,deviceScaleFactor:2});
  await c.addInitScript(q=>{localStorage.setItem('redline.preferences.v1',JSON.stringify({version:1,quality:q,qualityMode:'manual',zoom:'default',reducedMotion:false,reducedFlashes:false}));localStorage.setItem('redline.boss-guide.v1','2');},quality);
  const p=await c.newPage(),errors=await load(p,h.url,'perf-worst'),fixture=stress(kind,level,quality==='low');
  await p.evaluate(f=>window.__REDLINE__.restoreFixture(f.s,f.config),fixture);
  if(kind==='crowd'&&quality==='standard')await p.screenshot({path:`${dir}/map-${level+1}-${viewport.width}.png`});
  const times=await p.evaluate(()=>window.__REDLINE__.measure(120,undefined,true));times.sort((a,b)=>a-b);
  const m=await p.evaluate(()=>window.__REDLINE__.metadata());
  reports.push({level:level+1,viewport,quality,kind,initialEnemies:fixture.s.enemies.length,calls:m.benchmarkPeak.calls,triangles:m.benchmarkPeak.triangles,p95:times[114],errors});
  console.log(JSON.stringify(reports.at(-1)));await c.close();
  await writeFile(`${dir}/perf.json`,JSON.stringify({reports,physicalDevice:false,stressStats:true},null,2));
 }
 assert.deepEqual(reports.filter(r=>r.errors.length||r.quality!=='high'&&(r.calls>(r.quality==='low'?70:120)||r.triangles>(r.quality==='low'?25000:60000))),[]);
}finally{await h.close();}
