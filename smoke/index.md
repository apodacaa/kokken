---
title: "All Recipes"
layout: layouts/home.njk
---

# Smoke Guides

<ul>
  {% for smoke in collections.smoke %}
    <li>
      <a href="{{ smoke.url }}">{{ smoke.data.title }}</a>
    </li>
  {% endfor %}
</ul>
