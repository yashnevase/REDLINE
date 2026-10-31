import {spawn} from 'node:child_process';
import {mkdir,open} from 'node:fs/promises';
await mkdir('shots/feel/checks',{recursive:true});
const stages=['completion-controls','startup-playtest','core-loading-playtest','industrial-loading-playtest','run-playtest','completion-combat','options-playtest','readability-playtest','production-playtest','shots'];
let active=!process.argv[2];for(const script of stages){if(script===process.argv[2])active=true;if(!active)continue;console.log(`START ${script}`);const log=await open(`shots/feel/checks/${script}.log`,'w'),child=spawn(process.execPath,[`tools/${script}.mjs`],{stdio:['ignore',log.fd,log.fd]});const code=await new Promise(resolve=>child.on('exit',resolve));await log.close();if(code!==0)throw Error(`${script} failed: shots/feel/checks/${script}.log`);console.log(`PASS ${script}`);}
