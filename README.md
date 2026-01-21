# ⌘ React Command Palette (Assignment 5)

A high-performance, fully accessible, and extensible Command Palette built strictly from scratch.

![Status](https://img.shields.io/badge/Status-Completed-success)
![Coverage](https://img.shields.io/badge/Tests-Passing-success)
![Latency](https://img.shields.io/badge/Latency-%3C10ms-blue)

## 🚀 Live Demo & Storybook
The component is deployed via Chromatic as required by the Global Constraints.
**[View Public Storybook](https://696fdbbbbb84b5a988d78e36-cpgoorutvr.chromatic.com/)**

---

## 🎯 Project Overview
This project is a solution for **Assignment 5: Command Palette & Global Search**. It is a "Headless-style" UI component that provides global command execution with deterministic fuzzy search.

**Key Constraints Met:**
* **Zero External Logic Libraries:** No `cmdk`, `downshift`, `fuse.js`, or `lodash`.
* **Performance:** Custom O(n) linear scan algorithm ensuring < 10ms latency.
* **Strict Accessibility:** WCAG 2.1 AA compliant with strict focus trapping and `aria-live` announcements.

## ✨ Features

### 1. Core Functionality
* **Global Invocation:** Open with `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux).
* **Fuzzy Search:** Custom scoring algorithm that prioritizes consecutive matches and start-of-word matches.
* **Keyboard Navigation:** Full arrow key support with cyclic navigation (no dead ends).

### 2. Extensibility (Plugin API)
* **Data-Driven:** Commands are injected via props, allowing the palette to be used in any context.
* **Recursive Sub-Commands:** Supports infinite nesting of menus (e.g., `Navigation` -> `Settings` -> `Profile`).

### 3. Async & Dynamic Capabilities
* **Async Actions:** Handles Promises gracefully with a visual loading state.
* **Dynamic Parameters:** Supports "Search-as-you-type" flows (e.g., "Search Users") with a **300ms debounce** to prevent API spam.

### 4. Accessibility (A11y)
* **Screen Reader Support:** Includes a hidden Live Region (`aria-live="polite"`) to announce search results to blind users.
* **Focus Management:** Implements a custom `useFocusTrap` hook to prevent tabbing outside the modal.

---

## 🛠️ Tech Stack

| Category | Technology | Reasoning |
| :--- | :--- | :--- |
| **Framework** | React 18 + Vite | Strict Mode enabled; fast HMR. |
| **Language** | TypeScript | `noImplicitAny`, strict null checks enforced. |
| **Styling** | Tailwind CSS | Utility-first approach for lightweight CSS. |
| **Testing** | Vitest + React Testing Library | For unit and interaction testing. |
| **Visuals** | Storybook + Chromatic | For isolated component development and review. |

---

## 🏗️ Architecture & Design Decisions

### Why Custom Fuzzy Search?
Existing libraries like `fuse.js` are powerful but heavy (often 10kb+). Since the requirement was specific (deterministic ranking), I implemented a **Linear Scan (O(n))** algorithm in `src/components/CommandPalette/utils/fuzzySearch.ts`.
* **Result:** < 5kb bundle size overhead and sub-millisecond execution time for typical datasets.

### State Management
Avoided complex global state managers (Redux/Zustand) in favor of **React Local State**.
* `navigationPath`: A stack array tracks the user's depth in sub-menus.
* `activeScope`: A computed memoization that derives the current list of commands based on the `navigationPath`.

---

## ⚡ Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Run Tests
Execute the Vitest suite to verify logic, accessibility, and keyboard interactions.
```bash
npm test
```
### 4. View Storybook
```bash
npm run storybook
```

## 📂 Project Structure

```text
src/
├── components/
│   └── CommandPalette/
│       ├── hooks/
│       │   └── useFocusTrap.ts       # Custom hook for modal focus management
│       ├── utils/
│       │   └── fuzzySearch.ts        # Pure logic: O(n) search algorithm
│       ├── CommandPalette.tsx        # Main Component (Logic + UI)
│       └── CommandPalette.test.tsx   # Automated Integration Tests
├── types.ts                          # Command interfaces & Plugin API
├── App.tsx                           # Example Implementation (Plugin Registry)
└── ...
```
## 📄 Deliverables Links

* **[Performance Report](./PERFORMANCE.md)**: Detailed breakdown of latency measurements and debounce strategies.
* **[Accessibility Report](./ACCESSIBILITY.md)**: Compliance audit regarding ARIA roles and keyboard traps.
* **[Public Storybook](https://696fdbbbbb84b5a988d78e36-cpgoorutvr.chromatic.com/)**: Live interactive demo of the component.

---
Author: [Yash Kumar]
