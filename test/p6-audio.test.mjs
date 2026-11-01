import test from 'node:test';import assert from 'node:assert/strict';
import {initialRun} from '../src/sim/run-schema.ts';import {combatDefaults as t} from '../src/content/combat.ts';import {makeCueBus} from '../src/presentation/cue-bus.ts';import {musicGain} from '../src/audio/music-gain.ts';
test('Stationary Blade Spin and Overdrive sound faster while base Core stays free of saw whine',()=>{
 const bus=makeCueBus(),heard=[];bus.subscribe(c=>heard.push(c));const s=initialRun(t,'blade');s.hero.vx=s.hero.vz=0;s.tick=18;s.hero.special={kind:'spin',remaining:30,hits:[],hopRemaining:0};bus.update(s);assert.equal(heard.filter(c=>c.id==='saw_whine').at(-1).intensity,.85);
 s.tick=36;s.hero.overdrive=100;bus.update(s);assert.equal(heard.filter(c=>c.id==='saw_whine').at(-1).intensity,1);const count=heard.filter(c=>c.id==='saw_whine').length;s.loadout='core';s.tick=54;bus.update(s);assert.equal(heard.filter(c=>c.id==='saw_whine').length,count);
 s.extras.style=120;s.score.chain=10;s.tick=60;bus.update(s);bus.send('ui_confirm',60);assert.equal(heard.filter(c=>c.id==='ui_confirm').at(-1).pitch,1);
});
test('Measured private music reaches target prefader loudness while a hot peak caps amplification',()=>{
 for(const lufs of[-7.45,-6.26,-10.56])assert.ok(Math.abs(lufs+20*Math.log10(musicGain({lufs,truePeak:2.26}))+18)<1e-10);
 assert.ok(2+20*Math.log10(musicGain({lufs:-30,truePeak:2}))<=-2+1e-10);assert.equal(musicGain(),.5);assert.equal(musicGain({lufs:NaN}),.5);
});
