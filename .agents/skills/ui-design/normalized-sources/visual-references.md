# Visual references — style buckets to anchor decisions

Each bucket lists: typical traits, when to use, brand exemplars, image-generation cues.

When asked to "design something modern" without a brand brief, pick a bucket first, then refine.

---

## 1. Editorial / Magazine

**Traits:** Generous whitespace, large display type (often serif or grotesque), single hero photo, asymmetric layouts, mono-color accent, deliberate typography (real type pairings, not just system).

**When:** brand sites, design studios, agencies, premium consumer.

**Exemplars:** Apple, A24, Aesop, Te Espera, On Running, Equinox, Patagonia (older), Vermeer Lab, Mubi.

**Image generation cues:**
```
Editorial fashion photograph, single subject, full-bleed composition,
natural daylight, neutral palette, film grain, no text overlays.
```

**Avoid:** UI density, dashboard-style cards, neon palettes.

---

## 2. Modern SaaS marketing

**Traits:** Center-aligned hero, gradient blob or 3D render behind headline, light + dark theme support, sans display, screenshots of the product, social-proof logo strip, feature grid.

**When:** B2B SaaS, dev tools, fintech, productivity apps.

**Exemplars:** Stripe, Linear, Vercel, Resend, Supabase, Mercury, Notion (marketing pages), Cron (formerly), Raycast.

**Image generation cues:**
```
Modern editorial flat illustration of {concept}, 3-color palette, soft gradient background,
geometric layered shapes, subtle depth, premium feel.
```

**Avoid:** Stock photos of people. Heavy serif fonts. Drop shadows.

---

## 3. Productivity / Tool dashboard

**Traits:** Dark default theme, dense info, monospace for numbers and IDs, sidebar nav, command palette, ⌘K shortcuts, no decorative imagery, charts and tables are first-class.

**When:** internal tools, data ops, admin panels, analytics.

**Exemplars:** Linear app, Vercel dashboard, Plane.so, Datadog, Statsig, Posthog, Turbopuffer.

**Image generation cues:** none; this category typically uses no imagery, only iconography (24×24 stroke-1.5 line icons).

**Avoid:** Hero photographs. Marketing-style copy. Multiple accent colors.

---

## 4. E-commerce / D2C

**Traits:** Product photography is hero, sticky add-to-cart, trust signals (reviews, free shipping bar), category grids, large imagery, soft serif or grotesque type, single brand color + neutrals.

**When:** consumer goods, fashion, beauty, food, lifestyle.

**Exemplars:** Glossier, Allbirds, Aesop (also editorial), Olipop, Le Labo, Rhode, Heyday.

**Image generation cues:**
```
Lifestyle product photograph, {product} on a {textured surface}, soft natural light,
muted earthy palette, 50mm lens, shallow depth, slight grain.
```

**Avoid:** Multiple price-anchored badges. Garish red sales pills. Cartoon mascots (unless brand).

---

## 5. Brutalist / Anti-design

**Traits:** Hard edges, system mono fonts, raw HTML aesthetic, oversized type, harsh contrast, monochrome + 1 saturated accent, no animations, intentionally "ugly" but coherent.

**When:** subculture, music, art, niche dev tooling, irony.

**Exemplars:** Are.na, Bloomberg Terminal screenshots, Kanye-era Yeezy.com, IBM Plex micro-sites, Cabel.com, dwitter.

**Image generation cues:** none; brutalist sites usually avoid imagery or use scanned photocopy textures.

**Avoid:** Rounded buttons. Soft gradients. Drop shadows.

---

## 6. Government / Public sector

**Traits:** Plain English, accessible-by-default, single readable column, gov-blue color, no marketing flourish, big touch targets, breadcrumbs, semantic forms.

**When:** local-government services, civic apps, healthcare portals, banking compliance flows.

**Exemplars:** GOV.UK, USWDS, Service NSW, vaccinations.gov, IRS Direct File.

**Image generation cues:** rare; if needed, a single neutral photograph of a government building or service worker.

**Avoid:** Hero animations, gradients, colors with poor contrast.

---

## 7. Local-business / Service trades (key target for WebSniper)

**Traits:** One full-bleed hero photo of work in action, prominent phone number, services grid, trust pills (Jahre Erfahrung, Bewertungen), real testimonial cards with names + city, contact section, Impressum link.

**When:** Handwerker, doctors, lawyers, restaurants, salons, real estate, tradesmen.

**Exemplars:** *No global brand exemplars — this is a long tail.* Aim for **Stripe Atlas marketing × German SMB conventions**.

**Image generation cues:**
```
Editorial photograph of a {niche} professional at work in {city}, Germany.
Real environment, natural daylight, candid composition. No staged smiles, no logos.
Shallow depth of field, 35mm look.
```

**Avoid:** Generic stock smiles, clip art, "trust badge" PNGs, autoplay video, popups.

---

## 8. Bold / Maximalist

**Traits:** Saturated colors, oversized headlines, custom display type, animation on every interaction, 3D objects floating, marquee text, intentional density.

**When:** fashion brands, music artists, creative agency portfolios, art-direction-heavy launches.

**Exemplars:** Awwwards SOTD entries, Lusion, Active Theory, Dogstudio, Bruno Simon.

**Image generation cues:**
```
Bold 3D rendering of {object}, glossy material, high-saturation lighting,
studio gradient backdrop, dramatic shadow.
```

**Avoid:** Use only when the brief explicitly demands it. Performance + accessibility cost is real.

---

## 9. Wellness / Calm / Mindfulness

**Traits:** Soft neutrals (cream, sage, terracotta), serif for emphasis, breathing whitespace, slow gentle animation, nature photography, hand-drawn illustration.

**When:** therapy, yoga, meditation, organic food, skincare, wellness coaching.

**Exemplars:** Calm, Headspace, Oura, Equilibria, Rhode, Aesop (overlap with editorial).

**Image generation cues:**
```
Soft natural-light photograph of {subject}, neutral cream and sage palette,
warm grain, dreamy atmosphere, no people staring at camera.
```

**Avoid:** Bright neon, hard shadows, dense info.

---

## 10. Editorial-developer (docs / changelog)

**Traits:** Long-form prose, sidebar TOC, monospace code blocks with syntax theme, inline diagrams, anchor links, dark + light, Stripe-like polish.

**When:** dev docs, technical changelogs, API references, engineering blogs.

**Exemplars:** Stripe Docs, Linear changelog, Vercel docs, Resend docs, Supabase docs, Anthropic docs.

**Image generation cues:** rare. Diagrams should be SVG. If using imagery, opt for line illustrations.

**Avoid:** Sales-y CTAs, marketing-style hero gradients, animation that breaks reading flow.

---

## How to pick a bucket

1. Read the brief: who is this for + what category?
2. Match to the closest 1–2 buckets above.
3. Pick a primary bucket. Borrow one move from a secondary bucket if it strengthens the design (e.g. Editorial layout × Modern SaaS gradient).
4. Verify alignment via the live-reference protocol: pull 3 brand DESIGN.md files in that bucket and triangulate palette, type, density.
