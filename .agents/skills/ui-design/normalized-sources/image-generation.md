# Image generation — when to render real assets vs. CSS/SVG

> Generated images replace the cliché "abstract gradient blob" filler. Use them deliberately. Treat each image as part of the brand, not as decoration.

---

## When to generate vs. not

| Situation | Generate? | Why |
|-----------|-----------|-----|
| Hero on a brand/marketing site | ✅ Yes — photo or editorial illustration | Reads as bespoke, not template-y |
| App dashboard hero / empty state | ⚠️ Sometimes | Custom illustration only if brand demands it; otherwise CSS shapes |
| Icons in a UI | ❌ No — use vector inline SVG | Crisp at all sizes, themable via `currentColor` |
| Avatars / placeholder portraits | ❌ Almost never (consent + bias risk) | Use initials, monogram, or silhouette |
| Data viz / chart fills | ❌ No | Charts must be live data, not images |
| Product mockups / device frames | ⚠️ Compose from real screenshots + a frame asset | Fully synthesized device frames look fake |
| Background textures, abstract gradients | ⚠️ Generate only if they read as art, not stock | Strongly prefer CSS gradient if simple |

The default for an interface element is *no image*. Add an image only when it earns the byte budget.

---

## The four useful image categories

1. **Editorial photograph** — natural daylight, real-world subject, shallow depth of field. Best for service businesses, hospitality, real estate, healthcare. Avoid stocky smiles, fake high-fives.
2. **Brand illustration (digital)** — flat or semi-flat illustration with brand palette. Best for SaaS, fintech, learning platforms, product marketing.
3. **Vector illustration** — limited palette, geometric forms, scales infinitely. Best for icons, feature explainers, abstract concepts.
4. **3D render** — only when the brand is bold/maximalist (Stripe-Apps style, Linear marketing). Carries weight; one render per page max.

Pick one category per surface and stay in it. Mixing photo + flat illustration + 3D is the visual equivalent of using three competing typefaces.

---

## fal.ai integration (recommended provider)

fal.ai exposes pay-per-image models with low latency and no warm-up. Default to one of:

| Model | Best for | Cost |
|-------|----------|------|
| `fal-ai/recraft-v3` | All four categories above; supports `style` param (`realistic_image`, `digital_illustration`, `vector_illustration`, `icon`) | ~$0.04 |
| `fal-ai/flux-pro/v1.1` | High-fidelity editorial photography, hero shots | ~$0.04 |
| `fal-ai/flux/dev` | Cheap mass-generation (variations, ideation) | ~$0.025 |
| `fal-ai/ideogram/v2` | Images that need to contain text (signs, posters) | ~$0.06 |

For a single-hero website, **Recraft v3 is the safest first pick** — it covers photo and illustration with one API and respects style consistency.

### Minimal Node integration

```ts
import { fal } from '@fal-ai/client';
fal.config({ credentials: process.env.FAL_KEY });

const out = await fal.subscribe('fal-ai/recraft-v3', {
  input: {
    prompt: '...',
    style: 'realistic_image',         // or digital_illustration / vector_illustration
    image_size: 'landscape_16_9',     // or square_hd / portrait_4_3
  },
});
const url = out.data.images[0].url;   // CDN URL — re-host on your own storage for stability
```

### Recommended setup

1. **Re-host generated images on your own storage** (Supabase / S3 / R2). fal.ai CDN is reliable but you own the asset.
2. **Generate once per entity, cache forever.** Don't regenerate on every page render — burn the $0.04 once at build time.
3. **Two sizes minimum:** `landscape_16_9` for hero, `square_hd` for cards.
4. **Always pass an `alt` text** describing the subject, not "AI generated image".

---

## Prompt patterns that work

Strong prompts share the same anatomy: **subject** + **composition** + **medium/style** + **lighting** + **camera/lens** (if photo) + **negative cues**.

### Editorial photograph (Recraft `realistic_image` / Flux Pro)

```
Editorial-quality photograph of {subject doing relevant action} in {location/context}.
Shallow depth of field, natural daylight from a {north|side} window, 35mm look,
neutral color grade. No text, no logos, no watermarks.
```

#### Niche templates (B2C local services)

| Niche | Subject |
|-------|---------|
| Electrician | A professional electrician installing a smart-home panel, clean modern workspace |
| Carpenter | A carpenter shaping wood in a bright Scandinavian workshop |
| Tax advisor | A tax advisor reviewing documents on a sleek desk in a contemporary office |
| Physiotherapist | A physiotherapist treating a patient in a calm, modern clinic with natural light |
| Restaurant | An inviting restaurant table with seasonal local food, candlelight |
| Bakery | Fresh artisan bread on a wooden counter in a warm bakery, morning light |
| Auto shop | A clean modern car workshop with a mechanic working on a German car |
| Real estate | A real estate agent in front of a beautiful home, golden hour |

### Brand illustration (Recraft `digital_illustration`)

```
Modern editorial flat illustration showing {concept}. Soft gradients, geometric forms,
2-3 colors from this palette: {primary}, {accent}, {neutral}. No text. Clean lines,
generous whitespace, subtle depth via overlapping shapes.
```

### Vector illustration / spot icon (Recraft `vector_illustration` or `icon`)

```
Minimal vector illustration of {single subject}. Flat geometric shapes, strict 2-color
palette ({primary}, {accent}). Centered composition on transparent background.
No gradients, no shadows, no text.
```

---

## Hard rules — do not produce

- ❌ Stock-style smiling people staring at the camera
- ❌ Fake "team meeting around a laptop" generic shots
- ❌ Any image containing text (typography in images is uncontrollable; use real HTML)
- ❌ Cartoon avatars with floating arms, arrows, or other "rough sketch" UI clichés
- ❌ AI fingers, AI hands close-ups (still a failure mode)
- ❌ Logos that resemble real brands

When the model produces an image with these failure modes, **regenerate**, do not ship.

---

## Verification checklist

Before shipping a generated image:

- [ ] Composition supports the page hierarchy (eye lands on the headline first, image second)
- [ ] No text artifacts in the image
- [ ] No anatomical glitches (hands, eyes, count of fingers)
- [ ] No accidental brand marks
- [ ] WCAG: image has descriptive `alt`; if decorative, `alt=""`
- [ ] File size: hero < 250 KB after WebP/AVIF compression. Use `<picture>` with `srcset` for high-DPI.
- [ ] Color reads against the headline overlay (test with a 50% black scrim if needed)

---

## When NOT to generate — better alternatives

- **Pattern backgrounds:** SVG noise, gradient meshes, CSS conic gradients. Cheaper, smaller, infinite resolution.
- **Avatars:** initials in a colored circle, or a deterministic identicon (boring-avatars, dicebear).
- **Charts:** never images — use SVG/Canvas chart libraries.
- **Logos:** hire a designer or use a typeface wordmark; AI logo gen is unreliable.

---

## Layered references (use in addition to this doc)

When designing an image-rich page, fetch live brand references via `runtime-access-protocol.md` and study how comparable companies handle hero imagery. Apple, Stripe, Linear, Notion, Vercel, Supabase, Atlassian, Shopify all have distinctive recipes.
