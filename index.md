---
title: "Køkken"
layout: layouts/home.njk
---

# Køkken

## Recipes

<ul>
  {% for recipe in collections.recipes %}
    <li>
      <a href="{{ recipe.url }}">{{ recipe.data.title }}</a>
    </li>
  {% endfor %}
</ul>

## Tags

<ul>
  {% for tag in collections.tagList %}
    <li><a href="/tags/{{ tag | slug }}/">{{ tag }}</a></li>
  {% endfor %}
</ul>