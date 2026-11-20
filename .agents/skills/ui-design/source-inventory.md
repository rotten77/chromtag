# Source Inventory — Design Skill Build

**Date assembled:** 2026-04-20
**Last updated:** 2026-04-21 — three gap-close sources added (motion, data-viz honesty, UX research).
**Working directory:** `/Users/aaronpfutzner/Dateien - Local/ui-skill/`
**Normalized corpus:** `normalized-sources/`

This inventory catalogs every source considered for the Design Skill, with acquisition method, status, and notes on coverage and trust.

---

## 1. Core static sources (principles, specs, rules)

| # | Source | URL / location | Acquisition | Status | File |
|---|---|---|---|---|---|
| 1 | **WCAG 2.2** | https://www.w3.org/TR/WCAG22/ | WebFetch + manual synthesis of all 78 criteria | ✅ Normalized | `normalized-sources/wcag-22.md` |
| 2 | **Apple Human Interface Guidelines** | https://developer.apple.com/design/human-interface-guidelines/ | `firecrawl_scrape` (JS SPA; WebFetch returned empty). Pages: foundations, accessibility, layout, color, typography, materials, components, platforms | ✅ Normalized | `normalized-sources/apple-hig.md` |
| 3 | **Material Design 3** | https://m3.material.io/ | `firecrawl_scrape` (JS SPA). Pages: foundations, styles (color/typography/shape/elevation/motion), components | ✅ Normalized | `normalized-sources/material-design-3.md` |
| 4 | **Refactoring UI** (Adam Wathan & Steve Schoger) | Local `.epub` | `pandoc -f epub -t markdown` → `books/refactoring-ui.md` → copy to normalized | ✅ Normalized | `normalized-sources/refactoring-ui.md` |
| 5 | **Laws of UX** (Jon Yablonski) | https://lawsofux.com | WebFetch per law; synthesized all 30 laws | ✅ Normalized | `normalized-sources/laws-of-ux.md` |
| 6 | **Front-End Design Checklist** (David Dias) | https://github.com/thedaviddias/Front-End-Design-Checklist | `gh api` → base64 decode README | ✅ Normalized | `normalized-sources/frontend-design-checklist.md` |
| 7 | **Awesome Design Principles** (Robin Stickel) | https://github.com/robinstickel/awesome-design-principles | `gh api` README | ✅ Normalized (link catalog) | `normalized-sources/awesome-design-principles.md` |
| 8 | **Awesome Design** (Óscar Otero) | https://github.com/oscarotero/awesome-design | `gh api` README | ✅ Normalized | `normalized-sources/awesome-design.md` |
| 9 | **Design Resources for Developers** (Brad Traversy) | https://github.com/bradtraversy/design-resources-for-developers | `gh api` README | ✅ Normalized | `normalized-sources/design-resources-for-developers.md` |
| 10 | **IBM Carbon Data Visualization** | https://carbondesignsystem.com/data-visualization/ | `firecrawl_scrape` for getting-started, chart-types, chart-anatomy, color-palettes, axes-and-labels, legends, dashboards (3 sub-pages returned 404 — complex-charts, interactions, accessibility — synthesized from siblings) | ✅ Normalized | `normalized-sources/carbon-data-viz.md` |
| 11 | **Apple HIG — Charts + Charting Data** | https://developer.apple.com/design/human-interface-guidelines/charts + /charting-data | `firecrawl_scrape` | ✅ Normalized | `normalized-sources/apple-hig-charts.md` |
| 12 | **Material Design (M2) — Data Visualization** | https://m2.material.io/design/communication/data-visualization.html | `firecrawl_scrape` (WebFetch returned empty shell; SPA) | ✅ Normalized | `normalized-sources/material-data-viz.md` |
| 13 | **Edward Tufte — Principles of Information Design** | IxDF article + Wikipedia (Edward_Tufte); synthesizes *Visual Display of Quantitative Information*, *Envisioning Information*, *Beautiful Evidence* | WebFetch (ixdf.org redirect resolved) + WebFetch (Wikipedia) | ✅ Normalized | `normalized-sources/tufte-principles.md` |
| 14 | **Motion & animation — choreography + primitives** | Emil Kowalski (emilkowal.ski/ui/the-magic-of-clip-path); `fliptheweb/motion-ui-design` README; uxderrick gist (gist.github.com/uxderrick/07b81ca63932865ef1a7dc94fbe07838); Motion docs (motion.dev/docs/spring); MDN View Transitions API; MDN `@starting-style` | WebFetch — all retrieved except Material M2 motion pages (returned empty body, same SPA issue as HIG) and Emil Kowalski's "good-transitions" (404) | ✅ Normalized | `normalized-sources/motion-choreography.md` |
| 15 | **Data-viz statistical honesty — Cairo framework + Datawrapper** | Alberto Cairo *The Truthful Art* (framework from secondary coverage; book PDF not placed in `/books/`); Datawrapper Academy (categories index + pro-tips collection) + Datawrapper Blog (colorblindness, log scales, color scales, fix-my-chart approval-ratings) | WebFetch — Datawrapper academy article URLs 404 at post-migration paths; blog articles recovered via redirect to `www.datawrapper.de/blog/*`. Flagship "chart-type-guide" / "which-chart-to-use-when" / "misleading-charts" / "ten-things-to-consider" / "how-to-pick-the-best-chart-type" all returned 404 | ⚠️ Normalized with flagged gaps | `normalized-sources/data-viz-honesty.md` |
| 16 | **UX research methodology** | Nielsen Norman Group — *Which UX Research Methods?*, *User Interviews*, *Usability Testing 101*, *UX Research Cheat Sheet*, *Discount Usability: 20 Years*, *Why You Only Need to Test With 5 Users*, *Thinking Aloud*; GOV.UK Service Manual *User Research* section | WebFetch — NN/g articles all retrieved; guerrilla-usability specific page returned 404 (content recovered from discount-usability-20-years); GOV.UK service manual surface only (chapter index + summary) | ✅ Normalized | `normalized-sources/ux-research.md` |

