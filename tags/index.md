---
title: "All Tags"
layout: layouts/home.njk
---

# Tags

<ul>
  {% for tag in collections.tagList %}
    <li><a href="/tags/{{ tag | slug }}/">{{ tag }}</a></li>
  {% endfor %}
</ul>
