// Module 6 extra pairs. Same WCAG 2.2 formula as calc.mjs; APCA via apca-w3 0.1.9.
import Color from "colorjs.io";
import { APCAcontrast, sRGBtoY } from "apca-w3";
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => lin(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const apca = (fg, bg) => APCAcontrast(sRGBtoY(hex2rgb(fg)), sRGBtoY(hex2rgb(bg)));
const hex = c => new Color(c).toGamut({ space: "srgb", method: "css" }).to("srgb").toString({ format: "hex", collapse: false });
const ok = h => { const [L, C, H] = new Color(h).to("oklch").coords; return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${(H || 0).toFixed(1)})`; };
const row = (fg, bg, note = "") => console.log(`${note.padEnd(34)} ${fg} on ${bg}: WCAG ${ratio(fg, bg).toFixed(2)}:1  APCA Lc ${apca(fg, bg).toFixed(1)}`);

console.log("## A. Light theme candidate pairs");
row("#000000", "#0078cd", "black on accent-600");
row("#ffffff", "#0078cd", "white on accent-600");
row("#0078cd", "#ffffff", "accent-600 link on white");
row("#005fb2", "#ffffff", "accent-700 link on white");
row("#3ea6ff", "#ffffff", "brand as link on white");
const hover = hex(Color.mix("#0078cd","black",0.15,{space:"oklab",outputSpace:"oklab"})); console.log("hover = color-mix(in oklab, #0078cd, black 15%) ->", hover, ok(hover));
row("#ffffff", hover, "white on hover");
const rel = (()=>{const c=new Color("#3ea6ff").to("oklch");c.coords[0]-=0.15;return hex(c)})(); console.log("oklch(from #3ea6ff calc(l - 0.15) c h) ->", rel, ok(rel));
row("#ffffff", rel, "white on relative-darkened brand");
const tint = hex(Color.mix("#0078cd","white",0.88,{space:"oklab",outputSpace:"oklab"})); console.log("color-mix(in oklab, #0078cd 12%, white) ->", tint, ok(tint));
row("#005fb2", tint, "accent-700 text on accent tint");
row("#767676", "#ffffff", "UI border gray on white (1.4.11)");
row("#c4c4c4", "#ffffff", "light border on white");

console.log("\n## B. Dark theme candidate pairs");
for (const s of ["#121212", "#1e1e1e", "#0b1220"]) console.log("surface", s, ok(s));
row("#ffffff", "#121212", "white text on #121212");
row("#e5e5e5", "#121212", "text #e5e5e5 on #121212");
row("#a3a3a3", "#121212", "muted #a3a3a3 on #121212");
row("#3ea6ff", "#121212", "brand on #121212");
row("#77c4ff", "#121212", "accent-300 on #121212");
row("#0078cd", "#121212", "light-theme accent-600 on #121212");
row("#0b1220", "#3ea6ff", "dark text on brand button");
row("#3ea6ff", "#1e1e1e", "brand on raised #1e1e1e");
row("#d32f2f", "#121212", "light-theme danger on #121212");
row("#ff8a80", "#121212", "lighter danger on #121212");
row("#d32f2f", "#ffffff", "danger on white");

console.log("\n## C. Same OKLCH L step, light end vs dark end (gray pairs)");
for (const [a, b] of [[1.0, 0.8], [0.8, 0.6], [0.4, 0.2], [0.3, 0.1]]) {
  const ha = hex(`oklch(${a} 0 0)`), hb = hex(`oklch(${b} 0 0)`);
  console.log(`L ${a} ${ha} vs L ${b} ${hb}: WCAG ${ratio(ha, hb).toFixed(2)}:1`);
}

console.log("\n## D. Extra pairs for examples");
row("#0078cd", "#1e1e1e", "accent-600 link on raised #1e1e1e");
const hs = Color.mix("#0078cd", "black", 0.15, { space: "srgb", outputSpace: "srgb" }).toString({ format: "hex", collapse: false });
console.log("color-mix(in srgb, #0078cd, black 15%) ->", hs, ok(hs)); row("#ffffff", hs, "white on srgb-mixed hover");
