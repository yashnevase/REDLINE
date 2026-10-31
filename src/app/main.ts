import {makeFeelHUD} from '../ui/feel-hud.ts';
import {bossStage} from '../content/boss.ts';
import {makeStartup} from '../ui/startup.ts';
import {makeEncounterBanner} from '../ui/encounter-banner.ts';
import {loadPreferences,savePreferences} from '../save/preferences.ts';
import {makePreferences} from '../ui/preferences.ts';
import {loadProfile,saveProfile} from '../save/profile.ts';
import {awardBlade,equipProfile} from '../content/profile.ts';
import {createRunSimulation} from '../sim/run-runtime.ts';
import {upgrades,upgradedTuning,upgradeDescription} from '../content/upgrades.ts';
import { makeScene, type SceneName, type Tuning } from '../presentation/scene.ts';
import { defaults, scenes } from '../content/scene.mjs';
import {createSimulation} from '../sim/runtime.ts';
import {makeInput} from '../input/devices.ts';
import {combatDefaults,tuningSchema,type CombatTuning} from '../content/combat.ts';
import {idleCommand,type Command} from '../sim/schema.ts';
import '../ui/style.css';

let profile=loadProfile();
let saveAvailable=true;
const params = new URLSearchParams(location.search);
const requested = params.get('scene') ?? 'lobby';
const sceneName = (scenes.includes(requested) ? requested : 'lobby') as SceneName;
const trial=params.has('trial');
const playing = sceneName === 'arena' || sceneName === 'perf-worst';
const studio = sceneName === 'lobby' || sceneName === 'core-studio' || sceneName === 'workshop';
const icon = (name: string) => {
  const paths: Record<string, string> = {
    pulse: '<circle cx="24" cy="24" r="8"/><path d="M24 5v7m0 24v7M5 24h7m24 0h7M11 11l5 5m16 16 5 5M11 37l5-5m16-16 5-5"/>',
    boost: '<path d="m11 12 13 12-13 12m13-24 13 12-13 12M6 17h7M4 31h9"/>',
    stomp: '<path d="M24 7v20m-7-7 7 7 7-7M8 34l8-4m16 0 8 4M10 41h28"/>',
    play: '<path d="m18 11 19 13-19 13z"/>',
    blade: '<path d="m24 4 5 7 8-2-1 9 8 6-8 5 1 9-8-2-5 8-5-8-8 2 1-9-8-5 8-6-1-9 8 2z"/><circle cx="24" cy="24" r="5"/>',
    core: '<circle cx="24" cy="24" r="18"/><path d="m16 24 5 2v5l-5-1zm11 2 5-2v6l-5 1M20 12l-2 7m11-7-2 7"/>',
    back: '<path d="m28 12-12 12 12 12"/>',
    tune: '<path d="M9 14h30M9 24h30M9 34h30m-20-25v10m12 0v10m-12 0v10"/>'
  };
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.core}</svg>`;
};
const app = document.querySelector<HTMLDivElement>('#app')!;
app.className = studio ? 'lobby' : 'fight';
app.innerHTML = `<canvas aria-label="REDLINE: original 3D Core and Foundry visual preview"></canvas><div class="vignette"></div>
<header><a class="wordmark" href="?scene=lobby">REDLINE<span>CHAPTER 01</span></a><div class="scene-title">${studio ? 'THE CORE' : 'THE FOUNDRY'}<small>${studio ? 'BASE FORM' : 'CHAPTER 01'}</small></div><nav class="scene-switch"><a class="${studio ? 'active' : ''}" href="?scene=lobby">Lobby</a><a class="${sceneName === 'arena' ? 'active' : ''}" href="?scene=arena">Arena</a><a class="${sceneName === 'combat-readability' ? 'active' : ''}" href="?scene=combat-readability">Effects</a></nav><button class="settings" aria-label="Open scene settings">${icon('tune')}</button></header>
${studio ? `
<nav class="lobby-nav" aria-label="Character previews"><span class="eyebrow">YOUR MACHINE</span><a class="selected" href="?scene=core-studio"><span>01</span> Core <i>↗</i></a><a href="?scene=enemy-lineup"><span>02</span> Sawlet <i>↗</i></a><a href="?scene=combat-readability"><span>03</span> Pulse Bash <i>↗</i></a></nav>
<section class="chapter-card"><span class="eyebrow">CHAPTER 01</span><h1>The Foundry</h1><p>Steel, heat & momentum.</p><div class="chapter-pips"><span class="selected"></span><span></span><span></span><span></span></div><div class="chapter-meta"><span>BASE FORM</span><b>CORE</b></div></section>
<div class="pilot"><div class="pilot-icon">${icon('core')}</div><div><b>Core</b><span>VIOLET CHROME · BASE FORM</span></div></div>
<div class="lobby-actions"><a class="practice" href="?scene=combat-readability">${icon('pulse')}<span>Effects preview</span></a><a class="play" href="?scene=arena"><span>${icon('play')}</span>Enter Foundry</a></div>
<section class="loadout-panel" aria-label="Equip form"><span class="eyebrow">LOADOUT</span><div><button data-equip="core">Core</button><button data-equip="blade">Blade · Locked</button></div><small class="save-status"></small></section><div class="preview-note">CHAPTER 01 · FOUR WAVES</div>` : `
<aside class="combat-label"><span>${sceneName === 'combat-readability' ? 'PULSE BASH' : sceneName === 'enemy-lineup' ? 'ENEMY LINEUP' : 'FOUNDRY / 01'}</span><small>${sceneName === 'combat-readability' ? 'LOOPING EFFECTS PREVIEW' : sceneName === 'enemy-lineup' ? 'ENEMY MODEL PREVIEW' : 'VISUAL PREVIEW'}</small></aside>
<aside class="roster"><div class="portrait">${icon('core')}</div><div><b>CORE</b><span>BASE FORM</span><i></i></div></aside>
<div class="health"><div class="health-label"><span>CORE INTEGRITY</span><b>100 / 100</b></div><div class="health-track"><i></i></div><div class="heat"><span>HEAT</span><div></div><span>0%</span></div></div>
<div class="study-stick" aria-hidden="true"><div></div></div><div class="abilities" aria-label="Control layout preview; combat is not active"><a href="?scene=combat-readability" class="ability pulse" aria-label="Preview Pulse Bash effects">${icon('pulse')}<small>Q</small></a><div class="ability boost">${icon('boost')}<small>E</small></div><div class="ability stomp">${icon('stomp')}<small>X</small></div><div class="ability dash">${icon('boost')}<small>DASH</small></div></div>
<a href="?scene=lobby" class="return">${icon('back')}<span>LOBBY</span></a><span class="fight-note">${sceneName === 'combat-readability' ? 'VISUAL PREVIEW · PULSE BASH' : 'SCENE PREVIEW · CONTROLS NOT ACTIVE'}</span>`}`;
if(studio&&sceneName!=='core-studio'){
 app.querySelector('.lobby-nav')!.innerHTML=`<span class="eyebrow">${sceneName==='workshop'?'WORKSHOP':'READY TO ROLL'}</span><nav class="hangar-tabs"><a href="?scene=lobby" aria-current="${sceneName==='lobby'?'page':'false'}">Hangar</a><a href="?scene=workshop" aria-current="${sceneName==='workshop'?'page':'false'}">Workshop</a></nav><div class="hangar-card"><span>Q · ACTIVE</span><b class="loadout-q">Pulse Bash</b><small class="loadout-q-detail">Radial burst · 2 s</small></div><div class="hangar-card"><span>E · MOBILITY</span><b>Boost Burst</b><small>Forward burst · 3 s</small></div><div class="hangar-card"><span>X · CONTROL</span><b>Stomp</b><small>Area stun · 4 s</small></div>`;
 const stats=document.createElement('section');stats.className='machine-stats';stats.setAttribute('aria-label','Core statistics');stats.innerHTML='<span class="eyebrow">MACHINE SPECS</span><dl><div><dt>Integrity</dt><dd>100</dd></div><div><dt>Dash cells</dt><dd>2</dd></div><div><dt>Bonk</dt><dd>8–12</dd></div></dl>';app.append(stats);
 app.querySelector('.practice')!.setAttribute('href','?scene=workshop');app.querySelector('.practice span')!.textContent='Workshop';
}
const tuning: Tuning = { ...defaults };
const view = makeScene(app.querySelector('canvas')!, sceneName, tuning);
const resize = () => view.resize(innerWidth, innerHeight); addEventListener('resize', resize); resize();
let preferences=loadPreferences();app.dataset.reducedMotion=String(preferences.reducedMotion);app.dataset.reducedFlashes=String(preferences.reducedFlashes);view.setPreferences(preferences);
let ready=false;
let measuring = false;
let tick = playing ? 0 : 120; let frozen = params.has('capture') || (!playing && preferences.reducedMotion); let lastTime = performance.now();
let gameTuning:CombatTuning={...combatDefaults};
const makeGame=()=>trial?createSimulation(gameTuning,import.meta.env.DEV):createRunSimulation(gameTuning,import.meta.env.DEV,profile.equipped);
let sim=playing?makeGame():null;
let snapshot=sim?.view();let paused=false,accumulator=0,pendingTuning:CombatTuning|undefined;
let recordingTuning={...gameTuning};
const recording:Command[]|undefined=import.meta.env.DEV?[]:undefined;
const queuedCommands:Command[]|undefined=import.meta.env.DEV?[]:undefined;let input:ReturnType<typeof makeInput>|undefined;let cancelChargeOnResume=false;function clearInput(){if(snapshot?.hero.dash.kind==='charging')cancelChargeOnResume=true;input?.clear();}
let slowUntil=0,slowScale=1;const requestSlow=(seconds:number,scale:number)=>{if(preferences.reducedMotion)return;slowUntil=Math.max(slowUntil,performance.now()+seconds*1000);slowScale=Math.min(slowScale,scale);};const cooldownPeek={pulse:-1,boost:-1,stomp:-1};let drawHUD=()=>{};
let resetHUD=()=>{};
function refreshLoadout(){
 if(!studio)return;const core=app.querySelector<HTMLButtonElement>('[data-equip=core]')!,blade=app.querySelector<HTMLButtonElement>('[data-equip=blade]')!;
 core.setAttribute('aria-pressed',String(profile.equipped==='core'));blade.disabled=!profile.bladeUnlocked;blade.textContent=profile.bladeUnlocked?'Blade':'Blade · Locked';blade.setAttribute('aria-pressed',String(profile.equipped==='blade'));
 app.querySelector('.save-status')!.textContent=saveAvailable?(profile.bladeUnlocked?'Blade unlocked · saved on this device':'Defeat Scrap-Rex to unlock Blade'):'Local saving unavailable · progress kept for this visit';
 view.setLoadout(profile.equipped);const q=app.querySelector('.loadout-q');if(q){q.textContent=profile.equipped==='blade'?'Blade Spin':'Pulse Bash';app.querySelector('.loadout-q-detail')!.textContent=profile.equipped==='blade'?'360° cleave · 2 s':'Radial burst · 2 s';}app.querySelector('.scene-title small')!.textContent=profile.equipped==='blade'?'BLADE EQUIPPED':'BASE FORM';app.querySelector('.pilot>div>span')!.textContent=profile.equipped==='blade'?'VIOLET CHROME · BLADE':'VIOLET CHROME · BASE FORM';app.querySelector('.chapter-meta b')!.textContent=profile.equipped.toUpperCase();
}
if(studio){for(const form of ['core','blade'] as const)app.querySelector(`[data-equip=${form}]`)!.addEventListener('click',()=>{profile=equipProfile(profile,form);saveAvailable=saveProfile(profile);refreshLoadout();});refreshLoadout();}

function effectiveTuning(){return snapshot&&'upgrades' in snapshot?upgradedTuning(gameTuning,snapshot.upgrades):gameTuning;}
function applySnapshot(alpha:number){if(!snapshot)return;if('enemies' in snapshot)view.applyRun(snapshot,alpha,effectiveTuning());else view.applyFight(snapshot,alpha,gameTuning);}
function restart(){if(!playing)return;sim=makeGame();snapshot=sim.view();cancelChargeOnResume=false;paused=false;accumulator=0;tick=0;lastTime=performance.now();view.reset();resetHUD();queuedCommands?.splice(0);recordingTuning={...gameTuning};recording?.splice(0);clearInput();applySnapshot(1);drawHUD();}
function togglePause(){if(!playing||options.isOpen())return;paused=!paused;clearInput();accumulator=0;drawHUD();}
function step(command:Command){if(!sim)return;if(cancelChargeOnResume){command={...command,dashInput:'cancel'};cancelChargeOnResume=false;}const wasBoss=snapshot&&'phase' in snapshot&&snapshot.phase.kind==='boss',oldBossStage=snapshot&&'phase' in snapshot&&snapshot.phase.kind==='boss'?bossStage(snapshot.phase.boss.hp,gameTuning):0;const intent=pendingTuning?{...command,tuning:pendingTuning}:command;pendingTuning=undefined;if(intent.tuning){const parsed=tuningSchema.safeParse(intent.tuning);if(parsed.success)gameTuning=parsed.data;}snapshot=sim.step(intent);if(command.ability)cooldownPeek[command.ability]=snapshot.tick+30;if(oldBossStage&&'phase' in snapshot&&snapshot.phase.kind==='boss'&&bossStage(snapshot.phase.boss.hp,gameTuning)>oldBossStage&&!preferences.reducedMotion)requestSlow(tuning.bossSlowSeconds,tuning.bossSlowScale);if(snapshot.events.some(e=>e.kind==='overdrive'))requestSlow(tuning.overdriveEntrySeconds,tuning.overdriveEntryScale);if(snapshot.events.some(e=>e.kind==='defeat')&&snapshot.events.some(e=>e.kind==='bonk'&&e.amount>=14||['pulse','blade','stomp'].includes(e.kind)))requestSlow(tuning.killSlowSeconds,tuning.killSlowScale);if(wasBoss&&'phase' in snapshot&&snapshot.phase.kind==='complete'&&snapshot.phase.reward==='blade'){profile=awardBlade(profile);saveAvailable=saveProfile(profile);}recording?.push(intent);if(recording&&recording.length>36000)recording.shift();applySnapshot(1);tick=snapshot.tick;}
const options=makePreferences(app,preferences,()=>{if(playing){paused=true;clearInput();accumulator=0;drawHUD();}},next=>{preferences=next;app.dataset.reducedMotion=String(next.reducedMotion);app.dataset.reducedFlashes=String(next.reducedFlashes);if(!playing&&!params.has('capture'))frozen=next.reducedMotion;view.setPreferences(next);return savePreferences(next);});
if(playing){
 const banner=makeEncounterBanner(app);
 app.classList.add('live');app.querySelector('.health-label span')!.textContent='INTEGRITY';
 app.querySelector('.combat-label small')!.textContent='MOVE CLOSE TO AUTO-BONK';
 app.querySelector('.combat-label span')!.textContent='FIRST CONTACT';
 app.querySelector('.fight-note')!.textContent='WASD · SPACE DASH · Q / E / X · P PAUSE';

 const abilities=app.querySelector<HTMLElement>('.abilities')!;abilities.setAttribute('aria-label','Combat abilities');
 abilities.innerHTML=`${(['pulse','boost','stomp'] as const).map((name,i)=>`<button class="ability skill ${name}" data-ability="${name}" aria-label="${['Pulse Bash','Boost Burst','Stomp'][i]}">${icon(name)}<small>${['Q','E','X'][i]}</small><b></b></button>`).join('')}<button class="ability dash live-dash" aria-label="Dash">${icon('boost')}<small>DASH</small></button><button class="overdrive-button" data-overdrive aria-label="Activate Overdrive">R · OVERDRIVE</button><div class="dash-charges"><i></i><i></i></div><span class="charge-label">2 / 2</span>`;
 const announcement=document.createElement('div');announcement.className='sr-only';announcement.setAttribute('role','status');announcement.setAttribute('aria-live','polite');app.append(announcement);let lastAnnouncement='';
 const pause=document.createElement('button');pause.className='pause';pause.setAttribute('aria-label','Pause fight');pause.textContent='Ⅱ';app.append(pause);pause.addEventListener('click',togglePause);
 const bars=Array.from({length:12},()=>{const bar=document.createElement('div');bar.className='enemy-health';bar.hidden=true;bar.innerHTML='<i></i>';app.append(bar);return bar;});
 const bossBar=document.createElement('section');bossBar.className='boss-health';bossBar.hidden=true;bossBar.innerHTML='<span>SCRAP-REX</span><b></b><div><i></i></div>';app.append(bossBar);
 const hp=document.createElement('div');hp.className='enemy-health';hp.setAttribute('aria-hidden','true');hp.innerHTML='<i></i>';app.append(hp);
 const overlay=document.createElement('section');overlay.className='fight-overlay';overlay.hidden=true;overlay.innerHTML='<span class="eyebrow">THE FOUNDRY</span><h1></h1><p></p><div class="upgrade-choices"></div><small class="upgrade-hint"></small><button class="resume">Resume</button><button class="retry">Fight again</button><a class="equip-reward" href="?scene=lobby">Equip Blade</a><a href="?scene=lobby">Return to lobby</a>';app.append(overlay);
 overlay.querySelector('.resume')!.addEventListener('click',togglePause);overlay.querySelector('.retry')!.addEventListener('click',restart);
 addEventListener('keydown',event=>{if(event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,[contenteditable=true]'))return;if(!paused&&snapshot&&'phase' in snapshot&&snapshot.phase.kind==='upgrade'&&['Digit1','Digit2','Digit3'].includes(event.code)){event.preventDefault();const id=snapshot.phase.choices[Number(event.code.slice(-1))-1];step({x:0,z:0,dash:false,upgrade:id});clearInput();drawHUD();}});
 const dash=abilities.querySelector<HTMLElement>('.dash')!;input=makeInput(app.querySelector<HTMLElement>('.study-stick')!,dash,togglePause,restart);
 addEventListener('blur',()=>{clearInput();paused=true;accumulator=0;drawHUD();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();paused=true;accumulator=0;drawHUD();}});
 const feelHUD=makeFeelHUD(app);let lastResult='';
 resetHUD=()=>{feelHUD.reset();cooldownPeek.pulse=cooldownPeek.boost=cooldownPeek.stomp=-1;slowUntil=0;slowScale=1;banner.reset();lastResult='';lastAnnouncement='';};
 drawHUD=()=>{if(!snapshot)return;const h=snapshot.hero,config=effectiveTuning(),run='enemies' in snapshot?snapshot:null,e='enemy' in snapshot?snapshot.enemy:null;
  const isBoss=run?.phase.kind==='boss';bossBar.hidden=!isBoss;if(isBoss&&run?.phase.kind==='boss'){const hp=run.phase.boss.hp;bossBar.querySelector('span')!.textContent=hp<=config.bossHP*.2?'SCRAP-REX · ENRAGED':'SCRAP-REX';bossBar.querySelector('b')!.textContent=`${Math.ceil(hp)} / ${config.bossHP}`;bossBar.querySelector<HTMLElement>('i')!.style.width=`${hp/config.bossHP*100}%`;}
  app.querySelector('.roster span')!.textContent=run?.loadout==='blade'?'BLADE EQUIPPED':'BASE FORM';
  const qButton=abilities.querySelector<HTMLElement>('[data-ability=pulse]')!;const form=run?.loadout??'core';if(qButton.dataset.form!==form){qButton.querySelector('svg')!.outerHTML=icon(form==='blade'?'blade':'pulse');qButton.dataset.form=form;}
  abilities.querySelector('[data-ability=pulse]')!.setAttribute('aria-label',run?.loadout==='blade'?'Blade Spin':'Pulse Bash');
  const result=h.hp<=0?'lost':run?(run.phase.kind==='complete'?'won':run.phase.kind==='upgrade'?'upgrade':'fighting'):e?.behavior.kind==='defeated'?'won':'fighting';app.dataset.result=result;
  const label=app.querySelector<HTMLElement>('.health-label b')!;label.textContent=`${Math.round(h.hp/config.heroHP*100)} / 100`;label.setAttribute('aria-label',`${Math.round(h.hp/config.heroHP*100)} percent integrity`);
  app.querySelector<HTMLElement>('.health-track i')!.style.width=`${h.hp/config.heroHP*100}%`;
  abilities.querySelector('.charge-label')!.textContent=`${h.charges} / ${config.dashCharges}`;
  const chargeRoot=abilities.querySelector('.dash-charges')!;if(chargeRoot.children.length!==config.dashCharges)chargeRoot.innerHTML='<i></i>'.repeat(config.dashCharges);
  abilities.querySelectorAll<HTMLElement>('.dash-charges i').forEach((dot,i)=>dot.classList.toggle('ready',i<h.charges));
  dash.setAttribute('aria-disabled',String(h.charges===0&&h.overdrive===0||h.dashCooldown>0&&h.tapWindow===0));dash.classList.toggle('charging',h.dash.kind==='charging');dash.style.setProperty('--charge',`${h.dash.kind==='charging'?Math.min(1,h.dash.ticks/config.dashChargeTicks):0}`);dash.style.setProperty('--recharge',`${h.recharge/config.rechargeTicks*360}deg`);
  for(const name of ['pulse','boost','stomp'] as const){const button=abilities.querySelector<HTMLElement>(`[data-ability="${name}"]`)!;const remaining=h[`${name}Cooldown`];button.setAttribute('aria-disabled',String(remaining>0));const total=name==='pulse'?(run?.loadout==='blade'?config.bladeCooldownTicks:config.pulseCooldownTicks):name==='boost'?config.boostCooldownTicks:config.stompCooldownTicks;button.style.setProperty('--cd',`${Math.min(1,remaining/total)*360}deg`);button.querySelector('b')!.textContent=remaining>0&&(remaining<=60||snapshot.tick<=cooldownPeek[name])?String(Math.ceil(remaining/60)):'';}
  const od=abilities.querySelector<HTMLElement>('[data-overdrive]')!;od.setAttribute('aria-disabled',String(h.heat<gameTuning.heatThreshold||h.overdrive>0));od.textContent=h.overdrive>0?`OVERDRIVE ${Math.ceil(h.overdrive/60)}s`:'R · OVERDRIVE';
  const heat=app.querySelector<HTMLElement>('.heat')!;heat.children[0].textContent=h.overdrive>0?'OVERDRIVE':'HEAT';(heat.children[1] as HTMLElement).style.setProperty('--heat-angle',`${h.heat/gameTuning.heatThreshold*360}deg`);heat.children[2].textContent=`${Math.round(h.heat/gameTuning.heatThreshold*100)}%`;
  if(run){const phase=run.phase;app.querySelector('.combat-label span')!.textContent=phase.kind==='fight'||phase.kind==='upgrade'?`WAVE ${phase.wave+1} / 4`:phase.kind==='boss'?'SCRAP-REX':'FOUNDRY';app.querySelector('.combat-label small')!.textContent=`${run.enemies.filter(e=>e.hp>0).length} ENEMIES · ${run.upgrades.length} UPGRADES`;const points=view.runScreens();bars.forEach((bar,i)=>{const e=run.enemies[i],p=points[i];bar.hidden=!e||!p?.visible||result!=='fighting'||e.hp>=(e.kind==='sawlet'?config.sawletHP:e.kind==='thrower'?config.throwerHP:e.kind==='shieldsaw'?config.shieldsawHP:config.grinderHP);if(e&&p){bar.style.transform=`translate(${p.x}px,${p.y}px)`;bar.querySelector<HTMLElement>('i')!.style.width=`${e.hp/(e.kind==='sawlet'?config.sawletHP:e.kind==='thrower'?config.throwerHP:e.kind==='shieldsaw'?config.shieldsawHP:config.grinderHP)*100}%`;}});}
  hp.hidden=!!run||result!=='fighting';const point=view.enemyScreen();hp.style.transform=`translate(${point.x}px,${point.y}px)`;hp.querySelector<HTMLElement>('i')!.style.width=`${Math.max(0,e?.hp??0)/gameTuning.sawletHP*100}%`;
  overlay.hidden=!paused&&result==='fighting';overlay.setAttribute('role','region');overlay.setAttribute('aria-label',paused?'Paused':result==='upgrade'?'Choose an upgrade':result==='won'?'Victory':'Defeat');overlay.querySelector('h1')!.textContent=paused?'Paused':result==='upgrade'?'Choose an upgrade':result==='won'?(run?'Foundry cleared.':'Sawlet down.'):'Core offline.';
  overlay.querySelector('p')!.textContent=paused?'Take a breath.':result==='upgrade'?'Choose one. Your next wave starts when you’re ready.':result==='won'?(run?`Blade unlocked. Chapter 2 · Coming soon.${saveAvailable?'':' Local saving unavailable; the unlock could not be stored.'}`:'First contact complete. Ready for another round?'):'Watch the warning, then dash through the attack.';
  overlay.querySelector<HTMLElement>('.resume')!.hidden=!paused;overlay.querySelector<HTMLElement>('.retry')!.hidden=paused||result==='upgrade';
  const choiceRoot=overlay.querySelector<HTMLElement>('.upgrade-choices')!;const choices=run?.phase.kind==='upgrade'?run.phase.choices:[];choiceRoot.hidden=paused||result!=='upgrade';overlay.querySelector('.upgrade-hint')!.textContent=result==='upgrade'?'1 / 2 / 3 · GAMEPAD A / B / Y':'';
  const signature=choices.join(',');if(choiceRoot.dataset.choices!==signature){choiceRoot.dataset.choices=signature;choiceRoot.replaceChildren();choices.forEach((id,i)=>{const data=upgrades.find(u=>u.id===id)!;const button=document.createElement('button');button.className='upgrade-card';button.innerHTML=`<small>0${i+1} · RUN UPGRADE</small><b>${data.name}</b><span>${upgradeDescription(id,config,run?.loadout==='blade')}</span>`;button.addEventListener('click',()=>{step({x:0,z:0,dash:false,upgrade:id});clearInput();drawHUD();});choiceRoot.append(button);});}
  overlay.querySelector<HTMLElement>('.equip-reward')!.hidden=paused||result!=='won'||!run||!saveAvailable;
  pause.setAttribute('aria-label',paused?'Resume fight':'Pause fight');pause.textContent=paused?'▶':'Ⅱ';
  feelHUD.update(snapshot,preferences,config,paused||result!=='fighting');
  const phaseKey=run?.phase.kind==='fight'?`wave-${run.phase.wave}`:run?.phase.kind==='boss'?`boss-${bossStage(run.phase.boss.hp,config)}`:run?.phase.kind??'trial';banner.update({slideSeconds:tuning.bannerSeconds,tick:snapshot.tick,phase:phaseKey,title:run?.phase.kind==='fight'?`WAVE ${run.phase.wave+1} · SAWLETS!`:run?.phase.kind==='boss'?`SCRAP-REX · ${bossStage(run.phase.boss.hp,config)===4?'ENRAGED':`PHASE ${bossStage(run.phase.boss.hp,config)}`}`:'First contact',subtitle:run?.phase.kind==='boss'?'Watch the charge lane and sweep gap':run?.phase.kind==='fight'?`${run.enemies.filter(e=>e.hp>0).length} enemies · The Foundry`:'Move close to auto-bonk',overdrive:h.overdrive>0,hidden:paused||result!=='fighting',reducedMotion:preferences.reducedMotion});
  if(!app.querySelector<HTMLElement>('.encounter-banner')!.hidden)app.querySelector<HTMLElement>('.streak')!.hidden=true;
  const notice=paused?'Paused':result==='won'?(run?'Foundry cleared. Blade unlocked.':'Sawlet defeated.'):result==='lost'?'Core offline. Retry available.':result==='upgrade'?'Wave cleared. Choose one of three upgrades.':run?.phase.kind==='boss'?'Scrap-Rex. Boss encounter.':run?.phase.kind==='fight'?`Wave ${run.phase.wave+1} of 4.`:'First contact.';if(notice!==lastAnnouncement){announcement.textContent=notice;lastAnnouncement=notice;}
  if(result!==lastResult){if(!paused){if(result==='upgrade')choiceRoot.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true});else if(result==='won'||result==='lost')overlay.querySelector<HTMLButtonElement>('.retry')!.focus({preventScroll:true});}lastResult=result;app.setAttribute('aria-label',result==='won'?(run?'Foundry cleared. Blade unlocked.':'Sawlet defeated'):result==='lost'?'Core offline':'Foundry fight');}
 };
 applySnapshot(1);
}
function animate(time:number){
 if(time>=slowUntil)slowScale=1;
 const delta=Math.min((time-lastTime)/1000,.1);lastTime=time;
 if(!measuring&&ready){
  if(playing&&sim){
   if(!frozen&&!paused&&!options.isOpen()){accumulator=Math.min(.1,accumulator+delta*(time<slowUntil?slowScale:1));while(accumulator>=1/60){const command=queuedCommands?.shift()??input!.sample(tuning.azimuth,tuning.elevation);if(paused)break;if(snapshot&&'phase' in snapshot&&snapshot.phase.kind==='upgrade'&&command.choice!==undefined)command.upgrade=snapshot.phase.choices[command.choice];step(command);accumulator-=1/60;}}
   else if(paused)input?.sample(tuning.azimuth,tuning.elevation);
   if(snapshot){tuning.coreRadius=gameTuning.heroRadius;const alpha=frozen||paused?1:accumulator*60;applySnapshot(alpha);view.renderAt(Math.max(0,snapshot.tick-1+alpha));drawHUD();}
  }else{if(!frozen)tick+=delta*60;view.renderAt(tick);}
 }
 requestAnimationFrame(animate);
}
view.renderAt(tick);drawHUD();requestAnimationFrame(animate);
const readyPromise=makeStartup(app,()=>view.warmUp(),()=>{clearInput();accumulator=0;ready=true;lastTime=performance.now();});
if (import.meta.env.DEV) {
  void import('../ui/debug.css');
  const panel = document.createElement('aside'); panel.className = 'debug'; panel.hidden = true;
  panel.innerHTML = `<div class="debug-head"><b>Scene workbench</b><button aria-label="Close settings">×</button></div><p>Visual and combat tuning</p><nav>${scenes.map(s => `<a href="?scene=${s}">${s}</a>`).join('')}</nav>`;
  for (const key of Object.keys(defaults) as (keyof Tuning)[]) {
    const label = document.createElement('label'); label.textContent = key.replace(/[A-Z]/g, c => ` ${c.toLowerCase()}`);
    const input = document.createElement('input'); input.type = 'number'; input.step = key === 'particles' ? '1' : '0.05'; input.min = '0'; input.value = String(tuning[key]);
    if(playing&&key==='coreRadius'){input.disabled=true;label.title='Use hero radius in combat tuning below';}
    if (key === 'viewHeight' || key === 'stageHeight' || key === 'renderScale' || key === 'coreRadius') input.min = '0.1';
    if (key === 'coreSheen') input.max = '1';
    if (key === 'particles') input.max = String(defaults.particles);
    if(key==='coreStudioAzimuth'){input.min='-180';input.max='180';}
    if(key==='coreStudioElevation'){input.min='0';input.max='85';}
    if(key==='coreStudioHeight')input.min='1.3';
    if(key==='coreStudioWidth'||key==='coreStudioSquash'){input.min='.9';input.max='1.1';input.step='.005';}
    if(key==='coreExpression'){input.step='1';input.max='5';}
    if(key==='coreHeat'){input.step='1';input.max='2';}
    if(key==='coreBlade'){input.step='1';input.max='1';}
    if(key==='coreSheen'&&sceneName==='core-studio'){input.disabled=true;label.title='Reference-study reflections are authored in the candidate matcap.';}
    input.addEventListener('change', () => { const n = Number(input.value); if (!Number.isFinite(n) || !input.checkValidity()) return; tuning[key] = n; view.applyTuning(); }); label.append(input); panel.append(label);
  }
  if(playing)for(const key of Object.keys(combatDefaults) as (keyof CombatTuning)[]){
    const label=document.createElement('label');label.textContent=key.replace(/[A-Z]/g,c=>` ${c.toLowerCase()}`);
    const control=document.createElement('input');control.type='number';control.min=key==='sawletSpawnX'||key==='sawletSpawnZ'?'-23':'0';control.step=key.endsWith('Ticks')||key==='dashCharges'?'1':'0.01';control.value=String(gameTuning[key]);
    control.addEventListener('change',()=>{const candidate={...gameTuning,[key]:Number(control.value)};const valid=tuningSchema.safeParse(candidate);if(!valid.success)return;gameTuning=valid.data;pendingTuning={...gameTuning};});label.append(control);panel.append(label);
  }
  app.append(panel); app.querySelector('.settings')!.addEventListener('click', () => panel.hidden = !panel.hidden); panel.querySelector('button')!.addEventListener('click', () => panel.hidden = true);
  let benchmarkPeak={calls:0,triangles:0};let benchmarkEvents:Record<string,number>={};
  let benchmarkWork:{step:number[];render:number[];hud:number[]}={step:[],render:[],hud:[]};
  const api={
    ready:false,coreMask:(value:boolean)=>view.setCoreMask(value),setTick:(n:number)=>{frozen=true;if(playing){restart();for(let i=0;i<n;i++)step(idleCommand);applySnapshot(1);}tick=n;view.renderAt(n);drawHUD();},
    queueCommands:(commands:Command[])=>{queuedCommands?.splice(0,queuedCommands.length,...commands);frozen=false;paused=false;},state:()=>sim?.view(), advance:(commands:Command[])=>{frozen=true;for(const command of commands)step(command);view.renderAt(tick);drawHUD();return sim?.view();},
    restart:()=>{restart();frozen=false;}, replay:()=>({version:3,mode:trial?'trial':'run',tuning:recordingTuning,loadout:snapshot&&'loadout' in snapshot?snapshot.loadout:'core',commands:recording,final:sim?.view()}),
    play: () => { frozen = false; }, metadata: ()=>({...view.metadata(),benchmarkPeak,benchmarkEvents,benchmarkWork,fight:snapshot?{hp:snapshot.hero.hp,...('enemy' in snapshot?{enemyHP:snapshot.enemy.hp,enemyPhase:snapshot.enemy.behavior.kind}:{phase:snapshot.phase,enemies:snapshot.enemies.length,alive:snapshot.enemies.filter(e=>e.hp>0).length,projectiles:snapshot.projectiles.length}),charges:snapshot.hero.charges,heat:snapshot.hero.heat,overdrive:snapshot.hero.overdrive}:undefined}),
    measure: async (count: number, fixture?:Command[]) => {
      measuring = true; frozen = true; if(playing&&fixture){const parsed=tuningSchema.safeParse(fixture[0]?.tuning);if(parsed.success)gameTuning=parsed.data;restart();for(const command of fixture)step(command);}
      else if(playing){const base={...gameTuning};restart();if(!trial){
       step({x:0,z:0,dash:false,tuning:{...base,heroHP:10000,pulseDamage:1000,pulseRadius:60,pulseCooldownTicks:1}});
       for(let i=0;i<40;i++){if(snapshot&&'phase' in snapshot&&snapshot.phase.kind==='fight'&&snapshot.phase.wave===3)break;step(snapshot&&'phase' in snapshot&&snapshot.phase.kind==='upgrade'?{...idleCommand,upgrade:snapshot.phase.choices[0]}:{...idleCommand,ability:'pulse'});}
       step({...idleCommand,tuning:{...base,heroHP:10000}});
      }} benchmarkPeak={calls:0,triangles:0};benchmarkEvents={}; benchmarkWork={step:[],render:[],hud:[]}; const times: number[] = []; let previous = await new Promise<number>(resolve => requestAnimationFrame(resolve));
      try { for (let i = 0; i < count; i++) { const now = await new Promise<number>(resolve => requestAnimationFrame(resolve)); times.push(now - previous); previous = now; const start=performance.now(); if(playing){step(trial?(i<110?idleCommand:{x:1,z:0,dash:i===110||i===155}):{x:i%120<60?.4:-.4,z:.2,dash:i%70===0,ability:i%120===20?'pulse':i%140===40?'stomp':undefined,overdrive:i===80});for(const event of snapshot?.events??[])benchmarkEvents[event.kind]=(benchmarkEvents[event.kind]??0)+1;}else tick=i;const stepped=performance.now();view.renderAt(tick);const frame=view.frameBudget();benchmarkPeak.calls=Math.max(benchmarkPeak.calls,frame.calls);benchmarkPeak.triangles=Math.max(benchmarkPeak.triangles,frame.triangles);const rendered=performance.now();drawHUD();const finished=performance.now();benchmarkWork.step.push(stepped-start);benchmarkWork.render.push(rendered-stepped);benchmarkWork.hud.push(finished-rendered); } }
      finally { measuring = false; }
      return times;
    }
  };Object.assign(window,{__REDLINE__:api});void readyPromise.then(()=>{api.ready=true;});
} else { app.querySelector('.settings')?.remove(); }
