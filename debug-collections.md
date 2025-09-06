---
layout: default
permalink: /debug/collections/
header_kind: home
---
<div class="extra-page">
  <h2>Estado de colecciones</h2>

  <h3>saneka ({{ site.saneka | size }})</h3>
  <ul>
    {% for d in site.saneka %}
      <li>{{ d.path }} → {{ d.url }}</li>
    {% endfor %}
  </ul>

  <h3>100novias ({{ site["100novias"] | size }})</h3>
  <ul>
    {% for d in site["100novias"] %}
      <li>{{ d.path }} → {{ d.url }}</li>
    {% endfor %}
  </ul>

  <h3>ririsa ({{ site.ririsa | size }})</h3>
  <ul>
    {% for d in site.ririsa %}
      <li>{{ d.path }} → {{ d.url }}</li>
    {% endfor %}
  </ul>

</div>
