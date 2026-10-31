import type {Command} from '../sim/schema.ts';
export function makeInput(stick:HTMLElement,dash:HTMLElement,onPause:()=>void,onRestart:()=>void){
 const keys=new Set<string>();let overdriveQueued=false,padOverdrive=false;let abilityQueued:Command['ability'];const padAbilities=[false,false,false],padChoices=[false,false,false];let choiceQueued:number|undefined;let dashQueued=false,dashInput:Command['dashInput'],dashDown=false,stickId:number|null=null,origin={x:0,y:0},vector={x:0,y:0},padDash=false,padPause=false;
 const knob=stick.querySelector<HTMLElement>('div')!;
 function clear(){keys.clear();dashQueued=false;dashInput=dashDown?'cancel':undefined;dashDown=false;abilityQueued=undefined;choiceQueued=undefined;overdriveQueued=false;stickId=null;vector={x:0,y:0};knob.style.transform='';stick.classList.remove('held');}
 function typing(e:KeyboardEvent){return !!document.querySelector('dialog[open]')||e.target instanceof HTMLElement&&(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||e.target.isContentEditable);}
 addEventListener('keydown',e=>{if(typing(e))return;if(['Space','ShiftLeft','ShiftRight','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code);if(!e.repeat){if(e.code==='KeyR')overdriveQueued=true;if(e.code==='KeyQ')abilityQueued='pulse';if(e.code==='KeyE')abilityQueued='boost';if(e.code==='KeyX')abilityQueued='stomp';}if(!e.repeat&&['Space','ShiftLeft','ShiftRight'].includes(e.code)){dashDown=true;dashInput='press';}if(!e.repeat&&['Escape','KeyP'].includes(e.code)){clear();onPause();}if(!e.repeat&&e.code==='Enter'&&!(e.target instanceof HTMLButtonElement))onRestart();});
 addEventListener('keyup',e=>{keys.delete(e.code);if(dashDown&&['Space','ShiftLeft','ShiftRight'].includes(e.code)){dashDown=false;dashInput='release';}});addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
 const move=(e:PointerEvent)=>{if(e.pointerId!==stickId)return;const radius=stick.clientWidth*.36;const dx=e.clientX-origin.x,dy=e.clientY-origin.y;const length=Math.sqrt(dx*dx+dy*dy);const scale=length>radius?radius/length:1;vector={x:dx*scale/radius,y:dy*scale/radius};knob.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;};
 stick.addEventListener('pointerdown',e=>{if(stickId!==null)return;e.preventDefault();stickId=e.pointerId;const rect=stick.getBoundingClientRect();origin={x:rect.left+rect.width/2,y:rect.top+rect.height/2};stick.setPointerCapture(e.pointerId);stick.classList.add('held');move(e);});
 stick.addEventListener('pointermove',move);
 const release=(e:PointerEvent)=>{if(e.pointerId===stickId){stickId=null;vector={x:0,y:0};knob.style.transform='';stick.classList.remove('held');}};
 stick.addEventListener('pointerup',release);stick.addEventListener('pointercancel',release);stick.addEventListener('lostpointercapture',release);
 dash.addEventListener('pointerdown',e=>{e.preventDefault();dash.setPointerCapture(e.pointerId);dashDown=true;dashInput='press';dash.classList.add('held');});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])dash.addEventListener(event,()=>{if(dashDown)dashInput=event==='pointerup'?'release':'cancel';dashDown=false;dash.classList.remove('held');});
 for(const ability of ['pulse','boost','stomp'] as const){const button=dash.parentElement!.querySelector<HTMLElement>(`[data-ability="${ability}"]`);button?.addEventListener('pointerdown',e=>{e.preventDefault();abilityQueued=ability;});}
 dash.parentElement!.querySelector('[data-overdrive]')?.addEventListener('pointerdown',e=>{e.preventDefault();overdriveQueued=true;});
 return{clear,sample(azimuth:number,elevation:number):Command{
  let x=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
  let y=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));
  if(stickId!==null){x=vector.x;y=vector.y;}
  const pad=Array.from(navigator.getGamepads?.()??[]).find(p=>p?.connected);
  if(pad){const px=pad.axes[0]??0,py=pad.axes[1]??0;if(Math.abs(px)+Math.abs(py)>.2){x=px;y=py;}const down=!!(pad.buttons[0]?.pressed||pad.buttons[5]?.pressed);if(down&&!padDash)dashInput='press';if(!down&&padDash)dashInput='release';padDash=down;const pause=!!pad.buttons[9]?.pressed;if(pause&&!padPause)onPause();padPause=pause;[0,1,3].forEach((button,i)=>{const pressed=!!pad.buttons[button]?.pressed;if(pressed&&!padChoices[i])choiceQueued=i;padChoices[i]=pressed;});const od=!!pad.buttons[4]?.pressed;if(od&&!padOverdrive)overdriveQueued=true;padOverdrive=od;(['pulse','boost','stomp'] as const).forEach((ability,i)=>{const pressed=!!pad.buttons[[2,1,3][i]]?.pressed;if(pressed&&!padAbilities[i])abilityQueued=ability;padAbilities[i]=pressed;});}
  const length=Math.sqrt(x*x+y*y),strength=Math.min(1,length);const a=azimuth*Math.PI/180,squash=Math.max(.1,Math.sin(elevation*Math.PI/180));
  const wx=x*Math.cos(a)+y/squash*Math.sin(a),wz=-x*Math.sin(a)+y/squash*Math.cos(a);const worldLength=Math.sqrt(wx*wx+wz*wz);
  const command={x:worldLength?wx/worldLength*strength:0,z:worldLength?wz/worldLength*strength:0,dash:dashQueued,dashInput,ability:abilityQueued,overdrive:overdriveQueued,choice:choiceQueued};dashQueued=false;dashInput=undefined;abilityQueued=undefined;overdriveQueued=false;choiceQueued=undefined;return command;
 }};
}
