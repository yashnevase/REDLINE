import {HostClock} from '@typeonce/ritmo';
import {combatDefaults,tuningSchema,type CombatTuning} from '../content/combat.ts';
import {Game,State,Tuning,Input,initialState,stateSchema,idleCommand,type Command} from './schema.ts';
import {stepFight} from './rules.ts';
export const updateFight=Game.System('Redline/StepFight',{
 resources:{state:Game.System.writeResource(State),tuning:Game.System.writeResource(Tuning)},
 services:{input:Game.System.service(Input)}
},({resources,services})=>{const input=services.input.read();if(input.tuning){const parsed=tuningSchema.safeParse(input.tuning);if(parsed.success)resources.tuning.set(parsed.data);}resources.state.set(stepFight(resources.state.get(),input,resources.tuning.get()));});
export const update=Game.Schedule(updateFight);
export const projection=Game.Inspector('Redline/FightView',{resources:{state:Game.System.readResource(State)}},({resources})=>stateSchema.parse(resources.state.get()));
export function createSimulation(tuning:CombatTuning={...combatDefaults},debug=false) {
 let command:Command=idleCommand;
 const hostClock=HostClock.test();
 const made=Game.Runtime.make({resources:{State:initialState(tuning),Tuning:tuning},services:Game.Runtime.services(Game.Runtime.service(Input,{read:()=>command})),debug:debug?{hostClock}:undefined});
 if(!made.ok)throw new Error('Invalid REDLINE simulation bootstrap');
 const runtime=made.value;
 return{runtime,hostClock,step:(input:Command)=>{command=input;const ran=runtime.tick(update);if(!ran.ok)throw new Error("REDLINE tick failed");return runtime.inspect(projection);},view:()=>runtime.inspect(projection),snapshot:()=>runtime.snapshot(),restore:(data:Parameters<typeof runtime.restore>[0])=>runtime.restore(data)};
}
export type Simulation=ReturnType<typeof createSimulation>;
export type FightView=ReturnType<Simulation['view']>;
