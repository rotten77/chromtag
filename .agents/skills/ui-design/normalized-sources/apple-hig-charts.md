# Apple HIG — Charts & Charting Data (Normalized)

**Sources:**
- https://developer.apple.com/design/human-interface-guidelines/charts
- https://developer.apple.com/design/human-interface-guidelines/charting-data
**Scope:** iOS, iPadOS, macOS, watchOS, tvOS, visionOS. Implementation via Swift Charts.

---

## Purpose of a chart (Apple's framing)

Charts are for communicating **clearly**, not decorating. Apple recommends charts when you want to:

- Analyze trends (historical or predicted).
- Visualize the current state of a process/system/quantity changing over time.
- Evaluate items — or the same item at different times — by comparing data across multiple categories.

**Not every dataset needs a chart.** If you only need to *present* data (not help people analyze it), use a list or sortable/searchable table.

---

## Best practices

- **Use a chart to highlight the important information** in a dataset. Charts are visually prominent — draw attention on purpose.
- **Keep charts simple.** Let people reveal detail progressively. Packing too much data obscures the relationships you're trying to surface.
- **Make every chart accessible.** Provide accessibility labels for values and components; provide accessibility elements for interaction. Use `Audio Graphs` for VoiceOver where possible.
- **Prefer common chart types** (bar, line, point). Familiarity lowers the learning curve.
- **If a novel chart type is needed, teach it.** Example: Activity's ring animation that introduces how each ring maps to a metric.
- **Examine the data from multiple levels** (macro totals, mid-level subsets, individual values) to find what's worth surfacing.
- **Add descriptive text.** Titles, subtitles, annotations emphasize the important bits. Weather's "Chance of light rain in the next hour" above the hourly chart is the model.
- **Match chart size to functionality.** Enough room for interactions and labels, not more.
- **Be consistent across charts that serve the same purpose.** Different type/style implies "different thing".
- **Maintain continuity across charts that show the same data** (Health Trends → expanded view reuses type, colors, marks, annotations).

---

## Chart anatomy

- **Mark** — visual representation of a data value. Types: bar, line, point. Choose mark type by information goal.
- **Plot area** — area containing marks.
- **Axis** — horizontal + vertical reference frame. An axis can have **ticks** (specific reference points) and **grid lines** (extending from ticks across the plot area).
- **Labels** — name axes, ticks, marks.
- **Accessibility labels** — describe elements to assistive tech.
- **Descriptive titles / subtitles / annotations** — context and specific callouts.
- **Legend** — describes non-position attributes (color/shape denoting categories).

---

## Marks — choose by communication goal

- **Bar** — compare values across categories; show relative proportions within a whole. Works especially well when each value is a sum (e.g., total steps per day).
- **Line** — show how values change over time. Slope communicates rate of change; helps visualize overall trends.
- **Point** — individual data values visible as distinct marks. Good for showing how two properties relate (scatter). Helps reveal outliers and clusters.
- **Combine types when it adds clarity.** Line + points: overall trend plus individual emphasis.

---

## Axes

### Fixed vs. dynamic range
- **Fixed range** when specific min/max is meaningful everywhere. Example: battery charge 0–100 %.
- **Dynamic range** when data values vary widely and you want marks to fill the plot area. Example: Health Steps chart re-scales to the current period.

### Lower bound — depends on mark type + use
- **Bar charts** generally work well with zero lower bound — lets people visually compare heights.
- **Zero lower bound can obscure meaningful differences** when the interesting variation happens far from zero (e.g., resting vs. active heart rate). Use a dynamic bound in that case.

### Tick values
- **Prefer familiar sequences** (0, 5, 10 …). Uncommon intervals (1, 6, 11 …) force extra mental math.

### Grid lines and labels
- Tailor density and visual weight to the chart's use.
- **Too many grid lines overwhelm**, too few make estimation hard.
- Interactive charts can use fewer, lighter grid lines because the interaction reveals values.

---

## Descriptive content

