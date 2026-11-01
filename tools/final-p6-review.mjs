import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {session,load} from './browser.mjs';
const folder='shots/final-p6';await mkdir(folder,{recursive:true});const host=await session({headless:false,gpu:true});
try{
 const p=await host.browser.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log(e.message));p.on('console',m=>{if(m.type()==='error')console.log(m.text());});await p.addInitScript(()=>localStorage.setItem('redline.preferences.v1',JSON.stringify({version:1,quality:'standard',zoom:'default',reducedMotion:false,reducedFlashes:false})));await p.route(host.url+'/audio/**',r=>r.fulfill({contentType:'application/json',body:'{"tracks":[]}'}));const errors=await load(p,host.url,'arena');await p.locator('.audio-button').click();
 const report=await p.evaluate(async()=>{
  const {AudioManager}=await import('/src/audio/AudioManager.ts'),{audioMap}=await import('/src/content/audio-map.ts'),{cueLayers,makeNoise,startLayers}=await import('/src/audio/p6-synth.ts');
  const ids=['hit_light','hit_heavy','kill','pulse_bash','spin_start','boost','stomp_charge','stomp_slam','dash_tap','dash_charge_release','overdrive_start','boss_intro','boss_phase','boss_defeat','last_enemy','ui_confirm'];
  const offline=new OfflineAudioContext(1,Math.ceil(ids.length*1.1*24000),24000),noise=makeNoise(offline),gain=offline.createGain();gain.gain.value=.22;gain.connect(offline.destination);
  const layers=ids.map((id,i)=>{const s=audioMap[id],recipe=cueLayers(id,s.frequency,s.duration);startLayers(offline,recipe,noise,gain,1,i*1.1);return{id,layers:recipe.length};});const rendered=await offline.startRendering(),samples=Array.from(rendered.getChannelData(0));
  const a=new AudioManager();await a.unlock();a.configure({master:1,music:0,sfx:1,muted:false});
  for(let frame=0;frame<80;frame++){for(const id of ids)a.cue({id,tick:frame,x:0,z:0,intensity:1,pan:frame%2?.7:-.7});a.tick();await new Promise(r=>setTimeout(r,12));}
  const active=a.metadata();a.setScene('battle',true);await new Promise(r=>setTimeout(r,350));a.tick();const paused=a.metadata();await new Promise(r=>setTimeout(r,1500));const settled=a.metadata();a.dispose();
  return{ids,layers,samples,active,paused,settled};
 });
 assert.deepEqual(errors,[]);assert.ok(report.active.mix.started>0);assert.ok(report.active.mix.dropped>0);assert.ok(report.active.voices<=20);assert.ok(report.active.mix.peak>0&&report.active.mix.peak<.941);assert.equal(report.settled.voices,0);assert.ok(report.paused.mix.lowpass<2000);assert.ok(report.layers.find(l=>l.id==='hit_heavy').layers>=4);
 const samples=report.samples;delete report.samples;const wav=Buffer.alloc(44+samples.length*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(24000,24);wav.writeUInt32LE(48000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples.length*2,40);let peak=0;for(let i=0;i<samples.length;i++){peak=Math.max(peak,Math.abs(samples[i]));wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2);}assert.ok(peak>.01&&peak<1);await writeFile(`${folder}/original-cue-listening.wav`,wav);await writeFile(`${folder}/mix.json`,JSON.stringify({...report,offlinePeak:peak,errors,referenceAudioCopied:false},null,2));console.log(JSON.stringify({active:report.active,settled:report.settled,offlinePeak:peak}));
}finally{await host.close();}
