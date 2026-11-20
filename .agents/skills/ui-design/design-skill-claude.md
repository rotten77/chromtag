# Design Skill — Operational Reference for Claude

> Distilled design guidance for real work. Pairs with `design-skill-master.md` (full synthesis) and `normalized-sources/*.md` (primary corpus).

**Philosophy:** Good design matches the audience, category, and context. There is no single correct aesthetic. The principles below are invariants. Aesthetics are always choices anchored to the work.

---

## 0 · Invocation checklist — do this before drawing

1. **Ask if context is missing.** Audience, category/industry, device mix, brand posture, constraints (accessibility, compliance, tech stack).
2. **Look at what works in the neighborhood** before committing to a direction. Live galleries for visual, category leaders for functional. (See §6.)
3. **Write copy first.** Layout fits content, not the reverse.
4. **Design states second.** Empty, loading, error, success, disabled — not just the happy path.
5. **Test at extremes.** 320 px width, longest content, zero content, AX5 text size, keyboard-only, screen reader.

---

## 1 · The five questions (decision framework)

Before any design decision:

1. **Who, where, doing what?** — real people, real context.
2. **What conventions do they know?** — Jakob's Law; violate with reason.
3. **What is the shortest path to their goal?** — Hick + Doherty + Fitts.
4. **What must be obvious / discoverable / hidden?** — hierarchy + progressive disclosure.
5. **Does it meet non-negotiables?** — WCAG AA, platform conventions, brand coherence.

---

## 2 · Non-negotiables (never ship without these)

### Accessibility — WCAG 2.2 AA minimum

| Requirement | Value | Criterion |
|---|---|---|
| Body text contrast | ≥ 4.5 : 1 | 1.4.3 |
| Large text (24 px reg / 19 px bold) | ≥ 3 : 1 | 1.4.3 |
| UI components & graphics | ≥ 3 : 1 | 1.4.11 |
| Focus indicator | ≥ 3 : 1 + min 2 px perimeter | 2.4.11, 2.4.13 |
| Touch target | ≥ 24 × 24 CSS px (prefer 44 × 44) | 2.5.8 |
| Text resize | 200 % no loss | 1.4.4 |
| Reflow | 320 px no horizontal scroll | 1.4.10 |
| Text spacing override | must not break | 1.4.12 |
| Keyboard | all functionality, no trap, visible focus | 2.1.1, 2.1.2, 2.4.7 |
| Gestures / motion | always have single-pointer alternative | 2.5.1, 2.5.4, 2.5.7 |
| Color | never the only signal | 1.4.1 |
| Forms | labels, errors, accessible auth | 3.3.x |

### Motion

- Respect `prefers-reduced-motion`. Fall back to cross-fade / reduce parallax.
- No flashing > 3 Hz.
- UI transitions 150–250 ms. Max ~400 ms. [Doherty threshold]

### Platform conventions (when targeting)

- **iOS:** tab bar bottom, 44 × 44 pt targets, SF Symbols, safe areas, swipe-back from left edge, Dynamic Type xSmall → AX5.
- **Android / Material 3:** 48 dp targets, tonal elevation, FAB for primary create, material components.
- **Web:** underlined or obviously-styled links, logo top-left → home, search top-right, primary CTA above fold, keyboard-accessible.

---

## 3 · Visual foundations (quick reference)

### Hierarchy

Use, in this order:
1. **Weight** before size.
2. **Color** (muted vs. emphasized neutral) before size.
3. **Proximity & isolation** — space makes things loud.
4. **Position** — top-left, center, first/last in a series (Serial Position).
5. **Size** last.

Squint test: what do you see first, second, third? Must match intent.

### Spacing

Non-linear scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`. Primary grid 8 pt. Sub-grid 4 pt. Consistency > exact numbers.

### Typography

- **Body:** 16 px web / 17 pt iOS / 16 dp Material. Never < 14 px.
- **Weight:** 400 body, 500–600 labels, 600–700 emphasis, 400–900 headings.
- **Line height:** 1.4–1.6 body, 1.1–1.25 headings.
- **Line length:** 50–75 characters.
- **Scale ratio:** 1.125 / 1.2 / 1.25 / 1.333 / 1.5. Pick one per product.
- **Three sizes on screen** usually sufficient. Use weight + color for sub-hierarchy.
- **Pair:** serif + sans, grotesk + humanist sans, or one family w/ weights. Not two similar sans.
- **Avoid:** thin weights for body, all-caps > 3 words, justified without hyphenation, text on busy imagery w/o scrim.
- **Dynamic Type** (Apple) support mandatory for iOS. `rem`/`em` on web.

### Color

- Build a full palette: 1–2 primary, **9-step neutral ramp**, accents, semantic (success/warning/danger/info) w/ bg + border + text each.
- Work in HSL/OKLCH. Shift hue across lightness — don't just vary lightness.
- Not red-green alone for status (colorblindness ~8 %).
- Dark mode ≠ inverted. Desaturate accents, lift darks (M3 uses lighter surface tints for elevation). Near-black `#121212` softer than `#000`.
- Apple: use semantic `systemBlue`, `secondaryLabel` etc. — they adapt.

