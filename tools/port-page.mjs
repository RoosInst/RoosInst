#!/usr/bin/env node
/**
 * Phase 3 helper: port src-legacy/<name>.html to src/pages/<name>.astro on
 * the shared Base layout.
 *
 *   node tools/port-page.mjs legal terms privacy      # write + git rm legacy
 *   node tools/port-page.mjs --dry legal              # report only
 *
 * It refuses (exit 1, nothing written) when a page doesn't fit the layout
 * exactly: a header that differs from Header.astro beyond whitespace, <head>
 * tags it can't place, content after the footer placeholder. Those pages are
 * ported by hand. The visual check is still the real test.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const names = args.filter((a) => !a.startsWith('--'));

const squash = (s) => s.replace(/\s+/g, ' ').replace(/\s*\/>/g, '>').replace(/> </g, '><').trim();

// <head> tags Base.astro already emits (compared whitespace-insensitively).
const BASE_HEAD = new Set([
  '<meta charset="utf-8">',
  '<link rel="stylesheet" href="/css/fontawesome-svg.min.css">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<meta name="author" content="Roos Instruments, Inc.">',
  '<meta name="theme-color" content="#f0f0f0">',
  '<link rel="icon" href="/images/favicon.png">',
  '<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400%7CQuando%7CMichroma&display=swap" rel="stylesheet">',
  '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">',
  '<link href="/css/roos-min.css?v3" rel="stylesheet" id="pageTheme">',
  '<link href="/css/roos-print.css?v2" rel="stylesheet" media="print">',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>',
  '<script defer src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>',
  '<script defer src="/js/roos.min.js?v3"></script>',
].map(squash));
// Index of roos-min.css in the list above: page tags that came before it in
// the legacy <head> would now come after it, which can change the cascade.
const THEME = squash('<link href="/css/roos-min.css?v3" rel="stylesheet" id="pageTheme">');

const decode = (s) => {
  const out = s.replace(/&(amp|quot|#39|apos|lt|gt);/g, (_, e) => ({ amp: '&', quot: '"', '#39': "'", apos: "'", lt: '<', gt: '>' })[e]);
  if (/&#?\w+;/.test(out)) throw new Error(`unhandled entity in "${s}"`);
  return out;
};
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))?.slice(1).find((v) => v !== undefined);

/** Make legacy HTML safe as an Astro template: raw <script>/<style>, literal braces. */
function toTemplate(html) {
  const parts = html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/i);
  return parts.map((p, i) => {
    if (i % 2) return p.replace(/^<(script|style)\b/i, (m) => `${m} is:inline`);
    return p.replace(/[{}]/g, (c) => `{'${c}'}`);
  }).join('');
}

const headerRef = squash(
  readFileSync(join(root, 'src/components/Header.astro'), 'utf8')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/ class=\{cls\("[^"]*"(?:, "([^"]*)")?\)\}/g, (_, c) => (c ? ` class="${c}"` : '')),
);

