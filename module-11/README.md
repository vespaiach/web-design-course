# Module 11: the sample site after Module 11

The sample site as it is at the end of Module 11, "Usability: Conventions, Navigation and Quick Tests". Module 12 starts from here. The product is
Stashling, an invented open-source backup tool. Four pages share one nav: `index.html`
(landing), `article.html`, `signup.html` and `settings.html`. Plain HTML and CSS, no build
step; open any page from the file system. Since Module 9, `menu.js` (20 lines since Module 11) turns the nav into a
menu on narrow screens and closes it on Esc; without it, the nav stays visible.

CSS: `tokens.css` (the course fills it; Module 1 added four tokens, Module 2 a spacing scale, Module 3 two font stacks, Module 4 a type scale and text settings, Module 5 three status colors, Module 6 three color scales, twelve semantic colors and a dark theme, Module 7 three layout tokens, Module 8 an icon size, Module 9 component tokens: link and focus colors, a target size, two radii, a shadow, two durations and an easing, Module 10 a field border color and a small target size), `base.css` (every page), and
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

## What Module 9 changed

Every page, through `tokens.css`, `base.css`, one radius in each page's CSS file, the header in all four HTML files, `settings.html` and the new `menu.js`. No color scale, type size or spacing token changed.

1. `tokens.css`: `--color-link` and `--color-focus`, both `var(--color-accent)` (`#0078cd` light, `#77c4ff` dark), so the `@supports not` fallback needs no new lines.
2. `base.css`: `a` uses `--color-link` with the browser's underline and `text-underline-offset: 0.2em`; `a:hover` thickens the line to 2px. `.site-header a` keeps `color: inherit; text-decoration: none` and underlines on hover. Light theme: link 4.60:1 on white and 3.46:1 against the `#222222` text; dark theme: 8.43:1 on `#222222` but only 1.54:1 against the `#e8e8e8` text, so the underline is what marks a link there.
3. `base.css`: `.button:hover` is now `.button:hover:not(:disabled)` inside `@media (hover: hover)`. `.button:disabled` sets `--fill: var(--color-surface-alt)`, `color: var(--color-muted)` and `cursor: not-allowed` (5.37:1 light, 5.07:1 dark; disabled controls are exempt from WCAG contrast). `settings.html`: the sentence "Select a snapshot to restore its files." moved from above the table to just above the button, with `id="restore-hint"`, and the button has `aria-describedby="restore-hint"`.
4. `base.css`: `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }`. The ring is 4.60:1 on white, 3.46:1 on the light header, 3.75:1 on `#e8e8e8`; 8.43:1 and 6.69:1 in the dark theme. Chrome 157's default ring was `#005fcc` (2.66:1 on the light header, 1.30:1 against the blue button it hugs).
5. `tokens.css`: `--target-min: 2.75rem` (44 px). `base.css` `.settings-link` is a 44 x 44 grid box with the 24 px gear centered (was 24 x 25.6 at 390). The header is 64 px tall at 1280 (was 54).
6. `tokens.css`: `--radius-small: 0.25rem` and `--radius-large: 0.5rem`. `.button` and `.status` get the small radius; `.feature` and `.signup-form` the large one.
7. `base.css` `.button`: `padding: var(--space-3) var(--space-5)` (was `10px 20px`) and `text-box: trim-both cap alphabetic`, so `<a class="button">` and `<button class="button">` are the same height: 35.75 px at 390 and 37.09 px at 1280 (were 44.2 and 40 px at 390). `text-decoration: none` moved from the hover rule into `.button`. `.button:active:not(:disabled)` moves the button down 1px.
8. All four HTML files: `<button class="menu-button" type="button" hidden>Menu</button>` after the logo, and `<script src="menu.js" defer></script>` after the stylesheets. `menu.js` shows the button, sets `aria-expanded`, toggles it on click, and closes the menu when focus leaves it (WCAG 2.4.11). `tokens.css`: `--shadow-raised` (Material 3 level 3). `base.css`: `.menu-button` (44 px tall, 1px border in the text color); below `36rem` the nav is a panel under the header (`--color-bar`, bottom corners `--radius-large`, `--shadow-raised`, links padded to 48 px rows); from `36rem` up the button is hidden. The nav needs 560 px for one line at the default font size.
9. `tokens.css`: `--duration-fast: 100ms`, `--duration-medium: 200ms`, `--ease-out: cubic-bezier(0, 0, 0.2, 1)`, labeled as conventions. `.button` transitions its background over `--duration-fast`; the menu fades and slides 0.5rem over `--duration-medium`, and stays visible until the fade ends when it closes. Under `prefers-reduced-motion: reduce` the menu fades without sliding.

Checks (headless Chrome 157, `research/web-design-for-developers/lab/module-09`): at 320 and 390, `document.documentElement.scrollWidth` equals the viewport on all four pages; every button is 35.75 px tall at 390; the gear is 44 x 44; no transition runs on page load; opening the menu runs `opacity` and `transform` transitions (only `opacity` with reduced motion emulated); closing runs `visibility` with a 200 ms delay; focusing a field outside the open menu closes it. Contrast numbers come from `research/web-design-for-developers/color-calc/m9/m9.mjs` (`m9-output.txt`).

