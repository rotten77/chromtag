# WCAG 2.2 — Web Content Accessibility Guidelines

**Source:** https://www.w3.org/TR/WCAG22/
**Type:** Normative accessibility standard (W3C Recommendation)
**Why it matters:** Legal and moral baseline for digital accessibility. AA is the de facto global compliance target. Design decisions that violate WCAG silently exclude users with disabilities.

**Structure:** 4 principles → 13 guidelines → 78 testable success criteria, each rated **A** (minimum), **AA** (standard target), or **AAA** (enhanced).

**9 criteria new in WCAG 2.2** (added since 2.1): 2.4.11, 2.4.12, 2.4.13, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8, 3.3.9. **Removed:** 4.1.1 Parsing (obsolete).

---

## PRINCIPLE 1 — PERCEIVABLE

Information and UI components must be presentable to users in ways they can perceive.

### Guideline 1.1 — Text Alternatives

**1.1.1 Non-text Content (A)** — All non-text content presented to the user has a text alternative serving the equivalent purpose. Exceptions: controls (name), time-based media (descriptive label), tests (descriptive label), sensory experiences (descriptive label), CAPTCHAs (text + alternative modality), decorative content (implemented to be ignored by AT).
*Apply:* every `<img>` needs `alt`; decorative images `alt=""`; icon-only buttons need accessible name.

### Guideline 1.2 — Time-based Media

**1.2.1 Audio-only and Video-only (Prerecorded) (A)** — Text alternative for audio-only; text or audio alternative for video-only.
**1.2.2 Captions (Prerecorded) (A)** — Captions for all prerecorded audio in synchronized media.
**1.2.3 Audio Description or Media Alternative (Prerecorded) (A)** — Alt or audio description for prerecorded video in synchronized media.
**1.2.4 Captions (Live) (AA)** — Captions for all live audio in synchronized media.
**1.2.5 Audio Description (Prerecorded) (AA)** — Audio description for all prerecorded video in synchronized media.
**1.2.6 Sign Language (Prerecorded) (AAA)** — Sign language interpretation for all prerecorded audio.
**1.2.7 Extended Audio Description (Prerecorded) (AAA)** — When standard descriptions don't fit into pauses.
**1.2.8 Media Alternative (Prerecorded) (AAA)** — Full text alternative for prerecorded synchronized / video-only.
**1.2.9 Audio-only (Live) (AAA)** — Text alternative for live audio-only.

### Guideline 1.3 — Adaptable

**1.3.1 Info and Relationships (A)** — Structure and relationships conveyed visually must be programmatically determinable or available in text.
*Apply:* use semantic HTML (`<h1>`–`<h6>`, `<nav>`, `<main>`, `<ul>`, `<table><th>`, `<label for>`), not styled `<div>` soup.

**1.3.2 Meaningful Sequence (A)** — Reading order must be programmatically correct when it affects meaning.

**1.3.3 Sensory Characteristics (A)** — Don't rely solely on shape, color, size, position, orientation, or sound ("click the red button on the right").

**1.3.4 Orientation (AA)** — Don't restrict to portrait OR landscape unless essential.

**1.3.5 Identify Input Purpose (AA)** — Input fields for user info use the HTML `autocomplete` token (name, email, tel, etc.).

**1.3.6 Identify Purpose (AAA)** — UI components/icons/regions can be programmatically identified (e.g., ARIA landmarks).

### Guideline 1.4 — Distinguishable

**1.4.1 Use of Color (A)** — Color is never the only means to convey info, action, state, or distinction. Pair with text, icon, shape, or pattern.

**1.4.2 Audio Control (A)** — Auto-playing audio > 3s must be pausable/stoppable or have independent volume control.

**1.4.3 Contrast (Minimum) (AA)** — Text contrast ≥ **4.5:1**. Large text (≥ 18pt, or ≥ 14pt bold / 24px / 18.66px bold) ≥ **3:1**. Incidental text and logotypes exempt.

**1.4.4 Resize Text (AA)** — Text resizable to **200%** without loss of content or functionality (excluding captions / images of text).

**1.4.5 Images of Text (AA)** — Use real text instead of images of text, unless customizable or essential (e.g., logos).

**1.4.6 Contrast (Enhanced) (AAA)** — ≥ **7:1** text, ≥ **4.5:1** large text.

**1.4.7 Low or No Background Audio (AAA)** — Background audio ≥ 20 dB below foreground speech, or removable.

**1.4.8 Visual Presentation (AAA)** — User-controlled fg/bg, line width ≤ 80 chars, no justified text, line spacing ≥ 1.5×, paragraph spacing ≥ 1.5× line spacing, 200% zoom without horizontal scroll.

