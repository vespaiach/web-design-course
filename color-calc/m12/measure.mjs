// Module 12 checks: no sideways scroll, header height and menu state, on all six pages.
// Run: node measure.mjs states/s7 > measure-output.txt
import { open } from '../m10/cdp.mjs';
const [dir] = process.argv.slice(2);
for (const w of [320, 390, 703, 704, 1280]) for (const page of ['index.html', 'article.html', 'signup.html', 'settings.html', 'pricing.html', 'system.html']) {
  const p = await open(`${dir}/${page}`, { width: w });
  const r = await p.ev(`({scrollW: document.documentElement.scrollWidth,
    header: Math.round(document.querySelector('.site-header').getBoundingClientRect().height*100)/100,
    menu: getComputedStyle(document.querySelector('.menu-button')).display,
    current: document.querySelector('[aria-current="page"]')?.textContent.trim() ?? null})`);
  console.log(w, page, JSON.stringify(r));
  await p.close();
}
