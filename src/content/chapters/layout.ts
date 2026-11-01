import {scrapyard} from './scrapyard.ts';
// Integer-only seeded layout. Shared by simulation and presentation; no host clock/RNG.
export function chapterLayout(level:number,runSeed=4107){
 const profile=scrapyard.levels[Math.max(0,Math.min(2,level))];let seed:number=(profile.seed^(runSeed===4107?0:runSeed))>>>0;
 const next=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const vents:{id:number;x:number;z:number;boost:boolean;phase:number}[]=[];
 for(let tries=0;vents.length<scrapyard.vents.count&&tries<10000;tries++){
  const x=Math.round((next()*34-17)*2)/2,z=Math.round((next()*34-17)*2)/2;
  if(x*x+z*z<scrapyard.vents.centreExclusion**2||Math.abs(x)>15&&Math.abs(z)>15||Math.abs(x)<9&&Math.abs(z)<9)continue;
  if(vents.some(v=>(x-v.x)**2+(z-v.z)**2<scrapyard.vents.minSeparation**2))continue;
  if([[-11,-11],[11,-11],[-11,11],[11,11]].some(([a,b])=>(x-a)**2+(z-b)**2<10))continue;
  vents.push({id:vents.length,x,z,boost:vents.length<Math.min(profile.boostVents,scrapyard.vents.boostCount),phase:Math.floor(next()*240)});
 }
 if(vents.length!==scrapyard.vents.count)throw Error('Chapter vent layout exhausted');
 const props=Array.from({length:scrapyard.props.density},(_,i)=>({id:i,x:(i%2?1:-1)*(21+next()*1.5),z:(i%4<2?1:-1)*(3+next()*12),kind:i%3,turn:next()*6.283185307}));
 return{profile,vents,props};
}
