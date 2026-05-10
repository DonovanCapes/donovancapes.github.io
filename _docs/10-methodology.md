---
title: "Methodology"
permalink: /docs/10-methodology/
layout: single
sidebar:
  nav: "docs"
toc: true
toc_label: "Contents"
---

Predictive Politics uses a national uniform swing model combined with Monte Carlo simulation to produce riding-level vote share estimates and win probabilities for all 343 federal electoral districts. This page describes each step of the pipeline from raw polling data to the forecasts shown on the site.

## Step 1 — Poll Aggregation

The model begins by collecting recent public opinion polls from major Canadian polling firms, including Léger, Nanos, and others. Only polls published within the **21-day window** ending on the forecast date are included, ensuring the aggregate reflects current voter sentiment rather than stale snapshots.

Polls are weighted using two factors:

- **Recency** — newer polls receive higher weight using exponential decay, so a poll published yesterday counts more than one published two weeks ago.
- **Sample size** — larger samples are weighted more heavily, reflecting their lower margin of error.

The weighted average across all polls in the window produces a single national vote share estimate for each party.

## Step 2 — Establishing the Baseline

To translate national vote shares into riding-level estimates, the model needs a baseline — the expected result in each riding in a neutral, no-swing scenario. Predictive Politics uses the **average of results from multiple past federal elections** as this baseline, smoothing out anomalies from any single election and providing a stable starting point.

## Step 3 — Applying National Swing

Once the baseline and current national aggregate are established, the model calculates a **multiplicative swing** for each party. Rather than adding a fixed number of points to every riding (additive swing), the multiplicative approach scales each party's baseline riding result by the ratio of its current national share to its baseline national share.

For example: if the Liberal Party's current aggregated national share is 15% higher (in relative terms) than its baseline national share, every riding's Liberal baseline result is scaled up by 15%. This preserves the relative variation across ridings and avoids producing implausible results in very safe or very weak ridings.

The output of this step is a **point estimate** of vote share for every party in every one of the 343 ridings.

## Step 4 — Uncertainty Quantification

Point estimates alone do not capture the inherent uncertainty in polling-based forecasts. Predictive Politics quantifies uncertainty using the **combined margin of error** of the polls in the aggregation window. The margin of error is derived from the effective sample size of the weighted poll average, following standard survey statistics.

This produces a standard deviation for each party's national vote share, which is then propagated to the riding level alongside the swing calculation.

## Step 5 — Monte Carlo Simulation

To convert point estimates and standard deviations into win probabilities, the model runs **10,000 simulations** for each riding. In each simulation, national vote shares are drawn from a normal distribution centred on the point estimate with the calculated standard deviation. The multiplicative swing is re-applied using the simulated national share, and the winning party in that simulation is recorded.

After 10,000 runs, the **win probability** for each party in each riding is simply the fraction of simulations in which that party received the most votes. These probabilities power the interactive map shown on the home page.

## Model Outputs

The model produces two types of output for each riding:

- **Vote share estimate** — the point estimate and standard deviation (±1 std dev) for each party, displayed as the horizontal bar charts on the regional pages.
- **Win probability** — the share of Monte Carlo simulations won by each party, used to colour ridings on the choropleth map and determine the "Likely Outcome" label.

The party with the highest mean vote share is designated the likely winner of a riding. The coloured bars on the map reflect the winning party's colour; ridings with very close simulations will show correspondingly close win probabilities.

## Limitations

Like all models, Predictive Politics makes simplifying assumptions. National uniform swing does not account for local candidate effects, incumbency advantage, or regional trends that differ from the national picture. The uncertainty estimates are based solely on polling margin of error and do not incorporate systematic polling error (the possibility that all polls are wrong in the same direction). Historical polling errors in Canada suggest that actual outcomes can fall outside the modelled uncertainty bands, particularly for parties with smaller poll samples.