import {makeRewardHUD} from '../ui/r4-feedback.ts';
import '../ui/r4-feedback.css';
import {difficultyTuning,difficulties} from '../content/r3-difficulty.ts';
import {makeEnemyBars} from '../ui/r2-health.ts';
import '../ui/r2-health.css';
import {installGameShell} from '../ui/p4-shell.ts';
import {qName} from '../content/items/p2-equipment.ts';
import {coreTurntablePose} from '../presentation/p1-core-polish.ts';
import {makeMissionSelect} from '../ui/mission-select.ts';
import {makeWorkshop} from '../ui/workshop.ts';
import {makeProfileControls} from '../ui/profile-controls.ts';
import {profileSchema,recordMission} from '../content/profile.ts';
import {AudioManager} from '../audio/AudioManager.ts';
import {makeAudioControls} from '../ui/audio-controls.ts';
import {makeCueBus} from '../presentation/cue-bus.ts';
import {makeQualityMonitor} from '../presentation/quality-monitor.ts';
import {makeStyleHUD} from '../ui/s4-feedback.ts';
import {levelTwist,twistNames} from '../content/items/s4-additions.ts';
import {makePadActivity} from '../input/f2-pad-activity.ts';
import {makeObjectiveHUD} from '../ui/f1-objectives.ts';
import {levelGoals} from '../content/items/f1-objectives.ts';
import {makeRunResults} from '../ui/f5-results.ts';
import {gamepadFamily,makeDeviceHints} from '../ui/f2-device-hints.ts';
import {defaultBindings,matchesBinding} from '../content/items/f2-bindings.ts';
import {updateHeatTicks} from '../ui/ui2-heat.ts';
import {integrityReadout,upgradeCard,upgradeRarity,makeBuildStrip} from '../ui/f4-upgrades.ts';
import {makeBossGuide,phaseBarMarkup} from '../ui/f3-boss-guide.ts';
import {makeScoreDisplay} from '../ui/b6-score.ts';
import {makeAbilityNames} from '../ui/b4-ability-names.ts';
import {updateClarityHUD} from '../ui/cl-clarity.ts';
import {makeRosterHints} from '../ui/b2-roster-hints.ts';
import {makeQualityCallouts} from '../ui/b1-quality-callouts.ts';
import {makeRepairPop} from '../ui/q3-repair-pop.ts';
import {makeFeelHUD} from '../ui/feel-hud.ts';
import {bossStage} from '../content/boss.ts';
import {makeStartup} from '../ui/startup.ts';
import {makeEncounterBanner} from '../ui/encounter-banner.ts';
import {loadPreferences,savePreferences} from '../save/preferences.ts';
import {makePreferences} from '../ui/preferences.ts';
import {loadProfileFallback,saveProfile,applySavedSettings} from '../save/profile.ts';
import {awardBlade,equipProfile} from '../content/profile.ts';
import {runSchema} from '../sim/run-schema.ts';
import {createRunSimulation} from '../sim/run-runtime.ts';
import {upgradedTuning} from '../content/upgrades.ts';
import { makeScene, type SceneName, type Tuning } from '../presentation/scene.ts';
import { defaults, scenes } from '../content/scene.mjs';
import {createSimulation} from '../sim/runtime.ts';
import {makeZoomControls} from '../ui/zoom-controls.ts';
import {makeInput} from '../input/devices.ts';
import {combatDefaults,tuningSchema,type CombatTuning} from '../content/combat.ts';
import {idleCommand,type Command} from '../sim/schema.ts';
import '../ui/style.css';
import '../ui/round3-legibility.css';
import '../ui/p4-plates.css';
import '../ui/r1-rounded.css';

