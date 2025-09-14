module.exports = function (eleventyConfig) {
  // ✅ Passthrough static assets
  eleventyConfig.addPassthroughCopy("assets");

  // ✅ Create a collection of all unique tags
  eleventyConfig.addCollection("tagList", function (collectionApi) {
    let tagSet = new Set();

    collectionApi.getAll().forEach(item => {
      let tags = item.data.tags;

      if (Array.isArray(tags)) {
        tags
          .filter(tag => tag !== "all" && tag !== "recipes")
          .forEach(tag => tagSet.add(tag));
      }
    });

    return [...tagSet].sort();
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
