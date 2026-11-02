import assert from 'node:assert/strict';import {mkdir,writeFile} from 'node:fs/promises';
import {session,load} from './browser.mjs';import {stress} from './round2-fixtures.mjs';
const h=await session({headless:false,gpu:true}),reports=[];await mkdir('shots/round2/final',{recursive:true});
try{for(const viewport of[{width:1280,height:720},{width:844,height:390}]){
 const p=await h.browser.newPage({viewport});await p.addInitScript(()=>localStorage.setItem('redline.preferences.v1',JSON.stringify({version:1,quality:'standard',qualityMode:'manual',zoom:'far',reducedMotion:false,reducedFlashes:false})));
 const errors=await load(p,h.url,'arena'),f=stress();await p.evaluate(f=>window.__REDLINE__.restoreFixture(f.s,f.config),f);
 const bounds=await p.evaluate(()=>[...document.querySelectorAll('.r2-health:not([hidden])')].map(el=>{const b=el.getBoundingClientRect(),label=el.querySelector('small').getBoundingClientRect();return{x:Math.min(b.x,label.x),y:Math.min(b.y,label.y),right:Math.max(b.right,label.right),bottom:Math.max(b.bottom,label.bottom),text:el.querySelector('small').textContent};}));
 assert.ok(bounds.length>=2);
 for(const[a,b]of bounds.flatMap((a,i)=>bounds.slice(i+1).map(b=>[a,b])))assert.ok(a.x>=b.right||a.right<=b.x||a.y>=b.bottom||a.bottom<=b.y,JSON.stringify({a,b}));
 await p.screenshot({path:`shots/round2/final/elite-bars-${viewport.width}.png`});reports.push({viewport,visible:bounds.length,bounds,errors});assert.deepEqual(errors,[]);await p.close();
}await writeFile('shots/round2/final/bars.json',JSON.stringify(reports,null,2));}finally{await h.close();}
