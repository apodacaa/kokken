// Automatically compute tags for all recipes at build time.
// Rules:
// - Keep any explicit tags present (e.g., 'main', 'vegetarian') for classification.
// - Add wine pairings (variety/style) and key ingredients from front matter.
// - Normalize to lowercase ASCII; use spaces for multiword tags.
// - Prune quantities/units and common prep descriptors.

function removeDiacritics(str) {
  return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

function norm(s) {
  return removeDiacritics(String(s || '')).toLowerCase().trim().replace(/\s+/g, ' ');
}

const STOPWORDS = new Set([
  'cup','cups','tbsp','tsp','ml','g','kg','lb','lbs','oz','l','liter','liters','teaspoon','teaspoons','tablespoon','tablespoons',
  'clove','cloves','slice','slices','sliced','chopped','minced','diced','grated','ground','crushed','thinly','finely','roughly',
  'to','taste','and','or','of','with','plus','for','fresh','dry','dried','large','small','medium','whole','halved','quartered','rinsed',
  'peeled','seeded','deveined','tails','removed','optional','divided','warm','cold','hot','soft','hard','extra','virgin','freshly',
  'coarse','kosher','black','red','green','yellow','ripe','juice','wedges','leaves','sprigs','sprig','stalks','pieces','balls',
  'head','heads','bunch','bunches','can','cans','packed','loosely','lightly','beaten','light','heavy','unsalted','salted','room','temperature'
]);

const PRUNE_DESCRIPTORS = new Set([
  'washed','torn','pressed','chunks','smashed','warmed','unoaked','cooled','matchsticks','seasoned','drained','crumbled','softened'
]);

function splitOnOrAnd(s) {
  // Split on 'and/or', 'and or', 'or', 'and', and '/'
  return s
    .split(/\band\s*\/\s*or\b|\band\s+or\b|\bor\b|\band\b|\//i)
    .map(x => x.trim())
    .filter(Boolean);
}

function tokenize(segment) {
  const words = segment.split(/[^a-zA-Z]+/).filter(Boolean).map(w => w.toLowerCase());
  return words.filter(w => !STOPWORDS.has(w) && !PRUNE_DESCRIPTORS.has(w));
}

function cleanIngredientPhrase(phrase) {
  // Remove parentheticals
  let p = phrase.replace(/\([^)]*\)/g, '');
  // Remove leading quantity and symbols
  p = p.replace(/^[\d/\-.\s]+/, '');
  const parts = [];
  for (const piece of splitOnOrAnd(p)) {
    for (const seg of piece.split(',')) {
      const toks = tokenize(norm(seg));
      if (toks.length) {
        parts.push(toks.slice(0, 3).join(' '));
      }
    }
  }
  return parts;
}

function extractIngredientTags(data) {
  const out = new Set();
  const sections = Array.isArray(data.ingredients) ? data.ingredients : [];
  for (const section of sections) {
    const items = section && Array.isArray(section.items) ? section.items : [];
    for (const item of items) {
      for (const t of cleanIngredientPhrase(String(item))) {
        if (!t) continue;
        if (t === 'salt pepper') { out.add('salt'); out.add('pepper'); continue; }
        out.add(t);
        // Also add base ingredient for common cut nouns, e.g., 'salmon fillets' -> 'salmon'
        const m = t.match(/^([a-z]+)\s+(fillet|fillets|steak|steaks|ribs|wings|thigh|thighs|breast|breasts|chops|shoulder|loin|brisket)$/);
        if (m) out.add(m[1]);
      }
    }
  }
  return out;
}

function extractWineTags(data) {
  const out = new Set();
  const wines = data.pairings && Array.isArray(data.pairings.wine) ? data.pairings.wine : [];
  for (const w of wines) {
    if (!w) continue;
    // Take text before dash/en-dash
    let head = String(w).split(/\s+[\-\u2013]\s+/)[0];
    head = norm(head);
    if (!head) continue;
    // Expand parentheses (keep base and inside)
    if (head.includes('(') && head.includes(')')) {
      const base = norm(head.replace(/\s*\(.*?\)\s*/g, ''));
      if (base) out.add(base);
      const parens = Array.from(head.matchAll(/\((.*?)\)/g)).map(m => norm(m[1]));
      for (const p of parens) if (p) out.add(p);
    } else {
      out.add(head);
    }
    const tokens = head.split(/\s+/);
    if (tokens.length >= 2 && tokens[0] === 'brut') {
      out.add(tokens.slice(1).join(' '));
    }
    if (tokens.includes('kabinett') && tokens.includes('riesling')) {
      out.add('riesling');
    }
    if (tokens.includes('blend') && tokens.length >= 2) {
      out.add(tokens[0]); // e.g., bordeaux blend -> bordeaux
    }
    if (/(champagne|cava|prosecco|sparkling)/.test(head)) {
      out.add('sparkling');
    }
  }
  return out;
}

function dedupePreserveOrder(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const k = norm(x);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

module.exports = {
  eleventyComputed: {
    tags: (data) => {
      if (!(data.site && data.site.features && data.site.features.tags)) {
        return [];
      }
      // Computed-only: ignore any explicit tags in front matter.
      const wine = Array.from(extractWineTags(data));
      const ing = Array.from(extractIngredientTags(data));
      // Combine, normalize, and dedupe. Multiword tags use spaces intentionally.
      const combined = dedupePreserveOrder([...wine, ...ing]);
      return combined;
    }
  }
};
