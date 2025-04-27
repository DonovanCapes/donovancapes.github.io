---
title: "Pairies"
permalink: /docs/05-prairies/
layout: single
classes: wide
sidebar:
  nav: "docs"
---

<div id="election-forecast"></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the forecast with custom settings if needed
  ElectionForecast.init({
    maxTableWidth: 1200, 
    districtColumnWidth: 18,
    outcomeColumnWidth: 15,
    forecastColumnWidth: 67
  })
  // Load specific province data
  .loadProvinces({
    csvPath: '/assets/data/ridingvotepercents.csv',
    containerId: 'election-forecast',
    provinceIds: ['46','47'],
    provinceNames: ['Manitoba', 'Saskatchewan']
  });
});
</script>