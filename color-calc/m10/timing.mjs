// Run: node timing.mjs <signup.html>. Output for module-09 and module-10 in timing-module-*.txt (Chrome 157).
// Tests when :user-invalid starts to match in headless Chrome, with real key and mouse events.
import { open } from './cdp.mjs';
const page = process.argv[2];
const p = await open(page, { width: 1280 });
const state = async (label) => {
  const v = await p.ev(`[...document.querySelectorAll('form input, form select')].map(e => (e.id) + ':' + (e.matches(':user-invalid') ? 'UI' : e.matches(':invalid') ? 'inv' : 'ok') + (e.type!=='checkbox'&&e.value&&e.tagName==='INPUT' ? '['+e.value+']' : '')).join(' ') + '  focus=' + document.activeElement.id`);
  console.log(label.padEnd(58), v);
};
await state('0 page loaded');
await p.click('#name'); await state('1 click Full name');
await p.tab(); await state('2 Tab without typing (to Email)');
await p.type('dana'); await state('3 type "dana" in Email, still focused');
await p.tab(); await state('4 Tab out of Email');
await p.tab(true); await state('5 Shift+Tab back into Email');
await p.key('End','End',35); await p.type('@example.co'); await state('6 type "@example.co" (valid now), still focused');
await p.click('#username'); await p.type('Dana'); await p.tab(); await state('7 type "Dana" in Username, Tab');
await p.click('#terms'); await state('8 click the checkbox (checked)');
await p.click('#terms'); await state('9 click it again (unchecked)');
await p.ev('document.querySelector("#username").blur()'); await p.click('#password'); await p.type('short'); await state('10 type "short" in Password, still focused');
for (const ch of 'enough1') { await p.type(ch); } await state('11 type 7 more characters (12 now), still focused');
await p.click('button[type=submit]'); await state('12 click Create account');
console.log('url still', await p.ev('location.pathname.split("/").pop()'));
await p.close();
