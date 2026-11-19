#!/usr/bin/env python3
"""Build Module 12's lab states. s0 = module-11; each later state adds one lab step.
The last state is copied to lab/module-12 (README and screenshots are added there by hand).
Run: python3 build.py [breakpoint-rem]"""
import shutil, pathlib, sys

LAB = pathlib.Path(__file__).resolve().parents[2]  # repository root, which holds the module-NN folders
HERE = pathlib.Path(__file__).parent
OUT = HERE / 'states'
SRC = HERE / 'src'
PAGES = ['index.html', 'article.html', 'signup.html', 'settings.html']
BP = sys.argv[1] if len(sys.argv) > 1 else None  # the measured breakpoint, e.g. "43rem"


def sub(path, old, new, count=1):
    t = path.read_text()
    n = t.count(old)
    assert n == count, f'{path.name}: expected {count} of {old!r}, found {n}'
    path.write_text(t.replace(old, new))


def step1(d):
    # Sketch in gray boxes: a throwaway page, not linked from the site
    shutil.copy(SRC / 'sketch.html', d / 'sketch.html')


def step2(d):
    # Pricing joins the nav; the HTML of the new page, with no page CSS yet
    for p in PAGES:
        sub(d / p, '      <a href="index.html#features">Features</a>\n',
                   '      <a href="index.html#features">Features</a>\n      <a href="pricing.html">Pricing</a>\n')
    shutil.copy(SRC / 'pricing-v1.html', d / 'pricing.html')


def step2b(d):
    # The measured breakpoint
    assert BP, 'pass the measured breakpoint'
    px = int(float(BP.removesuffix('rem')) * 16)
    for f in [d / 'base.css']:
        sub(f, '/* Below 39rem the header does not fit on one line (it needs 608px), so the nav becomes a menu */\n@media (width < 39rem) {',
               f'/* Below {BP} the header does not fit on one line (it needs {NEED}px), so the nav becomes a menu */\n@media (width < {BP}) {{')
        sub(f, '@media (width >= 39rem) {', f'@media (width >= {BP}) {{')


def step3(d):
    # Build: the page CSS, from tokens only
    shutil.copy(SRC / 'pricing-v1.css', d / 'pricing.css')


def step4(d):
    # Critique change 1: the price leads each plan
    sub(d / 'pricing.css', '''.price {
  font-weight: bold;
}

.price span {
  color: var(--color-muted);
  font-weight: normal;
}''', '''/* The plan's name steps down, so the price below it can lead */
.plan h2 {
  font-size: var(--step-1);
}

/* The price is what people compare, so it is the largest text in a plan */
.price {
  font-size: var(--step-3);
  font-weight: bold;
  line-height: var(--leading-heading);
}

.price span {
  color: var(--color-muted);
  font-size: var(--step-0);
  font-weight: normal;
}''')


def step5(d):
    # Critique change 2: one primary action
    sub(d / 'pricing.html', '<a class="button" href="index.html#download">Download 2.4</a>',
                            '<a href="index.html#download">Download 2.4</a>')
    sub(d / 'pricing.html', '<a class="button" href="signup.html">Sign up for 1 TB</a>',
                            '<a href="signup.html">Sign up for 1 TB</a>')


def step6(d):
    # Critique change 3: the recommended plan says so in words
    sub(d / 'pricing.html', '''    <section class="plan plan-recommended" aria-labelledby="plan-100">
''', '''    <section class="plan plan-recommended" aria-labelledby="plan-100">
      <p class="plan-label">Recommended</p>
''')
    sub(d / 'pricing.css', '''.plan-recommended {
  border-color: var(--color-accent);
}''', '''/* The recommended plan says so in words, and its edge is thicker as well as blue */
.plan-recommended {
  position: relative;
  border: 2px solid var(--color-accent);
}

/* The label sits on the top edge, so it adds no row and the prices stay in line */
.plan-label {
  position: absolute;
  top: 0;
  left: var(--space-5);
  transform: translateY(-50%);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-small);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: var(--step--1);
  font-weight: 600;
}''')


def step7(d):
    # The design system page
    shutil.copy(SRC / 'system.html', d / 'system.html')
    shutil.copy(SRC / 'system.css', d / 'system.css')


NEED = None
if __name__ == '__main__':
    if len(sys.argv) > 2:
        NEED = sys.argv[2]
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    prev = LAB / 'module-11'
    steps = [('s0', None), ('s1', [step1]), ('s2a', [step2])]
    if BP:
        steps += [('s2', [step2b]), ('s3', [step3]), ('s4', [step4]), ('s5', [step5]), ('s6', [step6]), ('s7', [step7])]
    for name, fns in steps:
        d = OUT / name
        shutil.copytree(prev, d, ignore=shutil.ignore_patterns('screenshots', 'README.md'))
        for fn in fns or []:
            fn(d)
        prev = d
        print('built', name)