### Depth

- Two-layer shadow (tight + soft) reads real. One offset shadow reads fake.
- Material 3 prefers **tonal elevation** over heavy shadows.
- Border + subtle tint is a calmer alternative to shadow.
- Respect **Reduce Transparency** — Apple Liquid Glass and frosted materials must fall back to solid.

### Motion

- 150–250 ms UI / 300–400 ms max.
- Ease-out (entrance), ease-in (exit), ease-in-out (reshape).
- Don't animate frequent actions (typing, list population, errors).
- Don't use bouncy easing for serious products (financial, medical, enterprise).

---

## 4 · Psychological laws — applied

Use as decision lenses, not decoration.

| Law | When it applies | Move |
|---|---|---|
| **Jakob's** | Any familiar pattern (nav, search, cart) | Honor convention unless there is reason |
| **Hick's** | Many choices | Progressive disclosure; recommend one; sequential questions |
| **Miller's** | Long lists, many nav items | Chunk into meaningful groups |
| **Fitts's** | Touch / click | Bigger target, closer to focus, use edges/corners |
| **Doherty** | Any response | < 400 ms; skeleton if longer |
| **Aesthetic-Usability** | UI testing | Polish alone doesn't fix flow — always test the flow |
| **Von Restorff** | Screen w/ many elements | One primary, others subordinate |
| **Serial Position** | Navigation, menus | Critical items at first/last positions |
| **Peak-End** | Whole flow | Invest in peak moments + endings; mitigate painful peaks |
| **Goal-Gradient + Zeigarnik** | Multi-step flow | Show progress; pre-fill first step; "2 steps left" |
| **Postel's** | Input fields | Accept any reasonable format; clean silently |
| **Mental Model** | Domain UI | Match user's mental model, not database schema |
| **Tesler's** | Complex systems | Complexity shifts, doesn't vanish — hide in defaults |
| **Occam's Razor** | Every element | Remove unless it justifies itself |
| **Paradox of Active User** | Onboarding, docs | In-context hints > tutorial; errors teach |

See `normalized-sources/laws-of-ux.md` for full origins and implications.

---

## 5 · Category quick-tailoring

Match design stance to category before worrying about palette.

| Category | Stance | Reference | Avoid |
|---|---|---|---|
| **Gov / healthcare / public** | Clarity, plain language, WCAG AAA target | Gov.uk, USWDS | Brand flourish burying the task |
| **Enterprise B2B / admin** | Density, keyboard, configurability | Linear, Stripe Dashboard, Datadog | Consumer whitespace wasting info |
| **Consumer SaaS** | Clear primary, warm-professional, first-success fast | Notion, Figma, Slack | 5-screen onboarding |
| **E-commerce** | Photography, trust signals, quick filter, frictionless checkout | Niche D2C, Shopify | Forced account, hidden shipping |
| **Local business** | Address / hours / phone / booking first | Best local sites in same city | Looking like a SaaS startup |
| **Non-profit** | Mission clarity, transparent donation path | charity:water, Wikipedia | Stock photos, corporate jargon |
| **Editorial & Creative** | Asymmetric, heavy typography | Fetch `si-editorial` (Layer 3) | Standard SaaS layouts, dense UI |
| **Agency / Minimal** | Distinctive, strong grid, typographic focus | Fetch `si-minimal` or `si-brutalist` (Layer 3) | Overused component libraries |

---

## 6 · Live reference playbook

Principles don't tell you what "modern category X" looks like **now**. Galleries do. Query live when the task needs current visual inspiration.

| Task | Primary library | Secondary |
|---|---|---|
| Marketing / landing | Land-book (by industry) | Lapa Ninja |
| Creative / High-End / Agency | Fetch: `si-editorial` or `si-brutalist` | Godly / Awwwards |
| Full brand site / Portfolio | Fetch: `si-minimal` | Lapa Ninja |
| Mobile app flow | Mobbin (by flow) | UI Sources (motion) |
| UI pattern deep-dive | Pttrns | Mobbin |
| Category leader study | Direct visit 3–5 leaders | — |

**Procedure:**
1. Define **category + style + color** before opening gallery.
2. Collect 8–15 refs.
3. Identify the 70 %-common pattern.
4. Pick 2–3 outliers worth borrowing from.
5. Deliver to user with reasoning, not a link dump.

Full detail: `normalized-sources/live-reference-libraries.md`.

---

## 7 · Finishing-touches checklist (pre-ship)

Typography
- [ ] One coherent scale; ≤ 3 sizes on screen
- [ ] No thin weights for body
- [ ] 50–75 char line length for body prose
- [ ] Line-height 1.4–1.6 body / 1.1–1.25 headings

Color
- [ ] Full neutral ramp built (9+ steps)
- [ ] Contrast passes for all text and UI
- [ ] Color not sole signal for status
- [ ] Dark mode distinct, not inverted

