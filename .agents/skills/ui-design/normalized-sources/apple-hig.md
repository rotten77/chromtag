# Apple Human Interface Guidelines — Normalized Summary

Source: https://developer.apple.com/design/human-interface-guidelines/
Scope: iOS, iPadOS, macOS, watchOS, tvOS, visionOS
Note: Content synthesized from the Apple Human Interface Guidelines. Specific numeric values (point sizes, target sizes, durations, opacities) preserved verbatim where Apple specifies them.

---

## Design Principles (Overview)

Apple's HIG is organized around a small set of fundamentals that apply across all Apple platforms:

- **Hierarchy** — Important content is prominent; supporting content recedes.
- **Harmony** — UI cooperates with device capabilities and system conventions.
- **Consistency** — Standard components and patterns behave predictably.
- **Depth** — Layering, motion, and materials communicate spatial relationships.
- **Deference** — UI should help people understand and interact with content, not compete with it.

Platforms covered: iOS, iPadOS, macOS, watchOS, tvOS, visionOS. Each platform extends these fundamentals with device-specific expectations (touch, pointer, Digital Crown, remote, TV distance, spatial input).

---

# FOUNDATIONS

## Accessibility

Apple requires that apps be usable by everyone. The HIG treats accessibility as a foundational concern, not an afterthought.

### Core requirements

- **Minimum touch target size (iOS/iPadOS):** 44×44 pt.
- **Minimum touch target size (watchOS):** 44×44 pt (comfort); individual tappable controls should be no smaller than the finger-friendly area — most watchOS interface controls sit at system-provided sizes that meet this.
- **Minimum focusable element on tvOS:** ensure elements are large enough for clear focus at ~10 ft (2–3 m) viewing distance; titles use large type (around 29 pt body at minimum) and buttons scale with focus.
- **visionOS:** provide at least 60×60 pt tap-size equivalents for eye-plus-pinch interactions, with ample padding between targets (roughly 16 pt minimum separation) to prevent mis-targeting with gaze.

### Color and contrast

- **Text contrast:** meet or exceed WCAG 2.1. Minimum **4.5:1** for normal text, **3:1** for large text (≥18 pt regular or ≥14 pt bold). Apple recommends aiming for **7:1** (WCAG AAA) whenever possible.
- **Don't** rely on color alone to convey meaning — pair it with text, shape, or icon.
- Support **Increase Contrast** and **Reduce Transparency** accessibility settings. When Increase Contrast is on, flatten translucent surfaces, strengthen separators, and darken/lighten colors to reach higher contrast.
- Test designs in Smart Invert and Classic Invert.

### Dynamic Type

- Support Dynamic Type so that body text scales from **xSmall** to **AX5** (largest accessibility size). Do not hard-code font sizes in UI chrome (titles, buttons, list rows).
- The largest standard content size (`XXXL`) scales body from 17 pt to 23 pt; the five accessibility sizes (AX1–AX5) scale body up to 53 pt.
- Text should **truncate or wrap gracefully**; switch from horizontal to vertical stacking of controls and labels at large sizes.
- Line length stays readable: aim for 50–75 characters per line at default size.

### VoiceOver

- Every interactive element needs an accessible **label**, **value** (if stateful), **hint** (optional, describes outcome), and **trait** (button, header, selected, adjustable, etc.).
- Avoid reading decorative images; mark them hidden from accessibility.
- Group related content so VoiceOver can swipe between chunks rather than every single subview.
- Announce changes that aren't visually obvious using `UIAccessibility.post(notification:argument:)` (iOS) or equivalents.

### Motion

- Respect **Reduce Motion**. Replace parallax, zoom-ins, and large-scale transitions with cross-fades or simple dissolves. Duration ~0.25–0.35 s.
- Avoid auto-playing animations that can't be paused. Provide a pause affordance for animated content longer than ~5 seconds.
- Avoid flashes more than **3 Hz** to prevent triggering photosensitive seizures.

### Haptics, sound, captions

- Don't rely on sound alone — provide visual alternatives.
- Provide **captions** and **audio descriptions** for video content.
- Support **Live Captions** and **Made For iPhone hearing devices**.
- Haptic feedback should reinforce, not replace, visual/auditory cues.

### Assistive technologies to support

- VoiceOver, Switch Control, Voice Control, Full Keyboard Access, AssistiveTouch, Dwell Control, Guided Access, Eye Tracking (iPadOS/iOS 18+), Pointer Control.

### Do/Don't

- **Do** let users pick their preferred text size.
- **Do** provide a minimum 44×44 pt tap target for any actionable element.
- **Don't** use color as the only way to communicate state.
- **Don't** disable system-provided accessibility affordances (e.g., Dynamic Type, Smart Invert).

---

## Branding

- Integrate your brand without overriding system conventions.
- **Don't** put your logo in the top navigation bar at the expense of the screen title — iOS reserves that area for navigation context.
- Use the app icon and launch screen as primary brand real estate.
- Avoid splash screens that delay entry. Launch screens should mimic the first screen of content (no loading indicators, no marketing copy).
- Match Apple trademark guidelines: "iPhone" not "IPHONE", "App Store" capitalized exactly.
- Include the Apple-provided **"Download on the App Store"** badge in marketing materials only; never modify it.

---

## Color

Apple provides a **system color palette** that automatically adapts to Light and Dark modes, high-contrast settings, and tinting.

### System colors (iOS/iPadOS)

Eight tinted system colors, each with light/dark variants and accessible (high-contrast) variants:

| Name | Light Default (RGB) | Dark Default (RGB) |
|---|---|---|
| systemRed | 255, 59, 48 | 255, 69, 58 |
| systemOrange | 255, 149, 0 | 255, 159, 10 |
| systemYellow | 255, 204, 0 | 255, 214, 10 |
| systemGreen | 52, 199, 89 | 48, 209, 88 |
| systemMint | 0, 199, 190 | 102, 212, 207 |
| systemTeal | 48, 176, 199 | 64, 200, 224 |
| systemCyan | 50, 173, 230 | 100, 210, 255 |
| systemBlue | 0, 122, 255 | 10, 132, 255 |
| systemIndigo | 88, 86, 214 | 94, 92, 230 |
| systemPurple | 175, 82, 222 | 191, 90, 242 |
| systemPink | 255, 45, 85 | 255, 55, 95 |
| systemBrown | 162, 132, 94 | 172, 142, 104 |

