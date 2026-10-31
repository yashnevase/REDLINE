import {createRunSimulation,runUpdate} from '../src/sim/run-runtime.ts';
export const lintTarget=()=>({runtime:createRunSimulation(undefined,true).runtime,schedules:{update:runUpdate}});