Spacing & alignment
- [ ] All values on the scale
- [ ] Consistent rhythm within sections
- [ ] No accidental 1-px misalignments

Content completeness
- [ ] Empty states designed (not "no data")
- [ ] Loading states (skeleton or contextual spinner)
- [ ] Error states w/ recovery path
- [ ] Tested at longest realistic content
- [ ] Tested at zero content
- [ ] Tested at 320 px width

Interactive states
- [ ] Hover / focus / active / disabled for every interactive element
- [ ] Focus indicator visible, ≥ 3 : 1, ≥ 2 px

Platform & accessibility
- [ ] Keyboard fully operable
- [ ] Screen-reader tested
- [ ] `prefers-reduced-motion` honored
- [ ] Dynamic Type / text resize tested

Finish
- [ ] No lorem ipsum
- [ ] Icons have accessible names
- [ ] Links and buttons distinguishable
- [ ] Consistent imagery style
- [ ] Brand coherent across flow

---

## 8 · Anti-patterns (don't ship)

- Centering everything; five primary buttons; hierarchy by size only
- Body text < 14 px; placeholder-as-label; low-contrast grey text
- Arbitrary pixel spacing; nested cards adding no grouping
- Pure white + pure black; saturated colors at equal brightness
- Flat single shadow; depth without purpose
- Motion on frequent interactions; bouncy easing on serious UI
- Auto-play video/sound without consent
- Placeholder instead of label; required/optional unmarked
- Icon-only buttons with no accessible name; removed focus ring
- Color as sole status signal
- "No data" empty state
- Copy-last, design-around-it

---

## 9 · Where to go deeper

| Need | File |
|---|---|
| Full synthesis of all sources | `design-skill-master.md` |
| WCAG 2.2 full success criteria | `normalized-sources/wcag-22.md` |
| Apple platform guidance (iOS/iPadOS/macOS/visionOS) | `normalized-sources/apple-hig.md` |
| Android/Material guidance | `normalized-sources/material-design-3.md` |
| Layout/color/type applied | `normalized-sources/refactoring-ui.md` |
| Psychology of UX | `normalized-sources/laws-of-ux.md` |
| Live inspiration query guide | `normalized-sources/live-reference-libraries.md` |
| Implementation checklist | `normalized-sources/frontend-design-checklist.md` |
| Tools / fonts / icons / illustrations | `normalized-sources/design-resources-for-developers.md` + `normalized-sources/awesome-design.md` |
| Principles of other design systems | `normalized-sources/awesome-design-principles.md` |
| Data-viz — IBM enterprise dashboards | `normalized-sources/carbon-data-viz.md` |
| Data-viz — Apple Swift Charts + accessibility | `normalized-sources/apple-hig-charts.md` |
| Data-viz — Material chart taxonomy + type scale | `normalized-sources/material-data-viz.md` |
| Data-viz — Tufte foundational principles | `normalized-sources/tufte-principles.md` |
| Data-viz — Cairo framework + Datawrapper (statistical honesty) | `normalized-sources/data-viz-honesty.md` |
| Motion — choreography, spring physics, web primitives | `normalized-sources/motion-choreography.md` |
| UX research methodology (NN/g + GOV.UK) | `normalized-sources/ux-research.md` |
| External intel — runtime fetch protocol (Layer 2/3) | `normalized-sources/runtime-access-protocol.md` |

---

## 10 · Data visualization & dashboards

Synthesized from Carbon, Apple HIG Charts, Material data-viz, Tufte. Full detail: §14 of `design-skill-master.md` and the four normalized files in §9.

### Step 0 — does it need a chart?
Charts are for **analyze / compare / show change**. For lookup, use a **sortable table**. Tables win at precision; charts win at pattern.

### Pick chart by purpose

| Purpose | Default | Notes |
|---|---|---|
| Change over time | Line; bar (≤ 4 series); stacked area (≤ 8) | Overlapped area > 2 series — never. |
| Category comparison | Bar | Length on common baseline reads fastest. |
| Ranking | Ordered bar | Sort it; don't make the reader. |
| Part-to-whole | Stacked bar > donut > pie | Pie ≤ 5 slices. Multiple pies across time — never. |
| Correlation | Scatter, heat map | |
| Distribution | Histogram, box, violin | |
| Flow / network | Sankey, chord, network | Expensive — only if flow is the story. |

### Axes — non-negotiables
- **Bar / area / stacked / donut start at zero.** Truncating distorts.
- **Line / scatter:** zero optional — crop when interesting variation lives away from zero.
- **Tick values familiar** (0, 5, 10) — not (1, 6, 11).
- **Labels horizontal.** Crowded? Rotate the **bars** (horizontal bar chart), not the text.
- **Missing data** — never interpolate. Mark gap with texture, label both ends.
- **Axis breaks** — sinusoidal line, ≥ 16 px width.

### Color — four roles
1. Distinguish category (qualitative palette)
2. Quantity (sequential ramp; darkest = largest in light, invert in dark)
3. Highlight (saturated accent on neutral bg)
4. Meaning (red = danger, green = success — reinforced w/ icon/shape/label)

