---
layout: layouts/tags.njk
pagination:
  data: collections.tagList
  size: 1
  alias: tag
eleventyComputed:
  title: "Tag: {{ tag }}"
  permalink: "{% if site.features.tags %}tags/{{ tag | slug }}/{% else %}false{% endif %}"
---
