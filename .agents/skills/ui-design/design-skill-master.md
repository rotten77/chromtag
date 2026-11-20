# Design Skill — Master Synthesis

> A personal design knowledge base assembled from WCAG 2.2, Apple HIG, Material Design 3, Refactoring UI, Laws of UX, and curated front-end/design checklists. Organized as a reusable reference for visual and interaction design across the full spectrum of work — SaaS, consumer, e-commerce, public sector, local-business, editorial, creative.

**Stance:** Good design means matching the target audience, category, platform, and constraints — *not* one aesthetic. A government permit portal and a skincare D2C site are both "well-designed" when they meet their own users' expectations. Principles are invariants; aesthetics are choices. This document codifies the invariants and tells you when to look outside for the choices.

**How to use this document:**

- When starting a design task: read §1 (framework), §2 (research), then jump to the foundation sections (§3–§8) relevant to the work.
- When stuck on a decision: §11 (psychological laws) and §12 (anti-patterns) are the fastest unblockers.
- Before shipping: §10 (checklists) is the exit gate.
- When you need current inspiration, not timeless theory: §9 live-reference playbook.

Citations inline as `[source]` — see §14 for full source list.

---

## 1. Decision framework — the meta-process

Every design task reduces to five questions, in this order:

1. **Who is this for, what do they need, and what context are they in?** (Audience, task, device, environment, constraint, ability.)
2. **What conventions do they already know?** (Jakob's Law — users transfer expectations from *other* products. Violate only with reason.) [Laws of UX §11]
3. **What is the shortest path from their first look to their goal?** (Hick's Law + Doherty Threshold + Fitts's Law — minimize decision time, response time, and motor effort.) [Laws of UX §10, §6, §7]
4. **What must be obvious, what must be discoverable, what can be hidden?** (Progressive disclosure; hierarchy; selective attention.) [Refactoring UI §3 Hierarchy; Laws of UX §25]
5. **Does it meet the non-negotiables?** (Accessibility WCAG 2.2 AA; platform conventions; brand coherence.) [WCAG 2.2; Apple HIG; Material 3]

Work through these before touching color, type, or components. Most bad interfaces skip (1) and (2) and start on (3) with a blank canvas.

### When user gives minimal brief

If the user says "design X", you do not have enough to begin. Ask:

- **Audience:** age, digital comfort, language, ability, culture.
- **Category:** what is this, in one comparable phrase? ("A Stripe for healthcare", "the website of a small bookshop".)
- **Device mix:** mobile-first, desktop-first, both, TV, watch, embedded kiosk?
- **Brand posture:** serious/professional, warm/friendly, playful, neutral/utilitarian, bold/editorial?
- **Constraints:** budget, time, tech stack, content readiness, compliance (HIPAA/GDPR/PCI/gov).

Three to five questions. Not a form.

---

## 2. Research phase — anchoring taste to reality

Before drawing, look at what works in the neighborhood.

### Who to study

- **Category leaders** the user's users already use. (If designing a small-business invoicing tool: look at FreshBooks, QuickBooks, Wave, Harvest.)
- **Adjacent-category exemplars** for specific moves. (Stripe's docs layout, Linear's command palette, Notion's inline toolbar, Gov.uk's form patterns.)
- **Live galleries** — see §9 for the full playbook.

### What to extract

- **Layout**: hero structure, section rhythm, density, max-width.
- **Palette**: primary, neutral depth, accent, dark-mode treatment.
- **Typography**: typeface family, pairing, scale, hierarchy depth.
- **Density**: information-per-screen — is this a sparse editorial site or a dense tool?
- **Motion**: quiet and functional, or expressive?
- **Copy voice**: direct, warm, technical, playful?

### How to use the research

Do not copy. Triangulate a baseline, then decide where to **meet convention** (usability) and where to **depart** (memorability). Every departure costs learning time; every adherence costs distinctiveness. [Jakob's Law]

---

## 3. Hierarchy — making the important obvious

Hierarchy is the single most important visual skill. Without it, every element competes and the user looks at everything (= nothing).

### Size is not the only lever

Beginners exaggerate size to show importance. Senior designers use [Refactoring UI]:

- **Weight** — bold vs. regular is often stronger than a size jump.
- **Color** — a darker neutral reads louder than a lighter one; muted de-emphasizes more than shrinking.
- **Contrast to background** — a white card on grey pops without any element growing.
- **Proximity and isolation** — an element in whitespace dominates a cluster.
- **Position** — top-left, center, and the optical weight of first/last items (Serial Position). [Laws of UX §26]
- **Typographic hierarchy** — at most 3 sizes on a screen: display, body, caption. Secondary variation via weight/color.

### Rules of thumb

- Label importance with **de-emphasis** of everything else, not just emphasis of one thing.
- Make secondary text *lighter*, not smaller, when possible.
- Collapse repeated elements visually (a list of items shouldn't have five competing visual styles).
- The primary action on a screen should be obviously the primary action — one clear Von Restorff target. [Laws of UX §28]

### Hierarchy check

Squint at the screen. What do you see first? Second? Third? If that order doesn't match the user's intent, the hierarchy is wrong — regardless of how pretty it is.

---

## 4. Layout & spacing

### Spacing scale

Use a **non-linear scale**, not arbitrary pixels. Typical scales: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. [Refactoring UI] Material 3 and Apple both build on 4-pt/8-pt grids.

- **4-pt subgrid** for tight adjustments (icon nudges, border offsets).
- **8-pt primary grid** for most spacing decisions.
- Consistency across a product is more important than the exact number.

### Layout moves

- **Define content before container**. A section sized around its content looks intentional; a fixed box stuffed with content does not. [Refactoring UI]
- **Max widths** for reading. Body prose: ~600–750 px (50–75 CPL). Dashboards: 1200–1440 content area.
- **Responsive breakpoints** (Material 3):
  - Compact `<600dp` (phones)
  - Medium `600–840dp` (foldables, small tablets)
  - Expanded `840–1200dp` (tablets)
  - Large `1200–1600dp` (laptops)
  - Extra-large `>1600dp` (desktops, TVs)
- **Apple device size-class context:**
  - iPhone portrait: compact × regular
  - iPad portrait: regular × regular
  - Mac: regular × regular (scales with window)
  - Design for size class, not device name. [Apple HIG Layout]

### Proximity, common region, similarity, connectedness

These four Gestalt laws drive grouping decisions. [Laws of UX §12–§16]

- **Proximity** — elements near each other group. Use space first. [Laws of UX §13]
- **Common region** — a shared background/border groups more strongly than proximity. Use cards/panels. Overuse = visual noise. [Laws of UX §12]
- **Similarity** — shared color/shape/size implies function. Consistent components → consistent user expectation. [Laws of UX §15]
- **Uniform connectedness** — a line or shared container trumps both proximity and similarity for grouping. [Laws of UX §16]

### Density

- **Sparse** (editorial, marketing, brand site): generous padding, one idea per scroll.
- **Medium** (consumer SaaS, e-commerce): cards, comfortable reading, 2–3 ideas per fold.
- **Dense** (trader tools, admin, analytics): information-first, minimal chrome, keyboard-driven.

Pick one and hold it. Don't mix sparse marketing and dense app density inside the same app.

---

## 5. Typography

### Choosing typefaces

- **System fonts are free, fast, and perfectly appropriate** for most apps. San Francisco on Apple, Roboto/Google Sans on Material, system UI stack on web.
- For brand distinctiveness: a display face (headings) + a neutral text face (body). Pair a **serif + sans-serif**, a **grotesk + humanist sans**, or one family with contrasting weights. Avoid two similar sans-serifs.
- For interfaces with lots of text: choose fonts with clear letterforms at small sizes, distinguishable i/l/1/o/0.

### Scale

- **Type scale ratios:** 1.125 (minor second, subtle), 1.2 (minor third, safe), 1.25 (major third), 1.333 (perfect fourth, bold), 1.5 (perfect fifth, dramatic). [Refactoring UI]
- **Apple default body:** 17 pt iOS, 13 pt macOS. [Apple HIG Typography]
- **Material 3 default body-large:** 16 px/24 px line-height. [Material 3]
- **Web default body:** 16 px. Never smaller than 14 px for body content.
- **Line height:** 1.4–1.6 for body; 1.1–1.25 for headings. [Refactoring UI]
- **Line length:** 50–75 characters per line for body prose.

### Weights

- Body prose: **regular (400)**.
- UI labels: regular or medium.
- Emphasis/links: semibold (600) or bolder.
- Headings: bold (700) or black (900) when distinctiveness is needed; regular + size for calmer designs.
- **Avoid thin weights** (100–200) for body text; brittle at low contrast.

### Hierarchy via type

- 3 sizes is usually enough (display / body / caption).
- Use weight and color for additional tiers before reaching for more sizes.
- Label + value pairs: value bolder than label. [Refactoring UI]
- Line-height shrinks as font size grows.

### Dynamic Type & scalability

- Apple: **Support Dynamic Type from xSmall to AX5.** Body scales 17 pt → up to 53 pt at AX5. Do not hard-code sizes in UI chrome. [Apple HIG Typography]
- Web: use `rem`/`em`, not `px`, for text. Let user font-size preferences work.
- WCAG 1.4.4: text must resize to 200 % without loss of content/function. [WCAG 2.2]
- WCAG 1.4.12: spacing overrides (line-height 1.5×, letter 0.12em, word 0.16em) must not break layout. [WCAG 2.2]

---

## 6. Color

### Build a full palette, not three swatches

A usable palette has [Refactoring UI]:

- **One or two primary brand colors** (hero, primary actions, branded surfaces).
- **A 9-step neutral ramp** (e.g., `50, 100, 200, … 900`). More than you think you need — you'll reach for `600` and `700` constantly for text-on-light and `100–200` for backgrounds.
- **Accent color(s)** for highlights, links, features.
- **Semantic colors:** success, warning, danger, info — each with at least a bg/border/text triple.

### Generating colors

- Don't adjust only lightness — real color ramps shift hue as they darken/lighten (Refactoring UI's key insight). A "darker blue" often needs a slight hue rotation toward purple or green to read as the same family across values.
- Work in perceptually uniform space (HSL / HSLuv / OKLCH) when tuning, then emit hex or display-p3.

### Contrast requirements (WCAG 2.2 AA)

- **Text ≥ 4.5:1** against background. [WCAG 1.4.3]
- **Large text (≥ 24 px regular or ≥ 19 px bold): 3:1.** [WCAG 1.4.3]
- **UI components and graphical objects: 3:1.** [WCAG 1.4.11]
- **Focus indicators (2.2): 3:1 against adjacent colors; minimum 2 px perimeter area.** [WCAG 2.4.11–2.4.13]
- Apple recommends aiming for **7:1 (AAA)** where possible. [Apple HIG Accessibility]

### Color must never be the only signal

- Pair color with text, icon, or pattern. [WCAG 1.4.1; Laws of UX §28]
- Red/green colorblindness is ~8 % of males — do not use only red/green to distinguish error/success.
- Test in grayscale.

### Dark mode

- Don't just invert. Darken by flipping the neutral ramp (lights become darks, darks become lights), but shift *saturation down and lightness up* for accents — they get overbearing on dark. [Refactoring UI; Material 3]
- System surfaces: Material M3 dark scheme uses progressively lighter surface tints for elevation (surface, surface-container, surface-container-high, surface-container-highest). [Material 3]
- Apple dark mode: use semantic colors (`secondaryLabel`, `systemBackground`) — they adapt. [Apple HIG Color]
- Pure black (`#000`) can look harsh on OLED; a near-black (`#121212` is Material's default) feels softer.
- Dark-mode text should generally not be pure white — use `~#EAEAEA` or similar to reduce glare.

### Specific system palettes to learn from

- **Material 3 tonal palette**: key color × 13 tonal stops (0, 10, 20, … 100). Surface and outline colors derive from the same tonal system. [Material 3]
- **Apple system colors**: `systemBlue, systemRed, …` — adapt to dark mode and high-contrast modes automatically. [Apple HIG Color]

---

## 7. Depth & materials

### Shadows

- Real shadows are soft, offset downward, grow with elevation.
- Typical scale (from Refactoring UI / Material 3):
  - Level 1: subtle, `0 1px 2px rgba(0,0,0,.05)`.
  - Level 2: cards on background, `0 4px 6px rgba(0,0,0,.08)`.
  - Level 3: popovers, `0 10px 15px rgba(0,0,0,.1)`.
  - Level 4: modals, `0 25px 50px rgba(0,0,0,.25)`.
- **Combine a sharp small shadow and a soft large shadow** for realism (two layers). [Refactoring UI]
- Material 3 deprecates heavy shadows in favor of **tonal elevation** (lighter surface color at higher elevation). Shadows still present but subtler. [Material 3]

### Borders / outlines

- Use 1 px subtle borders as an alternative to shadows for depth — calmer, cheaper, works well in light/dark.
- Border + slight tint can replace shadow on utilitarian UI.

### Apple Liquid Glass material (visionOS, modern iOS/macOS)

- Translucent, blurred backgrounds that inherit color from what's behind. [Apple HIG Materials]
- Use sparingly for floating chrome (toolbars, sheet headers, sidebars).
- **Respect "Reduce Transparency" accessibility setting** — fall back to solid surfaces. [WCAG + Apple HIG]

### Elevation hierarchy

- Each layer should have a purpose: content surface < raised content < floating chrome < modal.
- Don't stack depth for no reason — every shadow is a cognitive cue.

---

## 8. Motion

### Principles [Material 3 Motion; Apple HIG]

- **Motion should inform, not entertain.** Every animation answers a question: what is this, where did it come from, where is it going, what state is it in.
- **Fast is friendly.** 150–250 ms for UI transitions. 300–400 ms maximum for larger elements. [Doherty Threshold — Laws of UX §6]
- **Ease-out for entrances** (fast start, soft stop — feels responsive).
- **Ease-in for exits** (soft start, fast stop — feels like departure).
- **Ease-in-out for reshapes** (same element transforming position/size).

### When to animate

- State changes (checked/unchecked, open/closed, loading/loaded).
- Spatial transitions (this modal came from this button; this list item expanded to this detail view).
- Progress feedback (skeleton screens, pull-to-refresh).

### When NOT to animate

- Frequent, repetitive actions (typing, scrolling list population).
- Critical feedback (errors — show immediately, no gating animation).
- Anything the user is already waiting for.

### Accessibility

- **Respect `prefers-reduced-motion`.** Cut or reduce parallax, auto-play, spin-in; keep critical transitions as cross-fades. [WCAG 2.3.3; Apple HIG]
- No flashing > 3 times per second. [WCAG 2.3.1]

---

## 9. Live reference playbook

Principles don't tell you what "modern e-commerce" looks like in 2026. Galleries do. Always ground taste in current work.

| Task | First stop | Second stop |
|---|---|---|
| Marketing/landing page | Land-book (by industry) | Lapa Ninja |
| Full brand site | SiteInspire | Awwwards |
| Experimental/creative | Godly | Awwwards |
| Mobile app flow | Mobbin (by flow) | UI Sources (for motion) |
| Specific UI pattern | Pttrns | Mobbin |
| Category leader inspection | Direct visit to 3–5 category leaders | — |

### Query steps

1. Define **category + style + color** before opening any gallery.
2. Collect **8–15 references**.
3. Identify **the pattern** — what's shared across 70 % of them?
4. Identify **the outliers** worth stealing from.
5. Deliver **3 picks + reasoning** to the user, not a link dump.

See `normalized-sources/live-reference-libraries.md` for full documentation.

---

## 10. Quality gates (checklists)

### Accessibility — WCAG 2.2 AA non-negotiables

**Perceivable:**
- [ ] All non-text content has text alternative. [1.1.1]
- [ ] Content conveyed by more than color alone. [1.4.1]
- [ ] Text contrast ≥ 4.5:1 (or 3:1 for large text). [1.4.3]
- [ ] UI component and graphics contrast ≥ 3:1. [1.4.11]
- [ ] Text resizable to 200 % without loss. [1.4.4]
- [ ] Works with user-defined text spacing. [1.4.12]
- [ ] Content reflows at 320 CSS px without horizontal scroll. [1.4.10]

**Operable:**
- [ ] All functionality keyboard-accessible. [2.1.1]
- [ ] No keyboard trap. [2.1.2]
- [ ] Focus visible, contrast ≥ 3:1, min 2 px perimeter. [2.4.7; 2.4.11; 2.4.13]
- [ ] Touch targets ≥ 24×24 CSS px (prefer 44×44). [2.5.8]
- [ ] Drag operations have single-pointer alternative. [2.5.7]
- [ ] Pointer gestures have single-pointer alternative. [2.5.1]
- [ ] Motion-triggered actions have alternative. [2.5.4]
- [ ] No > 3 flashes per second. [2.3.1]

**Understandable:**
- [ ] Language declared. [3.1.1]
- [ ] Consistent navigation. [3.2.3]
- [ ] Consistent identification. [3.2.4]
- [ ] Form fields labeled. [3.3.2]
- [ ] Errors identified in text. [3.3.1]
- [ ] Accessible authentication alternative exists. [3.3.8]
- [ ] No redundant-entry requirement for the same info. [3.3.7]

**Robust:**
- [ ] Name/role/value programmatic for all controls. [4.1.2]
- [ ] Status messages announced. [4.1.3]

### Finishing-touches checklist (Refactoring UI)

- [ ] Typography: one body size, coherent 3-step scale, weights not sizes for sub-hierarchy.
- [ ] Color: full neutral ramp, accents not overused, semantic set defined.
- [ ] Spacing: on the scale, consistent within sections.
- [ ] Alignment: labels, inputs, text rails; no accidental 1-px misalignments.
- [ ] Empty states designed (not "no data").
- [ ] Loading states designed (skeleton or spinner with context).
- [ ] Error states designed (message + how to fix).
- [ ] Hover / focus / active / disabled states exist for every interactive element.
- [ ] Dark mode, if supported, reviewed.
- [ ] Content tested at longest realistic length (names, prices, translations).
- [ ] Content tested at *zero* length (empty name, empty cart, zero results).
- [ ] Tested on smallest target screen (320 px).

### Platform conventions

- **iOS:** tab bar bottom, nav title top, swipe back from left edge, 44×44 pt targets, SF Symbols, respect safe areas. [Apple HIG]
- **Android/Material:** FAB bottom-right for primary creation, material components, elevation by tonal color, 48 dp targets. [Material 3]
- **Web:** underlined links (or obvious color + weight change), logo top-left links home, search top-right, primary CTA above fold. [Jakob's Law]
- **Desktop (macOS/Windows):** menu bar conventions, keyboard shortcuts discoverable, hover affordances, right-click context menus where users expect them.

---

## 11. Psychological laws — applied

From Laws of UX. Grouped by the decision they inform.

### Reducing cognitive load

- **Hick's Law** — fewer choices = faster decisions. Progressive disclosure. Recommended option. [§10]
- **Miller's Law** — working memory ~7±2 items. Chunk. Don't use 7 as a hard cap. [§18]
- **Chunking** — phone numbers, card numbers, long forms. [§3]
- **Cognitive Load** — remove decoration that doesn't convey information. [§5]
- **Recognition over recall** — show, don't make them remember. [§5]

### Directing attention

- **Von Restorff** — one thing different among many is remembered. One primary button, not five. [§28]
- **Serial Position** — first and last items remembered best. Critical nav at edges. [§26]
- **Prägnanz** — simpler shapes are perceived first. Reduce to essentials. [§14]
- **Selective Attention / Banner Blindness** — regions that look like ads get tuned out. If everything shouts, nothing is heard. [§25]

### Motivation & completion

- **Goal-Gradient** — users accelerate near the goal. Show progress. Start with pre-filled first step. [§9]
- **Zeigarnik Effect** — unfinished tasks are remembered. Progress bars motivate; "2 steps left" is powerful. [§30]
- **Peak-End Rule** — experience judged by peak moment and ending. Invest in moments of success and in graceful endings. Reduce painful peaks (errors, cancel flows, failures). [§23]
- **Flow** — minimize interruptions during focused work. Match challenge to skill. [§8]

### Speed & responsiveness

- **Doherty Threshold** — < 400 ms keeps user engaged. Skeleton screens for real work. [§6]
- **Fitts's Law** — target acquisition scales with size / distance. Primary actions big, near focus. Corners are effectively infinite. [§7]
- **Parkinson's Law** — work expands to fill available time. Remove friction; short paths encourage action. [§22]

### Conventions & expectations

- **Jakob's Law** — users prefer your site to work like others they know. [§11]
- **Mental Model** — match user's model, not the system's architecture. Test with domain-naïve users. [§17]
- **Postel's Law** — be liberal in input, conservative in output. Accept phone numbers any format, emails trimmed, dates flexible. [§24]

### Perceived quality

- **Aesthetic-Usability Effect** — pretty things are perceived as more usable, even when they're not. Danger: aesthetics mask real problems in usability tests. Always test flow, not finish. [§1]

### Complexity management

- **Tesler's Law** — complexity can only be shifted, not eliminated. Hide it in defaults; expose to experts. [§27]
- **Occam's Razor** — simplest design that solves the problem wins. Every element must justify itself. [§19]
- **Pareto** — 80 % of value from 20 % of features. Design those hardest. [§21]
- **Paradox of Active User** — users don't read docs. In-context hints > up-front tutorials. Error messages teach. [§20]

---

## 12. Anti-patterns — recurring mistakes

Direct from Refactoring UI and cross-source consensus.

### Hierarchy
- Using font size as the only lever. (Use weight, color, isolation, position.)
- Centering everything — makes nothing dominant.
- Five primary buttons. Pick one.
- Equal-weight navigation — user can't find "home".

### Layout
- Arbitrary pixel spacing (`padding: 13px;`).
- Mixing sparse and dense in the same flow.
- Full-width text on wide desktops — unreadable at 1400 px.
- Fixed pixel layouts that break at real device sizes.
- Cards inside cards inside cards — nested containers add no grouping value.

### Typography
- Body text < 14 px.
- Thin weights for body copy.
- Low contrast grey-on-white text (`#aaa on #fff` = 2.5:1 = fails).
- Two similar sans-serifs paired.
- Justified text without hyphenation → rivers.
- All-caps long strings (>3 words) — unreadable.

### Color
- Only 3 shades of grey. Build the full 9-step ramp.
- Saturated colors at equal brightness — they vibrate and compete.
- Pure black (`#000`) text on pure white is surprisingly harsh; a near-black is softer.
- Low-contrast placeholders mistaken for filled values. [WCAG]
- Dark mode is not just inverted light mode.
- Semantic color confusion (red for both "danger" and "selected").

### Depth
- One flat shadow everywhere = no hierarchy.
- Sharp, offset shadows look fake. Two-layer (tight + soft) feels real.
- Over-elevating — everything floats, nothing is background.

### Motion
- Long animations (>400 ms) on frequent interactions = laggy feel.
- Bouncy easing on serious UI — feels infantile on financial, medical, enterprise.
- Animating the primary waiting state rather than showing real progress.
- Auto-playing video / parallax without `prefers-reduced-motion`.

### Forms
- Placeholder text used as label. Fails recall and accessibility.
- No inline validation — errors only on submit.
- Required vs. optional not marked.
- Tiny submit buttons at the bottom of long forms.
- Forcing input format ("no dashes in credit-card number") instead of accepting any. [Postel's Law]

### Accessibility
- Color as only signal.
- Icon-only buttons with no accessible name.
- Focus ring removed "for aesthetics".
- Modals trapping focus incorrectly (or not at all).
- Auto-playing sound.
- CAPTCHAs with no alternative.
- Click/tap targets < 24 px.

### Content
- Lorem ipsum shipped to production.
- Copy written last, made to fit. Write copy first, design around it.
- Empty state = "no data". Empty state is a teaching moment.

---

## 13. Category tailoring

Design meets audience. A few dominant categories and what "good" looks like in each:

### Public sector / government / healthcare
- **Audience:** full public, including users with low literacy, older users, non-native language, limited devices.
- **Priorities:** absolute clarity, WCAG AA minimum (aim for AAA), plain language, task completion over brand expression, works on slow networks and old browsers.
- **Reference:** Gov.uk, USWDS, 18F. Minimal brand, maximum legibility.
- **Common mistakes:** marketing-style hero imagery on a permit portal; forms that break at AX3 text size.

### Enterprise B2B / admin / analytics
- **Audience:** domain experts using tools daily.
- **Priorities:** density, keyboard speed, configurability, predictability, power.
- **Reference:** Linear, Datadog, Stripe Dashboard, Retool.
- **Common mistakes:** consumer-style whitespace wasting info density; animations slowing repeat workflows; hiding bulk operations.

### Consumer SaaS
- **Audience:** mixed skill, self-serve onboarding.
- **Priorities:** clear primary action, easy first success, growing complexity over time, friendly but professional tone.
- **Reference:** Notion, Figma, Slack, Superhuman.
- **Common mistakes:** too many onboarding screens; empty states that don't teach; upgrade nags overriding core flow.

### E-commerce
- **Audience:** buyers, browsing or task-driven.
- **Priorities:** product photography quality, quick filter/search, trust signals, frictionless checkout.
- **Reference:** Shopify stores (good and bad), Amazon, niche D2C (Everlane, Allbirds, Kith).
- **Common mistakes:** slow loads; forced account creation; hidden shipping cost; unclear size/return info.

### Local business (restaurants, clinics, shops, services)
- **Audience:** people in the neighborhood, often on phones.
- **Priorities:** address, hours, phone, menu/offering, booking. In that order.
- **Reference:** look at the best local sites in the same city — they know the vibe.
- **Common mistakes:** trying to look like a tech startup; giant hero video burying the phone number.

### Non-profit / cause
- **Audience:** supporters, donors, beneficiaries.
- **Priorities:** mission clarity, donation path, transparency, emotional but not manipulative.
- **Reference:** charity: water, RED, Wikipedia.
- **Common mistakes:** stock photography, corporate jargon, hiding how donations are used.

### Editorial / publication / blog
- **Audience:** readers.
- **Priorities:** reading experience, typography, navigation between pieces.
- **Reference:** The New York Times, The New Yorker, The Verge, personal sites with care (Maggie Appleton, Dan Luu).
- **Common mistakes:** ads > content; sticky headers eating viewport; autoplay video.

### Creative / agency / portfolio
- **Audience:** potential clients, peers.
- **Priorities:** distinctive voice, showcase of work, memorable without being inscrutable.
- **Reference:** Awwwards, Godly.
- **Common mistakes:** 800 ms page transitions; no contact info; inscrutable navigation that *is* the brand but loses clients.

---

## 14. Data visualization & dashboards

Synthesized from IBM Carbon, Material Design, Apple HIG (Charts + Charting Data), and Edward Tufte. Where sources conflict, the conflict is called out.

### 14.1 First question — does this need a chart?

Apple's framing is the cleanest starting point. Use a chart when the goal is to **analyze**, **compare across categories/time**, or **visualize a changing state**. If the goal is to *present* values for lookup, use a **sortable/searchable table** instead. Tables outperform charts at precise recovery; charts outperform tables at pattern detection.

### 14.2 Choose the chart by purpose, not familiarity

Cross-source taxonomy. All three systems converge on purpose-first selection.

| Purpose | Recommended | Notes |
|---|---|---|
| **Change over time** | Line (primary), bar (≤ 4 series, discrete), stacked bar, area, candlestick | Line handles any number of series; bar is best for ≤ 4 discrete; stacked area for part-to-whole over time. |
| **Category comparison** | Bar, grouped bar, bullet | Bar + common baseline reads fastest. Length > area > angle for precision. |
| **Ranking** | Ordered bar, ordered column | Sort the bars — don't force the reader to do it. |
| **Part-to-whole** | Stacked bar, donut, treemap, sunburst | Bars beat pies when comparing across time or > 5 categories. |
| **Correlation** | Scatter, bubble, column+line, heat map | Scatter for 2 quantitative vars; heat map for matrix. |
| **Distribution** | Histogram, box plot, violin, density | Box/violin when comparing distributions across categories. |
| **Flow / relationship** | Sankey, chord, network, tree | Exotic — cost a lot of screen. Use only when the flow itself is the story. |

**Pie-chart rule** (all three systems agree): avoid pies with > 5 slices; never use multiple pies to compare across time; pie arc comparisons are measurably slower than bar length comparisons.

### 14.3 Time-series lookup (Material's decision table)

| Chart | When | Baseline | Series count | Data type |
|---|---|---|---|---|
| **Line** | Minor variations, trend | Any value | Any (works with 8+) | Continuous |
| **Bar** | Larger variations, ranking, part-to-whole | **Zero** | ≤ 4 | Discrete / categorical |
| **Area** | Relationships, part-to-whole | **Zero** if multi-series | ≤ 8 | Continuous |

Stacked area only. **Overlapped area with > 2 series is discouraged** — data gets obscured.

### 14.4 Axes & baselines — the non-negotiables

**Zero baseline:**
- **Bar, column, area, stacked-bar, donut:** always start at zero. Truncating distorts comparison.
- **Line and scatter:** zero is optional. Crop Y when the *interesting variation* lives far from zero (resting vs. active heart rate, stock-price moves).

**Axis breaks:** if you must skip a range, use Carbon's **sinusoidal break line** (not a straight slash). Minimum 16 px width on X, fixed 16 px on Y. Data crossing the broken region: 0.5 px stroke, no point dots.

**Tick values:** use familiar sequences (0, 5, 10, 25, 50, 100). Odd increments (1, 6, 11) force mental math.

**Tick density:** enough to read scale, not enough to crowd plot. Interactive charts can use fewer lines because hover recovers values.

**Labels:**
- **Horizontal always.** If bars crowd, rotate the **bars** (horizontal bar chart) not the labels.
- Carbon: **semibold** the label at a day/month/year boundary to landmark the transition.
- Direct-label data on the chart when possible — skip the legend.

**Missing data:** never interpolate. Mark the gap with texture/pattern and label both ends of the missing range.

### 14.5 Color for data — four roles

From Carbon + Material:

1. **Distinguish categories** (qualitative) — categorical palette.
2. **Represent quantity** (ordered) — sequential monochromatic ramp, darkest = largest (light theme).
3. **Highlight specific data** — saturated accent on neutral bg.
4. **Express meaning** — red = danger, green = success, reinforced with icon/shape/label.

**Carbon's categorical 14-color sequence (light theme), apply in order:**

```
Purple 70  #6929c4    Cyan 50    #1192e8    Teal 70    #005d5d
Magenta 70 #9f1853    Red 50     #fa4d56    Red 90     #570408
Green 60   #198038    Blue 80    #002d9c    Magenta 50 #ee538b
Yellow 50  #b28600    Teal 50    #009d9a    Cyan 90    #012749
Orange 70  #8a3800    Purple 50  #a56eff
```

Palette curated for neighbor contrast — **don't reorder**. When exact count is known, prefer a shorter single-color-group ramp.

**Rule of 5–7:** when the number of categories exceeds 5–7, the categorical palette becomes indistinguishable. Collapse the long tail to "Other" or split into small multiples.

**Sequential ramps** (Carbon): Blue / Purple / Cyan / Teal each in 10 steps from 10 to 100. Use for heat maps, choropleths, magnitude.

**Diverging ramps:**
- **Red ↔ Cyan** for temperature-like (hot/cold).
- **Purple ↔ Teal** for neutral (performance, rate of change).
- Both: 8 steps per side meeting at a pale midpoint.

**Alert palette** (Carbon):
```
Red 60    #da1e28    danger / error
Orange 40 #ff832b    serious warning
Yellow 30 #f1c21b    regular warning
Green 60  #198038    normal / success
```

**Never rely on color alone** (WCAG 1.4.1; Apple; Carbon; Material all agree). Reinforce with:
- Shape (Apple Health: circle = systolic, diamond = diastolic)
- Texture or pattern (hatch, dots, diagonals)
- Direct label
- Icon

**Gradients:** OK for highlighting extremes in a single category only. Never use a gradient in place of a sequential palette.

**Dark mode:** sequential ramps invert — lightest = largest. Diverging ramps are theme-agnostic.

### 14.6 Typography for charts

Material's scale (reference, not mandate):

| Role | Size | Weight |
|---|---|---|
| Chart title | 18 pt | Regular |
| Chart subtitle | 14 pt | Regular |
| Data label (prominent KPI) | 22 pt | Regular |
| Sub-label | 14 pt | Regular |
| Axis label | 12 pt | Regular |
| Legend label | 12 pt | Regular |

Hierarchy: title highest, axis + legend lowest. Bold **one or two key elements** only — bold everywhere destroys hierarchy. Use **tabular/lining numerals** (`font-variant-numeric: tabular-nums`) for axis tick values and data labels so columns align.

### 14.7 Legends — last resort, not first

- **Prefer direct labels on the chart.** Legends add an extra eye-trip the reader pays on every lookup.
- If legend is necessary:
  - **Desktop:** below chart (default) or top. Left when alignment matters. Right when space is plentiful.
  - **Mobile:** above chart — stays visible while the reader's finger is on the plot.
  - **Geospatial:** overlay at 80 % bg opacity.
- **Interactions (Carbon):** hover drops other categories to 30 % opacity; click isolates the series (checkmark appears on the active entry).
- **Overflow:** 2 lines default, "View more" expands to max 30 % of chart height, then scroll.
- Single-category chart — no legend.

### 14.8 Chart accessibility — WCAG + Apple + Carbon

| Requirement | Source | Move |
|---|---|---|
| Text contrast | WCAG 1.4.3 | ≥ 4.5 : 1 body, ≥ 3 : 1 large |
| Graphical contrast | WCAG 1.4.11 | ≥ 3 : 1 for marks, axes, grid ≥ plot bg |
| Color not sole signal | WCAG 1.4.1 | Shape + texture + direct label |
| Keyboard access | WCAG 2.1.1 | Every data point, every legend toggle focusable |
| Alt description | WCAG 1.1.1 + Apple | Plain-language summary of main insight above the chart |
| Screen reader data | Apple Audio Graphs | Audible tones map to values + text overview of type/axes/bounds |
| Avoid redundant labels | Apple | Hide visible tick labels from VoiceOver — Audio Graphs + mark labels cover it |
| Touch target | WCAG 2.5.8 | Expand hit area to plot region for scrubbing (individual marks too small) |
| Below-threshold slices | Carbon | < 1° circular slice: omit render, expose via data table fallback |

**Accessibility-label content** (Apple):
- Include **context** (date, location), not just value.
- No subjective words ("rapidly", "gradually") — give the numbers, let the user decide.
- Spell out units — "60 minutes" not "60m"; "June 6" not "6/6".
- Name what the series represents, not its visual ("Systolic pressure" not "red line").
- Consistent axis naming order throughout the app.

**Data table fallback:** every chart should have a toggleable data-table view. Required when slices/marks fall below rendering threshold; valuable for all readers regardless of ability.

### 14.9 Interaction patterns

From Material + Apple:

- **Progressive disclosure.** Desktop: hover tooltip. Mobile: touch-and-hold tooltip positioned **above the finger** (finger doesn't occlude the value).
- **Don't hide critical info behind interaction.** The un-interacted view must answer the primary question; interaction reveals *detail*. Apple Stocks: line chart communicates performance without any input.
- **Zoom:** desktop click-drag or scroll; mobile pinch. If zoom isn't the primary action, use click-drag desktop / double-tap mobile.
- **Pan:** constrain to meaningful axes (time-only data → X-axis pan only).
- **Scrubbing:** expand touch target to full plot area; report values as the finger moves.
- **Motion:** purposeful, not decorative. Animate between aggregations (day → week) — omit data outside the new range during transition. Respect `prefers-reduced-motion`.

### 14.10 Dashboards — match layout to purpose

Carbon and Material distinguish similar dashboard archetypes.

| Type | Purpose | Shape |
|---|---|---|
| **Analytics / exploration** | Discover trends, answer "why" and "what-if" | Complex charts, filters, drill-down, linked charts (filtering one mirrors across related). |
| **Operations** | Monitor real-time state; answer a fixed set of questions | Simple charts, status indicators, threshold alerts. |
| **Presentation / KPI** | Curated snapshot, executive summary | Few large numbers with dynamic headlines, one or two hero charts. |

**Common rules (all types):**
- **Hierarchy by layout.** Most important info = highest contrast + largest area. Follow the **F-pattern** (top-left → right → down).
- **Establish a single focal point** (color, position, size, visual weight).
- **Strip metrics that don't answer a question** the dashboard is for.
- **Consistent color mapping.** A metric keeps its color everywhere it appears.
- **Consistent layout, spacing, legend position** across sibling charts — inconsistency signals "different thing".
- **Never switch units mid-dashboard** (imperial ↔ metric, USD ↔ EUR).
- **White space separates.** Carbon cites Human Factors International: ~20 % comprehension lift from adequate whitespace.
- **Linked interactions** (exploration dashboards): filter/zoom on one chart mirrors across the related group.

### 14.11 Tufte — the foundational layer

Tufte's principles predate all three design systems and sit underneath them. Apply as governing lens when the systems leave freedom.

**Data-Ink Ratio** = Data-Ink ÷ Total Ink. Goal: approach 1.0.
- Erase non-data-ink (borders, heavy grids, redundant labels).
- Erase redundant data-ink.
- Revise and edit.

**Chartjunk** — three categories:
1. **Moiré vibration** (hatching, stripes that shimmer). Use solids.
2. **The grid** (heavy gridlines dominating the data). Make it thin and light or remove.
3. **The duck** (decoration that's the whole graphic — 3D bars, drop shadows, gradient fills, illustrated columns).

**Lie Factor** = size of effect in graphic ÷ size of effect in data. Target 1.0; acceptable 0.95–1.05. Common violators: truncated Y (on comparison charts), 2D scaling of a 1D value (both width and height → area scales quadratically), dual axes with misaligned zeros, unlabeled log scales presented as linear.

**Data density.** Most charts use far less than the medium allows. A dense sparkline beats a chart of 4 quarterly averages.

**Small multiples.** Repeat the same chart type/scale/axes across panels for easy comparison. Reader learns the chart once, compares patterns across many. Identical scales mandatory.

**Sparklines** (Tufte, *Beautiful Evidence* 2006). Word-sized inline trend graphics. No axes, no labels — just shape. For dense editorial context ("Q3 revenue ▁▃▅▇▆ up 4 %").

**Graphical integrity — six rules:**
1. Visual representation proportional to quantity.
2. Clear, detailed, thorough labeling.
3. Show data variation, not design variation.
4. Use standardized / inflation-adjusted units.
5. Number of visual dimensions ≤ dimensions in data.
6. Don't quote data out of context.

**Where Tufte diverges from modern systems:**
- Tufte is skeptical of interactive dashboards as substitutes for well-designed static graphics. Modern systems (Material, Apple) embrace reveal-on-demand.
- Tufte favors print-style density. Carbon/Material/Apple favor lighter density with hover detail.
- Use Tufte when printing, embedding, or building a single authoritative chart. Use Carbon/Material for interactive dashboards at scale. Both schools agree on integrity and chartjunk.

### 14.12 Data-viz anti-patterns (consolidated)

- 3D bars/pies/lines. Volume doesn't carry data.
- Truncated Y axis on bar/area/comparison charts.
- Dual-axis charts with misaligned zeros.
- Pie charts with > 5 slices; multiple pies to show change over time.
- Overlapped area with > 2 series.
- Color as sole encoding for category.
- Legend required to read what a direct label could say.
- Moiré patterns, heavy gridlines, dominant borders.
- Labels stacked vertically or rotated past ~30°.
- Key data hidden behind hover — visible chart can't answer the primary question.
- Inconsistent color/units/legend position across sibling charts.
- Animated transitions for routine reads (typing, list population).
- Interpolation across gaps without marking the gap.
- Subjective language in accessibility labels ("rapidly increased").

---

## 15. Motion & animation — depth beyond Apple/Material basics

§8 covers the principles. This section covers **choreography, physics, and the web primitives** — the gap that Material's "standard/decelerate/accelerate/sharp" curves and Apple's "fast and subtle" guidance leave open. Full detail: `normalized-sources/motion-choreography.md`. Sources: Emil Kowalski, `fliptheweb/motion-ui-design`, uxderrick's web-animation guide, Motion (motion.dev), MDN.

### 15.1 Curated easing presets (uxderrick — cross-checked against Material)

Three curves cover ~90 % of UI work. Commit to them; avoid the default `ease`.

```
cubic-bezier(0.34, 1.56, 0.64, 1)   — Spring-like (overshoot). Button hover, cards, micro-interactions.
cubic-bezier(0.16, 1, 0.3, 1)       — Smooth ease-out (no bounce). Modals, drawers, page transitions.
cubic-bezier(0.4, 0, 0.2, 1)        — Fast-response (snappy). Toggles, tooltips, icon state, button press.
```

Timing table (compatible with §3 values):

| Element | Duration | Curve |
|---|---|---|
| Button hover | 200 ms | spring-like |
| Button press | 80–100 ms | fast-response |
| Modal entrance | 250–300 ms | smooth ease-out |
| Tooltip appear | 100 ms | fast-response |
| Page transition | 300 ms | smooth ease-out |
| Dropdown menu | 200 ms | smooth ease-out |
| Success feedback | 600 ms | spring-like (exception — celebration earns extra time) |

### 15.2 Spring physics (motion.dev)

Tweens cover most UI. Springs replace tweens when motion is gesture-driven, interruptible, or responsive to current velocity (drag-to-dismiss, pull-to-refresh, reshape animations).

Parameters: `stiffness` (1 default; higher = snappier), `damping` (10 default; 0 = infinite oscillation), `mass` (1 default), `bounce` (0.25 default; 0–1), `velocity` (pass through from gesture), `restSpeed` / `restDelta` (stop thresholds).

Bounce presets:
- `0` — critically damped. Notifications, message slides.
- `0.2–0.3` — snappy default. Buttons, cards.
- `0.4–0.6` — playful. Emoji reactions, onboarding.
- `0.8+` — bouncy. Celebration moments only.

**Prefer tween for** predictable duration, deterministic end-state timing, serious/utilitarian UI (financial, medical, enterprise). **Prefer spring for** gesture handoff, layout reshaping (FLIP), natural-feeling decorative motion.

### 15.3 Web animation primitives

**View Transitions API** — `document.startViewTransition(callback)`. Builds the before/after layers (`::view-transition-old(name)` + `::view-transition-new(name)`) automatically. Name elements with `view-transition-name` to animate them independently.

Browser support (April 2026): SPA (Chrome 111+, Edge 111+, Opera 97+, Safari partial). MPA (Chrome 126+, Edge 126+). Ship as progressive enhancement with feature detect.

**`@starting-style` + `transition-behavior: allow-discrete`** — lets CSS transitions run on first render and across `display: none ↔ visible`. The modern way to animate popover / tooltip entrance without JS.

**`clip-path` animation** (Kowalski) — hardware-accelerated, no layout thrash, no DOM additions. Canonical uses: image reveals (`inset(0 0 100% 0)` → `inset(0 0 0 0)`), before/after sliders, tab indicator movement (single element, animate `inset`), scroll-triggered reveals. Recommended easing for reveals: `cubic-bezier(0.77, 0, 0.175, 1)`.

### 15.4 Choreography

- **Stagger** — 30–80 ms per child, cap cumulative delay at 400 ms.
- **Asymmetric parent/child** — container lands first (ease-out), inner content settles after (delayed by 100–200 ms, shorter duration).
- **Continuity of movement** — element exiting one screen and entering another should move along a continuous trajectory. View Transitions API enforces this via shared `view-transition-name`.
- **Origin awareness** — menus open from the clicked trigger, not from the viewport center. `transform-origin` or measured coordinates.

### 15.5 Performance discipline

- **Only `transform` and `opacity` compose on the GPU** without layout/paint. Animating `width`, `height`, `top`, `left`, `padding`, `margin` drops below 60 fps.
- **60 fps target** (16.7 ms/frame). Test on mid-range Android in DevTools Performance tab.
- `contain: layout style paint;` isolates repaint work.
- `will-change: transform, opacity;` — use sparingly, reset to `auto` after.
- **CSS transitions interrupt better than `@keyframes`.** The browser re-interpolates from the current computed value; keyframes restart.

### 15.6 Reduced-motion mandate

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

Alternatives for reduced-motion users:
- Slide/scale → cross-fade.
- Parallax → disabled entirely.
- Auto-rotating carousel → user-driven.
- Essential feedback (focus ring, error shake) kept; decorative disabled.

### 15.7 Motion anti-patterns (cross-source consensus)

- Animating layout properties (`height`, `top`) instead of transforms.
- Ignoring `prefers-reduced-motion`.
- Over-animating — every state change transitions → motion fatigue.
- Bouncy easing on serious UI (financial, medical, enterprise).
- Auto-play hero video without captions, pause, or reduced-motion gate.
- Stagger on every re-render (cute first time, laggy tenth time).
- Inconsistent timing — three buttons, three durations.
- Parallax that doesn't disable for reduced motion.
- `@keyframes` where a CSS transition would interrupt cleanly.

---

## 16. Data-viz depth — statistical honesty

§14 covers Tufte, Carbon, Apple, Material. This section adds **the statistical-honesty layer** — Cairo's framework and Datawrapper's applied craft. Full detail: `normalized-sources/data-viz-honesty.md`.

### 16.1 Cairo's five qualities (The Truthful Art)

A chart is judged on five axes **simultaneously**. Failing any one is a failure.

| Quality | Question | Fail mode |
|---|---|---|
| **Truthful** | Does it represent data honestly, in context? | Axis tricks, cherry-picked range, missing denominator |
| **Functional** | Does its form suit the task? | Pie with 12 slices, 3D for quantity |
| **Beautiful** | Pleasing without decoration distorting meaning? | Chartjunk, low contrast |
| **Insightful** | Does it reveal something a table would hide? | Obvious restatement of a small table |
| **Enlightening** | Does it change how the reader thinks? | Trivial, inconsequential |

**Priority on conflict:** truthful > functional > insightful > enlightening > beautiful.

**Statistical-honesty stance:**
- Show distribution, not just the mean. Averages hide variance.
- Show uncertainty. Every estimate has a range — error bars, confidence bands, quantile dotplots.
- Denominators matter more than numerators. "Cases up 50 %" is noise without base rate + population.
- Beware confirmation bias. Charts that confirm are the ones to question hardest.

### 16.2 Misleading-chart inventory (field critique list)

**Axis manipulation**
- Truncated Y on bar/area/stacked — 2 % difference looks like 200 %. Fix: zero baseline; if range is tight, use dot plot or line.
- Missing axis units → reader assumes counts when data is rates.
- Dual Y-axes with misaligned zeros → fake correlation. Prefer two stacked charts or normalize to index (base 100).
- Log scale unlabeled → order-of-magnitude differences hidden. Always annotate "log scale" + "each gridline = 10×".
- Inverted Y without annotation — good looks bad. Add "Lower is better" if intentional.

**Time / range cherry-picking**
- Start date picked at convenient local minimum.
- End date picked at last point that fits the narrative.
- Inconsistent interval (weekly + monthly mixed).
- Ignoring seasonality — "up 40 % since spring" when every summer rises.

**Denominator failures**
- Raw counts across unequal populations → big states look dominant.
- Totals instead of per-capita in international comparison.
- Missing base rate — "deaths up 30 %" without per-100k or prior year.
- Cross-country dollars without PPP or inflation adjustment.

**Map-specific**
- Choropleth with raw count (population-adjusted required).
- Mercator for global quantity (equal-area projections: Equal Earth, Robinson).
- Arbitrary class breaks (quintile vs equal-interval changes the story). Disclose method.
- 3 bins too few; 10 bins too many. Working range 5–7.

**Aggregation failures**
- Simpson's paradox — aggregate trend opposite of subgroups. Show both.
- Mean without distribution.
- Outlier-dominated mean → use median or trimmed mean.

### 16.3 Log scales (Datawrapper)

**Use when:** relative change matters more than absolute; data spans many orders of magnitude; early + late trends both matter.

**Don't use when:** non-technical audience and the article isn't about rate; values close in magnitude; negative values present.

**Honesty rules:** label "log scale" on the axis always; annotate ("each gridline = 10×"); pair with linear version for mixed audiences; tick at familiar magnitudes (1, 10, 100, 1k, 10k).

### 16.4 Color scales (Datawrapper extends §14.5)

Three scale types: **categorical** (equal-lightness distinct hues for unordered categories), **sequential** (light→dark for ordered numeric; two hues beats single-hue for mid-value distinctness), **diverging** (hue A dark ← pale mid → hue B dark for signed data with meaningful midpoint).

**Non-negotiables:**
- Get it right in black and white — lightness carries the information.
- Limit categorical to 3–4 hues. Cap beyond that kills distinctness.
- De-emphasize "no data" / "other" with grey — never a competing hue.
- Direct-label on the chart when possible — eliminates the legend cross-reference cost.
- Blue is the safest hue for colorblindness; blue + orange and blue + red are the most accessible categorical pairs.
- Pair color with shape, pattern, or line-style. Test with Coblis / Color Oracle.

### 16.5 Uncertainty visualization

Chart claiming a number without showing uncertainty is overclaiming.

| Pattern | Use for |
|---|---|
| Error bars | Polling, survey, lab measurement |
| Confidence bands | Forecasts, trends, regression |
| Gradient / blur edge | Hurricane forecast cones, projections |
| Hypothetical Outcome Plot (HOP) | Audiences bad at error bars — animate samples |
| Dot distribution | Polling, election forecasts (each dot = 1 sample) |
| Quantile dot plot | Everyday decision audiences — 20 dots = 5 % each |

**Rule:** if your model outputs a distribution, your chart should too.

### 16.6 Annotation — carry the argument

Great charts are **self-contained news items**, not illustrations.

- **Headline title states the finding**, not the topic. "Tourism collapsed during WW2 and took 12 years to recover" beats "New Zealand tourism 1921–1984".
- **Subtitle specifies what/where/when/units** the title doesn't carry.
- **In-chart annotation marks 1–3 most important points** — peak, trough, trend break, intervention.
- **Source + retrieval date + methodology link** at the bottom. Always.
- **De-emphasize secondary data** to 30 % opacity; saturated primary only.

### 16.7 Chart critique checklist (field-usable)

Run before publishing:

- [ ] Y zero where required (bar/area/stacked)
- [ ] Log scale labeled
- [ ] Cropped time range justified in caption
- [ ] Denominator appropriate (counts vs rates)
- [ ] Units stated; axis labeled
- [ ] Uncertainty shown where it exists
- [ ] Source + date + methodology linked
- [ ] Chart type matches question (trend/compare/part/correlate/distribute/locate)
- [ ] Series count within chart's capacity (see §14.3)
- [ ] Direct labels where legend would cost cross-reference
- [ ] No chartjunk (3D, moiré, drop shadows, decorative icons)
- [ ] Title states the finding
- [ ] Works in greyscale + non-color encoding present
- [ ] Accessible description + data-table fallback

---

## 17. UX research methodology

Previously flagged as out-of-scope. Shipping products without grounded research produces design against imagined users. Full detail: `normalized-sources/ux-research.md`. Sources: Nielsen Norman Group, GOV.UK Service Manual.

### 17.1 NN/g's three-dimensional method taxonomy

Every UX research method maps onto:

| Axis | Poles | Distinguishes |
|---|---|---|
| **Attitudinal ↔ Behavioral** | What people say vs what they do | Stated belief vs actual behavior |
| **Qualitative ↔ Quantitative** | Why / how-to-fix vs how-many / how-much | Causes vs effects |
| **Context of use** | Natural · scripted · decontextualized · no product use | Closeness to real-world |

**Gap-check:** if all your evidence is attitudinal (surveys + interviews), you have no behavioral data. If all quantitative (analytics), you have no cause. Triangulate.

### 17.2 Method × project phase

| Phase | Type | Methods |
|---|---|---|
| **Discover / Strategize** | Generative | Field studies, interviews, diary studies, participatory design |
| **Design / Explore** | Formative | Card sort, tree test, usability testing, remote moderated, journey mapping |
| **Launch / Test** | Formative → summative | Moderated + unmoderated usability, benchmark, accessibility eval |
| **Assess / Listen** | Summative | Analytics, surveys, A/B, search-log analysis, feedback channels |

**Highest-leverage single activity (NN/g):** qualitative think-aloud usability testing of an existing system.

### 17.3 The 5-user rule (Nielsen & Landauer)

```
P(n) = 1 − (1 − L)^n     L ≈ 0.31
```

| Users | Problems found |
|---|---|
| 1 | 31 % |
| 3 | 67 % |
| 5 | 84 % |
| 10 | 97 % |
| 15 | 99.5 % |

**Prefer 3 rounds of 5** over 1 round of 15. Each round reshapes the design; new problems surface.

**When to test more:**
- Multiple distinct user groups → 3–4 per group for 2 audiences; 3 per group for 3+.
- Quantitative benchmarking → ≥ 20 per condition.
- A/B statistical significance → hundreds to thousands.

**Not a representation rule.** If your 5 users are all digitally fluent + able-bodied, your findings cover only that population. Recruit per user group.

### 17.4 Usability testing — operational

**Task design**
- Outcome-specified, not step-specified. "Find an apartment under $2000 near transit" beats "Click Search, enter 2000…".
- First-person context. Realistic constraints.
- No UI vocabulary. Users find "button" / "menu" / "filter" themselves.

**Think-aloud** — concurrent verbalization during task. NN/g: "#1 usability tool." Strengths: reveals misconceptions, low-cost, tolerates imperfect facilitation. Limitations: unnatural, social-desirability editing, facilitator probes can leak.

**Severity rating (Nielsen 0–4):** 0 not a problem · 1 cosmetic · 2 minor · 3 major (fix before release) · 4 catastrophic (must fix). Rate on frequency + impact + persistence.

**Moderated vs unmoderated** — default to moderated remote for design-phase (Zoom / Lookback / UserTesting). Unmoderated for later rounds + benchmarking.

### 17.5 Guerrilla / discount usability

**Case (NN/g):** Nielsen's 1988 MacPaint study — 58 % of problem-finding variability tied to methodology quality; 42 % to talent + chance. Teams scoring 20–30 % on best-practice still caught 25 % of serious problems. **Bad testing beats no testing.**

**Setup:** café / library intercept, $10–20 gift card screen, 15–30 min sessions, 2 researchers (facilitate + note-take). Iterate in days. Not for: regulated domains, sensitive subjects, minors, populations needing accommodations.

### 17.6 User interviews

**Open-ended, story-seeking:** "Walk me through a typical day." "Tell me about the last time you [X]."

**Non-leading probes:** "Tell me more." "Why is that important?" "What were you thinking when…?"

**Avoid:** leading ("Wouldn't it be easier if…?"), double-barreled, assuming, hypothetical future ("Would you pay for…?" — stated intent poor predictor), recall-heavy ("How often in the last year…?").

**Structure — default semi-structured.** Guide of topics + starter questions; reorder and follow threads.

**Bias to watch:** social desirability, confirmation (yours), recency, memory decay, interviewer effect (tone shapes answers).

**Sample size practical rule:** 8–12 per user group saturates most themes; 20+ only for heterogeneous audiences or major-strategy decisions.

### 17.7 GOV.UK Service Manual — the ethical + inclusive floor

Research itself must be ethical + accessible:

- **Informed consent** — written + verbal. Purpose, recording, retention, withdrawal rights.
- **Data management** — minimum necessary, encrypted at rest, access-limited, per-retention-policy deletion.
- **Anonymization** — strip identifying context before wide sharing.
- **Withdrawal** — at any point; data removable.
- **Emotionally sensitive subjects** — enhanced consent, participant support, trained interviewer, shorter sessions.
- **Pre-election / political periods** — pause content-adjacent research that could be partisan.

**Inclusion mandates (applicable beyond public-sector):**
- Research with disabled people — AT users, low-vision, deaf/HoH, cognitive / learning differences.
- Low-digital-skill users — older, first-time internet, low-literacy. Surface problems power users don't.
- Non-digital-service users — understanding why informs whether digital is the right medium.
- Linguistic minorities — test in target languages with native speakers.

**Research-accessibility fixes:** format options (phone/in-person/video/async), longer sessions with breaks, recruit via community orgs (not just online panels), cash/check alongside gift cards.

### 17.8 When to use which method

| You need to know… | First choice | Backup |
|---|---|---|
| What problems exist | Think-aloud usability (5 users) | Unmoderated remote |
| Why users abandon | Interviews + funnel | Exit survey + session replay |
| What vocabulary users use | Card sort (open) + interviews | Search-log analysis |
| Whether IA makes sense | Tree test | First-click test |
| Which of two designs wins | A/B | Comparative usability |
| How users feel about brand | Survey + interviews | Sentiment analysis |
| How real users behave over time | Diary study | Longitudinal analytics |
| Whether product is accessible | Manual + AT with disabled participants | Automated scan (floor only) |
| Whether concept is worth building | Concept testing + interviews | Landing-page demand test |

### 17.9 Research anti-patterns

- Skipping discovery — designing on assumed needs.
- Leading questions.
- Recruiting from team network (biases digitally-fluent / friendly).
- Treating 5-user findings as statistics ("80 % of users failed" on 5 = 4 people).
- One round only — 1×15 finds fewer real problems than 3×5 with iteration.
- Interviewing about future behavior — stated intent ≠ use.
- Asking disabled users about accessibility, not shipping fix — extraction without follow-through.
- Findings without owners + deadlines.
- Focus groups for usability — groupthink distorts.
- Analytics as whole story — no "why" without qualitative.
- Skipping accessibility research — shipping untested for 15 %+ of population.

---

## 18. Source list (brief)

All files in `normalized-sources/`:

- `wcag-22.md` — Web Content Accessibility Guidelines 2.2 (W3C, 2023)
- `apple-hig.md` — Apple Human Interface Guidelines (2026)
- `material-design-3.md` — Google Material Design 3 (2026)
- `refactoring-ui.md` — Adam Wathan & Steve Schoger (2018, epub → markdown)
- `laws-of-ux.md` — Jon Yablonski (lawsofux.com, all 30 laws)
- `frontend-design-checklist.md` — David Dias
- `awesome-design-principles.md` — Robin Stickel (link catalog)
- `awesome-design.md` — Óscar Otero
- `design-resources-for-developers.md` — Brad Traversy
- `carbon-data-viz.md` — IBM Carbon Design System data-viz chapter (2026)
- `apple-hig-charts.md` — Apple HIG Charts + Charting Data (2026)
- `material-data-viz.md` — Google Material M2 data visualization
- `tufte-principles.md` — Edward Tufte foundational principles (1983–2006)
- `data-viz-honesty.md` — Cairo framework + Datawrapper craft (statistical honesty)
- `motion-choreography.md` — motion physics + web primitives (Kowalski, motion.dev, MDN, uxderrick, fliptheweb)
- `ux-research.md` — research methodology (NN/g + GOV.UK Service Manual)
- `live-reference-libraries.md` — dynamic inspiration sources (Awwwards, SiteInspire, Godly, Land-book, Lapa Ninja, Mobbin, UI Sources, Pttrns)
- `runtime-access-protocol.md` — Layer 2/3 runtime-fetch protocol

Full catalog with status and acquisition notes in `source-inventory.md`.

---

## 19. What this document is not

- Not a style guide — does not dictate one aesthetic.
- Not a component library — fetch Radix, shadcn, Tailwind UI, or the relevant design system per project.
- Not a brand voice guide — copywriting is a distinct discipline.

Use it as the **invariant spine**. Fetch current inspiration from live galleries for the moving parts. Adjust tailoring per category.