let profile=await loadProfileFallback();applySavedSettings(profile);
let saveAvailable=true;
const params = new URLSearchParams(location.search);
const requested = params.get('scene') ?? 'lobby';
const sceneName = (requested==='core-turntable'?'core-studio':scenes.includes(requested) ? requested : 'lobby') as SceneName;
const trial=params.has('trial');const selectedMission=params.has('mission')?Math.max(0,Math.min(3,Number(params.get('mission'))||0)):undefined,runOptions={mission:selectedMission,seed:Number(params.get('seed')??4107)>>>0,difficulty:profile.difficulty,lowSpec:false,director:true};
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
<section class="loadout-panel" aria-label="Equip form"><span class="eyebrow">LOADOUT</span><div><button data-equip="core">Core</button><button data-equip="blade">Blade · Locked</button></div><small class="save-status"></small></section><div class="preview-note">CHAPTER 01 · 3 LEVELS → SCRAP-REX</div>` : `
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
const cues=makeCueBus(import.meta.env.DEV&&params.has('cues')),audio=new AudioManager(),audioControls=makeAudioControls(app,audio);cues.subscribe(cue=>audio.cue({...cue,pan:cue.id.startsWith('ui_')?0:view.soundPan(cue.x,cue.z)}));audio.onBeat(()=>{if(!preferences.reducedFlashes&&!preferences.reducedMotion){app.animate([{filter:'brightness(1.025)'},{filter:'brightness(1)'}],{duration:140});}});addEventListener('redline-audio-settings',()=>{profile={...profile,settings:{...profile.settings,audio:{...audio.settings}}};saveProfile(profile);});app.addEventListener('click',e=>{if(e.target instanceof Element&&e.target.closest('button,a'))cues.send(e.target.closest('[data-equip]')?'ui_confirm':'ui_move',Math.floor(performance.now()/16.666));});
if(studio){makeMissionSelect(app,()=>profile,id=>{profile={...profile,lastMission:id};saveProfile(profile);});makeProfileControls(app,()=>profile);}
const tuning: Tuning = { ...defaults };
if(requested==='core-turntable'){const pose=coreTurntablePose(params.get('pose'));Object.assign(tuning,{coreStudioAzimuth:pose.azimuth,coreStudioElevation:pose.elevation,coreExpression:Math.min(5,Math.max(0,Number(params.get('expression')??0))),coreHeat:Math.min(2,Math.max(0,Number(params.get('heat')??0))),coreBlade:params.get('blade')==='1'?1:0});const nav=document.createElement('nav');nav.className='turntable-poses';nav.setAttribute('aria-label','Core turntable views');for(const pose of ['front','quarter','side','top']){const a=document.createElement('a');a.href=`?scene=core-turntable&pose=${pose}`;a.textContent=pose;nav.append(a);}app.append(nav);}
const view = makeScene(app.querySelector('canvas')!, sceneName, tuning);
const resize = () => view.resize(innerWidth, innerHeight); addEventListener('resize', resize); resize();
let preferences=loadPreferences();runOptions.lowSpec=preferences.quality==='low';app.dataset.reducedMotion=String(preferences.reducedMotion);app.dataset.reducedFlashes=String(preferences.reducedFlashes);view.setPreferences(preferences);installGameShell(app,()=>preferences.reducedMotion);
const difficultyLabel=document.createElement('label');difficultyLabel.className='difficulty-setting';difficultyLabel.innerHTML='<span>Difficulty · next run<small>Chill10/3 · Normal14/4 · Redline20/5 live/attackers. Starting on Low uses10/3; changing graphics does not rewrite a current replay.</small></span><select name="difficulty" aria-label="Difficulty"><option value="chill">Chill</option><option value="normal">Normal</option><option value="redline">Redline</option></select>';const difficultyField=difficultyLabel.querySelector('select')!;difficultyField.value=profile.difficulty;difficultyField.addEventListener('change',()=>{const chosen=difficulties.find(d=>d===difficultyField.value);if(chosen){profile={...profile,difficulty:chosen};saveProfile(profile);}});queueMicrotask(()=>app.querySelector('.options-dialog header')?.after(difficultyLabel));
const qualityMonitor=makeQualityMonitor(),qualityToast=document.createElement('p');qualityToast.className='quality-toast';qualityToast.hidden=true;qualityToast.setAttribute('role','status');app.append(qualityToast);let toastUntil=0;
let ready=false;
let measuring = false;
let tick = playing ? 0 : 120; let frozen = params.has('capture') || (!playing && preferences.reducedMotion); let lastTime = performance.now();
let gameTuning:CombatTuning={...combatDefaults};
const makeGame=()=>trial?createSimulation(gameTuning,import.meta.env.DEV):createRunSimulation(gameTuning,import.meta.env.DEV,profile.equipped,runOptions);
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
 view.setLoadout(profile.equipped);const q=app.querySelector('.loadout-q');if(q){q.textContent=qName(profile.equipped);app.querySelector('.loadout-q-detail')!.textContent=profile.equipped==='blade'?'3-hit whirlwind · 2 s':'Radial shock burst · 2 s';}app.querySelector('.scene-title small')!.textContent=profile.equipped==='blade'?'BLADE EQUIPPED':'BASE FORM';app.querySelector('.pilot>div>span')!.textContent=profile.equipped==='blade'?'VIOLET CHROME · BLADE':'VIOLET CHROME · BASE FORM';app.querySelector('.chapter-meta b')!.textContent=profile.equipped.toUpperCase();
}
if(studio){for(const form of ['core','blade'] as const)app.querySelector(`[data-equip=${form}]`)!.addEventListener('click',()=>{profile=equipProfile(profile,form);saveAvailable=saveProfile(profile);refreshLoadout();});refreshLoadout();if(sceneName==='workshop')makeWorkshop(app,()=>profile,form=>{profile=equipProfile(profile,form);saveAvailable=saveProfile(profile);refreshLoadout();view.snapLoadout();},patch=>{const parsed=profileSchema.safeParse({...profile,cosmetics:{...profile.cosmetics,...patch}});if(parsed.success){profile=parsed.data;saveProfile(profile);view.setCosmetics(profile.cosmetics);}});}
view.setCosmetics(profile.cosmetics);
function effectiveTuning(){return snapshot&&'upgrades'in snapshot?upgradedTuning(difficultyTuning(gameTuning,snapshot.rules,snapshot.director.pressure),snapshot.upgrades):gameTuning;}
function applySnapshot(alpha:number){if(!snapshot)return;if('enemies' in snapshot)view.applyRun(snapshot,alpha,effectiveTuning());else view.applyFight(snapshot,alpha,gameTuning);}
function restart(){if(!playing)return;cues.reset();qualityMonitor.reset();runOptions.difficulty=profile.difficulty;runOptions.lowSpec=preferences.quality==='low';sim=makeGame();snapshot=sim.view();cancelChargeOnResume=false;paused=false;accumulator=0;tick=0;lastTime=performance.now();view.reset();resetHUD();queuedCommands?.splice(0);recordingTuning={...gameTuning};recording?.splice(0);clearInput();applySnapshot(1);drawHUD();}
function togglePause(){if(!playing||options.isOpen()||snapshot&&'phase' in snapshot&&['lost','complete'].includes(snapshot.phase.kind))return;paused=!paused;clearInput();accumulator=0;drawHUD();}
function step(command:Command){if(!sim)return;if(cancelChargeOnResume){command={...command,dashInput:'cancel'};cancelChargeOnResume=false;}const wasLastStand=(snapshot?.hero.hp??100)<effectiveTuning().heroHP*.2;const oldPhase=snapshot&&'phase'in snapshot?snapshot.phase.kind:'';const wasBoss=snapshot&&'phase' in snapshot&&snapshot.phase.kind==='boss',oldBossStage=snapshot&&'phase' in snapshot&&snapshot.phase.kind==='boss'?bossStage(snapshot.phase.boss.hp,gameTuning):0;const intent=pendingTuning?{...command,tuning:pendingTuning}:command;pendingTuning=undefined;if(intent.tuning){const parsed=tuningSchema.safeParse(intent.tuning);if(parsed.success)gameTuning=parsed.data;}snapshot=sim.step(intent);cues.update(snapshot,effectiveTuning().heroHP);if(!wasLastStand&&snapshot.hero.hp>0&&snapshot.hero.hp<effectiveTuning().heroHP*.2)requestSlow(.2,.65);if(command.upgrade)cues.send('upgrade_pick',snapshot.tick);if(preferences.rumble!==false&&snapshot.events.some(e=>e.kind==='hurt'||e.kind==='bonk'&&e.amount>=14)){const pad=Array.from(navigator.getGamepads?.()??[]).find(p=>p?.connected);void pad?.vibrationActuator?.playEffect('dual-rumble',{duration:65,strongMagnitude:.25,weakMagnitude:.12}).catch(()=>{});}if(command.ability)cooldownPeek[command.ability]=snapshot.tick+30;if(oldBossStage&&'phase' in snapshot&&snapshot.phase.kind==='boss'&&bossStage(snapshot.phase.boss.hp,gameTuning)>oldBossStage&&!preferences.reducedMotion)requestSlow(tuning.bossSlowSeconds,tuning.bossSlowScale);if(snapshot.events.some(e=>e.label==='PERFECT'))requestSlow(.15,.3);if(snapshot.events.some(e=>e.kind==='overdrive'))requestSlow(tuning.overdriveEntrySeconds,tuning.overdriveEntryScale);if(snapshot.events.some(e=>e.kind==='defeat')&&(!('enemies'in snapshot)||snapshot.enemies.every(e=>e.hp<=0))&&snapshot.events.some(e=>e.kind==='bonk'&&e.amount>=14||['pulse','blade','stomp'].includes(e.kind)))requestSlow(tuning.killSlowSeconds,tuning.killSlowScale);if(wasBoss&&'phase' in snapshot&&snapshot.phase.kind==='complete'&&snapshot.phase.reward==='blade'){profile=equipProfile(awardBlade(profile),'blade');saveAvailable=saveProfile(profile);}if('phase'in snapshot&&snapshot.phase.kind!==oldPhase){if(snapshot.phase.kind==='level-complete')profile=recordMission(profile,snapshot.phase.level,snapshot.phase.score,snapshot.phase.stars);if(snapshot.phase.kind==='complete'&&snapshot.phase.reward==='blade')profile=recordMission(profile,3,snapshot.score.points,1+Number(snapshot.hero.hp>=25)+Number(snapshot.quality.perfectDodges>=3));const day=params.get('daily');if(day&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&['lost','complete','level-complete'].includes(snapshot.phase.kind)){profile={...profile,daily:{...profile.daily,[day]:Math.max(profile.daily[day]??0,snapshot.score.points)}};const days=Object.keys(profile.daily).sort();for(const d of days.slice(0,-90))delete profile.daily[d];}saveAvailable=saveProfile(profile);}recording?.push(intent);if(recording&&recording.length>36000)recording.shift();applySnapshot(1);tick=snapshot.tick;}
const options=makePreferences(app,preferences,()=>{if(playing){paused=true;clearInput();accumulator=0;drawHUD();}},next=>{preferences=next;app.dataset.reducedMotion=String(next.reducedMotion);app.dataset.reducedFlashes=String(next.reducedFlashes);if(!playing&&!params.has('capture'))frozen=next.reducedMotion;view.setPreferences(next);const saved=savePreferences(next);saveProfile(profile);return saved;});
const deviceHints=makeDeviceHints(app,()=>preferences.bindings??defaultBindings);
if(playing)makeZoomControls(app,app.querySelector('canvas')!,()=>preferences.zoom,zoom=>{preferences={...preferences,zoom};options.setZoom(zoom);view.setPreferences(preferences);savePreferences(preferences);saveProfile(profile);},()=>!options.isOpen(),()=>preferences.bindings??defaultBindings);
if(playing){
 const rosterHints=makeRosterHints(app);const banner=makeEncounterBanner(app);
 app.classList.add('live');app.querySelector('.health-label span')!.textContent='INTEGRITY';
 app.querySelector('.combat-label small')!.textContent='MOVE CLOSE TO AUTO-BONK';
 app.querySelector('.combat-label span')!.textContent='FIRST CONTACT';
 app.querySelector('.fight-note')!.textContent='WASD · SPACE DASH · Q / E / X · P PAUSE';

 const abilities=app.querySelector<HTMLElement>('.abilities')!;abilities.setAttribute('aria-label','Combat abilities');
 abilities.innerHTML=`${(['pulse','boost','stomp'] as const).map((name,i)=>`<button class="ability skill ${name}" data-ability="${name}" aria-label="${['Pulse Bash','Boost Burst','Stomp'][i]}">${icon(name)}<small>${['Q','E','X'][i]}</small><b></b></button>`).join('')}<button class="ability dash live-dash" aria-label="Dash">${icon('boost')}<small>DASH</small></button><button class="overdrive-button" data-overdrive aria-label="Activate Overdrive">R · OVERDRIVE</button><div class="dash-charges"><i></i><i></i></div><span class="charge-label">2 / 2</span>`;
 const announcement=document.createElement('div');announcement.className='sr-only';announcement.setAttribute('role','status');announcement.setAttribute('aria-live','polite');app.append(announcement);let lastAnnouncement='';
 const pause=document.createElement('button');pause.className='pause';pause.setAttribute('aria-label','Pause fight');pause.textContent='Ⅱ';app.append(pause);pause.addEventListener('click',togglePause);
 const enemyBars=makeEnemyBars(app);
 const bossGuide=makeBossGuide(app,()=>{paused=true;clearInput();accumulator=0;},()=>{paused=false;clearInput();accumulator=0;});
 const bossBar=document.createElement('section');bossBar.className='boss-health';bossBar.hidden=true;bossBar.innerHTML='<span>SCRAP-REX</span><b></b><div><i></i>'+phaseBarMarkup()+'</div>';app.append(bossBar);
 const hp=document.createElement('div');hp.className='enemy-health';hp.setAttribute('aria-hidden','true');hp.innerHTML='<i></i>';app.append(hp);
 const overlay=document.createElement('section');overlay.className='fight-overlay';overlay.hidden=true;overlay.innerHTML='<span class="eyebrow">THE FOUNDRY</span><h1></h1><p></p><div class="upgrade-choices"></div><small class="upgrade-hint"></small><button class="resume">Resume</button><button class="retry">Fight again</button><a class="equip-reward" href="?scene=lobby">Equip Blade</a><a href="?scene=lobby">Return to lobby</a>';app.append(overlay);
 overlay.querySelector('.resume')!.addEventListener('click',togglePause);overlay.querySelector('.retry')!.addEventListener('click',restart);
 addEventListener('keydown',event=>{if(event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,[contenteditable=true]'))return;if(!paused&&snapshot&&'phase' in snapshot&&snapshot.phase.kind==='upgrade'&&(['choose1','choose2','choose3'] as const).some(a=>matchesBinding(event.code,a,preferences.bindings??defaultBindings))){event.preventDefault();const id=snapshot.phase.choices[(['choose1','choose2','choose3'] as const).findIndex(a=>matchesBinding(event.code,a,preferences.bindings??defaultBindings))];step({x:0,z:0,dash:false,upgrade:id});clearInput();drawHUD();}});
 const dash=abilities.querySelector<HTMLElement>('.dash')!;input=makeInput(app.querySelector<HTMLElement>('.study-stick')!,dash,togglePause,restart,()=>preferences.bindings??defaultBindings,deviceHints.use,()=>preferences.deadzone??.2);
 addEventListener('blur',()=>{clearInput();paused=true;accumulator=0;drawHUD();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();paused=true;accumulator=0;drawHUD();}});
 const rewardHUD=makeRewardHUD(app,requestSlow,(id,tick)=>cues.send(id,tick));
 const styleHUD=makeStyleHUD(app);const runResults=makeRunResults(overlay,app.querySelector('canvas')!),buildStrip=makeBuildStrip(app.querySelector('.health')!,overlay),scoreDisplay=makeScoreDisplay(app),abilityNames=makeAbilityNames(app),qualityCallouts=makeQualityCallouts(app),repairPop=makeRepairPop(app),feelHUD=makeFeelHUD(app);const objectiveHUD=makeObjectiveHUD(app,overlay,()=>{step({x:0,z:0,dash:false,continue:true});clearInput();drawHUD();});let lastResult='';
 resetHUD=()=>{rewardHUD.reset();enemyBars.reset();feelHUD.reset();bossGuide.reset();repairPop.reset();qualityCallouts.reset();abilityNames.reset();scoreDisplay.reset();buildStrip.reset();runResults.reset();objectiveHUD.reset();cooldownPeek.pulse=cooldownPeek.boost=cooldownPeek.stomp=-1;slowUntil=0;slowScale=1;banner.reset();lastResult='';lastAnnouncement='';};
 drawHUD=()=>{if(!snapshot)return;const h=snapshot.hero,config=effectiveTuning(),run='enemies' in snapshot?snapshot:null,e='enemy' in snapshot?snapshot.enemy:null;
  updateClarityHUD(app,snapshot);rosterHints?.setPaused(paused);const isBoss=run?.phase.kind==='boss';bossGuide.update(isBoss);bossBar.hidden=!isBoss;if(isBoss&&run?.phase.kind==='boss'){const hp=run.phase.boss.hp;bossBar.querySelector('span')!.textContent=`SCRAP-REX · PHASE ${bossStage(hp,config)}${run.phase.boss.exposed>0?' · EXPOSED':''}`;bossBar.querySelector('b')!.textContent=`${Math.ceil(hp)} / ${config.bossHP}`;bossBar.querySelector<HTMLElement>('i')!.style.width=`${hp/config.bossHP*100}%`;}
  app.querySelector('.roster span')!.textContent=run?.loadout==='blade'?'BLADE EQUIPPED':'BASE FORM';
  const qButton=abilities.querySelector<HTMLElement>('[data-ability=pulse]')!;const form=run?.loadout??'core';qButton.setAttribute('aria-label',qName(form));if(qButton.dataset.form!==form){qButton.querySelector('svg')!.outerHTML=icon(form==='blade'?'blade':'pulse');qButton.dataset.form=form;}
  const result=h.hp<=0?'lost':run?(run.phase.kind==='complete'?'won':run.phase.kind==='upgrade'?'upgrade':run.phase.kind==='level-complete'?'level-complete':'fighting'):e?.behavior.kind==='defeated'?'won':'fighting';app.dataset.result=result;
  const label=app.querySelector<HTMLElement>('.health-label b')!;label.textContent=integrityReadout(h.hp,config.heroHP);label.setAttribute('aria-label',`${Math.round(h.hp/config.heroHP*100)} percent integrity`);
  app.querySelector<HTMLElement>('.health-track i')!.style.width=`${h.hp/config.heroHP*100}%`;
  abilities.querySelector('.charge-label')!.textContent=`${h.charges} / ${config.dashCharges}`;
  const chargeRoot=abilities.querySelector('.dash-charges')!;if(chargeRoot.children.length!==config.dashCharges)chargeRoot.innerHTML='<i></i>'.repeat(config.dashCharges);
  abilities.querySelectorAll<HTMLElement>('.dash-charges i').forEach((dot,i)=>dot.classList.toggle('ready',i<h.charges));
  dash.setAttribute('aria-disabled',String(h.charges===0&&h.overdrive===0||h.dashCooldown>0&&h.tapWindow===0));dash.classList.toggle('charging',h.dash.kind==='charging');dash.style.setProperty('--charge',`${h.dash.kind==='charging'?Math.min(1,h.dash.ticks/config.dashChargeTicks):0}`);dash.style.setProperty('--recharge',`${h.recharge/config.rechargeTicks*360}deg`);
  for(const name of ['pulse','boost','stomp'] as const){const button=abilities.querySelector<HTMLElement>(`[data-ability="${name}"]`)!;const remaining=h[`${name}Cooldown`];button.setAttribute('aria-disabled',String(remaining>0));const total=name==='pulse'?(run?.loadout==='blade'?config.bladeCooldownTicks:config.pulseCooldownTicks):name==='boost'?config.boostCooldownTicks:config.stompCooldownTicks;button.style.setProperty('--cd',`${Math.min(1,remaining/total)*360}deg`);button.querySelector('b')!.textContent=remaining>0&&(remaining<=60||snapshot.tick<=cooldownPeek[name])?String(Math.ceil(remaining/60)):'';}
  const od=abilities.querySelector<HTMLElement>('[data-overdrive]')!;od.setAttribute('aria-disabled',String(h.heat<gameTuning.heatThreshold||h.overdrive>0));od.textContent=h.overdrive>0?`OVERDRIVE ${Math.ceil(h.overdrive/60)}s`:'R · OVERDRIVE';
  const heat=app.querySelector<HTMLElement>('.heat')!;heat.children[0].textContent=h.overdrive>0?'OVERDRIVE':'HEAT';(heat.children[1] as HTMLElement).style.setProperty('--heat-angle',`${h.heat/gameTuning.heatThreshold*360}deg`);heat.children[2].textContent=`${Math.round(h.heat/gameTuning.heatThreshold*100)}%`;updateHeatTicks(heat,h.heat/gameTuning.heatThreshold,h.overdrive>0,preferences.reducedFlashes);
  if(run){const phase=run.phase;app.querySelector('.combat-label span')!.textContent=phase.kind==='fight'||phase.kind==='upgrade'?`WAVE ${phase.wave+1} / 4`:phase.kind==='boss'?'SCRAP-REX':'FOUNDRY';app.querySelector('.combat-label small')!.textContent=`${run.enemies.filter(e=>e.hp>0).length} ENEMIES · ${run.upgrades.length} UPGRADES`;enemyBars.update(run,config,view.runScreens(),view.numberScreens(),result!=='fighting');}
  hp.hidden=!!run||result!=='fighting';const point=view.enemyScreen();hp.style.transform=`translate(${point.x}px,${point.y}px)`;hp.querySelector<HTMLElement>('i')!.style.width=`${Math.max(0,e?.hp??0)/gameTuning.sawletHP*100}%`;
  overlay.hidden=!paused&&result==='fighting';overlay.setAttribute('role','region');overlay.setAttribute('aria-label',paused?'Paused':result==='upgrade'?'Choose an upgrade':result==='won'?'Victory':'Defeat');overlay.querySelector('h1')!.textContent=paused?'Paused':result==='upgrade'?'Choose an upgrade':result==='won'?(run?run.phase.kind==='complete'&&run.phase.reward==='blade'?'Scrap-Rex defeated.':'Mission cleared.':'Sawlet down.'):'Core offline.';
  overlay.querySelector('p')!.textContent=paused?'Take a breath.':result==='upgrade'?'Choose one. Your next wave starts when you’re ready.':result==='won'?(run?run.phase.kind==='complete'&&run.phase.reward==='blade'?`Blade unlocked. Chapter 2 · Coming soon.${saveAvailable?'':' Local saving unavailable.'}`:'Mission complete. Stars and best score saved on this device.':'First contact complete. Ready for another round?'):'Watch the warning, then dash through the attack.';
  overlay.querySelector<HTMLElement>('.resume')!.hidden=!paused;overlay.querySelector<HTMLElement>('.retry')!.hidden=paused||result==='upgrade';
  const choiceRoot=overlay.querySelector<HTMLElement>('.upgrade-choices')!;const choices=run?.phase.kind==='upgrade'?run.phase.choices:[];choiceRoot.hidden=paused||result!=='upgrade';overlay.querySelector('.upgrade-hint')!.textContent=result==='upgrade'?'1 / 2 / 3 · GAMEPAD A / B / Y':'';
  const signature=choices.join(',');if(choiceRoot.dataset.choices!==signature){choiceRoot.dataset.choices=signature;choiceRoot.replaceChildren();choices.forEach((id,i)=>{const button=document.createElement('button');button.className='upgrade-card';button.dataset.rarity=upgradeRarity(id);button.innerHTML=upgradeCard(id,i,config,run?.loadout==='blade');button.addEventListener('click',()=>{step({x:0,z:0,dash:false,upgrade:id});clearInput();drawHUD();});choiceRoot.append(button);});}
  overlay.querySelector<HTMLElement>('.equip-reward')!.hidden=paused||result!=='won'||!run||run.phase.kind!=='complete'||run.phase.reward!=='blade'||!saveAvailable;
  pause.setAttribute('aria-label',paused?'Resume fight':'Pause fight');pause.textContent=paused?'▶':'Ⅱ';
  if('score' in snapshot){styleHUD.update(snapshot,preferences,config.heroHP);scoreDisplay.update(snapshot,preferences.reducedMotion);buildStrip.update(snapshot,paused);runResults.update(snapshot,config,levelGoals.reduce((a,b)=>a+b,0),paused);}abilityNames.update(snapshot.tick,snapshot.events);qualityCallouts.update(snapshot.tick,snapshot.events,preferences.reducedMotion);repairPop.update(snapshot.tick,snapshot.events);feelHUD.update(snapshot,preferences,config,paused||result!=='fighting');
  const phaseKey=run?.phase.kind==='fight'?`level-${run.objective.level}-wave-${run.objective.levelWave}`:run?.phase.kind==='boss'?`boss-${bossStage(run.phase.boss.hp,config)}`:run?.phase.kind??'trial';banner.update({slideSeconds:tuning.bannerSeconds,tick:snapshot.tick,phase:phaseKey,title:run?.phase.kind==='fight'?`LEVEL ${run.objective.level+1} · WAVE ${run.objective.levelWave+1}`:run?.phase.kind==='boss'?`SCRAP-REX · ${bossStage(run.phase.boss.hp,config)===4?'ENRAGED':`PHASE ${bossStage(run.phase.boss.hp,config)}`}`:'First contact',subtitle:run?.phase.kind==='boss'?'Watch the charge lane and sweep gap':run?.phase.kind==='fight'?`${twistNames[levelTwist(run.extras.seed,run.objective.level)]} · ${run.enemies.filter(e=>e.hp>0).length} enemies`:'Move close to auto-bonk',overdrive:h.overdrive>0,hidden:paused||result!=='fighting',reducedMotion:preferences.reducedMotion});
  if(!app.querySelector<HTMLElement>('.encounter-banner')!.hidden)app.querySelector<HTMLElement>('.streak')!.hidden=true;
  const notice=paused?'Paused':result==='won'?(run?'Foundry cleared. Blade unlocked.':'Sawlet defeated.'):result==='lost'?'Core offline. Retry available.':result==='upgrade'?'Wave cleared. Choose one of three upgrades.':run?.phase.kind==='boss'?'Scrap-Rex. Boss encounter.':run?.phase.kind==='fight'?`Level ${run.objective.level+1}. Wave ${run.objective.levelWave+1}. Target ${levelGoals[run.objective.level]} points.`:'First contact.';if(run){objectiveHUD.update(run,paused,config);view.cinematicPause(paused||options.isOpen());rewardHUD.update(run,view.spectacle(),preferences,overlay,paused);}deviceHints.update(h.overdrive>0);if(notice!==lastAnnouncement){announcement.textContent=notice;lastAnnouncement=notice;}
  if(result!==lastResult){if(!paused){if(result==='upgrade')choiceRoot.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true});else if(result==='won'||result==='lost')overlay.querySelector<HTMLButtonElement>('.retry')!.focus({preventScroll:true});}lastResult=result;app.setAttribute('aria-label',result==='won'?(run?'Foundry cleared. Blade unlocked.':'Sawlet defeated'):result==='lost'?'Core offline':'Foundry fight');}
 };
 applySnapshot(1);
}
const lobbyPadActivity=makePadActivity();
function animate(time:number){audio.tick();audioControls.update();audio.setScene(playing?(snapshot&&'phase'in snapshot&&snapshot.phase.kind==='boss'?'boss':snapshot&&'phase'in snapshot&&['complete','lost'].includes(snapshot.phase.kind)?'results':'battle'):'theme',paused||options.isOpen());
 if(!playing){const pad=Array.from(navigator.getGamepads?.()??[]).find(p=>p?.connected);if(lobbyPadActivity(pad??undefined)&&pad)deviceHints.use(gamepadFamily(pad.id));deviceHints.update(false);}
 if(time>=slowUntil)slowScale=1;
 const delta=Math.min((time-lastTime)/1000,.1);lastTime=time;
 if(!measuring&&ready){const nextTier=qualityMonitor.sample(delta*1000,!paused&&!document.hidden,preferences.qualityMode,preferences.quality);if(nextTier){preferences={...preferences,quality:nextTier};view.setPreferences(preferences);options.setQuality(preferences);savePreferences(preferences);qualityToast.textContent=`Graphics adjusted to ${nextTier} for smoother play`;qualityToast.hidden=false;toastUntil=time+4000;}if(time>toastUntil)qualityToast.hidden=true;
  if(playing&&sim){
   if(!frozen&&!paused&&!options.isOpen()&&!(snapshot&&'phase' in snapshot&&snapshot.phase.kind==='lost')){accumulator=Math.min(.1,accumulator+delta*(time<slowUntil?slowScale:1));while(accumulator>=1/60){const command=queuedCommands?.shift()??input!.sample(tuning.azimuth,tuning.elevation);if(paused)break;if(snapshot&&'phase' in snapshot&&snapshot.phase.kind==='upgrade'&&command.choice!==undefined)command.upgrade=snapshot.phase.choices[command.choice];step(command);accumulator-=1/60;}}
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
    ready:false,audio:()=>audio.metadata(),profile:()=>profile,restoreFixture:(state:unknown,config:unknown)=>{if(!playing||trial)throw new Error('Run fixture requires a run scene');const data=runSchema.parse(state);gameTuning=tuningSchema.parse(config);restart();const saved=sim!.snapshot();if(!saved.ok)throw new Error('Fixture snapshot failed');const restored=sim!.restore({...saved.value,resources:{...saved.value.resources,'Redline/Run':data}});if(!restored.ok)throw new Error('Fixture restore failed');snapshot=sim!.view();frozen=true;tick=snapshot.tick;applySnapshot(1);view.renderAt(tick);drawHUD();},coreMask:(value:boolean)=>view.setCoreMask(value),setTick:(n:number)=>{frozen=true;if(playing){restart();for(let i=0;i<n;i++)step(idleCommand);applySnapshot(1);}tick=n;view.renderAt(n);drawHUD();},
    queueCommands:(commands:Command[])=>{queuedCommands?.splice(0,queuedCommands.length,...commands);frozen=false;paused=false;},state:()=>sim?.view(), advance:(commands:Command[])=>{frozen=true;for(const command of commands)step(command);view.renderAt(tick);drawHUD();return sim?.view();},
    restart:()=>{restart();frozen=false;}, replay:()=>({version:4,mode:trial?'trial':'run',options:runOptions,tuning:recordingTuning,loadout:snapshot&&'loadout' in snapshot?snapshot.loadout:'core',commands:recording,final:sim?.view()}),
    play: () => { frozen = false; }, metadata: ()=>({...view.metadata(),benchmarkPeak,benchmarkEvents,benchmarkWork,fight:snapshot?{hp:snapshot.hero.hp,...('enemy' in snapshot?{enemyHP:snapshot.enemy.hp,enemyPhase:snapshot.enemy.behavior.kind}:{phase:snapshot.phase,enemies:snapshot.enemies.length,alive:snapshot.enemies.filter(e=>e.hp>0).length,inView:view.runScreens().filter(p=>p.inView).length,projectiles:snapshot.projectiles.length}),charges:snapshot.hero.charges,heat:snapshot.hero.heat,overdrive:snapshot.hero.overdrive}:undefined}),
    measure: async (count: number, fixture?:Command[], preserve=false) => {
      measuring = true; frozen = true; if(playing&&fixture){const parsed=tuningSchema.safeParse(fixture[0]?.tuning);if(parsed.success)gameTuning=parsed.data;restart();for(const command of fixture)step(command);}
      else if(playing&&!preserve){const base={...gameTuning};restart();if(!trial){
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
