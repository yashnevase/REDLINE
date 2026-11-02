import type {CueId} from '../content/audio-map.ts';
export const P6_ENABLED=true;
export type SoundLayer={kind:'tone'|'air'|'metal';hz:number;end:number;seconds:number;gain:number;delay:number;attack:number};
const tone=(hz:number,end:number,seconds:number,gain:number,delay=0,attack=.003):SoundLayer=>({kind:'tone',hz,end,seconds,gain,delay,attack});
const air=(hz:number,end:number,seconds:number,gain:number,delay=0):SoundLayer=>({...tone(hz,end,seconds,gain,delay,.006),kind:'air'});
const metal=(hz:number,seconds:number,gain:number,delay=0):SoundLayer=>({...tone(hz,hz*.91,seconds,gain,delay),kind:'metal'});
// Original mechanical recipes. Source study informs timing and hierarchy, never copied audio/code.
export function cueLayers(id:CueId,hz:number,seconds:number):SoundLayer[]{
 if(id==='frog_hop')return[tone(230,80,.13,.5),air(1300,350,.12,.25)];
 if(id==='drum_ring'||id==='bog_drums')return[tone(hz*1.5,hz*.6,seconds,.65),tone(hz*2.03,hz*.85,seconds*.7,.18),air(700,200,.04,.15)];
 if(id==='gulp_croak')return[tone(145,55,.4,.55),tone(290,110,.32,.22,.03),air(380,140,.3,.2)];
 if(id==='tongue_snap')return[air(2300,450,.08,.5),tone(400,120,.13,.5)];
 if(id==='wet_hit')return[tone(145,45,.15,.65),air(1800,280,.14,.45),tone(520,190,.1,.15,.02)];
 if(id==='water_splash'||id==='bog_water')return[air(id==='bog_water'?650:2600,250,seconds,.55),tone(170,65,seconds*.5,.2)];
 if(id==='bog_spore')return[air(2200,900,.16,.3),tone(900,1400,.11,.14)];
 if(id==='grinder_whine')return[metal(hz,seconds,.55),air(2800,1700,seconds,.24)];
 if(id==='contact_scrape')return[air(2600,700,seconds,.55),metal(380,seconds,.3)];
 if(id==='spark_crackle')return[air(4400,1600,.04,.45),metal(2700,.025,.24)];
 if(id==='steel_clang')return[metal(480,.28,.6),metal(731,.19,.35,.008),tone(115,52,.13,.3)];
 if(id==='spark')return[metal(2400,.025,.3)];
 if(id==='trophy')return[tone(660,880,.45,.5),metal(1320,.65,.3,.08),tone(990,1320,.5,.3,.15)];
 if(id==='last_enemy')return[tone(660,880,.18,.5),metal(1320,.18,.15,.04)];
 if(id.startsWith('ui_'))return[tone(hz,hz*1.08,seconds,.45)];
 if(id==='vent'||id==='wind')return[air(id==='vent'?2800:650,320,seconds,.45)];
 if(id==='machinery'||id==='heartbeat')return[tone(hz,hz*.7,seconds,.8),metal(hz*3,seconds*.4,.12)];
 if(id==='saw_whine'||id==='spin_tick')return[metal(hz,seconds,.65),air(2400,1200,seconds,.18)];
 if(id==='hit_light'||id==='hit_medium'||id==='hit_heavy'||id==='crit'||id==='counter'||id==='rear_hit'){
  const heavy=id==='hit_heavy'||id==='crit'||id==='counter';
  return[tone(heavy?125:195,heavy?38:76,heavy?.24:.11,.8),air(3200,650,.055,.45),metal(heavy?480:850,.16,.25),...(heavy?[tone(58,28,.28,.4)]:[])];
 }
 if(id==='kill')return[tone(145,35,.24,.9),air(3900,650,.14,.55),metal(930,.27,.4,.018)];
 if(id==='pickup'||id==='repair'||id==='perfect'||id==='upgrade_pick')return[tone(hz,hz*1.45,seconds,.5),metal(hz*1.5,seconds,.25,.04)];
 if(id==='dash_charge_start'||id==='stomp_charge')return[air(350,3200,seconds,.45),tone(80,260,seconds,.4,0,seconds*.6)];
 if(id==='dash_tap'||id==='dash_rush'||id==='boost')return[air(2200,450,seconds,.7),tone(180,55,seconds*.7,.5,.025),metal(700,.12,.12,.045)];
 if(id==='pulse_bash'||id==='spin_start'||id==='dash_charge_release'||id==='stomp_slam')return[air(1700,300,seconds,.5),tone(id==='stomp_slam'?82:140,32,seconds,.9,.015),metal(id==='spin_start'?820:530,seconds*.9,.3,.03),air(800,200,seconds*.8,.2,.08)];
 if(id==='boss_explosion'||id==='overdrive_start'||id==='boss_intro'||id==='boss_phase'||id==='boss_defeat')return[tone(90,29,.65,.85,0,.025),air(2800,180,.48,.5,.02),metal(id==='boss_phase'?310:620,.65,.3,.07),tone(44,31,.7,.5,.04,.1)];
 return[tone(hz,hz*1.25,seconds,.55),metal(hz*1.52,seconds*.8,.22,.065),air(1600,800,.12,.12,.1)];
}
export function makeNoise(c:BaseAudioContext){const b=c.createBuffer(1,c.sampleRate,c.sampleRate),a=b.getChannelData(0);let seed=83627;for(let i=0;i<a.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;a[i]=seed/2147483648-1;}return b;}
export function startLayers(c:BaseAudioContext,layers:readonly SoundLayer[],noise:AudioBuffer,out:AudioNode,pitch:number,at=c.currentTime){
 const sources:AudioScheduledSourceNode[]=[],nodes:AudioNode[]=[];let until=at;
 for(const layer of layers){const start=at+layer.delay,end=start+layer.seconds,g=c.createGain();g.gain.setValueAtTime(.0001,start);g.gain.linearRampToValueAtTime(layer.gain,start+Math.min(layer.attack,layer.seconds*.8));g.gain.exponentialRampToValueAtTime(.0001,end);g.connect(out);nodes.push(g);let source:AudioScheduledSourceNode;
  if(layer.kind==='air'){const s=c.createBufferSource(),filter=c.createBiquadFilter();s.buffer=noise;filter.type='bandpass';filter.Q.value=.8;filter.frequency.setValueAtTime(layer.hz*pitch,start);filter.frequency.exponentialRampToValueAtTime(layer.end*pitch,end);s.connect(filter);filter.connect(g);nodes.push(filter);source=s;}
  else{const s=c.createOscillator();s.type=layer.kind==='metal'?'triangle':'sine';s.frequency.setValueAtTime(layer.hz*pitch,start);s.frequency.exponentialRampToValueAtTime(Math.max(20,layer.end*pitch),end);s.connect(g);source=s;}
  sources.push(source);source.start(start);source.stop(end);until=Math.max(until,end);
 }
 return{sources,until,disconnect:()=>{sources.forEach(s=>s.disconnect());nodes.forEach(n=>n.disconnect());},stop:()=>{for(const s of sources)try{s.stop();}catch{/* already ended */}}};
}
