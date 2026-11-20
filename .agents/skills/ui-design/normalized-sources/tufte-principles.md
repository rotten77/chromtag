# Edward Tufte — Principles of Information Design (Normalized)

**Sources:**
- *The Visual Display of Quantitative Information* (1983, 2nd ed. 2001)
- *Envisioning Information* (1990)
- *Visual Explanations* (1997)
- *Beautiful Evidence* (2006)
- IxDF article: https://ixdf.org/literature/article/the-principles-of-edward-tufte
- Wikipedia: Edward_Tufte

**Scope:** Foundational principles for information design and quantitative data graphics. Older than the digital design systems but the intellectual origin for Carbon, Apple, and Material's data-viz chapters.

---

## Graphical excellence (Tufte's definition)

> "Graphical excellence is that which gives to the viewer the greatest number of ideas in the shortest time with the least ink in the smallest space."

Three attributes:

1. **Well-designed presentation of interesting data** — substance, statistics, design combined.
2. **Clarity, precision, efficiency** — complex ideas communicated without distortion.
3. **Multivariate density** — many variables conveyed in minimal space.

Graphical excellence requires **telling the truth** about the data.

---

## Data-Ink Ratio

Core formula:

```
Data-Ink Ratio = Data-Ink ÷ Total Ink used to print graphic
```

- **Data-ink** — the non-erasable core of a graphic; ink that represents actual data.
- **Non-data-ink** — gridlines, redundant labels, borders, decorative elements, 3D effects.

**Goal: ratio → 1.0** (without losing comprehensibility).

### Five design rules (Tufte)

1. **Above all else show the data.**
2. **Maximize the data-ink ratio.**
3. **Erase non-data-ink** (within reason).
4. **Erase redundant data-ink** (within reason).
5. **Revise and edit.**

### Applied
- Drop heavy frames. Use whitespace as separator.
- Remove redundant gridlines; keep only what aids reading.
- Strip 3D bars, drop shadows, gradients — they add ink without data.
- Direct-label series instead of redundant legend + axis + label.

---

## Chartjunk

Tufte's term for visual elements in charts that aren't necessary to comprehend the data — or that distract from it.

### Three categories

1. **Moiré vibration** — crosshatching, stripes, dense patterns that shimmer and fatigue the eye. Replace with solid tones.
2. **The grid** — heavy, dark, dominating gridlines. Relegate to thin light lines or remove. The **data** should dominate, not the reference frame.
3. **The duck** — decorative elements that consume space without adding information. Named after a store shaped like a duck (Long Island, NY). When form overpowers function, the design becomes a duck.

### Common chartjunk to avoid
- 3D effects on bar/pie charts.
- Excessive use of color or decorative illustrations.
- Drop shadows, gradient fills, bevels.
- Unnecessary dimensions (width carries data, depth is decoration).
- Backgrounds that compete with foreground data.

---

## Lie Factor — visual integrity

```
Lie Factor = Size of effect shown in graphic ÷ Size of effect in data
```

- **Goal:** 1.0 (perfect honesty).
- **Acceptable range:** 0.95 – 1.05.
- **Greater than ~1.05 or less than ~0.95:** the graphic is distorting the data.

### Six principles of graphical integrity (Tufte)

1. **Numerical representation proportional to quantity.** Bar twice as long = value twice as large.
2. **Clear, detailed, thorough labeling.** Defeats graphical distortion and ambiguity.
3. **Show data variation, not design variation.** Don't change scales mid-chart to make variation look bigger.
4. **Use standardized units** (for monetary data, inflation-adjusted).
5. **Number of variable dimensions shown must not exceed number of dimensions in data.** No 3D when data is 2D.
6. **Don't quote data out of context.**

### Common integrity violations
- Truncated Y axis that exaggerates differences.
- Logarithmic scale presented as linear.
- Area proportional to radius²; if the author scales both width and height by the data, the area scales by the square — magnifies the lie.
- Dual axes with mismatched zeros.

---

## Data density

```
Data density = number of entries in data array ÷ area of graphic
```

