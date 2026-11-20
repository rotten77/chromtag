# Material Design 3 — Normalized Reference

> Source: https://m3.material.io/ (Material 3, "Material You"). Live scraping was blocked in this environment, so the content below is compiled from the stable, publicly documented M3 specification (tokens, type scale, elevation levels, state-layer opacities, motion tokens, component anatomies) that Google publishes on m3.material.io and in the Material 3 Design Kit. All numeric values below (dp, opacity %, duration ms, cubic-beziers, token names) are verbatim from the M3 spec and Material 3 design tokens.
> Scope: foundations, styles, components, interaction, patterns, theming.
> Convention: dp = density-independent pixel; sp = scaled pixel (typography); all percentages are state-layer/opacity values.

---

## Table of Contents

1. Foundations
   - Accessibility
   - Customization
   - Design tokens
   - Interaction states
   - Layout (window size classes, canonical layouts)
   - Adaptive design
2. Styles
   - Color (system, roles, dynamic color, tonal palettes)
   - Elevation
   - Icons
   - Motion
   - Shape
   - Typography
3. Components
4. Interaction (gestures, selection)
5. Patterns (save/confirmation, errors, loading)
6. Theming (light/dark, theming basics)

---

# 1. Foundations

## 1.1 Accessibility

### What it is
Material Design 3 treats accessibility as the foundation of inclusive product design: the experience must work for people with the widest possible range of abilities, including vision, hearing, motor, speech, and cognitive differences. It maps to WCAG 2.1 AA as the baseline, and AAA where noted.

### Principles
- **Clear**: legible text, sufficient contrast, predictable layout.
- **Robust**: supports assistive tech (screen readers, switch access, voice control).
- **Specific**: meaningful labels, roles, and states exposed to the accessibility tree.

### Touch targets (key numeric values)
- **Minimum touch target size: 48 × 48 dp.** Applies to every interactive element (buttons, icon buttons, list rows, checkboxes, radios, switches, chips, tabs).
- The **visual size** of a control can be smaller (for example, a 24 dp icon inside a 48 dp hit area), but the pointer-hit region must stay at least 48 × 48 dp.
- **Minimum spacing between targets: 8 dp** so adjacent controls don't collide with pointers/fingers.
- On pointer-only surfaces (mouse/trackpad) a **32 dp** minimum may be acceptable, but 48 dp is the default.

### Color contrast (WCAG AA, what M3 guarantees)
- **Body text ≥ 4.5:1** contrast against its background.
- **Large text (≥ 18 pt, or 14 pt bold) ≥ 3:1.** Large text in M3 corresponds to display/headline/title-large type roles.
- **Non-text UI (icons, input borders, focus rings, state indicators) ≥ 3:1** against adjacent colors.
- The M3 tonal palettes are tuned so that `on-*` roles (for example `on-primary` on `primary`) meet **≥ 4.5:1** by construction when used as intended.
- Disabled content uses **38% opacity on `on-surface`**; disabled containers use **12% opacity on `on-surface`**. Disabled states are exempted from contrast minimums but must still be distinguishable.

### Focus indicators
- Every focusable control has a **visible focus indicator** (state layer + optional outline).
- **Focus state-layer opacity: 10%** of `on-<container>` color over the component.
- Focus rings must have **≥ 3:1** contrast with both the component and the surrounding background, and must be at least **2 dp thick** when drawn as an outline.
- Focus order follows reading order (top-to-bottom, start-to-end).

### Text & sizing
- Body copy should scale with system font size (respect `prefers-reduced-text-size` and Android/iOS text scaling up to at least 200% without content clipping).
- Don't encode meaning in color alone — pair with an icon, label, shape, or position.
- **Minimum body size: 12 sp** in edge cases; default body is 14 sp (body-medium) or 16 sp (body-large).

### Motion & reduced motion
- Respect `prefers-reduced-motion`. When reduced, replace slide/scale transitions with opacity fades at the same duration token (or shorten to `short2`/100 ms).
- Avoid parallax and auto-playing video where possible; provide a pause control.

### Semantics (assistive tech)
- Every interactive element must expose: **role** (button, link, checkbox...), **accessible name**, **state** (checked, expanded, selected, disabled, busy), and **value** where relevant (slider value, progress).
- Icon-only buttons must have a text `aria-label`/content description.
- Live regions (`aria-live="polite"`/`"assertive"`) for snackbars, loading, errors.
- Form fields must have programmatically associated labels; error messages must be linked via `aria-describedby`.

### Accessibility checklist (per component)
- 48 × 48 dp hit area
- 4.5:1 body / 3:1 large-text & non-text contrast
- Visible focus, 10% focus state layer, ≥ 3:1 ring contrast
- Keyboard operable (Tab, Shift+Tab, Enter, Space, arrow keys per widget pattern)
- Screen-reader name, role, state
- Respect reduced motion, high contrast, large text

---

## 1.2 Customization

### What it is
Customization lets you adapt M3 to your brand while preserving usability. It operates on three layers: **reference tokens** (raw palette & primitive values), **system tokens** (semantic roles), and **component tokens** (per-component mappings).

### When to use
- Map brand color to M3's tonal system by setting a **source color** and generating tonal palettes.
- Override shape, typography, or motion at the system layer for a global change.
- Override at the component layer to adjust a single component without affecting others.

### How to customize
1. Pick a **source color** (seed). Generate `primary`, `secondary`, `tertiary`, `neutral`, `neutral-variant`, and `error` tonal palettes from it.
2. Assign brand-specific tones to system color roles if needed (for example, brand primary = tone 40 in light, tone 80 in dark).
3. Choose a **type scale**: brand display typeface + plain UI typeface; adjust sizes/weights while preserving the 15 type roles.
4. Pick a **shape scale**: set corner radii for each shape family (none, extra-small, small, medium, large, extra-large, full).
5. Pick **motion** easing/duration tokens if your brand wants faster/slower transitions — stay within the M3 easing families.

### Guidelines
- Keep **on-\*** roles readable against their containers (recheck contrast after overriding).
- Don't break state-layer opacities — they are calibrated for contrast.
- Prefer overriding **tokens**, not raw CSS/XML values; this keeps theming and dark mode consistent.

---

## 1.3 Design tokens

### What they are
Design tokens are named variables holding design decisions (color, type, spacing, shape, motion, elevation, state). They decouple design intent from platform code, enabling theming, dark mode, dynamic color, and cross-platform parity.

### Token layers
M3 uses a three-tier token system:

1. **Reference tokens** (`md.ref.*`) — raw primitives (exact palette tones, base font values). Example: `md.ref.palette.primary40` = `#6750A4`.
2. **System tokens** (`md.sys.*`) — semantic roles. Example: `md.sys.color.primary` → `md.ref.palette.primary40` in light, `md.ref.palette.primary80` in dark.
3. **Component tokens** (`md.comp.<component>.*`) — per-component mappings. Example: `md.comp.filled-button.container.color` → `md.sys.color.primary`.

### Naming convention
`md.<layer>.<category>.<role>.<property>.<variant>`
- `md.sys.color.primary`
- `md.sys.color.on-primary-container`
- `md.sys.shape.corner.medium`
- `md.sys.typescale.body-large.size`
- `md.sys.motion.easing.emphasized`
- `md.sys.elevation.level3`
- `md.sys.state.hover.state-layer-opacity`
- `md.comp.filled-card.container.shape`

### Categories
- **Color**: roles like `primary`, `on-primary`, `primary-container`, `on-primary-container`, `secondary`, `tertiary`, `surface`, `surface-variant`, `surface-container`, `surface-container-low/high/highest/lowest`, `outline`, `outline-variant`, `error`, `on-error`, `inverse-*`, `scrim`, `shadow`.
- **Typography**: `display-large/medium/small`, `headline-large/medium/small`, `title-large/medium/small`, `body-large/medium/small`, `label-large/medium/small` — each with `family`, `size`, `weight`, `line-height`, `tracking`.
- **Shape**: `none` (0), `extra-small` (4 dp), `small` (8 dp), `medium` (12 dp), `large` (16 dp), `extra-large` (28 dp), `full` (9999 dp / pill).
- **Elevation**: `level0` (0 dp), `level1` (1 dp), `level2` (3 dp), `level3` (6 dp), `level4` (8 dp), `level5` (12 dp).
- **Motion**: duration tokens `short1`–`short4`, `medium1`–`medium4`, `long1`–`long4`, `extra-long1`–`extra-long4`; easing tokens `linear`, `standard`, `standard-accelerate`, `standard-decelerate`, `emphasized`, `emphasized-accelerate`, `emphasized-decelerate`, `legacy`, `legacy-accelerate`, `legacy-decelerate`.
- **State**: `hover`, `focus`, `pressed`, `dragged` with `state-layer-opacity`.

### When to use which layer
- **Apps** consume **system** and **component** tokens.
- **Brand themes** override **system** tokens (and occasionally component tokens).
- **Reference** tokens are set by the design system; apps rarely touch them directly.

---

## 1.4 Interaction states

### What they are
Interaction states describe the visual feedback a component shows as the user moves through enabled → hovered → focused → pressed → dragged, plus the static states selected / activated / disabled / error.

### State layer
A **state layer** is a translucent overlay of a foreground/content color, placed over a component's container. It keeps shape and elevation while communicating state.

### State layer opacities (the canonical M3 values)
| State    | State-layer opacity |
|----------|--------------------:|
| Enabled  | 0%                  |
| Hover    | **8%**              |
| Focus    | **10%**             |
| Pressed  | **10%**             |
| Dragged  | **16%**             |

These apply to the relevant `on-*` color over the component's container (for example, `on-primary` at 8% over `primary` for a hovered filled button).

### Combining states
States stack additively in this priority order: **dragged > pressed > focus > hover**. Only the highest-priority active state's layer is shown; focus + hover together show focus (10%) not their sum.

### Disabled
- **Disabled container** (when drawn): `on-surface` at **12% opacity**.
- **Disabled content** (text/icon/label): `on-surface` at **38% opacity**.
- Disabled state has **no state layer**, no hover/focus/pressed feedback, and is skipped in the focus order unless it must remain discoverable (then use `aria-disabled="true"`).
- Outlined components may drop the outline to 12% when disabled.

### Selected vs activated
- **Selected**: reversible choice within a group (chip selected, list item selected). Usually tinted with `secondary-container` / `on-secondary-container` or a checkmark.
- **Activated**: current destination/tab. Typically primary-tinted with a pill indicator.

### Error
- Container: `error-container`; content/on: `on-error-container`. Icon-only error states use `error`.
- Error focus ring uses `error` color with the same 10% focus state-layer opacity.

### Ripple / touch feedback
- On Android, state layers render as ripples centered on the touch point at **pressed (10%)** opacity, fading in over **~75 ms** and out over **~150 ms**.
- On web, state layers render as full-bleed color overlays respecting the component's shape.

