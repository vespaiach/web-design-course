// Figure 13 of Module 10: types a valid email and "Dana" with real key events, leaves the field, and saves a 390px shot.
// Run from lab/: node ../color-calc/m10/final.mjs module-10/signup.html out.webp dark  (then crop 0 0 390 885)
import { open } from './cdp.mjs';
import { execFileSync } from 'node:child_process';
const [page, out, scheme] = process.argv.slice(2);
const p = await open(page, { width: 390, height: 900, scheme });
await p.click('#email'); await p.type('dana@example.com');
await p.click('#username'); await p.type('Dana'); await p.click('#password');
await p.ev('document.activeElement.blur()');
await p.ev('scrollTo(0,0)');
const h = await p.ev('Math.ceil(document.documentElement.getBoundingClientRect().height)');
await p.shot(out + '.png', { x: 0, y: 0, width: 390, height: h });
execFileSync('cwebp', ['-quiet', '-q', '85', out + '.png', '-o', out]);
console.log(out, h);
await p.close();
