# SiteInspire Editorial — Design Intelligence

**Brand / Archetype:** SI-Editorial
**Category:** High-End Digital Editorial, Fashion, Luxury, Creative Agency
**Vibe:** Sophisticated, unapologetic typography, asynchronous layouts, breathing room.

> **Instruction for AI:** This is a curated archetype from SiteInspire representing high-end editorial design. DO NOT use standard SaaS components (no floating cards with heavy dropped shadows, no standard blue primary buttons). Everything relies on high contrast in typography, aggressive white space, and refined motion.

---

## 1. Fundamentals

### Colors

Editorial design is incredibly restrained when it comes to color. Color is reserved for photography, not UI elements.

- **Background (Root):** Warm Off-White `#F9F7F4` or `#FAFAFA`, never pure white (`#FFFFFF`) unless strictly necessary for contrast. Pure white can feel cheap in editorial.
- **Text (Primary):** Soft Black `#111111` or `#1A1A1A`. Never pure `000` for large blocks of text as it strains the eyes against off-white.
- **Text (Muted):** `#666666` or `rgba(17, 17, 17, 0.6)`.
- **Borders / Separators:** Only when absolutely necessary. Use alpha channels, not solid colors. `rgba(17, 17, 17, 0.1)`.
- **Accents:** If a primary CTA is needed, use inverted (Black background, Off-White text).

### Typography

Typography *is* the interface. This archetype uses extreme scale differences.

- **Display (H1, Titles):** Grand, elegant serif. Ideally highly readable but full of character. (e.g. *Ogg*, *Canela*, *Playfair Display*, *PP Editorial New*).
  - Scale: Massive. Use `clamp(80px, 12vw, 160px)`.
  - Leading (Line-height): Tight. `1.0` to `1.1`.
  - Tracking (Letter-spacing): `-0.02em` or `-0.03em`.
- **Body & Metadata:** Supremely clean, small grotesk. (e.g. *Inter*, *Helvetica Neue*, *Söhne*).
  - Scale: `14px` or `15px` for reading text. `12px` for metadata (dates, authors).
  - Leading: `1.5` to `1.6`.
  - Tracking: Normal or slightly open `0.01em`.

*(Never mix two different serif fonts. Use one grand Serif for display and one sterile Sans for structure.)*

---

## 2. Layout & Spacing

Throw away standard 8px-based 12-column symmetrical SaaS grids.

### The Macro Grid (CSS Grid)
- **Asymmetry is key.** If you have a 12 column grid, do not center the text in 8 columns. Put a massive title spanning columns 1-10, and a tiny block of text hanging off in columns 9-12.
- **Bleeds:** Let imagery break the grid. Push photos to the absolute edge of the viewport with `padding: 0`.

### Spacing (The "Breathing Room")
Editorial design uses terrifying amounts of whitespace. Do not fear the gap.
- **Vertical Rhythm (Between Sections):** `clamp(120px, 20vh, 240px)`.
- **Micro-Spacing (Between H1 and Body):** `48px` or `64px`.

---

## 3. UI Components & "Anti-Components"

- **Buttons:** Avoid chunky pill buttons. Use naked text links with a solid 1px underline (`text-underline-offset: 4px`), or a perfect rectangle button (0px border-radius) with no shadow.
- **Cards:** No cards! Do not wrap content in gray boxes with shadows. Let the typography and the imagery sit directly on the root background. Grouping is achieved entirely through proximity (Whitespace).
- **Navigation:** Floating, minimal. Often just a logo on the left and a "Menu" text-link on the right, or a strictly typed header sitting fixed with a blur or solid background.

---

## 4. Motion & Interaction

Animation must feel cinematic, not "app-like".

- **Global Easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (smooth, long tail).
- **Scroll Reveals:** Elements fade in and translate upward very slowly. (e.g. `transform: translateY(40px)`, duration: `1000ms`).
- **Parallax:** Images in hero sections subtly move at a different speed than the scroll wrapper. 
- **Image Hover:** Subtle, slow scale inside a hidden overflow container. (`transform: scale(1.05)`, duration: `800ms`). No drop-shadows on hover.

---

## 5. Claude Implementation Rules (Tailwind Examples)

1. **When styling layouts:** Do not use `py-12` or `py-16`. High-end editorial needs custom spacing. Use arbitrary values in Tailwind: `py-[15vh]` or `gap-[6vw]`.
2. **When styling typography:** Manually control leading and tracking. `text-[10vw] leading-none tracking-tight font-serif`.
3. **When doing cards/lists:** `flex flex-col gap-4` instead of wrappers. The image sits on top, the title below it, the metadata below that. No borders, no shadows.
4. **Borders:** Only use horizontal dividers (`border-t border-black/10`) to separate sections if necessary, never full boxes.