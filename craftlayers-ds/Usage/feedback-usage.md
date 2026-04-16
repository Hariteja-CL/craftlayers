# Feedback Components Usage

This document covers the usage guidelines for **Badge**, **Alert**, and **Spinner**.

---

## Badge

### 1. Purpose
**Use**: To display a status, category, or short numeric counter associated with another element.
**Avoid**: Using for interactive buttons or long strings of text.

### 2. Usage Patterns
- **Notification Count**: Overlaid on icons to show unread items (e.g., "5").
- **Status Indicator**: Inline with items (e.g., "New", "Beta", "Archived").

### 3. State Usage Rules
- **Static**: Badges generally do not change state interactively but may change appearance based on the data they represent.

### 4. Do / Don't
- **Do**: Use color semantically (e.g., Red for errors/urgent, Green for success/new, Neutral for drafts).
- **Don't**: Make badges interactive. If it needs to be clicked, use a Tag (if available) or Button.

### 5. Accessibility Notes
- **Context**: Ensure that pure color changes (like a red dot) are accompanied by a numerical value or text when possible.
- **Counts**: For large numbers, cap visual text (e.g., "99+") but expose the full count via screen reader if accurate data is available.

---

## Alert

### 1. Purpose
**Use**: To display prominent, persistent messages regarding the system state, user feedback, or errors.
**Avoid**: Using for ephemeral notifications (Toasts) or critical interruptions (Modals).

### 2. Usage Patterns
- **Inline**: Placed within a specific content area (e.g., form validation summary).
- **Banner**: Placed at the top of a view for system-wide notices.

### 3. State Usage Rules
- **Visible/Hidden**: Alerts may persist until dismissed by the user or the condition is resolved.

### 4. Do / Don't
- **Do**: Include a clear title and actionable description.
- **Do**: Offer a dismissal action if the alert is not critical to the current workflow.
- **Don't**: Stack multiple alerts; group messages if possible.

### 5. Accessibility Notes
- **Role**: Use `role="alert"` for assertive/critical errors to interrupt assistive technology immediately. Use `role="status"` for polite updates.
- **Live Region**: Ensure dynamically appearing alerts are announced.

---

## Spinner

### 1. Purpose
**Use**: To indicate an indeterminate loading state for an active process.
**Avoid**: Using for long-running processes with a known duration (use a progress bar).

### 2. Usage Patterns
- **Button**: Replaces the icon or text inside a button during submission.
- **Centric**: Centered in a content area or page during data fetch.

### 3. State Usage Rules
- **Active**: Should only be visible when processing is actually occurring.

### 4. Do / Don't
- **Do**: Accompany with text (e.g., "Saving...") if the context isn't obvious.
- **Don't**: Freeze the UI without a spinner or feedback indicator for operations >1s.

### 5. Accessibility Notes
- **Label**: Mandatory. A visual spinner means nothing to screen readers. Must have `aria-label="Loading"` or similar.
