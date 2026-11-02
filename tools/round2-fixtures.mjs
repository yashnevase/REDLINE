import {initialRun,initialBoss,spawnRunEnemy} from '../src/sim/run-schema.ts';
import {combatDefaults as t} from '../src/content/combat.ts';
import {difficultyTuning} from '../src/content/r3-difficulty.ts';
import {enemyKinds} from '../src/content/encounter.ts';
export function stress(kind='crowd',level=2,low=false){
 const config={...t,heroHP:10000},s=initialRun(config,'blade',{difficulty:'redline',lowSpec:low,mission:level});
 s.tick=240;s.hero.hp=10000;s.hero.bonkCooldown=0;s.objective.level=level;
 const tune=difficultyTuning(config,s.rules,80),count=tune.enemyCap;
 s.enemies=Array.from({length:count-(kind==='rex'?1:0)},(_,i)=>{
  const e=spawnRunEnemy(enemyKinds[i%5],i,1,tune,s.rules,4107,level);
  const a=i*Math.PI*2/count,r=2.8+i%3;
  Object.assign(e,{x:Math.cos(a)*r,z:Math.sin(a)*r,prevX:Math.cos(a)*r,prevZ:Math.sin(a)*r,hp:250,maxHP:1000,variant:['armoured','fast','double-blade'][i%3],behavior:{kind:'chase'}});return e;
 });
 if(kind==='rex'){s.phase={kind:'boss',boss:initialBoss(config)};s.phase.boss.hp=100;s.phase.boss.x=3;s.phase.boss.z=0;}
 else s.phase={kind:'fight',wave:0,nextSpawn:999,nextSpawnIn:60};
 if(kind==='corner'){s.hero.x=s.hero.prevX=17;s.hero.z=s.hero.prevZ=16;}
 return{s,config};
}
