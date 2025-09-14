module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      const enabled = data.site && data.site.features && data.site.features.tags;
      return enabled ? '/tags/' : false;
    }
  }
};