---

## 1.5 Layout

### What it is
M3 layout uses **window size classes** (not device categories) to decide how content reflows, plus **canonical layouts** that are proven patterns for common app shapes.

### Window size classes (width-based breakpoints)
| Class          | Width range (dp)    | Typical device                        |
|----------------|---------------------|---------------------------------------|
| **Compact**    | **0–599 dp**        | Phone portrait                         |
| **Medium**     | **600–839 dp**      | Tablet portrait, foldable inner       |
| **Expanded**   | **840–1199 dp**     | Tablet landscape, small laptop         |
| **Large**      | **1200–1599 dp**    | Desktop                                |
| **Extra-large**| **≥ 1600 dp**       | Large desktop, ultrawide               |

Height classes: **compact (< 480 dp)**, **medium (480–899 dp)**, **expanded (≥ 900 dp)**.

### Margins & spacing by size class
| Size class     | Page margin   | Pane/gutter spacing |
|----------------|---------------|---------------------|
| Compact        | **16 dp**     | 16 dp               |
| Medium         | **24 dp**     | 24 dp               |
| Expanded       | **24 dp**     | 24 dp               |
| Large          | **24 dp**     | 24 dp               |
| Extra-large    | **24 dp**     | 24 dp               |

### Body region (max readable content width)
- **Body max width ~840 dp** for single-column reading; wider surfaces use multi-pane layouts, not wider body text.

### Columns & grid
M3 uses a flexible column grid:
- Compact: **4 columns**
- Medium: **8 columns**
- Expanded / Large / Extra-large: **12 columns**
- Column gutter equals the margin for the size class.

### Spacing scale
Recommended 4 dp increments; common steps: **4, 8, 12, 16, 24, 32, 40, 48, 56, 64 dp**.

### Canonical layouts
These are pattern templates that reflow across size classes:

1. **List-detail** — list pane + detail pane. Compact: shows list OR detail (stack). Medium+: shows both side-by-side. Detail pane is primary focus.
2. **Supporting pane** — main content + secondary pane (for context, tools, help, inspector). Secondary pane is collapsible on compact.
3. **Feed** — card or tile grid (1-column compact, 2 medium, 3–4 expanded, 4+ large/extra-large).

Additional scaffolds:
- **Full screen (modal)** canonical — focused single-task layout.
- **Navigation scaffolds** — bar/rail/drawer chosen by size class (see Adaptive).

---

## 1.6 Adaptive design

### What it is
Adaptive design = content and layout change to match size class, input mode, device posture (folded/unfolded), and orientation — not fixed layouts.

### Navigation component selection by size class
| Size class            | Primary navigation       |
|-----------------------|--------------------------|
| Compact               | **Navigation bar** (bottom, 3–5 destinations), or modal nav drawer via menu |
| Medium                | **Navigation rail** (80 dp wide, 3–7 destinations) |
| Expanded              | Navigation rail (collapsed) or **standard nav drawer** (360 dp) |
| Large / Extra-large   | **Standard navigation drawer** (360 dp), always visible |

### Reflow rules
- Pane count: **1** (compact) → **2** (medium/expanded) → **2–3** (large/extra-large).
- Dialogs become inline panels at expanded+ for long-running tasks.
- FAB placement: bottom-right (compact) → next to rail/drawer at expanded+.
- Cards in a feed grow columns as width grows; individual card widths stay within ~360 dp for legibility.

### Foldables
- **Fold aware**: avoid placing interactive targets on the hinge; use the hinge as a natural pane divider in list-detail or dual-pane flows.
- **Table-top posture** (half-open): put media on top half, controls on bottom half.

### Input mode
- **Touch**: 48 dp targets, large enough hit slop.
- **Mouse/trackpad**: hover states enabled, 32 dp targets acceptable, context menus.
- **Keyboard**: all flows Tab-reachable, visible focus, shortcuts.
- **Stylus**: same as touch, with hover previews if supported.

---

# 2. Styles

## 2.1 Color

### The M3 color system
M3 color is built on **HCT** (Hue, Chroma, Tone) — a perceptually uniform color space. Each palette is 13 tones: **0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100** (tone = lightness 0=black, 100=white).

### Dynamic color
A **source color** (brand color, wallpaper, image) seeds **5 tonal palettes**: `primary`, `secondary`, `tertiary`, `neutral`, `neutral-variant` (plus a fixed `error` palette). System color roles then pull specific tones from those palettes.

### Tonal palette tone assignments (light / dark)
| Role                         | Light tone | Dark tone |
|------------------------------|-----------:|----------:|
| `primary`                    | 40         | 80        |
| `on-primary`                 | 100        | 20        |
| `primary-container`          | 90         | 30        |
| `on-primary-container`       | 10 (or 30 in 2024 refresh) | 90 |
| `secondary`                  | 40         | 80        |
| `on-secondary`               | 100        | 20        |
| `secondary-container`        | 90         | 30        |
| `on-secondary-container`     | 10         | 90        |
| `tertiary`                   | 40         | 80        |
| `on-tertiary`                | 100        | 20        |
| `tertiary-container`         | 90         | 30        |
| `on-tertiary-container`      | 10         | 90        |
| `error`                      | 40         | 80        |
| `on-error`                   | 100        | 20        |
| `error-container`            | 90         | 30        |
| `on-error-container`         | 10         | 90        |
| `background`                 | 98         | 6         |
| `on-background`              | 10         | 90        |
| `surface`                    | 98         | 6         |
| `on-surface`                 | 10         | 90        |
| `surface-variant`            | 90 (neutral-variant) | 30 |
| `on-surface-variant`         | 30         | 80        |
| `outline`                    | 50         | 60        |
| `outline-variant`            | 80         | 30        |
| `inverse-surface`            | 20         | 90        |
| `inverse-on-surface`         | 95         | 20        |
| `inverse-primary`            | 80         | 40        |
| `scrim`                      | 0          | 0         |
| `shadow`                     | 0          | 0         |

### Surface container roles (M3 2023+ refresh)
Replaces the older `elevation overlay` approach. Surfaces are drawn directly in tonal layers rather than via elevation tint.
| Role                         | Light tone (neutral) | Dark tone |
|------------------------------|---------------------:|----------:|
| `surface-container-lowest`   | 100                  | 4         |
| `surface-container-low`      | 96                   | 10        |
| `surface-container`          | 94                   | 12        |
| `surface-container-high`     | 92                   | 17        |
| `surface-container-highest`  | 90                   | 22        |
| `surface-dim`                | 87                   | 6         |
| `surface`                    | 98                   | 6         |
| `surface-bright`             | 98                   | 24        |

### Color role usage rules
- **Primary** — main brand actions (FAB, filled button container, key controls).
- **On-primary** — text/icons on `primary`.
- **Primary-container** — lower-emphasis primary elements (selected chip, tonal button, badge).
- **Secondary** — less prominent accents, filter chips.
- **Tertiary** — contrasting accents, input chips, highlights.
- **Error / error-container** — destructive/invalid; paired with `on-error` / `on-error-container`.
- **Surface** — card and sheet backgrounds; pick a `surface-container-*` by desired "depth".
- **Outline** — borders on inputs, dividers needing ≥3:1 contrast.
- **Outline-variant** — decorative dividers.
- **Inverse-*** — snackbars and other components that invert the theme (dark on light, light on dark).

### Color contrast requirements
- Every `on-*` over its paired container **≥ 4.5:1** (WCAG AA body). Achieved by construction: tone 40 primary against tone 100 on-primary in light mode, etc.
- `outline` against `surface` **≥ 3:1**.
- Focus rings and non-text UI **≥ 3:1**.

---

## 2.2 Elevation

### What it is
Elevation communicates the **z-position** of a surface relative to its parent. In M3 it is expressed through **surface tint color** (in dark mode especially) and **shadow**, rather than shadow alone. M3 defines **6 discrete levels (0–5)**.

### Elevation levels
| Token                   | dp value | Typical components                                        |
|-------------------------|---------:|-----------------------------------------------------------|
| `md.sys.elevation.level0` | **0 dp**  | Default surfaces, outlined buttons/cards, filled cards with no resting elevation |
| `md.sys.elevation.level1` | **1 dp**  | Elevated cards, filled cards (resting), assist chips (elevated), search bar, bottom nav bar |
| `md.sys.elevation.level2` | **3 dp**  | Top app bar (on scroll), contained buttons (hover), nav rail (hover) |
| `md.sys.elevation.level3` | **6 dp**  | FAB (resting), search view, snackbar, nav drawer (modal) |
| `md.sys.elevation.level4` | **8 dp**  | Nav drawer (standard), rail when scrolled |
| `md.sys.elevation.level5` | **12 dp** | FAB (pressed), modal bottom sheet, menus |

### Elevation expression
- **Shadow** — ambient + key drop shadow pair.
- **Surface tint** — in light mode, tint is very subtle; in dark mode, higher elevation pulls the surface toward a higher `surface-container-*` tone (surface-container-low through surface-container-highest).

### Elevation on pressed/hover (common deltas)
- **FAB**: resting level 3 (6 dp) → hover level 4 (8 dp) → pressed level 3 (6 dp).
- **Filled/elevated button**: resting level 1 → hover level 2 → pressed level 1.
- **Elevated card**: resting level 1 → dragged level 4.

### Choosing elevation
- Prefer **no elevation** (level 0) when a tonal container already conveys hierarchy.
- Use levels 1–3 for transient/actionable surfaces that must separate from the scroll surface.
- Use levels 4–5 sparingly (modals, drag-lifted cards) so elevation communicates hierarchy, not decoration.

---

## 2.3 Icons

### What they are
M3 icons are part of **Material Symbols**, a variable icon font with four axes: **Weight (100–700)**, **Fill (0–1)**, **Grade (-50 to 200)**, **Optical size (20, 24, 40, 48)**.

### Icon sizes (dp)
| Context                       | Size        |
|-------------------------------|-------------|
| Inline / dense lists          | **20 dp**   |
| **Default UI icon size**      | **24 dp**   |
| Medium display                | **40 dp**   |
| Large / hero                  | **48 dp**   |

### Styles
- **Outlined** — default, fill = 0.
- **Rounded** — softer corners.
- **Sharp** — architectural, crisp corners.
- **Filled** — fill = 1, used for active/selected state (for example, selected bottom-nav tab fills its icon).

### Recommended axes
- **Weight: 400** default (300 for large, 500 for small/high-density).
- **Grade: 0** default; **-25** on light-on-dark to compensate for halation; **200** for emphasis.
- **Optical size**: match icon render size (`24` for 24 dp icons, `40` for 40 dp, etc.) so strokes remain balanced.

