import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
async function scan(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = `${path}/${entry.name}`;
    assert.ok(!/(?:spirit-call|reference|debug|workbench)/i.test(entry.name), `Unexpected bundle asset ${file}`);
    assert.ok(!/\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(entry.name), `Private audio leaked in ${file}`);
    if (entry.isDirectory()) await scan(file);
    else if (/\.(?:js|html|css)$/.test(file)) { const text = await readFile(file, 'utf8'); assert.ok(!/__REDLINE__|Scene workbench|ref\/spirit-call|art\/targets/.test(text), `Debug/reference leaked in ${file}`); }
  }
}
await scan('dist'); console.log('Production bundle excludes reference assets and debug API.');
