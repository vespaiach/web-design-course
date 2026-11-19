#!/bin/sh
# Module 12 figures: panels from the lab states, cropped with cwebp, paired with pair.html.
set -e
cd "$(dirname "$0")"
S=../../lab/screenshot.mjs
OUT=../../../../posts/web-design-for-developers-module-12
mkdir -p panels "$OUT"
shot() { SCHEME=$1 node $S "$2" panels/full.webp $3 $4 >/dev/null; dwebp -quiet panels/full.webp -o panels/full.png; }
crop() { cwebp -quiet -q 90 -crop $2 panels/full.png -o "$1"; }
pair() { SCHEME=light node $S "file://$PWD/pair.html?p=$1&l=$2&col=1" panels/pair.webp $3 >/dev/null; dwebp -quiet panels/pair.webp -o panels/pair.png; cwebp -quiet -q 90 panels/pair.png -o "$4"; }

# Figure 3: the sketch
shot light states/s1/sketch.html 1280; crop "$OUT/sketch.webp" "0 0 1280 560"
# Figure 4: the HTML with the tokens and base.css only
shot light states/s2/pricing.html 1280; crop "$OUT/tokens-applied.webp" "0 0 1280 800"
# Figure 5: the first build
shot light states/s3/pricing.html 1280; crop "$OUT/built.webp" "0 0 1280 1020"
# Figures 6 to 8: the plans before and after each change, the same crop
for s in s3 s4 s5 s6; do shot light states/$s/pricing.html 1280; crop panels/plans-$s.webp "0 264 1280 310"; done
pair panels/plans-s3.webp,panels/plans-s4.webp "Before|After" 1314 "$OUT/price-lead.webp"
pair panels/plans-s4.webp,panels/plans-s5.webp "Before|After" 1314 "$OUT/one-action.webp"
pair panels/plans-s5.webp,panels/plans-s6.webp "Before|After" 1314 "$OUT/recommended-label.webp"
# Figure 9: the header at 660px, with the old and the new breakpoint
shot light states/s2a/pricing.html 660; crop panels/header-s2a.webp "0 0 660 100"
shot light states/s2/pricing.html 660; crop panels/header-s2.webp "0 0 660 100"
pair panels/header-s2a.webp,panels/header-s2.webp "Breakpoint 39rem|Breakpoint 44rem" 694 "$OUT/header-breakpoint.webp"
# Figures 10 and 11: the final page, light at 1280 and dark at 390
shot light states/s6/pricing.html 1280; crop "$OUT/pricing-final.webp" "0 0 1280 1030"
shot dark states/s6/pricing.html 390; crop "$OUT/pricing-final-phone-dark.webp" "0 0 390 1100"
# Figure 12: the table on a phone, the next round's finding
shot light states/s6/pricing.html 390; crop "$OUT/table-phone.webp" "0 1140 390 640"
# Figure 13: the design system page
shot light states/s7/system.html 1280; crop "$OUT/system.webp" "0 0 1280 1300"
rm -f panels/full.* panels/pair.*
ls -la "$OUT"