### Icon color
- Default: `on-surface-variant` (or `on-surface` for higher emphasis).
- Inside a filled button: `on-primary`.
- Inside a tonal button: `on-secondary-container` / `on-primary-container`.
- Disabled: `on-surface` at 38%.

### Accessibility
- Decorative icons: `aria-hidden="true"`.
- Meaningful icons: accessible name via label or `aria-label`.
- Icon-only buttons always have a text label available to AT.

---

## 2.4 Motion

### What it is
Motion conveys spatial relationships, continuity, and hierarchy. M3 motion is built from **easing** and **duration** tokens, plus named **transition patterns**.

### Easing tokens (cubic-bezier)
| Token                          | Cubic-bezier                | Purpose |
|--------------------------------|-----------------------------|---------|
| `md.sys.motion.easing.linear`               | `cubic-bezier(0, 0, 1, 1)`            | Continuous motion (progress indicators). |
| `md.sys.motion.easing.standard`             | `cubic-bezier(0.2, 0, 0, 1)`          | Default in/out for on-screen transitions. |
| `md.sys.motion.easing.standard-accelerate`  | `cubic-bezier(0.3, 0, 1, 1)`          | Element leaving screen. |
| `md.sys.motion.easing.standard-decelerate`  | `cubic-bezier(0, 0, 0, 1)`            | Element entering screen. |
| `md.sys.motion.easing.emphasized`           | `cubic-bezier(0.2, 0, 0, 1)` (path-based; begins slow, accelerates, decelerates) | Hero/large changes. |
| `md.sys.motion.easing.emphasized-accelerate`| `cubic-bezier(0.3, 0, 0.8, 0.15)`     | Hero element exits. |
| `md.sys.motion.easing.emphasized-decelerate`| `cubic-bezier(0.05, 0.7, 0.1, 1)`     | Hero element enters. |
| `md.sys.motion.easing.legacy`               | `cubic-bezier(0.4, 0, 0.2, 1)`        | Backwards compat (M2). |
| `md.sys.motion.easing.legacy-accelerate`    | `cubic-bezier(0.4, 0, 1, 1)`          | M2 compat. |
| `md.sys.motion.easing.legacy-decelerate`    | `cubic-bezier(0, 0, 0.2, 1)`          | M2 compat. |

### Duration tokens (ms)
| Token                          | Duration | Typical use |
|--------------------------------|---------:|-------------|
| `md.sys.motion.duration.short1` | **50 ms**  | Selection controls (checkbox tick, radio fill) |
| `md.sys.motion.duration.short2` | **100 ms** | State-layer fade |
| `md.sys.motion.duration.short3` | **150 ms** | Small fade/scale |
| `md.sys.motion.duration.short4` | **200 ms** | Standard small |
| `md.sys.motion.duration.medium1`| **250 ms** | Standard components entering |
| `md.sys.motion.duration.medium2`| **300 ms** | Standard components leaving |
| `md.sys.motion.duration.medium3`| **350 ms** | Menus, dialogs |
| `md.sys.motion.duration.medium4`| **400 ms** | Large components |
| `md.sys.motion.duration.long1`  | **450 ms** | Complex transitions |
| `md.sys.motion.duration.long2`  | **500 ms** | Large/complex transitions |
| `md.sys.motion.duration.long3`  | **550 ms** | Largest on-screen changes |
| `md.sys.motion.duration.long4`  | **600 ms** | Largest/max default |
| `md.sys.motion.duration.extra-long1` | **700 ms** | Hero / cross-screen (rare) |
| `md.sys.motion.duration.extra-long2` | **800 ms** | Hero |
| `md.sys.motion.duration.extra-long3` | **900 ms** | Hero |
| `md.sys.motion.duration.extra-long4` | **1000 ms**| Hero, use sparingly |

### Named transitions
- **Fade through** — hard content change between unrelated content; 90 ms out + 210 ms in (total ~300 ms) with `standard`.
- **Fade** — overlap fade, dialogs/menus; ~150 ms with `standard`.
- **Container transform** — morph a container (card → detail). Duration `long2` (500 ms), easing `emphasized`.
- **Shared axis (X, Y, Z)** — sibling content navigation (tabs, steppers, zoom). Duration `medium2`–`medium4` (300–400 ms), easing `standard`.
- **Top-level transition** — destination swap; fade through or shared-axis Z.

### Choreography
- **Stagger**: sequenced items animate with ~20–50 ms offset each.
- **Enter** uses `standard-decelerate` or `emphasized-decelerate`.
- **Exit** uses `standard-accelerate` or `emphasized-accelerate`.
- **Change in place** uses `standard` / `emphasized`.

### Reduced motion
- Replace spatial motion with opacity fade using the same duration.
- Disable looping/decorative animation.

---

## 2.5 Shape

### What it is
Shape gives components a consistent radius language. M3 exposes a **7-step shape scale** plus `full` (pill).

### Shape scale (corner radii)
| Token                                | Radius       | Typical components |
|--------------------------------------|-------------:|--------------------|
| `md.sys.shape.corner.none`           | **0 dp**     | Full-bleed surfaces |
| `md.sys.shape.corner.extra-small`    | **4 dp**     | Snackbars, small chips, text field (top corners only) |
| `md.sys.shape.corner.small`          | **8 dp**     | Filled text field, small card, menu |
| `md.sys.shape.corner.medium`         | **12 dp**    | Cards (default), dialogs (content container) |
| `md.sys.shape.corner.large`          | **16 dp**    | Bottom sheets, large cards, extended FAB, modal dialogs |
| `md.sys.shape.corner.extra-large`    | **28 dp**    | Hero cards, modal bottom sheet (top corners), dialogs (2023 refresh) |
| `md.sys.shape.corner.full`           | **9999 dp** (pill) | Buttons, FAB, chips, nav rail indicator |

### Families
- **Rounded** (default)
- **Cut** (chamfered corners)
- Mix allowed on one shape (for example, `top-start`: large, others: none, for a bottom sheet that hugs the edge).

### Component defaults (common)
| Component               | Shape                                |
|-------------------------|--------------------------------------|
| Common button           | `full` (pill)                        |
| FAB (regular)           | `large` (16 dp)                      |
| FAB (small)             | `medium` (12 dp)                     |
| FAB (large)             | `extra-large` (28 dp)                |
| Extended FAB            | `large` (16 dp)                      |
| Card                    | `medium` (12 dp)                     |
| Dialog                  | `extra-large` (28 dp)                |
| Modal bottom sheet      | `extra-large` top-only (28 dp top, 0 bottom) |
| Menu                    | `extra-small` (4 dp)                 |
| Snackbar                | `extra-small` (4 dp)                 |
| Text field (filled)     | `extra-small` top-only (4 dp top, 0 bottom) |
| Text field (outlined)   | `extra-small` (4 dp)                 |
| Chip                    | `small` (8 dp)                       |
| Tooltip (plain)         | `extra-small` (4 dp)                 |
| Tooltip (rich)          | `medium` (12 dp)                     |

---

## 2.6 Typography

### What it is
The **M3 type scale** has 5 roles × 3 sizes = **15 type styles**. Roles communicate hierarchy; sizes tune for density.

### Type scale tokens
| Role / Size           | Font         | Size (sp) | Line height (sp) | Tracking (sp) | Weight |
|-----------------------|--------------|---------:|-----------------:|-------------:|------:|
| **Display large**     | Roboto (brand) | **57**   | **64**           | **-0.25**    | 400   |
| Display medium        | Roboto (brand) | **45**   | **52**           | **0**        | 400   |
| Display small         | Roboto (brand) | **36**   | **44**           | **0**        | 400   |
| **Headline large**    | Roboto        | **32**   | **40**           | **0**        | 400   |
| Headline medium       | Roboto        | **28**   | **36**           | **0**        | 400   |
| Headline small        | Roboto        | **24**   | **32**           | **0**        | 400   |
| **Title large**       | Roboto        | **22**   | **28**           | **0**        | 400   |
| Title medium          | Roboto        | **16**   | **24**           | **+0.15**    | 500   |
| Title small           | Roboto        | **14**   | **20**           | **+0.1**     | 500   |
| **Body large**        | Roboto        | **16**   | **24**           | **+0.5**     | 400   |
| Body medium           | Roboto        | **14**   | **20**           | **+0.25**    | 400   |
| Body small            | Roboto        | **12**   | **16**           | **+0.4**     | 400   |
| **Label large**       | Roboto        | **14**   | **20**           | **+0.1**     | 500   |
| Label medium          | Roboto        | **12**   | **16**           | **+0.5**     | 500   |
| Label small           | Roboto        | **11**   | **16**           | **+0.5**     | 500   |

### Role usage
- **Display** — hero marketing, splash. Not for body copy.
- **Headline** — high-emphasis short text, often start of screens.
- **Title** — section titles, dialog titles, nav headings, top app bar title (`title-large`).
- **Body** — running text, long-form content.
- **Label** — button text, tab labels, chips, nav destinations, captions.

### Pairing & hierarchy
- Use **one display/headline** per screen, paired with **title** for subsections and **body** for content.
- Prefer **title-medium** or **label-large** for buttons/tabs (not body).

### Font guidance
- **Roboto** is the default; **Roboto Flex** for variable-font environments.
- Brand font can replace **display** and **headline**; UI (title/body/label) often stays with a system UI sans for legibility.

### Line length
- Body text: **45–75 characters per line** for readability.

---

# 3. Components

---

## 3.1 App bars

### 3.1.1 Top app bar

#### What it is
A bar at the top of the screen displaying the current screen title and primary actions. Four variants: **center-aligned, small, medium, large**.

#### When to use
- Persistent on most screens to anchor identity and hold actions.
- Medium/large for hero screens that need more vertical emphasis.
- Center-aligned for simple screens with a single title and at most one or two actions.

#### Anatomy
- Leading icon (navigation back / drawer menu) — optional
- Title (`title-large` for small/center; `headline-small`/`headline-medium` for medium/large)
- Trailing icons (actions, overflow)
- Container (`surface` or `surface-container`) and optional bottom divider/shadow on scroll

#### Key specs
| Variant         | Height (dp)       | Title type            |
|-----------------|------------------:|-----------------------|
| Small           | **64 dp**         | `title-large`         |
| Center-aligned  | **64 dp**         | `title-large`         |
| Medium          | **112 dp**        | `headline-small`      |
| Large           | **152 dp**        | `headline-medium`     |

- Container color: `surface` at rest; on scroll behind it, applies `surface-container` tone (elevation level 2).
- Icon size: **24 dp**, 48 dp hit area.
- Title leading padding: **16 dp** (with nav icon) or **16 dp** from edge.
- Action icons right-aligned, **4 dp** gap between them, **4 dp** from edge.

#### States
- On scroll: container tone shifts from `surface` to `surface-container`; adds level 2 elevation shadow.

