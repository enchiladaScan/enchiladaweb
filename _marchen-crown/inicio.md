---
layout: caps
title: "Marchen Crown"
date: 2025-09-05
series: "marchen-crown"
portada: "/assets/img/marchen-crown-cover.jpg"
sinopsis: "En un mundo donde los cuentos de hadas se hacen realidad de formas inesperadas, un joven se ve envuelto en una lucha por proteger su mundo de las distorsiones de estas historias."
autor: "Yukiya Murasaki"
artista: "Yukiya Murasaki"
generos: ["Fantasía","Acción","Aventura","Drama"]
estado: "Finalizado"
anio: 2014
editorial: "Dragon Age Pure"
links_descarga:
  - { nombre: "Cap 1 (MEGA)", url: "#" }
  - { nombre: "Cap 1 (Drive)", url: "#" }
  - { nombre: "Pack 1–5 (MEGA)", url: "#" }
show_links_en_ficha: false
use_theme: true
---

Ver capítulos aquí:
    <ul>
    {% assign caps = site.marchen-crown %}
    {% if caps %}
        {% assign caps = caps | sort: 'capitulo' %}
        {% for c in caps %}
        <li><a href="{{ site.baseurl }}{{ c.url }}">{{ c.title }}</a></li>
        {% endfor %}
    {% else %}
        <li class="no-links">Aún no hay capítulos de este manga.</li>
    {% endif %}
    </ul>