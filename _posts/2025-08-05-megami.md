---
layout: caps
title: "Megami no Cafe Terrace"
date: 2025-09-05
series: "megami-no-cafe-terrace"
portada: "/assets/img/megami-cover.jpg"
sinopsis: "Hayate, un estudiante de secundaria, se encuentra heredando una cafetería frente a la playa que está al borde de la quiebra. Para su sorpresa, descubre que la cafetería está habitada por cinco hermosas chicas que parecen ser las sirvientas de un dios."
autor: "Kouji Miura"
artista: "Kouji Miura"
generos: ["Comedia","Romance","Ecchi","Vida Escolar"]
estado: "En publicación"
anio: 2021
editorial: "Weekly Shonen Magazine"
links_descarga:
  - { nombre: "Cap 1 (MEGA)", url: "#" }
  - { nombre: "Cap 1 (Drive)", url: "#" }
  - { nombre: "Pack 1–5 (MEGA)", url: "#" }
show_links_en_ficha: false
use_theme: true
---

Ver capítulos aquí:
<ul>
  {% assign caps = site.megami %}
  {% if caps %}
    {% assign caps = caps | sort: 'capitulo' %}
    {% for c in caps %}
      <li><a href="{{ c.url | relative_url }}">{{ c.title }}</a></li>
    {% endfor %}
  {% else %}
    <li class="no-links">Aún no hay capítulos de este manga.</li>
  {% endif %}
</ul>
