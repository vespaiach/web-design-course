# Module 08: the sample site after Module 8

The sample site as it is at the end of Module 8, "Images and Icons". Module 9 starts from here. The product is
Stashling, an invented open-source backup tool. Four pages share one nav: `index.html`
(landing), `article.html`, `signup.html` and `settings.html`. Plain HTML and CSS, no
JavaScript, no build step; open any page from the file system.

CSS: `tokens.css` (the course fills it; Module 1 added four tokens, Module 2 a spacing scale, Module 3 two font stacks, Module 4 a type scale and text settings, Module 5 three status colors, Module 6 three color scales, twelve semantic colors and a dark theme, Module 7 three layout tokens, Module 8 an icon size), `base.css` (every page), and
`index.css`, `signup.css`, `settings.css` for the pages that need their own.
`images/hero.webp` is a generated 1200 x 800 (3:2) placeholder photo.
`icons/` holds the Lucide SVG sources of the five icons the site uses (Module 8) and Lucide's `LICENSE` (ISC; the lock comes from Feather and is also MIT).
`fonts/` holds the Inter web font (Module 3): two variable WOFF2 files and their license.

## What Module 1 changed

All on the landing page, except the `h2` color, which is in `base.css` and so changes every page.

1. One primary action: "Download 2.4" stays a button; the other three hero actions are underlined links (`.hero-actions`, `.link`, token `--space-inside`).
2. Title and de-emphasis: `.hero h1` at `--size-title` (40px); the tagline lost its `<strong>`; the description is `.muted` (`--color-muted`, #555, 7.46:1 on white); `.quote` lost `font-weight: bold`.
3. `h2` is no longer blue (`base.css`).
4. `section + section` gets `--space-between` (48px) above it.
5. Every `text-align: center` in `index.css` is gone, `.hero-actions` lost `justify-content: center`, and `.stats` uses `column-gap: var(--space-between)` instead of `justify-content: space-around`.

## What Module 2 changed

On the settings page and the landing page's feature cards. The article and sign-up pages look the same as in `module-01`.

1. `tokens.css`: a spacing scale on a 4 px base, `--space-1` to `--space-8` (0.25rem to 4rem: 4, 8, 12, 16, 24, 32, 48, 64 px at the default 16 px root). `--space-inside` and `--space-between` now point to `--space-4` and `--space-7`, so their values (16 px and 48 px) did not change.
2. `settings.html`: each label and its control are wrapped in `<div class="field">`. The helper text about old snapshots moved inside the "Keep snapshots" field.
3. `settings.css`: every `margin: 10px` rule is gone. `.settings` is a flex column with `gap: var(--space-between)` (48 px between the title and each section) and `padding-block: var(--space-6)`. Each `section` is a flex column with `gap: var(--space-inside)` (16 px), and each `.field` with `gap: var(--space-1)` (4 px). Both use `align-items: start`. `h1`, `h2` and `p` have `margin: 0` on this page. The inputs keep `font-size: 16px` and lost their margin, so the "Save account" button no longer sits beside the Email field, and the table rows went from 44 px to 33 px tall.
4. `index.css`: `.features` uses `gap: var(--space-5)` (24 px). Each `.feature` is a flex column with `gap: var(--space-2)` (8 px) and `padding: var(--space-4)` (16 px), and its `h3` and `p` have `margin: 0`.
5. `settings.css`: table cells use `padding: var(--space-1) var(--space-2)` (4 px by 8 px) instead of 5 px. Rows are 31 px tall.

Still off the scale: `base.css` (header `gap: 15px` and `padding: 10px`, `.content` padding, `.button` padding, footer), `signup.css` and the `.status` labels.

## What Module 3 changed

Every page, through `tokens.css` and `base.css`. No HTML changed, and no size, spacing or color changed.

1. `fonts/`: Inter, the Latin subset that the Google Fonts CSS API served on 2026-11-18 (Inter v20), as two variable WOFF2 files with a weight axis from 100 to 900: `inter-roman-latin.woff2` (48,432 bytes) and `inter-italic-latin.woff2` (51,636 bytes). `fonts/OFL.txt` is the SIL Open Font License 1.1 from `github.com/google/fonts/ofl/inter/`.
2. `base.css`: two `@font-face` rules at the top, family `Inter`, `font-weight: 100 900`, one with `font-style: normal` and one with `font-style: italic`.
3. `tokens.css`: `--font-text` (Inter, then the Neo-Grotesque stack from Modern Font Stacks) and `--font-code` (the Monospace Code stack from Modern Font Stacks).
4. `base.css`: `body` uses `font-family: var(--font-text)`; `button, input, select, textarea` use `font-family: inherit`, because form controls do not inherit the font by default; `pre, code` use `font-family: var(--font-code)`.

Side effects: `line-height` is still `normal`, which comes from the font's own metrics, so every page is a little taller (the article went from 1,272 to 1,340 px tall at 1280 px wide). Inter is wider than Times, so paragraphs wrap into more lines. Code still renders in Menlo in Chrome on macOS, as before, because `ui-monospace` works only in Safari and the next two fonts in the stack are not installed there. The Latin subset has no glyphs for letters such as `ư`, `Đ` or `Ł`; the stack draws them from the next font that has them.

## What Module 4 changed

Every page, through `tokens.css`, `base.css` and one font size in each page's CSS file. No HTML changed, and no color or spacing token changed.

1. `tokens.css`: a fluid type scale, `--step--1` to `--step-4`, made by `research/web-design-for-developers/type-calc/m4/fluid-scale.js`. Each step is a `clamp()` in `rem` and `vw` that grows in a straight line from its size at a 320 px viewport (base 16 px, ratio 1.2) to its size at 1280 px (base 18 px, ratio 1.25): 13.33 to 14.40, 16 to 18, 19.20 to 22.50, 23.04 to 28.13, 27.65 to 35.16, 33.18 to 43.95 px at the default 16 px root. `--size-title` keeps its name and now points to `var(--step-4)` (was 40px).
2. Every `font-size` in px became a step: `body` 18px and `.button` 16px to `--step-0`; `h1` 24px to `--step-3`; `h2` 20px to `--step-2`; `h3` 18px, `.logo` 20px and `.stats` 20px to `--step-1`; the footer and `.status` 14px to `--step--1`; the inputs in `settings.css` and `signup.css` 16px to `--step-0`. `.hero h1` still uses `--size-title`.
3. `tokens.css` `--measure: 50ch`; `base.css` `article { max-inline-size: var(--measure); }`. In Inter, 1ch is the width of the zero (11.36 px at 18 px) and an average character is 0.748 of it, so 50ch holds about 65 characters (64.9 on average over the article's paragraphs at 1280). The column stays at the left edge; centering is layout, left to Module 7.
4. `tokens.css` `--leading-body: 1.5` and `--leading-heading: 1.2`; `base.css` `html { line-height: var(--leading-body); }` (on `html`, so `1rlh` is one line of root-size text) and `h1, h2, h3 { line-height: var(--leading-heading); }`.
5. `tokens.css` `--tracking-tight: -0.02em`; `base.css` `h1 { letter-spacing: var(--tracking-tight); }`.
6. `base.css` `text-wrap: balance` on `h1, h2, h3` and `article p { text-wrap: pretty; }`.

Side effects: every page is taller, because of the line height (article 1,341 to 2,420 px at 1280, mostly from the narrow column; 2,620 to 2,784 px at 390). The header and nav are taller (44 to 54 px at 1280), the `.button` links and table rows too (rows 30 to 36 px at 1280). At exactly 1280 px the body computes to 17.999 px, not 18, because the clamp numbers are rounded to four decimals. With the browser's default font size set to 20 px, the body is 20 px at 390 and 21.83 px at 1280: the `vw` part of each clamp does not follow the setting. The landing page's text still runs the full window width (only `article` has a measure), and the article still sits 10 px from the screen edge on a phone (`.content` padding); both are layout, Module 7. No text is set in capitals, so no caps letter spacing is applied. `text-wrap: pretty` does nothing in Firefox (not supported).

## What Module 5 changed

The status labels on the settings page, through `tokens.css` and `settings.css`. No HTML changed, and no other color changed.

1. `tokens.css`: three status colors with one OKLCH lightness (0.75) and one chroma (0.14), and three hues: `--color-status-ok: oklch(0.75 0.14 145)` (`#71c575`), `--color-status-running: oklch(0.75 0.14 85)` (`#d6a62e`) and `--color-status-failed: oklch(0.75 0.14 30)` (`#fa8978`). At lightness 0.75 the three hues share the most chroma inside sRGB (ceiling 0.151, set by the red); hue 85 replaces the old yellow's 109.8, which is olive (`#b4b53d`) at this lightness.
2. `settings.css`: `.status-ok`, `.status-running` and `.status-failed` use the three tokens instead of `hsl(…, 100%, 35%)`; `.status` text is `#000` instead of `#fff`; the comment above `.status` says why.

Results (from `research/web-design-for-developers/color-calc/m5/m5-output.txt`): black text on the labels is 9.95:1, 9.35:1 and 8.91:1 (white text on the old labels was 2.82:1, 2.24:1 and 7.20:1). The old labels had OKLCH lightness 0.664, 0.742 and 0.481. With Achromatopsia emulated (Chrome DevTools, Rendering tab), the new labels are `#b2b2b2`, `#adadad` and `#a9a9a9`; their OKLCH grays are all `#aeaeae`.

Side effects: none outside the labels. The labels use `oklch()`, Baseline widely available since 2025-11-09; in a browser older than Chrome 111, Firefox 113 or Safari 15.4, `background: var(--color-status-…)` is invalid at computed-value time, so the labels lose their background and keep their black text. At 390 px the Status column is off screen (the table is wider than the phone), so `settings-390.webp` looks the same as in `module-04`.

## What Module 6 changed

Every page, through `tokens.css`, `base.css`, one border in each page's CSS file, the status text in `settings.css`, and three icon colors in `index.html`. No layout, size or spacing changed.

1. `tokens.css`: eleven steps of three tonal scales, each step one OKLCH lightness for every hue (0.97 at step 50 down to 0.25 at step 950), mapped into sRGB with CSS gamut mapping and stored as hex: `--neutral-0` `#ffffff`, `--neutral-100` `#e8e8e8`, `--neutral-300` `#bebebe`, `--neutral-400` `#a4a4a4`, `--neutral-700` `#5d5d5d`, `--neutral-900` `#333333`, `--neutral-950` `#222222`; `--blue-300` `#77c4ff` and `--blue-600` `#0078cd` (hue and chroma of the brand blue `#3ea6ff`); `--red-300` `#ff998d` and `--red-600` `#d02c2a` (hue 27, chroma 0.2). Only the steps the site uses; the full scales are in `research/web-design-for-developers/color-calc/m6/palette-output.txt`, section A.
2. `tokens.css`: twelve semantic colors, each `light-dark(light value, dark value)`: `--color-surface`, `--color-surface-alt`, `--color-text`, `--color-muted` (was `#555`), `--color-border`, `--color-bar`, `--color-on-bar`, `--color-accent`, `--color-on-accent`, `--color-danger`, `--color-on-danger`, and `--color-on-status` (one value). `color-scheme: light dark` on `:root`. The three status colors from Module 5 are unchanged.
3. `tokens.css`: an `@supports not (color: light-dark(#000, #fff))` block at the end that sets `color-scheme: light` and the light value of each semantic color, for browsers before Chrome 123, Firefox 120 and Safari 17.5.
4. `base.css`: `.button` sets a local `--fill: var(--color-accent)`, uses it as its background and `--color-on-accent` as its text. `.button:hover` is `color-mix(in oklab, var(--fill), black 15%)` (was `#0000ff` for every button). `.button-danger` sets `--fill: var(--color-danger)` and `color: var(--color-on-danger)`, so it darkens its own red on hover.
5. `base.css`: `body`, `.site-header`, `.site-footer` and `pre` use `--color-text`, `--color-surface`, `--color-bar`, `--color-on-bar` and `--color-surface-alt` instead of `#000`, `#fff` and `#eee`.
6. `index.css` `.feature`, `signup.css` `.signup-form` and `settings.css` `.settings th, .settings td`: `border: 1px solid var(--color-border)` (was `#000`).
7. `settings.css`: `.status` text is `var(--color-on-status)` (was `#000`); the comment says "dark text".
8. `index.html`: the lock, layers and lightning feature icons use `currentColor` instead of `#000`, so they follow the text color in both themes. The blue cloud icon (`#0000ff`) is left for Module 8.

After this, `grep -nE '#[0-9a-fA-F]{3,6}\b' base.css index.css settings.css signup.css` prints nothing. The only color keyword left outside `tokens.css` is `black` in the hover's `color-mix()`.

Results (from `research/web-design-for-developers/color-calc/m6/palette-output.txt`, sections C and D):

| Pair | Light theme | Dark theme |
|---|---|---|
| text on surface | `#222222` on `#ffffff`, 15.91:1 | `#e8e8e8` on `#222222`, 12.98:1 |
| muted on surface | `#5d5d5d`, 6.58:1 | `#a4a4a4`, 6.38:1 |
| text on surface-alt (code) | 12.98:1 | 10.31:1 |
| on-bar on bar | 15.91:1 | 10.31:1 |
| on-accent on accent | white on `#0078cd`, 4.60:1 (hover `#005fa5`, 6.60:1) | `#222222` on `#77c4ff`, 8.43:1 (hover `#5f9dce`, 5.46:1) |
| on-danger on danger | white on `#d02c2a`, 5.15:1 (hover `#a72120`, 7.29:1) | `#222222` on `#ff998d`, 7.72:1 (hover `#ce7a70`, 5.03:1) |
| on-status on the labels | 7.53, 7.09, 6.75:1 | same |
| border on surface | 1.86:1 (decoration) | 2.42:1 (decoration) |

Side effects: in the light theme, text, header and footer are `#222222` instead of black, borders are light gray, code blocks are `#e8e8e8` instead of `#eee`, muted text is 6.58:1 instead of 7.46:1, and label text is 7.53, 7.09 and 6.75:1 instead of 9.95, 9.35 and 8.91:1. In the dark theme, form controls and scrollbars also turn dark (`color-scheme`). The hero photo stays bright, and the blue cloud icon keeps its pure blue stroke, dark on the dark page (Module 8). The disabled "Restore selected" button still looks enabled in both themes (Module 9). Under deuteranopia emulation, Done and Failed have the same color; the words carry the meaning. `light-dark()` is Baseline newly available (2024-05-13) and `color-mix()` widely available (2025-11-09), per web-features 3.46.0.

## What Module 7 changed

Layout only: no color, type size or spacing token changed. Every page keeps both themes.

1. `signup.css`: the form is no longer 600 px wide with 150 px labels and 380 px fields. It has `max-inline-size: var(--measure)` (567 px of content at 1280) and `container-type: inline-size`. Each `.row` is a one-column grid with `gap: var(--space-1)`, so labels sit above fields. `@container (width >= 22rem)` turns the rows into two columns, `6em 1fr`, with right-aligned labels and `column-gap: var(--space-3)`. The checkbox row is a flex row with `gap: var(--space-2)`. The fields fill their grid cell (no fixed width).
2. `tokens.css`: three layout tokens. `--page-max: 72rem` (1152 px), `--margin-min: var(--space-4)` (16 px) and `--page-margin: max(var(--margin-min), (100% - var(--page-max)) / 2)`.
3. `base.css`: `.site-header`, `.content` and `.site-footer` use `padding: 10px var(--page-margin)` (was `padding: 10px`). The header's logo and gear, the content and the footer text now share two edges: 64 px from each side at 1280, 16 px at 390.
4. `base.css`: `article` gets `margin-inline: auto`, so the 50ch column is centered (left edge 356 px at 1280). `index.css`: `.hero .muted` and `.quote` get `max-inline-size: var(--measure)`.
5. `index.css`: `.features` is a grid, `repeat(auto-fit, minmax(12.5rem, 1fr))` with `gap: var(--space-5)`; `.feature` lost `flex: 1 1 200px`. At 900 px the fourth card keeps its column width (273 px) instead of stretching to 868 px.
6. `index.css`: each `.feature` is a subgrid, `display: grid; grid-row: span 3; grid-template-rows: subgrid; justify-items: start; gap: var(--space-2)`. The four icons, titles and texts start on the same lines (titles at 895 px, texts at 957 px from the top at 1280).
7. `settings.html`: the Snapshots `h2` has `id="snapshots-title"`, and the table is wrapped in `<div class="table-scroll" role="region" aria-labelledby="snapshots-title" tabindex="0">`. `settings.css`: `.table-scroll { max-inline-size: 100%; overflow-x: auto; }`; `.settings .field` gets `max-inline-size: 100%`; `.settings input, .settings select` get `box-sizing: border-box` and `max-inline-size: 100%`, so the Repository field (`size="40"`) fits at 320 px.

Checks (headless Chrome 157, `research/web-design-for-developers/lab/module-07`): at 320 and 390 px, `document.documentElement.scrollWidth` equals the viewport width on all four pages (before: sign-up 652 px, settings 583 and 586 px). Only the table (573 px at 320) and the code blocks scroll, each inside its own box. With the browser's default font size at 16 px the form switches to side labels at a 426 px viewport; at 24 px, at 618 px.

Side effects: at 1280 the landing title is two lines (the column is 1152 px, the one-line title was 1172 px). The nav still wraps at 390 (two lines) and 320 (three lines); nothing is lost, and the menu is Module 11's (navigation) and Module 9's. On a phone the table cells still wrap dates over four lines inside the scroll box (row density is Module 10's). The scroll box shows the browser's default focus ring (Module 9). `container-type`, `@container`, subgrid, `max()` and logical properties are Baseline widely available (web-features 3.46.0).

## What Module 8 changed

The landing page's photo and every icon on the site. No color token, type size or spacing changed.

1. `index.html`: the hero `<img>` has `width="1200" height="800"`, so the browser gives it `aspect-ratio: auto 1200 / 800` before the file loads.
2. `index.css` `.hero img`: `height: auto` (was `300px`), `max-block-size: 20rem`, `object-fit: cover` and `object-position: 50% 63%`. The photo keeps its 3:2 shape up to a 480 px content width (a 512 px window), then becomes a 320 px band that crops. At 1280 the box is 1152 x 320 and shows rows 294 to 627 of the 800-pixel file (the laptop and the drive; the clock is out of frame). At 390 it is 358 x 239, the whole photo (was 358 x 300, stretched).
3. `index.html`: the photo's alt is `alt=""` (was "A laptop running Stashling on a desk next to an external drive"). It is a mood image that repeats the tagline above it.
4. `index.css`: `@media (prefers-color-scheme: dark) { .hero img { filter: brightness(0.8); } }`, after the `.hero img` rule. In the dark theme the white window frame is `#cccccb` and the wall `#bab5ac` (were `#ffffff` and `#e9e2d7`), so no part of the photo is brighter than the text, `#e8e8e8`.
5. `tokens.css`: `--icon-size: 1.5rem` (24 px, Lucide's grid, so every 2-unit stroke draws 2 px), after `--page-margin`.
6. `index.html`: the four feature icons are Lucide's `lock`, `layers`, `zap` and `cloud`, copied from `icons/` in the Lucide repository (commit `de8d11a`, 2026-11-18) with `aria-hidden="true"` added. All use `stroke="currentColor"` and `stroke-width="2"`; the cloud's `#0000ff` (1.85:1 on the dark page) is gone. `index.css`: `.feature svg { inline-size: var(--icon-size); block-size: var(--icon-size); }`.
7. All four HTML files: the gear in `.settings-link` is Lucide's `settings` icon. `base.css` `.settings-link svg` uses `inline-size` and `block-size: var(--icon-size)` (was 14 px). It still has no visible label (Module 11).

Checks (headless Chrome 157, `research/web-design-for-developers/lab/module-08`): every `svg` on `index.html` is 24 px wide; at 320 px, `document.documentElement.scrollWidth` is 320 on all four pages; the header is still 54 px tall at 1280. Under a 55% black scrim, the white window frame reads `#737373` in a screenshot, matching the computed `rgb(115 115 115)` (4.74:1 for white text); the scrim is a try-out in the module, not part of this folder.

Side effects: at 1280 the photo is 320 px tall (was 300), so everything below it moves down 20 px; the feature titles start 24 px higher inside their cards, because the subgrid's icon row is now 24 px tall (was 48). The gear is 24 px instead of 14 px. In browsers without `light-dark()` (before Chrome 123, Firefox 120, Safari 17.5) the page stays light, but the photo is still dimmed when the system is set to dark. `object-fit`, `object-position`, `filter`, `aspect-ratio` and `currentColor` are Baseline widely available (web-features 3.46.0).

## Planted problems

Rows 1 to 8 are fixed in this folder. The other rows are still open.

| Module | Problem | Where |
|---|---|---|
| 1 | Landing page where everything looks equally important: four identical buttons, every block centered, bold text everywhere, `h1` only 24 px against 18 px body text | `index.html` hero, `index.css` (`.hero`, `.stats`, `.quote`), `base.css` `body` and `h1`-`h3` |
| 2 | Settings page where every margin is 10 px, so labels, fields, sections and headings are all the same distance apart and nothing groups | `settings.css`, every `margin: 10px` rule |
| 3 | Article in the browser's default font (no `font-family` anywhere) | `base.css` `body`; `article.html` |
| 4 | Article text spans the full window width (no max width, default line height) and sits 10 px from the edge on a phone | `base.css` `.content`; `article.html` |
| 5 | Status labels picked with the same HSL lightness (35%) look very different: yellow looks light, red looks dark, and white text on yellow is 2.24:1 | `settings.css` `.status-*` |
| 6 | Brand blue `#3ea6ff` with white text on every button: **2.59:1**, fails WCAG AA (4.5:1 for text, and 3:1 for large text). Also the red danger button, `#ff0000` with white text, is 4.00:1 | `base.css` `.button`, `.button-danger` |
| 7 | Sign-up form fixed at 600 px with 150 px side labels and 380 px fields: fine on a laptop, cut off on a phone, submit button off screen | `signup.css` `.signup-form`, `label`, `input` widths |
| 8 | Hero photo stretched to `width: 100%; height: 300px` without `object-fit` (the round sun and clock become ovals) | `index.css` `.hero img` |
| 8 | Feature icons of mixed styles: 1 px outline at 24 px, solid fill at 48 px, 3 px square-cap stroke at 32 px, blue 2 px stroke at 40 px | `index.html` `#features` inline SVGs |
| 9 | Disabled "Restore selected" button looks enabled: `.button` styles apply to the disabled state too, with `cursor: pointer` | `settings.html` line 163, `base.css` `.button` |
| 9 | Links nobody sees: `a { color: inherit; text-decoration: none }` (written for the nav) makes links in body text look like plain text until hovered | `base.css` `a`; links in `article.html` and the landing download section |
| 10 | Sign-up form shows errors only after submit, one browser bubble at a time; the rules (username `[a-z0-9-]{3,20}`, password 12+ characters) are not written anywhere on the page | `signup.html` `pattern`, `minlength`, `required` |
| 10 | Ragged numbers in the snapshot table: numbers left aligned, headers centered (browser default), mixed units (`18 KB`, `210.6 MB`, `1.2 GB`) and dates of different widths | `settings.html` table, `settings.css` `th, td` |
| 11 | Settings is hard to find: only an unlabeled gear icon at the far right of the nav (14 px before Module 8, now a 24 px Lucide icon) | shared nav in every page (`.settings-link`), `base.css` `.settings-link svg` |

Side effects that come with the plain CSS and are not separate plants: on a phone the
snapshot table is wider than the screen (it scrolls inside its own box since Module 7; its cell layout is Module 10's), and the header
nav wraps onto two lines (Modules 9 and 11).

Contrast ratios are WCAG 2 relative-luminance ratios against white (`#fff`). Row 6 describes the CSS before Module 6; the buttons are now `#0078cd` and `#d02c2a` with white text (4.60:1 and 5.15:1) in the light theme.

## Screenshots

`screenshots/` holds full-page shots of each page at 1280 px and 390 px wide
(`<page>-<width>.webp` in the light theme, `<page>-<width>-dark.webp` in the dark theme). To take one, from the `lab/` folder:

```sh
SCHEME=light node screenshot.mjs module-08/index.html module-08/screenshots/index-1280.webp 1280
node screenshot.mjs module-03/signup.html signup-phone.webp 390 800
```

`node screenshot.mjs <page.html|url> <out.webp> [width=1280] [height]`. Without a height it
captures the full page; with one it captures the top `<height>` px, so a before and an
after get the same crop. Widths under 768 emulate a phone, so the viewport meta tag
applies. It needs Node 22+ (built-in WebSocket), Google Chrome and `cwebp`; no npm
packages. Set `CHROME=` or `CWEBP=` to use other binaries (for example Playwright's
Chromium). Set `VISION=achromatopsia` to emulate a vision deficiency, as the
DevTools Rendering tab does (added in Module 5). Set `SCHEME=light` or `SCHEME=dark` to emulate
`prefers-color-scheme` (added in Module 6). Without it, headless Chrome follows the operating
system's setting, so a light screenshot of `module-06` needs `SCHEME=light` on a Mac in dark mode.