**Total normalized static sources: 16.**

---

## 1b. Live intelligence layers (Layer 2 / Layer 3 — fetched at runtime, never snapshotted)

External GitHub-backed knowledge layers. Claude fetches surgically at task time. Layer 1 (`design-skill-claude.md`) always governs decisions; Layer 2/3 are lookup data.

| # | Layer | Repo | Access | File |
|---|---|---|---|---|
| L2 | **ui-ux-pro-max** — 161 products · 67 styles · 161 palettes · 57 font pairings · 25 chart types · 99 UX rules · 16 tech stacks | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | `raw.githubusercontent.com/.../src/ui-ux-pro-max/data/<file>.csv` — verified 200 text/plain | Protocol: `normalized-sources/runtime-access-protocol.md` |
| L3 | **awesome-design-md** — 70 brand DESIGN.md files (Stripe, Linear, IBM, Notion, Apple, Ferrari, BMW, Tesla, Lamborghini, Bugatti, SpaceX, Vercel, Supabase, Claude, …) | https://github.com/VoltAgent/awesome-design-md | `getdesign.md/design-md/<slug>/DESIGN.md` — verified 200 text/markdown. GitHub folders are stubs; content served via getdesign.md | Full slug index + protocol: `normalized-sources/runtime-access-protocol.md` |

**Total runtime layers: 2.**

---

## 2. Live reference libraries (queried dynamically, not normalized)

These are galleries of shipping interface design. Content changes constantly, so snapshotting is counterproductive. Documented instead as query targets.

| # | Library | URL | Coverage | Cost |
|---|---|---|---|---|
| 14 | Awwwards | https://www.awwwards.com/ | Award-tier web | Free |
| 15 | SiteInspire | https://www.siteinspire.com/ | Curated websites | Free |
| 16 | Godly | https://godly.website/ | Bold/editorial web | Free |
| 17 | Land-book | https://land-book.com/ | Landing pages by industry | Free |
| 18 | Lapa Ninja | https://www.lapa.ninja/ | Landing pages (volume) | Free |
| 19 | Mobbin | https://mobbin.com/ | App flows (iOS/Android/Web) | Freemium |
| 20 | UI Sources | https://www.uisources.com/ | App motion + interactions | Freemium |
| 21 | Pttrns | https://www.pttrns.com/ | Mobile pattern taxonomy | Freemium |

**Catalog file:** `normalized-sources/live-reference-libraries.md` — documents when and how to query each.

---

## 3. Sources considered but not normalized (and why)

