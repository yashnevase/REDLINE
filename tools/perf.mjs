import { mkdir, writeFile } from 'node:fs/promises';
import { session, load } from './browser.mjs';
const run = await session();
try {
  const page = await run.browser.newPage({ viewport: { width: 844, height: 390 } }); await load(page, run.url, 'perf-worst');
  const cdp = await page.context().newCDPSession(page); const samples = [];
  for (const rate of [1, 4, 6]) {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await page.evaluate(() => window.__REDLINE__.measure(30));
    const data = await page.evaluate(() => window.__REDLINE__.measure(180)); data.sort((a, b) => a - b);
    samples.push({ cpuThrottle: rate, count: data.length, p50: data[Math.floor(data.length * .5)], p95: data[Math.floor(data.length * .95)], p99: data[Math.floor(data.length * .99)] });
  }
  const report = { kind: 'Phase 2 Wave 4 (10 mixed enemies) fixed-command replay; accelerated wave setup and 10,000 hero HP prevent early benchmark termination; requestAnimationFrame intervals (ms). Includes movement, dash, AI and rendered hit feedback. Not a 12-enemy-plus-boss worst case or real-phone performance.', metadata: await page.evaluate(() => window.__REDLINE__.metadata()), samples };
  await mkdir('shots', { recursive: true }); await writeFile('shots/perf.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
} finally { await run.close(); }