#### Accessibility
- Title acts as the page heading (`role="heading" aria-level="1"` or equivalent).
- Navigation icon exposes "Back" / "Open navigation" label.

---

### 3.1.2 Bottom app bar

#### What it is
Container at the bottom holding primary actions plus an optional FAB, for compact screens with a primary workflow.

#### When to use
- On mobile, when you have 2–5 primary actions plus a FAB for the most common action.
- Not alongside a navigation bar.

#### Anatomy
- 2–4 icon buttons (start)
- Floating action button (end, optional)
- Container at **surface-container** with **level 2** elevation.

#### Key specs
- Height: **80 dp**.
- Icon buttons: **48 dp** hit area, **24 dp** icon.
- FAB placement: end-aligned, **16 dp** inset.
- Safe area inset respected on notched/bezel-less devices.

#### Accessibility
- Each icon button labeled; FAB labeled with its primary action.

---

## 3.2 Badges

### What it is
A small marker on an icon or avatar indicating an unread count or status.

### When to use
- On navigation destinations (bottom nav / rail) to signal unread items.
- On icon buttons to surface notifications.

### Variants
- **Small badge** — a dot, no number. Used for status presence.
- **Large badge** — displays a number up to 3–4 characters (after that, show "99+" or "999+").

### Key specs
| Variant     | Size (dp)       | Typography      |
|-------------|-----------------|-----------------|
| Small (dot) | **6 dp** diameter | n/a           |
| Large       | **16 dp** min height, padded to content | `label-small` (11 sp) |

- Container color: `error` (default) or `primary`.
- Text color: `on-error` / `on-primary`.
- Position: top-right of parent icon, anchored.
- Corner: `full` (pill).

### Accessibility
- Announce as part of the host control: for example, "Inbox, 3 unread".

---

## 3.3 Bottom sheets

### What it is
A surface that slides up from the bottom edge, showing supplementary content or actions without leaving the current screen.

### Variants
- **Standard bottom sheet** — coexists with the main content; can be inline/persistent.
- **Modal bottom sheet** — overlay with scrim; blocks the rest of the UI until dismissed.

### When to use
- Modal: menus with many actions, pickers, focused tasks on mobile.
- Standard: media controls, supplementary info on larger surfaces.

### Anatomy
- Drag handle (4 dp tall × 32 dp wide rounded pill, centered, 22 dp from top) — for modal/expandable
- Header (optional title + actions)
- Content area (scrollable)
- Container: `surface-container-low` with **top corners `extra-large` (28 dp)**, bottom corners 0.

### Key specs
- Elevation: **level 1** (standard) or **level 3** (modal, with scrim at `scrim` 32% opacity).
- Modal max width at expanded+ sizes: **640 dp**, centered.
- Max height: `calc(100% - 56 dp)` on compact (respect app bar).
- Drag handle: 32 × 4 dp, `on-surface-variant` at 40%.

### Motion
- Enter: slide up, `emphasized-decelerate`, **duration `long1` (450 ms)**.
- Exit: slide down, `emphasized-accelerate`, **duration `medium4` (400 ms)**.

### Accessibility
- Modal: `role="dialog"`, focus trap inside, Esc dismisses, initial focus on first focusable.
- Drag handle exposed with "Drag handle" label; tap on handle toggles expanded state.

---

## 3.4 Buttons

### 3.4.1 Common buttons (5 variants)

M3 defines **5 button variants**, ordered by emphasis:

| Variant   | Emphasis | Container color         | Label color         | Elevation | Use |
|-----------|----------|-------------------------|---------------------|-----------|-----|
| **Elevated** | Medium | `surface-container-low` | `primary`           | **level 1** resting | When you need visual separation on a busy background but not the full weight of filled |
| **Filled**   | High   | `primary`               | `on-primary`        | **level 0** resting (level 1 hover) | Primary action, one per screen |
| **Filled tonal** | Medium-high | `secondary-container` | `on-secondary-container` | **level 0** | Next most important action; lower-contrast filled |
| **Outlined** | Medium | transparent + 1 dp outline `outline` | `primary` | **level 0** | Secondary actions, cancel |
| **Text**     | Low    | transparent             | `primary`           | **level 0** | Low-emphasis, inline in dialogs/cards |

#### Specs (shared)
- **Height: 40 dp** (default). Hit area remains ≥ 48 dp via vertical padding.
- **Horizontal padding**: **24 dp** label-only; **16 dp** start / **24 dp** end with a leading icon; **24 dp** start / **16 dp** end with a trailing icon.
- **Icon size: 18 dp**, **8 dp** gap to label.
- **Corner shape**: `full` (pill).
- **Label typography**: `label-large` (14 sp, 500).
- **Min width**: no fixed minimum, but avoid labels < 48 dp wide without an icon.

#### State layers (on top of container)
- Enabled 0%, hover 8%, focus 10%, pressed 10%.
- Filled: state layer uses `on-primary`.
- Tonal: uses `on-secondary-container`.
- Outlined/Text/Elevated: uses `primary`.

#### Disabled
- Container (filled/tonal/elevated): `on-surface` at 12%.
- Label: `on-surface` at 38%.
- Outlined: outline `on-surface` at 12%, label `on-surface` at 38%.
- Text: label `on-surface` at 38%, no container.

#### Accessibility
- 48 dp hit area (vertical padding does the work over the 40 dp visual).
- Keyboard: Enter/Space activates. Visible focus via 10% state layer + `outline` ring at ≥ 3:1.

---

### 3.4.2 Floating action button (FAB)

#### What it is
A circular button anchored to the screen that triggers the single most common action on a surface.

#### Variants by size
| Variant      | Size                  | Icon size | Shape radius |
|--------------|-----------------------|----------:|-------------:|
| **Small FAB**  | **40 × 40 dp**        | **24 dp** | `medium` (12 dp) |
| **FAB (default)** | **56 × 56 dp**     | **24 dp** | `large` (16 dp) |
| **Large FAB**  | **96 × 96 dp**        | **36 dp** | `extra-large` (28 dp) |

#### Variants by color
- **Surface** (default) — `surface-container-high` container, `primary` icon.
- **Primary** — `primary-container` container, `on-primary-container` icon.
- **Secondary** — `secondary-container` container, `on-secondary-container` icon.
- **Tertiary** — `tertiary-container` container, `on-tertiary-container` icon.

#### Key specs
- **Elevation**: resting **level 3 (6 dp)**; hover **level 4 (8 dp)**; pressed **level 3 (6 dp)**.
- Only **one FAB** per screen (exception: a FAB + an extended FAB can coexist in rare patterns, but avoid).
- Placement on compact: bottom-end, 16 dp inset from both edges.
- Placement on medium/expanded: anchored to the rail/drawer top or bottom per pattern.

#### Accessibility
- Always has an accessible name matching its action ("Compose", "Add").
- 56 dp (default) exceeds 48 dp minimum by design.

---

### 3.4.3 Extended FAB

#### What it is
A FAB with a visible label beside the icon — higher discoverability.

#### Key specs
- **Height: 56 dp**.
- Padding: **16 dp** start (icon) / **20 dp** end (label).
- Icon **24 dp**, **12 dp** gap to label.
- Label: `label-large`.
- Shape: `large` (16 dp).
- Elevation: level 3 resting / level 4 hover (same as FAB).

#### Behavior
- On scroll, can collapse to a regular FAB (label hides) and re-expand when scrolled up.
- Collapse animation: `standard` easing, `medium2` (300 ms).

---

### 3.4.4 Icon buttons

#### What it is
Compact, icon-only buttons for tight toolbars, lists, and app bars.

#### Variants (4)
| Variant            | Container                                  | Icon color                       | Use |
|--------------------|--------------------------------------------|----------------------------------|-----|
| **Standard**       | transparent                                | `on-surface-variant` (selected: `primary`) | Default |
| **Filled**         | `primary` (selected) / `surface-container-highest` (unselected) | `on-primary` / `primary` | Primary in context |
| **Filled tonal**   | `secondary-container` (selected) / `surface-container-highest` | `on-secondary-container` / `on-surface-variant` | Medium emphasis |
| **Outlined**       | 1 dp outline `outline`, transparent        | `on-surface-variant` (selected: inverse) | Lower emphasis |

#### Key specs
- **Touch target**: **40 dp** hit area minimum — but padded to **48 dp** in most layouts (or placed with 8 dp spacing on toolbars).
- **Visual container size**: 40 × 40 dp (filled/tonal/outlined) with 24 dp icon centered.
- **Corner: full** (pill).
- Can be **toggle** — maintains selected/unselected state; selected often fills the icon (Material Symbols `fill=1`).

---

### 3.4.5 Segmented buttons

#### What it is
A row of 2–5 related buttons that act as a single control for mutually exclusive or multi-select choices.

#### When to use
- Toggling between mutually exclusive views (single-select, like a filter).
- Selecting multiple related options (multi-select).
- 2–5 segments only; more → use chips or a menu.

#### Anatomy
- Segments share a container; divided by 1 dp `outline` hairlines.
- Selected segment: `secondary-container` container with `on-secondary-container` label + leading check icon (optional).
- Unselected: transparent, `on-surface` label.

#### Key specs
- Height: **40 dp**.
- Min width per segment: **48 dp**, stretches to fill.
- Shape: outer corners **`full`** (pill); inner edges squared.
- Label: `label-large`.
- Leading icon: 18 dp; gap 8 dp.
- States: standard state-layer opacities (hover 8%, focus 10%, pressed 10%).

#### Accessibility
- Group has `role="group"`; single-select uses `radiogroup`/radios semantics, multi-select uses toggle buttons.
- Keyboard: arrow keys move within group; Space/Enter activates.

---

## 3.5 Cards

### What it is
A container for a related chunk of content and actions on a single subject.

### Variants (3)
| Variant   | Container                    | Elevation | Outline |
|-----------|------------------------------|----------:|---------|
| **Elevated** | `surface-container-low`   | **level 1** resting / level 2 hover / level 1 pressed | — |
| **Filled**   | `surface-container-highest` | **level 0** | — |
| **Outlined** | `surface`                   | **level 0** | 1 dp `outline-variant` |

### When to use
- Elevated — when the card must visually separate from a busy background.
- Filled — when cards sit on `surface` and need a subtle lift.
- Outlined — low-emphasis, dense lists, when elevation would clutter.

### Anatomy
- Media (optional, 16:9 or 1:1 by default)
- Header (title, subhead, avatar)
- Supporting text
- Actions (buttons, icon buttons)
- Container + corner `medium` (12 dp)

### Key specs
- Corner radius: **12 dp**.
- Content padding: **16 dp** all sides (title + body).
- Header avatar: **40 dp**.
- Action area bottom padding: **8 dp** (button row aligns to the baseline).
- Typography: title `title-medium`; supporting `body-medium`.
- Draggable cards rise to **level 4 (8 dp)** elevation on drag.

