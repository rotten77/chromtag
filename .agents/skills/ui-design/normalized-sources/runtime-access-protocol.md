# Runtime Access Protocol — External Design Intelligence

**Purpose:** Technical reference for how Claude fetches Layer 2 (ui-ux-pro-max) and Layer 3 (awesome-design-md) at runtime. No local install, no stale snapshots.
**Last verified:** 2026-04-21.

---

## Architecture recap

```
Layer 1  design-skill-claude.md         LOCAL, always loaded. Principles.
Layer 2  ui-ux-pro-max                  GitHub raw fetch. Lookup tables (CSV).
Layer 3  awesome-design-md              getdesign.md raw fetch. Brand DESIGN.md.
```

Layer 1 always governs thinking. Layers 2–3 are lookup data — never override principles.

---

## Layer 2 — ui-ux-pro-max

**Repo:** `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
**Default branch:** `main`
**License:** MIT (see repo).

### Access method

Direct raw fetch from `raw.githubusercontent.com`. No CLI, no Python install, no BM25 engine required — Claude reads the CSVs directly and filters in-context.

**Base URL:**
```
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/
```

**Fetch command (bash):**
```bash
curl -sSL "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/<path>"
```

Or via `WebFetch` tool.

### Available data files

All under `src/ui-ux-pro-max/data/`.

#### Top-level CSVs

| File | Size | Contents |
|---|---|---|
| `products.csv` | 58 KB | 161 product types with recommended pattern, style, color, typography, effects, anti-patterns |
| `styles.csv` | 143 KB | 67 UI styles (Minimalism, Glassmorphism, Brutalism, Bento, AI-Native, Dark Mode, Liquid Glass, Cyberpunk, Neumorphism, etc.) + AI prompts + CSS keywords |
| `colors.csv` | 32 KB | 161 color palettes aligned 1:1 with product types |
| `typography.csv` | 50 KB | 57 Google-Fonts pairings with moods + imports |
| `charts.csv` | 19 KB | 25 chart types + library recommendations |
| `landing.csv` | 17 KB | 24 landing page patterns + CTA strategies |
| `ux-guidelines.csv` | 19 KB | 99 UX rules (accessibility, touch, performance, animation, forms, nav) |
| `ui-reasoning.csv` | 53 KB | 161 industry-specific reasoning rules driving the design-system generator |
| `app-interface.csv` | 10 KB | App interface patterns |
| `icons.csv` | 21 KB | Icon set guidance |
| `google-fonts.csv` | 745 KB | Full Google Fonts catalog w/ metadata |
| `design.csv` / `draft.csv` | 106 KB each | Consolidated design rules + drafts |
| `react-performance.csv` | 15 KB | React-specific performance guidelines |

#### Stack-specific CSVs (`src/ui-ux-pro-max/data/stacks/`)

16 stacks — each CSV holds the style/pattern/component-library guidelines specific to that stack:

```
angular.csv    astro.csv         flutter.csv       html-tailwind.csv
jetpack-compose.csv   laravel.csv   nextjs.csv    nuxt-ui.csv
nuxtjs.csv     react-native.csv  react.csv         shadcn.csv
svelte.csv     swiftui.csv       threejs.csv       vue.csv
```

#### Skill manifest

```
.claude/skills/ui-ux-pro-max/SKILL.md   44 KB — priority table + full checklist
```

### Verified URLs (examples)

```
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/styles.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/colors.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/typography.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/products.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/charts.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/ux-guidelines.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/landing.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/stacks/nextjs.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/stacks/shadcn.csv
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/.claude/skills/ui-ux-pro-max/SKILL.md
```

All verified 2026-04-21 → HTTP 200, `text/plain`.

### When to fetch

- Choosing a color palette or font pairing → `colors.csv` + `typography.csv`
- Selecting UI style for product type → `products.csv` + `styles.csv`
- Designing landing page structure → `landing.csv`
- Picking chart type → `charts.csv`
- Stack-specific guidance → `stacks/<stack>.csv`
- Pre-ship UX review → `ux-guidelines.csv`

### How to query without Python

CSVs are plain text. Strategy:

1. `curl -sSL <url>` the relevant file.
2. Grep for keyword (product name, stack, style name) — line matches cover 90 % of queries.
3. Read rows as CSV with context; extract colors, fonts, anti-patterns.
4. Keep only relevant rows in context — **don't load whole files** unless file < 30 KB.

For heavy queries consider the Python CLI locally (`python3 scripts/search.py ... --domain ...`) but this is optional — raw CSV access is sufficient.

### Limitations

- Files are canonical but updated on maintainer cadence. Re-fetch rather than cache.
- `google-fonts.csv` is 745 KB — too big to pull wholesale. Use GitHub search API or grep the raw file in chunks.
- No authentication required; GitHub raw has soft rate limits (~5000 req/hr unauth) — ample for interactive use.

---

## Layer 3 — awesome-design-md

**Repo:** `https://github.com/VoltAgent/awesome-design-md`
**Default branch:** `main`
**License:** MIT.

