// Draws the SVG figures of Module 5 from computed colors. Run from color-calc/: node m5/figures.mjs
import Color from "colorjs.io";
import { writeFileSync } from "node:fs";

const out = "../../../posts/web-design-for-developers-module-5/";
const hex = c => new Color(c).toGamut({ space: "srgb", method: "css" }).to("srgb").toString({ format: "hex", collapse: false });
const okL = c => new Color(hex(c)).to("oklch").coords[0];
const okGray = c => hex(new Color("oklch", [okL(c), 0, 0]));
const enc = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const g255 = v => "#" + Math.round(255 * v).toString(16).padStart(2, "0").repeat(3);
const r = n => Math.round(n * 10) / 10;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial, sans-serif" font-size="13">\n<rect width="${w}" height="${h}" fill="#fff"/>\n${body}</svg>\n`;
const text = (x, y, s, a = "") => `<text x="${r(x)}" y="${r(y)}" ${a}>${s}</text>`;
const rect = (x, y, w, h, fill, a = "") => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${fill}" ${a}/>`;

// Figure 2: eleven grays three ways.
{
  const steps = [...Array(11).keys()].map(i => i / 10);
  const rows = [
    ["Equal steps of the sRGB number (#000000, #1a1a1a, … #ffffff)", steps.map(g255)],
    ["Equal steps of light (luminance 0, 0.1, … 1)", steps.map(v => g255(enc(v)))],
    ["Equal steps of OKLCH lightness (L 0, 0.1, … 1)", steps.map(v => hex(new Color("oklch", [v, 0, 0])))],
  ];
  let b = "";
  rows.forEach(([label, cols], i) => {
    const y = 10 + i * 92;
    b += text(10, y + 14, label, 'fill="#000"');
    cols.forEach((c, j) => { b += rect(10 + j * 62, y + 24, 58, 40, c, 'stroke="#ccc"'); b += text(39 + j * 62, y + 80, c, 'text-anchor="middle" fill="#555" font-size="11"'); });
  });
  writeFileSync(out + "lightness-steps.svg", svg(700, 290, b));
}

// Figure 3: six hues at one HSL lightness, then at one OKLCH lightness, each over its OKLCH gray.
{
  let b = "";
  const hues = [0, 60, 120, 180, 240, 300];
  [["hsl(H 100% 50%): one HSL lightness. The strip under each color is the gray with its OKLCH lightness.", H => `hsl(${H} 100% 50%)`], ["oklch(0.7 0.12 H): one OKLCH lightness", H => `oklch(0.7 0.12 ${H})`]].forEach(([label, fn], i) => {
    const y = 10 + i * 150;
    b += text(10, y + 14, label, 'fill="#000"');
    hues.forEach((H, j) => {
      const c = fn(H), x = 10 + j * 112;
      b += rect(x, y + 24, 104, 56, hex(c));
      b += rect(x, y + 80, 104, 28, okGray(c));
      b += text(x + 52, y + 126, `H ${H}, L ${okL(c).toFixed(2)}`, 'text-anchor="middle" fill="#555" font-size="12"');
    });
  });
  writeFileSync(out + "hsl-vs-oklch.svg", svg(690, 290, b));
}

// Figure 4: constant-hue slices of OKLCH for the three status hues; colored cells are inside sRGB, the line is the edge of P3.
{
  const maxC = (L, H, sp) => { let lo = 0, hi = 0.5; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; new Color("oklch", [L, m, H]).inGamut(sp) ? (lo = m) : (hi = m); } return lo; };
  const W = 200, Hh = 300, C0 = 0.35, dL = 0.02, dC = 0.01;
  let b = "";
  [[145, "Done, hue 145"], [85, "Running, hue 85"], [30, "Failed, hue 30"]].forEach(([H, label], i) => {
    const ox = 60 + i * 250, oy = 30, X = c => ox + (c / C0) * W, Y = L => oy + (1 - L) * Hh;
    b += text(ox, oy - 12, label, 'fill="#000"');
    for (let L = dL / 2; L < 1; L += dL) for (let c = dC / 2; c < C0; c += dC) {
      const col = new Color("oklch", [L, c, H]); if (!col.inGamut("srgb")) continue;
      b += rect(X(c - dC / 2), Y(L + dL / 2), (dC / C0) * W + 0.4, (dL * Hh) + 0.4, hex(col));
    }
    for (const sp of ["srgb", "p3"]) {
      const pts = []; for (let L = 0; L <= 1.0001; L += 0.005) pts.push(`${r(X(maxC(L, H, sp)))},${r(Y(L))}`);
      b += `<polyline points="${pts.join(" ")}" fill="none" stroke="${sp === "p3" ? "#000" : "#555"}" stroke-width="${sp === "p3" ? 1.5 : 1}" ${sp === "p3" ? 'stroke-dasharray="4 3"' : ""}/>\n`;
    }
    b += `<line x1="${ox}" y1="${r(Y(0.75))}" x2="${ox + W}" y2="${r(Y(0.75))}" stroke="#000" stroke-dasharray="2 3"/>\n`;
    b += `<circle cx="${r(X(0.14))}" cy="${r(Y(0.75))}" r="4" fill="#fff" stroke="#000" stroke-width="1.5"/>\n`;
    b += `<line x1="${ox}" y1="${oy + Hh}" x2="${ox + W}" y2="${oy + Hh}" stroke="#000"/><line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy + Hh}" stroke="#000"/>\n`;
    for (const c of [0, 0.1, 0.2, 0.3]) b += text(X(c), oy + Hh + 16, c, 'text-anchor="middle" fill="#555" font-size="11"');
    for (const L of [0, 0.25, 0.5, 0.75, 1]) b += text(ox - 6, Y(L) + 4, L, 'text-anchor="end" fill="#555" font-size="11"');
  });
  b += text(310, 362, "Chroma (C) across, lightness (L) up. Dashed line: the edge of display-p3. Dot: L 0.75, C 0.14.", 'text-anchor="middle" fill="#000"');
  writeFileSync(out + "oklch-slices.svg", svg(760, 375, b));
}