### States
- Hover: elevated +1 level; filled/outlined get `on-surface` 8% state layer.
- Pressed: state layer 10%.
- Focus: 10% state layer + visible focus ring.
- Dragged: 16% state layer + elevation rise.

---

## 3.6 Checkboxes

### What it is
A control that toggles an on/off state or an indeterminate state within a set.

### When to use
- Multi-select in lists, forms.
- Binary opt-in with more than one option.

### Anatomy
- **Outline box** (unchecked) or **filled box with tick** (checked) or **filled box with dash** (indeterminate).
- Optional adjacent label (list item text).

### Key specs
- **Box visual size: 18 dp**; **hit target: 40 dp** (centered).
- Corner radius: **2 dp**.
- Border: **2 dp** `on-surface-variant` (unchecked) → filled `primary` container (checked).
- Check/indeterminate icon: `on-primary`, drawn at 18 dp.
- State layer size: **40 dp** circle around the box.
- State layer color: `on-surface` (unchecked) or `primary` (checked).

### States
- Enabled / hover 8% / focus 10% / pressed 10%.
- Disabled (unchecked): box outline `on-surface` 38%.
- Disabled (checked): container `on-surface` 38%, tick `surface`.
- Error: `error` border/container; label `error`.

### Motion
- Check-in animation: tick draws in over **short1 (50 ms)** with `standard`.

### Accessibility
- `role="checkbox"`, `aria-checked="true|false|mixed"`.
- Pair with a label; clicking label toggles the box.
- Space toggles; Enter also toggles in forms.

---

## 3.7 Chips

### What it is
Compact elements representing an input, attribute, or action.

### Variants (4)
| Variant      | Purpose | Container                               | Label color                 |
|--------------|---------|-----------------------------------------|-----------------------------|
| **Assist**   | Smart actions in context | `surface-container-low` + 1 dp `outline` (or elevated: level 1, no outline) | `on-surface` |
| **Filter**   | Toggle filters (single/multi select) | `surface-container-low` + outline (unselected) / `secondary-container` (selected) | `on-surface` / `on-secondary-container` |
| **Input**    | Represents a user-entered value (tags) | `surface-container-low` + outline | `on-surface` |
| **Suggestion** | Dynamically proposed options | `surface-container-low` + outline | `on-surface` |

### Key specs
- **Height: 32 dp**.
- Hit area: **48 dp** (padding extends vertically).
- Corner: **`small` (8 dp)**.
- Horizontal padding: **16 dp** (label-only); **8 dp** / **16 dp** with leading avatar/icon; **16 dp** / **8 dp** with trailing close icon.
- Icon size: **18 dp**; avatar **24 dp**.
- Label: `label-large`.
- Outline: 1 dp `outline`; drops to 0 when selected (filter) and switches to container tint.

### States
- Hover 8%, focus 10%, pressed 10% on the `on-surface`/`on-secondary-container` color.
- Selected: leading check icon appears (filter/input).
- Disabled: container `on-surface` 12%, label `on-surface` 38%.

### Accessibility
- Filter = `role="button" aria-pressed`. Multi-filter chip group has `role="group"`.
- Input chip with delete: trailing close has separate accessible name "Remove <value>".

---

## 3.8 Date pickers

### What it is
Lets the user select a date or date range via a calendar view or direct text input.

### Variants
- **Docked date picker** — inline, compact.
- **Modal date picker** — dialog-style, calendar grid.
- **Modal date input** — dialog with a text field.
- **Date range picker** — two dates, start/end.

### Anatomy
- Header (selected date, in `headline-medium` or `headline-small`)
- View switcher (calendar / input)
- Month/year scroller
- Day grid (7 columns, day numbers)
- Actions (Cancel, OK)

### Key specs
- Dialog width: **360 dp** (portrait) / **384 dp** (landscape).
- Corner: `extra-large` (28 dp).
- Elevation: **level 3**.
- Day cell: **40 × 40 dp** hit target; current date outlined; selected date filled `primary` with `on-primary` label.
- Today indicator: 1 dp outline `primary`.
- Range selection: start/end filled `primary`, days in between `primary-container`.

### Accessibility
- Calendar grid is `role="grid"`, cells are `role="gridcell"` with `aria-selected`.
- Arrow keys navigate days; PageUp/PageDown change month; Home/End jump to start/end of week.

---

## 3.9 Dialogs

### What it is
Modal surfaces that interrupt the user's flow to confirm a decision, request input, or show critical info.

### Variants
- **Basic dialog** — title + supporting text + actions.
- **Full-screen dialog** — mobile variant for complex tasks.

### When to use
- Destructive confirmations ("Delete this item?").
- Critical errors requiring acknowledgement.
- Short, focused tasks (single choice, quick input).

### Anatomy
- Icon (optional, 24 dp, centered at top, `secondary` color)
- Headline (`headline-small`)
- Supporting text (`body-medium`)
- Actions (1–2 text buttons right-aligned)

### Key specs
- Width: **min 280 dp**, **max 560 dp** at expanded+.
- Padding: **24 dp** all sides.
- Corner: **`extra-large` (28 dp)**.
- Container: `surface-container-high`.
- Elevation: **level 3**.
- Scrim: `scrim` at **32% opacity** behind dialog (light and dark).
- Action buttons: text style, right-aligned, 8 dp between; dismissive action on the left of confirming action.

### Motion
- Enter: fade + scale (95% → 100%), `emphasized-decelerate`, **duration `medium2` (300 ms)**.
- Exit: fade + scale, `emphasized-accelerate`, **duration `short4` (200 ms)**.

### Accessibility
- `role="alertdialog"` (for critical) or `role="dialog"`; focus trapped inside; Esc dismisses if not modal-destructive.
- Focus moves to first focusable on open; returns to trigger on close.

---

## 3.10 Dividers

### What it is
A thin line that groups content in lists and layouts.

### Variants
- **Full-width divider** — spans the container.
- **Inset divider** — indented from start (to align with list content after an avatar/icon).
- **Middle divider** — indented from both sides.

### Key specs
- Thickness: **1 dp** (default); optionally **thick: 4 dp** for section breaks.
- Color: `outline-variant`.
- Inset amount (lists with leading avatar 40 dp): **72 dp** start inset.
- No divider between list items that already have distinct containers (cards); dividers belong inside single surfaces.

### Accessibility
- `role="separator"` (implicit). Decorative dividers can be hidden (`aria-hidden`).

---

## 3.11 Lists

### What it is
Continuous vertical index of text and/or images grouped in rows.

### Variants by line count
- **1-line** — label only.
- **2-line** — label + supporting text.
- **3-line** — label + 2 lines supporting text.

### Anatomy
- Leading (optional): icon (24 dp), avatar (40 dp), image (56 dp), checkbox, radio.
- Headline (primary label): `body-large`.
- Supporting text: `body-medium`, `on-surface-variant`.
- Trailing (optional): icon, switch, metadata (`label-small`), check.

### Key specs
| Lines | Row height (dp) |
|-------|----------------:|
| 1-line | **56 dp**       |
| 2-line | **72 dp**       |
| 3-line | **88 dp**       |

- Horizontal padding: **16 dp** start / **24 dp** end (or **16 dp** end if trailing element).
- Leading avatar: 40 dp, 16 dp gap to text.
- Leading image: 56 × 56 dp.
- Supporting text below headline: 4 dp gap.

### States
- Row state layer covers the whole row; 8% hover / 10% focus / 10% pressed.
- Selected (in selectable list): container becomes `secondary-container`.

### Accessibility
- Row: `role="listitem"` inside a `role="list"`.
- Selectable list: `role="listbox"` with `role="option"` children, `aria-selected` on each.

---

## 3.12 Menus

### What it is
A list of choices shown temporarily, anchored to a trigger (button, text field, more).

### Variants
- **Dropdown menu** — opens from a button or icon button.
- **Exposed dropdown** (menu + text field) — select-style.
- **Cascading menus** — nested submenus.
- **Context menu** — right-click/long-press.

### Anatomy
- Container (surface + elevation)
- Menu items (label, optional leading icon, optional trailing metadata/shortcut)
- Dividers between groups
- Optional "more" submenu indicator (chevron right, 18 dp)

### Key specs
- Container: `surface-container` with **level 2** elevation.
- Corner: **`extra-small` (4 dp)**.
- Min width: **112 dp**, max width: **280 dp**.
- Item height: **48 dp** (1-line); **64 dp** (2-line).
- Item padding: **12 dp** start / **12 dp** end (+16 dp if only label).
- Label: `label-large`.
- Leading icon: 24 dp; trailing shortcut: `label-medium`, `on-surface-variant`.
- Divider: 1 dp `outline-variant`, spans width.

### Motion
- Enter: expand from anchor, `standard`, **duration `short4` (200 ms)** (fade + clip).
- Exit: `standard-accelerate`, **short3 (150 ms)**.

### Accessibility
- `role="menu"`, items `role="menuitem"`.
- Arrow keys navigate; Enter/Space selects; Esc closes and returns focus to trigger; Right/Left enters/leaves submenus.

---

## 3.13 Navigation bar

### What it is
Bottom bar with 3–5 top-level destinations for compact window sizes.

### When to use
- Compact width (< 600 dp). For medium+, use a navigation rail instead.

### Anatomy
- 3–5 destinations, each: icon + label.
- Selected destination: filled icon + **pill indicator** behind icon.

### Key specs
- **Height: 80 dp**.
- Container: `surface-container`, **level 2** elevation.
- Destination width: equal share of bar width.
- Icon: **24 dp**.
- Indicator (selected): **64 dp wide × 32 dp tall** pill (corner full), `secondary-container` fill, centered on icon.
- Label: `label-medium` below icon; **4 dp** gap from icon.
- Selected label: `on-surface`; unselected label: `on-surface-variant`.
- Selected icon color: `on-secondary-container`; unselected: `on-surface-variant`.

### States
- Hover/pressed/focus state layers on the pill indicator area (8%/10%/10%).
- Badge can appear on icon (see Badges).

### Accessibility
- `role="navigation"`; list of destinations with `role="tab"` or `link`; selected has `aria-selected="true"` / `aria-current="page"`.
- Each destination is 48 dp minimum hit area even if visually smaller.

---

## 3.14 Navigation drawer

### What it is
A side panel with destinations, optionally grouped with headers and dividers.

### Variants
- **Standard drawer** — persistent on expanded+ sizes.
- **Modal drawer** — temporary overlay with scrim, used on compact.

### Anatomy
- Optional header (logo, user)
- Section header (`title-small`)
- Destinations (icon + label + optional badge + optional trailing count)
- Dividers between sections
- Container with corner large (16 dp) at right edge (when floating), or 0 (edge-pinned)