### System grays (six levels)

- systemGray through systemGray6, with grays in the light palette ranging from (142, 142, 147) down through increasingly pale grays (242, 242, 247); dark palette uses inverted progression.

### Semantic label / fill / background colors

Use these instead of hard-coded grays:

- **Label colors:** `label`, `secondaryLabel`, `tertiaryLabel`, `quaternaryLabel` (use for primary, caption, placeholder, and disabled text respectively).
- **Fill colors:** `systemFill`, `secondarySystemFill`, `tertiarySystemFill`, `quaternarySystemFill` (for shapes behind/around content, sliders, segments, etc.).
- **Background colors:**
  - `systemBackground`, `secondarySystemBackground`, `tertiarySystemBackground` — for standard (non-grouped) interfaces.
  - `systemGroupedBackground`, `secondarySystemGroupedBackground`, `tertiarySystemGroupedBackground` — for grouped tables/forms.
- **Separator:** `separator` (semi-transparent; allows underlying content to show) and `opaqueSeparator`.
- **Tint:** each app picks a primary tint; individual views can override. On iOS, tint colors show on buttons, switches, active selections.

### Contrast modes

- When **Increase Contrast** is on, the system swaps in higher-contrast variants automatically for semantic colors. Hard-coded colors won't adapt — prefer semantic names.

### Platform differences

- **macOS** — adds `controlAccentColor` (user-configurable in System Settings: Blue, Purple, Pink, Red, Orange, Yellow, Green, Graphite) and `selectedContentBackgroundColor`. Windows use `windowBackgroundColor`; controls use `controlBackgroundColor`.
- **watchOS** — limited system color palette. Backgrounds default to **black** (OLED power savings). Avoid large light-colored areas.
- **tvOS** — uses specific focus color effects; avoid pure white (use `#F2F2F2` or systemBackground). Text is light on dark by default.
- **visionOS** — uses system-supplied **glass materials** for background; don't specify your own background colors for windows. Use vibrant foreground colors carefully to ensure legibility on glass.

### Do/Don't

- **Do** use semantic colors so your UI adapts to light/dark/contrast modes automatically.
- **Do** test at both WCAG AA (4.5:1) and high contrast AAA (7:1) where possible.
- **Don't** use color to convey critical state without a secondary signal.
- **Don't** use red/green as the only distinguishing colors (colorblindness).
- **Don't** set opaque backgrounds on visionOS windows.

---

## Dark Mode

- Dark Mode is system-wide; apps must support it unless the experience is specifically content-driven (e.g., a photo editor with a fixed dark canvas).
- Use **semantic colors** (`label`, `systemBackground`) so colors swap automatically.
- **Elevation through lightness:** in Dark Mode, higher-altitude surfaces are lighter (inverted from Light Mode). Base background ~#000000 → elevated modal ~#1C1C1E.
- Reduce pure white (#FFFFFF) in large areas; use `label` or off-white.
- **Desaturate** vivid colors so they don't vibrate against dark backgrounds.
- Re-test contrast: dark text on bright accent colors may still need adjustment.
- SF Symbols and system glyphs auto-invert.
- Test images: thin dark strokes on transparent PNGs disappear in Dark Mode — consider a light/dark asset pair.

---

## Icons

### App icons

- **iOS/iPadOS app icon:** 1024×1024 px master. Render at 180×180 (iPhone @3x), 167×167 (iPad Pro), 152×152 (iPad), 120×120 (iPhone @2x). Corners are system-masked (~22.37% radius on iOS).
- **macOS app icon:** 1024×1024 master. Rounded-square mask on macOS 11+. Suggest tilting/shadowing for 3D depth. No transparent background.
- **watchOS app icon:** circular mask. Sizes 48×48 pt up through 108×108 pt depending on model.
- **tvOS app icon:** layered image (3 layers minimum, up to 5). Parallax effect moves layers independently on focus. 1920×720 (top shelf), 400×240 (app icon with layers).
- **visionOS app icon:** circular, composed of up to 3 layers. Rendered with depth on hover. 1024×1024 per layer.

### Design rules for app icons

- **Do** make it memorable and recognizable at small sizes.
- **Do** fill the entire icon area — don't leave transparent padding (iOS masks it).
- **Don't** use photographs (they become illegible at small sizes).
- **Don't** include text (except a wordmark letter if essential to brand).
- **Don't** replicate Apple UI elements (e.g., don't use the Camera app style).
- Use a simple, bold silhouette. Prefer a **single focal element**.

### SF Symbols

- Apple's icon library — **6,000+** symbols (SF Symbols 5+).
- Nine weights: Ultralight, Thin, Light, Regular, Medium, Semibold, Bold, Heavy, Black.
- Three scales: Small, Medium (default), Large.
- Variable color for state changes (e.g., Wi-Fi signal strength).
- Animations: Bounce, Pulse, Scale, Variable Color, Wiggle, Rotate, Breathe, Appear/Disappear.
- Symbols align to the cap-height of adjacent text automatically.
- **Do** use SF Symbols for common glyphs (share, back, settings, menu).
- **Don't** alter existing SF Symbol shapes; add badges via the system's multicolor/tinting variants.

### Custom symbols

- Design to the SF Symbols template: align to baseline, cap height, x-height as guides. Export as an SF Symbols template SVG.

---

## Layout

### Safe areas and margins

- **iPhone:** respect safe area — content must stay inside the area not covered by status bar, home indicator, Dynamic Island, notch.
  - Default left/right margin: **16 pt** (compact width) or **20 pt** (regular).
  - Status bar: 44 pt tall (with notch/Dynamic Island), 20 pt (without).
  - Home indicator: 34 pt bottom safe area.
- **iPad:** margins scale with window size. **20 pt** edges in full-screen; in Split View or Slide Over, revert to compact metrics.
- **macOS:** window titlebar 28 pt (standard) or 52 pt (with toolbar). Content inset ~20 pt from window edges for modal sheets; 0 for documents.
- **Apple Watch:** content stays within a small inset from the bezel; rounded corners follow display curvature. 38/40/41 mm and 44/45/49 mm cases. Scrollable content uses full height.
- **Apple TV:** safe area is ~**5%** inset from screen edges to account for overscan. Avoid putting critical content at the very edge.
- **visionOS:** windows have a default size but no hard constraint; users resize freely. Keep primary content within a 1280×720 pt **ideal window size** for comfortable viewing distance.

