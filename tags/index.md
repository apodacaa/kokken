---
title: "All Tags"
layout: layouts/tags-index.njk
---

# Tags

<ul>
  {% for tag in collections.tagList %}
    <li><a href="/tags/{{ tag | slug }}/">{{ tag }}</a></li>
  {% endfor %}
</ul>
