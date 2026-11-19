// The comparison table on a phone, and the plans' box sizes. Run: node table.mjs states/s6
import { open } from '../m10/cdp.mjs';
const [dir] = process.argv.slice(2);
for (const w of [320, 390, 1280]) {
  const p = await open(`${dir}/pricing.html`, { width: w });
  console.log(w, JSON.stringify(await p.ev(`(()=>{const t=document.querySelector('.table-scroll');
    const rows=[...document.querySelectorAll('tbody tr')].map(r=>Math.round(r.getBoundingClientRect().height));
    const plans=[...document.querySelectorAll('.plan')].map(e=>{const b=e.getBoundingClientRect();return [Math.round(b.width),Math.round(b.height)]});
    const price=getComputedStyle(document.querySelector('.price')).fontSize, name=getComputedStyle(document.querySelector('.plan h2')).fontSize;
    return {box:t.clientWidth, table:t.scrollWidth, rows, plans, price, name}})()`)));
  await p.close();
}
