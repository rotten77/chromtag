# IBM Carbon Design System — Data Visualization (Normalized)

**Source:** https://carbondesignsystem.com/data-visualization/
**Pages fetched:** getting-started, chart-types, chart-anatomy, color-palettes, axes-and-labels, legends, dashboards
**Scope:** Enterprise data-heavy dashboards and analytical UIs. IBM's Design Language applied to charts.

---

## Philosophy

Carbon charts "help you tell accurate and convincing stories around data with beautiful and accessible visualizations." Carbon treats data viz as dense, complex, enterprise-first — where clarity, contrast, and accessibility trump aesthetic flourish.

---

## Chart-type taxonomy (by purpose)

Pick chart type by **purpose** first, not by familiarity.

### Comparisons
- Simple bar, Grouped bar, Floating bar
- Lollipop
- Bubble
- Radar
- Wordcloud

### Trends
- Line
- Area (simple)
- Boxplot
- Histogram
- Stream

### Part-to-whole
- Donut, Pie
- Stacked bar
- Bullet
- Stacked area
- Meter, Gauge
- Tree map
- Circle pack

### Correlations
- Scatter
- Heat map
- Parallel coordinates (design only)

### Connections
- Alluvial (Sankey) diagram
- Network diagram
- Tree diagram

### Geospatial
- Choropleth map
- Proportional symbol map
- Connection map

---

## Chart anatomy

### Rectangular charts
Typical elements: legend, axis titles, graph frame, axes + ticks + grid lines, marks, zoom bar, tooltip.

- **Title:** descriptive and qualitative; should reflect the main insight the data reveals.
- **Legend:** defines the association of each visual property (color, shape, size) to its corresponding data. When possible, **label data directly on the chart** and skip the legend.
- **Tooltip:** appears on hover; should repeat corresponding axis values plus any other relevant details.
- **Graph frame, axes, ticks, grid:** help the reader understand proportions, scale, indicators, and units. **Don't fill the frame with too many elements.**

### Circular charts
Pie, donut, radar, solar.

- **Labels** offer the percentage of the whole for each category.
- When a slice < 3° use a callout to associate the label.
- When a slice < 1°, don't render it — it also won't be keyboard accessible or available in tooltips. Expose via data table instead.
- **Big number / KPI** (e.g., "15,250 browsers", "$1.3M revenue") can sit inside a donut to display the total or an individual count.

---

## Color palettes

### Categorical (qualitative) — for discrete categories with no inherent correlation

Apply in strict sequence (curated for max neighbor contrast). Full 14-color sequence for light theme:

```
01. Purple 70  #6929c4
02. Cyan 50    #1192e8
03. Teal 70    #005d5d
04. Magenta 70 #9f1853
05. Red 50     #fa4d56
06. Red 90     #570408
07. Green 60   #198038
08. Blue 80    #002d9c
09. Magenta 50 #ee538b
10. Yellow 50  #b28600
11. Teal 50    #009d9a
12. Cyan 90    #012749
13. Orange 70  #8a3800
14. Purple 50  #a56eff
```

When the exact number of categories is known, use the shorter single-color-group palette.

**Rule:** when categories > 5–7, re-consider. Categorical palettes break down past that — prefer faceted small multiples or collapsing the long tail to "Other".

### Sequential — for ordered / continuous data (trend, magnitude)

Monochromatic 10-step ramps. Light theme: **darkest = largest**. Dark theme: **lightest = largest** (inverted).

Options supplied: Blue 10→100, Purple 10→100, Cyan 10→100, Teal 10→100.

Use for: heat maps, choropleths, relationship/trend charts.

### Diverging — for data with a natural midpoint

Two palettes offered:

- **Red ↔ Cyan:** natural temperature association. Use for hot-vs-cold data.
- **Purple ↔ Teal:** no temperature baggage. Use for performance, sales, rates of change.

Both palettes: 8 steps on each side meeting at a pale midpoint.

Diverging palettes do **not** differentiate between light and dark themes.

### Alert palette — status

```
01. Red 60     #da1e28  danger / error
02. Orange 40  #ff832b  serious warning
03. Yellow 30  #f1c21b  regular warning
04. Green 60   #198038  normal / success
```

### Gradients
Good for highlighting extremes in a range of values. Use on **single-category visualizations only**. Multiple gradients reduce accessibility — avoid. **Never use a gradient in place of a sequential palette.**

---

## Axes and labels

### Starting at zero

