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

  // ✅ Recipes collection
  eleventyConfig.addCollection("recipes", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/recipes/*.md");
  });

  // ✅ Smoke collection
  eleventyConfig.addCollection("smoke", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/smoke/*.md");
  });

   // ✅ Cocktails collection
   eleventyConfig.addCollection("cocktails", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/cocktails/*.md");
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
