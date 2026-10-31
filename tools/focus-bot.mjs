import {createRunSimulation} from '../src/sim/run-runtime.ts';
import {combatDefaults as defaults} from '../src/content/combat.ts';
import {upgradedTuning} from '../src/content/upgrades.ts';
export function botCommand(s){
 const idle={x:0,z:0,dash:false};if(s.phase.kind==='upgrade'){const preferred=['bonk-power','pulse-power','pulse-recharge','max-hp','move-speed'];return{...idle,upgrade:preferred.find(id=>s.phase.choices.includes(id))??s.phase.choices[0]};}
 if(s.phase.kind!=='fight')return idle;
 const h=s.hero,t=upgradedTuning(defaults,s.upgrades),target=s.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-h.x,a.z-h.z)-Math.hypot(b.x-h.x,b.z-h.z))[0];if(!target)return idle;
 let dx=target.x-h.x,dz=target.z-h.z;const dist=Math.hypot(dx,dz),dot=dist?(-dx*target.faceX-dz*target.faceZ)/dist:0,armoured=target.kind==='shieldsaw'&&dot>=t.shieldFrontDot,locked=['windup','lunge','recover'].includes(target.behavior.kind);
 if(armoured&&locked&&dist<4){dx=target.x-target.faceX*1.1-h.x;dz=target.z-target.faceZ*1.1-h.z;}
 const threat=s.enemies.find(e=>{const b=e.behavior;if(e.hp<=0||b.kind!=='lunge'&&!(b.kind==='windup'&&b.remaining<=8))return false;const x=h.x-e.x,z=h.z-e.z,r=(e.kind==='shieldsaw'?.85:.67)+t.heroRadius,along=x*b.dx+z*b.dz,across=Math.abs(x*b.dz-z*b.dx);return along>=-.3&&along<3&&across<r;});
 const projectile=s.projectiles.find(p=>Math.hypot(p.x-h.x,p.z-h.z)<2);const dodge=!!threat||!!projectile||armoured&&locked&&dist<4;
 if((threat||projectile)&&!armoured){const aim=threat?.behavior.kind==='windup'||threat?.behavior.kind==='lunge'?threat.behavior:projectile;if(aim){dx=-aim.dz;dz=aim.dx;}}
 const length=Math.hypot(dx,dz),close=dist<.8;const ability=!armoured&&dist<t.pulseRadius+.4&&h.pulseCooldown===0?'pulse':dist<t.stompRadius+.5&&h.stompCooldown===0?'stomp':!dodge&&dist>4&&h.boostCooldown===0?'boost':undefined;
 return{x:!close||armoured?dx/(length||1):0,z:!close||armoured?dz/(length||1):0,dash:dodge&&h.charges>0,ability,overdrive:h.heat>=t.heatThreshold};
}
export function botRun(maxTicks=12000,tuning=defaults){const sim=createRunSimulation(tuning),commands=[],frames=[],gaps=[],last=new Map(),first=new Map();let s=sim.view();for(let i=0;i<maxTicks&&s.phase.kind!=='boss'&&s.phase.kind!=='lost';i++){const c=botCommand(s);commands.push(c);const before=s;s=sim.step(c);if(s.phase.kind==='fight'){if(!first.has(s.phase.wave)){first.set(s.phase.wave,s.tick);last.set(s.phase.wave,s.tick);}if(s.events.some(e=>e.kind==='bonk')){gaps.push({wave:s.phase.wave+1,ticks:s.tick-last.get(s.phase.wave)});last.set(s.phase.wave,s.tick);}}else if(before.phase.kind==='fight'&&s.events.some(e=>e.kind==='bonk'))gaps.push({wave:before.phase.wave+1,ticks:s.tick-last.get(before.phase.wave)});frames.push(s);}return{commands,frames,state:s,gaps};}
if(process.argv[1]?.endsWith('/focus-bot.mjs')){const run=botRun();console.log({phase:run.state.phase.kind,hp:run.state.hero.hp,seconds:run.state.tick/60,maxGaps:[1,2,3,4].map(w=>[w,Math.max(0,...run.gaps.filter(g=>g.wave===w).map(g=>g.ticks))/60])});}
