// Figure 11 and the timing numbers in Module 9: progress of two transitions over time.
// Run from color-calc/: node m9/motion.mjs > m9/motion-output.txt (writes the SVG to the module folder)
import { writeFileSync } from "node:fs";
import assert from "node:assert";

// cubic-bezier(x1, y1, x2, y2): the progress at a fraction x of the duration, as CSS Easing defines it
const bezier = (x1, y1, x2, y2) => (x) => {
  const B = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) { const t = (lo + hi) / 2; B(t, x1, x2) < x ? (lo = t) : (hi = t); }
  return B((lo + hi) / 2, y1, y2);
};
const curves = [
  { name: "ease-in, 600 ms", f: bezier(0.42, 0, 1, 1), ms: 600, color: "#d02c2a", dash: "6 4" },
  { name: "ease-out cubic-bezier(0, 0, 0.2, 1), 200 ms", f: bezier(0, 0, 0.2, 1), ms: 200, color: "#0078cd", dash: "" },
];
assert(Math.abs(curves[0].f(0.5) - bezier(0.42, 0, 1, 1)(0.5)) < 1e-9 && curves[1].f(1) > 0.999);
const at = (c, ms) => (ms >= c.ms ? 1 : c.f(ms / c.ms));
for (const c of curves) console.log(c.name.padEnd(48), [50, 100, 150, 200, 300, 400, 500].map((ms) => `${ms} ms ${(at(c, ms) * 100).toFixed(0)}%`).join("  "));

// SVG: x = time 0..600 ms, y = progress 0..100%, dots every 50 ms (one dot per 50 ms of the transition)
const W = 640, H = 320, L = 56, R = 16, T = 60, Bm = 48, w = W - L - R, h = H - T - Bm;
const X = (ms) => L + (ms / 600) * w, Y = (p) => T + h - p * h;
let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Inter, Arial, sans-serif" font-size="13">\n`;
s += `<rect width="${W}" height="${H}" fill="#ffffff"/>\n`;
for (let ms = 0; ms <= 600; ms += 100) s += `<line x1="${X(ms)}" y1="${T}" x2="${X(ms)}" y2="${T + h}" stroke="#e8e8e8"/><text x="${X(ms)}" y="${T + h + 18}" text-anchor="middle" fill="#5d5d5d">${ms}</text>\n`;
for (const p of [0, 0.5, 1]) s += `<line x1="${L}" y1="${Y(p)}" x2="${L + w}" y2="${Y(p)}" stroke="#e8e8e8"/><text x="${L - 8}" y="${Y(p) + 4}" text-anchor="end" fill="#5d5d5d">${p * 100}%</text>\n`;
s += `<text x="${L + w / 2}" y="${H - 8}" text-anchor="middle" fill="#5d5d5d">time after the click (ms)</text>\n`;
s += `<text x="12" y="${T + h / 2}" fill="#5d5d5d" transform="rotate(-90 12 ${T + h / 2})" text-anchor="middle">distance covered</text>\n`;
curves.forEach((c, i) => {
  const pts = [];
  for (let ms = 0; ms <= 600; ms += 5) pts.push(`${X(ms).toFixed(1)},${Y(at(c, ms)).toFixed(1)}`);
  s += `<polyline points="${pts.join(" ")}" fill="none" stroke="${c.color}" stroke-width="2.5"${c.dash ? ` stroke-dasharray="${c.dash}"` : ""}/>\n`;
  for (let ms = 0; ms <= c.ms; ms += 50) s += `<circle cx="${X(ms).toFixed(1)}" cy="${Y(at(c, ms)).toFixed(1)}" r="3.5" fill="${c.color}"/>\n`;
  s += `<line x1="${L + 8}" y1="${14 + i * 18}" x2="${L + 36}" y2="${14 + i * 18}" stroke="${c.color}" stroke-width="2.5"${c.dash ? ` stroke-dasharray="${c.dash}"` : ""}/><text x="${L + 44}" y="${18 + i * 18}" fill="#222222">${c.name}</text>\n`;
});
s += `</svg>\n`;
writeFileSync(new URL("../../../../posts/web-design-for-developers-module-9/motion-timing.svg", import.meta.url), s);
