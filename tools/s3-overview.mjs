import {mkdir} from 'node:fs/promises';
import {session,load} from './browser.mjs';
const host=await session({headless:false,gpu:true});await mkdir('shots/s3',{recursive:true});
try{for(const [name,viewport]of [['desktop',{width:1600,height:1000}],['compact',{width:844,height:390}]]){const p=await host.browser.newPage({viewport});const errors=await load(p,host.url,'arena-showcase');await p.addStyleTag({content:'header,aside,nav,.combat-label,.study-stick,.abilities,.return,.fight-note,.debug-panel,.hud,.options-button,.health,.heat,.status,.integrity{display:none!important}'});await p.screenshot({path:`shots/s3/overview-${name}.png`});console.log(name,JSON.stringify(await p.evaluate(()=>window.__REDLINE__.metadata())),errors);await p.close();}}finally{await host.close();}
