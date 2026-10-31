import { Descriptor, Schema } from '@typeonce/ritmo';
const State = Descriptor.Resource()('Smoke/State');
const Input = Descriptor.Service()('Smoke/Input');
const Game = Schema.bind(Schema.fragment({ resources: { State } }));
const advance = Game.System('Smoke/MoveDashCollide', {
 resources: { state: Game.System.writeResource(State) }, services: { input: Game.System.service(Input) }
}, ({ resources, services }) => {
 const state = resources.state.get(); const input = services.input.read();
 const dash = input.dash && state.charges > 0;
 const remaining = dash ? 12 : Math.max(0, state.remaining - 1);
 const position = Math.min(4, Math.max(-4, state.x + input.x * (remaining > 0 ? 20 : 6) / 60));
 resources.state.set({ x: position, tick: state.tick + 1, remaining, charges: state.charges - Number(dash), collided: state.collided || position === 4 });
});
const update = Game.Schedule(advance);
const read = Game.Inspector('Smoke/View', { resources: { state: Game.System.readResource(State) } }, ({ resources }) => ({...resources.state.get()}));
export function createSmoke() {
 let command = { x: 0, dash: false };
 const result = Game.Runtime.make({ resources: { State: { x: 0, tick: 0, remaining: 0, charges: 2, collided: false } }, services: Game.Runtime.services(Game.Runtime.service(Input, {read: () => command})) });
 if (!result.ok) throw new Error('Ritmo initialization failed');
 return { step(input) { command = input; const ran=result.value.tick(update); if(!ran.ok) throw new Error("Smoke tick failed"); return result.value.inspect(read); }, view: () => result.value.inspect(read) };
}
export const commands = Array.from({length:180},(_,tick)=>({x:1,dash:tick===15}));