**Carbon categorical sequence (apply in order, light theme):**
```
Purple 70 #6929c4 · Cyan 50 #1192e8 · Teal 70 #005d5d · Magenta 70 #9f1853
Red 50    #fa4d56 · Red 90  #570408 · Green 60 #198038 · Blue 80    #002d9c
Magenta 50 #ee538b · Yellow 50 #b28600 · Teal 50 #009d9a · Cyan 90 #012749
Orange 70 #8a3800 · Purple 50 #a56eff
```
**Cap categories at 5–7.** Beyond that — facet small multiples or collapse to "Other".

**Alert palette:** danger #da1e28 · serious-warn #ff832b · warn #f1c21b · success #198038.

### Tufte data-ink rule

```
Data-Ink Ratio = Data-Ink ÷ Total Ink     →     target 1.0
Lie Factor      = effect-in-graphic ÷ effect-in-data    →     target 1.0 (0.95–1.05 OK)
```

Rules:
1. Above all else, show the data.
2. Maximize data-ink ratio.
3. Erase non-data-ink (heavy grids, borders, redundant labels).
4. Erase redundant data-ink.
5. Revise and edit.

**No chartjunk.** Three categories: moiré (hatching/stripes), heavy grids, ducks (3D bars, drop shadows, gradient fills, decorative shapes).

### Type for charts (Material reference scale)

| Role | Size |
|---|---|
| Title | 18 pt |
| Subtitle | 14 pt |
| Big KPI / data label | 22 pt |
| Axis / legend | 12 pt |

Bold one or two key elements only. Use **tabular/lining numerals** (`font-variant-numeric: tabular-nums`) on axis ticks + data labels.

### Legends — last resort
- **Direct-label on chart > legend.**
- Desktop legend: bottom default. Mobile: above (stays visible during touch).
- Hover: drop other categories to 30 % opacity. Click: isolate (checkmark on active).
- Single-category — no legend.
- Overflow: 2 lines, expand to ≤ 30 % chart height, then scroll.

### Chart accessibility checklist (ship gate)

- [ ] Text contrast ≥ 4.5 : 1; graphical contrast ≥ 3 : 1 (marks vs. plot bg)
- [ ] Color is **not** the sole encoding — pair with shape, texture, or direct label
- [ ] Plain-language summary above the chart ("Chance of light rain in the next hour")
- [ ] Every data point + every legend toggle keyboard-focusable
- [ ] Hit target = full plot area (scrubbing) when individual marks < 24 × 24 px
- [ ] Audio Graphs (Apple) or text overview describing chart type, axes, bounds
- [ ] Accessibility labels include **context** (date, location), no subjective words ("rapidly"), units spelled out ("60 minutes" not "60m")
- [ ] Visible tick labels hidden from VoiceOver (redundant with Audio Graphs)
- [ ] Data-table fallback toggleable (and required when slices < 1° / values < threshold)
- [ ] No critical info hidden behind interaction — un-touched view answers the primary question
- [ ] Animations respect `prefers-reduced-motion`; tooltip on mobile sits **above** the finger

### Dashboards

| Type | Purpose | Shape |
|---|---|---|
| **Analytics / exploration** | Trends, "why", "what-if" | Complex charts, filters, drill-down, **linked charts** (filter one → mirror across related) |
| **Operations** | Real-time monitoring, fixed Qs | Simple charts, status indicators, threshold alerts |
| **Presentation / KPI** | Curated snapshot | Few large numbers w/ dynamic headlines, 1–2 hero charts |

**Common rules:**
- Hierarchy by layout — most important = highest contrast + largest area; F-pattern (top-left → right → down).
- One focal point.
- Strip metrics that don't answer a question the dashboard exists for.
- Same color = same metric, **everywhere** in the dashboard.
- Consistent layout/spacing/legend position across siblings — inconsistency reads as "different thing".
- **Never switch units mid-dashboard** (imperial ↔ metric, USD ↔ EUR).
- Whitespace as separator (~20 % comprehension lift per HFI cited by Carbon).

### Data-viz anti-patterns
- 3D bars/pies/lines · truncated Y on bar/area · dual-axis w/ misaligned zeros · pies > 5 slices · multiple pies across time · overlapped area > 2 series · color as sole encoding · legend forced when direct label would do · moiré / heavy grid / dominant border · vertical or rotated axis labels · key info hidden behind hover · inconsistent color/units across siblings · interpolated gaps · subjective accessibility labels.

---

## 11 · External design intelligence — runtime access

Two live GitHub-backed reference layers. **Never loaded by default.** Fetch on demand. Layer 1 principles always govern — these layers are lookup data only.

### Layer 2 — ui-ux-pro-max (product/style/color/font/chart lookup tables)

**Repo:** `nextlevelbuilder/ui-ux-pro-max-skill` (MIT). 161 product types · 67 UI styles · 161 color palettes · 57 font pairings · 25 chart types · 99 UX rules · 16 tech stacks.

**Fetch base:**
```
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/
```

