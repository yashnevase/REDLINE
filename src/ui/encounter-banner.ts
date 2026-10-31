export function makeEncounterBanner(parent:HTMLElement){
 const root=document.createElement('div');root.className='encounter-banner';root.setAttribute('aria-hidden','true');root.innerHTML='<b></b><span></span>';parent.append(root);
 let phase='',active=false,at=-200,lastTick=-1;
 return{reset:()=>{phase='';active=false;at=-200;lastTick=-1;root.hidden=true;},update:(view:{tick:number;phase:string;title:string;subtitle:string;overdrive:boolean;hidden:boolean;reducedMotion:boolean})=>{
  if(view.tick<lastTick){phase='';active=false;at=-200;}lastTick=view.tick;
  const changed=phase!==view.phase,started=view.overdrive&&!active;phase=view.phase;active=view.overdrive;
  if(changed||started){at=view.tick;root.querySelector('b')!.textContent=started?'OVERDRIVE':view.title;root.querySelector('span')!.textContent=started?'Heat released · keep moving':view.subtitle;}
  const age=view.tick-at;root.hidden=view.hidden||age<0||age>=75;
  const opacity=age<12?age/12:Math.min(1,(75-age)/15);root.style.opacity=String(view.reducedMotion?1:Math.max(0,opacity));root.style.transform=`translate(-50%,${view.reducedMotion?0:Math.max(0,12-age)}px)`;
 }};
}
