import {Ops} from '@typeonce/ritmo';import type {Boss,RunState} from './run-schema.ts';import {spawnRunEnemy} from './run-schema.ts';import type {CombatTuning} from '../content/combat.ts';import type {Emit} from './hero.ts';import {collide,direction} from './geometry.ts';import {addBogPool} from './bog-combat.ts';
const patterns={1:['leap','tongue','gulp'],2:['drum','leap','tongue','gulp'],3:['flood','leap','drum','gulp','tongue'],4:['double-leap','gulp','drum','tongue','flood','leap']} as const;
export function stepGulp(b:Boss,s:RunState,t:CombatTuning,hurt:(amount:number,attack?:string)=>void,event:Emit){
 const r=b.gulp!,h=s.hero,ratio=b.hp/(b.maxHP??t.gulpHP),phase=ratio>.7?1:ratio>.4?2:ratio>.2?3:4;const damage=t.gulpDamage*(s.rules.difficulty==='chill'?.75:s.rules.difficulty==='redline'?1.18:1);r.phase=phase;r.elapsed++;r.remaining=Math.max(0,r.remaining-1);if(b.exposed>0)b.exposed--;b.behavior={kind:'recover',remaining:r.remaining};
 const distance=(p:{x:number;z:number})=>Ops.hypot(h.x-p.x,h.z-p.z),hit=(key:string,amount=damage)=>{if(r.hitIds.includes(key))return;const id=`gulp:${b.sequence}:${key}`,before=h.hp;hurt(amount,id);if(h.hp<before||s.quality.dodged.includes(id))r.hitIds.push(key);};
 const summon=()=>{s.enemies=s.enemies.filter(e=>e.hp>0);const count=s.rules.difficulty==='redline'?3:2;for(let i=s.enemies.length;i<Math.min(count,t.enemyCap-1);i++){const e=spawnRunEnemy('croaker',i,b.sequence+3000,t,s.rules,s.extras.seed,s.objective.level,h),a=i*2.399963+b.sequence*.7,p=collide(h.x+Ops.cos(a)*6,h.z+Ops.sin(a)*6,.72,t);Object.assign(e,{id:300000+b.sequence*10+i,x:p.x,z:p.z,prevX:p.x,prevZ:p.z,behavior:{kind:'spawn',remaining:60}});if(e.hopper){e.hopper.origin={x:p.x,z:p.z};e.hopper.target={x:h.x,z:h.z};}s.enemies.push(e);}};
 if(phase>r.lastPhase){r.lastPhase=phase;if(phase===2)summon();if(phase>=3)r.pending=true;event('explosion',b.x,b.z,0,.4);}
 const recover=(heavy=false)=>{r.mode='recovery';r.elapsed=0;r.ring=0;r.targets=[];r.remaining=phase===4&&r.chain===0?60:t.gulpRecoveryTicks;r.chain=phase===4?1-r.chain:0;b.exposed=heavy?r.remaining:0;};
 const begin=(attack:typeof r.attack)=>{r.attack=attack;r.mode='warning';r.remaining=Math.max(48,t.gulpWarningTicks);r.elapsed=0;r.hitIds=[];r.ring=0;r.origin={x:b.x,z:b.z};r.target=collide(h.x,h.z,t.gulpRadius,t);const d=direction(h.x-b.x,h.z-b.z);r.dx=d.x;r.dz=d.z;b.faceX=d.x;b.faceZ=d.z;r.targets=[];
  if(attack==='gulp')r.targets=[[0,0],[-3,0],[3,0],[0,-3],[0,3]].map(([x,z])=>collide(h.x+x,h.z+z,1.5,t));
  if(attack==='flood')r.targets=[{x:-15,z:0},{x:15,z:0},{x:0,z:15},{x:0,z:-15}];
 };
 if(r.mode==='recovery'){if(r.remaining===0){const count=s.enemies.filter(e=>e.hp>0&&['windup','lunge'].includes(e.behavior.kind)).length;if(count>=t.attackerCap)return;const p=patterns[phase],attack=r.pending?(phase===3?'flood':'double-leap'):r.attack==='double-leap'&&r.leapCount===1?'double-leap':p[(b.sequence+s.extras.seed)%p.length];r.pending=false;b.sequence++;begin(attack);}return;}
 if(r.mode==='warning'){if(r.remaining>0)return;r.mode='active';r.elapsed=0;r.remaining=r.attack==='leap'||r.attack==='double-leap'?t.gulpLeapTicks+42:r.attack==='drum'?90:r.attack==='gulp'?65:r.attack==='tongue'?30:48;if(r.attack==='drum')summon();return;}
 if(r.attack==='leap'||r.attack==='double-leap'){
  if(r.elapsed<=t.gulpLeapTicks){const p=Math.min(1,r.elapsed/t.gulpLeapTicks);b.x=r.origin.x+(r.target.x-r.origin.x)*p;b.z=r.origin.z+(r.target.z-r.origin.z)*p;}
  if(r.elapsed===t.gulpLeapTicks){if(distance(b)<3.3+t.heroRadius)hit('landing',damage*1.25);event('stomp',b.x,b.z,0,3.3);b.exposed=Math.max(b.exposed,t.gulpRecoveryTicks);}
  if(r.elapsed>t.gulpLeapTicks){r.ring=(r.elapsed-t.gulpLeapTicks)/60*8;if(Math.abs(distance(b)-r.ring)<.3+t.heroRadius)hit('shock',damage*.7);}
  if(r.remaining===0){if(r.attack==='double-leap')r.leapCount=1-r.leapCount;else r.leapCount=0;recover(true);}return;
 }
 if(r.attack==='tongue'){const dx=h.x-b.x,dz=h.z-b.z,along=dx*r.dx+dz*r.dz,across=Math.abs(dx*r.dz-dz*r.dx);if(along>0&&along<12&&across<.6+t.heroRadius){if(h.dash.kind==='active'||s.leap?.kind==='air'){recover(true);return;}hit('tongue',damage*.8);const d=direction(b.x-h.x,b.z-h.z),p=collide(h.x+d.x*t.lasherPullSpeed/60,h.z+d.z*t.lasherPullSpeed/60,t.heroRadius,t);h.x=p.x;h.z=p.z;}}
 if(r.attack==='gulp')for(let i=0;i<r.targets.length;i++)if(r.elapsed===i*12+1){const p=r.targets[i];if(distance(p)<1.6+t.heroRadius)hit('barrage:'+i);event('explosion',p.x,p.z,0,1.6);}
 if(r.attack==='drum'){r.ring=r.elapsed/60*7;const d=direction(h.x-b.x,h.z-b.z),gap=d.x*r.dx+d.z*r.dz>.84;if(!gap&&Math.abs(distance(b)-r.ring)<.3+t.heroRadius)hit('drum',damage*.8);}
 if(r.attack==='flood'&&r.elapsed===1&&s.bog){s.bog.flood=Math.min(3,s.bog.flood+1);for(const p of r.targets)addBogPool(s,p,t,'flood',3);event('stomp',b.x,b.z,0,18-s.bog.flood*2);}
 if(r.remaining===0)recover(r.attack==='gulp'||r.attack==='tongue');
}