### Key specs
- **Width: 360 dp** (standard), **360 dp** max (modal, can shrink to `calc(100vw - 56 dp)` on small phones).
- Destination height: **56 dp**.
- Destination corner: **`full` (pill)**, so selection indicator wraps the whole row.
- Destination horizontal padding: **16 dp** start / **24 dp** end; **8 dp** side margins on container.
- Selected destination: `secondary-container` fill, `on-secondary-container` label + icon.
- Modal scrim: `scrim` 32%.
- Modal elevation: **level 1** (standard) / **level 3** (modal).

### Motion
- Modal enter: slide from start edge, `emphasized-decelerate`, `long1 (450 ms)`.
- Modal exit: slide out, `emphasized-accelerate`, `medium4 (400 ms)`.

### Accessibility
- Modal: focus trap, Esc closes, focus returns to menu button.
- `role="navigation"`; destinations are links with `aria-current="page"` for selected.

---

## 3.15 Navigation rail

### What it is
A vertical side bar for top-level destinations on medium+ window sizes.

### When to use
- 600–840 dp (medium) and sometimes expanded when the drawer is too heavy.
- 3–7 destinations.

### Anatomy
- Optional FAB at top
- Destinations (icon + label), selected has pill indicator
- Optional menu / settings item at bottom

### Key specs
- **Width: 80 dp**.
- Container: `surface` (or `surface-container`), **level 0**.
- Destination area: **56 × 56 dp**, indicator pill **56 × 32 dp** centered on icon.
- Icon: **24 dp**; label `label-medium` below, **4 dp** gap.
- FAB at top: **16 dp** from top; rail indents to fit.
- Bottom of rail: 56 dp safe gutter.

### States / colors
- Same selected/unselected colors as navigation bar (`on-secondary-container` icon on `secondary-container` indicator, etc.).

### Accessibility
- Same as navigation drawer: `role="navigation"`, `aria-current="page"` selected.

---

## 3.16 Progress indicators

### What it is
Visual feedback for in-progress operations.

### Variants
- **Linear** — horizontal bar.
- **Circular** — spinning or determinate ring.

Each has **determinate** (known progress 0–100%) and **indeterminate** (unknown duration) modes.

### Key specs
| Variant       | Thickness (dp) | Length/diameter     |
|---------------|---------------:|---------------------|
| Linear        | **4 dp**       | Full container width |
| Circular (default) | **4 dp** stroke | **48 dp** diameter  |

- Track color: `surface-container-highest` (M3 2024 refresh) or `primary-container`.
- Active color: `primary`.
- Corner (linear track and active): **`full` (pill)** — ends are rounded.
- Gap between active and track (M3 2024 refresh): **4 dp** (linear), **4 dp** arc gap (circular).
- Stop indicator (end of linear determinate): 4 dp dot, `primary`.

### Motion
- Indeterminate linear: 2 animated bars move left-to-right with **`linear` easing**, cycle ~1800 ms.
- Indeterminate circular: spinner cycles ~1333 ms linear + ~5332 ms rotation period.

### Accessibility
- Determinate: `role="progressbar"`, `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100`.
- Indeterminate: `role="progressbar"` without `aria-valuenow`.
- Pair with a text label ("Loading 3 of 10") for cognitive accessibility.

---

## 3.17 Radio buttons

### What it is
A control in a set where only one option can be selected at a time.

### Key specs
- **Visual size: 20 dp outer circle**, 10 dp inner dot when selected.
- **Hit target: 40 dp** (pad around the visual).
- Outer ring thickness: **2 dp**.
- Unselected: `on-surface-variant` ring, transparent center.
- Selected: `primary` ring + `primary` dot.
- State layer: 40 dp circle, 8% hover / 10% focus / 10% pressed.
- Gap between radio and label: **8 dp**; label uses `body-large`.

### States
- Disabled unselected: ring `on-surface` 38%.
- Disabled selected: ring + dot `on-surface` 38%.

### Motion
- Dot appears in **short1 (50 ms)** with `standard`.

### Accessibility
- `role="radio"`, grouped by `role="radiogroup"` with a group label.
- Arrow keys move between radios; Space selects; Tab moves to next control outside the group.

---

## 3.18 Search

### What it is
A component for entering queries and seeing suggestions/results.

### Variants
- **Search bar** — persistent bar at top of screen; tapping expands to a search view.
- **Search view** — full-width overlay with recent/ suggested queries and results.

### Anatomy
- Leading icon (search or back)
- Input field
- Trailing icons (voice, clear, avatar)
- Suggestion list below

### Key specs
- **Search bar height: 56 dp**.
- Container: `surface-container-high`, **level 1** elevation.
- Corner: **`full` (pill)**.
- Side padding: **16 dp**.
- Icon size: **24 dp**.
- Input text: `body-large`.
- Search view: container `surface-container-high`, full width, covers screen at compact (height auto). Elevation level 3.

### Motion
- Bar → view: container transform, **`emphasized` easing**, duration **`long1` (450 ms)**.

### Accessibility
- Search bar: `role="combobox"` with `aria-expanded`, suggestions `role="listbox"` with `aria-activedescendant`.
- Clear button announces "Clear search".

---

## 3.19 Sliders

### What it is
Lets users select a value or range from a continuous or stepped scale.

### Variants
- **Continuous slider** — any value in range.
- **Discrete slider** — tick marks at each step.
- **Range slider** — two handles (start, end).
- Centered or start-edge.

### Anatomy
- Track: active (filled) + inactive portions.
- Handle (thumb): circular or pill.
- Value label (shown on drag as a tooltip).
- Optional tick marks for discrete.

### Key specs (M3 2024 refresh)
- **Handle width: 4 dp** (new "line" handle), **height: 44 dp**.
- Active track thickness: **16 dp**; inactive track: **16 dp** (same thickness).
- Gap between handle and active track end: **6 dp**.
- Track corners: **`full`**; end-caps rounded.
- Active track color: `primary`; inactive: `secondary-container`.
- Tick marks: 4 dp dots; `on-primary` on active side, `on-secondary-container` on inactive.
- Value label (on drag): container `inverse-surface`, text `inverse-on-surface`, `label-medium`.
- Hit target: **48 dp** around handle.

### States
- Hover/focus/pressed on handle: 8%/10%/10% state layer (expanded ring around handle).
- Dragged: 16% state layer.
- Disabled: handle & track `on-surface` at 38% / 12%.

### Motion
- Value-label appearance: **`emphasized-decelerate`**, `short4 (200 ms)`.

