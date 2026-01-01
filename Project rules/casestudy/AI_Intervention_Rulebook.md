# AI Intervention Assistant Rulebook

## 1. System Identity
*   **Name:** Enculture AI (Enterprise Agentic UX).
*   **Tone:** Operational, Objective, Non-Anthropomorphic.
    *   *Bad:* "I think we should do this."
    *   *Good:* "System detected signal. Analysis indicates..."
*   **Mandate:** Analyze aggregated data and suggest structural interventions.

## 2. Interface Rules (Chat)
*   **Container:**
    *   **Background:** White (bg-white).
    *   **Height:** Full height (h-full).
    *   **Padding:** p-4 (16px).
    *   **Scroll:** overflow-y-auto.

*   **Message Bubbles:**
    *   **User:**
        *   **Bg:** bg-neutral-900.
        *   **Text:** text-white.
        *   **Shape:** rounded-2xl, rounded-tr-sm.
        *   **Icon:** User (Lucide), White text on Black bg.
    *   **Assistant (AI):**
        *   **Bg:** bg-neutral-50 (Chat bubble) / bg-indigo-100 (Icon).
        *   **Text:** text-neutral-800 (Text) / text-indigo-600 (Icon).
        *   **Shape:** rounded-2xl, rounded-tl-sm.
        *   **Border:** border-neutral-100.
        *   **Icon:** Bot (Lucide), Indigo text on Indigo-100 bg.

## 3. Interaction Components
*   **Quick Actions (Chips):**
    *   **Location:** Above input area.
    *   **Style:** bg-neutral-100, text-neutral-600, rounded-full.
    *   **State:** hover:bg-neutral-200.
    *   **Behavior:** Immediate trigger of AI refinement.

*   **Input Area:**
    *   **Field:** bg-neutral-50, border-neutral-200, rounded-xl.
    *   **Button:** bg-indigo-600 (Send), text-white, rounded-lg.
    *   **Focus:** ring-indigo-500/20.

## 4. Intervention Cards (ActionPlanWidget)
*   **Container:** bg-white, border-neutral-200, rounded-xl, shadow-sm.
*   **Typography:**
    *   **Title:** text-sm, font-semibold, text-neutral-900.
    *   **Description:** text-xs, text-neutral-600.
*   **Visual Logic:**
    *   **Impact Tags:** Gradient backgrounds (Red/Orange/Green) based on High/Medium/Low impact.
    *   **Status:** "Execute" -> "Scheduled" (Green check).

## 5. Motion (Framer Motion)
*   **Entrance:** Staggered fade-up (animate-in fade-in slide-in-from-bottom-2).
*   **Typing:** Pulse animation on Sparkles icon.