| Source | Why skipped |
|---|---|
| Individual design-system principles (Shopify Polaris, Atlassian, IBM Carbon, GOV.UK, USWDS, Ant, etc.) | Cataloged via **Awesome Design Principles** link list. Fetching each separately would bloat the corpus; skill can fetch a specific system on-demand when relevant. |
| Nielsen Norman 10 Usability Heuristics | Substantively covered by Laws of UX + WCAG + Mental Models section of Refactoring UI. Can be fetched ad hoc if task calls for it. |
| Individual pattern libraries (UI Patterns, Collect UI, Call to Idea, etc.) | Overlap with live-reference libraries (Mobbin, Pttrns, Land-book). |
| Tailwind UI / shadcn / Radix documentation | Implementation-tier, not principles-tier. Fetched on-demand by specific component task. |
| Inclusive Components (Heydon Pickering) | High-value accessibility pattern source. **Deferred** — would be worth a dedicated fetch for deep accessibility work. Flagged as gap. |
| Grid Systems (Josef Müller-Brockmann) / classic typography books | Not freely available. Refactoring UI covers layout/typography practicals well enough for this skill. |
| Alberto Cairo — *The Truthful Art* (book) | PDF not placed in `/books/`. Framework captured in `data-viz-honesty.md` from secondary coverage. Full book-level extraction deferred until PDF is made available. |
| Material M2 motion pages (understanding-motion, speed, choreography, customization) | SPA, same empty-body issue as HIG. `material-design-3.md` (M3) and Apple HIG already cover the canonical Material motion curves + choreography terminology at the needed depth. On-demand firecrawl fetch available if deeper M2 guidance becomes necessary. |

---

## 4. Acquisition notes (for reproducibility)

- **pandoc** installed via `brew install pandoc` to convert `refactoring-ui.epub` → markdown.
- **GitHub READMEs** fetched with `gh api repos/{owner}/{repo}/readme --jq .content | base64 -d`. Branch name varies (`main` vs `master`) — resolved via `gh api repos/{owner}/{repo} --jq .default_branch`.
- **Static HTML** (WCAG 2.2, Laws of UX) fetched with `WebFetch`. Apple HIG and Material Design 3 are JS-rendered SPAs; `WebFetch` returned empty shells, so `mcp__firecrawl-mcp__firecrawl_scrape` with `waitFor: 3000–4000` was used instead.
- **Subagent dispatch** was attempted early but was blocked by restrictive Bash/WebFetch permissions in isolated subagents. All fetches completed from the main session.

---

## 5. Known gaps / uncertainty

- **Apple HIG** coverage is deep on foundations (accessibility, layout, color, typography, materials) but shallow on per-component spec (every button variant, picker, etc.). Acceptable — the skill can fetch specific component pages on demand.
- **Material Design 3** same pattern: strong on foundations/styles; component-level detail is representative, not exhaustive.
- **WCAG 2.2** all 78 success criteria covered at the testable-requirement level. Full WCAG techniques (ARIA 1.2, WAI-ARIA Authoring Practices) are not normalized — flagged for on-demand fetch when building accessible components.
- **No primary source on typography fundamentals** (font pairing, type hierarchy depth) beyond Refactoring UI. Thinking with Type (Lupton) would be a useful addition.
- **No brand/voice sources** normalized (Mailchimp voice, Atlassian personality). Intentional scope cut — this skill is visual/interaction, not copy.
- **Data-viz coverage updated 2026-04-21** — Carbon, Apple HIG Charts, Material M2 data-viz, Tufte now joined by Cairo framework + Datawrapper (`data-viz-honesty.md`). Cairo is framework-only (book not placed in `/books/`). Several flagship Datawrapper Academy articles 404'd at migration paths; synthesis draws on recoverable blog posts + category index.
- **Motion coverage updated 2026-04-21** — animation curves, spring physics, web primitives (View Transitions, `@starting-style`, `clip-path`), choreography patterns now captured in `motion-choreography.md`. Material M2 motion pages still return empty body from WebFetch (SPA); not blocking since M3 + Apple coverage + new sources together close the gap.
- **UX research added 2026-04-21** — NN/g taxonomy, 5-user rule, usability testing, interviews, guerrilla, plus GOV.UK ethics + inclusion captured in `ux-research.md`. Method-specific depth (card sort analysis statistics, tree-testing tools, survey design mathematics) still requires ad-hoc fetch.

These gaps are acceptable for a v1 personal design skill. They should be listed in the final report so the user can prioritize additions.

---

## 6. Trust and staleness

- **WCAG 2.2**: stable standard, updated on slow W3C cadence. Current as of October 2023 recommendation.
- **Apple HIG**: Apple revises continuously; snapshot is April 2026. Liquid Glass / visionOS guidance is current. Re-fetch before a major Apple OS release.
- **Material 3**: Google updates continuously; snapshot is April 2026. Expressive / M3 typography table is current.
- **Refactoring UI**: static book, stable — 2018 edition. Principles age well but specific examples (flat vs. shadow) are dated. Treat as timeless *layout/type/color* advice, not current aesthetic.
- **Laws of UX**: stable theory, not fashion. Cites are durable.
- **Awesome lists**: community-updated; links can rot. Treat as starting points, verify links when citing.
- **Live libraries**: by definition current; re-query each time a task calls for reference imagery.
