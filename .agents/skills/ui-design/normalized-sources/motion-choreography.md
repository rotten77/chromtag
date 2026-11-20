# Motion & Animation — Choreography, Physics, and the Web Primitives

Synthesized from:
- Emil Kowalski — *The Magic of Clip-Path* (emilkowal.ski/ui/the-magic-of-clip-path)
- `fliptheweb/motion-ui-design` — curated README index of motion resources
- uxderrick gist — "Web Animation Best Practices & Guidelines" (complete extract)
- Motion (motion.dev) — `animate()` spring API reference
- MDN — View Transitions API (`document.startViewTransition`, `::view-transition-*`)
- MDN — `@starting-style` at-rule + `transition-behavior: allow-discrete`

Covers what Apple HIG and Material Design do **not** — spring physics, curated easing presets, choreography patterns, web animation primitives (View Transitions, `@starting-style`, `clip-path`), performance discipline, and `prefers-reduced-motion` patterns at implementation level. Read after `apple-hig.md` §motion and `material-design-3.md` §motion.

---

## 1. Core principles (compiled from uxderrick + fliptheweb)

### 1.1 Purpose over decoration

Motion answers **four questions** about a state change:
1. **What is this?** — identity (new element vs existing)
2. **Where did it come from?** — spatial origin
3. **Where is it going?** — spatial destination
4. **What state is it in?** — active / disabled / loading / success

If an animation doesn't answer at least one of these, it's decoration. Delete or disable.

### 1.2 Speed + responsiveness

- **Keep animations under 300 ms** for optimal perceived performance (uxderrick).
- **Exception:** success / celebration moments may exceed 300 ms intentionally.
- Compatible with Material 150–250 ms UI / 400 ms max, Apple HIG fast-and-subtle stance, Doherty < 400 ms threshold. All three systems converge.

### 1.3 Placement — when to animate

**Animate:**
- State changes (checked/unchecked, open/closed, loading/loaded)
- Spatial transitions (this modal came from this button)
- Enter / exit (components appearing or leaving)
- Progress feedback (skeleton, scrubbing)
- User feedback (success, error, save confirmation)