| File | Fetch when |
|---|---|
| `products.csv` | Picking pattern/style/color for an industry (spa, fintech, dev tool, …) |
| `styles.csv` | Choosing UI style (Minimalism, Glassmorphism, Bento, AI-Native, Liquid Glass, …) + AI prompt keywords |
| `colors.csv` | Need palette aligned 1:1 with product type |
| `typography.csv` | Font pairing w/ Google Fonts imports + mood |
| `charts.csv` | Chart type + library recommendations |
| `landing.csv` | Landing page structure + CTA strategy |
| `ux-guidelines.csv` | Pre-ship UX review (99 rules by priority) |
| `ui-reasoning.csv` | Industry-specific reasoning rules |
| `stacks/<stack>.csv` | Stack-specific rules — angular · astro · flutter · html-tailwind · jetpack-compose · laravel · nextjs · nuxt-ui · nuxtjs · react-native · react · shadcn · svelte · swiftui · threejs · vue |

**Query method (no Python install needed):**
```bash
curl -sSL "<base>/styles.csv" | grep -i "glassmorphism"
curl -sSL "<base>/stacks/nextjs.csv"
```

**Trigger conditions:**
- Selecting colors / fonts / style → fetch the relevant CSV
- User's stack is React / Next.js / Svelte / Tailwind / shadcn/ui / SwiftUI / Flutter / Vue / Nuxt / Astro / Angular / Laravel / threejs / jetpack-compose / react-native → fetch `stacks/<stack>.csv`
- Designing charts → fetch `charts.csv`
- Industry match → `products.csv` + `ui-reasoning.csv`

### Layer 3 — awesome-design-md (real brand DESIGN.md references)

**Repo:** `VoltAgent/awesome-design-md` (MIT). GitHub folders are stubs. **Actual content** lives on getdesign.md.

**Fetch pattern (VERIFIED):**
```
https://getdesign.md/design-md/<brand-slug>/DESIGN.md
```
Returns `Content-Type: text/markdown`. All slugs below verified 2026-04-21.

**Full brand index (70):**

| Category | Slugs |
|---|---|
| AI / LLM | `claude` `cohere` `elevenlabs` `minimax` `mistral.ai` `ollama` `opencode.ai` `replicate` `runwayml` `together.ai` `voltagent` `x.ai` |
| Dev tools / IDE | `cursor` `expo` `lovable` `raycast` `superhuman` `vercel` `warp` |
| Backend / DB / DevOps | `clickhouse` `composio` `hashicorp` `mongodb` `posthog` `sanity` `sentry` `supabase` |
| Productivity / SaaS | `cal` `intercom` `linear.app` `mintlify` `notion` `resend` `zapier` |
| Design / creative | `airtable` `clay` `figma` `framer` `miro` `webflow` |
| Fintech / crypto | `binance` `coinbase` `kraken` `mastercard` `revolut` `stripe` `wise` |
| E-commerce / retail | `airbnb` `meta` `nike` `shopify` `starbucks` |
| Media / consumer tech | `apple` `ibm` `nvidia` `pinterest` `playstation` `spacex` `spotify` `theverge` `uber` `vodafone` `wired` |
| Automotive | `bmw` `bugatti` `ferrari` `lamborghini` `renault` `tesla` |
| Other | `semrush` |

**Slug notes:** keep suffixes — `linear.app`, `x.ai`, `mistral.ai`, `together.ai`, `opencode.ai` are exact paths. Don't strip.

**Each DESIGN.md has 9 sections:** Visual Theme · Color Palette & Roles · Typography Rules · Component Stylings · Layout Principles · Depth & Elevation · Do's & Don'ts · Responsive Behavior · Agent Prompt Guide.

**Trigger conditions:**
- Automotive project → fetch bmw + ferrari + tesla + renault + lamborghini + bugatti (pick 2–3 category peers, not all)
- Fintech → stripe + revolut + wise + coinbase + kraken
- Enterprise data-heavy → ibm + hashicorp + mongodb + clickhouse
- Dev tools → vercel + supabase + resend + replicate + warp + cursor
- AI products → claude + cohere + mistral.ai + voltagent
- Luxury / premium → apple + ferrari + lamborghini + bugatti
- User asks "how does [brand] do X" → fetch that brand's DESIGN.md, extract section X

**Fetch command:**
```bash
curl -sSL "https://getdesign.md/design-md/stripe/DESIGN.md"
```

### How to apply Layer 3 without copying

- **Extract the move, not the brand.** Stripe's blue-tinted multi-layer shadow is the technique; the specific `#533afd` is not your brand color.
- **Never clone a DESIGN.md into production.** Reference 2–3 brands, synthesize. User's own identity dominates.
- **Category peers beat famous names.** Building a spa landing page? Closest category in Layer 3 is `airbnb` or `clay` — not `stripe` just because it's famous.

### Governance — non-negotiable

1. Layer 1 always governs thinking. Layers 2/3 inform lookups.
2. Surgical fetches only. One CSV, one brand at a time.
3. Never load wholesale. Stale context rots output.
4. Flag uncertainty. If fetch fails, say so — don't hallucinate.

