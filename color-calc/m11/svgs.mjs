// Draws Figures 2 and 3 of Module 11 as SVG from the published numbers. Run: node svgs.mjs <post folder>
import { writeFileSync } from 'node:fs';
const out = process.argv[2];
const W = 680, H = 380, x0 = 70, x1 = 560, y0 = 320, y1 = 40;
const f = (v) => +v.toFixed(1);
const axes = (xmax, xticks, xlabel) => {
  const X = (n) => f(x0 + (n / xmax) * (x1 - x0)), Y = (p) => f(y0 - (p / 100) * (y0 - y1));
  let s = `<rect width="${W}" height="${H}" fill="#ffffff"/>\n<g font-family="Inter, Arial, sans-serif" font-size="14" fill="#222222">\n`;
  for (const p of [0, 25, 50, 75, 100]) s += `<line x1="${x0}" y1="${Y(p)}" x2="${x1}" y2="${Y(p)}" stroke="#e8e8e8"/><text x="${x0 - 10}" y="${Y(p) + 5}" text-anchor="end">${p}%</text>\n`;
  for (const n of xticks) s += `<text x="${X(n)}" y="${y0 + 22}" text-anchor="middle">${n}</text>\n`;
  s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="#5d5d5d"/>\n`;
  s += `<text x="${(x0 + x1) / 2}" y="${y0 + 48}" text-anchor="middle">${xlabel}</text>\n`;
  s += `<text x="20" y="${(y0 + y1) / 2}" text-anchor="middle" transform="rotate(-90 20 ${(y0 + y1) / 2})">Share of known problems found</text>\n`;
  return { s, X, Y };
};

// Figure 3: Nielsen and Molich (1990), Table 4
{
  const sizes = [1, 2, 3, 5, 10];
  const data = { Teledata: [51, 71, 81, 90, 97], Mantel: [38, 52, 60, 70, 83], Savings: [26, 41, 50, 63, 78], Transport: [20, 33, 42, 55, 71] };
  const colors = ['#0078cd', '#222222', '#d02c2a', '#5d5d5d'];
  let { s, X, Y } = axes(10, sizes, 'Number of evaluators whose findings are combined');
  Object.entries(data).forEach(([name, v], i) => {
    s += `<polyline fill="none" stroke="${colors[i]}" stroke-width="2.5" points="${sizes.map((n, k) => `${X(n)},${Y(v[k])}`).join(' ')}"/>\n`;
    s += sizes.map((n, k) => `<circle cx="${X(n)}" cy="${Y(v[k])}" r="4" fill="${colors[i]}"/>`).join('') + '\n';
    s += `<text x="${X(10) + 10}" y="${Y(v[4]) + 5}" fill="${colors[i]}">${name} ${v[4]}%</text>\n`;
  });
  s += `<text x="${X(1) + 8}" y="${Y(20) + 22}" fill="#5d5d5d">One evaluator: 20% to 51%</text>\n</g>`;
  writeFileSync(`${out}/evaluators.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Share of known problems found by 1, 2, 3, 5 and 10 evaluators in four experiments">\n${s}\n</svg>\n`);
}

// Figure 4: the model 1 - 0.69^n (NN/g, 2000) and Faulkner (2003), Table 2
{
  const ns = [1, 5, 10, 15, 20];
  let { s, X, Y } = axes(20, ns, 'Number of users in one test');
  const pts = []; for (let n = 1; n <= 20; n++) pts.push(`${X(n)},${Y(100 * (1 - 0.69 ** n))}`);
  s += `<polyline fill="none" stroke="#0078cd" stroke-width="2.5" points="${pts.join(' ')}"/>\n`;
  s += `<text x="${X(10.5)}" y="${Y(38)}" fill="#0078cd">Line: the model, 84% at 5 users</text>\n`;
  const faulkner = { 5: [85.55, 55], 10: [94.69, 82], 15: [97.05, 90], 20: [98.4, 95] };
  for (const [n, [mean, min]] of Object.entries(faulkner)) {
    s += `<line x1="${X(+n)}" y1="${Y(mean)}" x2="${X(+n)}" y2="${Y(min)}" stroke="#d02c2a" stroke-width="2"/>`;
    s += `<rect x="${X(+n) - 4}" y="${Y(mean) - 4}" width="8" height="8" fill="#d02c2a"/>`;
    s += `<rect x="${X(+n) - 4}" y="${Y(min) - 4}" width="8" height="8" fill="#ffffff" stroke="#d02c2a" stroke-width="2"/>\n`;
  }
  s += `<text x="${X(5) + 10}" y="${Y(55) + 5}" fill="#d02c2a">Faulkner: worst set of 5 found 55%</text>\n`;
  s += `<text x="${X(10.5)}" y="${Y(28)}" fill="#d02c2a">Filled square: Faulkner's mean of 100 sets</text>\n`;
  s += `<text x="${X(10.5)}" y="${Y(28) + 20}" fill="#d02c2a">Open square: her lowest set</text>\n</g>`;
  writeFileSync(`${out}/five-users.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="The five-user model curve against Faulkner's measured means and lowest samples">\n${s}\n</svg>\n`);
}
