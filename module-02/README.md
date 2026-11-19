# Module 02: the sample site after Module 2

The sample site as it is at the end of Module 2, "Spacing and Rhythm". Module 3 starts from here. The product is
Stashling, an invented open-source backup tool. Four pages share one nav: `index.html`
(landing), `article.html`, `signup.html` and `settings.html`. Plain HTML and CSS, no
JavaScript, no build step; open any page from the file system.

CSS: `tokens.css` (the course fills it; Module 1 added four tokens, Module 2 a spacing scale), `base.css` (every page), and
`index.css`, `signup.css`, `settings.css` for the pages that need their own.
`images/hero.webp` is a generated 1200 x 800 (3:2) placeholder photo.

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

## Planted problems

Rows 1 and 2 are fixed in this folder. The other rows are still open.

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
| 11 | Settings is hard to find: only a 14 px unlabeled gear icon at the far right of the nav | shared nav in every page (`.settings-link`), `base.css` `.settings-link svg` |

Side effects that come with the plain CSS and are not separate plants: on a phone the
snapshot table is wider than the screen (575 px at a 390 px viewport after Module 2; 551 px before) (relevant to Modules 7 and 10), and the header
nav wraps onto two lines.

Contrast ratios are WCAG 2 relative-luminance ratios against white (`#fff`).

## Screenshots

`screenshots/` holds full-page shots of each page at 1280 px and 390 px wide
(`<page>-<width>.webp`). To take one, from the `lab/` folder:

```sh
node screenshot.mjs module-00/index.html module-00/screenshots/index-1280.webp 1280
node screenshot.mjs module-00/signup.html signup-phone.webp 390 800
```

`node screenshot.mjs <page.html|url> <out.webp> [width=1280] [height]`. Without a height it
captures the full page; with one it captures the top `<height>` px, so a before and an
after get the same crop. Widths under 768 emulate a phone, so the viewport meta tag
applies. It needs Node 22+ (built-in WebSocket), Google Chrome and `cwebp`; no npm
packages. Set `CHROME=` or `CWEBP=` to use other binaries (for example Playwright's
Chromium).
