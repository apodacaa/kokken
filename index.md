---
title: "Køkken"
layout: layouts/home.njk
---

## Recipes

<ul>
  {% for recipe in collections.recipes %}
    <li>
      <a href="{{ recipe.url }}">{{ recipe.data.title }}</a>
    </li>
  {% endfor %}
</ul>

## Smoke Guides

<ul>
  {% for post in collections.smoke %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a>
    </li>
  {% endfor %}
</ul>

## Tags

<ul>
  {% for tag in collections.tagList %}
    <li><a href="/tags/{{ tag | slug }}/">{{ tag }}</a></li>
  {% endfor %}
</ul>