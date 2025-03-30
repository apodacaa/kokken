module.exports = function (eleventyConfig) {
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
  
    // ✅ Create a collection of all recipes from /content/recipes/
    eleventyConfig.addCollection("recipes", function (collectionApi) {
      return collectionApi.getFilteredByGlob("content/recipes/*.md");
    });
  
    return {
      dir: {
        includes: "_includes",
        output: "_site"
      }
    };
  };
  