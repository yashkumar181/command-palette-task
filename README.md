# Custom Command Palette (React + TypeScript)

A fully accessible, keyboard-first Command Palette built from scratch. Demonstrates custom algorithms and accessibility patterns without external UI libraries.

## 🚀 Features
- **Fuzzy Search Algorithm**: Custom implementation (no `fuse.js`) that handles scoring, consecutive match bonuses, and exact string matching.
- **Accessibility (a11y)**: 
  - Custom `useFocusTrap` hook ensures keyboard navigation never leaves the modal.
  - Full ARIA support (`role="dialog"`, `aria-modal`, `aria-selected`).
  - Keyboard navigation (Arrows, Enter, Escape, Tab).
- **Edge Case Handling**: Empty states, strict type safety, and dynamic list updates.
- **Storybook**: Component isolation and documentation.

## 🛠 Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v3
- **Documentation**: Storybook 8

## 🏃‍♂️ How to Run
1. Install dependencies:
   ```bash
   npm install

2. Run Storybook (Demo):
   ```bash
   npm run storybook

3. Open http://localhost:6006 to interact with the component.
   ```bash
   npm run storybook   

## 🔗 Live Demo
- **Public Storybook**: [https://696fdbbbbb84b5a988d78e36-cpgoorutvr.chromatic.com/]