Full technical reference: `normalized-sources/runtime-access-protocol.md`.

---

## 12 · Operating notes

- **Don't invent design rules.** If a decision doesn't trace back to a cited principle or an observed convention in the target category, flag the uncertainty to the user.
- **Don't claim aesthetic authority.** Present 2–3 directions with tradeoffs; let the user choose.
- **Anchor claims to numbers.** "4.5 : 1 contrast", "44 × 44 pt", "150–250 ms" — not "readable", "big enough", "fast".
- **Fetch live when the task demands current inspiration.** Stale references produce dated work.
- **Gaps to know:** this skill is light on brand/voice copywriting. Motion (§13), data-viz statistical honesty (§14), and UX research (§15) are now covered at operational depth; fetch the relevant `normalized-sources/*.md` for full detail.

---

## 13 · Motion & animation — depth

Extends §3 Motion. Full detail: `normalized-sources/motion-choreography.md`. Sources: Emil Kowalski, fliptheweb/motion-ui-design, uxderrick web-animation guide, Motion (motion.dev), MDN.

### Easing presets — commit to three curves

```
cubic-bezier(0.34, 1.56, 0.64, 1)   — spring-like (overshoot). Buttons, cards, micro-interactions.
cubic-bezier(0.16, 1, 0.3, 1)       — smooth ease-out (no bounce). Modals, drawers, page transitions.
cubic-bezier(0.4, 0, 0.2, 1)        — fast-response (snappy). Toggles, tooltips, icon state, button press.
```

### Timing table (compatible with §3)

| Element | Duration | Curve |
|---|---|---|
| Button hover | 200 ms | spring-like |
| Button press | 80–100 ms | fast-response |
| Modal entrance | 250–300 ms | smooth ease-out |
| Tooltip appear | 100 ms | fast-response |
| Page transition | 300 ms | smooth ease-out |
| Dropdown | 200 ms | smooth ease-out |
| Success feedback | 600 ms | spring-like (exception) |

### Spring vs tween

**Tween** for predictable duration, deterministic end-state, serious/utilitarian UI (financial, medical, enterprise).
**Spring** for gesture handoff, layout reshape (FLIP), natural decorative motion. Motion.dev defaults: `stiffness` 1, `damping` 10, `mass` 1, `bounce` 0.25.

Bounce feels: `0` critically damped (notifications), `0.2–0.3` snappy (buttons), `0.4–0.6` playful (reactions), `0.8+` celebration only.

### Web primitives

- **View Transitions API** — `document.startViewTransition(cb)` + named `view-transition-name`. Chrome/Edge 111+, MPA 126+. Progressive enhancement with feature detect.
- **`@starting-style` + `transition-behavior: allow-discrete`** — CSS transitions across `display: none ↔ visible`. Modern popover / tooltip entry without JS.
- **`clip-path` animation** — hardware-accelerated, no layout thrash. Best for image reveal (`inset(0 0 100% 0)` → `inset(0 0 0 0)`), before/after slider, tab indicator, scroll reveal. Reveal easing: `cubic-bezier(0.77, 0, 0.175, 1)`.

### Choreography

- Stagger 30–80 ms per child; cap cumulative at 400 ms.
- Asymmetric parent/child — container lands first, content settles 100–200 ms later.
- Continuity of movement — exiting + entering element share trajectory (View Transitions enforces via shared name).
- Origin awareness — menus/modals open from trigger, not viewport center. Use `transform-origin` or measured coords.

### Performance — composite-only

- Only `transform` + `opacity` (+ `clip-path`) animate on GPU without layout/paint.
- 60 fps target. Test on mid-range Android (Chrome DevTools Performance).
- `contain: layout style paint;` isolates repaint.
- `will-change: transform, opacity;` sparingly; reset to `auto` after.
- CSS transitions interrupt cleanly; `@keyframes` restart.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Replace slide/scale → cross-fade. Kill parallax. Auto-rotate → user-driven. Keep essential feedback (focus, error); kill decorative.

### Motion anti-patterns

- Animating `width`/`height`/`top`/`left` instead of transforms
- Ignoring `prefers-reduced-motion`
- Over-animating (motion fatigue)
- Bouncy easing on serious UI
- Auto-play video without captions/pause/reduced-motion gate
- Stagger on every re-render
- Inconsistent timing across similar elements
- `@keyframes` where a transition would interrupt cleanly

### Pick in seconds

- "Element appears" → opacity 0→1 + `translateY(4px)→0`, 200 ms, smooth ease-out
- "Button press" → `scale(0.95)`, 80 ms in / 200 ms out, spring-like
- "Modal enters" → opacity 0→1 + `scale(0.96)→1`, 250–300 ms, smooth ease-out
- "Tab indicator" → single element, animate `translateX` or `clip-path: inset`, 200 ms spring
- "Page navigates" → `startViewTransition`, 300 ms, smooth ease-out, reduced-motion → instant
- "Card→detail expand" → FLIP (transform-only), 300 ms, spring bounce 0.2
- "Pull-to-refresh" → spring w/ gesture velocity, `bounce: 0.3`

