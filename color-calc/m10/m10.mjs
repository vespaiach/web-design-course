// Every Module 10 contrast number: field edges, hints, error text and borders, checkboxes.
// Run from color-calc/: node m10/m10.mjs > m10/m10-output.txt
import Color from "colorjs.io";
import assert from "node:assert";

// WCAG 2.2 contrast ratio, the same function as Modules 6 and 9 (the module prints it)
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => lin(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
const pair = (note, fg, bg) => console.log(`${note.padEnd(52)} ${fg} vs ${bg}: ${ratio(fg, bg).toFixed(2)}:1`);

for (const h of ["#767676", "#5d5d5d", "#d02c2a"]) assert(Math.abs(new Color(h).contrast("#ffffff", "WCAG21") - ratio(h, "#ffffff")) < 2e-3, h);
console.log("self-check passed: ratio() agrees with colorjs.io WCAG21 within 0.002\n");

const light = { surface: "#ffffff", text: "#222222", muted: "#5d5d5d", border: "#bebebe", danger: "#d02c2a",
  chromeEdge: "#767676", chromeFill: "#ffffff" };
const dark = { surface: "#222222", text: "#e8e8e8", muted: "#a4a4a4", border: "#5d5d5d", danger: "#ff998d",
  chromeEdge: "#858585", chromeFill: "#3b3b3b" };

for (const [name, t] of Object.entries({ light, dark })) {
  console.log(`## ${name} theme`);
  console.log("-- the edge of a field (1.4.11: 3:1 against the colors next to it)");
  pair("Chrome 157 default edge on the page", t.chromeEdge, t.surface);
  pair("Chrome 157 default edge on its own fill", t.chromeEdge, t.chromeFill);
  pair("--color-border (the cards' border) on surface", t.border, t.surface);
  pair("--color-field-border = --color-muted on surface", t.muted, t.surface);
  console.log("-- words");
  pair("hint text: muted on surface (1.4.3: 4.5:1)", t.muted, t.surface);
  pair("error text: danger on surface (1.4.3: 4.5:1)", t.danger, t.surface);
  pair("field text: text on surface", t.text, t.surface);
  console.log("-- an invalid field's edge");
  pair("danger edge on surface (1.4.11: 3:1)", t.danger, t.surface);
  pair("danger edge vs the normal edge (color change only)", t.danger, t.muted);
  console.log();
}

console.log("## Critique scenario");
pair("placeholder #a9a9a9 on white", "#a9a9a9", "#ffffff");
pair("field border #dddddd on white", "#dddddd", "#ffffff");
pair("error text #ff6b6b on white", "#ff6b6b", "#ffffff");
