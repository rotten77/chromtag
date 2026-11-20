# SiteInspire Brutalist — Design Intelligence

**Brand / Archetype:** SI-Brutalist
**Category:** High-End Radical Design, Fashion/Print-inspired Web, Unconventional Agency
**Vibe:** Loud, modular, aggressive constraints, zero apologies for structure.

> **Instruction for AI:** This is a curated archetype from SiteInspire representing high-end Brutalism (often called Neo-Brutalism). DO NOT use standard SaaS components (no soft 8px border-radius, no subtle drop shadows). Everything relies on modular grids, thick borders, high-contrast, and monospaced or highly weighted neutral typography.

---

## 1. Fundamentals

### Colors

Neo-Brutalism is about the harsh reality of the browser, not trying to hide it.

- **Background (Root):** Pure White `#FFFFFF` or pale, aggressive primary colors (like a washed out yellow `#F8F8A2` or raw cyan `#00FFFF`).
- **Text (Primary):** Pure Black `#000000`. Absolutely unforgiving black. No muting. No `#333`.
- **Borders / Separators:** Pure Black `#000000`. Heavy. `1px`, `2px`, or even `4px` solid rules.
- **Accents (Hyperlinks / Hover):** Primary neon (magenta, cyan, red) or pure inverted black boxes.

### Typography

- **Display (H1, Titles):** Helvetica, Arial Black, or brutally heavy modern Sans (e.g. *Inter 900*, *Söhne Breit*), and Mono-fonts (*Space Mono*, *IBM Plex Mono*).
- **Scale:** Loud and unsophisticated. Titles take up the entire horizontal space. `clamp(40px, 8vw, 120px)`.
- **Body & Metadata:** Always highly legible Grotesk or Monospace. `14px` or `16px`. Often strictly uppercase for labels.

---

## 2. Layout & Spacing

### The Macro Grid (CSS Grid / Flex)
- **Modular / Boxy:** The entire website exists within visible borders. It looks like a brutalist blueprint or an old newspaper. The grid lines are visible.
- **No Whitespace Leaks:** Every element is contained within a box. If there is empty space, that space is inside a box with a solid black border.
- **Columns:** 2, 3, or 4 rigid columns. Content rarely spans organically. It snaps strictly to these grid cells.

### Spacing (The Rules)
- **Sharp & Systemic:** Padding inside boxes is strictly uniform. E.g., `padding: 24px` universally for every single block in the grid. No exceptions for mobile or desktop, just scaling.

---

## 3. UI Components & "Anti-Components"

- **Buttons:** Sharp rectangles. `border: 2px solid #000; background: #fff; color: #000; box-shadow: 4px 4px 0px #000;`. No border-radius.
- **Marquees:** CSS Scrolling text (`<marquee>` reborn in CSS). Large, repeating text on loop stretching across the viewport, bounded by thick black lines.
- **Navigation:** Extremely utility-driven. Often a sticky top bar with a thick bottom border, plain text links, raw unstyled appearance. A massive logo taking up as much space as the links.
- **Images:** Always have a 1px or 2px solid black border around them. No rounding. Ever.

---

## 4. Motion & Interaction

- **Global Easing:** Snap, don't smooth. Use `cubic-bezier(0.8, 0, 0.1, 1)` or even linear steps for hover states.
- **Hover States:** Immediate color inversion (Black to White), or pushing the element down/right by 4px to simulate physical buttons.
- **Animations:** Fast, jittery, mechanical. Stop using long `1000ms` fades. A menu should snap open in `150ms`.

---

## 5. Claude Implementation Rules (Tailwind Examples)

1. **When styling layouts:** Wrap everything in explicit borders. Use `border-t-2 border-black divide-x-2 divide-black` on flex containers to build the blueprint look.
2. **When styling typography:** Use `font-mono uppercase tracking-widest font-bold` for labels and meta. Use massive `tracking-tighter font-black` for headers. Do not use soft gray text. Use `text-black`.
3. **When doing buttons/cards:** Forget rounded corners (`rounded-none`). If shadow is needed, use hard offsets: `shadow-[4px_4px_0px_#000]`.
4. **Spacing:** Make padding uniform and tight within the grid cells: `p-6` on every item inside the grid.