---

## 14 · Data-viz statistical honesty

Extends §10. Full detail: `normalized-sources/data-viz-honesty.md`. Sources: Alberto Cairo (*The Truthful Art* — framework only, book not normalized), Datawrapper Academy + Blog.

### Cairo's five qualities

| Quality | Question |
|---|---|
| **Truthful** | Represents data honestly in context? |
| **Functional** | Form suits the task? |
| **Beautiful** | Pleasing without decoration distorting? |
| **Insightful** | Reveals something a table would hide? |
| **Enlightening** | Changes how reader thinks? |

**Priority on conflict:** truthful > functional > insightful > enlightening > beautiful.

### Statistical-honesty stance

- Show **distribution**, not just mean. Averages hide variance.
- Show **uncertainty**. Every estimate has a range.
- **Denominators** matter more than numerators. "Cases up 50 %" ≠ information without base rate + population.
- **Confirmation bias** — charts that confirm hypothesis need hardest skepticism.

### Misleading-chart inventory (field critique)

**Axis manipulation**
- Truncated Y on bar/area/stacked → 2 % looks like 200 %. Zero baseline; tight range → dot plot.
- Missing axis units → reader assumes wrong encoding.
- Dual Y with misaligned zeros → fake correlation. Two stacked charts or index (base 100).
- Log scale unlabeled → orders-of-magnitude hidden. Always label + annotate ("each gridline = 10×").
- Inverted Y without "Lower is better".

**Time / range cherry-picking**
- Start date at convenient local minimum
- End date at narrative-fitting point
- Inconsistent interval (weekly + monthly)
- Ignoring seasonality

**Denominator failures**
- Raw count across unequal populations
- Totals instead of per-capita internationally
- Missing base rate
- Dollars without PPP / inflation adjust

**Map-specific**
- Choropleth with raw count (needs population-adjust)
- Mercator for global quantity (use Equal Earth / Robinson)
- Undisclosed class-break method
- 5–7 bins (not 3, not 10)

**Aggregation**
- Simpson's paradox — show aggregate + breakdown
- Mean without distribution
- Outlier-dominated mean (use median / trimmed mean)

### Log scales

**Use when** relative change matters; data spans orders of magnitude; early + late trends both relevant.
**Don't** when audience non-technical + article isn't about rate; values close in magnitude; negatives present.
**Always** label "log scale" + annotate + tick at 1/10/100/1k/10k.

### Color scales — extends §10

Three types: **categorical** (equal lightness, distinct hues, unordered), **sequential** (light→dark, ordered; two hues beats single-hue for mid-distinctness), **diverging** (hue A dark ← pale mid → hue B dark, signed data).

Non-negotiables:
- Get it right in greyscale — lightness carries information
- Categorical ≤ 3–4 hues
- De-emphasize "no data" / "other" with grey, not competing hue
- Direct-label on chart (eliminates legend cross-reference)
- Blue safest hue for colorblindness; blue+orange + blue+red most accessible pairs
- Pair color w/ shape/pattern/line-style. Test Coblis / Color Oracle.

### Uncertainty viz

| Pattern | Use for |
|---|---|
| Error bars | Polling, survey, lab |
| Confidence bands | Forecasts, regression |
| Gradient edge | Hurricane cones, projections |
| Quantile dotplot | Everyday audiences (20 dots = 5 % each) |
| HOP | Audiences bad at error bars (animate samples) |

If model outputs distribution, chart outputs distribution.

### Annotation — carry argument

- **Title states finding**, not topic ("Tourism collapsed during WW2 and took 12 years to recover" > "NZ tourism 1921–1984")
- Subtitle = what/where/when/units
- 1–3 in-chart annotations for peak, trough, trend break, intervention
- Source + date + methodology — always
- Secondary data at 30 % opacity; saturated primary

### Chart critique checklist

- [ ] Y zero where required (bar/area/stacked)
- [ ] Log scale labeled + annotated
- [ ] Cropped range justified in caption
- [ ] Denominator appropriate (counts vs rates)
- [ ] Units stated; axis labeled
- [ ] Uncertainty shown where data has it
- [ ] Source + date + methodology linked
- [ ] Chart type matches question
- [ ] Series count within chart's capacity
- [ ] Direct labels > legends where possible
- [ ] No chartjunk (3D, moiré, drop shadow, decorative icon)
- [ ] Title states finding
- [ ] Works in greyscale + non-color encoding present
- [ ] Accessible description + data-table fallback

---

## 15 · UX research methodology

Full detail: `normalized-sources/ux-research.md`. Sources: Nielsen Norman Group, GOV.UK Service Manual.

### NN/g three-dimensional taxonomy

| Axis | Poles | Distinguishes |
|---|---|---|
| **Attitudinal ↔ Behavioral** | Say vs do | Stated belief vs actual behavior |
| **Qualitative ↔ Quantitative** | Why / how-to-fix vs how-many / how-much | Cause vs effect |
| **Context of use** | Natural · scripted · decontextualized · no-product | Real-world closeness |

