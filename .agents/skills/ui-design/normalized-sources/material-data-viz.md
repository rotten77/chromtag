# Material Design (M2 Beta) — Data Visualization (Normalized)

**Source:** https://m2.material.io/design/communication/data-visualization.html
**Status at fetch:** Material M2 beta. Material 3 does not yet have a dedicated data-viz page at the same depth, so M2 guidance remains the authoritative Material reference.
**Scope:** General cross-platform data viz guidance; integrates with Material component library.

---

## Principles

Material states three principles:

- **Accurate** — prioritize data accuracy, clarity, integrity. Don't distort.
- **Helpful** — help users navigate with context and affordances that emphasize exploration and comparison.
- **Scalable** — adapt visualizations to different device sizes, anticipating user needs on data depth, complexity, modality.

---

## Chart taxonomy (by purpose)

Material organizes chart types by **purpose category**:

### Change over time
Line, bar, stacked bar, candlestick, area, timelines, horizon, waterfall.
Examples: stock price, health stats, chronologies.

### Category comparison
Bar, grouped bar, bubble, multi-line, parallel coordinates, bullet.
Examples: income across countries, popular venue times, team allocations.

### Ranking
Ordered bar, ordered column, parallel coordinates.
Examples: election results, performance statistics.

### Part-to-whole
Stacked bar, pie, donut, stacked area, treemap, sunburst.
Examples: consolidated revenue, budgets.

### Correlation
Scatterplot, bubble, column + line, heatmap.
Example: income vs. life expectancy.

### Distribution
Histogram, box plot, violin, density.
Examples: population, income distribution.

### Flow
Sankey, Gantt, chord, network.
Examples: fund transfers, vote counts.

### Relationship
Network, Venn diagram, chord, sunburst.
Examples: social networks, word charts.

---

## Selecting the right chart

### Time-series selection table (Material)

| Chart type | When to use | Baseline | Number of time series | Data type |
|---|---|---|---|---|
| **Line** | Minor variations | Any value | Any (works with 8+) | Continuous |
| **Bar** | Larger variations; part-to-whole; comparisons; ranking | **Zero** | 4 or fewer | Discrete or categorical |
| **Area** | Relationships between datasets; part-to-whole | **Zero** (if multi-series) | 8 or fewer | Continuous |

### Bar vs. pie

Both show proportion. But:
- **Bars:** quantities via length, common baseline — easier to compare.
- **Pie:** portions via arc/angle within a circle.

**Bar, line, and stacked area** are more effective at showing change over time. Don't use multiple pies for temporal comparison — pie-slice comparisons are hard across charts.

**Do:** bars for changes over time or differences between categories.
**Don't:** multiple pie charts to compare across time.

### Area chart variants

- **Stacked area** — multiple time series stacked. Preserves legibility.
- **Overlapped area** — discouraged with more than two time series; obscures data.

**Do:** stacked area for multiple time series.
**Don't:** overlapping area with > 2 series.

---

## Style

### Visual encoding

Translate data into visual form using: shape, color, size, area, volume, length, angle, position, direction, density.

Can layer multiple encodings on a single mark (color = category, length = value).

### Shape

