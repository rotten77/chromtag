---
name: ui-design
description: >-
  Use this skill for any UI/UX or visual design task — including image
  generation decisions. Triggers: design a page or component, improve this UI,
  pick colors or fonts, fix the layout, review a design, check WCAG
  accessibility, build a design system, pick a chart type, design a dashboard,
  suggest design references or inspiration, review motion or animation, choose
  between a generated photo / illustration / SVG / CSS shape, write a prompt
  for an image-gen API (fal.ai, OpenAI, Midjourney), or any question touching
  visual hierarchy, spacing, typography, color, depth, imagery, or data
  visualization. Trigger proactively whenever the user is building something
  and mentions how it looks or how users interact with it — even if they do
  not explicitly say design. Draws from WCAG 2.2, Apple HIG, Material Design 3,
  Refactoring UI, Laws of UX, IBM Carbon, Edward Tufte, Cairo, plus curated UX
  research methodology and a category-by-category visual reference atlas.
---

# UI Design Skill

> Source: [telaaron/claude-design-skill](https://github.com/telaaron/claude-design-skill), imported from commit [`a532db4`](https://github.com/telaaron/claude-design-skill/commit/a532db483b123d3978578f7de0eec653f69fd824).

A personal design knowledge base. Principles are invariants; aesthetics are choices. This skill codifies the invariants.

## How to use this skill

**Always start here (§§ 1–2 below).** Then load detail from `design-skill-master.md` for the relevant domain. The master doc is organized by section — jump directly to the right one rather than reading start-to-finish.

| You need... | Go to |
|---|---|
| Visual hierarchy decisions | Master §3 |
| Layout, spacing, grid, density | Master §4 |
| Typography — scale, weights, line-height | Master §5 |
| Color — palette building, contrast, dark mode | Master §6 |
| Shadows, elevation, depth, materials | Master §7 |
| Motion & animation — easing, timing | Master §8 |
| Design inspiration, live galleries | Master §9 |
| Pre-ship checklist (WCAG AA + Refactoring UI) | Master §10 |
| Psychological laws — cognitive load, attention | Master §11 |
| Anti-patterns — hierarchy, type, color, forms | Master §12 |
| Category tailoring (SaaS, gov, e-commerce…) | Master §13 |
| Data visualization & dashboards | Master §14 |
| Motion choreography, spring physics, web primitives | Master §15 |
| Statistical honesty in charts (Cairo, Datawrapper) | Master §16 |
| UX research methodology | Master §17 |
| Image generation — when, which model, prompt patterns | `normalized-sources/image-generation.md` |
| Visual reference buckets (Editorial / SaaS / Brutalist / Wellness / Local-business / …) | `normalized-sources/visual-references.md` |
| Runtime Layer 2/3 live data protocol | `normalized-sources/runtime-access-protocol.md` |

**Normalized source files** in `normalized-sources/` are the raw distilled specs — reach for them when you need spec-level detail (e.g. exact WCAG criteria, Material 3 tonal palette values, Apple HIG component behavior).

---

## §1 — Decision framework (run before touching any tool or pixel)

Every design task reduces to five questions, in this order:

1. **Who is this for, what do they need, and what context are they in?** (Audience, task, device, environment, constraint, ability.)
2. **What conventions do they already know?** (Jakob's Law — users transfer expectations from *other* products. Violate only with reason.)
3. **What is the shortest path from their first look to their goal?** (Hick's Law + Doherty Threshold + Fitts's Law — minimize decision time, response time, and motor effort.)
4. **What must be obvious, what must be discoverable, what can be hidden?** (Progressive disclosure; hierarchy; selective attention.)
5. **Does it meet the non-negotiables?** (Accessibility WCAG 2.2 AA; platform conventions; brand coherence.)

Work through these before reaching for color, type, or components. Most bad interfaces skip (1) and (2).

### When the user gives a minimal brief

If the user says "design X" without enough context, ask — three to five questions, not a form:

- **Audience:** age, digital comfort, language, ability, culture.
- **Category:** what is this, in one comparable phrase? ("A Stripe for healthcare", "website of a small bookshop".)
- **Device mix:** mobile-first, desktop-first, both, TV, kiosk?
- **Brand posture:** serious/professional, warm/friendly, playful, neutral/utilitarian, bold/editorial?
- **Constraints:** tech stack, compliance (HIPAA/GDPR/PCI/gov), timeline, content readiness.

---

## §2 — Research phase (anchor taste to reality)

Before drawing, look at what works in the neighborhood.

**Who to study:** category leaders the user's users already use + adjacent-category exemplars for specific moves.

**What to extract:** layout structure · palette · typeface + scale · density · motion · copy voice.

**Deliver:** 3 picks + reasoning, not a link dump. See Master §9 for the full live-reference gallery playbook.

Do not copy. Triangulate a baseline, then decide where to **meet convention** (usability) and where to **depart** (memorability).

---

## Runtime live data (Layer 2 / Layer 3)

When current design references, product palettes, or brand design docs are needed, fetch them at runtime per the protocol in `normalized-sources/runtime-access-protocol.md`:

- **Layer 2 (ui-ux-pro-max):** 161 products · 67 styles · 161 palettes · 57 font pairings · 25 chart types · 99 UX rules
- **Layer 3 (awesome-design-md):** 70 brand DESIGN.md files (Stripe, Linear, Apple, Notion, Vercel, Supabase, Claude, and more)

Always fetch live data for inspiration tasks — never rely on training knowledge for current aesthetics.

---

## Image generation (when to render real assets)

Modern interfaces increasingly call for *generated imagery* — hero photos, brand illustrations, vector spots — instead of CSS gradients or stock photos.

Before reaching for an image-gen API, ask:

1. **Does this surface need imagery at all?** Most internal tools and dashboards don't. Default = no image.
2. **Which of the four image categories fits?** Editorial photo · Brand illustration · Vector illustration · 3D render. Pick one per page; do not mix.
3. **Which visual reference bucket are we designing in?** See `normalized-sources/visual-references.md` for 10 buckets with brand exemplars and prompt patterns.
4. **Which model + prompt anatomy?** See `normalized-sources/image-generation.md` for the fal.ai integration recipe (Recraft v3 default), niche-specific prompts, and a hard "do not produce" list.

The default API for image gen in this skill is **fal.ai with `fal-ai/recraft-v3`** — single API covering photo + illustration + vector + icon, ~$0.04/image, low latency. Re-host generated images on your own storage; cache forever.
