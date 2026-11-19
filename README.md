# Web Design for Developers: course code

The code for the free course [Web Design for Developers](https://stayon.online/web-design-for-developers/) on Stay Online.

Stashling is a plain sample site for an invented backup tool. Each folder holds the site as it is at the end of one module:

| Folder | State |
| --- | --- |
| `module-00` | The starting site, before Module 1 |
| `module-01` to `module-12` | The site after that module's lab |

Each folder's `README.md` lists what that module changed. The pages are plain HTML and CSS with no build step: open any `.html` file in a browser.

Other files:

- `screenshot.mjs` takes the screenshots the modules use. It needs Node.js 22, Chrome and `cwebp`. Usage is in its header.
- `color-calc/` holds the scripts that computed the contrast ratios, colors and measurements printed in the modules. Run `npm install` in that folder before running them.

Third-party files keep their own licenses: the Inter font (SIL Open Font License, `fonts/OFL.txt`) and the Lucide icons (ISC, `icons/LICENSE`).
