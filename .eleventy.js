module.exports = function (eleventyConfig) {
  // ✅ Passthrough static assets
  eleventyConfig.addPassthroughCopy("assets");

  // ✅ Create a collection of all unique tags (guarded by feature flag)
  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const enabled = collectionApi.getAll().some(i => i.data && i.data.site && i.data.site.features && i.data.site.features.tags);
    if (!enabled) return [];
    let tagSet = new Set();
    collectionApi.getAll().forEach(item => {
      const tags = item.data && Array.isArray(item.data.tags) ? item.data.tags : [];
      const layout = item.data && item.data.layout;
      if (layout === 'layouts/recipe.njk' || layout === 'layouts/cocktail.njk') {
        tags
          .filter(tag => tag !== "all" && tag !== "recipes")
          .forEach(tag => tagSet.add(tag));
      }
    });
    return [...tagSet].sort();
  });

  // ✅ Build a map of tag -> items using computed tags (guarded)
  eleventyConfig.addCollection("tagsMap", function (collectionApi) {
    const enabled = collectionApi.getAll().some(i => i.data && i.data.site && i.data.site.features && i.data.site.features.tags);
    if (!enabled) return {};
    /** @type {Record<string, any[]>} */
    const map = {};
    collectionApi.getAll().forEach(item => {
      const layout = item.data && item.data.layout;
      if (!(layout === 'layouts/recipe.njk' || layout === 'layouts/cocktail.njk')) return;
      const tags = item.data && Array.isArray(item.data.tags) ? item.data.tags : [];
      tags
        .filter(tag => tag !== "all" && tag !== "recipes")
        .forEach(tag => {
          if (!map[tag]) map[tag] = [];
          map[tag].push(item);
        });
    });
    return map;
  });

  // ✅ Tag counts (sorted by count desc, then alpha) — guarded
  eleventyConfig.addCollection("tagsWithCounts", function (collectionApi) {
    const enabled = collectionApi.getAll().some(i => i.data && i.data.site && i.data.site.features && i.data.site.features.tags);
    if (!enabled) return [];
    const map = {};
    collectionApi.getAll().forEach(item => {
      const layout = item.data && item.data.layout;
      if (!(layout === 'layouts/recipe.njk' || layout === 'layouts/cocktail.njk')) return;
      const tags = item.data && Array.isArray(item.data.tags) ? item.data.tags : [];
      tags
        .filter(tag => tag !== "all" && tag !== "recipes")
        .forEach(tag => { map[tag] = (map[tag] || 0) + 1; });
    });
    return Object.entries(map)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag));
  });

  // ✅ Recipes collection (sorted alphabetically by title)
  eleventyConfig.addCollection("recipes", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/recipes/*.md")
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
  });

  // ✅ Smoke Guides collection (sorted alphabetically by title)
  eleventyConfig.addCollection("smokeGuides", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/smoke/*.md")
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
  });

  // ✅ Grill Guides collection (sorted alphabetically by title)
  eleventyConfig.addCollection("grillGuides", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/grill/*.md")
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
  });

  // (search) No external env needed; client loads a static JSON index.

   // ✅ Cocktails collection (sorted alphabetically by title)
   eleventyConfig.addCollection("cocktails", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/cocktails/*.md")
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
  });

  // ✅ Generic array sort filter by item.data.title for templates
  eleventyConfig.addFilter("byTitle", function(arr) {
    if (!Array.isArray(arr)) return arr;
    return arr.slice().sort((a, b) => (a.data && a.data.title ? a.data.title : "").localeCompare(b.data && b.data.title ? b.data.title : ""));
  });

  // ✅ Nunjucks JSON stringify filter for JSON outputs
  eleventyConfig.addNunjucksFilter("json", function (value) {
    try { return JSON.stringify(value); } catch (e) { return 'null'; }
  });

  // ✅ Only one return — move to bottom
  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
