---
layout: caps
title: "Kanojo, Okarishimasu (Kanokari)"
date: 2025-09-03
series: "kanokari"
portada: "/assets/img/kanokari-cover.jpg"
sinopsis: "Kazuya Kinoshita es un universitario que, tras una ruptura, recurre a un servicio de novias de alquiler. Lo que parecía algo pasajero se complica cuando descubre que su cita, Mizuhara Chizuru, también va a su universidad y es su vecina."
autor: "Reiji Miyajima"
artista: "Reiji Miyajima"
generos: ["Comedia","Romance","Escolar"]
estado: "En publicación"
anio: 2017
editorial: "Kodansha"

links_extras:
  # - { nombre: "Extra 1 – Ilustraciones", url: "/kanokari/extras/extra-1" }

links_descarga:
  # - { nombre: "Cap 1 (MEGA)",  url: "#" }
  # - { nombre: "Cap 1 (Drive)", url: "#" }

show_links_en_ficha: false
use_theme: true
---

Ver capítulos aquí:
<ul>
  {% assign caps = site.kanokari %}
  {% if caps %}
    {% assign caps = caps | sort: 'capitulo' %}
    {% for c in caps %}
      <li><a href="{{ site.baseurl }}{{ c.url }}">{{ c.title }}</a></li>
    {% endfor %}
  {% else %}
    <li class="no-links">Aún no hay capítulos de Kanokari.</li>
  {% endif %}
</ul>
