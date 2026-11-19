// Draws the SVG figures of Module 6 from computed colors. Run from color-calc/: node m6/figures.mjs
import Color from "colorjs.io";
import { writeFileSync } from "node:fs";

const out = "../../../posts/web-design-for-developers-module-6/";
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => lin(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
const hex = c => new Color(c).toGamut({ space: "srgb", method: "css" }).to("srgb").toString({ format: "hex", collapse: false });
const r = n => Math.round(n * 10) / 10;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial, sans-serif" font-size="13">\n<rect width="${w}" height="${h}" fill="#fff"/>\n${body}</svg>\n`;
const text = (x, y, s, a = "") => `<text x="${r(x)}" y="${r(y)}" ${a}>${s}</text>`;
const rect = (x, y, w, h, fill, a = "") => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${fill}" ${a}/>`;

// Same scale definition as palette.mjs
const L = { 50: 0.97, 100: 0.93, 200: 0.87, 300: 0.80, 400: 0.72, 500: 0.64, 600: 0.56, 700: 0.48, 800: 0.40, 900: 0.32, 950: 0.25 };
const [, bC, bH] = new Color("#3ea6ff").to("oklch").coords;
const scale = (C, H) => Object.entries(L).map(([k, l]) => [k, hex(new Color("oklch", [l, C, H]))]);
const dark = hex(new Color("oklch", [0.25, 0, 0])); // neutral-950

// Figure 3: three tonal scales; each swatch shows white and neutral-950 text with their ratios.
{
  const rows = [
    ["neutral (chroma 0)", [["0", "#ffffff"], ...scale(0, 0)], ["0", "100", "300", "400", "700", "900", "950"]],
    ["blue (hue 248.4, chroma up to 0.161)", scale(bC, bH), ["300", "600"]],
    ["red (hue 27, chroma up to 0.2)", scale(0.2, 27), ["300", "600"]],
  ];
  const W = 62, X0 = 10;
  let b = "";
  rows.forEach(([label, steps, used], i) => {
    const y = 10 + i * 128;
    b += text(X0, y + 14, label, 'fill="#000"');
    steps.forEach(([k, h], j) => {
      const x = X0 + j * W;
      b += rect(x, y + 36, W - 4, 48, h, used.includes(k) ? 'stroke="#000" stroke-width="2"' : 'stroke="#ccc"');
      b += text(x + (W - 4) / 2, y + 30, k, 'text-anchor="middle" fill="#000" font-size="12"');
      b += text(x + 6, y + 66, "Aa", 'fill="#fff" font-size="15" font-weight="bold"');
      b += text(x + W - 10, y + 66, "Aa", `text-anchor="end" fill="${dark}" font-size="15" font-weight="bold"`);
      b += text(x + (W - 4) / 2, y + 98, h, 'text-anchor="middle" fill="#555" font-size="10"');
      b += text(x + (W - 4) / 2, y + 112, `${ratio("#ffffff", h).toFixed(2)} | ${ratio(dark, h).toFixed(2)}`, 'text-anchor="middle" fill="#555" font-size="10"');
    });
  });
  b += text(X0, 408, `Under each swatch: its hex, then the contrast ratio of white text | of neutral-950 (${dark}) text. Outlined: the steps the site uses.`, 'fill="#000" font-size="12"');
  writeFileSync(out + "tonal-scales.svg", svg(760, 420, b));
}

// Figure 4: four gray pairs, each 0.2 apart in OKLCH lightness.
{
  let b = "";
  [[1.0, 0.8], [0.8, 0.6], [0.4, 0.2], [0.3, 0.1]].forEach(([a, c], i) => {
    const ha = hex(new Color("oklch", [a, 0, 0])), hc = hex(new Color("oklch", [c, 0, 0]));
    const x = 10 + i * 172;
    b += rect(x, 10, 80, 70, ha, 'stroke="#ccc"') + rect(x + 80, 10, 80, 70, hc, 'stroke="#ccc"');
    b += text(x + 40, 98, `L ${a.toFixed(1)}`, 'text-anchor="middle" fill="#555" font-size="12"');
    b += text(x + 120, 98, `L ${c.toFixed(1)}`, 'text-anchor="middle" fill="#555" font-size="12"');
    b += text(x + 40, 113, ha, 'text-anchor="middle" fill="#555" font-size="11"');
    b += text(x + 120, 113, hc, 'text-anchor="middle" fill="#555" font-size="11"');
    b += text(x + 80, 138, `${ratio(ha, hc).toFixed(2)}:1`, 'text-anchor="middle" fill="#000" font-size="15"');
  });
  writeFileSync(out + "equal-steps.svg", svg(700, 150, b));
}
console.log("wrote tonal-scales.svg, equal-steps.svg");
