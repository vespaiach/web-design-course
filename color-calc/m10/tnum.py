# Does the lab's Inter file have tabular figures? Prints the GSUB features and the digit widths.
# Needs fontTools and brotli: python3 -m pip install fonttools brotli
# Run from color-calc/: python3 m10/tnum.py > m10/tnum-output.txt
from fontTools.ttLib import TTFont

font = TTFont("../lab/module-10/fonts/inter-roman-latin.woff2")
upm = font["head"].unitsPerEm
cmap, hmtx, gsub = font.getBestCmap(), font["hmtx"], font["GSUB"].table
print("OpenType features:", " ".join(sorted({r.FeatureTag for r in gsub.FeatureList.FeatureRecord})))

tnum = {}
for record in gsub.FeatureList.FeatureRecord:
    if record.FeatureTag == "tnum":
        for i in record.Feature.LookupListIndex:
            for sub in gsub.LookupList.Lookup[i].SubTable:
                tnum.update(getattr(sub, "mapping", {}))

print(f"{'digit':6} {'default (em)':>13} {'with tnum (em)':>15}   at 18px")
for d in "0123456789":
    g = cmap[ord(d)]
    w, t = hmtx[g][0] / upm, hmtx[tnum[g]][0] / upm
    print(f"{d:6} {w:13.3f} {t:15.3f}   {w * 18:5.2f} -> {t * 18:5.2f} px")
