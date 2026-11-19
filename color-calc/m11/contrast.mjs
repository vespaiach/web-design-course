// The one contrast number in Module 11: the current-page underline, drawn in the bar's text color on the bar.
// Same WCAG 2.2 function as Modules 6, 9 and 10. Run: node contrast.mjs
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => lin(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
console.log('light: --color-on-bar #ffffff on --color-bar #222222', ratio('#ffffff', '#222222').toFixed(2) + ':1');
console.log('dark:  --color-on-bar #e8e8e8 on --color-bar #333333', ratio('#e8e8e8', '#333333').toFixed(2) + ':1');