**Gap-check:** all attitudinal → no behavioral evidence. All quantitative → no cause. Triangulate.

### Method × phase

| Phase | Type | Methods |
|---|---|---|
| **Discover** | Generative | Field studies, interviews, diary, participatory design |
| **Design** | Formative | Card sort, tree test, usability testing, journey map |
| **Launch** | Formative→summative | Moderated + unmoderated usability, benchmark, a11y eval |
| **Assess** | Summative | Analytics, surveys, A/B, search logs, feedback |

**Highest-leverage single activity:** qualitative think-aloud usability testing of existing system.

### 5-user rule

```
P(n) = 1 − (1 − L)^n     L ≈ 0.31
```

| n | Problems found |
|---|---|
| 1 | 31 % |
| 3 | 67 % |
| 5 | 84 % |
| 10 | 97 % |
| 15 | 99.5 % |

**Prefer 3×5 over 1×15.** Each round reshapes design; new problems surface.

**More users needed when:** multiple user groups (3–4 per group × 2 groups, 3 × 3+), quantitative benchmarking (≥20/cond), A/B significance (hundreds+).

**Not a representation rule** — 5 fluent able-bodied users cover that population only. Recruit per group.

### Usability test — operational

**Task design:** outcome-specified, not steps. First-person context. Realistic constraints. No UI vocabulary.

**Think-aloud** (NN/g "#1 usability tool"): concurrent verbalization. Reveals misconceptions. Low-cost. Tolerates imperfect facilitation. Limits: unnatural, social-desirability editing, facilitator leaks.

**Severity (Nielsen 0–4):** 0 not a problem · 1 cosmetic · 2 minor · 3 major (fix before release) · 4 catastrophic (must fix). Rate on frequency × impact × persistence.

**Default:** moderated remote (Zoom / Lookback / UserTesting) for design-phase. Unmoderated for later rounds + benchmarking.

### Guerrilla / discount testing

**Case:** Nielsen MacPaint 1988 — teams at 20–30 % best-practice compliance still caught 25 % of serious problems. **Bad testing beats no testing.**

**Setup:** café/library intercept, $10–20 gift card, 2–3 screener questions, 15–30 min sessions, 2 researchers. Iterate in days. **Not** for regulated domains, sensitive subjects, minors, populations needing accommodations.

### Interviews

**Open-ended:** "Walk me through a typical day." "Tell me about the last time you [X]."
**Non-leading probes:** "Tell me more." "Why is that important?" "What were you thinking?"
**Avoid:** leading, double-barreled, assuming, hypothetical future, recall-heavy.
**Default structure:** semi-structured — topic guide + follow threads.
**Bias watch:** social desirability, confirmation, recency, memory decay, interviewer effect.
**Sample:** 8–12 per group saturates most themes; 20+ for heterogeneous audiences.

### GOV.UK ethical + inclusive floor

- **Informed consent** (written + verbal): purpose, recording, retention, withdrawal rights
- **Data management:** minimum necessary, encrypted, access-limited, retention-policy deletion
- **Anonymization** before wide sharing
- **Withdrawal rights** at any point; data removable
- **Sensitive subjects:** enhanced consent, participant support, trained interviewer, shorter sessions
- **Pre-election periods:** pause partisan-adjacent research

**Inclusion (applies beyond public-sector):**
- Disabled users (AT, low-vision, deaf/HoH, cognitive/learning differences)
- Low-digital-skill users (older, first-time, low-literacy)
- Non-digital-service users
- Linguistic minorities (native speakers, not machine translation)

**Research-accessibility fixes:** format options (phone/video/async), longer sessions w/ breaks, community-org recruitment (not just online panels), cash/check alongside gift cards.

### Method picker

| Question | First choice | Backup |
|---|---|---|
| What problems exist | Think-aloud usability (5 users) | Unmoderated remote |
| Why users abandon | Interviews + funnel | Exit survey + session replay |
| Vocabulary users use | Open card sort + interviews | Search-log analysis |
| Whether IA makes sense | Tree test | First-click test |
| Which design wins | A/B | Comparative usability |
| Brand feelings | Survey + interviews | Sentiment analysis |
| Real-world behavior over time | Diary study | Longitudinal analytics |
| Is it accessible | Manual + AT with disabled participants | Automated scan (floor only) |
| Is concept worth building | Concept testing + interviews | Landing-page demand test |

### Research anti-patterns

- Skipping discovery (designing on assumed needs)
- Leading questions
- Recruiting from team network
- 5-user findings presented as statistics ("80 % failed" on 5 = 4 people)
- One round only (1×15 < 3×5 with iteration)
- Interviewing about future behavior (stated intent ≠ use)
- Asking disabled users about a11y but not shipping fix (extraction)
- Findings without owners + deadlines
- Focus groups for usability (groupthink)
- Analytics without qualitative (what without why)
- Skipping accessibility research (ships untested for 15 %+)
