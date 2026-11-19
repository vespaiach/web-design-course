// Esc on the phone menu (s3 vs s4), Esc on a native popover, and the header's accessible names.
import { open } from '../m10/cdp.mjs';
const esc = (p) => p.key('Escape', 'Escape', 27);
for (const s of process.argv.slice(2)) {
  const p = await open(`${s}/settings.html`, { width: 390 });
  await p.click('.menu-button');
  await new Promise((r) => setTimeout(r, 300));
  const before = await p.ev('document.querySelector(".menu-button").ariaExpanded');
  await p.tab(); // focus the first link in the menu
  const focused = await p.ev('document.activeElement.textContent.trim()');
  await esc(p);
  await new Promise((r) => setTimeout(r, 300));
  const after = await p.ev('document.querySelector(".menu-button").ariaExpanded');
  const active = await p.ev('document.activeElement.className || document.activeElement.tagName');
  const vis = await p.ev('getComputedStyle(document.querySelector(".site-header nav")).visibility');
  console.log(`${s}: menu open=${before}, focus on "${focused}", after Esc: aria-expanded=${after}, nav ${vis}, focus on ${active}`);
  await p.close();
}
// The browser's own popover and modal dialog
const p = await open('popover.html', { width: 390 });
await p.click('button');
const open1 = await p.ev('document.querySelector("#p").matches(":popover-open")');
await p.key('Escape', 'Escape', 27);
const open2 = await p.ev('document.querySelector("#p").matches(":popover-open")');
console.log(`native popover: open after click=${open1}, open after Esc=${open2}`);
await p.ev('document.querySelector("#d").showModal(); 1');
const d1 = await p.ev('document.querySelector("#d").open');
await p.key('Escape', 'Escape', 27);
const d2 = await p.ev('document.querySelector("#d").open');
console.log(`native modal dialog: open=${d1}, open after Esc=${d2}`);
console.log('Chrome', await p.ev('navigator.userAgent.match(/Chrome\\/[\\d.]+/)[0]'));
await p.close();
