---
layout: caps
title: "Dream Jumbo Girl"
date: 2025-09-05
series: "dream-jumbo-girl"
portada: "/assets/img/dream-jumbo-cover.jpg"
sinopsis: "La historia sigue a un joven que se enamora de una chica alta y atlética, y se une al club de tenis para estar cerca de ella, a pesar de no tener experiencia previa."
autor: "Tatsuya Egawa"
artista: "Tatsuya Egawa"
generos: ["Comedia","Romance","Deportes"]
estado: "Finalizado"
anio: 2001
editorial: "Weekly Young Jump"
links_descarga:
  - { nombre: "Cap 1 (MEGA)", url: "#" }
  - { nombre: "Cap 1 (Drive)", url: "#" }
  - { nombre: "Pack 1–5 (MEGA)", url: "#" }
show_links_en_ficha: false
use_theme: true
---

Ver capítulos aquí:
<ul>
  {% assign caps = site['dream-jumbo-girl'] | sort: 'capitulo' %}
  {% for c in caps %}
    <li><a href="{{ site.baseurl }}{{ c.url }}">{{ c.title }}</a></li>
  {% endfor %}
</ul>
