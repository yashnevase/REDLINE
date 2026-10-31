import {session,load} from './browser.mjs';
import {mkdir} from 'node:fs/promises';
await mkdir('shots/completion',{recursive:true});const run=await session();try{const page=await run.browser.newPage({viewport:{width:1280,height:720}});for(const scene of ['lobby','sawlet-studio','grinder-studio','arena-showcase','arena','boss-studio']){await load(page,run.url,scene);await page.screenshot({path:`shots/completion/${scene}-draft.png`});console.log(scene,await page.evaluate(()=>window.__REDLINE__.metadata()));}}finally{await run.close();}
