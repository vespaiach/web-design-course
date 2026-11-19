import { open } from '../m10/cdp.mjs';
const [dir] = process.argv.slice(2);
for (const w of [320, 390, 1280]) for (const page of ['index.html','article.html','signup.html','settings.html']) {
  const p = await open(`${dir}/${page}`, { width: w });
  const r = await p.ev(`(()=>{const h=document.querySelector('.site-header').getBoundingClientRect();
    const box=(s)=>{const e=document.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect(); return [Math.round(b.x*10)/10,Math.round(b.y*10)/10,Math.round(b.width*10)/10,Math.round(b.height*10)/10]};
    return {scrollW: document.documentElement.scrollWidth, header: Math.round(h.height*100)/100, settings: box('.settings-link'), account: box('.account-nav'), signup: box('a[href="signup.html"]'), menu: box('.menu-button'), logo: box('.logo')}})()`);
  console.log(w, page, JSON.stringify(r));
  await p.close();
}
