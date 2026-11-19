// Hand-written formulas (WCAG 2.2 relative luminance, Ottosson 2020 Oklab) cross-checked against colorjs.io and culori.
import Color from "colorjs.io";
import * as culori from "culori";
import { APCAcontrast, sRGBtoY } from "apca-w3";
import assert from "node:assert";

const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4); // WCAG 2.2 / CSS Color 4
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => lin(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const oklch = h => {
  const [r, g, b] = hex2rgb(h).map(v => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let H = (Math.atan2(B, A) * 180) / Math.PI; if (H < 0) H += 360;
  return [L, Math.hypot(A, B), H];
};
const apca = (fg, bg) => APCAcontrast(sRGBtoY(hex2rgb(fg)), sRGBtoY(hex2rgb(bg)));
const f = (n, d = 3) => Number(n).toFixed(d);
const okstr = h => { const [L, C, H] = oklch(h); return `oklch(${f(L)} ${f(C)} ${f(H, 1)})`; };
const hexOf = c => new Color(c).to("srgb").toString({ format: "hex", collapse: false });

// self-check: my Oklab matches colorjs.io, my ratio matches colorjs WCAG21
for (const h of ["#3ea6ff", "#ffff00", "#0000ff", "#777777"]) {
  const c = new Color(h).to("oklch").coords; const m = oklch(h);
  assert(Math.abs(c[0] - m[0]) < 1e-4 && Math.abs(c[1] - m[1]) < 1e-4, h);
  assert(Math.abs(new Color(h).contrast("#ffffff", "WCAG21") - ratio(h, "#ffffff")) < 2e-3) // colorjs uses full-precision XYZ Y coefficients, WCAG rounds to 0.2126/0.7152/0.0722;
}
console.log("self-check passed (hand formulas == colorjs.io", "0.7.1)\n");

console.log("## 1. Same HSL lightness (50%), different OKLCH L and WCAG luminance");
for (const [name, hsl] of [["red", "hsl(0 100% 50%)"], ["yellow", "hsl(60 100% 50%)"], ["green(lime)", "hsl(120 100% 50%)"], ["cyan", "hsl(180 100% 50%)"], ["blue", "hsl(240 100% 50%)"], ["magenta", "hsl(300 100% 50%)"]]) {
  const h = hexOf(hsl);
  console.log(`${name.padEnd(12)} ${hsl.padEnd(18)} ${h}  ${okstr(h)}  Y=${f(lum(h), 4)}  vs white ${f(ratio(h, "#ffffff"), 2)}:1  vs black ${f(ratio(h, "#000000"), 2)}:1`);
}

console.log("\n## 2. Brand color #3ea6ff");
const brand = "#3ea6ff";
console.log("oklch", okstr(brand), " hsl", new Color(brand).to("hsl").toString({ precision: 4 }), " Y", f(lum(brand), 4));
for (const t of ["#ffffff", "#000000", "#111111", "#0b1220", "#1f2937", "#333333"]) {
  console.log(`text ${t} on ${brand}: WCAG ${f(ratio(t, brand), 2)}:1  APCA Lc ${f(apca(t, brand), 1)}`);
}
for (const t of ["#ffffff"]) console.log(`text ${brand} on ${t}: WCAG ${f(ratio(brand, t), 2)}:1  APCA Lc ${f(apca(brand, t), 1)}`);
console.log(`text ${brand} on #121212: WCAG ${f(ratio(brand, "#121212"), 2)}:1  APCA Lc ${f(apca(brand, "#121212"), 1)}`);

console.log("\n## 3. Darken #3ea6ff in OKLCH (same C,H) until white text passes 4.5:1 and 3:1");
const [bL, bC, bH] = oklch(brand);
for (let L = 0.70; L >= 0.40; L -= 0.01) {
  const c = new Color("oklch", [L, bC, bH]); const inG = c.inGamut("srgb");
  const h = c.clone().toGamut({ space: "srgb", method: "css" }).toString({ format: "hex", collapse: false });
  const r = ratio("#ffffff", h);
  if (Math.abs(L - 0.70) < 1e-9 || (r >= 3 && r < 3.3) || (r >= 4.5 && r < 4.8)) console.log(`L=${f(L, 2)} -> ${h} (${inG ? "in sRGB" : "mapped"})  white text ${f(r, 2)}:1  APCA Lc(white on it) ${f(apca("#ffffff", h), 1)}`);
}

console.log("\n## 4. Tonal scale on hue of #3ea6ff (OKLCH, chroma capped then CSS-gamut-mapped to sRGB)");
const steps = { 50: 0.97, 100: 0.93, 200: 0.87, 300: 0.80, 400: 0.72, 500: 0.64, 600: 0.56, 700: 0.48, 800: 0.40, 900: 0.32, 950: 0.25 };
for (const [k, L] of Object.entries(steps)) {
  const want = new Color("oklch", [L, bC, bH]);
  const g = want.clone().toGamut({ space: "srgb", method: "css" });
  const h = g.toString({ format: "hex", collapse: false }); const got = oklch(h);
  console.log(`${k.padStart(3)}  L=${f(L, 2)} ${h}  actual ${okstr(h)}  inGamut@C=${f(bC)}:${want.inGamut("srgb")}  vs white ${f(ratio(h, "#ffffff"), 2)}  vs #0b1220 ${f(ratio(h, "#0b1220"), 2)}`);
}

console.log("\n## 5. contrast-color() style choice (WCAG ratio) and MDN's #2277d3 example");
for (const bg of [brand, "#2277d3", "#767676", "#777777", "#ff0000"]) {
  const w = ratio("#ffffff", bg), b = ratio("#000000", bg);
  console.log(`${bg}: white ${f(w, 2)}:1, black ${f(b, 2)}:1 -> higher WCAG: ${b > w ? "black" : "white"}; APCA Lc white ${f(apca("#ffffff", bg), 1)}, black ${f(apca("#000000", bg), 1)}`);
}

console.log("\n## 6. CSS Color 5 light-dark() example check");
console.log(`blue on white ${f(ratio("#0000ff", "#ffffff"), 2)}  blue on black ${f(ratio("#0000ff", "#000000"), 2)}  #81D9FE on black ${f(ratio("#81d9fe", "#000000"), 2)}`);

console.log("\n## 7. color-mix() spaces");
for (const sp of ["srgb", "oklab", "oklch", "lab", "xyz"]) {
  const m = Color.mix("white", "black", 0.5, { space: sp, outputSpace: "srgb" });
  const h = m.toString({ format: "hex", collapse: false });
  console.log(`white+black 50% in ${sp.padEnd(5)} -> ${h}  oklch L ${f(oklch(h)[0])}`);
}
for (const sp of ["srgb", "oklab", "oklch"]) {
  const m = Color.mix("#0000ff", "#ffff00", 0.5, { space: sp, outputSpace: "srgb" });
  const g = m.clone().toGamut({ space: "srgb", method: "css" }).toString({ format: "hex", collapse: false });
  console.log(`blue+yellow 50% in ${sp.padEnd(5)} -> ${g}  ${okstr(g)}`);
}
for (const [a, p] of [["white", 0.85], ["black", 0.30]]) {
  const m = Color.mix(brand, a, p, { space: "oklab", outputSpace: "srgb" }).toString({ format: "hex", collapse: false });
  console.log(`color-mix(in oklab, ${brand}, ${a} ${p * 100}%) -> ${m}  ${okstr(m)}  white text ${f(ratio("#ffffff", m), 2)}  #0b1220 text ${f(ratio("#0b1220", m), 2)}`);
}

console.log("\n## 8. Gamut: primaries");
for (const c of ["color(srgb 1 0 0)", "color(display-p3 1 0 0)", "color(srgb 0 1 0)", "color(display-p3 0 1 0)", "color(display-p3 1 1 0)"]) {
  const x = new Color(c); const o = x.to("oklch").coords;
  const s = x.to("srgb").coords.map(v => f(v, 4)).join(" ");
  const clip = x.clone().toGamut({ space: "srgb", method: "clip" }); const css = x.clone().toGamut({ space: "srgb", method: "css" });
  console.log(`${c.padEnd(24)} oklch(${f(o[0])} ${f(o[1])} ${f(o[2], 1)})  as srgb(${s})  clip ${clip.toString({ format: "hex", collapse: false })} ${okstr(clip.toString({ format: "hex", collapse: false }))}  css-map ${css.toString({ format: "hex", collapse: false })} ${okstr(css.toString({ format: "hex", collapse: false }))}`);
}
for (const c of ["oklch(0.7 0.3 150)", "oklch(0.65 0.25 30)", "oklch(0.7 0.18 250)"]) {
  const x = new Color(c);
  const clip = x.clone().toGamut({ space: "srgb", method: "clip" }).toString({ format: "hex", collapse: false });
  const css = x.clone().toGamut({ space: "srgb", method: "css" }).toString({ format: "hex", collapse: false });
  console.log(`${c}: in srgb ${x.inGamut("srgb")}, in p3 ${x.inGamut("p3")}; clip ${clip} ${okstr(clip)}; css-map ${css} ${okstr(css)}`);
}

console.log("\n## 9. Hue rotation 180deg (complement) of brand in HSL vs OKLCH");
const hslB = new Color(brand).to("hsl"); const comp = hslB.clone(); comp.coords[0] = (comp.coords[0] + 180) % 360;
const ch = comp.to("srgb").toString({ format: "hex", collapse: false });
console.log(`HSL complement ${ch} ${okstr(ch)} Y=${f(lum(ch), 4)}`);
const oc = new Color("oklch", [bL, bC, (bH + 180) % 360]);
console.log(`OKLCH complement inGamut ${oc.inGamut("srgb")}; mapped ${oc.clone().toGamut({ space: "srgb", method: "css" }).toString({ format: "hex", collapse: false })} ${okstr(oc.clone().toGamut({ space: "srgb", method: "css" }).toString({ format: "hex", collapse: false }))}`);
for (const dh of [30, -30, 120, 240]) {
  const hh = (bH + dh + 360) % 360; const c = new Color("oklch", [bL, bC, hh]);
  const m = c.clone().toGamut({ space: "srgb", method: "css" }).toString({ format: "hex", collapse: false });
  console.log(`OKLCH hue ${dh > 0 ? "+" : ""}${dh}: ${m} ${okstr(m)} (requested C ${f(bC)} in gamut: ${c.inGamut("srgb")})`);
}

console.log("\n## 10. Grayscale / CVD: red vs green status colors");
const sim = { deuteranopia: culori.filterDeficiencyDeuter(1), protanopia: culori.filterDeficiencyProt(1), tritanopia: culori.filterDeficiencyTrit(1) };
for (const h of ["#d32f2f", "#388e3c", "#e53935", "#43a047", brand, "#f59e0b"]) {
  const out = Object.entries(sim).map(([k, fn]) => `${k} ${culori.formatHex(fn(h))}`).join("  ");
  console.log(`${h} L=${f(oklch(h)[0])} Y=${f(lum(h), 4)}  ${out}`);
}
console.log(`#d32f2f vs #388e3c WCAG ${f(ratio("#d32f2f", "#388e3c"), 2)}:1 ; #e53935 vs #43a047 ${f(ratio("#e53935", "#43a047"), 2)}:1`);
const d1 = culori.formatHex(sim.deuteranopia("#d32f2f")), d2 = culori.formatHex(sim.deuteranopia("#388e3c"));
console.log(`deuteranopia sim: ${d1} vs ${d2}, deltaEOK ${f(new Color(d1).deltaE(d2, "OK"), 3)} (original deltaEOK ${f(new Color("#d32f2f").deltaE("#388e3c", "OK"), 3)})`);

console.log("\n## 11. Neutrals: pure vs near-black text, grays on white");
for (const [fg, bg] of [["#000000", "#ffffff"], ["#111111", "#ffffff"], ["#1f2937", "#ffffff"], ["#6b7280", "#ffffff"], ["#767676", "#ffffff"], ["#777777", "#ffffff"], ["#949494", "#ffffff"], ["#e5e5e5", "#121212"], ["#a3a3a3", "#121212"], ["#ffffff", "#121212"]]) {
  console.log(`${fg} on ${bg}: WCAG ${f(ratio(fg, bg), 3)}:1  APCA Lc ${f(apca(fg, bg), 1)}  fg ${okstr(fg)}`);
}
