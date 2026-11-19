// Minimal CDP harness: open(url, {width, scheme}) -> {send, eval, key, type, click, shot, close}
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export async function open(src, { width = 1280, height = 800, scheme = 'light' } = {}) {
  const url = /^[a-z]+:/i.test(src) ? src : pathToFileURL(resolve(src)).href;
  const tmp = mkdtempSync(join(tmpdir(), 'cdp-'));
  const browser = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${tmp}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const port = await new Promise((ok) => { let log = ''; browser.stderr.on('data', (d) => { log += d; const m = log.match(/ws:\/\/[^:]+:(\d+)\//); if (m) ok(m[1]); }); });
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((ok) => (ws.onopen = ok));
  let id = 0; const pending = new Map(); let onLoad;
  ws.onmessage = ({ data }) => { const m = JSON.parse(data); if (m.id) { const p = pending.get(m.id); m.error ? p.fail(new Error(m.error.message)) : p.ok(m.result); } else if (m.method === 'Page.loadEventFired') onLoad?.(); else if (m.method === 'Log.entryAdded') console.log('LOG', m.params.entry.level, m.params.entry.text); };
  const send = (method, params = {}) => new Promise((ok, fail) => { pending.set(++id, { ok, fail }); ws.send(JSON.stringify({ id, method, params })); });
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 768 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await send('Page.enable');
  const loaded = new Promise((ok) => (onLoad = ok));
  await send('Page.navigate', { url }); await loaded;
  const ev = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
  await ev('document.fonts.ready.then(()=>1)');
  const key = async (k, code = k, vk = 0) => { for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk }); };
  const tab = (shift) => send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: shift ? 8 : 0 }).then(() => send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: shift ? 8 : 0 }));
  const type = async (text) => { for (const ch of text) { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ch, text: ch }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ch }); } };
  const click = async (sel) => { const r = await ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)}); e.scrollIntoView({block:'center'}); const b=e.getBoundingClientRect(); return [b.x+b.width/2,b.y+b.height/2]})()`); for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: r[0], y: r[1], button: 'left', clickCount: 1 }); };
  const shot = async (file, clip) => { const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); writeFileSync(file, Buffer.from(data, 'base64')); };
  const close = async () => { ws.close(); if (browser.exitCode === null) await new Promise((ok) => { browser.once('exit', ok); browser.kill(); }); rmSync(tmp, { recursive: true, force: true }); };
  return { send, ev, key, tab, type, click, shot, close };
}
