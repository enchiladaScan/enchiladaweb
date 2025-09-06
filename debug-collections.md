---
layout: default
permalink: /debug/collections/
header_kind: home
---

<div class="extra-page">
  <h2>Estado de colecciones</h2>

  {% assign all = site.collections | where_exp: "c", "c.label != 'posts'" %}
  {% for coll in all %}
    <h3>{{ coll.label }} ({{ site[coll.label] | size }})</h3>
    {% if site[coll.label].size > 0 %}
      <ul>
        {% for d in site[coll.label] %}
          <li>{{ d.path }} → {{ d.url }}</li>
        {% endfor %}
      </ul>
    {% else %}
      <p style="color: red;">⚠ No hay documentos en esta colección.</p>
    {% endif %}
  {% endfor %}
</div>
