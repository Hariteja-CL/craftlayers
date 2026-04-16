# Input Components Usage

This document covers the usage guidelines for **TextInput**, **Checkbox**, **Radio**, and **Switch**.

---

## TextInput

### 1. Purpose
**Use**: For freeform text data entry (e.g., names, emails, short descriptions).
**Avoid**: Using for constrained sets where selection (Select/Radio) is more appropriate.

### 2. Usage Patterns
- **Standard**: Most common use case. Includes label and optional helper text.
- **With Icon**: Use leading icons for type indicators (e.g., search glass, email envelope). Use trailing icons for utilities (e.g., clear text, toggle password visibility).

### 3. State Usage Rules
- **Error**: Trigger when validation fails. Must be accompanied by a helpful error message in the helper text area.
- **ReadOnly**: Use for information that is relevant but not editable in the current context.
- **Disabled**: Use when the field is not applicable to the user's current flow.

### 4. Do / Don't
- **Do**: Always provide a visible label above the input.
- **Do**: Use placeholder text for examples, not as a replacement for labels.
- **Don't**: clear the input value on valid-but-risky interactions without confirmation.

### 5. Accessibility Notes
- **Linkage**: The Label must be programmatically linked to the Input via `id` and `for`.
- **Description**: Error messages must be linked via `aria-describedby`.

---

## Checkbox

### 1. Purpose
**Use**: To select one or more independent options from a list, or to toggle a clear "yes/no" choice (e.g., "Accept Terms").
**Avoid**: Using for mutually exclusive options (use Radio).

### 2. Usage Patterns
- **Single**: A standalone agreement (e.g., "Subscribe to newsletter").
- **Group**: A list of independent filters or settings.

### 3. State Usage Rules
- **Indeterminate**: Use programmatically in "Parent" checkboxes to indicate that some (but not all) child items are selected.
- **Error**: Can be applied to the group if a selection is mandatory but missing.

### 4. Do / Don't
- **Do**: Write positive labels (e.g., "Receive Notifications") to avoid double negatives.
- **Don't**: Use Checkboxes for actions that take effect immediately (use Switch).

### 5. Accessibility Notes
- **Grouping**: When used in a list, wrap in a `fieldset` with a `legend`.

---

## Radio

### 1. Purpose
**Use**: To select exactly one option from a mutually exclusive set.
**Avoid**: Using for binary on/off settings (use Switch or Checkbox).

### 2. Usage Patterns
- **Vertical List**: Preferred for readability and easy scanning.
- **Horizontal**: Acceptable for short lists (2-3 items) if labels are short.

### 3. State Usage Rules
- **Selection**: One item should generally be selected by default, unless forcing a conscious choice is required (in which case, no selection initially).

### 4. Do / Don't
- **Do**: Ensure labels are clearly associated with their radio button targets.
- **Don't**: Use Radios for optional settings where "None" is a valid state (unless "None" is an explicit option).

### 5. Accessibility Notes
- **Group**: Must be contained in a logical group (e.g., `radiogroup`) to allow arrow key navigation between options.

---

## Switch

### 1. Purpose
**Use**: To toggle a setting or state immediately (e.g., "Airplane Mode", "Dark Mode").
**Avoid**: Using for form data submission (use Checkbox). Switches imply immediate system state change.

### 2. Usage Patterns
- **List Item**: Commonly found in settings lists with the label on the left and switch on the right.

### 3. State Usage Rules
- **On/Off**: Must have immediate visual distinction.

### 4. Do / Don't
- **Do**: Use succinct labels that describe the "On" state clearly (e.g., "Enable Wi-Fi").
- **Don't**: Add "On/Off" text labels inside the switch track; rely on the standard visual indicator.

### 5. Accessibility Notes
- **Role**: Uses `role="switch"` and `aria-checked`.
- **Label**: Clicking the label must toggle the switch.
