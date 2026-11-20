# Data-Viz Depth — Statistical Honesty & Chart-Design Craft

Synthesized from:
- **Datawrapper Academy + Blog** (Lisa Charlotte Muth, Gregor Aisch) — chart-type guide directory, log scales, color scales, colorblindness, approval-ratings fix-my-chart, pro tips.
- **Alberto Cairo** — *The Truthful Art* (2016). Book not present in `/books/`. This file encodes the framework from secondary coverage; full book-level extraction deferred.

Layer sits **below** Tufte (principles) and **above** Carbon/Apple/Material (system-specific visual rules). Read after `tufte-principles.md`; apply alongside `carbon-data-viz.md`.

---

## 1. Cairo's five qualities of a visualization (framework)

Cairo's central claim (*Truthful Art*): a good chart is judged on five dimensions simultaneously. A chart can be beautiful and lie; it can be true and fail to communicate. All five must pass.

| Quality | Question | Fail mode |
|---|---|---|
| **Truthful** | Does it represent the data honestly and in context? | Axis tricks, cherry-picking, missing denominators |
| **Functional** | Does its form suit the task (lookup, comparison, trend)? | Pie for 12 slices, 3D for quantity |
| **Beautiful** | Is it visually pleasing without decoration distorting meaning? | Chartjunk, low-contrast, cluttered |
| **Insightful** | Does it reveal something the reader couldn't see in a table? | Obvious restatement of a small table |
| **Enlightening** | Does it change how the reader thinks about the subject? | Trivial, inconsequential, expected |

**Order of priority when they conflict:** truthful > functional > insightful > enlightening > beautiful. Beauty that compromises truth is not a trade-off — it's a failure.

**Statistical-honesty stance (Cairo, consistent with Datawrapper practice):**
- **Show distribution, not just the mean.** Averages hide variance; outliers matter.
- **Show uncertainty.** Every estimate has a range. Error bars, confidence intervals, dot-plots of samples — not a single authoritative bar.
- **Compare fairly.** Same scale, same baseline, same period. If comparison isn't apples-to-apples, say so.
- **Denominators matter more than numerators.** "Cases up 50 %" is meaningless without base-rate, testing rate, population.
- **Beware confirmation bias.** The chart that confirms what you expected is the one that needs the hardest skepticism.

---

## 2. Datawrapper's chart-honesty layer

Datawrapper's Academy ships 20+ categories of chart-building guidance. Extracted principles that cross-cut the specific chart types:

### 2.1 Picking the chart (Academy category index)

Datawrapper organizes by chart family: Bar · Column · Line/Area · Pie/Donut · Scatter · Dot · Tables · Choropleth · Symbol · Locator · Example Visualizations. Decision flow that emerges from their content:

1. **What question does the chart answer?** Trend, comparison, ranking, part-to-whole, correlation, distribution, location.
2. **How many data points?** < 5 → often a table or dot plot beats a chart. 5–20 → bar/column/dot. 20–100 → line/scatter/small-multiples. 100+ → distribution chart, heat map, or aggregation.
3. **One series or many?** Single series → any. 2–4 series → bar / line / dot. 5–8 → line + direct labels, or small multiples. > 8 → almost always small multiples.
4. **Continuous or categorical axis?** Line/area for continuous. Bar for categorical.
5. **Precise or approximate reading?** Precise → table or bar with data labels. Approximate → line, area, heat map.

### 2.2 Pro-tips (Academy collection)

- **Annotation "offset" for responsiveness** — labels survive different widths. Without it, chart breaks on mobile.
- **Split data columns to style periods differently** — e.g., actuals vs forecast with two columns, distinct styling per.
- **Reuse chart types creatively** — slope from line, population pyramid from split bars, dot plot from scatter.
- **HTML in everywhere** — titles, tooltips, annotations, notes accept `<br>`, `<b>`, `<em>`. Use for clarity, not decoration.
- **Live data via Google Sheets / API** — chart stays accurate without manual re-entry. Removes the "chart decayed" failure mode.