**1.4.9 Images of Text (No Exception) (AAA)** — Images of text only decorative or where presentation is essential.

**1.4.10 Reflow (AA)** — Content works without horizontal scrolling at **320 CSS px** wide (vertical content) / 256 CSS px tall (horizontal content). Exceptions: data tables, maps, diagrams, toolbars, non-text content that needs 2D layout.
*Apply:* test every page at 320px width / 400% zoom; fix wherever a horizontal scrollbar appears.

**1.4.11 Non-text Contrast (AA)** — UI components (inputs, toggles, focus indicators) and graphical objects (chart elements, icon meanings) ≥ **3:1** against adjacent color. Exceptions: inactive components, UA default appearance.

**1.4.12 Text Spacing (AA)** — No loss of content/functionality when users override: line height ≥ 1.5× font size; paragraph spacing ≥ 2× font size; letter spacing ≥ 0.12× font size; word spacing ≥ 0.16× font size.

**1.4.13 Content on Hover or Focus (AA)** — Hover/focus popups must be: **dismissible** (keyboard without moving focus), **hoverable** (movable onto popup without dismissing), and **persistent** (stay until dismissed).

---

## PRINCIPLE 2 — OPERABLE

UI components and navigation must be operable by all.

### Guideline 2.1 — Keyboard Accessible

**2.1.1 Keyboard (A)** — All functionality operable by keyboard without requiring specific timing.

**2.1.2 No Keyboard Trap (A)** — Keyboard focus can always be moved away using standard keys (Tab, Esc).

**2.1.3 Keyboard (No Exception) (AAA)** — 2.1.1 with no timing exception.

**2.1.4 Character Key Shortcuts (A)** — Single-character shortcuts can be turned off, remapped, or only activate when component is focused.

### Guideline 2.2 — Enough Time

**2.2.1 Timing Adjustable (A)** — For every time limit: turn off, adjust to 10× default, or extend via warning (at least 20s before, at least 10 extensions). Exceptions: real-time essential (auctions), essential to activity, or > 20h.

**2.2.2 Pause, Stop, Hide (A)** — Moving/blinking/scrolling or auto-updating content lasting > 5s must be pausable/stoppable/hideable (unless essential).

**2.2.3 No Timing (AAA)** — No time limits except real-time events / non-interactive sync media.
**2.2.4 Interruptions (AAA)** — Users can postpone/suppress interruptions except emergencies.
**2.2.5 Re-authenticating (AAA)** — After session expiry, user continues without data loss.
**2.2.6 Timeouts (AAA)** — Warn users of inactivity-caused data loss unless data preserved ≥ 20h.

### Guideline 2.3 — Seizures and Physical Reactions

**2.3.1 Three Flashes or Below Threshold (A)** — Nothing flashes more than 3×/second, or flashes stay below the general and red flash thresholds.
**2.3.2 Three Flashes (AAA)** — Nothing flashes > 3×/second, period.
**2.3.3 Animation from Interactions (AAA)** — Motion animations from interactions can be disabled (respect `prefers-reduced-motion`).

### Guideline 2.4 — Navigable

**2.4.1 Bypass Blocks (A)** — Mechanism to skip repeated content (skip link, landmark, headings).
**2.4.2 Page Titled (A)** — Pages have titles describing topic/purpose.
**2.4.3 Focus Order (A)** — Focus order preserves meaning and operability.
**2.4.4 Link Purpose (In Context) (A)** — Link purpose determinable from link text alone or with programmatic context.
**2.4.5 Multiple Ways (AA)** — Multiple ways to find a page (search, sitemap, nav) except within a linear process.
**2.4.6 Headings and Labels (AA)** — Headings and labels describe topic or purpose.
**2.4.7 Focus Visible (AA)** — Keyboard focus indicator is visible. Never `outline: none` without a replacement.

**2.4.8 Location (AAA)** — User knows their location in the site (breadcrumbs, active nav).
**2.4.9 Link Purpose (Link Only) (AAA)** — Link purpose clear from text alone.
**2.4.10 Section Headings (AAA)** — Use headings to organize content.

**2.4.11 Focus Not Obscured (Minimum) (AA) — NEW in 2.2** — When focused, the component is **not entirely hidden** by sticky headers, cookie banners, chat widgets, or other author-created overlays.

**2.4.12 Focus Not Obscured (Enhanced) (AAA) — NEW in 2.2** — No part of the focused component is hidden.

**2.4.13 Focus Appearance (AAA) — NEW in 2.2** — Focus indicator ≥ 2 CSS px perimeter and contrast ratio ≥ **3:1** between focused and unfocused states.

### Guideline 2.5 — Input Modalities

