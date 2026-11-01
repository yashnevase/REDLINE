import type {RunState} from '../sim/run-schema.ts';
import type {FightState} from '../sim/schema.ts';
import type {Preferences} from '../content/preferences.ts';
import type {CombatTuning} from '../content/combat.ts';
// All counters and DOM animation are cosmetic; this never changes simulation damage/rewards.
export function makeFeelHUD(app:HTMLElement){
 const root=document.createElement('div');root.className='feel-hud';root.innerHTML='<div class="speed-streaks"></div><div class="overdrive-flash"></div><div class="impact-edge"></div><div class="impact-frame"></div><div class="damage-vignette"></div><div class="heat-grade"></div><aside class="streak" hidden><b></b><span>SCRAP STREAK</span></aside>';root.setAttribute('aria-hidden','true');app.append(root);
 const streak=root.querySelector<HTMLElement>('.streak')!,seen=new Set<string>();let chain=0,total=0,lastKill=-1000,lastTick=-1,damageAt=-1000,oldHP=-1,heavyAt=-1000,impactFrameAt=-1000,overdriveAt=-1000,resultAt=-1;
 const result=document.createElement('div');result.className='result-count';app.querySelector('.fight-overlay')?.append(result);
 return{reset:()=>{seen.clear();chain=total=0;lastKill=damageAt=-1000;lastTick=-1;resultAt=-1;oldHP=-1;heavyAt=impactFrameAt=overdriveAt=-1000;streak.hidden=true;},update:(s:RunState|FightState,prefs:Preferences,t:CombatTuning,hidden:boolean)=>{
  if(s.tick<lastTick){seen.clear();chain=total=0;lastKill=damageAt=-1000;resultAt=-1;}lastTick=s.tick;
  if(s.events.some(e=>e.kind==='overdrive'))overdriveAt=s.tick;app.style.setProperty('--od-flash',String(prefs.reducedFlashes?0:Math.max(0,1-(s.tick-overdriveAt)/12)));
  if(s.events.some(e=>['pulse','blade','stomp'].includes(e.kind)||e.kind==='bonk'&&e.amount>=14))heavyAt=s.tick;app.style.setProperty('--heavy-flash',String(prefs.reducedFlashes?0:Math.max(0,1-(s.tick-heavyAt)/2)));
  if(s.events.some(e=>e.kind==='defeat')&&s.events.some(e=>e.kind==='bonk'&&e.amount>=14))impactFrameAt=s.tick;app.style.setProperty('--impact-frame',String(prefs.reducedFlashes?0:s.tick-impactFrameAt<1?.18:0));
  if(oldHP>=0&&s.hero.hp<oldHP)damageAt=s.tick;oldHP=s.hero.hp;
  for(const event of s.events){if(seen.has(event.id))continue;seen.add(event.id);if(event.kind==='defeat'){if(s.tick-lastKill>180)chain=0;chain++;total++;lastKill=s.tick;streak.querySelector('b')!.textContent=`×${chain>=10?10:chain>=5?5:3}`;streak.dataset.tier=String(chain>=10?10:chain>=5?5:3);streak.style.animation='none';void streak.offsetWidth;streak.style.animation='';}}
  if(seen.size>512){seen.clear();for(const event of s.events)seen.add(event.id);}
  streak.hidden=hidden||chain<3||s.tick-lastKill>180;
  app.style.setProperty('--hurt',String(prefs.reducedFlashes?0:Math.max(0,1-(s.tick-damageAt)/24)));
  app.style.setProperty('--heat',String((prefs.reducedFlashes?.15:1)*(s.hero.overdrive>0?1:s.hero.heat/t.heatThreshold)));
  app.dataset.overdrive=String(s.hero.overdrive>0);app.style.setProperty('--speed',String(prefs.reducedMotion||hidden?0:Math.min(.7,Math.hypot(s.hero.vx,s.hero.vz)/25*.4+(s.hero.overdrive>0?.25:0))));
  const health=app.querySelector<HTMLElement>('.health')!;health.style.setProperty('--hurt',String(prefs.reducedFlashes?0:Math.max(0,1-(s.tick-damageAt)/18)));
  for(const button of app.querySelectorAll<HTMLElement>('.skill')){const ready=button.getAttribute('aria-disabled')==='false';if(button.dataset.wasReady==='false'&&ready)button.classList.add('ready-pop');if(!ready)button.classList.remove('ready-pop');button.dataset.wasReady=String(ready);}
  const terminal='phase' in s&&(s.phase.kind==='lost'||s.phase.kind==='complete');result.hidden=!terminal;
  if(terminal){if(resultAt<0)resultAt=s.tick;const progress=prefs.reducedMotion?1:Math.min(1,(s.tick-resultAt)/45);result.textContent=`${Math.round(total*(1-(1-progress)**3))} MACHINES SCRAPPED`;}
 }};
}
