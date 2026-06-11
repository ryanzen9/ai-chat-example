---
name: Cloud-Native Infrastructure
colors:
  surface: "#131313"
  surface-dim: "#131313"
  surface-bright: "#3a3939"
  surface-container-lowest: "#0e0e0e"
  surface-container-low: "#1c1b1b"
  surface-container: "#201f1f"
  surface-container-high: "#2a2a2a"
  surface-container-highest: "#353534"
  on-surface: "#e5e2e1"
  on-surface-variant: "#ddc1b1"
  inverse-surface: "#e5e2e1"
  inverse-on-surface: "#313030"
  outline: "#a58c7d"
  outline-variant: "#564336"
  surface-tint: "#ffb787"
  primary: "#f38020"
  on-primary: "#502400"
  primary-container: "#f38020"
  on-primary-container: "#592900"
  inverse-primary: "#964900"
  secondary: "#b7c8e1"
  on-secondary: "#213145"
  secondary-container: "#3a4a5f"
  on-secondary-container: "#a9bad3"
  tertiary: "#89ceff"
  on-tertiary: "#00344d"
  tertiary-container: "#00a9f0"
  on-tertiary-container: "#003a56"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#ffdcc7"
  primary-fixed-dim: "#ffb787"
  on-primary-fixed: "#311300"
  on-primary-fixed-variant: "#723600"
  secondary-fixed: "#d3e4fe"
  secondary-fixed-dim: "#b7c8e1"
  on-secondary-fixed: "#0b1c30"
  on-secondary-fixed-variant: "#38485d"
  tertiary-fixed: "#c9e6ff"
  tertiary-fixed-dim: "#89ceff"
  on-tertiary-fixed: "#001e2f"
  on-tertiary-fixed-variant: "#004c6e"
  background: "#131313"
  on-background: "#e5e2e1"
  surface-variant: "#353534"
  background-deep: "#0A0A0A"
  surface-card: "#1A1A1A"
  border-subtle: "#2E2E2E"
  text-primary: "#FFFFFF"
  text-secondary: "#94A3B8"
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: "500"
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  max-width: 1280px
---

## Brand & Style

This design system is built for performance, security, and enterprise-grade reliability. It shifts away from decorative aesthetics toward a functional, "dashboard-first" philosophy. The visual language is inspired by infrastructure and network management tools—prioritizing clarity, data density, and immediate scanability.

The style is **Modern Corporate / Technical**, characterized by:

- **High-Contrast Dark Mode:** A deep charcoal foundation that reduces eye strain for long-term monitoring while allowing vibrant accents to pop.
- **Precision Engineering:** Sharp lines, 1px borders, and a rigorous adherence to a technical grid.
- **Action-Oriented:** The use of a singular, vibrant orange to indicate primary actions, critical status, and connectivity.

## Colors

The palette is optimized for a technical dark mode environment.

- **Primary (#F38020):** Used exclusively for primary calls to action, active states, and brand-critical iconography.
- **Neutral Foundation (#111111):** The primary background color. Use `#0A0A0A` for the furthest background layers (the "canvas") and `#1A1A1A` for elevated surfaces like cards or sidebars.
- **Slate Grays:** Utilized for secondary text and borders to maintain a hierarchy that doesn't compete with the primary white-on-charcoal contrast.
- **Contrast:** Maintain a strict AAA contrast ratio for all body text against the deep charcoal backgrounds.

### Implementation Contract

The app uses shadcn-compatible semantic tokens as the global theme contract. New UI code should prefer Tailwind token utilities instead of raw hex values:

- `bg-background text-foreground` for the app canvas.
- `bg-card text-card-foreground border-border` for cards, panels, and assistant messages.
- `bg-muted text-muted-foreground` for subdued containers and secondary text.
- `bg-primary text-primary-foreground`, `text-primary`, and `border-primary` for brand emphasis and active states.
- `bg-input border-border focus-within:border-ring` for inputs and composers.

App-specific layer aliases are reserved for shell structure only:

- `--app-canvas`: deepest page background.
- `--app-shell`: main workspace and top bar.
- `--app-sidebar`: sidebar surface.
- `--app-panel`: compact internal panels.
- `--app-panel-hover`: hover/active neutral fill.
- `--app-brand-soft` and `--app-brand-border`: user-message and logo accent surfaces.

Avoid adding new component-level colors such as `#cbd5e1`, `#111111`, or `#502400` directly in TSX. Add a semantic token first, then consume it through Tailwind utilities or `var(...)`.

## Typography

The typography system relies on **Inter** for all UI elements and communication to ensure maximum legibility and a modern, neutral tone. **JetBrains Mono** is introduced for technical labels, metadata, and code snippets to reinforce the developer-centric feel.

- **Tightened Tracking:** Headlines use negative letter spacing (`-0.01em` to `-0.02em`) to appear more "locked-in" and professional.
- **Hierarchy:** Use font weight rather than size alone to distinguish between levels. Body text defaults to Regular (400), while UI labels and headings use Semi-Bold (600).
- **Scale:** On mobile, `headline-lg` should scale down to 24px with a 32px line height.

## Layout & Spacing

This design system employs a **Fixed-Fluid Hybrid Grid**. Content is housed within a maximum-width container of 1280px for desktop, centered on the screen.

- **Grid Model:** A 12-column grid for desktop with 16px gutters. For tablets, use 8 columns, and for mobile, 4 columns.
- **Rhythm:** An 8px linear scale is used for vertical rhythm, but a 4px "half-step" is permitted for tight data-dense layouts (e.g., table rows, small components).
- **Density:** High data density is encouraged. Padding within cards and containers should be compact (16px–20px) to maximize the information visible above the fold.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Crisp Outlines** rather than soft shadows or blurs.

- **Layering:** The base layer is `#0A0A0A`. Interactive elements and cards sit on `#1A1A1A`.
- **Borders:** Every container must have a 1px solid border using `#2E2E2E`. This creates a sharp "technical drawing" feel.
- **Shadows:** Use shadows sparingly. When necessary, use a "Hard Shadow"—1px or 2px offset with 0 blur and high opacity—to mimic physical stacking of sheets without losing the sharp aesthetic.
- **Interactivity:** On hover, borders should brighten from `#2E2E2E` to `#4A4A4A` or the primary orange to indicate focus.

## Shapes

The shape language is strictly **Geometric and Minimal**.

- **Corners:** A uniform 4px corner radius is applied to all buttons, input fields, and cards. This provides a subtle "softening" of the professional edge without appearing playful.
- **Icons:** Use stroke-based icons with a consistent 1.5px or 2px weight. Avoid filled icons unless used for status indicators.

## Components

- **Buttons:** Primary buttons are solid `#F38020` with white text. Secondary buttons are outlined (1px) with white text and no fill. On hover, primary buttons should darken slightly, and secondary buttons should gain a subtle `#FFFFFF10` (10% opacity) background.
- **Input Fields:** Use a dark background (`#0A0A0A`), a 1px border (`#2E2E2E`), and white text. Active states must use a 1px orange border.
- **Cards:** Simple containers with `#1A1A1A` background and a `#2E2E2E` border. No large drop shadows.
- **Chips/Badges:** Small, rectangular labels with 2px radius. Use Slate for neutral info and subdued Orange/Red/Green for status states.
- **Data Tables:** High density with 1px horizontal dividers. Header rows should have a slightly darker background (`#0D0D0D`) to differentiate from data rows.
- **Navigation:** Vertical sidebars are preferred for technical dashboards, using clear icons and Semi-Bold Inter labels.
