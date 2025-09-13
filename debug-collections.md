---
layout: default
permalink: /debug/collections/
header_kind: home
---

<div class="extra-page">
  <h2>Estado de colecciones</h2>

  <!-- Activos -->
  <h3>Activos</h3>
  {% assign activos = site.catalogo.items | where: "seccion", "activos" %}
  {% for m in activos %}
    <details>
      <summary>{{ m.title }} ({{ site[m.mangaId] | size }})</summary>
      {% if site[m.mangaId].size > 0 %}
        <ul>
          {% for d in site[m.mangaId] %}
            <li>{{ d.path }} → {{ d.url }}</li>
          {% endfor %}
        </ul>
      {% else %}
        <p style="color:red;"> No hay nada en esta colección.</p>
      {% endif %}
    </details>
  {% endfor %}

  <!-- Joints -->
  <h3>Joints</h3>
  {% assign joints = site.catalogo.items | where: "seccion", "joints" %}
  {% for m in joints %}
    <details>
      <summary>{{ m.title }} ({{ site[m.mangaId] | size }})</summary>
      {% if site[m.mangaId].size > 0 %}
        <ul>
          {% for d in site[m.mangaId] %}
            <li>{{ d.path }} → {{ d.url }}</li>
          {% endfor %}
        </ul>
      {% else %}
        <p style="color:red;"> No hay nada en esta colección.</p>
      {% endif %}
    </details>
  {% endfor %}

  <!-- Terminados -->
  <h3>Terminados</h3>
  {% assign terminados = site.catalogo.items | where: "seccion", "terminados" %}
  {% for m in terminados %}
    <details>
      <summary>{{ m.title }} ({{ site[m.mangaId] | size }})</summary>
      {% if site[m.mangaId].size > 0 %}
        <ul>
          {% for d in site[m.mangaId] %}
            <li>{{ d.path }} → {{ d.url }}</li>
          {% endfor %}
        </ul>
      {% else %}
        <p style="color:red;"> No hay nada en esta colección.</p>
      {% endif %}
    </details>
  {% endfor %}

</div>
