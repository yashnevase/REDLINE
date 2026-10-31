import {createSimulation,update} from '../src/sim/runtime.ts';
export const lintTarget=()=>({runtime:createSimulation(undefined,true).runtime,schedules:{update}});
