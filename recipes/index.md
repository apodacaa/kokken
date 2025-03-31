---
title: "All Recipes"
layout: layouts/home.njk
---

# Recipes

<ul>
  {% for recipe in collections.recipes %}
    <li>
      <a href="{{ recipe.url }}">{{ recipe.data.title }}</a>
    </li>
  {% endfor %}
</ul>