// Figure 6: the sRGB, display-p3 and Rec. 2020 triangles in the CIE 1931 xy plane.
{
  const xy = c => { const [X, Y, Z] = new Color(c).to("xyz-d65").coords; const s = X + Y + Z; return [X / s, Y / s]; };
  const ox = 60, oy = 20, S = 420, P = ([x, y]) => [ox + x * S, oy + (0.9 - y) * S];
  let b = "";
  for (let v = 0; v <= 0.8001; v += 0.1) { const [px] = P([v, 0]); b += `<line x1="${r(px)}" y1="${oy}" x2="${r(px)}" y2="${oy + 0.9 * S}" stroke="#eee"/>` + text(px, oy + 0.9 * S + 16, v.toFixed(1), 'text-anchor="middle" fill="#555" font-size="11"') + "\n"; }
  for (let v = 0; v <= 0.9001; v += 0.1) { const [, py] = P([0, v]); b += `<line x1="${ox}" y1="${r(py)}" x2="${ox + 0.8 * S}" y2="${r(py)}" stroke="#eee"/>` + text(ox - 6, py + 4, v.toFixed(1), 'text-anchor="end" fill="#555" font-size="11"') + "\n"; }
  const spaces = [["rec2020", "Rec. 2020", "#999", "2 3"], ["display-p3", "display-p3", "#000", "6 3"], ["srgb", "sRGB", "#000", ""]];
  spaces.forEach(([sp, label, stroke, dash], i) => {
    const pts = ["1 0 0", "0 1 0", "0 0 1"].map(v => P(xy(`color(${sp} ${v})`)));
    b += `<polygon points="${pts.map(p => p.map(r).join(",")).join(" ")}" fill="none" stroke="${stroke}" stroke-width="1.5" ${dash ? `stroke-dasharray="${dash}"` : ""}/>\n`;
    b += `<line x1="${ox + 0.55 * S}" y1="${oy + 20 + i * 20}" x2="${ox + 0.62 * S}" y2="${oy + 20 + i * 20}" stroke="${stroke}" stroke-width="1.5" ${dash ? `stroke-dasharray="${dash}"` : ""}/>` + text(ox + 0.64 * S, oy + 24 + i * 20, label, 'fill="#000"') + "\n";
  });
  const [wx, wy] = P([0.3127, 0.329]); b += `<circle cx="${r(wx)}" cy="${r(wy)}" r="3" fill="#000"/>` + text(wx + 6, wy + 14, "white (D65)", 'fill="#555" font-size="11"') + "\n";
  b += text(ox + 0.4 * S, oy + 0.9 * S + 34, "x", 'text-anchor="middle" fill="#000"') + text(16, oy + 0.45 * S, "y", 'fill="#000"');
  writeFileSync(out + "gamut-xy.svg", svg(420, 440, b));
}

// Figure 8: the complement of #3ea6ff on two wheels.
{
  const items = [["#3ea6ff", "The brand blue"], ["#ff973e", "HSL hue + 180°"], ["#e08a00", "OKLCH hue + 180°"]];
  let b = "";
  items.forEach(([c, label], i) => {
    const x = 10 + i * 200;
    b += rect(x, 10, 180, 80, c);
    b += text(x, 110, label, 'fill="#000"');
    b += text(x, 128, `${c}, OKLCH L ${okL(c).toFixed(3)}`, 'fill="#555" font-size="12"');
  });
  writeFileSync(out + "complement.svg", svg(600, 140, b));
}
console.log("written");
