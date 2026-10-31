import {z} from 'zod';import {F2_ENABLED} from './switches.ts';
export const bindingActions=['moveUp','moveDown','moveLeft','moveRight','dash','pulse','boost','stomp','overdrive','pause','zoomCloser','zoomWider','choose1','choose2','choose3','restart'] as const;
export type BindingAction=typeof bindingActions[number];
export const defaultBindings={moveUp:'KeyW',moveDown:'KeyS',moveLeft:'KeyA',moveRight:'KeyD',dash:'Space',pulse:'KeyQ',boost:'KeyE',stomp:'KeyX',overdrive:'KeyR',pause:'KeyP',zoomCloser:'KeyC',zoomWider:'KeyV',choose1:'Digit1',choose2:'Digit2',choose3:'Digit3',restart:'Enter'} satisfies Record<BindingAction,string>;
export type Bindings=Record<BindingAction,string>;
const aliases:Partial<Record<BindingAction,readonly string[]>>={moveUp:['ArrowUp'],moveDown:['ArrowDown'],moveLeft:['ArrowLeft'],moveRight:['ArrowRight'],dash:['ShiftLeft','ShiftRight'],pause:['Escape']};
export function matchesBinding(code:string,action:BindingAction,value:Bindings=defaultBindings){const b=F2_ENABLED?value:defaultBindings;return b[action]===code||b[action]===defaultBindings[action]&&!!aliases[action]?.includes(code);}
export function bindingConflict(code:string,action:BindingAction,b:Bindings){return bindingActions.find(other=>other!==action&&matchesBinding(code,other,b));}
export const bindingsSchema=z.record(z.enum(bindingActions),z.string().regex(/^[A-Za-z][A-Za-z0-9]{1,23}$/)).refine(b=>bindingActions.every(a=>!bindingConflict(b[a],a,b)),'A key is already assigned.');
export function keyLabel(code:string){return code==='Space'?'Space':code.replace('Key','').replace('Digit','').replace('ArrowUp','↑').replace('ArrowDown','↓').replace('ArrowLeft','←').replace('ArrowRight','→').replace('ShiftLeft','Shift').replace('ShiftRight','Shift');}
export const bindingLabels:Record<BindingAction,string>={moveUp:'Move up',moveDown:'Move down',moveLeft:'Move left',moveRight:'Move right',dash:'Dash',pulse:'Blade Spin',boost:'Boost Burst',stomp:'Stomp',overdrive:'Overdrive',pause:'Pause',zoomCloser:'Closer camera',zoomWider:'Wider camera',choose1:'Upgrade 1',choose2:'Upgrade 2',choose3:'Upgrade 3',restart:'Retry'};
