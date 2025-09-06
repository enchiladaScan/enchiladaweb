---
layout: caps
title: "Oshi no Ko"
date: 2025-09-05
series: "oshi-no-ko"
portada: "/assets/img/oshi-no-ko-cover.jpg"
sinopsis: "La historia sigue a Aquamarine Hoshino, un ídolo joven y talentoso, y Gorou Honda, un médico que se reencuentra con su amada fan de manera inesperada tras su misteriosa muerte y reencarnación. Oshi no Ko explora el lado oscuro de la industria del entretenimiento y la lucha por los sueños en medio de secretos y tragedias."
autor: "Aka Akasaka"
artista: "Mengo Yokoyari"
generos: ["Seinen","Drama","Suspense"]
estado: "En publicación"
anio: 2020
editorial: "Shueisha"
links_descarga:
    { nombre: "Cap 1 (MEGA)", url: "#" }
    { nombre: "Cap 1 (Drive)", url: "#" }
show_links_en_ficha: false
use_theme: true
redirect_from:
  - /oshi-no-ko/
---

Ver capítulos aquí:
    <ul>
        {% assign caps = site.oshi_no_ko | where_exp:"c","c.capitulo" %} 
        {% if caps.size > 0 %}
            {% assign caps = caps | sort: 'capitulo' %}
            {% for c in caps %}
                <li><a href="{{ site.baseurl }}{{ c.url }}">{{ c.title }}</a></li>
            {% endfor %}
        {% else %}
            <li class="no-links">Aún no hay capítulos de este manga.</li>
        {% endif %}
    </ul>
