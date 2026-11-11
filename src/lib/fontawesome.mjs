/**
 * Build-time FontAwesome: turns <i class="fa-solid fa-flag"></i> into the
 * inline <svg> that fontawesome.all.min.js used to swap in after page load
 * (which reflowed the navbar ~1.5 s in). Markup matches FA 6.7.2's i2svg
 * output; styling comes from FA's own svg-with-js.css, which the script used
 * to inject into <head>.
 *
 * Unknown icon names throw. FA's script renders a pulsing "?" for them,
 * which is never what a page wants.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const FAMILY_BY_CLASS = {
  fa: 'solid', fas: 'solid', 'fa-solid': 'solid',
  far: 'regular', 'fa-regular': 'regular',
  fab: 'brands', 'fa-brands': 'brands',
};
const PREFIX = { solid: 'fas', regular: 'far', brands: 'fab' };

// FA classes that modify an icon rather than name it.
const MODIFIER = /^fa-(fw|xs|sm|lg|xl|2xs|2xl|[1-9]0?x|border|inverse|li|ul|pull-(left|right|start|end)|spin|spin-pulse|spin-reverse|pulse|beat|beat-fade|bounce|fade|flip|shake|rotate-(90|180|270|by)|flip-(horizontal|vertical|both)|stack|stack-[12]x|width-auto)$/;

let index;
function icons() {
  if (index) return index;
  const meta = require('@fortawesome/fontawesome-free/metadata/icon-families.json');
  const byName = new Map();
  for (const [name, icon] of Object.entries(meta)) {
    const styles = icon.svgs?.classic ?? {};
    const entry = { name, styles };
    byName.set(name, entry);
    for (const alias of icon.aliases?.names ?? []) if (!byName.has(alias)) byName.set(alias, entry);
  }
  return (index = byName);
}

const escapeAttr = (v, q) => v.replace(/&(?!#?\w+;)/g, '&amp;').replaceAll(q, q === '"' ? '&quot;' : '&#39;');

function parseAttrs(src) {
  const attrs = [];
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = re.exec(src))) attrs.push([m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? '']);
  return attrs;
}

/**
 * The <svg> for one <i> tag, or null if the tag isn't a FontAwesome icon
 * (no family class), which is what FA's script does too.
 * @param {string} attrSrc everything between `<i` and `>`
 * @param {string} where for error messages
 */
export function iconSvg(attrSrc, where = '') {
  const quote = /class\s*=\s*'/.test(attrSrc) ? "'" : '"';
  const attrs = parseAttrs(attrSrc);
  const classes = (attrs.find(([k]) => k === 'class')?.[1] ?? '').split(/\s+/).filter(Boolean);

  const familyClass = classes.find((c) => c in FAMILY_BY_CLASS);
  if (!familyClass) return null;
  const family = FAMILY_BY_CLASS[classes.findLast((c) => c in FAMILY_BY_CLASS && c !== 'fa') ?? familyClass];

  const nameClasses = classes.filter((c) => c.startsWith('fa-') && !(c in FAMILY_BY_CLASS) && !MODIFIER.test(c));
  if (nameClasses.length !== 1) {
    throw new Error(`FontAwesome: expected one icon name in class="${classes.join(' ')}"${where}`);
  }
  const requested = nameClasses[0].slice(3);
  const icon = icons().get(requested);
  const svg = icon?.styles[family];
  if (!svg) {
    throw new Error(`FontAwesome 6.7.2 has no ${family} icon "${requested}"${where}`);
  }

  const extra = classes.filter((c) => !c.startsWith('fa-') && !(c in FAMILY_BY_CLASS));
  const modifiers = classes.filter((c) => MODIFIER.test(c));
  const q = quote;
  const a = (k, v) => ` ${k}=${q}${escapeAttr(v, q)}${q}`;

  let out = `<svg${a('class', ['svg-inline--fa', `fa-${icon.name}`, ...extra, ...modifiers].join(' '))}`;
  const title = attrs.find(([k]) => k === 'title')?.[1];
  for (const [k, v] of attrs) {
    if (k === 'class' || k === 'title' || k === 'aria-hidden' || k.startsWith('data-fa-')) continue;
    out += a(k, v);
  }
  // A titled icon is meant to be announced, so FA only hides untitled ones.
  const ariaHidden = attrs.find(([k]) => k === 'aria-hidden')?.[1] ?? (title ? undefined : 'true');
  if (ariaHidden !== undefined) out += a('aria-hidden', ariaHidden);
  if (!title) out += a('focusable', 'false');
  out += a('data-prefix', PREFIX[family]) + a('data-icon', icon.name) + a('role', 'img');
  out += a('xmlns', 'http://www.w3.org/2000/svg') + a('viewBox', svg.viewBox.join(' '));
  out += '>';
  if (title) out += `<title>${title}</title>`;
  out += `<path${a('fill', 'currentColor')}${a('d', svg.path)}></path></svg>`;
  return out;
}

/**
 * Replace every <i class="fa…">…</i> in a document, including ones inside
 * inline-script string literals (carousel arrows); the output reuses the
 * tag's own quote character so it stays a valid string.
 * @param {string} html
 * @param {string} name page name, for error messages
 */
export function inlineIcons(html, name = '') {
  return html.replace(/<i(\s[^>]*)?>([^<]*)<\/i>/g, (tag, attrSrc = '') => {
    return iconSvg(attrSrc, name ? ` (${name})` : '') ?? tag;
  });
}

/** The stylesheet FA's script injected; served from public/css/. */
export const FA_CSS_HREF = '/css/fontawesome-svg.min.css';