- **Write descriptions that help people understand what the chart does *before* they view it.** Critical for VoiceOver users and users with cognitive disabilities.
- **Summarize the main message.** Don't make users parse visuals to find it. Weather does this with a plain-language summary above the chart.

---

## Color

- **Follow the general HIG color guidance** for inclusive color.
- **Don't rely on color alone** to differentiate data or communicate meaning.
  - Supplement with different shapes or patterns.
  - Example: Health's blood-pressure chart uses circle (systolic, red) and diamond (diastolic, black/white).
- **Aid comprehension with visual separators** between contiguous areas of color in stacked bars. iPhone Storage settings adds narrow empty strips between color segments.

---

## Accessibility of charts

### Audio Graphs
Swift Charts provides a default implementation. Construct audible tones representing data values and trend. Can also present high-level text summaries.

- If using Audio Graphs, customize the default with a chart title and descriptive summary.
- **If not using Audio Graphs**, you must provide an overview that identifies chart type, what each axis represents, upper/lower bounds.

### Accessibility labels — guidelines
- **Prioritize clarity and comprehensiveness.** Always include context (date, location) — a bare value isn't enough. Keep descriptions concise and avoid repeating info already provided by Audio Graphs or overview.
- **Avoid subjective terms.** "Rapidly", "gradually", "almost" — those are your interpretations. Give actual values; let users form their own.
- **Avoid ambiguous formats and abbreviations.** Prefer "June 6" over "6/6"; spell out "60 minutes" over "60m".
- **Describe what the details represent, not what they look like.** Don't narrate colors ("red and blue lines") — identify what each series is.
- **Be consistent throughout the app** when referring to axes (e.g., always name the X axis first).

### Axis/tick labels for VoiceOver
**Hide visible text labels for axes and ticks from assistive technologies.** VoiceOver users get trend info via Audio Graphs and accessibility labels on marks; the visual tick labels become redundant noise.

### Interaction and focus
- **Don't require interaction to reveal critical information.** Stocks: the line chart shows performance; interaction only reveals deeper detail.
- **Make it easy for everyone to interact.** Chart marks too small for accurate touch → expand hit target to the entire plot area, letting people scrub.
- **Keyboard / Switch Control navigation.** Default linear traversal may not make sense. Use accessibility APIs (e.g., `accessibilityRespondsToUserInteraction(_:)`) to specify a logical path (along the X axis instead of jumping).
- For very large datasets, let people move focus among **subsets** of values instead of every single point.
- **Help people notice important changes.** Animating changes helps sighted users; also notify VoiceOver and users who have animations off (use `UIAccessibility.Notification` / `NSAccessibility.Notification`).

### Alignment with surrounding UI
- Align the chart's leading edge with other views.
- Put vertical grid-line labels on the trailing side of the line, or shift the Y axis to the trailing side of the chart, so labels don't protrude past the leading edge.
- Anchor orphan labels to a grid line with a tick.

---

## Platform considerations

### Generic
No additional notes for iOS, iPadOS, macOS, tvOS, visionOS.

### watchOS
**Avoid requiring complex chart interactions.** Prefer glanceable information + simple interactions where they add value.
If also on another platform, let that platform carry the detail (Heart Rate on watchOS shows today's chart; iPhone Health shows multi-period data and lets people examine individual marks).

---

## Apple-specific do's and don'ts

**Do:**
- Pick bar / line / point based on the question being answered.
- Provide a plain-language summary above the chart.
- Support Dynamic Type in chart labels.
- Use both color and shape to differentiate data series.
- Expand hit targets to the plot area for scrubbing.
- Provide Audio Graphs / accessibility labels for VoiceOver.
- Hide visible tick/axis labels from VoiceOver (redundant with Audio Graphs).
- Keep visual hierarchy: data most prominent, descriptions and axes supporting.

**Don't:**
- Pack too much data into one chart.
- Rely on color alone to distinguish series.
- Hide critical information behind interaction.
- Use subjective wording in accessibility labels.
- Require watchOS users to do complex chart interactions.