**Don't animate** (all three sources agree):
- Keyboard-initiated actions users perform hundreds of times daily (typing, list append)
- Critical feedback (errors show instantly — no gating animation)
- Anything the user is already waiting for (don't animate the spinner-of-waiting)

### 1.4 Interruptibility — non-negotiable

- All animations **must be smoothly interruptible mid-sequence**. UI never locks.
- **CSS Transitions interrupt better than `@keyframes`** — the browser re-interpolates from the current computed value. Keyframes restart.
- Spring animations (motion.dev) handle interruption natively by picking up velocity.

### 1.5 Performance — only transform + opacity

- **Only `transform` and `opacity` are composited on the GPU** without layout or paint.
- Animating `width / height / top / left / padding / margin` triggers layout → paint → composite on every frame. On mid-range devices, this drops below 60 fps before the animation starts.
- Target: **60 fps** minimum (16.7 ms per frame budget).
- `contain: layout style paint;` on the animated container isolates work.
- `will-change: transform, opacity;` hints the compositor — **use sparingly**, reset to `auto` after the animation.

---

## 2. Production-ready easing presets (uxderrick)

Three curves cover ~90 % of UI work. Learn these values; avoid default `ease` (too generic) and `linear` (feels robotic for spatial motion).

### 2.1 Spring-like (energetic, slight overshoot)

```
cubic-bezier(0.34, 1.56, 0.64, 1)
```

Slight overshoot past the target, fast start, tiny bounce. Use for:
- Button hover / press (personality)
- Cards sliding in
- Success feedback
- Micro-interactions that want playfulness

Avoid on large page transitions (amplifies the overshoot) and critical destructive actions (overshoot reads as flippant).

### 2.2 Smooth ease-out (gentle, no overshoot)

```
cubic-bezier(0.16, 1, 0.3, 1)
```

Professional deceleration, no bounce. Use for:
- Modals opening
- Drawer / panel expand
- Page transitions
- Large-distance movements

Avoid on tight interactions (feels sluggish) and on elements needing immediate feedback.

### 2.3 Fast response (snappy, minimal hang)

```
cubic-bezier(0.4, 0, 0.2, 1)
```

Matches Material's **standard** curve. Quick in and out, no lingering. Use for:
- Loading spinners
- Toggle / checkbox
- Icon state change
- Tooltip appear
- Button press-down (80–100 ms)

Avoid on large spatial movements (feels abrupt).

### 2.4 Timing reference table (uxderrick, cross-checked against Material + Apple)

| Element | Duration | Curve | Reason |
|---|---|---|---|
| Button hover | 200 ms | spring-like | Response + personality |
| Button press | 80–100 ms | fast-response | Must feel instant |
| Modal entrance | 250–300 ms | smooth ease-out | Large movement, gentle |
| Slide transitions | 300 ms | spring-like | Direction reinforced by bounce |
| Success feedback | 600 ms | spring-like (stronger overshoot) | Celebration earns emphasis |
| Micro-interactions | 150–200 ms | spring-like | Quick + noticeable |
| Tooltip appear | 100 ms | fast-response | Informational, non-distracting |
| Loading spinner | 150 ms per cycle | linear (continuous) | Continuous motion |
| Page transition | 300 ms | smooth ease-out | Context change |
| Dropdown menu | 200 ms | smooth ease-out | Predictable, no bounce |

**Compatibility with existing §3 timing (Apple/Material):** the 150–250 ms UI window holds for short-distance moves. 250–300 ms for modals and 300 ms for page transitions stay inside Material's 400 ms maximum. The 600 ms success moment is an intentional exception — acknowledge it.

---

## 3. Spring physics (motion.dev)

Tweens (fixed duration + curve) cover most UI. **Springs** replace tweens when motion should feel weighted, interruptible, and responsive to current velocity (drag-to-dismiss, pull-to-refresh, drag handles, interactive carousels).

### 3.1 Parameters

| Param | Default | Effect |
|---|---|---|
| `stiffness` | 1 | Higher = more sudden movement |
| `damping` | 10 | Strength of opposing force. 0 = infinite oscillation |
| `mass` | 1 | Higher = more lethargic |
| `velocity` | current | Initial velocity (pass through from gesture) |
| `bounce` | 0.25 | 0–1. 0 = no bounce, 1 = extremely bouncy |
| `restSpeed` | 0.1 | Stop when speed < this |
| `restDelta` | 0.01 | Stop when displacement < this |
| `duration` | 800 ms | Total length (ms). Overridden by physics if specified |
| `visualDuration` | — | Seconds. Overrides `duration`. Bulk movement completes; bouncy oscillation lingers after |

### 3.2 Feel presets

Motion.dev itself doesn't codify named classifications, but the bounce axis maps to common UI feels:

- **Notification / message** — `bounce: 0` or `0.1`. Slides in, settles, done. Critically damped.
- **Snappy default** — `bounce: 0.2–0.3`. Tiny overshoot. Most buttons, cards.
- **Playful** — `bounce: 0.4–0.6`. Clear overshoot + oscillation. Emoji reactions, confetti, onboarding.
- **Bouncy (rare)** — `bounce: 0.8+`. Loud. Only for celebration or brand-led moments.

### 3.3 When spring beats tween

- **Interruptible motion** — user can drag mid-animation, spring uses current velocity.
- **Gesture-driven motion** — handoff from pan/drag feels continuous.
- **Reshaping layout** (Framer Motion's `layout`, FLIP technique below).
- **Natural-feeling decorative motion** (notification, reaction, badge pop).

### 3.4 When tween beats spring

- **Predictable duration matters** (choreographed sequences, video-synced transitions).
- **Deterministic end state timing** (modal must be visible exactly 200 ms after click for a metric).
- **Serious / utilitarian UI** (financial, medical, enterprise) — linear oscillation feels unprofessional.

### 3.5 FLIP technique

**F**irst, **L**ast, **I**nvert, **P**lay. Used by Framer Motion `layout` and React Spring:

1. Measure first position
2. Apply the final DOM change instantly
3. Compute the delta, apply inverse transform so the element *appears* at first position
4. Animate the transform back to zero

Enables animating layout reshapes using only `transform` (cheap) instead of `top/left/width/height` (expensive).

---

## 4. Web animation primitives — modern CSS APIs

### 4.1 View Transitions API

`document.startViewTransition(callback)` creates animated transitions between DOM states without hand-built before/after layers.

**Pseudo-element hierarchy** the browser generates:

```
::view-transition                     (root overlay)
└── ::view-transition-group(name)
    └── ::view-transition-image-pair(name)
        ├── ::view-transition-old(name)   (snapshot of previous state)
        └── ::view-transition-new(name)   (live new state)
```

**Name specific elements** so they transition independently:

```css
.hero-card {
  view-transition-name: hero-card;
}

::view-transition-old(hero-card) {
  animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) fade-out;
}

::view-transition-new(hero-card) {
  animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) fade-in;
}
```

**SPA trigger:**

```js
document.startViewTransition(() => {
  updateContent();
});
```

**MPA (cross-document):** requires `@view-transition { navigation: auto; }` in CSS and `PageRevealEvent` / `PageSwapEvent` for customization.

**Browser support (MDN, April 2026):**
- SPA (`startViewTransition`): Chrome 111+, Edge 111+, Opera 97+. Safari partial.
- MPA (`@view-transition`): Chrome 126+, Edge 126+, Opera 112+. Firefox + Safari trailing.
- **Ship as progressive enhancement** — guard with feature detect, fall back to instant swap.

**Gotchas:**
- Both old + new content exist in the DOM during the transition. Guard against duplicate event firings, form double-submits.
- API doesn't manage focus automatically. Move focus after `.finished` resolves.
- Complex named transitions cost paint. Test on mid-range Android.

**Reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    view-transition-name: none !important;
  }
  ::view-transition-group(*) { animation: none !important; }
}
```

Or JS-gated:

```js
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.startViewTransition(update);
} else {
  update();
}
```

### 4.2 `@starting-style` + `transition-behavior: allow-discrete`

**Problem:** CSS transitions don't trigger on an element's first render or when `display` toggles `none ↔ block`.

**Fix:** `@starting-style` defines the pre-render value. `allow-discrete` lets discrete properties (`display`, `overlay`) participate in transitions.

```css
[popover] {
  opacity: 1;
  transform: scaleX(1);
  transition:
    opacity 0.3s,
    transform 0.3s,
    display 0.3s allow-discrete,
    overlay 0.3s allow-discrete;
}