Most published graphics use **far less** data density than the medium allows. Low-density graphics waste the space and rob the reader of the comparisons they could make.

**High data density enables:**
- Comparison across many data points.
- Detection of patterns, anomalies, outliers.
- Rich context without clutter.

**Example:** a single stock chart with 200 daily closes is denser — and more honest — than a bar chart of 4 quarterly averages.

---

## Small multiples

A series of similar graphs using the same scale and axes, repeated across panels.

### Why they work
- Reader learns the chart type **once**; subsequent panels are free.
- Comparison across category/time is trivial — eye moves between panels.
- Data density increases dramatically.
- No legend needed — panel label identifies.

### When to use
- Comparing the same metric across many categories (states, products, months).
- Showing evolution over time where a single chart with 12 lines becomes unreadable.

### Rules
- **Identical scales across panels.** If scales differ, comparison is invalid.
- Small size per panel — reader isn't studying one, they're scanning patterns across many.
- Consistent framing, axes, colors.

---

## Sparklines

Tufte coined the term in *Beautiful Evidence* (2006). A **sparkline** is a small, word-sized, line-chart-like graphic, embedded **inline with text**.

- **Size:** approximately the height of surrounding text (x-height to cap height).
- **No axes, labels, grid.** Just shape and optionally a min/max marker.
- **Purpose:** show trend at a glance without breaking reading flow. "Stock up 2 % yesterday ▁▂▅▇▆" is denser than a separate chart.

Historical note: sparklines had earlier analogs — Peter Zelchenko implemented tiny inline charts in Michael Medved's *QuoteTracker* in 1998 — but Tufte formalized the concept and name.

---

## Aesthetic elegance — multifunctioning elements

Great graphics are elegant, not minimal for minimalism's sake.

Tufte's archetype: **Charles Joseph Minard's 1869 map of Napoleon's 1812 Russian campaign.** Combines six variables in a single graphic — army size, location (x, y), direction of travel, date, temperature on the retreat — without confusion.

### Design lessons
- **Use every element to do multiple jobs.** A line can carry thickness (count), position (path), color (direction), anchored to time on an additional axis below.
- Proper format + relevant data + **multi-functioning elements** = elegance.
- Avoid prettification. Integrate function and form; don't decorate a weak chart.

---

## Layering and separation

*Envisioning Information* (1990) addressed 2D → layered information.

- Use **visual hierarchy** — thick/thin, dark/light, saturated/desaturated — to separate data from context.
- Reference frame (axis, grid) must not compete with data.
- Annotations exist at a lighter layer than the data they describe.
- **Color** as layer control: dim what is contextual, saturate what is data.

---

## Micro/macro readings

A good graphic reads at **two scales**:

- **Macro:** overall shape, trend, pattern — scan across.
- **Micro:** individual data point precisely recoverable — hover/read closely.

Sparklines, small multiples, and dense time-series charts all exploit this — the overall form tells the story and individual values are still readable on inspection.

---

## Tufte's do's and don'ts

**Do:**
- Maximize data-ink ratio.
- Use small multiples for comparison.
- Label directly where possible.
- Show high data density; trust your reader.
- Use color to distinguish category, not to decorate.
- Keep Lie Factor near 1.0.
- Use whitespace as separator over borders/gridlines.
- Integrate data and context at different visual weights.

**Don't:**
- 3D bar/pie/line charts.
- Moiré patterns or dense hatching.
- Decorative "ducks" — graphics that look like what they describe.
- Heavy gridlines and thick chart borders.
- Truncate the Y axis on comparison/part-to-whole charts.
- Use visual area when data is linear.
- Add chartjunk to fill space — prefer density over padding.

---

## Where Tufte disagrees with modern systems

- Tufte is skeptical of **interactive dashboards** as substitute for a well-designed static graphic. Interaction can become an excuse for cramming.
- Tufte favors **print-style density** on screen; many modern systems (Material, Apple) favor lighter density and reveal-on-demand.
- Tufte's stance on color is more restrained than Carbon's rich categorical palettes. Use in your context: Tufte for single-chart density and journalistic clarity; Carbon/Material for interactive dashboards at scale.
