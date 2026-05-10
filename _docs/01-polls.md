---
title: "Opinion Polling"
permalink: /docs/01-polls/
layout: single
sidebar:
  nav: "docs"
toc: true
toc_label: "Contents"
---

Opinion polls are the primary data source for Predictive Politics. This page explains which polls are used, how they are selected, and how they are combined into a single national estimate.

## Poll Sources

The model draws on publicly released polls from major Canadian polling firms. These include Léger, Nanos Research, Abacus Data, Ipsos, Ekos, and others that publish national voting intention figures during the campaign period. Only polls that report federal vote intention for the major parties and disclose their sample size and fieldwork dates are included.

## The 21-Day Window

At any given forecast date, only polls with fieldwork completed within the **21 days prior** are included in the aggregation. Polls older than 21 days are excluded entirely.

This window is short enough to keep the aggregate responsive to genuine shifts in public opinion, while long enough to include a sufficient number of polls for statistical stability. During active campaign periods — when firms release polls frequently — the window typically contains between five and fifteen polls.

## Weighting

Not all polls in the window are treated equally. Each poll is assigned a weight based on two factors:

**Recency.** Polls are weighted using exponential decay based on the number of days since their fieldwork ended. A poll completed yesterday receives full weight; one completed 20 days ago receives substantially less. This ensures that the aggregate reflects the most current available data.

**Sample size.** Polls with larger samples are weighted more heavily than smaller ones, in proportion to the inverse of their variance. A poll of 2,000 respondents has a smaller margin of error than one of 500, and the weighting reflects this difference.

No house effect adjustments (corrections for systematic bias by individual firms) are applied in the current version of the model.

## Aggregation Output

The weighted average of all in-window polls produces a single national vote intention estimate for each party: the Liberal Party (LPC), Conservative Party (CPC), NDP, Bloc Québécois (BQ), Green Party (GPC), and People's Party of Canada (PPC).

This national aggregate, along with the effective sample size of the weighted pool, is then passed to the swing model to generate riding-level forecasts. See the [Methodology](/docs/10-methodology/) page for the full pipeline.