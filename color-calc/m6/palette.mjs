// Every Module 6 number: the three scales, the semantic pairs in both themes, hovers, CVD, critique.
// Run from color-calc/: node m6/palette.mjs > m6/palette-output.txt
import Color from "colorjs.io";
import * as culori from "culori";
import { APCAcontrast, sRGBtoY } from "apca-w3";
import assert from "node:assert";

// WCAG 2.2 contrast ratio, written out (the module prints this function)
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => lin(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };

const apca = (fg, bg) => APCAcontrast(sRGBtoY(hex2rgb(fg)), sRGBtoY(hex2rgb(bg)));
const hex = c => new Color(c).toGamut({ space: "srgb", method: "css" }).to("srgb").toString({ format: "hex", collapse: false });
const ok = h => { const [L, C, H] = new Color(h).to("oklch").coords; return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${(H || 0).toFixed(1)})`; };
const mix = (a, b, p, space = "oklab") => hex(Color.mix(a, b, p, { space, outputSpace: space }));
const f2 = n => n.toFixed(2);
const pair = (fg, bg, note) => console.log(`${note.padEnd(40)} ${fg} on ${bg}: ${f2(ratio(fg, bg))}:1  Lc ${apca(fg, bg).toFixed(1)}`);

for (const h of ["#3ea6ff", "#0078cd", "#222222", "#d02c2a"]) assert(Math.abs(new Color(h).contrast("#ffffff", "WCAG21") - ratio(h, "#ffffff")) < 2e-3, h);
console.log("self-check passed: ratio() agrees with colorjs.io 0.7.1 WCAG21 within 0.002\n");

// One lightness per step, for every hue. The brand #3ea6ff gives the blue's hue and chroma.
const L = { 50: 0.97, 100: 0.93, 200: 0.87, 300: 0.80, 400: 0.72, 500: 0.64,
            600: 0.56, 700: 0.48, 800: 0.40, 900: 0.32, 950: 0.25 };
const [, brandC, brandH] = new Color("#3ea6ff").to("oklch").coords;
const scale = (C, H) => Object.fromEntries(Object.entries(L).map(([k, l]) => [k, hex(new Color("oklch", [l, C, H]))]));
const S = { blue: scale(brandC, brandH), red: scale(0.2, 27), neutral: { 0: "#ffffff", ...scale(0, 0) } };

console.log(`## A. Scales (blue: C ${brandC.toFixed(3)} H ${brandH.toFixed(1)}; red: C 0.2 H 27; neutral: C 0), CSS gamut mapping to sRGB`);
for (const [name, s] of Object.entries(S)) {
  console.log(`-- ${name}`);
  for (const [k, h] of Object.entries(s)) console.log(`${name}-${k.padEnd(4)} target L ${(L[k] ?? 1).toFixed(2)}  ${h}  ${ok(h)}  vs white ${f2(ratio(h, "#ffffff"))}  vs neutral-950 ${f2(ratio(h, S.neutral[950]))}`);
}
const n = S.neutral, b = S.blue, r = S.red;

console.log("\n## B. The opening button and its two fixes");
pair("#ffffff", "#3ea6ff", "before: white on brand");
pair(n[950], "#3ea6ff", "fix A: neutral-950 text on brand");
pair("#ffffff", b[600], "fix B: white on blue-600");
pair("#ffffff", "#ff0000", "before: white on #ff0000 (danger)");
pair("#ffffff", r[600], "after: white on red-600");
console.log(`18pt = ${18 * 4 / 3}px, 14pt = ${(14 * 4 / 3).toFixed(2)}px`);

const themes = {
  light: { surface: n[0], alt: n[100], text: n[950], muted: n[700], border: n[300], bar: n[950], onBar: n[0], accent: b[600], onAccent: n[0], danger: r[600], onDanger: n[0] },
  dark: { surface: n[950], alt: n[900], text: n[100], muted: n[400], border: n[700], bar: n[900], onBar: n[100], accent: b[300], onAccent: n[950], danger: r[300], onDanger: n[950] },
};
const status = { ok: hex("oklch(0.75 0.14 145)"), running: hex("oklch(0.75 0.14 85)"), failed: hex("oklch(0.75 0.14 30)") };
for (const [name, t] of Object.entries(themes)) {
  console.log(`\n## ${name === "light" ? "C" : "D"}. ${name} theme pairs`);
  pair(t.text, t.surface, "text on surface");
  if (name === "dark") pair(t.text, "#121212", "text on Material 2's #121212");
  pair(t.text, t.alt, "text on surface-alt");
  pair(t.muted, t.surface, "muted on surface");
  pair(t.onBar, t.bar, "on-bar on bar");
  pair(t.border, t.surface, "border on surface");
  pair(t.onAccent, t.accent, "on-accent on accent");
  const ah = mix(t.accent, "black", 0.15); console.log(`accent hover color-mix(in oklab, ${t.accent}, black 15%) -> ${ah} ${ok(ah)}`);
  pair(t.onAccent, ah, "on-accent on accent hover");
  pair(t.onDanger, t.danger, "on-danger on danger");
  const dh = mix(t.danger, "black", 0.15); console.log(`danger hover color-mix(in oklab, ${t.danger}, black 15%) -> ${dh} ${ok(dh)}`);
  pair(t.onDanger, dh, "on-danger on danger hover");
  pair(t.accent, t.surface, "accent fill against surface");
  pair(t.danger, t.surface, "danger fill against surface");
  pair(t.bar, t.surface, "bar against surface");
  for (const [k, h] of Object.entries(status)) { pair(n[950], h, `on-status (neutral-950) on ${k}`); pair(h, t.surface, `${k} label against surface`); }
}

