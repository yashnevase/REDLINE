import {F2_ENABLED} from '../content/items/switches.ts';
// Host-owned edge history: holding a controller button cannot steal new keyboard/touch hints.
export function makePadActivity(){let previous='';return(pad:Pick<Gamepad,'axes'|'buttons'|'id'>|undefined)=>{if(!pad){previous='';return false;}const active=pad.axes.some(v=>Math.abs(v)>.2)||pad.buttons.some(b=>b.pressed),signature=`${pad.id}:${pad.axes.map(v=>Math.abs(v)>.2?Math.round(v*20):0).join(',')}:${pad.buttons.map(b=>Number(b.pressed)).join('')}`,changed=active&&signature!==previous;previous=signature;return F2_ENABLED&&changed;};}