**2.5.1 Pointer Gestures (A)** — Multipoint or path-based gestures have a single-pointer, non-path alternative (unless essential).
**2.5.2 Pointer Cancellation (A)** — For single-pointer: no-op on down-event, or up-event with abort/undo, or up-event reverses down, or down-essential.
**2.5.3 Label in Name (A)** — Accessible name contains the visible label text (voice control).
**2.5.4 Motion Actuation (A)** — Motion-operable features have UI alternatives and can be disabled.
**2.5.5 Target Size (Enhanced) (AAA)** — Pointer targets ≥ **44 × 44 CSS px**.
**2.5.6 Concurrent Input Mechanisms (AAA)** — Don't restrict input modality unless essential.

**2.5.7 Dragging Movements (AA) — NEW in 2.2** — Any drag functionality has a non-drag single-pointer alternative (unless dragging essential). E.g., sliders need +/- buttons; sortable lists need up/down controls.

**2.5.8 Target Size (Minimum) (AA) — NEW in 2.2** — Targets ≥ **24 × 24 CSS px**. Exceptions: equivalent alternative available, inline (within a sentence), user-agent-controlled, essential, or sufficient spacing (24px circle around target doesn't overlap others).

---

## PRINCIPLE 3 — UNDERSTANDABLE

Information and operation of UI must be understandable.

### Guideline 3.1 — Readable

**3.1.1 Language of Page (A)** — Page default language programmatically determinable (`<html lang="en">`).
**3.1.2 Language of Parts (AA)** — Language of passages determinable (`<span lang="fr">`).
**3.1.3 Unusual Words (AAA)** — Mechanism to identify idioms/jargon.
**3.1.4 Abbreviations (AAA)** — Mechanism for expanded forms.
**3.1.5 Reading Level (AAA)** — Supplement or rewrite at lower-secondary level if content exceeds it.
**3.1.6 Pronunciation (AAA)** — Mechanism for word pronunciation where meaning depends on it.

### Guideline 3.2 — Predictable

**3.2.1 On Focus (A)** — Receiving focus doesn't change context.
**3.2.2 On Input (A)** — Changing a control's setting doesn't auto-change context without warning.
**3.2.3 Consistent Navigation (AA)** — Nav appears in same relative order on repeated pages.
**3.2.4 Consistent Identification (AA)** — Components with same functionality are identified consistently across pages.
**3.2.5 Change on Request (AAA)** — Context changes only on user request (or off-switch available).

**3.2.6 Consistent Help (A) — NEW in 2.2** — Help/contact/feedback mechanisms repeated across pages occur in the **same relative order** on each page.

### Guideline 3.3 — Input Assistance

**3.3.1 Error Identification (A)** — Errors identified and described in text.
**3.3.2 Labels or Instructions (A)** — Labels/instructions provided for input.
**3.3.3 Error Suggestion (AA)** — If an error suggestion is known, provide it.
**3.3.4 Error Prevention (Legal, Financial, Data) (AA)** — For legal/financial/data-modifying submissions: reversible, checked, or confirmed.
**3.3.5 Help (AAA)** — Context-sensitive help available.
**3.3.6 Error Prevention (All) (AAA)** — Reversible/checked/confirmed for all submissions.

**3.3.7 Redundant Entry (A) — NEW in 2.2** — Info previously entered (or provided to the user) within the same process is **auto-populated or selectable**, except where re-entry essential or security-required.

**3.3.8 Accessible Authentication (Minimum) (AA) — NEW in 2.2** — No cognitive function test (remembering, transcribing, puzzle) required for authentication unless alt method exists, mechanism to assist, or object/personal-content recognition, or essential. *Implication:* Passwords must allow paste; CAPTCHAs are problematic without alternative.

**3.3.9 Accessible Authentication (Enhanced) (AAA) — NEW in 2.2** — No cognitive test even with object recognition/personal content, except essential.

---

## PRINCIPLE 4 — ROBUST

Content must be robust enough for reliable interpretation by user agents including AT.

### Guideline 4.1 — Compatible

**4.1.1 Parsing** — **REMOVED in WCAG 2.2** (now handled by browsers).

**4.1.2 Name, Role, Value (A)** — All UI components have programmatically determinable **name** and **role**; **states/properties/values** settable by the user can be programmatically set; changes are notified to AT.
*Apply:* custom components must set proper ARIA; native HTML controls are preferred because they do this for free.

**4.1.3 Status Messages (AA)** — Status messages (non-modal success/error/loading) are programmatically conveyed without taking focus (e.g., `aria-live`, role=`status` / `alert`).

---

## OPERATIONAL SUMMARY — MANDATORY AA BASELINE

What a designer must verify before declaring a page or component done:

### Color & contrast
- [ ] Body text ≥ 4.5:1; large text ≥ 3:1 (1.4.3)
- [ ] UI component borders, icons, focus rings ≥ 3:1 (1.4.11)
- [ ] Never color alone to convey state/meaning (1.4.1)
- [ ] Works with user-applied text-spacing (1.4.12)

### Typography & layout
- [ ] Real text, not images of text (1.4.5)
- [ ] Reflows at 320 CSS px / 400% zoom without horizontal scroll (1.4.10)
- [ ] Text resizes to 200% without loss (1.4.4)
- [ ] Works in portrait AND landscape (1.3.4)

### Structure
- [ ] Semantic HTML, correct heading hierarchy (1.3.1, 2.4.6)
- [ ] Skip link or landmarks (2.4.1)
- [ ] `<html lang>` + `lang=` on foreign phrases (3.1.1, 3.1.2)
- [ ] Page has descriptive `<title>` (2.4.2)
- [ ] Multiple ways to find pages (2.4.5)

### Keyboard & focus
- [ ] Every interactive element reachable AND operable by keyboard (2.1.1)
- [ ] No keyboard traps (2.1.2)
- [ ] Focus order matches visual/meaningful order (2.4.3)
- [ ] Visible focus indicator everywhere (2.4.7)
- [ ] Focus never hidden behind sticky/overlay content (2.4.11 — new)
- [ ] Char-key shortcuts configurable (2.1.4)

### Pointer & targets
- [ ] All targets ≥ 24×24 CSS px or spaced (2.5.8 — new)
- [ ] Drag gestures have a non-drag alternative (2.5.7 — new)
- [ ] Multipoint/path gestures have single-pointer alternative (2.5.1)
- [ ] Action fires on up-event, with abort (2.5.2)
- [ ] Accessible name contains visible label text (2.5.3)

### Forms
- [ ] Every input has a visible label or accessible name (3.3.2, 4.1.2)
- [ ] `autocomplete` tokens on personal-data fields (1.3.5)
- [ ] Errors identified in text, with suggestion (3.3.1, 3.3.3)
- [ ] Reversible / checked / confirmed for legal/financial/data (3.3.4)
- [ ] Previously-entered data auto-populated (3.3.7 — new)
- [ ] Auth does not require cognitive tests; paste allowed in password (3.3.8 — new)
- [ ] Status messages via `aria-live` / role=`status`, not focus shifts (4.1.3)

### Media & motion
- [ ] Captions on prerecorded + live video (1.2.2, 1.2.4)
- [ ] Audio description on prerecorded video (1.2.5)
- [ ] Nothing flashes > 3×/second (2.3.1)
- [ ] Respect `prefers-reduced-motion`
- [ ] Auto-playing audio >3s has controls (1.4.2)
- [ ] Autoplay/moving content >5s is pausable (2.2.2)

### Consistency
- [ ] Nav in same relative order across pages (3.2.3)
- [ ] Same-function components identified consistently (3.2.4)
- [ ] Help mechanism in same relative order across pages (3.2.6 — new)

### Non-text / alts
- [ ] Every meaningful image has meaningful `alt` (1.1.1)
- [ ] Decorative images `alt=""`
- [ ] Icon-only buttons have accessible name

### Hover/focus UI
- [ ] Dismissible, hoverable, persistent (1.4.13)

### ARIA
- [ ] Custom components set role/name/states; prefer native HTML (4.1.2)
- [ ] Status updates use `aria-live` (4.1.3)

---

## TESTING HEURISTICS (not normative, derived from criteria)

1. **Tab through every screen.** Focus must always be visible, never hidden, and order must make sense.
2. **Zoom to 400% / resize to 320 px width.** Nothing should require horizontal scrolling (tables/maps excepted).
3. **Check contrast with a contrast checker** for text (4.5:1), large text (3:1), and any UI-conveying graphic (3:1).
4. **Turn off styles / test with a screen reader** (VoiceOver, NVDA): every control has a name + role, every status message announces.
5. **Try by pointer only, no hover:** mobile works, drag has alternative.
6. **Try with `prefers-reduced-motion`:** no essential info lost.
7. **Forms: submit empty, submit invalid, abandon mid-flow:** errors clear, data preserved.

---

## COUNT SUMMARY

- **Total criteria:** 78 testable (50 at A/AA level, 28 at AAA level)
- **Distribution:** Perceivable 25 · Operable 27 · Understandable 17 · Robust 3
- **WCAG 2.2 new:** 9 (listed above)
- **Target compliance:** AA (includes A + AA). AAA is aspirational per-criterion, not a blanket goal.