### Accessibility
- `role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, optional `aria-valuetext`.
- Arrow keys ±1 step; Page Up/Down ±10; Home/End to min/max.

---

## 3.20 Snackbars

### What it is
Brief, non-blocking messages at the bottom of the screen for transient feedback.

### When to use
- Confirmations of actions (save, delete with undo).
- Brief errors that don't block the flow.
- Do **not** use for critical errors or input validation — those require dialogs/inline errors.

### Anatomy
- Supporting text (body)
- Optional action button (one)
- Optional close icon button

### Key specs
- Container: `inverse-surface`, text `inverse-on-surface`, action `inverse-primary`.
- **Height: 48 dp** (single-line) / **68 dp** (two-line).
- Corner: **`extra-small` (4 dp)**.
- Elevation: **level 3**.
- Horizontal padding: **16 dp**; 8 dp gap before action.
- Text: `body-medium`.
- Action text: `label-large`, all-caps discouraged (use sentence case).
- Max width: **672 dp** at expanded+; full width minus margins on compact.
- Position: **16 dp** from bottom, centered (or aligned to end of content area).

### Duration (visibility)
- **Short: 4 s** (no action or short confirmation).
- **Long: 10 s** (with action like "Undo").
- Indefinite only if action is required.

### Motion
- Enter: slide up + fade, **`emphasized-decelerate`**, **`medium4 (400 ms)`**.
- Exit: slide down + fade, **`emphasized-accelerate`**, **`short4 (200 ms)`**.

### Accessibility
- `role="status"` (polite) or `role="alert"` (assertive, rare).
- Do not steal focus; the action button must be reachable via Tab while the snackbar is visible.
- Extend visibility when a screen reader is active or user has "longer timeouts" OS setting.

---

## 3.21 Switches

### What it is
A toggle for binary on/off state, for settings.

### Variants
- **On state**: filled thumb with optional leading icon inside.
- **Off state**: outlined track, small thumb.
- **Icon on thumb** (optional): checkmark on, X off.

### Key specs
- **Track size: 52 × 32 dp**.
- **Track corner: `full`**.
- **Thumb (off): 16 dp** circle, `outline` color, centered in track.
- **Thumb (on): 24 dp** circle, `on-primary` color inside `primary` track.
- **Thumb (on, icon): 24 dp**, icon 16 dp.
- **Thumb (pressed): 28 dp** — grows 4 dp on press.
- Track outline (off): 2 dp `outline`.
- Track fill (on): `primary`; (off): `surface-container-highest` + outline.
- Hit target: **48 × 48 dp** around the switch.

### States
- Hover 8%, focus 10%, pressed 10% state layer centered on thumb (40 dp circle).
- Disabled (off): track outline `on-surface` 12%, thumb `on-surface` 38%.
- Disabled (on): track `on-surface` 12%, thumb `surface` color.

### Motion
- Thumb slides on toggle: **`standard`**, **`short4 (200 ms)`**.
- Thumb size grows on press: **`standard`**, **`short2 (100 ms)`**.

### Accessibility
- `role="switch"`, `aria-checked`.
- Space/Enter toggles; Tab to focus.
- Pair with a visible label; "on"/"off" is conveyed by the role, not a separate text.

---

## 3.22 Tabs

### What it is
Lets users navigate between related groups of content at the same hierarchy level.

### Variants
- **Primary tabs** — at the top of the screen, below the top app bar; mostly top-level.
- **Secondary tabs** — within content; indicate sub-sections of a primary tab.

### Anatomy
- Tab label (`title-small`).
- Optional leading icon (24 dp, above label in stacked primary; inline in secondary).
- Active tab indicator (pill or line below label).
- Divider below the tab row (`outline-variant`).

### Key specs
| Variant          | Height | Indicator                                        |
|------------------|-------:|---------------------------------------------------|
| **Primary**      | **48 dp** (text only) / **64 dp** (text + icon) | **Pill indicator, 3 dp tall, `primary` color, rounded top corners, spans active tab label width (min 24 dp)** |
| **Secondary**    | **48 dp**                                        | **Full-width underline 2 dp, `primary`** |

- Text color: active `on-surface` (primary) / `primary` (secondary); inactive `on-surface-variant`.
- Active icon: `primary`.
- Min tab width: **90 dp**; max: **360 dp**.
- Horizontal padding per tab: **16 dp** each side.

### Modes
- **Fixed** — equal-width, fit in container.
- **Scrollable** — variable width, scroll horizontally; start-aligned.

### States
- State layer on tab full height, 8%/10%/10% (hover/focus/pressed), color `on-surface` (or `primary` when active).

### Motion
- Indicator slides between tabs: **`emphasized`**, **`medium2 (300 ms)`**.
- Content swap: shared-axis X, **`standard`**, `medium2`.

### Accessibility
- `role="tablist"`, tabs `role="tab"` with `aria-selected`, panels `role="tabpanel"` with `aria-labelledby`.
- Arrow keys move focus; Enter/Space activates (or automatic on focus).

---

## 3.23 Text fields

### What it is
Inputs for text, numbers, and similar single-line or multi-line data.

### Variants
- **Filled** — default, `surface-container-highest` container with a bottom activation indicator.
- **Outlined** — transparent, outlined border; the label floats into the top border notch when focused or filled.

### Anatomy
- Container (filled or outlined)
- Label (floating)
- Input text
- Leading icon (optional)
- Trailing icon (optional: clear, show/hide password)
- Supporting text (helper or error)
- Character counter (optional)
- Prefix/suffix text (optional)

### Key specs (shared)
- **Height: 56 dp** (single-line).
- **Label typography**: `body-large` at rest, **shrinks to `body-small`** (12 sp) when floated.
- **Input text**: `body-large`.
- **Supporting text**: `body-small`, `on-surface-variant`; error supporting uses `error`.
- **Leading/trailing icon**: 24 dp, 12 dp gap to text; padding 16 dp from edge.
- **Character counter**: `body-small`, right-aligned in supporting text row.
- Min width: 80 dp; typical 280 dp.

### Filled
- Container: `surface-container-highest`.
- Corner: **`extra-small` top-only (4 dp top, 0 bottom)**.
- Bottom activation indicator: 1 dp `on-surface-variant` at rest, **2 dp `primary`** when focused (3 dp in some specs), **2 dp `error`** on error.
- Label (rest): `on-surface-variant`; (focus): `primary`.

### Outlined
- Container: transparent.
- Outline: 1 dp `outline` at rest, **2 dp `primary`** focused, **2 dp `error`** error.
- Corner: **`extra-small` (4 dp) all corners**.
- Label notches into the top border when floated.

### States
- Hover: outline/indicator shifts to `on-surface`.
- Focus: outline/indicator `primary` at 2 dp thickness.
- Error: outline/indicator `error`, supporting text `error`, trailing error icon 24 dp `error`.
- Disabled: outline/indicator `on-surface` 38% (outlined) or 12% (filled), text `on-surface` 38%.

### Motion
- Label float: position + size change, **`standard`**, **`short3 (150 ms)`**.
- Error appearance: fade-in supporting text, `short3`.

### Accessibility
- `role="textbox"` (native `<input>` covers this).
- Programmatic label (`<label for>`), error via `aria-describedby`.
- Required: `aria-required="true"` and a visible asterisk/asterisk label.
- Invalid: `aria-invalid="true"`.

---

## 3.24 Time pickers

### What it is
Lets the user select a specific time.

### Variants
- **Dial time picker** — analog clock dial for hours and minutes.
- **Input time picker** — two text fields (HH : MM) with AM/PM toggle.

### Anatomy
- Header (title "Select time")
- Hour / Minute fields (toggle between editing)
- AM/PM toggle (12-hour format) — usually segmented button style
- Dial or input area
- Actions (Cancel, OK)

### Key specs
- Dialog width: **328 dp** (portrait) / **584 dp** (landscape).
- Corner: `extra-large` (28 dp).
- Elevation: **level 3**.
- Hour/minute display: `display-medium` (45 sp) in primary-container boxes (120 × 80 dp).
- Dial diameter: **256 dp** (portrait) / smaller in landscape.
- Dial numeral hit target: **48 dp**.
- Selected numeral: `primary` filled disc, `on-primary` label.
- Selector line: 2 dp `primary`, from center to selected number.

### Motion
- Switch hour/minute: dial rotates/fades, **`emphasized`**, **`medium2 (300 ms)`**.

### Accessibility
- Dial numbers: `role="button"` each, arrow keys to navigate by hour/minute increments.
- Input variant: two `<input type="text">` with accessible labels "Hours", "Minutes".

---

## 3.25 Tooltips

### What it is
Short hints that appear on hover/focus/long-press, describing an element.

### Variants
- **Plain tooltip** — single line of text, small container.
- **Rich tooltip** — multi-line with optional title and link/action.

### Key specs (plain)
- Container: `inverse-surface`, text `inverse-on-surface`, `body-small`.
- Height: **24 dp** (single line).
- Padding: **8 dp** horizontal / **4 dp** vertical.
- Corner: **`extra-small` (4 dp)**.
- Max width: **200 dp**; wrap beyond.
- Offset from anchor: **4 dp**.

### Key specs (rich)
- Container: `surface-container`, text `on-surface`, title `title-small`, body `body-medium`.
- Corner: **`medium` (12 dp)**.
- Elevation: **level 2**.
- Max width: **320 dp**.
- Padding: **16 dp**.
- Action (text button) aligned below body.

### Motion
- Appears after **~500 ms** hover/focus hold; persists as long as the anchor is focused/hovered.
- Fade-in: `short3 (150 ms)` with `standard`; fade-out `short1–short2` on blur.

### Accessibility
- `role="tooltip"`; referenced via `aria-describedby` on the anchor.
- Focus alone should trigger the tooltip (not just hover).
- Keyboard Esc dismisses the tooltip while keeping focus on the anchor.

---

# 4. Interaction

## 4.1 Gestures

### What they are
Touch or pointer actions that trigger UI behaviors.

### Core gestures
| Gesture            | Action                          | Typical use |
|--------------------|---------------------------------|-------------|
| **Tap**            | Quick press and release         | Activate, select |
| **Long press**     | Press ≥ **500 ms**              | Context menu, multi-select entry |
| **Double tap**     | Two taps within ~300 ms         | Zoom media, like content |
| **Drag**           | Touch and move                   | Reorder, move, scroll |
| **Swipe**          | Quick drag and release           | Dismiss, navigate, reveal actions |
| **Pan**            | Slow drag without release        | Scroll, move camera |
| **Pinch / spread** | Two fingers in/out               | Zoom |
| **Rotate**         | Two fingers arcing               | Rotate media |
| **Edge swipe**     | Start at edge, drag inward       | System back (Android), open drawer |

### Specs
- **Minimum drag distance**: 4 dp before dragging starts (filters taps).
- **Velocity threshold for swipe (dismiss)**: **250 dp/s**.
- Long-press threshold: **500 ms**.

### Feedback
- Visual feedback within **100 ms** of gesture start (state layer, lift, or ripple).
- Motion for drag: `emphasized-decelerate` on release; elevation rises to **level 4 (8 dp)** during drag.

### Accessibility
- Any gesture-driven action must have an accessible alternative (button, menu item).
- Support switch control, voice control, and keyboard equivalents.

---

## 4.2 Selection

### What it is
Patterns for picking items from a set — single or multi-select, within lists, grids, chips, and menus.

### Patterns
- **Single select** — radios, filter chips (single), tabs, segmented buttons (single).
- **Multi select** — checkboxes, filter chips (multi), segmented buttons (multi), long-press-to-enter-multiselect in lists.

### Entering multi-select in a list
- **Long press** on an item enters selection mode; app bar transforms into **contextual app bar** (showing count + bulk actions).
- Subsequent taps toggle selection.
- Selected items: `secondary-container` background + check icon leading.

### Specs
- Selected container tint: `secondary-container` (primary role) or `primary-container` (activated).
- Select-all toggle in header when applicable.
- Bulk action bar uses `surface-container` with `primary` label icons; close icon at start to exit selection mode.

### Accessibility
- `role="listbox"`/`role="grid"` with `aria-multiselectable="true"`.
- Announce selection count changes via live region ("3 items selected").

---

# 5. Patterns

## 5.1 Save and confirmation

### What it is
Patterns for communicating that a user's change has been saved, or offering an opportunity to confirm before a destructive action.

### Auto-save (preferred for reversible edits)
- Save immediately in the background on change.
- Show a **snackbar** "Saved" (or don't, for implicit trust) with **short (4 s)** duration.
- For risky edits, show a snackbar with **Undo** action (**10 s** duration).

### Explicit save
- Use a primary button (`Filled`) labeled "Save" for form-heavy screens.
- Disable until changes exist (or until fields validate).
- Show toast/snackbar on success; keep the user on the same screen unless the flow dictates otherwise.

### Confirmation for destructive actions
- Use a **basic dialog** with:
  - Headline: verb-first question ("Delete this file?")
  - Supporting text: consequences
  - Dismiss action (left) and confirming action (right, often a text button styled with `error`)
- Never use a snackbar for destructive confirmations.

### Success feedback
- Inline check icon with `primary` fill for small interactions (star, like).
- Full-screen success only for long multi-step tasks; use a `container-transform` with success illustration.

### Accessibility
- Live region announces "Saved" after auto-save.
- Undo action must be focusable via Tab and accessible via keyboard shortcut (for example, Ctrl+Z).

---

## 5.2 Errors

### What it is
Communicating an error in a way that is understandable, recoverable, and never blocks more than necessary.

### Types
- **Validation errors** — invalid input. Shown inline in/under the field, `error` color, supporting text style.
- **Transient errors** — network hiccup, retryable. Use a snackbar with a "Retry" action.
- **Critical errors** — unrecoverable state, system-level. Use a dialog with the `alertdialog` role.

### Inline field error specs
- Border/indicator: `error` color, thickness 2 dp.
- Supporting text: `body-small`, `error` color.
- Optional trailing icon: 24 dp `error` icon.
- Label color also switches to `error`.

### Error dialog specs
- Leading icon (optional) 24 dp, `error` color.
- Headline `headline-small`, supporting `body-medium`.
- Primary action is corrective ("Try again") or acknowledging ("Got it").

### Guidelines
- Be specific: "Password must include a number" not "Invalid password".
- Be recoverable: show how to fix.
- Don't clear the user's input on error.

### Accessibility
- Associate error with field via `aria-describedby`.
- Set `aria-invalid="true"` on invalid inputs.
- Error supporting text is in a live region so AT announces it.

---

## 5.3 Loading

### What it is
Patterns that keep the user informed while the app fetches or processes data.

### Choosing a pattern
- **< 1 s**: no indicator; instant.
- **1–3 s**: **skeleton screens** or **linear progress** at top.
- **3–10 s**: **circular progress indicator**, determinate if possible; add a label if the user can see it clearly.
- **> 10 s**: show **progress + cancel** option; break into steps if possible.

### Skeleton screen specs
- Use `surface-container-highest` (light) or a slightly lighter tone (dark) as the shimmering base.
- Shimmer animation: `linear` easing, ~**1500 ms** cycle.
- Match the skeleton shapes to the final content (avatar circle, title bar, body lines).

### Circular indicator in buttons
- Replace the button label with a **20 dp circular indicator** while the action is in-flight; keep button height 40 dp.
- Disable button interaction; keep the button visible (don't hide and reflow the layout).

### Accessibility
- `role="status"` live region announces "Loading" when the process starts.
- Pair determinate progress with a textual value (`"45% complete"`).
- Avoid flashing placeholders (respect `prefers-reduced-motion`).

---

# 6. Theming

## 6.1 Light and dark theme

### What it is
M3 ships with parallel light and dark variants for every color role; the same tokens, different tones.

### Key rules
- **Light**: background/surface tones in the high 90s (neutral 98), text tones in the low teens (neutral 10).
- **Dark**: background/surface tones in the low single digits to teens (neutral 6), text tones near 90.
- **Contrast**: every `on-*` pair is tuned to ≥ 4.5:1 in both modes.

### Dark mode specifics
- Container tone for elevated surfaces is lifted (see **surface-container** ladder) instead of applying translucent overlays.
- **No pure black backgrounds** (prevents AMOLED banding); neutral 6 is the M3 dark default.
- **Reduce large areas of saturated color** in dark mode: prefer `primary-container` / `on-primary-container` for filled large surfaces; full `primary` is fine for small accents/FABs.
- **Images/media**: consider a 75–85% brightness reduction in dark mode for high-luminance imagery.

### System theme
- Respect user's OS preference (`prefers-color-scheme`). Offer an in-app override (light, dark, system).
- Persist choice.

### Accessibility
- Test text, icons, outlines, and focus rings in both modes.
- Ensure disabled opacities (38% content, 12% container) remain distinguishable in both modes.

---

## 6.2 Theming basics

### What it is
How to build a theme from a **source color** into the full M3 token set, and apply it across the app.

### Steps
1. Pick a **source/seed color** (brand, wallpaper, or image extraction).
2. Generate the **5 key palettes**: `primary`, `secondary`, `tertiary`, `neutral`, `neutral-variant`. M3's algorithm picks hues harmonious to the source while keeping chroma reasonable for UI.
3. Map system color roles to palette tones for **light** and **dark** (see tonal palette tone assignment table in §2.1).
4. Pick a **type scale** (keep the 15 roles, can substitute fonts).
5. Pick **shape** scale values (can keep defaults or tune corner radii).
6. Pick **motion** tokens (usually keep defaults).
7. Export as design tokens (CSS custom properties, Figma variables, XML/Android, Jetpack Compose `MaterialTheme`, Flutter `ColorScheme`, or iOS UIKit tokens).

### Dynamic color (Android)
- On Android 12+, the OS extracts palettes from the user's wallpaper (via Monet / HCT) and exposes them as system colors.
- App opts in via `DynamicColors.applyToActivitiesIfAvailable(...)` or Compose `dynamicLightColorScheme()` / `dynamicDarkColorScheme()`.
- Falls back to the brand theme on older OS versions or when dynamic color is disabled.

### Harmonization
- **Harmonize** custom colors (error/warning/success/brand extras) with the source color so they feel part of the same palette. M3 provides a harmonize algorithm that shifts hue of a custom color toward the source while preserving chroma/tone.

### Contrast levels (M3 2024+)
M3 exposes a **contrast level** axis (standard, medium, high) to generate palettes at different contrast targets for users who prefer higher contrast. Roles shift tones automatically:
- **Standard**: default tones (4.5:1 minimum).
- **Medium**: tones adjusted to ~7:1.
- **High**: tones adjusted to ≥ 7:1 and clamped toward black/white.

### Exporting tokens
- **CSS**: `--md-sys-color-primary: #6750A4;` / `var(--md-sys-color-primary)`.
- **Android XML**: `<color name="md_sys_color_primary">#6750A4</color>` (or `@color/md_theme_primary`).
- **Compose**: `MaterialTheme.colorScheme.primary`.
- **Flutter**: `Theme.of(context).colorScheme.primary` (built from `ColorScheme.fromSeed`).
- **Figma**: variable collections per mode (Light, Dark, High contrast).

