import type {CombatTuning} from './combat.ts';
export const upgrades=[
 {id:'bonk-power',name:'Heavy Core',description:'+20% auto-bonk damage',stat:'bonkDamage',factor:'upgradeBonkFactor'},
 {id:'bonk-speed',name:'Quick Bearings',description:'15% shorter auto-bonk interval',stat:'bonkCooldownTicks',factor:'upgradeIntervalFactor'},
 {id:'move-speed',name:'Freewheel',description:'+10% movement speed',stat:'moveSpeed',factor:'upgradeMoveFactor'},
 {id:'dash-recharge',name:'Fast Reset',description:'15% faster dash recharge',stat:'rechargeTicks',factor:'upgradeIntervalFactor'},
 {id:'dash-charge',name:'Reserve Cell',description:'+1 dash charge',stat:'dashCharges',add:'upgradeCharges'},
 {id:'pulse-power',name:'Spin Driver',description:'+25% Blade Spin damage',stat:'pulseDamage',factor:'upgradeDamageFactor'},
 {id:'pulse-radius',name:'Wide Orbit',description:'+20% Blade Spin radius',stat:'pulseRadius',factor:'upgradeRadiusFactor'},
 {id:'pulse-recharge',name:'Spin Cycle',description:'20% shorter Spin cooldown',stat:'pulseCooldownTicks',factor:'upgradeCooldownFactor'},
 {id:'boost-recharge',name:'Boost Cycle',description:'20% shorter Boost cooldown',stat:'boostCooldownTicks',factor:'upgradeCooldownFactor'},
 {id:'stomp-power',name:'Impact Plate',description:'+25% Stomp damage',stat:'stompDamage',factor:'upgradeDamageFactor'},
 {id:'stomp-recharge',name:'Impact Cycle',description:'20% shorter Stomp cooldown',stat:'stompCooldownTicks',factor:'upgradeCooldownFactor'},
 {id:'max-hp',name:'Reinforced Shell',description:'+20 maximum integrity; restore that 20',stat:'heroHP',add:'upgradeHP'}
] as const satisfies readonly {id:string;name:string;description:string;stat:keyof CombatTuning;factor?:keyof CombatTuning;add?:keyof CombatTuning}[];
export function upgradedTuning(base:CombatTuning,picks:readonly string[]):CombatTuning {
 const t={...base};for(const id of picks){const u=upgrades.find(u=>u.id===id);if(!u)continue;const v=t[u.stat];t[u.stat]='factor' in u?v*base[u.factor]:v+base[u.add];const pair=u.stat==='pulseDamage'?'bladeDamage':u.stat==='pulseRadius'?'bladeSpinRadius':u.stat==='pulseCooldownTicks'?'bladeCooldownTicks':null;if(pair&&'factor' in u){t[pair]*=base[u.factor];if(pair.endsWith('Ticks'))t[pair]=Math.max(1,Math.round(t[pair]));}if(u.stat.endsWith('Ticks')||u.stat==='dashCharges')t[u.stat]=Math.max(1,Math.round(t[u.stat]));}return t;
}
export function upgradeChoices(wave:number,picked:readonly string[]){
 const available=upgrades.filter(u=>!picked.includes(u.id));const history=picked.reduce((sum,id)=>sum+upgrades.findIndex(u=>u.id===id)+1,0);const start=(wave*4+history)%available.length;
 return [0,1,2].map(i=>available[(start+i*3)%available.length].id);
}

export function upgradeDescription(id:string,t:CombatTuning,blade=false){
 const u=upgrades.find(u=>u.id===id);if(!u)return '';const stat=blade?(u.stat==='pulseDamage'?'bladeDamage':u.stat==='pulseRadius'?'bladeSpinRadius':u.stat==='pulseCooldownTicks'?'bladeCooldownTicks':u.stat):u.stat;const value=upgradedTuning(t,[id])[stat];
 const label:Partial<Record<keyof CombatTuning,string>>={bonkDamage:'auto-bonk damage',bonkCooldownTicks:'seconds between auto-bonks',moveSpeed:'movement speed',rechargeTicks:'seconds to recharge a dash',dashCharges:'dash charges',pulseDamage:'Spin damage',pulseRadius:'Spin radius',pulseCooldownTicks:'seconds Spin cooldown',boostCooldownTicks:'seconds Boost cooldown',stompDamage:'Stomp damage',stompCooldownTicks:'seconds Stomp cooldown',heroHP:'maximum integrity',bladeDamage:'Blade damage',bladeSpinRadius:'Blade Spin radius',bladeCooldownTicks:'seconds Blade cooldown'};
 const seconds=stat.endsWith('Ticks'),before=stat==='pulseDamage'?t[stat]*2:seconds?t[stat]/60:t[stat],after=stat==='pulseDamage'?value*2:seconds?value/60:value;
 return `${Number(before.toFixed(2))} → ${Number(after.toFixed(2))} ${label[stat]??stat}${u.stat==='heroHP'?`; restore ${t.upgradeHP}`:''}`;
}
