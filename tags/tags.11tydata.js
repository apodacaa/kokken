function slugify(s) {
  return String(s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      const enabled = data.site && data.site.features && data.site.features.tags;
      if (!enabled) return false;
      return `tags/${slugify(data.tag)}/`;
    }
  }
};