### Access method — IMPORTANT

The GitHub repo's `design-md/<brand>/` folders now contain only stub READMEs (~110 bytes) pointing to **getdesign.md**. The actual DESIGN.md content lives on getdesign.md.

**Verified raw endpoint:**
```
https://getdesign.md/design-md/<brand-slug>/DESIGN.md
```

Returns `Content-Type: text/markdown`, HTTP 200. Cloudflare-cached. Works for every brand in the catalog below.

Do **not** fetch from raw.githubusercontent.com for this repo — the folder READMEs are stubs only.

### Verified brand index (70 brands)

#### In `design-md/` folder (59)

```
airbnb            airtable          apple             bmw
cal               claude            clay              clickhouse
cohere            coinbase          composio          cursor
elevenlabs        expo              ferrari           figma
framer            hashicorp         ibm               intercom
kraken            lamborghini       linear.app        lovable
minimax           mintlify          miro              mistral.ai
mongodb           notion            nvidia            ollama
opencode.ai       pinterest         posthog           raycast
renault           replicate         resend            revolut
runwayml          sanity            semrush           sentry
spacex            spotify           stripe            supabase
superhuman        tesla             together.ai       uber
vercel            voltagent         warp              webflow
wise              x.ai              zapier
```

#### Only on getdesign.md (11 additional, verified 200)

```
binance   bugatti   mastercard   meta        nike
shopify   starbucks playstation  theverge    vodafone
wired
```

### Verified URLs (examples)

```
https://getdesign.md/design-md/stripe/DESIGN.md
https://getdesign.md/design-md/ibm/DESIGN.md
https://getdesign.md/design-md/linear.app/DESIGN.md       # note .app suffix
https://getdesign.md/design-md/mistral.ai/DESIGN.md       # note .ai suffix
https://getdesign.md/design-md/opencode.ai/DESIGN.md
https://getdesign.md/design-md/together.ai/DESIGN.md
https://getdesign.md/design-md/x.ai/DESIGN.md
https://getdesign.md/design-md/binance/DESIGN.md
https://getdesign.md/design-md/bugatti/DESIGN.md
https://getdesign.md/design-md/playstation/DESIGN.md
https://getdesign.md/design-md/theverge/DESIGN.md
```

All verified 2026-04-21.

### Fetch command

```bash
curl -sSL "https://getdesign.md/design-md/<slug>/DESIGN.md"
```

Or `WebFetch` tool.

### Brand → category index

For quick picking when a task doesn't name a brand:

