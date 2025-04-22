---
title: "Maritimes"
permalink: /docs/08-maritimes/
layout: single
province_code: ["10", "11", "12", "13"]
sidebar:
  nav: "docs"
---

## Districts

{% assign province_districts = "" | split: "" %}
{% for row in site.data.seat_data %}
  {% assign district_province = row.districtid | slice: 0, 2 %}
  {% if district_province == "10" or district_province == "11" or district_province == "12" or district_province == "13" %}
    {% assign province_districts = province_districts | push: row %}
  {% endif %}
{% endfor %}

<div class="table-responsive">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>District ID</th>
        <th>Province</th>
        <th>Forecast</th>
      </tr>
    </thead>
    <tbody>
    {% for district in province_districts %}
      <tr>
        <td>{{ district.districtid }}</td>
        <td>
          {% assign province_code = district.districtid | slice: 0, 2 %}
          {% case province_code %}
            {% when "10" %}
              Newfoundland and Labrador
            {% when "11" %}
              Prince Edward Island
            {% when "12" %}
              Nova Scotia
            {% when "13" %}
              New Brunswick
            {% else %}
              Unknown ({{ province_code }})
          {% endcase %}
        </td>
        <td>
          <table class="table table-sm mb-0">
            <tbody>
            {% assign parties = "" | split: "" %}
            
            {% if district.bq != blank and district.bq != "0" %}
              {% assign bq_value = district.bq | times: 1.0 %}
              {% assign bqstd_value = district.bqstd | times: 1.0 %}
              {% assign party_data = "" | split: "" %}
              {% assign party_data = party_data | push: bq_value | push: bqstd_value | push: "BQ" %}
              {% assign parties = parties | push: party_data %}
            {% endif %}
            
            {% if district.cpc != blank and district.cpc != "0" %}
              {% assign cpc_value = district.cpc | times: 1.0 %}
              {% assign cpcstd_value = district.cpcstd | times: 1.0 %}
              {% assign party_data = "" | split: "" %}
              {% assign party_data = party_data | push: cpc_value | push: cpcstd_value | push: "CPC" %}
              {% assign parties = parties | push: party_data %}
            {% endif %}
            
            {% if district.gpc != blank and district.gpc != "0" %}
              {% assign gpc_value = district.gpc | times: 1.0 %}
              {% assign gpcstd_value = district.gpcstd | times: 1.0 %}
              {% assign party_data = "" | split: "" %}
              {% assign party_data = party_data | push: gpc_value | push: gpcstd_value | push: "GPC" %}
              {% assign parties = parties | push: party_data %}
            {% endif %}
            
            {% if district.lpc != blank and district.lpc != "0" %}
              {% assign lpc_value = district.lpc | times: 1.0 %}
              {% assign lpcstd_value = district.lpcstd | times: 1.0 %}
              {% assign party_data = "" | split: "" %}
              {% assign party_data = party_data | push: lpc_value | push: lpcstd_value | push: "LPC" %}
              {% assign parties = parties | push: party_data %}
            {% endif %}
            
            {% if district.ndp != blank and district.ndp != "0" %}
              {% assign ndp_value = district.ndp | times: 1.0 %}
              {% assign ndpstd_value = district.ndpstd | times: 1.0 %}
              {% assign party_data = "" | split: "" %}
              {% assign party_data = party_data | push: ndp_value | push: ndpstd_value | push: "NDP" %}
              {% assign parties = parties | push: party_data %}
            {% endif %}
            
            {% if district.ppc != blank and district.ppc != "0" %}
              {% assign ppc_value = district.ppc | times: 1.0 %}
              {% assign ppcstd_value = district.ppcstd | times: 1.0 %}
              {% assign party_data = "" | split: "" %}
              {% assign party_data = party_data | push: ppc_value | push: ppcstd_value | push: "PPC" %}
              {% assign parties = parties | push: party_data %}
            {% endif %}
            
            {% assign parties_by_value = parties | sort %}
            {% assign sorted_parties = "" | split: "" %}
            {% for party in parties_by_value reversed %}
              {% assign sorted_parties = sorted_parties | push: party %}
            {% endfor %}
            
            {% for party in sorted_parties %}
              <tr>
                <td><strong class="party-{{ party[2] }}">{{ party[2] }}</strong></td>
                <td>{{ party[0] | round: 1 }}% <small>±{{ party[1] | round: 1 }}%</small></td>
              </tr>
            {% endfor %}
            </tbody>
          </table>
        </td>
      </tr>
    {% endfor %}
    </tbody>
  </table>
</div>