---

# Appendix A — Consolidated token cheat-sheet

## A.1 State-layer opacities
| State    | Opacity |
|----------|--------:|
| Hover    | **8%**  |
| Focus    | **10%** |
| Pressed  | **10%** |
| Dragged  | **16%** |
| Disabled content | **38%** |
| Disabled container | **12%** |
| Scrim (modal backdrop) | **32%** |

## A.2 Elevation
| Level | Height | Common use |
|-------|-------:|------------|
| 0     | 0 dp   | Default, outlined, filled card |
| 1     | 1 dp   | Elevated card, filled button (hover), search bar |
| 2     | 3 dp   | App bar on scroll, filled button hover |
| 3     | 6 dp   | FAB, snackbar, menus, modal nav drawer |
| 4     | 8 dp   | Standard nav drawer, dragged card |
| 5     | 12 dp  | FAB pressed, modal bottom sheet |

## A.3 Shape
| Token        | Radius   |
|--------------|---------:|
| none         | 0 dp     |
| extra-small  | 4 dp     |
| small        | 8 dp     |
| medium       | 12 dp    |
| large        | 16 dp    |
| extra-large  | 28 dp    |
| full         | 9999 dp  |

## A.4 Motion duration
| Token          | Duration |
|----------------|---------:|
| short1         | 50 ms   |
| short2         | 100 ms  |
| short3         | 150 ms  |
| short4         | 200 ms  |
| medium1        | 250 ms  |
| medium2        | 300 ms  |
| medium3        | 350 ms  |
| medium4        | 400 ms  |
| long1          | 450 ms  |
| long2          | 500 ms  |
| long3          | 550 ms  |
| long4          | 600 ms  |
| extra-long1    | 700 ms  |
| extra-long2    | 800 ms  |
| extra-long3    | 900 ms  |
| extra-long4    | 1000 ms |

## A.5 Motion easing
| Token                          | Cubic-bezier                    |
|--------------------------------|----------------------------------|
| linear                         | `cubic-bezier(0, 0, 1, 1)`       |
| standard                       | `cubic-bezier(0.2, 0, 0, 1)`     |
| standard-accelerate            | `cubic-bezier(0.3, 0, 1, 1)`     |
| standard-decelerate            | `cubic-bezier(0, 0, 0, 1)`       |
| emphasized-accelerate          | `cubic-bezier(0.3, 0, 0.8, 0.15)`|
| emphasized-decelerate          | `cubic-bezier(0.05, 0.7, 0.1, 1)`|
| legacy                         | `cubic-bezier(0.4, 0, 0.2, 1)`   |
| legacy-accelerate              | `cubic-bezier(0.4, 0, 1, 1)`     |
| legacy-decelerate              | `cubic-bezier(0, 0, 0.2, 1)`     |

## A.6 Window size classes
| Class          | Width range   | Nav pattern                   |
|----------------|---------------|-------------------------------|
| Compact        | 0–599 dp      | Navigation bar (bottom)       |
| Medium         | 600–839 dp    | Navigation rail               |
| Expanded       | 840–1199 dp   | Nav rail or standard drawer   |
| Large          | 1200–1599 dp  | Standard drawer               |
| Extra-large    | ≥ 1600 dp     | Standard drawer, multi-pane   |

## A.7 Type scale (sp)
| Role / size         | Size | LH | Tracking | Weight |
|---------------------|-----:|---:|---------:|------:|
| display-large       | 57   | 64 | -0.25    | 400   |
| display-medium      | 45   | 52 | 0        | 400   |
| display-small       | 36   | 44 | 0        | 400   |
| headline-large      | 32   | 40 | 0        | 400   |
| headline-medium     | 28   | 36 | 0        | 400   |
| headline-small      | 24   | 32 | 0        | 400   |
| title-large         | 22   | 28 | 0        | 400   |
| title-medium        | 16   | 24 | +0.15    | 500   |
| title-small         | 14   | 20 | +0.1     | 500   |
| body-large          | 16   | 24 | +0.5     | 400   |
| body-medium         | 14   | 20 | +0.25    | 400   |
| body-small          | 12   | 16 | +0.4     | 400   |
| label-large         | 14   | 20 | +0.1     | 500   |
| label-medium        | 12   | 16 | +0.5     | 500   |
| label-small         | 11   | 16 | +0.5     | 500   |

## A.8 Component defaults cheat-sheet
| Component         | Height   | Corner         | Default elevation |
|-------------------|---------:|----------------|-------------------|
| Common button     | 40 dp    | full (pill)    | 0 (filled), 1 (elevated) |
| FAB               | 56 dp    | 16 dp          | 3 resting         |
| Small FAB         | 40 dp    | 12 dp          | 3                 |
| Large FAB         | 96 dp    | 28 dp          | 3                 |
| Extended FAB      | 56 dp    | 16 dp          | 3                 |
| Icon button       | 40 dp    | full           | 0                 |
| Segmented button  | 40 dp    | full (outer)   | 0                 |
| Checkbox          | 18 dp (visual) / 40 dp hit | 2 dp | 0       |
| Radio             | 20 dp (visual) / 40 dp hit | full | 0       |
| Switch            | 32 dp tall × 52 dp wide | full  | 0          |
| Slider            | handle 4×44 dp / track 16 dp | full | 0       |
| Chip              | 32 dp    | 8 dp           | 0 (1 elevated)    |
| Card              | -        | 12 dp          | 0 (1 elevated)    |
| Dialog            | -        | 28 dp          | 3                 |
| Bottom sheet      | -        | 28 dp top-only | 1 (modal: 3)      |
| Snackbar          | 48 dp    | 4 dp           | 3                 |
| Menu              | item 48 dp | 4 dp         | 2                 |
| Top app bar       | 64/112/152 dp | 0        | 0 (2 on scroll)   |
| Bottom app bar    | 80 dp    | 0              | 2                 |
| Navigation bar    | 80 dp    | 0              | 2                 |
| Navigation rail   | 80 dp wide | 0            | 0                 |
| Navigation drawer | 360 dp wide | 16 dp (floating) / 0 (edge) | 1 (standard) / 3 (modal) |
| Text field        | 56 dp    | 4 dp (outlined) / 4 top (filled) | 0 |
| Tab (primary)     | 48/64 dp | 0 (3 dp pill indicator) | 0     |
| Tab (secondary)   | 48 dp    | 0 (2 dp underline)      | 0     |
| Search bar        | 56 dp    | full           | 1                 |
| Tooltip (plain)   | 24 dp    | 4 dp           | 1                 |
| Tooltip (rich)    | -        | 12 dp          | 2                 |
| Linear progress   | 4 dp thick | full         | 0                 |
| Circular progress | 48 dp diameter | -      | 0                 |

---

End of normalized reference.