| Category | Brands |
|---|---|
| **AI / LLM** | claude, cohere, elevenlabs, minimax, mistral.ai, ollama, opencode.ai, replicate, runwayml, together.ai, voltagent, x.ai |
| **Dev tools / IDE** | cursor, expo, lovable, raycast, superhuman, vercel, warp |
| **Backend / DB / DevOps** | clickhouse, composio, hashicorp, mongodb, posthog, sanity, sentry, supabase |
| **Productivity / SaaS** | cal, intercom, linear.app, mintlify, notion, resend, zapier |
| **Design / creative** | airtable, clay, figma, framer, miro, webflow |
| **Fintech / crypto** | binance, coinbase, kraken, mastercard, revolut, stripe, wise |
| **E-commerce / retail** | airbnb, meta, nike, shopify, starbucks |
| **Media / consumer tech** | apple, ibm, nvidia, pinterest, playstation, spacex, spotify, theverge, uber, vodafone, wired |
| **Automotive** | bmw, bugatti, ferrari, lamborghini, renault, tesla |

### Each DESIGN.md contains

9-section Stitch format:
1. Visual Theme & Atmosphere (mood, density, philosophy)
2. Color Palette & Roles (semantic names + hex + function)
3. Typography Rules (families, hierarchy table)
4. Component Stylings (buttons, cards, inputs, nav w/ states)
5. Layout Principles (spacing scale, grid, whitespace)
6. Depth & Elevation (shadows, surface hierarchy)
7. Do's and Don'ts
8. Responsive Behavior (breakpoints, touch targets, collapsing)
9. Agent Prompt Guide (quick color reference + ready-to-use prompts)

### When to fetch

- Task is in a specific industry → pull 2–3 category peers (automotive → bmw + ferrari + tesla)
- User asks "how does [brand] handle X" → fetch that brand's DESIGN.md, extract the specific section
- Validating a decision against a known-good reference → pull a peer brand
- Enterprise data-heavy UI → ibm, mongodb, clickhouse, hashicorp
- Developer tools → vercel, supabase, resend, replicate, warp, cursor
- Fintech → stripe, revolut, wise, coinbase, kraken
- Premium / luxury → apple, ferrari, lamborghini, bugatti

Pull **surgical**, not wholesale. A full DESIGN.md is ~40–80 KB — fine to load one, don't load ten.

### Limitations

- getdesign.md is Cloudflare-fronted. Rate limits unknown; in practice serves every request in our testing.
- Slugs match folder names exactly, including `.app` / `.ai` suffixes (linear.app, x.ai, mistral.ai, together.ai, opencode.ai) — do not strip these.
- Brand list grows — README badge currently claims 69, repo folder has 59, getdesign.md hosts ≥ 70. Re-query `gh api repos/VoltAgent/awesome-design-md/contents/design-md` for fresh folder list; README of the repo for full getdesign.md roster.
- JS SPA on `https://getdesign.md/stripe/design-md` is the browse UI — never fetch the SPA HTML for data extraction; always use the `/design-md/<slug>/DESIGN.md` raw endpoint.

---

## Quick-reference fetch templates

### Layer 2 — one CSV

```bash
curl -sSL "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/<file>.csv"
```

### Layer 2 — stack guidelines

```bash
curl -sSL "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/stacks/<stack>.csv"
```

### Layer 3 — brand DESIGN.md

```bash
curl -sSL "https://getdesign.md/design-md/<slug>/DESIGN.md"
```

### List current brand folders (if catalog drifts)

```bash
gh api repos/VoltAgent/awesome-design-md/contents/design-md --jq '.[].name' | sort
```

---

## Governance

1. **Layer 1 first.** Run the five-question decision framework before touching Layer 2/3.
2. **Layer 2 before Layer 3.** Lookup data (colors/fonts/rules) beats brand emulation for most tasks.
3. **Layer 3 is reference, not template.** Never copy a brand's DESIGN.md into production. Extract the *move* that solves the user's problem; keep the user's own brand identity.
4. **Never fetch wholesale.** One CSV, one brand at a time. Stale context rots.
5. **Flag uncertainty.** If a URL 404s or content looks wrong, say so — don't hallucinate a fallback.