---

## 3. Log scales (Datawrapper — "How to Read a Log Scale")

### When to use

- **Relative (%) change matters more than absolute difference.** A business growing 2× per year shows the same step every year on a log scale.
- **Values span many orders of magnitude** (pandemic case counts, population, income distribution).
- **Early-stage + late-stage trends both matter.** Linear charts hide early doubling when late values dominate the axis.

### When NOT to use

- **Audience is non-technical and the article isn't about rate of change.** Most readers read log as linear → lie.
- **Values close in magnitude.** Linear reads better.
- **Negative values present.** Log is undefined at 0.

### Honesty rules

- **Label "log scale" directly on the axis.** Never hide it.
- **Annotate the interpretation** — "Each gridline = 10×". Leaving reader to infer is an honesty failure.
- **Pair with a linear version in the same article** when audience is mixed. Show both; let reader pick.
- **Tick at familiar magnitudes** — 1, 10, 100, 1k, 10k — not at odd powers.

### Worked example (Datawrapper's NZ-tourism piece)

Visitors fell from 1,310 → 40 during WW2 (33× decline), recovered over a decade, then grew 33× again by 1984. On a linear chart, the WW2 drop disappears against the 1984 numbers. On log, both 33× moves take **the same vertical distance** — the reader sees that WW2 tourism collapse and post-war growth were comparable events relative to their starting points.

---

## 4. Color scales for data (Datawrapper)

### 4.1 Three scale types

| Type | Data type | Example | Encoding |
|---|---|---|---|
| **Categorical (qualitative)** | Unordered categories | Countries, industries, parties | Distinct hues, equal lightness |
| **Sequential** | Ordered numeric, one direction | Income, temperature, age | Light → dark, one or two hues |
| **Diverging** | Ordered numeric with meaningful midpoint | Swing, surplus/deficit, agree/disagree | Hue A dark ← pale mid → Hue B dark |

### 4.2 Non-negotiables

- **Get it right in black and white.** Lightness variation must carry the information. Color is a supplement.
- **Sequential + two hues beats single-hue ramp** for perceptual distinctness of mid-values. Light yellow → dark blue reads segments more clearly than pale blue → dark blue.
- **Interpolation choice matters.** Same endpoints, different interpolation space (RGB vs LAB vs OKLCH) produces visibly different middle colors. Prefer perceptually uniform spaces.
- **Classed vs unclassed (continuous) gradients** — classed is easier to legend but loses precision; unclassed is precise but needs a scale bar. Choose per audience.
- **De-emphasize "no data" / "other"** with grey or hatching — never with a competing hue.

### 4.3 Colorblindness (Datawrapper — Part 2)

- **Blue is the safest hue** — retained across protanopia, deuteranopia, tritanopia.
- **Blue + orange** and **blue + red** are the most accessible categorical pairs.
- **Limit to 3–4 hues** in categorical palettes. More causes confusion even for full-color-vision readers.
- **Vary lightness across hues** so the palette still encodes in greyscale.
- **Add non-color cues:** symbols (checkmark, cross), shapes (circle, triangle, square), patterns (hatching, dots), line styles (solid, dashed, dotted).
- **Test with simulators** — Coblis, Color Oracle, browser extensions. Simulators approximate; for high-stakes charts, involve colorblind readers.
- **Direct-label on the chart** — eliminates the "color legend forces cross-reference" failure mode.

Compatible with Carbon's alert palette + categorical 14-color sequence when Datawrapper's rule of 3–4 is applied as a cap.

---

## 5. Misleading charts — recurring failure modes

Consolidated from Datawrapper blog references + Cairo's truth framework + Tufte's Lie Factor. These are the patterns to catch in review.

### 5.1 Axis manipulation

