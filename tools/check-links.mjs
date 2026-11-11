// Case-sensitive internal link check over a build: node tools/check-links.mjs [dist]
// roos.com (Domino) and Windows ignore case; most hosts don't. Every href/src that
// points into the site must name a file in the build exactly. Paths the static build
// doesn't serve (Domino apps: *.nsf, /docs, /cables, ...) are listed in DOMINO below.
// Exit 1 on any CASE mismatch or MISSING file.
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ?? 'dist';
// First path segments served by the Domino backend, not by the static build.
const DOMINO = new Set((process.env.LINKS_DOMINO ??
  '5G,Cassini,accessories,apps,cables,category,commerce,docs,help,parts,phpvirtualbox,refGuide,rik,services').split(','));

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(path.relative(root, p).split(path.sep).join('/'));
  }
})(root);
const exact = new Set(files);
const lower = new Map(files.map((f) => [f.toLowerCase(), f]));

const problems = new Map();
const pages = files.filter((f) => f.endsWith('.html') && !path.posix.basename(f).startsWith('_') && f !== 'sitemap.html');
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  for (const m of html.matchAll(/\s(?:href|src|data-src)\s*=\s*["']([^"'#?]*)/gi)) {
    let u = m[1].trim();
    const abs = /^(?:https?:)?\/\/(?:www\.)?roos\.com(\/|$)/i;
    if (abs.test(u)) u = '/' + u.replace(abs, '');
    else if (u === '' || /^([a-z][a-z0-9+.-]*:|\/\/|\$|\{|`)/i.test(u)) continue;
    let target = u.startsWith('/') ? u.slice(1) : path.posix.join(path.posix.dirname(page), u);
    try { target = decodeURI(target); } catch {}
    if (target === '' || DOMINO.has(target.split('/')[0]) || /\.nsf(\/|$)/i.test(target)) continue;
    if (exact.has(target) || exact.has(target.replace(/\/?$/, '/index.html'))) continue;
    const key = lower.has(target.toLowerCase())
      ? `CASE     ${target} -> ${lower.get(target.toLowerCase())}`
      : `MISSING  ${target}`;
    if (!problems.has(key)) problems.set(key, new Set());
    problems.get(key).add(page);
  }
}

for (const [key, from] of [...problems].sort()) console.log(`${key}   <- ${[...from].join(' ')}`);
console.log(`${pages.length} pages checked, ${problems.size} problem link(s).`);
process.exit(problems.size ? 1 : 0);
