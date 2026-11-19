// Every Module 9 contrast number: links, focus ring, disabled and pressed buttons, borders.
// Run from color-calc/: node m9/m9.mjs > m9/m9-output.txt
import Color from "colorjs.io";
import assert from "node:assert";

// WCAG 2.2 contrast ratio, the same function as Module 6 (the module prints it)
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => lin(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
const hex = c => new Color(c).toGamut({ space: "srgb", method: "css" }).to("srgb").toString({ format: "hex", collapse: false });
const mix = (a, b, p) => hex(Color.mix(a, b, p, { space: "oklab", outputSpace: "oklab" })); // color-mix(in oklab, a, b p)
const f2 = n => n.toFixed(2);
const pair = (note, fg, bg) => console.log(`${note.padEnd(44)} ${fg} vs ${bg}: ${f2(ratio(fg, bg))}:1`);

for (const h of ["#0078cd", "#77c4ff", "#5d5d5d"]) assert(Math.abs(new Color(h).contrast("#222222", "WCAG21") - ratio(h, "#222222")) < 2e-3, h);
console.log("self-check passed: ratio() agrees with colorjs.io WCAG21 within 0.002\n");

const light = { surface: "#ffffff", alt: "#e8e8e8", text: "#222222", muted: "#5d5d5d", border: "#bebebe", bar: "#222222", accent: "#0078cd", onAccent: "#ffffff", danger: "#d02c2a" };
const dark  = { surface: "#222222", alt: "#333333", text: "#e8e8e8", muted: "#a4a4a4", border: "#5d5d5d", bar: "#333333", accent: "#77c4ff", onAccent: "#222222", danger: "#ff998d" };

for (const [name, t] of Object.entries({ light, dark })) {
  console.log(`## ${name} theme`);
  console.log("-- links (G183: 3:1 against the text around them, 4.5:1 against the surface)");
  pair("link on surface", t.accent, t.surface);
  pair("link vs body text", t.accent, t.text);
  console.log("-- focus ring, one color = accent, on every background it can sit on (1.4.11: 3:1)");
  pair("ring on surface", t.accent, t.surface);
  pair("ring on bar (header, footer)", t.accent, t.bar);
  pair("ring on surface-alt (code block)", t.accent, t.alt);
  pair("ring on accent fill (offset 0, for contrast)", t.accent, t.accent);
  console.log("-- buttons");
  const hover = mix(t.accent, "black", 0.15), active = mix(t.accent, "black", 0.25);
  pair("on-accent on accent", t.onAccent, t.accent);
  pair(`on-accent on hover ${hover}`, t.onAccent, hover);
  pair(`on-accent on pressed (black 25%) ${active}`, t.onAccent, active);
  pair("disabled: muted on surface-alt", t.muted, t.alt);
  pair("disabled fill vs surface", t.alt, t.surface);
  pair("disabled fill vs enabled fill", t.alt, t.accent);
  console.log("-- borders and other non-text");
  pair("border on surface", t.border, t.surface);
  pair("muted on surface (border candidate)", t.muted, t.surface);
  pair("bar (menu panel) vs surface", t.bar, t.surface);
  console.log();
}

console.log("## Critique scenario");
pair("link #4a7fb5 vs text #333333", "#4a7fb5", "#333333");
pair("link #4a7fb5 on white", "#4a7fb5", "#ffffff");
pair("focus ring #ffffff on #ffffff (white ring, white page)", "#ffffff", "#ffffff");
pair("disabled #a0a0a0 text on #d9d9d9", "#a0a0a0", "#d9d9d9");

console.log("\n## Chrome 157's default focus ring (outline: auto, color read with getComputedStyle)");
pair("light: #005fcc on surface", "#005fcc", "#ffffff");
pair("light: #005fcc on bar", "#005fcc", "#222222");
pair("dark: #99c8ff on surface", "#99c8ff", "#222222");
pair("dark: #99c8ff on bar", "#99c8ff", "#333333");
pair("light: #005fcc on the accent button", "#005fcc", "#0078cd");

console.log("\n## Shadows: the key layer alone, black at 30% over the surface (sRGB blend)");
const over = (bg, a) => "#" + hex2rgb(bg).map(c => Math.round(c * (1 - a)).toString(16).padStart(2, "0")).join("");
pair(`light: ${over("#ffffff", 0.3)} on surface`, over("#ffffff", 0.3), "#ffffff");
pair(`dark: ${over("#222222", 0.3)} on surface`, over("#222222", 0.3), "#222222");

console.log("\n## Critique scenario: text #333333 on white");
pair("text on white", "#333333", "#ffffff");
for (const link of ["#2f6fb0", "#3b7dc4"]) { pair(`link ${link} on white`, link, "#ffffff"); pair(`link ${link} vs text`, link, "#333333"); }
console.log(`best possible: a link at exactly 4.5:1 on white is ${f2(ratio("#ffffff", "#333333") / 4.5)}:1 against #333333 (ratios multiply)`);