Side effects: every link in body text is blue and underlined, including the three hero links and the sign-up form's "terms of service". The header is 10 px taller at 1280. `text-box` is not Baseline (no Firefox, per web-features 3.46.0): there, buttons keep their line height and are taller: by arithmetic, 48 px for `<a class="button">` and about 43 px for `<button>` at 390 (not run in Firefox). The 13 x 13 px checkboxes stay as they are; they pass WCAG 2.5.8 by its spacing exception (rows are at least 36 px apart) and belong to Module 10. `--color-link` and `--color-focus` are the accent today; change them separately if the accent ever changes.

## What Module 10 changed

The sign-up form, the settings table, and every field and checkbox on the site, through `tokens.css`, `base.css`, `signup.css`, `settings.css`, `signup.html` and `settings.html`. No color scale, type size or spacing token changed, and no script was added.

1. `signup.css`: the `@container` rule and `container-type` are gone, so every label sits above its field at every width. Rows are `margin-bottom: var(--space-inside)` (16 px, was 10 px) with 4 px between a label and its field. `.actions { text-align: right; }` is gone, so "Create account" starts on the form's left edge.
2. `signup.html`: "Full name (optional)" without `required`. Hints under the Username and Password labels (`p.hint`, linked with `aria-describedby`): "Use 3 to 20 lowercase letters, numbers or hyphens" and "Use at least 12 characters". `autocomplete` on every field (`name`, `email`, `username`, `new-password`); `autocapitalize="none"` and `spellcheck="false"` on Username. The pattern is now `[a-z0-9\-]{3,20}`: browsers compile `pattern` with the `v` flag, where an unescaped `-` in a class is a syntax error, so Chrome 157 ignored the old pattern and accepted "Dana" (it logs "Pattern attribute value [a-z0-9-]{3,20} is not a valid regular expression"). `signup.css`: `.hint` in `--color-muted` (6.58:1 light, 6.38:1 dark).
3. `tokens.css`: `--color-field-border: var(--color-muted)`. `base.css`: one rule for `input:not([type="checkbox"])` and `select`: `padding: var(--space-2)`, a 1px `--color-field-border` edge (6.58:1 on white, 6.38:1 on `#222222`), `--radius-small`, `--color-surface` fill, inherited text color, `--step-0`. Chrome 157's own edges were `#767676` (4.54:1) and `#858585` (4.31:1 on the page, 3.04:1 on its `#3b3b3b` fill), so they passed; `--color-border` (`#bebebe`, 1.86:1) would not have. `signup.css`: the old `padding: 5px` rule is gone; `[name="username"]` has `max-inline-size: 20ch` (227 px at 1280). `settings.css`: the duplicate `font-size` on fields is gone.
4. `signup.html`: an error message inside each required field's `<label>` (`span.field-error`), worded as GOV.UK does. `signup.css`: the message is `display: none` until `.row:has(:user-invalid)`, then bold `--color-danger` text (5.15:1 light, 7.72:1 dark) and a `--color-danger` field edge; the hint hides while the message shows. Because the message is in the label, Chrome adds it to the field's accessible name only while it shows (checked in Chrome's accessibility tree). The browser's own bubble still appears on submit.
5. `settings.css`: `th, td` get `text-align: start`; columns 4 to 7 (`:nth-child(n + 4):nth-child(-n + 7)`) get `text-align: end` and `font-variant-numeric: tabular-nums`. The lab's Inter file has `tnum` (checked with fontTools: every digit 0.648 em with it, 0.407 to 0.646 em without).
6. `settings.html`: one unit and one precision per column: "Size (GB)" with two decimals, "Added (MB)" with one decimal (18 KB shows as 0.0), Duration as h:mm:ss. 1 GB = 1,000 MB here.
7. `settings.css`: `white-space: nowrap` on `th, td`. At 390 a row is 33 px tall (was 106 px, with dates on four lines); the table scrolls inside its box.
8. `settings.html`: a last row `tr.empty-row` with "No snapshots yet. The first backup runs at 2:00 AM, as set under Backup schedule." and a "Back up now" button. `settings.css`: `.empty-row:not(:only-child) { display: none; }`, so it shows only when the server sends no other rows.
9. `tokens.css`: `--target-small: 1.5rem`. `base.css`: checkboxes are 24 x 24 px with `margin: 0`. `signup.css`: `.checkbox-row` uses `align-items: start`. Table rows are 40 px at 1280 (were 36) and 39.2 px at 390.

Checks (headless Chrome 157, this folder): `:user-invalid` timing with real key and mouse events (`color-calc/m10/timing.mjs`; output in `timing-module-10.txt`); accessible names (`color-calc/m10/ax.mjs`); `document.documentElement.scrollWidth` equals the viewport at 320 on all four pages; Butterick's zeros-and-ones test in the page (ten zeros and ten ones are both 116.66 px with `tabular-nums`, 113.50 and 73.19 px without). Contrast numbers come from `color-calc/m10/m10.mjs` (`m10-output.txt`).

Side effects: every text field and select on the site has the new edge, padding and corners, including the settings page. Without `:has()` (widely available only since June 2026) the messages stay hidden and the browser's bubbles remain. The table's numeric columns are found by position, so a new column means new numbers in that selector. Firefox and Safari were not run.

## What Module 11 changed

The shared header of all four pages, through the four HTML files, `base.css` and `menu.js`, after a heuristic review of the site against three of Nielsen's ten heuristics (4 Consistency and Standards, 6 Recognition Rather than Recall, 1 Visibility of System Status). No token changed.

1. All four HTML files: the gear link shows the word "Settings" after the icon; its `title` and `aria-label` are gone, because the visible word now names it (Chrome 157's accessibility tree gives "Settings" before and after). `base.css` `.settings-link`: `display: flex; align-items: center; gap: var(--space-2); min-block-size: var(--target-min)` (was a 44 x 44 grid box). The link is 101.3 x 44 px at 1280 and 94.2 x 44 px at 390.
2. `base.css`: the menu breakpoint moves from `36rem` to `39rem` in both media queries, because the labeled link makes the header need 608 px (measured in Chrome 157: it wraps from 576 to 607 px with the old breakpoint).
3. All four HTML files: "Sign up" has `class="nav-account"`. `base.css`, inside `@media (width >= 39rem)`: the nav gets `flex: 1` and `.nav-account` gets `margin-inline-start: auto`, so Sign up sits at the right end of the bar, 15 px from Settings, apart from Home, Features, Blog and Download. Below 39rem it stays the last link in the menu.
4. All four HTML files: `aria-current="page"` on the link to the page itself (Home, Blog, Sign up, Settings). `base.css`: `.site-header a[aria-current="page"]` has a 3 px underline, offset 0.4em, after the hover rule so that hover does not thin it.
5. `menu.js`: a `keydown` listener on the document closes the open menu on Escape and moves focus to the Menu button. Chrome 157 closes its own `popover` and modal `<dialog>` on Esc too (checked with real key events, `color-calc/m11/esc.mjs`).

Checks (headless Chrome 157, this folder): `document.documentElement.scrollWidth` equals the viewport at 320 and 390 on all four pages; the header is one 64 px row at 320, 390, 624 and 1280; Esc with focus in the open menu sets `aria-expanded="false"`, hides the nav and focuses the Menu button (`esc-output.txt`); accessible names of the header links (`ax-output.txt`). The scripts are in `research/web-design-for-developers/color-calc/m11/`.

Side effects: at 320 the bar's three items need 290.5 px of a 288 px content box, so the right margin is 13.5 px instead of 16; nothing scrolls. "Sign up" and "Settings" are grouped only by space on wide screens; the two links are not in one landmark (Settings is outside the `<nav>`, as before). A real Stashling would show Sign up to visitors and Settings to people who are signed in; the sample site has no sign-in, so it shows both. Firefox, Safari and a screen reader were not run.

Open findings from the review, not fixed here: the browser's validation bubble still appears next to the inline messages on the sign-up form; the empty snapshot table still shows "Select a snapshot to restore its files" and a disabled Restore button; "Blog" leads to one article, not a list; the snapshot table on a phone scrolls the Snapshot column out of view.

## Planted problems

Rows 1 to 11 are fixed in this folder. The other rows are still open.

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
snapshot table is wider than the screen (it scrolls inside its own box since Module 7; since Module 10 each row stays on one line), and the header
nav wrapped onto two lines (a menu since Module 9, below 39rem since Module 11).

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

Two more variables were added in Module 9, for states that a still page does not show:

- `FORCE='<selector>=<state>[,<state>][;…]'` forces CSS states on the first element that matches, as the `:hov` panel in DevTools does. Example: `FORCE='.settings-link=focus,focus-visible'` draws the focus ring without a keyboard.
- `EVAL='<js>'` runs a script in the page before the screenshot, and waits for it if it returns a promise. Example: `EVAL='document.querySelector(".menu-button").click(); new Promise((r) => setTimeout(r, 400))'` opens the menu and waits for its transition to end.

```sh
SCHEME=dark FORCE='.settings .button=focus,focus-visible' node screenshot.mjs module-09/settings.html focus.webp 390 600
```

Since Module 10, a form's error state can be captured too. `EVAL` with `requestSubmit()` runs the browser's validation, as pressing the submit button does, so every field shows its `:user-invalid` state, and headless Chrome 157 captures the browser's bubble as well:

```sh
SCHEME=light EVAL='document.querySelector("form").requestSubmit(); new Promise((r) => setTimeout(r, 500))' node screenshot.mjs module-10/signup.html errors.webp 1280
```

A field that the user changed and left cannot be set up this way, because a script that sets a value does not count as the user's change. `research/web-design-for-developers/color-calc/m10/final.mjs` types with real key events through the DevTools protocol instead.

Motion cannot be seen in a screenshot. To watch the menu's timing, open any page in a window narrower than 624 px and click Menu; set `--duration-medium: 600ms` in `tokens.css` to see it slowed down, or turn on the system's reduce-motion setting to see the fade without the slide.
