#!/usr/bin/env node
/**
 * Thin wrapper around probe + playwright.
 *
 * Exists so the npm scripts stay single commands: chaining with && breaks in
 * cmd.exe when the repo path contains spaces and parentheses, which this one
 * does ("Dropbox (Personal)").
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { masksFingerprint } from './pages.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2] ?? 'visual';

const LIVE = process.env.VISUAL_LIVE_URL ?? 'https://roos.com';
const LOCAL = process.env.VISUAL_LOCAL_URL ?? 'http://localhost:4321';

// Run Playwright's CLI through node directly. Node 26 refuses to spawn the
// .cmd shim npx would resolve to, and shell:true would need the whole path
// escaped.
const PW_CLI = join(here, 'node_modules', 'playwright', 'cli.js');
if (!existsSync(PW_CLI)) {
  console.error('Playwright is not installed. Run: npm run visual:setup');
  process.exit(1);
}

function node(script, args, env) {
  const r = spawnSync(process.execPath, [script, ...args], {
    cwd: here,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (r.error) {
    console.error(r.error.message);
    process.exit(1);
  }
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const pwArgs = ['test', ...process.argv.slice(3)];
const stampFile = join(here, 'baseline', '.masks.json');

function writeStamp() {
  const body = { masks: masksFingerprint(), at: new Date().toISOString() };
  writeFileSync(stampFile, JSON.stringify(body, null, 2) + '\n');
}

/**
 * A masked region compared against an unmasked baseline reads as a
 * catastrophic layout break. Refuse to compare across a mask change.
 */
function checkStamp() {
  const now = masksFingerprint();
  const was = existsSync(stampFile)
    ? JSON.parse(readFileSync(stampFile, 'utf8')).masks
    : null;
  if (was === now) return;

  console.error('');
  console.error('Mask config changed since the baseline was captured.');
  console.error('  baseline: ' + (was ?? '(none recorded)'));
  console.error('  current:  ' + now);
  console.error('');
  console.error('Masked-vs-unmasked diffs look like the page exploded.');
  console.error('Recapture before comparing:');
  console.error('');
  console.error('  npm run baseline');
  console.error('');
  process.exit(1);
}

switch (mode) {
  case 'baseline':
    // Capture from the live site. This is the pre-migration reference.
    node(join(here, 'probe.mjs'), [], { VISUAL_BASE_URL: LIVE });
    node(PW_CLI, [...pwArgs, '--update-snapshots'], { VISUAL_BASE_URL: LIVE });
    writeStamp();
    break;

  case 'visual':
    // Compare a local build against the committed baseline.
    if (!existsSync(join(here, 'baseline'))) {
      console.error('No baseline yet. Run: npm run baseline');
      process.exit(1);
    }
    checkStamp();
    node(PW_CLI, pwArgs, { VISUAL_BASE_URL: LOCAL });
    break;

  case 'update':
    // Accept the local build's current rendering as the new reference.
    node(PW_CLI, [...pwArgs, '--update-snapshots'], { VISUAL_BASE_URL: LOCAL });
    writeStamp();
    break;

  default:
    console.error('Unknown mode "' + mode + '". Use: baseline | visual | update');
    process.exit(1);
}
