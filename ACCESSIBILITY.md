# Accessibility (A11y) Compliance Report

## 🏆 Compliance Status
**Standard:** WCAG 2.1 Level AA
**Focus Management:** Strict Modal Trap
**Screen Reader Support:** Full Announcement Coverage

---

## ♿ Implemented Features

### 1. Dynamic Screen Reader Announcements
**Challenge:** Blind users (using VoiceOver/NVDA) are often unaware when search results appear or update after typing.
**Implementation:**
* Added a visually hidden Live Region: `<div role="status" aria-live="polite" />`.
* **Behavior:** When the result list changes, this region automatically updates its text content (e.g., *"3 results available. Use up and down arrows to navigate"* or *"No results found"*).
* **Why "Polite"?** This setting ensures the screen reader finishes its current sentence before announcing the update, preventing a jarring user experience.

### 2. "No Dead Ends" Keyboard Navigation
As per the strict requirement *"No keyboard dead ends"*:
* **Focus Trap (`useFocusTrap` hook):** When the modal is open, the `Tab` key is intercepted. Focus cannot accidentally escape to the background page, which would disorient keyboard-only users.
* **Arrow Navigation:** Users can cycle through results using `ArrowUp` and `ArrowDown`. The selection wraps around (First → Last) to prevent hitting a "wall."
* **Escape Logic:**
    * **Level 1:** If in a Sub-Menu (e.g., *Settings*), `Esc` returns to the *Main Menu*.
    * **Level 2:** If in the *Main Menu*, `Esc` closes the modal and restores focus to the button that opened it.

### 3. Semantic ARIA Structure
The component is built using native semantic roles rather than generic `<div>` soup:
* **`role="dialog"` + `aria-modal="true"`**: Informs assistive technology that the rest of the page is inert.
* **`role="listbox"` & `role="option"`**: Used for the result list to properly communicate the "selectable list" behavior.
* **`aria-activedescendant`**: The input field maintains focus, but this attribute tells the screen reader which *result* is currently "visually selected." This is a crucial pattern for comboboxes.

---

## 🔍 Verification Tests

### Automated Testing
* **Tool:** `vitest` + `@testing-library/react`
* **Test:** Verified that the hidden `role="status"` div updates its text content upon search.
* **Test:** Verified that `fireEvent.keyDown(window, { key: 'Escape' })` correctly unmounts the component.

### Manual Audit (Chrome Accessibility Tree)
* **Verified:** The "Accessibility Tree" in DevTools shows the correct name ("Command Palette") and role ("Dialog").
* **Verified:** Focus ring is always visible (High Contrast Mode compliant).