[popover]:not(:popover-open) {
  opacity: 0;
  transform: scaleX(0);
}

@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: scaleX(0);
  }
}
```

**Rules:**
- `@starting-style` must come **after** the base rule (equal specificity).
- Only applies on first render or re-show from `display: none`.
- Not a replacement for `@keyframes` — only for CSS transitions.

### 4.3 `clip-path` animation (Kowalski)

`clip-path` transcends shape trimming. Animate it like `transform` — **hardware-accelerated**, no layout shifts, no DOM additions.

**Canonical uses:**

| Pattern | Technique |
|---|---|
| Image / card reveal | `inset(0 0 100% 0)` → `inset(0 0 0 0)` |
| Before/after slider | `inset(0 50% 0 0)` driven by pointer X |
| Text mask split | Stack two text layers; `inset(0 0 50% 0)` + `inset(50% 0 0 0)` |
| Tab underline / active pill | `inset(0 75% 0 0% round 17px)` shifts across tabs — single element, no layout thrash |
| Theme swap | Dual-rendered page, clip-path reveals underlying theme (flag: "hacky" — Kowalski) |
| Scroll reveal | Clip-path inset driven by `IntersectionObserver` or `useInView` |

**Recommended easing for reveals:** `cubic-bezier(0.77, 0, 0.175, 1)` (Kowalski) — sharp mid-curve, eases in and out.

**Why it matters:** the tab-underline pattern without `clip-path` requires either (a) layout animation (expensive) or (b) an absolutely-positioned pill tracked via JS measurement (fragile). `clip-path` collapses both into one CSS property.

---

## 5. Choreography — sequencing multiple elements

### 5.1 Stagger (Material's term; generic pattern)

Offset child animations by a small delay so the eye scans instead of being hit by a wall of motion.

```css
.stagger > :nth-child(1) { animation-delay: 0ms; }
.stagger > :nth-child(2) { animation-delay: 50ms; }
.stagger > :nth-child(3) { animation-delay: 100ms; }
/* cap at ~8 — cumulative delay past ~400 ms feels slow */
```

Framer Motion equivalent via `staggerChildren`:

```jsx
const container = { show: { transition: { staggerChildren: 0.05 } } };
```

**Guidance:**
- 30–80 ms per step for lists.
- Cumulative delay ≤ 400 ms. Past that, the last item feels late.
- On re-enter (e.g., navigating back), consider skipping stagger — it only helps on first encounter.

### 5.2 Asymmetric parent/child (Material choreography)

When a parent container transforms, child elements should **not** simply ride along — they move on a shorter, faster curve so they appear independent. Example: opening a card into a detail view:

1. Card container grows 300 ms, smooth ease-out.
2. Inner text fades in at 150 ms delay, 200 ms duration, fast-response.
3. Primary CTA slides up at 200 ms delay, 180 ms, spring-like.

Rule: the container lands first, content settles second.

### 5.3 Continuity of movement

If an element exits one screen and enters another (navigation, modal), its trajectory should be **continuous**. Angle and velocity out ≈ angle and velocity in. View Transitions API + shared `view-transition-name` enforce this automatically.

### 5.4 Origin awareness

An animation starts from **where the user last interacted** (Kowalski, uxderrick). Menus open from the clicked trigger, modals grow from the button, not from the center of the viewport. Use `transform-origin` or JS-measured coordinates.

### 5.5 Shared vs radial transformation (Material terminology)

- **Shared** — element keeps its bounding box through the transition; morphs inner content. E.g., FAB expanding into sheet.
- **Radial** — element propagates outward from an origin; surrounding content reacts. E.g., ripple.

---

## 6. Accessibility — motion specifically

### 6.1 `prefers-reduced-motion` — non-negotiable

Global CSS fallback:

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

Framer Motion hook:

```jsx
const shouldReduceMotion = useReducedMotion();
// branch timings, disable stagger, prefer cross-fade over slide
```

**Reduced-motion alternatives:**
- Replace slide/scale transitions with cross-fades.
- Cut parallax entirely.
- Cut auto-rotating carousels; user drives.
- Keep essential feedback (focus ring, selected state, error shake) — disable only decorative motion.

### 6.2 Vestibular triggers

Avoid (reduce or disable with reduced-motion):
- Parallax scrolling
- Large-scale zoom / scale transforms (> 1.5× or < 0.5×)
- Auto-playing video on page load
- Rapid spinning elements
- Horizontal-panning page transitions on long scroll

### 6.3 Flashing

- **No more than 3 flashes per second** (WCAG 2.3.1).
- Blinking / strobing content never on by default.
- Avoid loading spinners that strobe color — keep hue constant, rotate geometry.

---

## 7. Pre-ship motion checklist (consolidated)

- [ ] Each animation answers: what / from / to / state. If not, delete.
- [ ] Duration < 300 ms unless intentional exception (success, celebration)
- [ ] Only `transform` and/or `opacity` animate (or `clip-path` for reveals)
- [ ] Custom `cubic-bezier` — not default `ease` or `linear` for spatial motion
- [ ] `prefers-reduced-motion` honored — cross-fade fallback or instant
- [ ] Smoothly interruptible (no UI lockup mid-animation)
- [ ] Originates from contextual location (not center of viewport by default)
- [ ] Stagger cumulative delay ≤ 400 ms
- [ ] Parent container lands first, children second (asymmetric choreography)
- [ ] Runs at 60 fps on target devices (Chrome DevTools Performance, mid-range Android)
- [ ] `will-change` reset to `auto` after animation ends
- [ ] Tested in Chrome, Firefox, Safari + one mobile browser

---

## 8. Common mistakes (uxderrick + fliptheweb cross-referenced)

- Animating layout properties (`height`, `top`, `padding`) instead of `transform`.
- Ignoring `prefers-reduced-motion`.
- Over-animating — every state change gets a transition → motion fatigue.
- Inconsistent timing — 3 buttons in a row with 3 different durations.
- Blocking interactions — the animation finishes before the click registers.
- Long page transitions (> 400 ms) on every navigation.
- Bouncy easing on serious UI (financial, medical, enterprise).
- Animation on the spinner itself without progress indication (Material-cited anti-pattern).
- Parallax that doesn't disable for reduced motion.
- Auto-playing hero video without captions, without pause, without reduced-motion gate.
- `@keyframes` where a CSS transition would interrupt cleanly.
- Stagger on every re-render — feels novel first time, laggy tenth time.

---

## 9. Tooling

**Easing generators:**
- easings.net — cheat sheet of named functions
- cubic-bezier.com — visual tuning
- easing.dev — modern presets

**Libraries:**
- **Motion** (motion.dev) / **Framer Motion** — spring + tween + gesture + layout.
- **React Spring** — pure-spring API, hooks-based.
- **GSAP** — industry standard, timeline-first.
- **Auto Animate** — zero-config for React / Vue / Svelte list transitions.

**Debugging:**
- Chrome DevTools → Performance tab → Frame rate overlay.
- Chrome DevTools → Rendering → Paint flashing, Layout shift regions, FPS meter.
- Firefox Animation Inspector.
- `performance.now()` + `requestAnimationFrame` for hand-rolled profiling.

---

## 10. Source-level agreements and divergences

**All sources agree:**
- Motion must earn its place (purpose over decoration).
- < 300 ms target for UI motion; keep below Doherty 400 ms.
- Only composite `transform` + `opacity` for performance.
- `prefers-reduced-motion` is mandatory, not optional.
- Interruptibility is a correctness requirement.
- Don't animate frequent keyboard actions.

**Divergences worth knowing:**
- **uxderrick's curve presets vs Material's `cubic-bezier(0.4, 0, 0.2, 1)`** — both functional. uxderrick offers three-curve system; Material offers four (standard, decelerate, accelerate, sharp). Pick one, stay consistent per product.
- **Spring vs tween** — motion.dev encourages spring by default; Material's 2026 guidance uses tween durations. For utility interfaces prefer tween; for gesture-heavy consumer apps spring wins.
- **View Transitions scope** — MDN treats it as the modern default; Framer Motion still ships its own layout animation system (works further back in browser support).
- **`clip-path` usage** — Kowalski treats it as primary animation tool; Material and Apple HIG don't mention it. Kowalski is ahead of the design systems.

---

## 11. Quick reference — pick in seconds

**"Element appears"** → `opacity 0→1` + `transform: translateY(4px)→0`, 200 ms, `cubic-bezier(0.16, 1, 0.3, 1)`

**"Element disappears"** → `opacity 1→0`, 150 ms, ease-in

**"Button press"** → `transform: scale(0.95)`, 80 ms in, 200 ms out, spring-like

**"Modal enters"** → `opacity 0→1` + `transform: scale(0.96)→1`, 250–300 ms, smooth ease-out

**"List renders"** → stagger 50 ms per item, cap 8 items, cross-fade under reduced-motion

**"Tab indicator moves"** → single element, animate `transform: translateX()` or `clip-path: inset()`, 200 ms spring-like

**"Page navigates"** → `startViewTransition`, 300 ms, smooth ease-out, reduced-motion → instant

**"Card expands to detail"** → FLIP technique (transform-only), 300 ms, spring bounce 0.2

**"Pull to refresh"** → spring, velocity handoff from pan, `bounce: 0.3`, `visualDuration: 0.6s`

**"Success confirmation"** → 600 ms, spring-like with overshoot, justified exception to < 300 ms rule
