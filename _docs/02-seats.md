---
title: "Seat Projections"
permalink: /docs/02-seats/
layout: single
sidebar:
  nav: "docs"
toc: true
toc_label: "Contents"
---

Predictive Politics projects the likely winner of each of Canada's 343 federal electoral districts individually, rather than deriving seat counts from national vote share alone. This page explains how national poll numbers are translated into riding-level seat calls and win probabilities.

## From National Polls to Riding Estimates

The model uses a **national uniform swing** approach. Starting from each riding's historical baseline — calculated as the average of results across multiple past federal elections — the model applies a multiplicative adjustment based on how each party's current national poll average compares to its national baseline.

If a party is polling 10% higher (in relative terms) than its historical baseline, its vote share in every riding is scaled up by the same factor. This preserves the variation between safe and competitive ridings while reflecting shifts in national voter sentiment. See the [Methodology](/docs/10-methodology/) page for the full calculation.

## Win Probabilities

A single point estimate is rarely enough to call a riding with confidence. To account for polling uncertainty, the model runs **10,000 Monte Carlo simulations** for each riding. In each simulation, the national vote shares are sampled from a normal distribution around the point estimate, and the resulting riding-level outcome is recorded.

The **win probability** for a party in a given riding is the share of simulations in which that party placed first. A party with a 90% win probability won nine out of every ten simulated elections in that riding; a party at 52% is in genuinely competitive territory.

## The "Likely Outcome" Label

Each riding on the regional pages displays a "Likely Outcome" badge — the party with the highest mean vote share in the model's point estimate. This is the model's best single guess, but it should be read alongside the win probability and the uncertainty bars on the forecast chart.

Ridings where the leading party has a win probability below roughly 60% are effectively toss-ups and should be treated as such.

## Seat Count Totals

Aggregating the likely outcomes across all 343 ridings produces a projected seat count for each party. Because ridings are modelled independently, the total reflects the point-estimate winner in each riding rather than the probabilistic average. A more probabilistic seat total would sum each party's win probabilities across all ridings — this may be added as a feature in a future version of the model.

## Parties Modelled

The model projects vote shares and win probabilities for six parties:

| Party | Abbreviation |
|---|---|
| Liberal Party of Canada | LPC |
| Conservative Party of Canada | CPC |
| New Democratic Party | NDP |
| Bloc Québécois | BQ |
| Green Party of Canada | GPC |
| People's Party of Canada | PPC |