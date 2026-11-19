// Finds the narrowest viewport (>= 576) at which the header stays one 64px row, with the menu turned off.
import { open } from '../m10/cdp.mjs';
const [dir] = process.argv.slice(2);
const p = await open(`${dir}/settings.html`, { width: 1280 });
for (let w = +(process.argv[3]||560); w <= +(process.argv[4]||760); w += +(process.argv[5]||4)) {
  await p.send('Emulation.setDeviceMetricsOverride', { width: w, height: 800, deviceScaleFactor: 1, mobile: false });
  const h = await p.ev(`new Promise(r=>requestAnimationFrame(()=>r(document.querySelector('.site-header').getBoundingClientRect().height)))`);
  const menu = await p.ev(`getComputedStyle(document.querySelector('.menu-button')).display`);
  console.log(w, h, menu);
}
await p.close();
