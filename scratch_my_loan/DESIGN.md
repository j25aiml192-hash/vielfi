---
name: Institutional Playful
colors:
  surface: '#fafaf5'
  surface-dim: '#dadad5'
  surface-bright: '#fafaf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4ef'
  surface-container: '#eeeee9'
  surface-container-high: '#e8e8e3'
  surface-container-highest: '#e3e3de'
  on-surface: '#1a1c19'
  on-surface-variant: '#444748'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f1f1ec'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c9c6c5'
  secondary: '#615e57'
  on-secondary: '#ffffff'
  secondary-container: '#e7e2d8'
  on-secondary-container: '#67645d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1b1a'
  on-tertiary-container: '#868381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e7e2d8'
  secondary-fixed-dim: '#cac6bd'
  on-secondary-fixed: '#1d1c16'
  on-secondary-fixed-variant: '#494740'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fafaf5'
  on-background: '#1a1c19'
  surface-variant: '#e3e3de'
  ink: '#0a0a0a'
  canvas: '#fffaf0'
  feature-pink: '#ff3399'
  feature-teal: '#008080'
  feature-lavender: '#9966ff'
  feature-peach: '#ff9966'
  feature-ochre: '#cc9900'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style
This design system bridges the gap between high-stakes institutional finance and the modern, approachable aesthetic of high-growth SaaS. The personality is "Serious Play": reliable and powerful enough for credit marketplaces, yet infused with the warmth and creative energy of tools like Clay. 

The style is **Minimalist-Tactile**. It relies on a "Cream Canvas" foundation to reduce the sterile coldness of typical enterprise software. Depth is achieved through bold color blocking and saturated feature containers rather than traditional skeuomorphism. The interface should feel organized, breezy, and high-end, utilizing generous whitespace to make complex financial data feel digestible.

## Colors
The palette is anchored by a warm **Cream Canvas (#fffaf0)**, which serves as the primary background for all pages, including the footer. This is contrasted by **Ink (#0a0a0a)**, used for all primary typography and iconography to ensure maximum legibility and a premium feel.

To differentiate from traditional B2B platforms, we utilize a spectrum of **Saturated Feature Colors**. These are not used for functional states (like success/error) but as structural backgrounds for high-impact cards and section headers. When using these saturated backgrounds, typography should switch to white or a high-contrast tint of the base color to maintain accessibility.

## Typography
The system uses **Inter** exclusively to achieve a clean, systematic look. To replicate the "Plain Black" aesthetic requested, all display and headline levels must use **Medium (500) weight** paired with **negative letter-spacing**. This creates a tight, "ink-heavy" look that feels custom and modern.

Body text maintains standard tracking for readability. For data-heavy credit tables, use `body-md` with slightly tighter line heights. Labels should be used sparingly for metadata and small tags, often paired with increased letter spacing to provide a rhythmic counterpoint to the tight headlines.

## Layout & Spacing
This design system uses a **Fluid Grid** with a strict 4px baseline. Layouts should feel expansive, utilizing "Generous Whitespace" to separate different financial instruments or modules. 

- **Desktop:** 12-column grid with 24px gutters. Use wide side margins (64px) to keep content centered and premium.
- **Mobile:** 4-column grid with 20px margins. 
- **Section Spacing:** Use large vertical padding (80px to 120px) between major content blocks to emphasize the "Clay-inspired" airy aesthetic.

## Elevation & Depth
Depth is created through **Color Contrast** and **Tonal Layering** rather than drop shadows. 

1.  **Level 0 (Canvas):** The #fffaf0 background.
2.  **Level 1 (Cards):** Slightly off-white or light-grey (#f5f5f0) surfaces with subtle 1px borders in a darker tint of the canvas.
3.  **Level 2 (Feature Cards):** Fully saturated blocks of color (Pink, Teal, etc.) that sit directly on the canvas.
4.  **Interaction:** When an element is hovered, use a slight scale-up (1.02x) or a subtle shift in background saturation to indicate state, avoiding heavy shadows.

## Shapes
The shape language is "Hyper-Rounded," contributing to the playful SaaS feel. 

- **Standard Components:** Buttons, input fields, and small dropdowns use a **12px radius**.
- **Standard Cards:** Information containers and data modules use a **16px radius**.
- **Feature Cards:** Saturated color blocks and hero-style containers use a **24px radius** to emphasize their importance and create a friendly, organic silhouette.

## Components

### Buttons & Inputs
Buttons should have a 12px radius. The primary button is "Ink" (#0a0a0a) with white text. Secondary buttons should use a ghost style with a 1.5px border. Inputs should have a 12px radius, utilizing a subtle cream-grey fill to distinguish them from the pure canvas background.

### Feature Cards
These are the signature elements of the system. They use the 24px radius and one of the five saturated named colors. Content inside these cards should be high-contrast (usually white or very dark navy) to ensure the institutional credit data remains legible despite the playful container.

### Chips & Tags
Use a pill-shape (fully rounded) for status chips. They should be low-chroma (soft greys/beiges) to avoid competing with the saturated feature cards.

### Lists & Data Tables
Tables should be minimalist with no vertical lines. Use horizontal separators in a very faint tint of the "Ink" color. For institutional credibility, ensure numerical data is aligned properly and uses the Inter font's tabular properties.

### Footer
The footer must remain on the **Cream Canvas (#fffaf0)**. Do not use a dark navy or "Ink" footer. Use simple typography and high-quality iconography to denote professionalism without adding visual weight.