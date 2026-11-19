// Module 5 numbers: status labels before and after, figure data, critique colors.
// Same WCAG 2.2 luminance formula as ../calc.mjs; OKLCH, gamut checks and mapping from colorjs.io 0.7.1.
// Run from color-calc/: node m5/m5.mjs > m5/m5-output.txt
import Color from "colorjs.io";
import assert from "node:assert";

const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4); // CSS Color 4 / WCAG 2.2
const enc = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const rgb = c => new Color(c).to("srgb").coords;
const hex = c => new Color(c).toGamut({ space: "srgb", method: "css" }).to("srgb").toString({ format: "hex", collapse: false });
const lum = c => { const [r, g, b] = rgb(hex(c)).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const ok = c => new Color(hex(c)).to("oklch").coords.map(v => v || 0);
const okstr = c => { const [L, C, H] = ok(c); return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`; };
const gray = v => "#" + Math.round(255 * v).toString(16).padStart(2, "0").repeat(3);
const filterGray = c => { const [r, g, b] = rgb(hex(c)); return gray(0.2126 * r + 0.7152 * g + 0.0722 * b); }; // filter: grayscale(1)
const lumGray = c => gray(enc(lum(c)));                                                                     // same luminance
const okGray = c => hex(new Color("oklch", [ok(c)[0], 0, 0]));                                              // oklch(from c l 0 h)
const maxC = (L, H) => { let lo = 0, hi = 0.5; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; new Color("oklch", [L, m, H]).inGamut("srgb") ? (lo = m) : (hi = m); } return lo; };
const f = (n, d = 2) => n.toFixed(d);

assert(Math.abs(new Color("#3ea6ff").contrast("#ffffff", "WCAG21") - ratio("#3ea6ff", "#ffffff")) < 2e-3);
assert.equal(hex("hsl(60, 100%, 35%)"), "#b3b300"); // Chrome 157's computed value is rgb(179, 179, 0)

console.log("## A. Status labels before (computed values as Chrome 157 reports them)");
for (const c of ["hsl(120, 100%, 35%)", "hsl(60, 100%, 35%)", "hsl(0, 100%, 35%)"])
  console.log(`${c.padEnd(20)} ${hex(c)} ${okstr(c)} Y=${f(lum(c), 4)} white ${f(ratio(c, "#fff"))}:1 black ${f(ratio(c, "#000"))}:1  filter ${filterGray(c)} luminance ${lumGray(c)} oklch ${okGray(c)}`);

console.log("\n## B. Largest chroma inside sRGB, by OKLCH lightness, for hues 30, 85, 145");
for (let L = 0.45; L < 0.951; L += 0.05) {
  const cs = [30, 85, 145].map(H => maxC(L, H)); const g = hex(new Color("oklch", [L, 0, 0]));
  console.log(`L ${f(L)}  ${cs.map(c => f(c, 3)).join("  ")}  smallest ${f(Math.min(...cs), 3)}  gray ${g} white ${f(ratio(g, "#fff"))}:1 black ${f(ratio(g, "#000"))}:1`);
}

console.log("\n## C. Status labels after: oklch(0.75 0.14 H)");
for (const H of [145, 85, 30]) {
  const c = `oklch(0.75 0.14 ${H})`;
  console.log(`${c.padEnd(20)} in sRGB ${new Color(c).inGamut("srgb")} ${hex(c)} Y=${f(lum(c), 4)} black ${f(ratio(c, "#000"))}:1 white ${f(ratio(c, "#fff"))}:1  filter ${filterGray(c)} luminance ${lumGray(c)} oklch ${okGray(c)}`);
}
console.log(`HSL of the old yellow's OKLCH hue at L 0.75: oklch(0.75 0.14 110) -> ${hex("oklch(0.75 0.14 110)")}`);

console.log("\n## D. Eleven grays: equal steps of the sRGB number, of light, of OKLCH L");
const steps = [...Array(11).keys()].map(i => i / 10);
console.log("number  " + steps.map(v => gray(v)).join(" "));
console.log("light   " + steps.map(v => gray(enc(v))).join(" "));
console.log("oklch L " + steps.map(v => hex(new Color("oklch", [v, 0, 0]))).join(" "));
console.log(`#808080: number ${f(128 / 255, 4)} light ${f(lin(128 / 255), 4)} OKLCH L ${f(ok("#808080")[0], 3)}; half the light = ${f(enc(0.5), 4)} = ${Math.round(255 * enc(0.5))} = ${gray(enc(0.5))}; OKLCH L 0.5 = ${hex("oklch(0.5 0 0)")}`);

console.log("\n## E. Six hues: hsl(H 100% 50%) and oklch(0.7 0.12 H), each with its OKLCH gray");
for (const H of [0, 60, 120, 180, 240, 300]) console.log(`hsl ${String(H).padStart(3)} ${hex(`hsl(${H} 100% 50%)`)} L ${f(ok(`hsl(${H} 100% 50%)`)[0], 3)} gray ${okGray(`hsl(${H} 100% 50%)`)}   oklch(0.7 0.12 ${H}) ${hex(`oklch(0.7 0.12 ${H})`)} in sRGB ${new Color(`oklch(0.7 0.12 ${H})`).inGamut("srgb")} gray ${okGray(`oklch(0.7 0.12 ${H})`)}`);

console.log("\n## F. Critique: chart lines #e53935 (errors) and #43a047 (successes)");
for (const c of ["#e53935", "#43a047"]) console.log(`${c} ${new Color(c).to("hsl").toString({ precision: 3 })} ${okstr(c)} filter ${filterGray(c)} luminance ${lumGray(c)} oklch ${okGray(c)} on white ${f(ratio(c, "#fff"))}:1`);
console.log(`between them: ${f(ratio("#e53935", "#43a047"))}:1`);
for (const L of [0.45, 0.5]) { const c = `oklch(${L} 0.18 29)`; console.log(`darker error line ${c} in sRGB ${new Color(c).inGamut("srgb")} ${hex(c)} vs #43a047 ${f(ratio(c, "#43a047"))}:1 on white ${f(ratio(c, "#fff"))}:1`); }

console.log("\n## G. Gamut triangles (chromaticity of each space's primaries, from colorjs.io)");
const xy = c => { const [X, Y, Z] = new Color(c).to("xyz-d65").coords; const s = X + Y + Z; return [X / s, Y / s]; };
const uv = ([x, y]) => [4 * x / (-2 * x + 12 * y + 3), 9 * y / (-2 * x + 12 * y + 3)];
const area = p => Math.abs((p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[2][0] - p[0][0]) * (p[1][1] - p[0][1])) / 2;
const tri = {};
for (const sp of ["srgb", "display-p3", "rec2020"]) {
  tri[sp] = ["1 0 0", "0 1 0", "0 0 1"].map(v => xy(`color(${sp} ${v})`));
  console.log(`${sp.padEnd(10)} ${tri[sp].map(([x, y]) => `${f(x, 3)},${f(y, 3)}`).join("  ")}`);
}
for (const sp of ["display-p3", "rec2020"]) console.log(`${sp} / srgb area: xy ${f(area(tri[sp]) / area(tri.srgb), 3)}  u'v' ${f(area(tri[sp].map(uv)) / area(tri.srgb.map(uv)), 3)}`);

console.log("\n## H. Gamut mapping example oklch(0.7 0.3 150)");
const x = new Color("oklch(0.7 0.3 150)");
const clip = x.clone().toGamut({ space: "srgb", method: "clip" }).toString({ format: "hex", collapse: false });
const map = x.clone().toGamut({ space: "srgb", method: "css" }).toString({ format: "hex", collapse: false });
console.log(`in sRGB ${x.inGamut("srgb")} in P3 ${x.inGamut("p3")}; clip ${clip} ${okstr(clip)}; CSS map ${map} ${okstr(map)}`);

console.log("\n## I. Blue + yellow, halfway, in three spaces (Chrome 157 drew #80807f, #6cabc7 and #00cfbd)");
for (const sp of ["srgb", "oklab", "oklch"]) {
  const m = Color.mix("#0000ff", "#ffff00", 0.5, { space: sp, outputSpace: "oklch" });
  const clipped = m.clone().toGamut({ space: "srgb", method: "clip" }).toString({ format: "hex", collapse: false });
  const mapped = m.clone().toGamut({ space: "srgb", method: "css" }).toString({ format: "hex", collapse: false });
  console.log(`${sp.padEnd(5)} oklch(${m.coords.map(v => f(v || 0, 3)).join(" ")}) in sRGB ${m.inGamut("srgb")}; clipped ${clipped}; CSS-mapped ${mapped}`);
}

console.log("\n## J. A green for sRGB and a richer one for P3 screens, at L 0.7, hue 145");
for (const c of ["oklch(0.7 0.19 145)", "oklch(0.7 0.25 145)"]) console.log(`${c} in sRGB ${new Color(c).inGamut("srgb")} in P3 ${new Color(c).inGamut("p3")} sRGB hex ${new Color(c).inGamut("srgb") ? hex(c) : "-"}`);
console.log(`largest chroma at L 0.7, hue 145: sRGB ${f(maxC(0.7, 145), 3)}`);
