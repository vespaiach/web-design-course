#!/usr/bin/env node
// Screenshot a page as .webp with headless Chrome. No npm packages needed (Node 22+, cwebp).
// Usage: node screenshot.mjs <page.html|url> <out.webp> [width=1280] [height]
//   No height: the full page. With height: only the first <height> px (a fixed crop).
//   Widths under 768 emulate a phone (the viewport meta tag applies).
//   CHROME=/path/to/chrome and CWEBP=/path/to/cwebp override the defaults.
//   VISION=achromatopsia (or another DevTools vision deficiency) emulates it, as DevTools' Rendering tab does.
//   SCHEME=light or SCHEME=dark emulates prefers-color-scheme, as DevTools' Rendering tab does. Without it, Chrome follows the OS.
//   EVAL='<js>' runs a script in the page after it loads (a returned promise is awaited), e.g. to click a button.
//   FORCE='<selector>=<state>[,<state>][;…]' forces :hover, :active, :focus, :focus-visible…, as DevTools' :hov panel does.
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [src, out, w = '1280', h] = process.argv.slice(2);
if (!src || !out) {
  console.error('Usage: node screenshot.mjs <page.html|url> <out.webp> [width=1280] [height]');
  process.exit(1);
}
const width = Number(w);
const url = /^[a-z]+:/i.test(src) ? src : pathToFileURL(resolve(src)).href;
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = mkdtempSync(join(tmpdir(), 'shot-'));

const browser = spawn(chrome, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${tmp}`,
  '--hide-scrollbars', '--no-first-run', 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

try {
  const port = await new Promise((ok, fail) => {
    let log = '';
    browser.stderr.on('data', (d) => {
      log += d;
      const m = log.match(/ws:\/\/[^:]+:(\d+)\//);
      if (m) ok(m[1]);
    });
    browser.on('exit', () => fail(new Error(`Chrome exited:\n${log}`)));
  });
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((ok) => (ws.onopen = ok));

  let id = 0;
  const pending = new Map();
  let onLoad;
  ws.onmessage = ({ data }) => {
    const m = JSON.parse(data);
    if (m.id) {
      const p = pending.get(m.id);
      m.error ? p.fail(new Error(m.error.message)) : p.ok(m.result);
    } else if (m.method === 'Page.loadEventFired') onLoad?.();
  };
  const send = (method, params = {}) =>
    new Promise((ok, fail) => {
      pending.set(++id, { ok, fail });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const viewHeight = Number(h) || 800;
  await send('Emulation.setDeviceMetricsOverride', {
    width, height: viewHeight, deviceScaleFactor: 1, mobile: width < 768,
  });
  if (process.env.VISION) await send('Emulation.setEmulatedVisionDeficiency', { type: process.env.VISION });
  if (process.env.SCHEME) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: process.env.SCHEME }] });
  await send('Page.enable');
  const loaded = new Promise((ok) => (onLoad = ok));
  await send('Page.navigate', { url });
  await loaded;
  await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
  if (process.env.EVAL) await send('Runtime.evaluate', { expression: process.env.EVAL, awaitPromise: true });
  if (process.env.FORCE) {
    await send('DOM.enable');
    await send('CSS.enable');
    const { root } = await send('DOM.getDocument');
    for (const part of process.env.FORCE.split(';')) {
      const at = part.lastIndexOf('='); // the selector may contain "=" itself
      const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: part.slice(0, at) });
      if (!nodeId) throw new Error(`FORCE: nothing matches ${part.slice(0, at)}`);
      await send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: part.slice(at + 1).split(',') });
    }
  }

  // The <html> box, not the layout metrics: a phone page wider than the screen stretches the layout viewport.
  const { result } = await send('Runtime.evaluate', {
    expression: 'Math.ceil(document.documentElement.getBoundingClientRect().height)', returnByValue: true,
  });
  const height = h ? viewHeight : result.value;
  const { data } = await send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height, scale: 1 },
  });
  const png = join(tmp, 'shot.png');
  writeFileSync(png, Buffer.from(data, 'base64'));
  execFileSync(process.env.CWEBP || 'cwebp', ['-quiet', '-q', '85', png, '-o', out]);
  console.log(`${out}  ${width}x${height}`);
  ws.close();
} finally {
  if (browser.exitCode === null) await new Promise((ok) => { browser.once('exit', ok); browser.kill(); });
  rmSync(tmp, { recursive: true, force: true });
}
