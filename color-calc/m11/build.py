#!/usr/bin/env python3
"""Build Module 11's lab states: s0 = module-10, s1..s4 = after each lab step; s4 is copied to module-11."""
import shutil, pathlib, sys

LAB = pathlib.Path(__file__).resolve().parents[2]  # repository root, which holds the module-NN folders
OUT = pathlib.Path(__file__).parent / 'states'
PAGES = ['index.html', 'article.html', 'signup.html', 'settings.html']

def sub(path, old, new, count=1):
    t = path.read_text()
    n = t.count(old)
    assert n == count, f'{path.name}: expected {count} of {old!r}, found {n}'
    path.write_text(t.replace(old, new))

def step1(d):
    # Label the gear
    for p in PAGES:
        sub(d / p, '    <a class="settings-link" href="settings.html" title="Settings" aria-label="Settings">\n',
                   '    <a class="settings-link" href="settings.html">\n')
        sub(d / p, '        <circle cx="12" cy="12" r="3"/>\n      </svg>\n    </a>\n',
                   '        <circle cx="12" cy="12" r="3"/>\n      </svg>\n      Settings\n    </a>\n')
    sub(d / 'base.css', '''.settings-link {
  margin-left: auto;
  display: grid; /* centers the 24px icon in a 44px box that takes the tap */
  place-items: center;
  min-inline-size: var(--target-min);
  min-block-size: var(--target-min);
}''', '''/* The gear and its word in one link, 44px tall like the Menu button */
.settings-link {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-block-size: var(--target-min);
}''')
    sub(d / 'base.css', '''/* Below 36rem the nav does not fit on one line (it needs 560px), so it becomes a menu */
@media (width < 36rem) {''', '''/* Below 39rem the header does not fit on one line (it needs 608px), so the nav becomes a menu */
@media (width < 39rem) {''')
    sub(d / 'base.css', '@media (width >= 36rem) {', '@media (width >= 39rem) {')

def step2(d):
    # Sign up joins Settings at the right end of the bar
    for p in PAGES:
        sub(d / p, '<a href="signup.html">Sign up</a>', '<a class="nav-account" href="signup.html">Sign up</a>')
    sub(d / 'base.css', '''@media (width >= 39rem) {
  .menu-button {
    display: none;
  }
}''', '''@media (width >= 39rem) {
  .menu-button {
    display: none;
  }

  /* The nav fills the bar, so Sign up can start the account links at its right end, next to Settings */
  .site-header nav {
    flex: 1;
  }

  .nav-account {
    margin-inline-start: auto;
  }
}''')

CURRENT = {
    'index.html': '<a href="index.html">Home',
    'article.html': '<a href="article.html">Blog',
    'signup.html': '<a class="nav-account" href="signup.html">Sign up',
    'settings.html': '<a class="settings-link" href="settings.html">',
}

def step3(d):
    # Mark the current page
    for p, link in CURRENT.items():
        sub(d / p, link, link.replace('">', '" aria-current="page">'))
    sub(d / 'base.css', '''.site-header a:hover {
  text-decoration: underline;
}
''', '''.site-header a:hover {
  text-decoration: underline;
}

/* The current page: a thick line under its link, so the header says where you are */
.site-header a[aria-current="page"] {
  text-decoration-line: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 0.4em;
}
''')

def step4(d):
    # Esc closes the menu
    t = (d / 'menu.js').read_text()
    (d / 'menu.js').write_text(t + '''// Esc closes the menu and puts focus back on its button, as Esc closes the browser's own popovers
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && button.ariaExpanded === "true") {
    button.ariaExpanded = "false";
    button.focus();
  }
});
''')

if __name__ == '__main__':
    if OUT.exists():
        shutil.rmtree(OUT)
    prev = OUT / 's0'
    shutil.copytree(LAB / 'module-10', prev, ignore=shutil.ignore_patterns('screenshots', 'README.md'))
    for i, f in enumerate([step1, step2, step3, step4], 1):
        d = OUT / f's{i}'
        shutil.copytree(prev, d)
        f(d)
        prev = d
    print('built', [p.name for p in sorted(OUT.iterdir())])