### Spacing scale

- Standard system spacing is built around **8 pt increments**: 4, 8, 12, 16, 20, 24, 32, 40.
- Stack spacing defaults (`UIStackView`): 8 pt.
- Grouped table section spacing: 35 pt between sections on iOS.

### Grids

- No mandated grid; use the system spacing scale. SwiftUI `Grid`, `LazyVGrid`, and `LazyHGrid` are recommended over manual calculations.
- iPadOS supports multi-column layouts at regular width; collapse to single column in compact width.

### Adaptive layouts

- Design for **size classes**: Compact vs Regular in each axis.
- **iPhone portrait:** compact width × regular height.
- **iPhone landscape (most):** compact width × compact height.
- **iPhone Plus/Max landscape:** regular width × compact height.
- **iPad:** regular × regular unless in Split View/Slide Over.
- Use **Auto Layout** (UIKit) or SwiftUI's layout system with `.frame(minWidth:)`, `.layoutPriority()`.

### Orientation

- Support both portrait and landscape unless the experience truly requires one (e.g., a racing game). Mark allowed orientations in Info.plist.
- Don't rely on device rotation to switch modes when iPad Stage Manager or Split View is in use.

### Right-to-Left layouts

- Mirror horizontal flows (back chevrons, progress indicators, reveal gestures).
- Don't mirror: media controls (playback always goes left-to-right), numbers, timecodes, musical notation.

---

## Materials

Translucent background materials blur underlying content and adapt to light/dark modes.

### iOS system materials (5 levels)

| Name | Use |
|---|---|
| Ultra Thin Material | Subtle tinting; navigation bars over rich content |
| Thin Material | Lightweight sheets, toolbars |
| Regular Material | Default — most modal sheets, popovers |
| Thick Material | Heavier separation from background |
| Chrome Material | Persistent UI chrome; strongest contrast to content |

### Vibrancy

- Use **vibrancy** on content placed on top of a material. It amplifies the underlying color through the blur.
- Label vibrancy levels: primary, secondary, tertiary, quaternary — match semantic label colors.
- Fill vibrancy: primary, secondary, tertiary.

### visionOS glass

- All visionOS windows use a shared **glass** material: slightly translucent, with specular highlights on edges, responsive to environment lighting.
- **Don't** fill a visionOS window background with opaque color — it breaks the glass illusion.
- Use vibrant foreground colors for primary actions.

### Do/Don't

- **Do** use materials for transient overlays (menus, toolbars, sheets).
- **Don't** layer multiple materials — creates muddy stacking.
- **Don't** place non-vibrant color on top of a material.

---

## Motion

### Purpose of motion

- **Communicate status** (loading spinners, progress bars).
- **Establish hierarchy** (modals rise from below; pushes slide in from trailing edge).
- **Provide feedback** (tap highlights, pull-to-refresh).
- **Guide attention** (new element fades in at center of focus).

### Duration guidance

- **Micro-interactions** (button press, toggle): 100–200 ms.
- **Transitions within a screen** (list insert/remove): 250–300 ms.
- **Full-screen transitions** (modal presentation): 300–400 ms.
- **Custom long animations**: generally avoid over 500 ms — feels sluggish.

### Easing

- Default iOS easing: `easeInOut` (cubic) for most animations.
- `easeOut` for entering content (feels natural — quick arrival, soft landing).
- `easeIn` for exiting content.
- Spring animations: system uses `interactiveSpring()` with damping ~0.825 for interactive responses.

### Reduce Motion

- When user enables **Reduce Motion**, replace:
  - Parallax → static images.
  - Zoom transitions → cross-fade (250 ms).
  - Push/pop transitions → dissolve.
  - Auto-play video → require tap.
- Still animate the essentials (e.g., loading spinners) so the user knows state is changing.

### Parallax and 3D motion

- Used sparingly on tvOS focus, Lock Screen wallpapers, iPadOS Home Screen.
- **Don't** use parallax in content areas — it's purely decorative and can cause nausea.

---

## Privacy

- Request permission **at the moment of first use**, not at launch.
- Provide a clear **purpose string** (e.g., `NSCameraUsageDescription`) that explains the specific benefit to the user.
- Use the **least-privileged** API: `PHPickerViewController` to pick photos without the full Photos permission; `CLLocationManager` with `requestWhenInUseAuthorization` before upgrading to Always.
- Show the **privacy-sensitive indicators** users expect:
  - Microphone and camera show an orange/green status dot in the status bar.
  - Clipboard reads show a toast banner ("Your Clipboard").
  - Location use shows the arrow icon.
- Provide a visible affordance (e.g., blue bar, green bar) when recording or sharing in the background.
- Support **App Tracking Transparency (ATT)** — present the system prompt before tracking across apps.
- Never pre-fill personal data without permission.

### Do/Don't

- **Do** explain *why* before requesting a permission (prime with a custom pre-prompt if helpful).
- **Don't** request permissions you don't currently need.
- **Don't** bury your privacy explanation — keep it in the opt-in flow.

---

## Right to Left