console.log("\n## E. Dark theme the naive way: only surface and text swapped");
pair(n[700], n[950], "light muted (neutral-700) on dark surface");
pair(n[950], n[950], "light bar (neutral-950) on dark surface");
pair(n[300], n[950], "light border (neutral-300) on dark surface");
pair(b[600], n[950], "blue-600 as text or fill on dark surface");
pair(r[600], n[950], "red-600 as text or fill on dark surface");

console.log("\n## F. Same lightness gap, light end and dark end (from the scales)");
pair(n[950], n[0], "text: neutral-950 on neutral-0 (gap 0.75)");
pair(n[100], n[950], "text: neutral-100 on neutral-950 (gap 0.68)");
pair(n[700], n[0], "muted: neutral-700 on neutral-0 (gap 0.52)");
pair(n[300], n[950], "mirror of it: neutral-300 on neutral-950 (gap 0.55)");
pair(n[400], n[950], "chosen: neutral-400 on neutral-950 (gap 0.47)");
for (const [a, c] of [[1.0, 0.8], [0.8, 0.6], [0.4, 0.2], [0.3, 0.1]]) {
  const ha = hex(`oklch(${a} 0 0)`), hc = hex(`oklch(${c} 0 0)`);
  console.log(`gray L ${a.toFixed(1)} ${ha} vs L ${c.toFixed(1)} ${hc}: ${f2(ratio(ha, hc))}:1`);
}

console.log("\n## G. Color vision deficiency (culori filterDeficiency*, severity 1)");
const sims = { deuteranopia: culori.filterDeficiencyDeuter(1), protanopia: culori.filterDeficiencyProt(1), tritanopia: culori.filterDeficiencyTrit(1) };
for (const [k, h] of Object.entries({ ...status, "blue-600": b[600], "red-600": r[600] })) {
  console.log(`${k.padEnd(9)} ${h}  ` + Object.entries(sims).map(([s, fn]) => `${s} ${culori.formatHex(fn(h))}`).join("  "));
}
const dOk = culori.formatHex(sims.deuteranopia(status.ok)), dFail = culori.formatHex(sims.deuteranopia(status.failed));
console.log(`ok vs failed: deltaEOK ${new Color(status.ok).deltaE(status.failed, "OK").toFixed(3)}, under deuteranopia ${new Color(dOk).deltaE(dFail, "OK").toFixed(3)}; WCAG between them ${f2(ratio(status.ok, status.failed))}:1`);

console.log("\n## H. contrast-color() figure: WCAG and APCA for white and black text");
for (const bg of ["#3ea6ff", b[600], "#2277d3"]) console.log(`${bg}: white ${f2(ratio("#ffffff", bg))}:1 Lc ${apca("#ffffff", bg).toFixed(1)}; black ${f2(ratio("#000000", bg))}:1 Lc ${apca("#000000", bg).toFixed(1)}`);

console.log("\n## I. APCA vs WCAG examples");
pair("#000000", "#3ea6ff", "black on brand");
pair("#767676", "#ffffff", "#767676 on white");
pair("#777777", "#ffffff", "#777777 on white");
pair("#ffffff", n[950], "white on neutral-950");
pair(n[950], "#ffffff", "neutral-950 on white");

console.log("\n## J. Critique: a link on a dark card");
pair("#0078cd", "#1e1e1e", "link #0078cd on card #1e1e1e");
pair(b[300], "#1e1e1e", "fix: blue-300 on card #1e1e1e");
pair("#0078cd", "#ffffff", "same link on white");

console.log("\n## K. Clipping vs gamut mapping for two blue steps");
for (const l of [0.56, 0.80]) {
  const c = new Color("oklch", [l, brandC, brandH]);
  const clip = c.clone().toGamut({ space: "srgb", method: "clip" }).toString({ format: "hex", collapse: false });
  console.log(`oklch(${l} ${brandC.toFixed(3)} ${brandH.toFixed(1)}): clipped ${clip}, mapped ${hex(c)}`);
}

console.log("\n## L. CIELAB L* gaps over gray pairs (Material's tone is L*): smallest WCAG ratio");
for (const gap of [40, 50, 60]) {
  let min = Infinity, at = 0;
  for (let hi = gap; hi <= 100.0001; hi += 0.1) {
    const a = hex(new Color("lab", [hi, 0, 0])), c = hex(new Color("lab", [hi - gap, 0, 0])), q = ratio(a, c);
    if (q < min) { min = q; at = hi; }
  }
  console.log(`L* gap ${gap}: at least ${f2(min)}:1 (smallest at L* ${at.toFixed(1)} vs ${(at - gap).toFixed(1)})`);
}
