---
title: "Data Test"
permalink: /docs/data-test/
excerpt: "Testing data loading"
---

<h2>Data Testing</h2>

<p>Total districts: {{ site.data.seat_data | size }}</p>

<h3>First 10 districts:</h3>
<ul>
{% for row in site.data.seat_data limit:10 %}
  <li>District ID: {{ row.districtid }}</li>
{% endfor %}
</ul>