- Level of detail should match **intended interaction precision**.
- Bars with **subtle rounded corners** work — but only if the top edge remains precise (the bar's length must read accurately).
- **Don't** use shapes with imprecise edges for close inspection.

### Color — four roles

Color in a chart can:
1. **Distinguish categories** (donut by segment)
2. **Represent quantity** (sequential in a map)
3. **Highlight specific data** (focal point in a scatter)
4. **Express meaning** (red = danger, green = success)

#### Areas of focus
Use color highlights **sparingly**. Many color highlights destroy focus.
**Do:** color highlights + neutral backgrounds for contrast.
**Caution:** many colors in one chart hinder focus.

#### Color for meaning — accessibility
**Reinforce color meaning with other cues** — icons, shapes, labels.
**Don't** use color alone to indicate meaning.
For users who don't see color differences: high-contrast shading, shape, texture, text labels.

### Line styles

Can vary by: dashes, opacity. Useful for: annotations, forecasting elements, comparative tools, confidence intervals, anomalies.

**Do:** vary line texture to represent different data types.
**Don't:** use different colors to show periodical variation of the same category.

### Typography

Text can label: chart titles, data labels, axis labels, legend.

#### Material's type scale for charts

| Scale | Typeface | Font | Size |
|---|---|---|---|
| Chart title | Roboto | Regular | 18 pt |
| Chart subtitle | Roboto | Regular | 14 pt |
| Data label | Roboto | Regular | 22 pt |
| Sub-label | Roboto | Regular | 14 pt |
| Axis labels | Roboto | Regular | 12 pt |
| Legend labels | Roboto | Regular | 12 pt |

Chart title = highest hierarchy; axis labels and legend = lowest.

#### Text weight

**Do:** bold on just one or two key elements — balanced design.
**Don't:** bold everywhere — destroys hierarchy.

### Iconography

Use icons for:
- **Categorical data** — differentiate groups
- **UI controls/actions** — filter, zoom, save, download
- **States** — error, no data, completed, danger

Use universally recognizable symbols.
**Do:** use labels **alongside** icons.
**Don't:** use icons alone to represent important information.

### Axes

- **Bar charts should always start at zero.** Starting anywhere else distorts perception.
- Consider removing axes entirely to keep data as the focal point; place values directly on chart elements when possible.
- **Axis labels:** use a *balanced* number — enough to read the scale, not so many that they crowd the plot.
- **Text orientation:** place labels **horizontal**. Don't rotate or stack vertically. If bars are tight, rotate the **bars** (horizontal bar chart) rather than the labels.

### Legends and annotations

- **Annotations** highlight data points, outliers, noteworthy content.
- **Desktop:** place legend below the chart.
- **Mobile:** place legend above the chart (stays visible during interaction).
- **Direct labeling** in simple charts; use a legend when the chart is dense or grouped with related charts.

### Small displays
Simplify. Annotate key points (min/max). Don't place key data points off-screen — forces the user to scroll.

Threshold lines give context in a small space.

---

## Behavior / interaction

Three interaction patterns Material emphasizes:

### Progressive disclosure
Reveal detail on demand.
- **Desktop:** hover state reveals detailed data.
- **Mobile:** touch-and-hold displays a tooltip positioned **above the chart** (finger doesn't occlude the tooltip).

### Zooming and panning
- **Zoom desktop:** click-and-drag or scroll.
- **Zoom mobile:** pinch.
- If zoom isn't the primary action, use click-and-drag (desktop) or double-tap (mobile).
- **Panning** must be constrained to meaningful directions (if only time matters, pan only along the X axis).
- Panning typically paired with zooming. On mobile, one-finger swipe.

### Pagination
Common on mobile: swipe left/right to view the previous or next chart.

### Data controls
Toggles, tabs, dropdowns to filter/change data. Can display a metric as the control is adjusted.

### Motion
- Used purposefully, not decoratively.
- Expresses the connection between different states and spaces.
- Should feel logical, smooth, responsive. Must not obstruct the user's journey.
- Example: animate between "by day" and "by week" views; omit data outside the new range during transition.

### Empty states
Display content that suggests what to expect when data arrives. Character animation can add delight where appropriate.

---

## Dashboards

Material distinguishes three dashboard types:

### Analytics dashboards
For exploring data and discovering trends. Complex charts enable insight discovery.

**Use cases:** highlighting trends, answering "why" and "what if", forecasting, in-depth reports.
**Examples:** ad-campaign performance over time, product lifecycle sales, city population trends, climate data.

### Operations dashboards
Answer a predefined set of questions. Typically monitoring-focused. Current info in simple charts.

**Use cases:** tracking progress toward a goal, real-time system performance.
**Examples:** call-center activity, Cloud app health, stock market, race-car telemetry.

### Presentation dashboards
Curated snapshot. Few small charts or a scorecard with dynamic headlines that explain insights.

**Use cases:** KPI overview, executive summary.
**Examples:** investment account overview, product sales + market share.

### Dashboard design rules

Dashboard layout, style, and interaction must match its purpose.
A dashboard should:
- **Prioritize the most important information** via layout.
- **Display a focal point** established through color, position, size, and visual weight.

Arrange info based on the questions asked of the data (e.g., in an operations dashboard: What needs attention? When did it happen? Where? What else was affected?).

---

## Material-specific do's and don'ts

**Do:**
- Pick chart by purpose category (time / comparison / ranking / part-whole / correlation / distribution / flow / relationship).
- Bar charts start at zero.
- Keep labels horizontal; rotate bars instead of text.
- Legend below on desktop, above on mobile.
- Reinforce color meaning with shape, icon, or label.
- Stacked area over overlapped area for > 2 series.
- Progressive disclosure: hover on desktop, long-press on mobile.
- Tooltip above finger on mobile (not under).

**Don't:**
- Multiple pies across time.
- Overlapped area with > 2 series.
- Bold everywhere.
- Rotate or stack labels vertically.
- Color as only meaning-bearing channel.
- Decorative motion without functional purpose.
