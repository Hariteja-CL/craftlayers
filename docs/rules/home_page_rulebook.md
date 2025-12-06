# Home Page Rulebook

## 1. Page Goal
**Primary Objective**: Convert visitors to case study readers and potential leads.
**Secondary Objective**: Establish "CraftLayers" as a premium, technical, and design-forward entity.

## 2. Layout Grid
- **System**: 12-column grid.
- **Container**: Max-width 1440px, centered.
- **Gutters**: `Space-6` (24px) on mobile, `Space-8` (32px) on desktop.
- **Vertical Rhythm**: Strictly use `Space-24` (96px) or `Space-32` (128px) between major sections.

## 3. Mandatory Components
Only the following components are allowed on the Home Page to maintain consistency.

### Hero Section (`Hero_v1`)
- **Elements**: H1 Display Text ("Crafting Digital Layers"), Subtext, Primary CTA ("View Work"), Secondary CTA ("Contact").
- **Style**: Full height (100vh) or min-height 800px.
- **Background**: Subtle gradient or abstract 3D layer visualization.

### Project Grid (`ProjectCard_Grid`)
- **Layout**: 2-column masonry or grid.
- **Card Style**: `Radius-L`, `Border-Subtle`, Image-heavy.
- **Content**: Title, Category, "View Case Study" link.

### Features / Services (`Feature_List`)
- **Layout**: 3-column grid of icons + text.
- **Icons**: Thin stroke, `Brand-500` color.

### Call to Action (`Footer_CTA`)
- **Style**: Large typography, high contrast background (`Brand-900` or `Neutral-900`).

## 4. Interaction Physics (Framer Motion)
Defines the "feel" of the page.

- **Entrance Animations**:
  - **Stagger**: Children elements (like grid items) stagger by `0.1s`.
  - **Fade Up**: Elements translate Y `20px` -> `0px` and Opacity `0` -> `1` over `0.6s` easeOut.

- **Scroll Interactions**:
  - **Parallax**: Subtle parallax on Hero background elements (y: -50).
  - **Reveal**: Section headers reveal using a clipping mask effect.

- **Hover States**:
  - **Cards**: Scale `1.02`, Shadow `lg`, Border `Brand-500`.
  - **Buttons**: Scale `1.05` (spring stiffness 400, damping 10).

---
*This rulebook serves as the source of truth for the Home Page implementation. Any deviation requires a Rulebook update.*
