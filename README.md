Køkken is an Eleventy‑powered cooking notebook for recipes, cocktails, and grilling/smoking guides. Content is plain Markdown with concise front matter, rendered through lightweight Nunjucks layouts. Ingredients support sections, steps are compact and readable, and units are standardized (US first, metric in parentheses). Collections for Recipes, Cocktails, Grill Guides, and Smoke Guides are alphabetically sorted, while tag pages group items by section for fast browsing. Content lives in `content/recipes`, `content/cocktails`, `content/grill`, and `content/smoke`; layouts and partials live in `_includes`. It’s designed to be simple to write, quick to navigate, and easy to share—your personal kitchen canon with clear structure and clean presentation.

**Running Locally**
- Prerequisites: Node.js 18+ and npm.
- Install deps: `npm install`
- Start dev server: `npm run dev`
  - Serves Eleventy at `http://localhost:8080` and watches content/layouts.
  - Watches Tailwind input and rebuilds `assets/styles.css` on change.
- Build for production: `npm run build` (outputs static site to `_site/`).
- Preview the build: `npx serve _site` (or any static server) and open the printed URL.

Edits under `content/` and `_includes/` hot‑reload in dev. The nav, indexes, and tag pages are generated from Eleventy collections and will update automatically when you add or rename files.

**Markdown Structure**
- Recipes (`content/recipes/*.md`):
  - title: Display name on pages and lists (required).
  - slug: URL segment, must be unique (required).
  - tags: Used for tag pages and filtering (add a protein/type like chicken, beef, pasta; avoid overly niche tags).
  - layout: Always `layouts/recipe.njk` (required to render with the recipe template).
  - permalink: Always `/recipes/{{ slug }}/` for stable URLs.
  - ingredients: Either a flat list of strings, or a list of sections `{ section, items }`. Sections render sub‑headings; use US units first with metric in parentheses.
  - steps: Ordered steps to follow; rendered as the method section (required).
  - notes: Optional free‑text note rendered after steps (tips, serving notes).
  - references: Optional related links list with entries `{ slug, title, type }` where `type` is `recipe | cocktail | smoke | grill` (drives URL building in the template).

- Cocktails (`content/cocktails/*.md`):
  - title, slug, tags, layout (`layouts/cocktail.njk`), permalink `/cocktails/{{ slug }}/`.
  - ingredients: List of strings. Use oz first with cl in parentheses (e.g., `2 oz (6 cl) gin`).
  - steps: Short method lines (shake/stir/build); optional references.

- Smoke Guides (`content/smoke/*.md`):
  - title, slug, tags (include `smoke` + meat type), layout (`layouts/smoke.njk`), permalink `/smoke/{{ slug }}/`.
  - amount: Optional display of weight/size (e.g., `10–14 lb`).
  - phases: Required array of objects with keys:
    - name (e.g., Smoke, Wrap, Rest, Sear), temperature, duration, doneness, wood.
    - Wood belongs in the relevant phase so the UI shows it alongside temp/time.
  - Body notes are generally avoided—prefer structured phases so the guide is scannable.

- Grill Guides (`content/grill/*.md`):
  - title, slug, tags (include `grill` + meat type), layout (`layouts/grill.njk`), permalink `/grill/{{ slug }}/`.
  - gas: Time/heat guidance for gas grills.
  - charcoal: Time/heat guidance for charcoal grills.
  - done: Target internal temperature or doneness description.

- Tag Pages & Collections:
  - Tags are collected site‑wide and grouped by section (Recipes, Cocktails, Smoke, Grill).
  - All lists are sorted alphabetically by title for fast scanning.
  - Custom collections: `recipes`, `cocktails`, `smokeGuides`, `grillGuides` power indexes and the home page.