- Mirror the layout for languages that read RTL (Arabic, Hebrew, Farsi, Urdu).
- Use **leading/trailing** constraints instead of left/right in code.
- SF Symbols have automatic RTL mirroring variants (e.g., chevron.backward vs chevron.forward; use the directional names, not `.left`/`.right`).
- **Do mirror:**
  - Navigation chevrons.
  - Sliders (but keep value increments LTR if they're purely numeric).
  - Tab bars where order implies time/sequence.
  - Text alignment.
- **Don't mirror:**
  - Media playback controls (play triangle always points forward in time).
  - Timecodes and digital clocks.
  - Sheet music, chess boards, map compass roses.
  - Charts with real-world time axes.
- Test all flows in RTL; screenshot reviewer sees them in the submitted locale.

---

## Spatial Layout (visionOS)

### Ornaments

- Ornaments are auxiliary controls that float alongside a window. Use for toolbars, tab bars, playback controls. They rest at the **edge** of the parent window and never overlap content.

### Depth

- All visionOS apps live in a shared space by default. Windows are 2D planes with slight depth.
- Use **z-axis** sparingly — excessive depth is tiring. Limit stacking to ~3 visible layers.
- Key distances: windows render best **1–1.5 m** in front of the viewer.

### Immersive spaces

- **Mixed immersion:** user sees your content overlaid on their environment.
- **Progressive immersion:** user can adjust level via Digital Crown.
- **Full immersion:** completely replaces the environment; use only for experiences that justify it (meditation, cinematic viewing).

### Eye-targeted UI

- Make tap targets at least **60×60 pt** equivalent with generous padding (~16 pt between interactive elements).
- Use **hover effects** to confirm focus; rely on the system-provided hover effect (soft glow).
- **Don't** build custom hover animations that conflict with the system's.

---

## Typography

Apple ships **San Francisco (SF)** as the system typeface plus **New York** (serif) and **SF Mono**.

### SF families

- **SF Pro** — default for iOS, iPadOS, macOS, tvOS, visionOS. Two optical sizes: **Display** (20 pt+) and **Text** (<20 pt). Variable width: SF Pro Condensed, Regular, Expanded.
- **SF Compact** — narrower, used on watchOS for space efficiency.
- **SF Mono** — for fixed-width content: code, timers, tabular numerics.
- **SF Arabic**, **SF Armenian**, **SF Georgian**, **SF Hebrew** — language-specific counterparts.
- **New York (NY)** — serif, for reading, editorial, or emphasis contrast.

### iOS Dynamic Type text styles (pt size @ default "Large")

| Style | Size | Weight | Leading |
|---|---|---|---|
| Large Title | 34 pt | Regular | 41 pt |
| Title 1 | 28 pt | Regular | 34 pt |
| Title 2 | 22 pt | Regular | 28 pt |
| Title 3 | 20 pt | Regular | 25 pt |
| Headline | 17 pt | Semibold | 22 pt |
| Body | 17 pt | Regular | 22 pt |
| Callout | 16 pt | Regular | 21 pt |
| Subheadline | 15 pt | Regular | 20 pt |
| Footnote | 13 pt | Regular | 18 pt |
| Caption 1 | 12 pt | Regular | 16 pt |
| Caption 2 | 11 pt | Regular | 13 pt |

### Dynamic Type size categories

Seven content sizes (small end to top of standard):
- xSmall, Small, Medium, Large (default), xLarge, xxLarge, xxxLarge.

Five accessibility sizes (AX1–AX5):
- Accessibility Medium (AX1), Large (AX2), xLarge (AX3), xxLarge (AX4), xxxLarge (AX5).

Body text scales from ~14 pt (xSmall) to ~53 pt (AX5).

### macOS text styles

Similar scale, with macOS-specific defaults:
- Large Title 26 pt / 32 pt leading.
- Title 1 22 pt / 26 pt.
- Title 2 17 pt / 22 pt.
- Title 3 15 pt / 20 pt.
- Headline 13 pt Bold / 16 pt.
- Body 13 pt / 16 pt.
- Callout 12 pt / 15 pt.
- Subheadline 11 pt / 14 pt.
- Footnote 10 pt / 13 pt.
- Caption 1 10 pt / 13 pt.
- Caption 2 10 pt Medium / 13 pt.

### watchOS text styles

Dynamic Type on watchOS spans xSmall to xxxLarge (no AX sizes on Watch).
- Large Title 34 pt / 41 pt.
- Title 1 30 pt.
- Title 2 22 pt.
- Title 3 18 pt.
- Headline 16 pt Semibold.
- Body 16 pt.
- Caption 1 14 pt.
- Caption 2 13 pt.
- Footnote 12 pt.

### visionOS text styles

Type is designed for depth — displayed at ~1 m distance, sizes scale up.
- Large Title 56 pt / 68 pt leading.
- Title 1 44 pt / 52 pt.
- Title 2 30 pt / 38 pt.
- Title 3 24 pt / 32 pt.
- Headline 20 pt Semibold.
- Body 17 pt.
- Callout 16 pt.
- Subheadline 15 pt.
- Footnote 13 pt.
- Caption 1 12 pt.
- Caption 2 11 pt.

### Weights available in SF

Ultralight (100), Thin (200), Light (300), Regular (400), Medium (500), Semibold (600), Bold (700), Heavy (800), Black (900).

### Tracking / letter-spacing

- Track negatively for **Display** sizes (−0.02 em to −0.04 em typical at titles).
- Track positively for **Text** at small sizes (+0.5 pt at 11 pt Caption 2).
- SF automatically applies optical tracking when you use text styles — don't override unless necessary.

### Line length

- Aim for **~50–75 characters per line** for comfortable reading.
- Use `.lineLimit` + `.truncationMode(.tail)` as needed.

### Do/Don't

- **Do** use semantic text styles (`.body`, `.headline`) so type scales with Dynamic Type.
- **Do** prefer SF Pro; switch to New York deliberately when serif adds value (reading mode, editorial branding).
- **Don't** hard-code point sizes in display chrome.
- **Don't** use more than 2–3 typefaces in a single design.

---

## Writing

### Voice and tone

- **Direct, conversational, human.** Avoid jargon.
- Use **active voice**: "Save your changes" not "Your changes can be saved".
- Refer to the user as **"you"**; refer to the app as **"the app"** or its name (not "we").
- Use **sentence case** for most UI text, including button titles on iOS: "Save and continue", not "Save And Continue".
- Use **title case** for navigation bar titles, section headers, and content titles.

### Error messages

- Explain what happened and how to recover.
- Don't blame the user ("Invalid input"); frame the fix ("Enter an email address like name@example.com").
- Don't expose technical internals ("Error 0x80004005").

### Buttons

- Use action-focused verbs: "Save", "Delete", "Send".
- Avoid "OK" for destructive confirmations — say what the button does ("Delete Playlist").

### Numbers, dates, times

- Use localized formatters, never hardcode "USD" or "MM/DD/YYYY".
- Use Apple's standard date patterns via `DateFormatter` / `Date.FormatStyle`.

### Accessibility labels

- Write accessibility labels as nouns or short phrases ("Play", "Favorite", not "Plays the song").
- Don't include the trait in the label ("Play button" is wrong — the button trait is added by the system).

---

# PATTERNS

## Accessing Private Data

- Ask at the moment of need, not at launch.
- Provide **purpose strings** that are specific, user-focused, and 1–2 sentences.
- Support **limited selection** (Photos limited access, Contacts single-contact picker).
- Show a system-branded indicator when recording (green for camera, orange for microphone on iOS).
- Immediately revoke background use of sensitive data when the user revokes permission.

## Charting Data

- Use **Swift Charts** (SwiftUI) or **Chart Kit** for native behavior (Dynamic Type, Dark Mode, VoiceOver).
- Choose chart type based on data:
  - **Line/area** for continuous change over time.
  - **Bar** for discrete comparisons.
  - **Scatter** for correlations.
  - **Pie/donut** only for ≤5 categories summing to a whole.
- Label axes clearly; omit when obvious (timeline with today's date).
- Provide VoiceOver **audio graphs** — system-generated sonification of chart data.
- Use color + shape/pattern so colorblind users can distinguish series.

## Collaboration

- Use **Messages collaboration invites** and **SharePlay** for real-time co-viewing.
- Show **presence indicators** (avatar chips) for each active collaborator.
- Attribute edits: show who made each change (live cursor, chip, or history entry).
- Resolve conflicts silently when possible (CRDT, last-write-wins with undo).

## Drag and Drop

- iOS/iPadOS: use `UIDragInteraction` and `UIDropInteraction`. Support dragging between apps in Split View.
- macOS: support the standard pasteboard and file-promise patterns.
- Give immediate visual feedback: lift animation when drag starts, green "+" badge when drop is allowed, red "⊘" when not.
- Preserve dragged content type fidelity — register multiple `NSItemProvider` representations (e.g., PDF, PNG, plaintext).

## Entering Data

- Choose the right input:
  - `UIKeyboardType.emailAddress` for emails, `.numberPad` for PINs, `.decimalPad` for money, `.URL`, `.phonePad`.
- Provide **AutoFill**: support `textContentType` for username, password, OTP, credit card, address.
- Use **tokenized input** where appropriate (tags, recipients).
- **Validate** as the user types when feedback is non-intrusive; validate on submit for costly checks.
- Inline errors beneath the field, red text on `systemRed`.

## Feedback

- **Transient confirmations**: HUD overlay for 1–2 seconds.
- **Toasts/banners**: dismiss on tap or after 3 s.
- **Alerts**: only for critical, modal decisions requiring user input.
- **Sounds and haptics**: layer with visual feedback, never substitute.

## File Management

- Use **Files** app / `UIDocumentPicker` / `NSOpenPanel` — don't build a custom file browser.
- Let users save to iCloud Drive, On My iPhone/iPad/Mac, or third-party providers.
- Support **document versions** via `NSFileVersion` / iCloud versioning.
- Auto-save frequently; warn only when unsaved changes could be lost on app termination.

## Going Full Screen

- **iOS:** full-screen content (photos, video) hides status bar on interaction, reveals on tap.
- **iPadOS:** offer a full-screen button in document windows via the menu bar.
- **macOS:** support full-screen mode via green traffic-light button. Provide auto-hiding menu bar and toolbar.
- Keep exit affordances visible (tap to reveal; swipe down; Esc).

## Launching

- **App launches in under 400 ms** to first interactive screen.
- Show a **launch screen** that mimics the first frame of content (no logo splash, no loading spinner).
- Restore previous state (scroll position, edited document) when relaunched.
- Never block users with a mandatory login on launch — let them explore first if possible.

## Live Viewing Apps

- For apps showing real-time data (sports scores, stocks, transit):
  - Use **Live Activities** on the Lock Screen / Dynamic Island for up to 12 hours.
  - Update at most every ~1 minute in the background.
  - Provide a compact and expanded state for Dynamic Island.

## Loading

- For < 1 s loads, show nothing (avoid flicker).
- For 1–3 s, show a **spinner**.
- For > 3 s, show a **progress indicator with percentage**.
- Use **skeleton screens** for content-heavy loads to preserve layout expectation.
- Always provide a **cancel** option for long-running operations.

## Managing Accounts

- Offer **Sign in with Apple** when any third-party sign-in is offered.
- Support passkey sign-in.
- Keep sign-up friction low — ask for only what's needed at start.
- Let users delete their account **from within the app** if they created it in-app (App Store requirement).

## Managing Notifications

- Ask for permission contextually, explaining the benefit.
- Support **provisional authorization** (quiet notifications with no prompt) for less-intrusive onboarding.
- Categorize notifications by type so users can disable individual streams.
- Respect **Focus** modes — mark notifications `.timeSensitive` only when truly so.

## Modality

- Use modality only for flows that **require completion or explicit dismissal**.
- **Sheets** (partial-height modal) are preferred on iOS; card shape with 10 pt corner radius.
- **Popovers** on iPad/macOS for inline drill-downs.
- **Alerts** only for critical decisions.
- Dismissible by swipe-down on iOS sheet, Esc/Cancel on macOS dialogs.

## Multitasking

- **iPad Split View**: support 1/3, 1/2, 2/3 widths via adaptive layouts.
- **iPad Slide Over**: compact width.
- **iPad Stage Manager** (iPadOS 16+): users freely resize windows.
- **macOS**: follow window behaviors (minimize, zoom, full screen, tiling).
- Preserve focus and selection across size changes.

## Offering Help

- Embed help contextually — tooltip on hover (macOS), long-press ("Tip") on iOS.
- Use **Tips** framework to surface hints at relevant moments (iOS 17+).
- Provide a **Help** menu on macOS with searchable documentation.
- Keep help focused on what the user can do right now.

## Onboarding

- Introduce essential concepts only. Skip the "welcome tour" if you can onboard through first use.
- Use **Feature highlights** sparingly — at most 3 screens.
- Always let users **skip** onboarding.
- Re-surface important tips later via Tips, not forced re-onboarding.

## Playing Audio

- **Respect silent mode** for non-media audio.
- Declare **audio session category** (ambient, playback, record, etc.).
- Show metadata in **Now Playing** (Control Center, Lock Screen).
- Support **remote commands**: play, pause, next, previous, seek.
- Output to AirPlay, Bluetooth, headphones transparently — don't override user routing.

## Playing Haptics

- Use `UIFeedbackGenerator` / Core Haptics.
- Standard haptics: `light`, `medium`, `heavy` impact; `success`, `warning`, `error` notification.
- Keep haptics short (50–150 ms typical).
- Don't use for ambient feedback (exhausts Taptic Engine).
- Respect system **Reduce Motion** — honor the `UIAccessibility.isReduceMotionEnabled` flag also for custom haptics with vibration components.

## Playing Video

- Use **AVPlayerViewController** to get free PiP, AirPlay, subtitles.
- Support **landscape and portrait**; allow the user to rotate.
- Provide subtitles and captions; honor the system caption styling.
- Don't auto-play with sound — tap to unmute if needed.

## Printing

- Use **UIPrintInteractionController** to get system print UI.
- Offer a **print** action from the share sheet rather than a custom button.
- Format for **letter and A4** at minimum; let the user pick paper.

## Ratings and Reviews

- Request ratings via **SKStoreReviewController** (iOS) — system limits to 3 prompts per 365 days.
- Prompt **after success**: user completes a meaningful task, not on launch.
- Never offer incentives for reviews.
- Never block app functionality with a rate prompt.

## Searching

- Provide a search field when content is >~20 items.
- Use `UISearchController` in navigation bar (iOS) or `NSSearchField` (macOS).
- Support **tokenized search** for filters.
- Offer **recent searches** and **suggestions**.
- Return results in < 500 ms for perceived responsiveness.

## Settings

- Prefer in-app settings for app behavior (dark mode override, sort order).
- Use **Settings app** (via Settings bundle) for system-level integrations (background refresh).
- Group related options; avoid a flat list of >10 toggles.
- Provide a clear footer explaining any ambiguous option.

## Undo and Redo

- Support **Shake to Undo** on iPhone (iOS default).
- On iPad, support three-finger swipe left/right for undo/redo.
- On macOS, support ⌘Z / ⇧⌘Z.
- Label undoable actions with verbs: "Undo Delete Task", "Redo Move to Trash".
- Maintain an undo stack of at least 10 operations; offer "Undo all" for destructive bulk actions.

## Workouts

- Use **HealthKit workouts** to integrate with Activity rings.
- Provide an **always-on** workout view on Apple Watch (Ultra + Series 5+).
- Use haptic feedback for milestone alerts (every km/mile, goal reached).
- Pause automatically on device detection (e.g., treadmill stop).

---

# COMPONENTS

## Buttons

### Kinds (iOS/iPadOS, iOS 15+)

- **Plain** — text only, system tint.
- **Gray** — light gray fill, dark text.
- **Tinted** — translucent tint fill; for prominent secondary actions.
- **Filled** — solid tint; for primary calls to action.
- **Bordered / Bordered Prominent / Borderless** (macOS and iOS via SwiftUI).

### Sizes

- **Small**: 28 pt height. 15 pt font.
- **Medium**: 34 pt height. 16 pt font.
- **Large**: 50 pt height. 17 pt font, Semibold.

### Padding

- Horizontal padding: 16 pt (small), 20 pt (medium), 20 pt (large).
- Corner radius defaults to **capsule** when `.borderedProminent` + `.large` on iOS 15+.

### Target size

- **Always meet 44×44 pt tap area** even if visual button is smaller (pad with invisible hit region).

### Do/Don't

- **Do** use one primary action per screen.
- **Do** make primary actions visually louder (filled, tinted) than secondary (plain, bordered).
- **Don't** use a gradient or drop-shadow unless the platform calls for it.

## Menus

### iOS context menus

- Long-press (or right-click with pointer) to reveal a menu with icon, title, and optional preview.
- Order: most-common actions at top; destructive actions at bottom in red.
- Nested submenus allowed, 1 level deep.
- Include SF Symbol icons for each item.

### Pull-down and pop-up menus

- **Pull-down** — button reveals options; selecting doesn't change the button label (e.g., New ▼).
- **Pop-up** — button reveals options; selection becomes the button's new state (e.g., Size: Medium ▼).

### macOS menus

- Menu bar commands should appear in the top menu bar, grouped by File/Edit/View/etc.
- Use **ellipsis** ("Save As…") when the menu item opens a sheet for more input.
- Use **keyboard shortcuts** (⌘S, ⇧⌘S). List them in the menu.

## Navigation Bars

- iOS height: **44 pt** (compact), **96 pt** when large title expanded.
- Contains: back button (leading), title (center or large title top-aligned), trailing actions (2 max recommended).
- Large title collapses to inline as user scrolls.
- Use system blur material when scrolled content passes beneath.
- **Do** keep only one title in the nav bar.
- **Don't** put more than 3 icons in the trailing area.

## Tab Bars

- iOS height: **49 pt** (compact), **32 pt** on iPad in regular width (iPadOS 18+ top tab bar).
- 3–5 tabs on iPhone; up to 6 on iPad (more scroll horizontally).
- Tab item: SF Symbol icon (25×25 pt) + label (10 pt Medium).
- Selected tab uses app's tint color.
- iPadOS 18 introduces **sidebar-tab bar hybrid** — tabs at top, collapse to sidebar on iPad.
- **Don't** modify tab bar during a flow — keep navigation stable.

## Toolbars

- iOS: **44 pt** height below content. Contains context-specific actions (share, delete, compose).
- macOS: **52 pt** toolbar height; customizable by user.
- Group actions by function with fixed spacers.

## Sidebars

- iPadOS/macOS primary navigation for apps with many top-level areas (Mail, Files, Notes).
- Default width: **320 pt** (expanded), **80 pt** (icon-only on macOS).
- Support collapse/expand via toolbar button.
- Sidebar sections have headers; items use SF Symbols + label.

## Page Controls

- Horizontal dots indicating current page in a paged scroll view.
- Dot size: **7 pt**; spacing 9 pt; selected dot filled, others 30% opacity.
- 7-dot maximum visible (auto-scales down beyond).

## Steppers

- ± control for small numeric increments.
- Width: **94 pt** on iOS; **60 pt** per button on macOS.
- Accompany with a text field for quick entry of larger values.

## Switches (Toggles)

- iOS switch: **51 × 31 pt** track; thumb **27 pt** diameter.
- Use ON/OFF tint: green when on (systemGreen), light gray when off.
- Never label state on the switch itself — the track position conveys it.
- macOS uses a **checkbox** or platform switch depending on context.

## Segmented Controls

- iOS height: **32 pt**.
- 2–5 segments; each at least 44 pt wide.
- Selected segment shows slightly raised/lighter fill.
- Don't mix text and icons in one control — choose one per segment.

## Pickers

- **Wheel picker** iOS: 216 pt height; 44 pt row.
- **Date picker** inline (iOS 14+): compact (button that reveals inline wheel), inline (always open), compact, graphical (calendar).
- **macOS** `NSDatePicker`: textual, graphical.

## Sliders

- iOS height: **31 pt** thumb; track 4 pt thick.
- Thumb snaps to discrete increments with haptic tick if `stepValues` set.
- Optional min/max accessory views.
- Label current value with Dynamic Type `.caption1`.

## Progress Indicators

- **Determinate bar**: 2 pt thick track.
- **Indeterminate spinner**: 20 pt (small), 37 pt (medium), 52 pt (large).
- Show **percent complete** numerically when the operation is slow enough that 1% changes are perceptible.

## Text Fields

- Default iOS single-line text field: **36 pt** tall. Corner radius 10 pt.
- Secure text field obscures entry with bullets.
- Support content types (`textContentType`) for AutoFill.
- Placeholder uses `placeholderText` color (tertiary label).
- Clear button (× icon) at trailing edge when non-empty.

## Text Views

- Multi-line; support rich attributes (links, bold, italic).
- Support **Text Kit 2** for layout.

## Search Fields

- Rounded 10 pt corner, gray fill (`secondarySystemFill`).
- Leading magnifying glass SF Symbol.
- Trailing clear + scope buttons as needed.
- Height: **36 pt**.

## Lists / Tables

- iOS list row height: **44 pt** standard; 60 pt with subtitle; 88 pt with 3 lines.
- Leading/trailing swipe actions: appear with drag gesture; destructive action uses systemRed.
- Section headers: **28 pt** on plain lists, **42 pt** with grouped style.
- Chevron indicates drill-down; use `UITableViewCell.accessoryType.disclosureIndicator`.

## Collection Views / Grids

- Use **UICollectionView** with compositional layout.
- Standard inter-item spacing: 8 pt.
- Responsive grids: set minimum item width, let system compute columns.

## Image Views

- Preserve aspect ratio: `.aspectFit` (default) or `.aspectFill` (crop).
- Placeholder: SF Symbol on secondarySystemFill background while loading.
- For user content, add rounded corners (8 pt) and 0.5 pt hairline border (`separator`).

## Alerts

- **Alert** (iOS): up to 2 buttons side-by-side OR 3+ buttons stacked.
- Title: 17 pt Semibold. Message: 13 pt Regular. Action buttons: 17 pt.
- Buttons: destructive (red), cancel (bold), default (regular blue).
- Use sparingly — interrupts the user.

## Sheets

- iOS partial sheet heights: medium (half-screen) or large (~90%).
- Sheets have a **grabber** at top for resize gesture.
- Corner radius 10 pt at top.
- Dismiss by swipe-down or Cancel button.

## Popovers

- iPad/macOS only (on iPhone, popovers become sheets).
- Arrow points to anchor element.
- Default width: 320 pt. Content inset: 12 pt.

## Action Sheets

- **iPhone**: slides up from bottom; full-width buttons; includes Cancel at bottom.
- **iPad**: appears as a popover from its anchor.
- Use for 2–6 related actions; for more, use a menu.

## Badges

- Small red circle with number on tab bar item or app icon.
- Numbers over 99 show "99+".
- Don't over-use — each badge should represent a real unread/attention item.

## Activity Views (Share Sheet)

- Use `UIActivityViewController` — don't build a custom share UI.
- Custom activities: provide an icon (60×60 pt PDF) and title.
- Pinning/reordering by user is respected.

## Charts

- **Swift Charts** components: BarMark, LineMark, PointMark, AreaMark, RuleMark, SectorMark.
- Default axis labels auto-size with Dynamic Type.
- Interactive: tap/drag shows tooltip; long-press reveals detailed value.

## Combo Boxes (macOS)

- Text field + pop-up arrow; user can type or pick.
- Width ≥ 60 pt. Height 22 pt.

## Color Wells

- iOS: 28×28 pt rounded square showing current color; tap opens picker.
- Picker modes: grid, spectrum, sliders, eyedropper (iPad/macOS).

## Digital Crown (watchOS)

- Scrolls vertically; rotates with haptic ticks.
- Use for fine numeric adjustment (stopwatch, timer, volume).
- SwiftUI: `.focusable()` + `.digitalCrownRotation`.

## Disclosure Controls

- Chevron triangle that rotates 90° when expanded.
- 22×22 pt tap area.
- Use `.disclosureGroup` in SwiftUI.

## Gauges

- Linear or radial meters for quantitative values.
- Default sizes: small (20 pt), medium (36 pt), large (60 pt).
- Accompanied by min/max labels.

## Context Menus

- Long-press (iOS) or right-click (iPad with pointer, macOS).
- Order: primary actions, separators, destructive at bottom.
- Provide a **preview** (optional) — 16:9 thumbnail ~280 pt wide at top of menu.

## Token Fields (macOS)

- Used for tag/recipient input.
- Tokens are pill-shaped with 10 pt corner radius, colored by system tint.

## Keyboard Shortcuts

- Show shortcuts next to menu items: ⌘ + letter.
- **⌘ — Command**, **⇧ — Shift**, **⌥ — Option**, **⌃ — Control**, **↩ — Return**, **␣ — Space**, **⎋ — Escape**.
- Standard shortcuts: ⌘N New, ⌘O Open, ⌘S Save, ⌘W Close, ⌘Q Quit (macOS), ⌘Z Undo, ⇧⌘Z Redo, ⌘X/⌘C/⌘V cut/copy/paste, ⌘A Select All, ⌘F Find, ⌘, Settings, ⌘/ Help.

---

# INPUTS

## Touch (iOS/iPadOS)

### Gestures

- **Tap** — select, press a button.
- **Double-tap** — zoom in/out (maps, photos).
- **Long-press** — reveal context menu or drag.
- **Swipe** — navigate back, reveal row actions.
- **Pan / drag** — scroll, move objects.
- **Pinch** — zoom.
- **Rotate** — two-finger rotate on canvases.
- **Edge pan** (leading edge) — go back in navigation.

### Rules

- Respond to touches within **100 ms** (visually highlight).
- Use `UITapGestureRecognizer`, `UIPanGestureRecognizer` — don't reinvent.
- Don't override system edge-pan (back gesture).

### Apple Pencil (iPad)

- **Pressure**, **tilt**, **azimuth**, **barrel-roll** (Pencil Pro), **squeeze** (Pencil Pro, Gen 3+).
- Use **PKCanvasView** for drawing or integrate **Scribble** for handwritten text input anywhere.
- Hover (Pencil 2 on M2 iPads+): **12 mm** sensing distance; show hover state preview.

## Pointers (iPadOS, macOS)

### iPadOS pointer

- Shape-shifts based on target: tiny circle over whitespace, button shape on buttons, I-beam on text.
- **Lift** effect on hover: target scales to 104%; pointer disappears into it.
- Use system pointer — don't replace it.

### macOS cursors

- **Arrow** (default), **I-beam** (text), **Pointing hand** (links), **Resize** (edges), **Open/Closed hand** (drag), **Crosshair** (precision).
- Change cursor via `NSCursor`.

### Mouse buttons

- **Primary click** — select, activate.
- **Secondary click** (right-click / two-finger on trackpad) — context menu.
- **Scroll** — vertical content; use horizontal for paginated content only.
- **Smart zoom** (two-finger double tap on trackpad) — zoom to fit.

## Keyboards

### Hardware keyboards (iPad, Mac)

- Support **Full Keyboard Access** (FKA): Tab cycles focus; Spacebar / Return activates.
- Implement `UIKeyCommand` / menu shortcuts for common operations.
- Support **arrow-key navigation** in lists and grids.
- Hold ⌘ in iPadOS to reveal keyboard shortcut HUD.

### On-screen keyboard (iOS)

- Choose correct keyboard type (`.emailAddress`, `.numberPad`, etc.).
- Offer **return key label** appropriate to context: Go, Search, Send, Done.
- Dismiss on scroll for long forms.

## Game Controls

- Support **Game Controller framework** for MFi controllers and PlayStation / Xbox controllers (iOS 13+).
- Standard button mapping: A confirm, B cancel (mirrors system).
- Show on-screen controls when no controller attached, hide when connected.
- Support **game-mode** (macOS/iOS) for prioritized CPU/GPU.

---

# TECHNOLOGIES

## App Clips

- Lightweight, <10 MB app slice that launches from QR, NFC tag, App Clip Code, or link. Experience tied to a specific task (rent a scooter, order food at this restaurant). Provide a "Get App" prompt only after the task completes.

## App Shortcuts

- Expose actions to Siri, Shortcuts app, Spotlight. Use **AppIntents** framework. Each shortcut should complete in one voice query ("Start a 20-minute meditation").

## CarPlay

- Restricted template-based UI (Apple provides templates: grid, list, map, now playing). Max 5 items per top-level list to reduce driver distraction. Limit interactions to < 2 taps per action.

## HealthKit

- Read/write health data with explicit per-type authorization. Data stays on device unless the user explicitly shares. Don't mix HealthKit data with ads or marketing.

## HomeKit

- Control home accessories. Use Apple's Home framework; don't build your own device protocol. Respect user permissions; only show accessories within user's assigned home.

## iCloud

- Store user data in iCloud Drive or CloudKit. Sync silently in background. Handle conflicts with last-writer-wins or present both versions to user.

## Live Activities

- On-screen indicator of live-changing state (ride arrival, game score). Up to 12 h duration (extendable). Provide compact (chip), minimal (icon), and expanded states for Dynamic Island. Update via push (ActivityKit + APNs) — no background polling.

## Machine Learning

- Use **Core ML** for on-device inference. Preserve privacy by keeping models on-device. Surface model confidence to the user; allow correction ("Report incorrect result"). Don't present ML output as certainty.

## Maps

- Use **MapKit** for standard map views. Offer **Look Around** (street imagery) when available. Use system annotations or customize carefully — always include accessible labels.

## NFC

- **Read** tags via Core NFC; requires explicit user action (tap a tag). **Write** NDEF (iOS 13+). No background reading on non-Pro iPhones.

## Notifications

- Request permission contextually. Use **Notification Content Extensions** for rich media. Respect **Focus** modes and time-sensitive flag.

## Sign in with Apple

- Required if you offer third-party OAuth sign-in (Google, Facebook). Preserve email privacy with Hide My Email. Use the **provided button** — don't restyle.

## Siri

- Use **AppIntents** to donate actions. Siri can invoke your app for common tasks by matching spoken intent to a donated intent. Keep intent titles natural and short.

## Tap to Pay

- Accept contactless payments on iPhone (US, other regions). Requires MFi merchant agreement and payment network integration. Use Apple-provided UI for the transaction.

## Wallet

- Issue passes (tickets, boarding passes, loyalty, payment cards). Use **PassKit**. Update passes via APNs. Keep designs simple — passes are read at-a-glance at a kiosk.

## Widgets

- Home Screen, Lock Screen, StandBy, macOS desktop, iPadOS desktop. Sizes: Small (155×155 @ 3x), Medium (329×155), Large (329×345), Extra Large (iPad only). Lock Screen types: circular, rectangular, inline. Use **WidgetKit** + **AppIntents**. Widgets are **non-interactive** in iOS 16; iOS 17+ supports button and toggle interactions. Refresh via Timeline with suggested entries.

---

## Platform Appendix — Target sizes and spacing summary

| Platform | Min tap / focus target | Default margin | Font scale base |
|---|---|---|---|
| iOS (iPhone) | 44×44 pt | 16–20 pt | 17 pt body |
| iPadOS | 44×44 pt | 20 pt | 17 pt body |
| macOS (pointer) | 20×20 pt | 20 pt | 13 pt body |
| watchOS | 44×44 pt (equivalent) | 8–12 pt | 16 pt body |
| tvOS (focus) | Focus scales element ~110% | 60 pt (5% safe) | 29 pt body |
| visionOS | ~60×60 pt eye-target | 20 pt | 17 pt body |

---

## Common numeric reference card

- **iOS tap target:** 44×44 pt minimum
- **8 pt spacing grid** across platforms
- **Corner radii:** 6 pt (small chips), 10 pt (sheets, buttons), 16 pt (cards), 22.37% (iOS app icons)
- **Text contrast:** 4.5:1 AA, 7:1 AAA
- **Animation durations:** 100–200 ms micro, 250–300 ms screen, 300–400 ms full-screen
- **Dynamic Type range:** 14 pt body (xSmall) to 53 pt body (AX5)
- **SF Symbol scales:** Small, Medium, Large (tracking cap height)
- **Widget sizes:** 155×155, 329×155, 329×345, Extra Large (iPad)
- **App icon master:** 1024×1024
- **Flash rate ceiling:** 3 Hz (photosensitive seizure prevention)

---

End of normalized summary.
