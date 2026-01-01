Page Rulebook: Case Studies Page (Detail View)

**Context:** This rulebook governs the structure and interaction of the single-page case study detail view, which serves as a full-screen experience focused on process and flow.

**Data Source & Constraint:** All content **MUST** adhere to the CaseStudy schema (including the mandatory layer tag). All styling **MUST** use utility classes generated from tailwind.config.ts.

1\. 📐 Layout & Grid Architecture

* **Root Container:**  
  * **Max Width:** `max-w-7xl` (1440px).  
  * **Background:** `bg-white`.  
* **Grid System:**  
  * **Desktop:** 12-column grid.  
  * **Mobile-First:** Must collapse to single or 4-column structure on mobile viewports.  
  * **Gutter:** `gap-8` (32px).  
* **Vertical Rhythm (Section Spacing):**  
  * **Between Sections:** Use `py-12` or `mb-12` (48px) for large visual breaks (e.g., between Hero, Approach, Outcomes, Gallery).  
* **Content Readability:**  
  * The main content column (for text, process steps, code) **MUST** be constrained to a maximum width (e.g., `max-w-3xl` or 768px equivalent) to ensure comfortable line lengths.

2\. 🧱 Component & Content SpecificationsA. Content & Schema Enforcement

* **Schema Compliance:** The agent **MUST** enforce the Case Study Schema (from types/case-study.ts), including the mandatory layer: 'design' | 'ai' | 'security' field.  
* **Tone & Dates:** Content **MUST** be concise and sharp. All project dates/duration **MUST** be present in the `context.timeline` field of the schema.  
* **CaseStudyCard/Pill:** If a card or link to this study is present, its background, text, and border colors **MUST** use the theme-specific semantic tokens (e.g., `bg-layer-design-bg`, `text-layer-design-text`).

B. Interactive Components (Focus on Flow)

**GOAL:** Active components (e.g., an interactive discloser card, or a simulated micro-interaction) are used to show the "flow to complete a task" within the process steps.

* **Component Naming:** All interactive presentation components (simulated UI) **MUST** follow PascalCase (e.g., InformationDiscloserCard).  
* **Interaction-State Logic (New Rule):** Any element that simulates a click, hover, or open/close state **MUST** be wrapped in a Framer Motion component and define a visual change (color, shadow, or y position).  
* **Static Callouts:** Static explanation blocks or callouts adjacent to active components **MUST** use semantic text tokens (`text-secondary` or `text-tertiary`) and the `space-y-6` (24px) token for vertical separation from the active element.

3\. ⚡ Motion Physics & Interactivity

* **Global Easing:** `ease-in-out` (cubic-bezier(0.4, 0, 0.2, 1)).

A. Page Load Sequence (Static Components)

* **Default Animation:** Use the FadeUp variant for all static text blocks, headings, and non-interactive components (CaseStudyMetrics, CaseStudyProcessStep container, etc.) to establish a staggered entrance.  
* **FadeUp Variant:**  
  hidden: { opacity: 0, y: 30 }

B. Micro-Interaction Rules (Active Components)

* **Interactive Border Rule:** For any interactive element (e.g., simulated form fields, buttons, or the active discloser card) that has a defined Layer (Design, AI, Security), the **border color** on `whileHover` or `whileTap` **MUST** change to its specific Layer text color:  
  whileHover: {  
*   y: \-2, // Lift slightly for interaction  
*   borderColor: "var(--layer-  
* }  
* **Link Behavior:** All external links in the case study text **MUST** open in a new tab (`target="_blank"`) and use the `text-link` token color.

4\. 🔗 Global Constraints

* **Accessibility:** All images **MUST** include a descriptive `alt` attribute or caption. All content **MUST** meet the WCAG minimum **4.5:1** color contrast ratio.  
* **Code Quality:** Use **ONLY** utility classes from tailwind.config.ts.  
* **Performance:** Implement lazy loading for all images/visual assets below the Case Study Hero.

