\# 📘 Page Rulebook: Home Page (Landing)



\*\*Context:\*\* The primary entry point for CraftLayers.

\*\*Visual Reference:\*\* `image\_78467e.jpg`

\*\*Data Source:\*\* `CraftLayers DS.json`



---



\## 1. 📐 Layout \& Grid Architecture

\* \*\*Root Container:\*\*

&nbsp;   \* \*\*Max Width:\*\* `ContainerMaxWidthXl` (1440px).

&nbsp;   \* \*\*Background:\*\* `ColorBgPage` ({Grey Scale.Gray0}).

\* \*\*Grid System:\*\*

&nbsp;   \* \*\*Desktop:\*\* 12-column grid.

&nbsp;   \* \*\*Gutter:\*\* `GridGutterLg` ({Global32} / 32px).

&nbsp;   \* \*\*Padding X:\*\* `ContainerPaddingX` ({Global24}).

\* \*\*Vertical Rhythm:\*\*

&nbsp;   \* \*\*Section Spacing:\*\* `Space3XL` (64px) between the Hero, Cards, and Profile sections.



---



\## 2. 🧱 Component Specifications

\*Use these strict token mappings to build the UI.\*



\### \*\*A. Navigation Bar\*\*

\* \*\*Height:\*\* 80px (Fixed).

\* \*\*Logo:\*\* "CraftLayers" (Font: `FontWeightBold`). Accent dot uses `Primary.Main.500`.

\* \*\*Links:\*\*

&nbsp;   \* \*\*Font:\*\* `FontFamilyBase` (Poppins), `En-font-size-body-sm`.

&nbsp;   \* \*\*Active State:\*\* Underlined with `Primary.Main.500` (2px height), exactly as seen in "Home" link.



\### \*\*B. Hero Section (Text)\*\*

\* \*\*Headline (H1):\*\* "Designing Clarity..."

&nbsp;   \* \*\*Token:\*\* `En-font-size-h1` (48px).

&nbsp;   \* \*\*Color:\*\* `ColorTextPrimary` ({Gray 700}).

&nbsp;   \* \*\*Weight:\*\* `FontWeightSemibold`.

\* \*\*Sub-Headline (H2):\*\* "Where Design, Security \& AI Converge."

&nbsp;   \* \*\*Token:\*\* `En-font-size-h2` (32px).

&nbsp;   \* \*\*Color:\*\* `ColorTextSecondary` ({Gray 400}).

\* \*\*Description:\*\* "One portfolio that blends..."

&nbsp;   \* \*\*Token:\*\* `En-font-size-body` (16px).



\### \*\*C. The "Layer" Cards (3-Column Grid)\*\*

\* \*\*Component Name:\*\* `ServiceCard`

\* \*\*Dimensions:\*\* Fluid width (Col-span-4).

\* \*\*Structure:\*\*

&nbsp;   \* \*\*Padding:\*\* `SpaceXl` (32px).

&nbsp;   \* \*\*Radius:\*\* `RadiusLg` (16px).

&nbsp;   \* \*\*Background:\*\* `ColorBgSurface` ({Gray 10}).

&nbsp;   \* \*\*Border:\*\* `ColorBorderDefault` ({Gray 200}) - 1px solid.

\* \*\*State Rules:\*\*

&nbsp;   \* \*\*Hover/Active:\*\* Border color changes to `Primary.Main.400` ({#ffa726}). (Matches the "Design Layer" card in screenshot).

\* \*\*Icon Container:\*\*

&nbsp;   \* \*\*Bg:\*\* `Gray 100` or Pastel variant.

&nbsp;   \* \*\*Radius:\*\* `RadiusFull` (Circle).

&nbsp;   \* \*\*Icon Color:\*\* `Primary.Main.500`.

\* \*\*Action Link:\*\* "Explore ->"

&nbsp;   \* \*\*Color:\*\* `ColorTextLink` ({Primary.Main.700}).

&nbsp;   \* \*\*Icon:\*\* Arrow Right (Feather Icons).



\### \*\*D. Profile Banner (Bottom)\*\*

\* \*\*Component Name:\*\* `ProfileHero`

\* \*\*Background:\*\* `Info.100` ({#e5f2ff}) or `Pastel.Blue.50`.

\* \*\*Border:\*\* `ColorBorderMuted`.

\* \*\*Radius:\*\* `RadiusLg`.

\* \*\*Layout:\*\* Flex-Row (Image Left, Content Right).

\* \*\*Image:\*\*

&nbsp;   \* \*\*Size:\*\* 160x160px.

&nbsp;   \* \*\*Radius:\*\* `RadiusMd`.



---



\## 3. ⚡ Motion Physics (Framer Motion)

\*Apply these specific variants to `components/home/HomeView.tsx`.\*



\*\*Global Easing:\*\* `cubic-bezier(0.4, 0, 0.2, 1)`.



\### \*\*Sequence A: Page Load\*\*

\* \*\*Stagger:\*\* `0.15s` between Hero Text → Cards → Profile.

\* \*\*Animation:\*\* `FadeUp`

&nbsp;   ```javascript

&nbsp;   hidden: { opacity: 0, y: 30 }

&nbsp;   visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }

&nbsp;   ```



\### \*\*Sequence B: Card Interaction\*\*

\* \*\*Hover Target:\*\* `ServiceCard`

&nbsp;   ```javascript

&nbsp;   whileHover: {

&nbsp;     y: -8,

&nbsp;     borderColor: "var(--primary-400)",

&nbsp;     boxShadow: "0 12px 32px rgba(0,0,0,0.08)"

&nbsp;   }

&nbsp;   ```

---

## 4. 👆 Interaction Rules

**Global Card Behavior:**
*   **Single CTA:** If a card contains exactly one primary Call-to-Action (CTA), the entire card surface acts as the click target (clickable container).
*   **Multiple CTAs:** If a card contains multiple distinct CTAs (e.g., "View Code", "Live Demo"), the card container is **NOT** clickable (it retains hover effects only). Users must click the individual CTA buttons.

