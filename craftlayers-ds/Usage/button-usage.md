# Action Components Usage

This document covers the usage guidelines for **Button**, **IconButton**, and **Link**.

---

## Button

### 1. Purpose
**Use**: To trigger an instantaneous operation, form submission, or significant in-app navigation (e.g., "Next Step"). The primary interactive element for user actions.
**Avoid**: Using for simple hyperlinks to external pages (use Link) or for toggling settings (use Switch/Checkbox).

### 2. Usage Patterns
- **Hierarchy**: Use hierarchy variants (Primary, Secondary, Ghost) to denote action importance.
    - **Primary**: The single most important action on a screen. Limit to one per view to guide focus.
    - **Secondary**: Alternative actions (e.g., "Cancel", "Back").
    - **Ghost/Tertiary**: Low-priority or repetitive actions.
- **Placement**: Align with the flow of content, typically at the bottom of forms or top-right of cards.

### 3. State Usage Rules
- **Loading**: Apply the `loading` state for actions taking >1s. The button must become non-interactive.
- **Disabled**: Use sparingly. Prefer allowing interaction and providing error feedback, unless the action is logically impossible (e.g., "Next" on an empty step).
- **Pressed**: Must provide immediate visual feedback upon activation.

### 4. Do / Don't
- **Do**: Use strong, verb-first labels (e.g., "Save Changes", "Delete Item").
- **Do**: Ensure consistent width or padding for grouped buttons.
- **Don't**: Use generic labels like "Click Me" or "Go".
- **Don't**: Overuse the Primary variant; it dilutes the call to action.

### 5. Accessibility Notes
- **Focus**: Must accept keyboard focus and show a clear ring.
- **Activation**: Triggers on `Enter` and `Space`.

---

## IconButton

### 1. Purpose
**Use**: For common actions where an icon is universally understood (e.g., "Close", "Search", "Edit") and space is limited.
**Avoid**: Using for abstract or complex actions where the icon meaning is ambiguous.

### 2. Usage Patterns
- **Toolbars**: Group related IconButtons (e.g., text formatting).
- **Utility**: Close buttons in Modals or Alerts.

### 3. State Usage Rules
- **Hover/Focus**: Critical for confirming the interactive target area.
- **Loading**: Can be replaced by a localized spinner if the action is async.

### 4. Do / Don't
- **Do**: Use tooltips (if available) to clarify the action.
- **Do**: Ensure the touch target size is sufficient (min 44px) even if the icon is smaller.
- **Don't**: Use IconButtons for primary calls to action (prefer Button with Label).

### 5. Accessibility Notes
- **Mandatory**: Must have a descriptive `aria-label` (e.g., `aria-label="Close settings"`). The visual icon is not accessible to screen readers.

---

## Link

### 1. Purpose
**Use**: To navigate to a completely different location, URL, or resource.
**Avoid**: Using for actions that change data or state (use Button).

### 2. Usage Patterns
- **Inline**: Embedded within a sentence or paragraph.
- **Standalone**: Footer navigation, breadcrumbs, or independent resource lists.

### 3. State Usage Rules
- **Visited**: Should visually distinguish visited links where history is relevant (e.g., documentation lists).
- **Hover**: Should verify interactivity (e.g., adding/removing underline).

### 4. Do / Don't
- **Do**: Make the link text descriptive of the destination (e.g., "Read the Style Guide").
- **Don't**: Use "Click here" or "Read more" as the link text; it lacks context.

### 5. Accessibility Notes
- **Structure**: Uses the native anchor (`<a>`) tag.
- **Contrast**: Inline links must be distinguishable from surrounding text by more than just color (use underline or weight).
