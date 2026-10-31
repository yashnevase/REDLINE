import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= fileURLToPath(new URL('../.cache/ms-playwright', import.meta.url));
export async function session(options={}) {
  const port = 5201;
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
  let serverLog = ''; server.stdout.on('data', b => serverLog += b); server.stderr.on('data', b => serverLog += b);
  const url = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) { try { const r = await fetch(url); if (r.ok) { ready = true; break; } } catch {} await new Promise(r => setTimeout(r, 100)); }
    if (!ready) throw new Error(`Vite not ready: ${serverLog}`);
    const browser = await chromium.launch({ headless: options.headless??true, ...(options.gpu?{args:['--use-angle=metal','--enable-gpu']}: {}) });
    return { browser, url, close: async () => { await browser.close(); server.kill(); await once(server, 'exit'); } };
  } catch (error) { server.kill(); throw error; }
}
export async function load(page, url, scene, trial=false) {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${url}/?scene=${scene}&capture=1${trial?'&trial=1':''}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__REDLINE__?.ready);
  await page.evaluate(tick => window.__REDLINE__.setTick(tick), ['arena','perf-worst'].includes(scene)?80:120);
  if (errors.length) throw new Error(errors.join('\n'));
  return errors;
}