| Failure | What happens | Fix |
|---|---|---|
| **Truncated Y on bar/area** | 2 % difference looks like 200 %. Classic political-chart trick. | Zero baseline on bars, areas, stacked. If range really is tight, use dot plot or line |
| **Inflated Y on line chart** | "No trend" illusion by zooming out | Crop to interesting range; annotate the range explicitly |
| **Missing Y label / units** | Reader assumes count, actual is rate (or vice versa) | Label axis: "Cases per 100k", "% of respondents", "USD billions" |
| **Inverted Y without annotation** | Good values look bad (or vice versa) | Never invert silently. Add "Lower is better" if inversion is intentional |
| **Dual Y-axes with misaligned zeros** | Fake correlation | Prefer two stacked charts, or normalize to index (base 100) |
| **Log scale presented as linear** | Order-of-magnitude differences hidden | Always label "log scale" on axis + annotate |

### 5.2 Time / range cherry-picking

- **Cherry-picked start date** — begin the series at the convenient local minimum. Fix: show the long-run series; if cropping, justify it in caption.
- **Cherry-picked end date** — stop at the last datapoint that fits the narrative. Fix: show up to the latest available; call out revisions.
- **Inconsistent intervals** — weekly for part of the series, monthly for another. Fix: consistent interval, resample if necessary.
- **Ignoring seasonality** — "Cases up 40 % since spring!" when every summer shows the same rise. Fix: year-over-year comparison, or rolling 12-month, or seasonally-adjusted.

### 5.3 Wrong chart for the data

- Pie chart > 5 slices → stacked bar / treemap.
- Multiple pies across time → small multiples of stacked bar.
- 3D anything. Volume never carries data.
- Line chart with categorical X-axis (no ordering) → should be bar.
- Bar chart with continuous X-axis (e.g. age) → should be histogram or line.
- Dual-axis anything where the purpose could be met by two sibling charts.

### 5.4 Proportion / denominator failures

- **Raw counts instead of rates** when population differs across groups. "California has more COVID cases than Wyoming" — always true by population.
- **Totals instead of per-capita** in international comparisons.
- **Missing base rate** — "Deaths up 30 %" without the death rate per 100k or prior year.
- **Absolute dollars across countries without PPP / inflation adjustment.**

### 5.5 Map-specific failures

- **Choropleth with raw count** — big states look dominant regardless of density. Map population-adjusted rates, or use cartograms.
- **Projection choice bias** — Mercator inflates high-latitude area. For global comparisons, equal-area projection (Equal Earth, Robinson).
- **Arbitrary class breaks** — changing 5 quintiles to 5 equal intervals changes which county looks red. Disclose classification method.
- **Too few classes** — 3 bins obscures variation. Too many — reader can't distinguish shades. 5–7 is the working range.
- **Color scale doesn't include zero / midpoint correctly** on diverging maps.

### 5.6 Aggregation failures

- **Simpson's paradox** — aggregate trend opposite of subgroup trends. Show both aggregate and breakdown.
- **Mean without distribution** — two towns with same average income can have wildly different distributions. Show distribution or add variance indicators.
- **Weighted vs unweighted averages** unlabeled.
- **Outlier-dominated mean** — median or trimmed mean often more honest.

---

## 6. Uncertainty visualization (Cairo framework + practical patterns)

A chart claiming a number without showing uncertainty is overclaiming. Techniques:

| Pattern | Shows | Use for |
|---|---|---|
| **Error bars** | Range around each point | Polling, survey, lab measurement |
| **Confidence bands** | Continuous interval along a line | Forecasts, trends, regression |
| **Gradient uncertainty** | Blur / fade at edges of an interval | Hurricane forecast cones, projection charts |
| **Hypothetical Outcome Plot (HOP)** | Animate between sampled outcomes | Audiences bad at reading error bars |
| **Dot distribution** | Each dot = one sample / one person | Polling results, election forecasts |
| **Quantile dot plot** | 20 dots arranged as histogram, each dot = 5 % probability | Everyday decision-making audiences (bus arrival time) |

**Rule:** if your model outputs a distribution, your chart should too. A single bar for a forecast is a claim stronger than the data supports.

---

## 7. Annotation — carrying the argument

Great charts are **self-contained news items**, not illustrations. Datawrapper and Cairo converge on:

