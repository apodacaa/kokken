// Cook mode: pairs each step with the ingredients it mentions, at build time,
// so no content file needs a new field. Matching is a word heuristic:
// an ingredient's name is its text minus quantity, units, parentheticals,
// prep notes after the first comma and descriptor words. It matches a step
// when a word unique to it appears there, or its whole name does. Generic words ("oil",
// "juice") only match when the step doesn't name a different ingredient
// sharing that word, so "lemon juice" doesn't pull in the lime juice.
// Every ingredient also appears on cook mode's opening "gather" card, so a
// miss costs nothing but convenience. Fallbacks are at the end of cookSteps.

const SKIP = new Set(`
  a an and or of the to for with into from in on as at about plus each per
  oz ounce ounces lb lbs pound pounds g kg mg ml l cl dl cup cups tbsp tsp
  tablespoon tablespoons teaspoon teaspoons pinch pinches dash dashes quart
  quarts pint pints gallon inch inches cm mm can cans jar jars package
  packages bunch bunches sprig sprigs stick sticks piece pieces slice slices
  handful splash drop drops small medium large extra fresh freshly whole
  chopped minced diced sliced grated shredded ground crushed peeled halved
  quartered trimmed toasted divided packed softened melted cold warm hot
  room temperature finely coarsely roughly thinly thick thin good quality
  kosher virgin optional more taste serving garnish needed such like
  store bought homemade boneless skinless
`.split(/\s+/).filter(Boolean));

// Heads that name many different ingredients; never enough on their own.
const GENERIC = new Set(['oil', 'juice', 'sauce', 'powder', 'leaf', 'leav',
  'seed', 'stock', 'broth', 'vinegar', 'paste', 'zest', 'water', 'flake',
  'syrup', 'wine', 'cheese', 'pepper', 'sugar']);

function stem(w) {
  w = w.toLowerCase();
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.length > 3 && w.endsWith('e')) w = w.slice(0, -1);
  return w;
}

function words(text) {
  return (text.toLowerCase().match(/[a-zà-ÿ]+/g) || []).map(stem);
}

function nameTokens(item) {
  const name = String(item).replace(/\([^)]*\)/g, ' ').split(',')[0];
  const toks = (name.toLowerCase().match(/[a-zà-ÿ]+/g) || [])
    .filter(w => w.length > 1 && !SKIP.has(w))
    .map(stem);
  return [...new Set(toks)];
}

/** [{ section, items: [{ i, text }] }] with a running index across sections. */
function ingredientGroups(ingredients) {
  if (!Array.isArray(ingredients)) return [];
  const groups = [];
  let i = 0;
  let loose = null;
  for (const entry of ingredients) {
    if (typeof entry === 'string') {
      if (!loose) { loose = { section: null, items: [] }; groups.push(loose); }
      loose.items.push({ i: i++, text: entry });
    } else if (entry && Array.isArray(entry.items)) {
      loose = null;
      const section = entry.section && entry.section !== '_main_' ? entry.section : null;
      groups.push({ section, items: entry.items.map(text => ({ i: i++, text })) });
    }
  }
  return groups;
}

function inSection(ing, inStep) {
  return ing.section && words(ing.section).every(w => inStep.has(w)) ? 1 : 0;
}

/** [{ text, items: [{ i, text, section }] }], one per step. */
function cookSteps(steps, ingredients) {
  if (!Array.isArray(steps)) return [];
  const flat = [];
  for (const g of ingredientGroups(ingredients)) {
    for (const it of g.items) {
      const toks = nameTokens(it.text);
      flat.push({
        ...it,
        section: g.section,
        specific: toks.filter(t => !GENERIC.has(t)),
        generic: toks.filter(t => GENERIC.has(t)),
      });
    }
  }
  // A specific word shared with another ingredient ("beef" in beef chuck and
  // beef stock) isn't distinctive. It still matches an ingredient with no
  // generic word (the chuck), but one with a generic word (the stock) then
  // also needs that word in the step.
  for (const ing of flat) {
    ing.distinct = ing.specific.filter(t => !flat.some(o => o !== ing &&
      (o.specific.includes(t) || o.generic.includes(t))));
  }
  const out = steps.map(text => {
    const inStep = new Set(words(String(text)));
    const seen = new Set();
    const items = flat.filter(ing => {
      if (ing.distinct.some(t => inStep.has(t))) return true;
      const spec = ing.specific.some(t => inStep.has(t));
      const gen = ing.generic.filter(t => inStep.has(t));
      if (spec && (!ing.generic.length || gen.length)) return true;
      // Generic word alone: only if no other ingredient sharing it is named.
      return gen.some(g => !flat.some(o => o !== ing && o.generic.includes(g) &&
        o.specific.some(t => inStep.has(t) && !ing.specific.includes(t))));
    })
      // Same text twice (salt in two sections): keep the copy whose section
      // the step names, else the first. Sort is stable, so order otherwise holds.
      .sort((a, b) => inSection(b, inStep) - inSection(a, inStep))
      .filter(ing => !seen.has(ing.text) && seen.add(ing.text))
      .sort((a, b) => a.i - b.i)
      .map(({ i, text, section }) => ({ i, text, section }));
    return { text, inStep, items };
  });

  // Ingredients no step names fall back to a step that names their section
  // ("Stir the glaze"); if nothing matched anywhere (most cocktails), the
  // whole list belongs to the first step.
  const used = new Set(out.flatMap(s => s.items.map(x => x.i)));
  if (!used.size && out.length) {
    out[0].items = flat.map(({ i, text, section }) => ({ i, text, section }));
  } else {
    for (const ing of flat) {
      if (used.has(ing.i) || !ing.section) continue;
      const sec = words(ing.section);
      const step = out.find(s => sec.every(w => s.inStep.has(w)));
      if (step && !step.items.some(x => x.text === ing.text)) step.items.push({ i: ing.i, text: ing.text, section: ing.section });
    }
  }
  return out.map(({ text, items }) => ({ text, items }));
}

module.exports = { ingredientGroups, cookSteps };
