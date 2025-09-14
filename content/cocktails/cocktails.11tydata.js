// Auto-compute cocktail tags from ingredients and title.
// - Extract base spirits and key mixers from ingredients list.
// - Normalize to lowercase ASCII; keep spaces in multiword tags.

function removeDiacritics(str) {
  return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

function norm(s) {
  return removeDiacritics(String(s || '')).toLowerCase().trim().replace(/\s+/g, ' ');
}

const STOPWORDS = new Set([
  'oz','cl','ml','dash','dashes','barspoon','tsp','tbsp','cup','cups','top','to','with','and','or','of','a','an',
  'fresh','juice','peel','twist','slice','wheel','simple','syrup','rich','leave','top','to','taste'
]);

const PRUNE = new Set(['ice','water','soda','soda water','club','club soda']);

function tokenize(segment) {
  const words = segment.split(/[^a-zA-Z]+/).filter(Boolean).map(w => w.toLowerCase());
  return words.filter(w => !STOPWORDS.has(w));
}

function extractFromIngredients(ings) {
  const out = new Set();
  for (const line of ings) {
    const base = norm(line).replace(/\([^)]*\)/g, '');
    // split comma-separated trailing descriptors
    const parts = base.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      // keep first 2-3 tokens
      const toks = tokenize(part);
      if (!toks.length) continue;
      // common cocktail patterns: "rye whiskey" -> add "rye whiskey" and "whiskey"
      const phrase = toks.slice(0, 3).join(' ');
      if (!PRUNE.has(phrase)) out.add(phrase);
      if (toks.length >= 2 && toks[toks.length - 1] === 'whiskey') out.add('whiskey');
      if (toks.length >= 2 && toks[toks.length - 1] === 'rum') out.add('rum');
      if (toks.includes('gin')) out.add('gin');
      if (toks.includes('vermouth')) out.add('vermouth');
      if (toks.includes('bitters')) out.add('bitters');
      if (toks.includes('tequila')) out.add('tequila');
      if (toks.includes('mezcal')) out.add('mezcal');
      if (toks.includes('brandy')) out.add('brandy');
      if (toks.includes('cognac')) out.add('cognac');
    }
  }
  return out;
}

module.exports = {
  eleventyComputed: {
    tags: (data) => {
      if (!(data.site && data.site.features && data.site.features.tags)) {
        return [];
      }
      const ings = Array.isArray(data.ingredients) ? data.ingredients : [];
      const tags = Array.from(extractFromIngredients(ings));
      // Dedupe + normalize again just in case
      const seen = new Set();
      const out = [];
      for (const t of tags) { const k = norm(t); if (!k || seen.has(k)) continue; seen.add(k); out.push(k); }
      return out;
    }
  }
};
