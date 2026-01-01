⚙️ Master Rulebook Extension: Layer Theme Implementation

This extension defines the mandatory visual and structural changes required to implement the "Layer Theme" for the CraftLayers portfolio, ensuring all styles are derived exclusively from the existing Design System (`tailwind.config.ts`).-----6. 🌈 Layer Theme System (New Semantic Tokens)

**Goal:** Create dedicated visual tokens for the three primary content categories, derived from the existing `pastel` and `functional` color palettes.6.1. Layer Color Mapping

| Layer Name | Theme Use | Semantic Token (Example Base) | DS Primitive Source |
| ----- | ----- | ----- | ----- |
| **Design Layer** | Creative/Visual Focus | `bg-layer-design`, `text-layer-design` | `pastel.purple.100` / `pastel.purple.500` |
| **AI Layer** | Data/System Focus | `bg-layer-ai`, `text-layer-ai` | `pastel.blue.100` / `pastel.blue.500` |
| **Security Layer** | Trust/Vetting Focus | `bg-layer-security`, `text-layer-security` | `success.100` / `success.700` |

6.2. New Component Tokens

The Antigravity Agent MUST extend the Tailwind config with these semantic aliases for use in component classes:  
// Add to theme.extend.colors in tailwind.config.ts  
layer: {  
  // Design Layer  
  design: {  
    bg: colors.pastel.purple\['50'\], // \#f7f3ff  
    text: colors.pastel.purple\['500'\], // \#a682d7  
    border: colors.pastel.purple\['100'\], // \#f5f1fa  
  },  
  // AI Layer  
  ai: {  
    bg: colors.pastel.blue\['50'\], // \#f3f8fe  
    text: colors.pastel.blue\['500'\], // \#50a9ee  
    border: colors.pastel.blue\['100'\], // \#eaf6fd  
  },  
  // Security Layer  
  security: {  
    bg: colors.success\['100'\], // \#e5fff1  
    text: colors.success\['700'\], // \#0d8041  
    border: colors.success\['100'\],  
  }  
}  
\-----7. 🧱 Component Implementation Rules

**Goal:** Specify how existing components will be visually differentiated based on their `layer` data property.7.1. CaseStudyCard / ServiceCard (The "Layer" Cards)

| Rule | Implementation | DS Tokens Enforced |
| ----- | ----- | ----- |
| **Card Background** | Background of the `ServiceCard` must be set to the specific Layer's subtle background token (`bg-layer-*-bg`). | `bg-layer-design-bg, bg-layer-ai-bg, bg-layer-security-bg` |
| **Icon Background** | The small container for the Layer Icon/Number must use the Layer's subtle background token (`bg-layer-*-bg`). | `bg-layer-design-bg` |
| **Icon Color** | The Icon itself must use the Layer's primary text color token. | `text-layer-design-text` |
| **Hover State** | The `whileHover` animation (lift up) **MUST** also change the border color to the Layer's text color. | `borderColor: var(--layer-*-text)` |
| **Action Link** | The "Explore \-\>" link color must match the Layer's text color, overriding the generic `text-content-link`. | `text-layer-design-text` |

7.2. BlogCard & BlogList

* **Display:** Each blog post card must display a **Pill** or **Tag** component (from **DS Primitives**) to clearly label its associated layer (`Design Layer`, `AI Layer`, or `Security Layer`).  
* **Styling:** The Pill/Tag component's color and border **MUST** use the Layer's specific `bg-layer-*-bg` and `text-layer-*-text` tokens.

\-----8. 📐 Content Schema Enforcement

**Goal:** Ensure every piece of content is correctly categorized.8.1. Case Study Schema Update

* The Case Study Schema (`types/case-study.ts` from Document \[1\]) **MUST** be extended to include a mandatory `layer` field:

export interface CaseStudy {  
  // ... existing fields

  // \*\* NEW MANDATORY FIELD \*\*  
  layer: 'design' | 'ai' | 'security'; // Use lowercase for data key

  // ... existing fields  
}  
8.2. Blog Content Rule

* All Blog posts **MUST** contain a metadata tag or field that maps to one of the three required layers: `'design'`, `'ai'`, or `'security'`. Content without a defined layer is invalid.

