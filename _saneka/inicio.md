---
layout: caps
title: "Mi matrimonio con Saneka"
date: 2025-08-05
series: "saneka"
portada: "/assets/img/saneka-cover.jpg"
sinopsis: "Shin se muda a un pueblo donde termina viviendo con Saneka por un arreglo inesperado. Entre malentendidos y momentos tiernos, su relación se va transformando en algo real."
autor: "Wataru Hyakusai"
artista: "Kei Ueda"
generos: ["Comedia","Slice of life","Romance"]
estado: "En publicación"
anio: 2023
editorial: "Jump Comics+"
links_descarga:
  - { nombre: "Cap 1 (MEGA)",  url: "#" }
  - { nombre: "Cap 1 (Drive)", url: "#" }
  - { nombre: "Pack 1–5 (MEGA)", url: "#" }
show_links_en_ficha: false
use_theme: true
redirect_from:
  - /saneka/
---

Ver capítulos aquí:
  <ul>
  {% assign caps = site.saneka | where_exp:"c","c.capitulo" %}
  {% if caps.size > 0 %}
      {% assign caps = caps | sort: 'capitulo' %}
      {% for c in caps %}
          <li><a href="{{ site.baseurl }}{{ c.url }}">{{ c.title }}</a></li>
      {% endfor %}
  {% else %}
      <li class="no-links">Aún no hay capítulos de este manga.</li>
  {% endif %}
  </ul>
