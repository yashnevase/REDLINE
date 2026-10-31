import {zoomOrder,type Preferences} from '../content/preferences.ts';
// Camera preference only: never consumes a simulation intent or steals joystick pointers.
export function makeZoomControls(parent:HTMLElement,canvas:HTMLCanvasElement,get:()=>Preferences['zoom'],set:(zoom:Preferences['zoom'])=>void,enabled:()=>boolean){
 const root=document.createElement('div');root.className='zoom-controls';root.setAttribute('aria-label','Camera distance');root.innerHTML='<button aria-label="Zoom closer" title="Closer (C)">+</button><span>VIEW</span><button aria-label="Zoom wider" title="Wider (V)">−</button>';parent.append(root);
 const step=(direction:number)=>{if(enabled())set(zoomOrder[Math.max(0,Math.min(2,zoomOrder.indexOf(get())+direction))]);};root.children[0].addEventListener('click',()=>step(-1));root.children[2].addEventListener('click',()=>step(1));
 addEventListener('keydown',event=>{if(event.repeat||event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,dialog,[contenteditable=true]'))return;if(event.code==='KeyV'||event.code==='KeyC'){event.preventDefault();step(event.code==='KeyV'?1:-1);}});
 let wheelAt=0;canvas.addEventListener('wheel',event=>{if(!enabled())return;event.preventDefault();if(Math.abs(event.deltaY)>2&&performance.now()-wheelAt>180){step(event.deltaY>0?1:-1);wheelAt=performance.now();}},{passive:false});
 const touches=new Map<number,{x:number;y:number}>();let initial=0;const distance=()=>{const a=[...touches.values()];return a.length===2?Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y):0;};
 canvas.addEventListener('pointerdown',event=>{if(event.pointerType!=='touch')return;touches.set(event.pointerId,{x:event.clientX,y:event.clientY});canvas.setPointerCapture(event.pointerId);initial=distance();});
 canvas.addEventListener('pointermove',event=>{if(!touches.has(event.pointerId))return;touches.set(event.pointerId,{x:event.clientX,y:event.clientY});const current=distance();if(initial&&current&&(current/initial>1.18||current/initial<.82)){step(current>initial?-1:1);initial=current;}});
 for(const name of ['pointerup','pointercancel','lostpointercapture'] as const)canvas.addEventListener(name,event=>{touches.delete(event.pointerId);initial=distance();});addEventListener('blur',()=>{touches.clear();initial=0;});
}
