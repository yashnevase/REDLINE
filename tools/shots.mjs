import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { session, load } from './browser.mjs';
import { scenes } from '../src/content/scene.mjs';
await mkdir('shots', { recursive: true });
const run = await session();
try {
  for (const viewport of [{ width: 1280, height: 720, name: 'desktop' }, { width: 844, height: 390, name: 'phone' }]) {
    const context = await run.browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: viewport.name === 'phone' });
    for (const scene of scenes) {
      const page = await context.newPage(); const errors = await load(page, run.url, scene);if(scene==='arena'||scene==='perf-worst')await page.evaluate(()=>window.__REDLINE__.setTick(240));
      await page.screenshot({ path: `shots/${scene}-${viewport.name}.png` });
      const metadata = await page.evaluate(() => window.__REDLINE__.metadata());
      await writeFile(`shots/${scene}-${viewport.name}.json`, JSON.stringify({ ...metadata, capturedAt: new Date().toISOString(), errors, kind: ['arena','perf-worst'].includes(scene) ? 'Phase 2 fixed-step eight-Sawlet opening wave' : 'Presentation preview' }, null, 2));
      await page.close();
    }
    await context.close();
  }
  const compare = await run.browser.newPage({ viewport: { width: 2560, height: 776 }, deviceScaleFactor: 1 });
  for (const [left, right, file, title] of [
    ['art/targets/spirit-call/combat-lava-aoe.png', 'shots/combat-readability-desktop.png', 'target-comparison', 'Spirit Call target / REDLINE effects preview'],
    ['art/targets/spirit-call/combat-lava-wind.png', 'shots/arena-desktop.png', 'camera-comparison', 'Spirit Call camera target / REDLINE arena'],
    ['art/targets/spirit-call/menu-hero.png', 'shots/lobby-desktop.png', 'lobby-comparison', 'Spirit Call menu target / REDLINE 3D lobby'],
    ['shots/previous/arena-desktop.png', 'shots/arena-desktop.png', 'before-after', 'REDLINE previous / REDLINE revised']
  ]) {
    const target = (await readFile(left)).toString('base64'); const actual = (await readFile(right)).toString('base64');
    await compare.setContent(`<body style="margin:0;background:#171620;color:#eee;font:16px Arial"><div style="display:flex"><section><p style="margin:18px">${title.split(' / ')[0]} · study only</p><img width="1280" height="720" style="object-fit:contain" src="data:image/png;base64,${target}"></section><section><p style="margin:18px">${title.split(' / ')[1]} · seed 4107 / fixed capture tick</p><img width="1280" height="720" src="data:image/png;base64,${actual}"></section></div></body>`);
    await compare.screenshot({ path: `shots/${file}.png` });
  }
  await compare.close();
  for (const scene of ['arena', 'lobby', 'combat-readability']) {
    const context = await run.browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: 'shots/motion', size: { width: 1280, height: 720 } } });
    const page = await context.newPage(); await load(page, run.url, scene);
    if (scene === 'combat-readability') for (const tick of [45, 90, 120, 160]) {
      await page.evaluate(tick => window.__REDLINE__.setTick(tick), tick);
      await page.screenshot({ path: `shots/motion/${scene}-tick-${tick}.png` });
    }
    await page.evaluate(() => window.__REDLINE__.play()); await page.waitForTimeout(4000);
    const video = page.video(); await context.close(); await video.saveAs(`shots/motion/${scene}-idle.webm`);
  }
  console.log(`Captured ${scenes.length} scenes × desktop/phone, four comparisons, and fight/lobby/effects motion. No phone hardware claim.`);
} finally { await run.close(); }
