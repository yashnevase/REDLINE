import type * as T from 'three';
export const H3_ENABLED=true;
export function updateWorldLighting(sun:T.DirectionalLight,fill:T.DirectionalLight,time:number,overdrive:boolean,enraged:boolean,quiet:boolean){if(!H3_ENABLED)return;sun.color.set(enraged?'#ffb3a1':overdrive?'#edf0ff':'#ffe8ca');fill.color.set(overdrive?'#c9c4ff':'#c7c3cb');if(enraged&&!quiet)sun.color.g*=.94+Math.sin(time*3)*.06;}
