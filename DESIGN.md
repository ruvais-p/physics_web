# DESIGN.md — Physics Department Web Portal

## Design System Overview: Lumen Academicus

The design system for the **Department of Physics** embodies the intersection of rigorous academic tradition and cutting-edge scientific inquiry. It evokes a sense of prestige, intellectual clarity, and institutional authority through a visual style characterized as **Corporate Modern with Minimalism**.

---

## 🎨 Color Palette

### Primary & Accent Colors
* **Primary / Oxford Blue:** `#002147` (Container) & `#000A1E` (Text/Primary)
  * Used for main navigation bar, headers, primary buttons, and structural grounding.
* **Secondary / Science Cyan:** `#00A3C1` (Accent) & `#00687B`
  * Used for interactive elements, link hovers, focus glows, CTAs, and technical/lab tags.
* **Tertiary / Heritage Red:** `#AB0613` (Accent) & `#210001`
  * Derived from CUSAT institutional identity; used sparingly for notifications, highlights, or crests.

### Surface & Background Tokens
| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `background` | `#F9F9FF` | Page base canvas background |
| `surface` | `#F9F9FF` | Primary component background |
| `surface-gray` | `#F8F9FA` | Light neutral secondary content blocks |
| `surface-container-lowest` | `#FFFFFF` | Card surfaces & elevated containers |
| `surface-container-low` | `#F0F3FF` | Low contrast section backgrounds |
| `surface-container` | `#E7EEFF` | Standard container background |
| `surface-container-high` | `#DEE8FF` | Highlighted container background |
| `surface-container-highest` | `#D8E3FB` | Top-tier highlighted container background |
| `surface-dim` | `#CFDAF2` | Dimmed surface background |

### Text & Neutral Tokens
| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `on-surface` | `#111C2D` | Primary body and heading text color |
| `on-surface-variant` | `#44474E` | Secondary body text and labels |
| `outline` | `#74777F` | Form input borders and standard dividers |
| `outline-variant` | `#C4C6CF` | Subtle card borders and horizontal rules |

---

## 🔤 Typography

The typography pairs an authoritative academic Serif header with a clean, highly legible modern Sans-serif body face.

* **Headline Font Family:** `Source Serif 4` (Serif)
* **Body & Label Font Family:** `Hanken Grotesk` (Sans-Serif)

### Type Scale

| Style Token | Font Family | Size | Weight | Line Height | Letter Spacing | Target Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Source Serif 4 | `56px` | `700` (Bold) | `64px` | `-0.02em` | Desktop Hero Titles |
| `display-lg-mobile` | Source Serif 4 | `36px` | `700` (Bold) | `44px` | Normal | Mobile Hero Titles |
| `headline-lg` | Source Serif 4 | `32px` | `600` (SemiBold) | `40px` | Normal | Page & Major Section Titles |
| `headline-md` | Source Serif 4 | `24px` | `600` (SemiBold) | `32px` | Normal | Subsection Headers & Card Titles |
| `body-lg` | Hanken Grotesk | `18px` | `400` (Regular) | `28px` | Normal | Intro Paragraphs & Lead Text |
| `body-md` | Hanken Grotesk | `16px` | `400` (Regular) | `24px` | Normal | Standard Body Text |
| `label-lg` | Hanken Grotesk | `14px` | `600` (SemiBold) | `20px` | `0.05em` | Buttons, Navigation & Tabs |
| `label-sm` | Hanken Grotesk | `12px` | `500` (Medium) | `16px` | `0.02em` | Metadata, Tags & Footer text |

---

## 📐 Layout & Spacing

### Grid Specification
* **Grid Type:** 12-Column Fixed Grid (Desktop), Centered
* **Max Container Width (`container-max`):** `1280px`
* **Gutter Width (`gutter`):** `24px`
* **Desktop Margins (`margin-desktop`):** `64px`
* **Tablet Margins (`margin-tablet`):** `32px`
* **Mobile Margins (`margin-mobile`):** `20px`
* **Base Unit (`unit`):** `8px`

### Vertical Rhythm & Section Spacing
* **Section Gap:** `80px` to `120px` between major content sections.
* **Reflow Rules:**
  * **Desktop:** 12 columns, 3 to 4 column card grids.
  * **Tablet:** Fluid grid, 2 column card grids.
  * **Mobile:** 1 column layout, cards reflow vertically.

---

## 💎 Elevation, Depth & Shapes

### Corner Radii
* `sm`: `0.125rem` (2px)
* `DEFAULT`: `0.25rem` (4px) — Buttons, form inputs, chips
* `md`: `0.375rem` (6px)
* `lg`: `0.5rem` (8px)
* `xl`: `0.75rem` (12px) — Feature cards, modals, hero containers
* `full`: `9999px` — Circular avatars, pills

### Depth & Shadows
* **Border Style:** Thin `1px` borders (`#E2E8F0` / `outline-variant`) for structure. Avoid harsh heavy dark borders.
* **Ambient Shadow:** Ambient blue shadow (`#002147` at 5-10% opacity) on interactive card hovers and modals to integrate naturally into light theme backgrounds.

---

## 🧩 Component Specifications

### 1. Header & Navigation
* **Background:** Deep Oxford Blue (`#002147`)
* **Navigation Links:** White text (`#FFFFFF`) with Science Cyan (`#00A3C1`) hover highlight/underline.
* **Logo:** High-contrast CUSAT Physics Department brand seal/crest.

### 2. Hero Section
* **Typography:** `display-lg` in Source Serif 4. Left-aligned layout.
* **Background:** Full-bleed laboratory/research imagery with subtle dark overlay for legibility.
* **Primary Action CTA:** Science Cyan (`#00A3C1`) button for maximum visual contrast.

### 3. Faculty & Research Cards
* **Surface:** White (`#FFFFFF`), `0.75rem` border radius, `1px` subtle outline (`#E2E8F0`).
* **Hover State:** Slight lift with ambient Oxford Blue shadow.
* **Faculty Cards:** Circular avatar photo (`rounded-full`), Serif name title, Sans-serif designation.
* **Lab Cards:** Image header, Cyan category tag (`label-sm`), Serif lab name.

### 4. Form Controls & Buttons
* **Primary Button:** Oxford Blue (`#002147`) background with White text (`#FFFFFF`), `0.25rem` radius.
* **Secondary Button:** Science Cyan (`#00A3C1`) outline with Cyan text.
* **Input Fields:** `1px` outline in `#74777F`, focus ring with Science Cyan glow.

### 5. Footer
* **Background:** Oxford Blue (`#002147`) dark footer layout.
* **Layout:** Structured columns for Contact Details, Research Wings, Academic Programs, and Accreditation.
* **Typography:** `label-sm` font sizes for clean, secondary presentation.
