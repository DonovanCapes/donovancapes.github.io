---
title: "British Columbia"
permalink: /docs/03-british-columbia/
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
    provinceIds: ['59'],
    provinceNames: ['British Columbia']
  });
});
</script>