- **Headline title states the finding**, not the topic. "Tourism collapsed during WW2 and took 12 years to recover" beats "New Zealand tourism 1921–1984".
- **Subtitle specifies what/where/when/units** the title doesn't carry.
- **In-chart annotation calls out the 1–3 most important points** — peak, trough, trend break, intervention. Use arrows, boxed callouts, or subtle shading.
- **Source line + retrieval date + methodology link** at the bottom. Always.
- **De-emphasize secondary data** to direct attention — reduce opacity, thin stroke, grey out.

From the Gregor Aisch approval-ratings fix:
1. Remove colored backgrounds; color the lines instead — less ink competing with data.
2. Split by a meaningful attribute (here: party) rather than layering all presidents equally.
3. Acceptable "wimmelbild" detail — allow rich annotation if it rewards dwell time.
4. Emphasize the main line; de-emphasize the rest to 30 % opacity.

---

## 8. Chart critique checklist (field-usable)

Before publishing or reviewing a chart, run through:

**Truthful**
- [ ] Y axis includes zero where required (bar/area/stacked)
- [ ] Log scale labeled if used
- [ ] Cropping of time range justified in caption
- [ ] Denominator appropriate (counts vs rates)
- [ ] Aggregation level honest (Simpson's, mean + distribution)
- [ ] Units stated
- [ ] Uncertainty shown where the data has it
- [ ] Source + date + methodology linked

**Functional**
- [ ] Chart type matches the question (trend/compare/part/correlate/distribute/locate)
- [ ] Series count matches chart capacity
- [ ] Direct labels where a legend would cost a cross-reference

**Beautiful (integrity-safe)**
- [ ] No chartjunk (3D, moiré, drop shadows, decorative icons)
- [ ] Neutral secondary data; saturated primary
- [ ] Consistent style with sibling charts in the piece

**Insightful + Enlightening**
- [ ] Title states the finding
- [ ] 1–3 in-chart annotations support the finding
- [ ] The chart shows something a table would hide

**Accessible**
- [ ] WCAG 1.4.3 text contrast ≥ 4.5:1
- [ ] WCAG 1.4.11 graphical contrast ≥ 3:1
- [ ] Works in greyscale
- [ ] Non-color encoding present (shape, pattern, label)
- [ ] Accessible description under the chart (one-sentence plain-language summary of the main insight)
- [ ] Data table fallback toggleable

---

## 9. How this layer plugs into the existing §14 data-viz chapter

`tufte-principles.md` governs data-ink, lie factor, chartjunk — **principle floor**.
`carbon-data-viz.md`, `apple-hig-charts.md`, `material-data-viz.md` govern visual grammar — **system floor**.
This file sits **between** them:

- Adds statistical-honesty rules the system docs don't emphasize (uncertainty, denominator, Simpson's, cherry-picked range).
- Adds the Cairo five-qualities framework as a review lens.
- Adds Datawrapper's working rules where they go beyond Carbon (log-scale application, color-scale interpolation, annotation-as-argument).
- No conflicts with existing §14 — **extends** the color-role taxonomy, the axis rules, and the chartjunk list.

---

## 10. Gaps + open items

- **The Truthful Art not fetched directly.** Cairo's framework here is encoded from secondary coverage, not his own words. Full extraction deferred to a later pass when the book is placed in `/books/`.
- **Datawrapper's flagship chart-type-guide article (`/academy/chart-type-guide`) 404s at the redirect target** as of 2026-04-21. Categories index still live; individual articles recoverable by category slug. The decision-flow synthesis here draws from the category-level content + color / log / colorblindness blog posts.
- **"Which chart to use when" blog post (Lisa Charlotte Muth) 404s** at both `blog.` and `www.` subdomain paths tried. Captured rules rely on her colorblindness + log-scale + grouped-bar writing + the category index.
- **Interactive / animated uncertainty visualization** (HOP, quantile dotplot) references external work (Matthew Kay et al.) not normalized here; flagged for later deepen.
