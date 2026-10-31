import {Ops} from '@typeonce/ritmo';
import {B2_ENABLED} from '../content/items/switches.ts';
import type {Enemy} from './run-schema.ts';import type {Hero} from './schema.ts';import type {CombatTuning} from '../content/combat.ts';
export function whirlerAngle(tick:number,id:number,t:CombatTuning){return tick*t.whirlerSpin+id*.27;}
export function whirlerArmTouches(e:Enemy,h:Hero,tick:number,t:CombatTuning,enabled=B2_ENABLED){if(!enabled)return false;const angle=whirlerAngle(tick,e.id,t);for(let arm=0;arm<3;arm++){const a=angle+arm*Math.PI*2/3,dx=Ops.cos(a),dz=Ops.sin(a),x=h.x-e.x,z=h.z-e.z,along=Math.max(1,Math.min(t.whirlerArmReach,x*dx+z*dz));if((x-dx*along)**2+(z-dz*along)**2<=(t.heroRadius+t.whirlerArmWidth)**2)return true;}return false;}
