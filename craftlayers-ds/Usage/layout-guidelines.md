# Structural Components Usage

This document covers the usage guidelines for **Card**, **Modal**, and **Divider**.

---

## Card

### 1. Purpose
**Use**: To group related content and actions about a single subject (e.g., a product, a user profile, a dashboard widget) into a self-contained unit.
**Avoid**: Using for primary page layout structure where a simple grid or section is sufficient.

### 2. Usage Patterns
- **Content Grouping**: Segmenting lists of heterogeneous items.
- **Interactive**: Cards acting as navigation entry points (clickable cards).

### 3. State Usage Rules
- **Interactive**: If the entire card is clickable, it must support hover, focus, and pressed states similar to a button.

### 4. Do / Don't
- **Do**: maintain a consistent hierarchy (Header -> Body -> Footer).
- **Do**: Use elevation or borders to distinguish cards from the background.
- **Don't**: Overload cards with too many competing primary actions.

### 5. Accessibility Notes
- **Structure**: Use semantic container roles (`article`) if the card represents a standalone item.
- **Headings**: Ensure the card title follows the heading hierarchy of the page.

---

## Modal

### 1. Purpose
**Use**: To display critical content or simple tasks that require the user's full attention, blocking interaction with the main page.
**Avoid**: Using for complex workflows or large amounts of information (use a new page or side sheet).

### 2. Usage Patterns
- **Confirmation**: "Are you sure?" dialogs.
- **Input**: Short forms or settings adjustments.

### 3. State Usage Rules
- **Open**: The modal captures focus. Interaction with the background ("backdrop") typically dismisses the modal or is blocked.

### 4. Do / Don't
- **Do**: Provide a clear title and an obvious way to close the modal (Close button + Esc key).
- **Do**: Keep modal content focused and concise.
- **Don't**: Stack modals on top of other modals.

### 5. Accessibility Notes
- **Focus Trap**: Focus MUST be constrained within the modal while it is open.
- **Roles**: Use `role="dialog"` or `role="alertdialog"` (for critical confirmations).
- **Escape**: Pressing Esc must close the modal.

---

## Divider

### 1. Purpose
**Use**: To visually separate content groups or sections within a layout.
**Avoid**: Overusing dividers; often whitespace is a cleaner separator.

### 2. Usage Patterns
- **Horizontal**: Separating rows in a list or sections in a card.
- **Vertical**: Separating inline items like toolbar buttons.

### 3. State Usage Rules
- **Static**: Dividers are purely presentational.

### 4. Do / Don't
- **Do**: Use subtle colors to avoid visual noise.
- **Don't**: Use dividers to convey meaning (e.g., grouping) that isn't also conveyed by spacing or headings.

### 5. Accessibility Notes
- **Role**: `role="separator"`.
- **Decorative**: If the divider is purely valid, ensure it is hidden from the accessibility tree (`aria-hidden="true"`) or treated as a semantic `<hr>`.
