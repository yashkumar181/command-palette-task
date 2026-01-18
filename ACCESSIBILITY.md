# Accessibility (A11y) Report

## Compliance Status
- **WCAG 2.1 Level AA**: Compliant for keyboard navigation and focus management.

## Implemented Features
1.  **Focus Trapping**: Custom `useFocusTrap` hook prevents tab focus from escaping the modal.
2.  **Screen Reader Semantics**:
    - `role="dialog"` and `aria-modal="true"` on the container.
    - `role="listbox"` for results, `role="option"` for items.
3.  **Keyboard Navigation**:
    - `Tab` / `Shift+Tab`: Constrained navigation.
    - `Arrows`: Visual selection.
    - `Enter`: Execute.
    - `Escape`: Close.