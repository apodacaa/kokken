---
layout: layouts/tags.njk
pagination:
  data: collections.tagList
  size: 1
  alias: tag
permalink: "tags/{{ tag | slug }}/"
eleventyComputed:
  title: "Tag: {{ tag }}"
---