**Always start at zero** for part-to-whole and comparison charts (bar, area). Truncating the Y axis distorts perception, making small differences look big.

**Non-zero OK** for line charts and scatter plots — they communicate *trends*, not relative sizes. Stock charts can crop the Y axis to reveal peaks/valleys.

### Gaps in data
**Never interpolate** across missing data. Label both start and end of the unavailable period. Use texture or a visual break to indicate the gap.

### Breaks in axes
When skipping axis ranges to bring extreme values into view, use a **sinusoidal break line** (not a straight line). Minimum width 16 px on X axis; fixed 16 px on Y axis. If data exists in the broken region, re-style line to 0.5 px stroke, hide data-point circles.

### Time series
- **Consistent increments.** Never change tick increments to accommodate data availability — use an axis break instead.
- **Localize** date/time formats to user preference where possible.
- **Landmark labels:** when data crosses into a new day/month/year, **semibold** the label to mark the boundary.

---

## Legends

### Usage
- **Avoid legends when you can label directly on the chart.** Legends force visual association, adding cognitive work.
- A chart with only one data category doesn't need a legend.
- **Use clear language and no acronyms.** Same rule applies to titles and axis labels.

### Accessibility — texture
Use **texture in addition to or instead of color** to distinguish data categories for users with color vision deficiency.

### Position
- **Bottom (default) or top** — use when space is scarce, e.g., a dashboard.
- **Left** — when better type alignment is needed; avoid if surrounding chart elements are tightly clustered.
- **Right** — when space is plentiful or maximum context desired. On mobile, collapse legends to a stack.
- **Overlay** — geospatial only, with 80 % background opacity on chart background.

### Interactions
- **Hover to highlight:** hovering a legend entry drops other categories' opacity to 30 %.
- **Click to isolate:** clicking a legend entry hides the others; the clicked entry gets a checkmark to indicate the selected state. Clicking all-on resets to default.

### Hidden legends
Discouraged (reduce clarity and accessibility). If used (typically mobile), add a "View legends" button that opens a modal with toggles for each category.

### Overflow
Show max **2 lines by default**. "View more" expands to a maximum of **30 % of the chart's height**. Beyond that, scroll vertically.

---

## Dashboards

### Presentation dashboards

Show current status of KPIs. Examples: car dashboard, stock ticker board, map with nearby gas stations.

**Best practices:**
- **Establish a strong hierarchy.** Most important data = highest contrast and largest area. Follow the F-pattern (top-left → right → down).
- **Limit the number of metrics.** Strip anything that could distract from interpretation.
- **Consistent color assignment** for each dataset across the dashboard.
- **Use white space to separate and guide** — white space increases comprehension by ~20 % (per Human Factors International research cited by Carbon).

### Exploration dashboards

For drilling into data: search, sort, filter, roll-up, drill-down. Examples: financial reports with drill-down; interactive maps with zoom.

**Best practices:**
- **Consistency is key.** All charts use the same layout, spacing, and legend position. Never switch measurement systems mid-dashboard (e.g., imperial ↔ metric).
- **Linked charts.** When a user filters / zooms one chart, mirror the action across related charts. Multi-dimensional views.
- **Annotation.** Use to highlight trends, averages, peaks, valleys. Must not obstruct the data.

---

## Accessibility notes (synthesized)

Carbon's data-viz page dedicated to accessibility was not retrievable (404) as of fetch; the following is drawn from the chart-anatomy, legends, color, and axis pages:

- **Texture/pattern in addition to color** for category distinction.
- **Data table fallback** required when slices or values fall below rendering thresholds (< 1° in circular charts).
- **Keyboard access** for every data point and every legend toggle.
- Labels / legend text must meet WCAG contrast (≥ 4.5:1 for normal text, ≥ 3:1 for graphical objects).
- Write concise, literal titles; no acronyms unless defined.

---

## Carbon-specific do's and don'ts (quick)

**Do:**
- Pick chart type by purpose (comparison / trend / part-to-whole / correlation / flow / geospatial).
- Label directly on the chart whenever possible.
- Start bar chart Y axis at zero.
- Semibold landmark labels (day/month/year boundaries).
- Apply categorical palette in the prescribed order.
- Use sequential for magnitude, diverging for mid-pointed data.

**Don't:**
- Pie chart with > 5 slices.
- Truncate Y axis on a bar or area chart.
- Interpolate missing data.
- Let legend exceed 30 % of chart height without scrolling.
- Use gradients in place of sequential palettes.
- Rely on color alone for category distinction.
