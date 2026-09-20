Køkken is an Eleventy‑powered cooking notebook for recipes, cocktails, and grilling/smoking guides. Content is plain Markdown with concise front matter, rendered through lightweight Nunjucks layouts. Ingredients support sections, steps are compact and readable, and units are standardized (US first, metric in parentheses). Collections for Recipes, Cocktails, Grill Guides, and Smoke Guides are alphabetically sorted. Content lives in `content/recipes`, `content/cocktails`, `content/grill`, and `content/smoke`; layouts and partials live in `_includes`. It’s designed to be simple to write, quick to navigate, and easy to share—your personal kitchen canon with clear structure and clean presentation.

**Running Locally**
- Prerequisites: Node.js 18+ and npm.
- Install deps: `npm install`
- Start dev server: `npm run dev`
  - Serves Eleventy at `http://localhost:8080` and watches content/layouts.
  - Watches Tailwind input and rebuilds `assets/styles.css` on change.
- Build for production: `npm run build` (outputs static site to `_site/`).
- Preview the build: `npm run preview` (serves `_site/` at `http://localhost:5000`).

Edits under `content/` and `_includes/` hot‑reload in dev. The nav and indexes are generated from Eleventy collections and will update automatically when you add or rename files.

**Markdown Structure**
- Recipes (`content/recipes/*.md`):
  - title: Display name on pages and lists (required).
  - slug: URL segment, must be unique (required).
  - layout: Always `layouts/recipe.njk` (required to render with the recipe template).
  - permalink: Always `/recipes/{{ slug }}/` for stable URLs.
  - ingredients: Either a flat list of strings, or a list of sections `{ section, items }`. Sections render sub‑headings; use US units first with metric in parentheses.
  - steps: Ordered steps to follow; rendered as the method section (required).
  - notes: Optional free‑text note rendered after steps (tips, serving notes).
  - references: Optional related links list with entries `{ slug, title, type }` where `type` is `recipe | cocktail | smoke | grill` (drives URL building in the template).

- Cocktails (`content/cocktails/*.md`):
  - title, slug, layout (`layouts/cocktail.njk`), permalink `/cocktails/{{ slug }}/`.
  - ingredients: List of strings. Use oz first with cl in parentheses (e.g., `2 oz (6 cl) gin`).
  - steps: Short method lines (shake/stir/build); optional references.

- Smoke Guides (`content/smoke/*.md`):
  - title, slug, layout (`layouts/smoke.njk`), permalink `/smoke/{{ slug }}/`.
  - amount: Optional display of weight/size (e.g., `10–14 lb`).
  - phases: Required array of objects with keys:
    - name (e.g., Smoke, Wrap, Rest, Sear), temperature, duration, doneness, wood.
    - Wood belongs in the relevant phase so the UI shows it alongside temp/time.
  - Body notes are generally avoided—prefer structured phases so the guide is scannable.

- Grill Guides (`content/grill/*.md`):
  - title, slug, layout (`layouts/grill.njk`), permalink `/grill/{{ slug }}/`.
  - gas: Time/heat guidance for gas grills.
  - charcoal: Time/heat guidance for charcoal grills.
  - done: Target internal temperature or doneness description.

- Collections:
  - All lists are sorted alphabetically by title for fast scanning.
  - Custom collections: `recipes`, `cocktails`, `smokeGuides`, `grillGuides` power indexes and the home page.

**Tags are disabled — do not add a `tags:` field.** `_data/site.json` sets `features.tags: false`,
every tag block was stripped in commit `7756b04`, and no content file carries one. The `tagList` /
`tagsMap` / `tagsWithCounts` collections and the `tags/` pages are dormant behind that flag, so a
`tags:` field renders nothing.

**Deployment**

The site is live at **https://kokken.pages.dev**, hosted on **Cloudflare Pages**.

- Cloudflare is connected directly to the GitHub repo (`apodacaa/kokken`). Pushing to `master`
  triggers a Cloudflare build, which runs the Eleventy + Tailwind build and serves `_site/`.
  Publishing a content change is just `git push`.
- **Nothing in this repo configures the deploy.** There is no `wrangler.toml`, no
  `.github/workflows/`, and `_site/` is gitignored. The build command, output directory and Node
  version all live in the Cloudflare Pages dashboard. Searching the repo for the host finds
  nothing — that is expected, not a sign it is unconfigured.
- `.pages.yml` is **not** a deploy config. It is [PagesCMS](https://pagescms.org) config, a
  browser-based editor for the Markdown in `content/`. The name is misleading.
- `.nojekyll` is a leftover from an earlier GitHub Pages attempt and is inert under Cloudflare.
- **GitHub Pages was disabled on 2026-09-20.** It had been serving the unbuilt repo root at
  `apodacaa.github.io/kokken/`, which returned 404 for every page because the built site was never
  committed. Cloudflare makes it redundant; do not re-enable it.
