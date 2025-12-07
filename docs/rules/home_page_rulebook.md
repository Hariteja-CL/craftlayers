# Page Rulebook: Home Page (Landing)

**Context:** The primary entry point for CraftLayers.
**Visual Reference:** `image_78467e.jpg`
**Data Source:** `CraftLayers DS.json`

---

## 1. Layout & Grid Architecture
* **Root Container:**
    * **Max Width:** `ContainerMaxWidthXl` (1440px).
    * **Background:** `ColorBgPage` ({Grey Scale.Gray0}).
* **Grid System:**
    * **Desktop:** 12-column grid.
    * **Gutter:** `GridGutterLg` ({Global32} / 32px).
    * **Padding X:** `ContainerPaddingX` ({Global24}).
* **Vertical Rhythm:**
    * **Section Spacing:** `Space3XL` (64px) between the Hero, Cards, and Profile sections.

---

## 2. Component Specifications
*Use these strict token mappings to build the UI.*

### **A. Navigation Bar**
* **Height:** 80px (Fixed).
* **Logo:** "CraftLayers" (Font: `FontWeightBold`). Accent dot uses `Primary.Main.500`.
* **Links:**
    * **Font:** `FontFamilyBase` (Poppins), `En-font-size-body-sm`.
    * **Active State:** Underlined with `Primary.Main.500` (2px height), exactly as seen in "Home" link.

### **B. Hero Section (Text)**
* **Headline (H1):** "Designing Clarity..."
    * **Token:** `En-font-size-h1` (48px).
    * **Color:** `ColorTextPrimary` ({Gray 700}).
    * **Weight:** `FontWeightSemibold`.
* **Sub-Headline (H2):** "Where Design, Security & AI Converge."
    * **Token:** `En-font-size-h2` (32px).
    * **Color:** `ColorTextSecondary` ({Gray 400}).
* **Description:** "One portfolio that blends..."
    * **Token:** `En-font-size-body` (16px).

### **C. The "Layer" Cards (3-Column Grid)**
* **Component Name:** `ServiceCard`
* **Dimensions:** Fluid width (Col-span-4).
* **Structure:**
    * **Padding:** `SpaceXl` (32px).
    * **Radius:** `RadiusLg` (16px).
    * **Background:** `ColorBgSurface` ({Gray 10}).
    * **Border:** `ColorBorderDefault` ({Gray 200}) - 1px solid.
* **State Rules:**
    * **Hover/Active:** Border color changes to `Primary.Main.400` ({#ffa726}). (Matches the "Design Layer" card in screenshot).
* **Icon Container:**
    * **Bg:** `Gray 100` or Pastel variant.
    * **Radius:** `RadiusFull` (Circle).
    * **Icon Color:** `Primary.Main.500`.
* **Action Link:** "Explore ->"
    * **Color:** `ColorTextLink` ({Primary.Main.700}).
    * **Icon:** Arrow Right (Feather Icons).

### **D. Profile Banner (Bottom)**
* **Component Name:** `ProfileHero`
* **Background:** `Info.100` ({#e5f2ff}) or `Pastel.Blue.50`.
* **Border:** `ColorBorderMuted`.
* **Radius:** `RadiusLg`.
* **Layout:** Flex-Row (Image Left, Content Right).
* **Image:**
    * **Size:** 160x160px.
    * **Radius:** `RadiusMd`.

---

## 3. Motion Physics (Framer Motion)
*Apply these specific variants to `components/home/HomeView.tsx`.*

**Global Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`.

### **Sequence A: Page Load**
* **Stagger:** `0.15s` between Hero Text -> Cards -> Profile.
* **Animation:** `FadeUp`
    ```javascript
    hidden: { opacity: 0, y: 30 }
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    ```

### **Sequence B: Card Interaction**
* **Hover Target:** `ServiceCard`
    ```javascript
    whileHover: {
      y: -8,
      borderColor: "var(--primary-400)",
      boxShadow: "0 12px 32px rgba(0,0,0,0.08)"
    }
    ```
