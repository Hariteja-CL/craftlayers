# CraftLayers Theme Rule Book (Gemini Aesthetics)

## 0. Core Philosophy
"Designing Clarity. Converging AI & Trust."
We are moving away from traditional static portfolios to a dynamic, atmospheric ecosystem. The interface should feel alive, intelligent, and premium.

## 1. Navigation ("The Island")
- **Do NOT** use full-width, top-fixed headers.
- **DO** use a floating "pill" or "island" navigation centered at the top.
- **Styling**: `glassmorphism`, `backdrop-blur-xl`, `bg-white/70`, `rounded-full`, `shadow-[0_8px_32px_rgba(0,0,0,0.04)]`.
- **Behavior**: Smooth transitions, hover effects on links should be subtle (background fills on pills).

## 2. Atmospheric Depth
- **Mandatory**: Every page layout must include background "blobs" or gradients to create depth.
- **Implementation**:
  - Use `animate-blob` keyframes (slow float).
  - Colors: `orange-100/40`, `blue-100/40`, `purple-50/40`.
  - Blend Mode: `mix-blend-multiply` with `blur-[120px]`.
- **Goal**: Prevent flat white backgrounds. The app should breathe.

## 3. Bento Grid Layouts
- **Content Structure**: Move away from linear lists (row after row).
- **Grid Logic**: Use CSS Grid to create irregular, interesting layouts (Bento Box style).
- **Cards**:
  - `rounded-[2rem]` (Extra Large rounding is key).
  - Use a mix of **Light Mode** (White bg, Dark text) and **Dark Mode** (Deep Navy `bg-[#0B1121]`, White text) cards within the same grid for contrast.
  - **Profile Integration**: The user profile is a content card itself, integrated into the grid, not just a separate section.

## 4. Component Aesthetics (The "Gemini" Look)
- **Cards**: No borders by default. Use shadows (`shadow-sm` -> `shadow-xl`) and background colors to define edges.
- **Buttons/Pills**:
  - Status Pills: `rounded-full`, `bg-orange-50` with pulsing dots.
  - Action Buttons: `rounded-full`, solid colors (Black/White/Primary), highly tactile hover states.
- **Typography**:
  - Headings: `font-extrabold`, `tracking-tight`.
  - Subtext: `text-gray-500`, `font-medium`.
  - Highlight Text: Use underlines (`border-b-2`) or subtle color accents (`text-orange-500`) instead of bolding everything.
  - **Impact Badges**:
    - **High Impact (Positive)**: Green Gradients (`from-green-500 to-green-600`).
    - **Medium Impact**: Orange Gradients (`from-orange-400 to-orange-500`).
    - **Low Impact**: Red Gradients (`from-red-500 to-red-600`).

## 5. Micro-interactions
- **Hover**: ALL interactive elements must have a `transition-all duration-300`.
- **Lift**: Cards should slightly lift or shadow deepen on hover.
- **Arrows**: Directional arrows (→, ↗) should translate slightly on hover to encourage clicks.

## 6. Color Palette
- **Primary Accent**: Orange/Gold (`#ffa726`, `text-orange-600`).
- **Dark Theme**: Deep Navy (`#0B1121`) for "AI" or "Tech" heavy cards.
- **Light Theme**: Clean White (`#ffffff`) or Soft Blue (`#EBF2FA`) for "Design" or "Profile" cards.
- **Text**: Stark Black (`#1A1A1A`) for headings, Cool Gray (`#64748b`) for body.

## 7. Accessibility (WCAG Compliance)
- **Contrast**:
    - **Never** use `text-gray-400` or lighter for body text or essential labels on white backgrounds.
    - Use `text-gray-500` (Contrast ~8:1) or darker for readable content.
    - Ensure meaningful orange accents have sufficient contrast or are accompanied by other visual cues (icons, underlines).
- **Semantic Structure**: Use correct heading levels (`h1` -> `h2` -> `h3`). Do not skip levels for styling purposes.
- **Focus States**: All interactive elements (Inputs, Buttons, Cards with `onClick`) must have a visible focus ring (`focus:ring-2`).
- **Alt Text**: All decorative images must have `alt=""`. All informational images must have descriptive `alt` text.
- **Motion**: Ensure animations respect `prefers-reduced-motion` where possible, or are subtle enough not to cause vestibular issues.

---
**When creating new pages or components, ALWAYS consult this rule book first.**
