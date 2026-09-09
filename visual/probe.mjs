/**
 * Pre-flight: ask the live site which of our pages it actually serves.
 *
 * Runs before a baseline capture so a page that exists in src/ but was never
 * deployed shows up as one line of output instead of a screenshot timeout.
 * Writes pages.live.json, which the spec reads to decide what to shoot.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverPages, pathFor } from './pages.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const origin = (process.env.VISUAL_BASE_URL ?? 'https://roos.com').replace(/\/$/, '');
const CONCURRENCY = 8;

const { names, from } = discoverPages();
console.log(`Probing ${names.length} pages at ${origin}`);
console.log(`  sources: ${from}\n`);

const ok = [];
const missing = [];
const queue = [...names];

async function worker() {
  while (queue.length) {
    const name = queue.shift();
    const url = origin + pathFor(name);
    let status = 0;
    let note = '';
    try {
      const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20_000) });
      status = res.status;
      // A soft 404 -- server answers 200 with the error page -- is still missing.
      if (status === 200 && name !== '404') {
        const html = await res.text();
        if (/<title>[^<]*(404|Not Found)/i.test(html)) note = 'soft 404';
      }
    } catch (err) {
      note = err.name === 'TimeoutError' ? 'timeout' : err.message;
    }
    const good = status === 200 && !note;
    (good ? ok : missing).push({ name, status, note });
    console.log(`  ${good ? 'ok  ' : 'MISS'}  ${String(status).padStart(3)}  ${name}${note ? '  (' + note + ')' : ''}`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const byName = (a, b) => a.name.localeCompare(b.name);
ok.sort(byName);
missing.sort(byName);

writeFileSync(
  join(here, 'pages.live.json'),
  JSON.stringify({ origin, probedAt: new Date().toISOString(), ok: ok.map((p) => p.name), missing }, null, 2) + '\n'
);

console.log(`\n${ok.length} live, ${missing.length} not served.`);
if (missing.length) {
  console.log('Not baselined: ' + missing.map((m) => m.name).join(', '));
  console.log('(These are in src/ but not on the live site. They will be skipped.)');
}
