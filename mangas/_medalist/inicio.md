---
layout: caps
title: "Medalist"
date: 2025-09-05
series: "medalist"
portada: "/assets/img/medalist-cover.jpg"
sinopsis: "Tsukasa, un joven con talento para el boxeo, se ve obligado a abandonar su sueño debido a la falta de recursos. Conoce a un entrenador que ve su potencial y juntos se embarcan en un arduo camino hacia la cima."
autor: "Tsurugi Kaga"
artista: "Tsurugi Kaga"
generos: ["Drama","Deportes","Psicológico"]
estado: "En publicación"
anio: 2020
editorial: "Monthly Shonen Sunday"
links_descarga:
  - { nombre: "Cap 1 (MEGA)", url: "#" }
  - { nombre: "Cap 1 (Drive)", url: "#" }
  - { nombre: "Pack 1–5 (MEGA)", url: "#" }
show_links_en_ficha: false
use_theme: true
---

Ver capítulos aquí:
    <ul>
    {% assign caps = site.medalist %}
    {% if caps %}
        {% assign caps = caps | sort: 'capitulo' %}
        {% for c in caps %}
        <li><a href="{{ site.baseurl }}{{ c.url }}">{{ c.title }}</a></li>
        {% endfor %}
    {% else %}
        <li class="no-links">Aún no hay capítulos de este manga.</li>
    {% endif %}
    </ul>