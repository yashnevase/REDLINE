import {CL2_ENABLED,CL5_ENABLED} from '../content/items/cl-clarity.ts';
import type {FightState} from '../sim/schema.ts';import type {RunState} from '../sim/run-schema.ts';
export function updateClarityHUD(app:HTMLElement,s:RunState|FightState){app.dataset.cl2=String(CL2_ENABLED);app.dataset.cl5=String(CL5_ENABLED);app.dataset.clCombat=String(CL5_ENABLED&&(s.hero.overdrive>0||s.events.some(e=>e.kind==='stomp'||e.kind==='bonk'&&e.amount>=16)));}