function port(name) {
  const src = join(root, 'src-legacy', `${name}.html`);
  const html = readFileSync(src, 'utf8');
  const problems = [];

  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const title = decode(head.match(/<title>([\s\S]*?)<\/title>/i)[1].trim());
  const tags = head.match(/<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<title>[\s\S]*?<\/title>|<[a-z]+\b[^>]*>/gi) ?? [];
  let description, canonical;
  const active = [];
  const extra = [];
  let pastTheme = false;
  for (const t of tags) {
    const sq = squash(t);
    if (sq === THEME) pastTheme = true;
    if (t.startsWith('<!--') || /^<title>/i.test(t) || BASE_HEAD.has(sq)) continue;
    if (/^<meta\s+name="description"/i.test(t)) { description = decode(attr(t, 'content')); continue; }
    if (/^<link\s+rel="canonical"/i.test(t)) { canonical = attr(t, 'href'); continue; }
    const navOnly = /^<script>\s*document\.addEventListener\("DOMContentLoaded", function \(\) \{((?:\s*document\.getElementById\("nav-[\w-]+"\)\.classList\.add\("active"\);)+)\s*\}\);\s*<\/script>$/.exec(t);
    if (navOnly) { active.push(...[...navOnly[1].matchAll(/"(nav-[\w-]+)"/g)].map((m) => m[1])); continue; }
    if (!pastTheme) problems.push(`head tag before roos-min.css would move after it: ${sq.slice(0, 100)}`);
    extra.push(t.trim());
  }
  if (!description) problems.push('no meta description');

  const bodyStart = html.indexOf('<body');
  const end = html.indexOf('HEADER - END');
  const endComment = html.indexOf('-->', end) + 3;
  const header = html.slice(html.indexOf('<!--', html.indexOf('id="page-wrapper"')), endComment);
  const wrapper = html.slice(bodyStart, html.indexOf('<!--', html.indexOf('id="page-wrapper"')));
  if (squash(header).replace(' rel="noopener"', '') !== headerRef) problems.push('header differs from Header.astro');
  if (squash(wrapper) !== squash(`<body>
  <noscript><div class="alert alert-danger"><div class="text-center"><strong>Notice: </strong> JavaScript is not enabled, affecting site navigation.<a href="https://enable-javascript.com/" class="btn btn-default">Please Enable JavaScript</a></div></div></noscript>
  <div id="page-wrapper" class="page-boxed">`)) problems.push('body/noscript/#page-wrapper opening differs');

  let rest = html.slice(endComment).replace(/^\s*<!-- TOP END[^>]*-->/, '');
  const slot = '<div class="bottom"></div>';
  const at = rest.lastIndexOf(slot);
  if (at < 0) problems.push('no footer placeholder');
  const tail = rest.slice(at + slot.length);
  if (squash(tail) !== '</div></body></html>') problems.push(`unexpected content after footer: ${squash(tail).slice(0, 80)}`);
  const content = rest.slice(0, at).replace(/^\s*\n/, '').replace(/\s+$/, '');
  // Astro needs balanced markup; browsers silently close what a page leaves
  // open. Fix these by hand, closing where the browser would have.
  for (const tag of ['div', 'section']) {
    const opens = (content.match(new RegExp(`<${tag}\\b`, 'gi')) ?? []).length;
    const closes = (content.match(new RegExp(`</${tag}>`, 'gi')) ?? []).length;
    if (opens !== closes) problems.push(`content has ${opens} <${tag}> but ${closes} </${tag}>`);
  }
  if (/id="page-wrapper"/.test(content)) problems.push('content has a second #page-wrapper');

  const defaultCanonical = `https://roos.com/${name}.html`;
  const props = [
    `title={${JSON.stringify(title)}}`,
    `description={${JSON.stringify(description)}}`,
    ...(canonical && canonical !== defaultCanonical ? [`canonical={${JSON.stringify(canonical)}}`] : []),
    ...(active.length ? [`active={${JSON.stringify(active)}}`] : []),
  ];
  if (!canonical) problems.push('no canonical (Base will add the default one)');

  const out = `---
import Base from '../layouts/Base.astro';
---
<Base ${props.join('\n  ')}>
${extra.length ? `  <Fragment slot="head">\n${extra.map((t) => '    ' + toTemplate(t)).join('\n')}\n  </Fragment>\n` : ''}${toTemplate(content)}
</Base>
`;
  return { out, problems, extra };
}

let failed = false;
for (const name of names) {
  const { out, problems, extra } = port(name);
  const dest = join(root, 'src/pages', `${name}.astro`);
  console.log(`${name}: ${problems.length ? 'REFUSED' : 'ok'}${extra.length ? ` (${extra.length} head tag(s) to slot)` : ''}`);
  for (const p of problems) console.log(`  - ${p}`);
  if (problems.length) { failed = true; continue; }
  if (dry) continue;
  if (existsSync(dest)) throw new Error(`${dest} exists`);
  writeFileSync(dest, out);
  execFileSync('git', ['rm', '-q', join('src-legacy', `${name}.html`)], { cwd: root });
}
process.exit(failed ? 1 : 0);
