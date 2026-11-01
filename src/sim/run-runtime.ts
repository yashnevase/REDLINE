import {HostClock} from '@typeonce/ritmo';
import {combatDefaults,tuningSchema,type CombatTuning} from '../content/combat.ts';
import {RunGame,Run,Input,initialRun,runSchema,type RunState} from './run-schema.ts';
import {Tuning,idleCommand,type Command} from './schema.ts';
import {stepRun} from './run-rules.ts';
export const updateRun=RunGame.System('Redline/StepRun',{
 resources:{state:RunGame.System.writeResource(Run),tuning:RunGame.System.writeResource(Tuning)},services:{input:RunGame.System.service(Input)}
},({resources,services})=>{const input=services.input.read();if(input.tuning){const parsed=tuningSchema.safeParse(input.tuning);if(parsed.success)resources.tuning.set(parsed.data);}resources.state.set(stepRun(resources.state.get(),input,resources.tuning.get()));});
export const runUpdate=RunGame.Schedule(updateRun);
const projection=RunGame.Inspector('Redline/RunView',{resources:{state:RunGame.System.readResource(Run)}},({resources})=>runSchema.parse(resources.state.get()));
export function createRunSimulation(tuning:CombatTuning={...combatDefaults},debug=false,loadout:RunState['loadout']='core',options:{mission?:number;seed?:number}={}){
 let command:Command=idleCommand;const hostClock=HostClock.test();
 const made=RunGame.Runtime.make({resources:{Run:initialRun(tuning,loadout,options),Tuning:tuning},services:RunGame.Runtime.services(RunGame.Runtime.service(Input,{read:()=>command})),debug:debug?{hostClock}:undefined});
 if(!made.ok)throw new Error('Invalid REDLINE run bootstrap');const runtime=made.value;
 return{runtime,hostClock,step:(input:Command)=>{command=input;const ran=runtime.tick(runUpdate);if(!ran.ok)throw new Error('REDLINE run tick failed');return runtime.inspect(projection);},view:()=>runtime.inspect(projection),snapshot:()=>runtime.snapshot(),restore:(data:Parameters<typeof runtime.restore>[0])=>runtime.restore(data)};
}
