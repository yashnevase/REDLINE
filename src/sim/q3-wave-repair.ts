import {Q3_ENABLED} from '../content/items/switches.ts';
import type {Hero} from './schema.ts';
export function repairClearedWave(hero:Hero,maxHP:number,fraction:number,enabled=Q3_ENABLED){if(!enabled)return 0;const before=hero.hp;hero.hp=Math.min(maxHP,hero.hp+maxHP*fraction);return hero.hp-before;}
