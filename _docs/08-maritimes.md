---
title: "Maritimes"
permalink: /docs/08-maritimes/
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
    provinceIds: ["10", "11", "12", "13"],
    provinceNames: ["Newfoundland and Labrabor", "Nova Scotia", "Prince Edward Island", "New Brunswick"]
  });
});
</script>