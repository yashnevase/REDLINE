export function makeEncounterBanner(parent:HTMLElement){
 const root=document.createElement('div');root.className='encounter-banner';root.innerHTML='<b></b><span></span><button aria-label="Dismiss announcement">×</button>';parent.append(root);
 let dismissed=false;root.querySelector('button')!.addEventListener('click',()=>{dismissed=true;root.hidden=true;});
 let phase='',active=false,at=-200,lastTick=-1;
 return{reset:()=>{phase='';active=false;at=-200;lastTick=-1;root.hidden=true;},update:(view:{tick:number;phase:string;title:string;subtitle:string;overdrive:boolean;hidden:boolean;reducedMotion:boolean;slideSeconds?:number})=>{
  if(view.tick<lastTick){phase='';active=false;at=-200;}lastTick=view.tick;
  const changed=phase!==view.phase,started=view.overdrive&&!active;phase=view.phase;active=view.overdrive;
  if(changed||started){dismissed=false;at=view.tick;root.querySelector('b')!.textContent=started?'OVERDRIVE!':view.title;root.querySelector('span')!.textContent=started?'Heat released · keep moving':view.subtitle;}
  const age=view.tick-at;root.hidden=dismissed||view.hidden||age<0||age>=75;
  const slide=Math.max(1,(view.slideSeconds??.6)*60);const opacity=age<slide?age/slide:Math.min(1,(75-age)/15);root.style.opacity=String(view.reducedMotion?1:Math.max(0,opacity));root.style.transform=`translate(0,${view.reducedMotion?0:Math.max(0,1-age/slide)*32}px)`;
 }};
}
