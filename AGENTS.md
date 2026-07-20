# Agent Instructions — Every Pound (£) Zero-Based Budget App

This file provides context and rules for AI coding agents working in this repository. Before making any changes, read `CONTEXT.md` for domain terminology, `CONTRIBUTING.md` for git branch and PR workflow rules, and `docs/adr/` for architectural decisions.

---

## Git & Commit Workflow (CRITICAL)

Before editing any files or running commands that modify the repository, you MUST check the current git branch:

1. Run `git status` or check git branch information.
2. If you are on `main`, you **MUST** create and check out a new branch off `main` before performing any edits or implementation steps:
   - For features: `git checkout -b feat/your-feature-name`
   - For bugfixes: `git checkout -b fix/your-bugfix-name`
3. If you are already on a feature branch (e.g., `feat/` or `fix/`), you should continue working on it.
4. **Never edit files or commit directly to the `main` branch.**

When committing changes, always use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:

- Use `feat: ...` for features.
- Use `fix: ...` for bug fixes.
- Use `docs: ...` for documentation updates.
- Use `style: ...` for formatting or CSS changes.
- Use `refactor: ...` for code refactoring.
- Use `test: ...` for adding/updating tests.
- Use `chore: ...` for dependency updates or boilerplate/tooling config updates.

---

## Domain Language

Use the terms defined in `CONTEXT.md`. Key rules:

- Say **Budget Group**, not "category group" or "section"
- Say **Budget Item**, not "line item", "category", or "entry"
- Say **Payee**, not "vendor", "merchant", or "recipient"
- Say **Remaining**, not "balance" or "available"
- Say **Spent**, not "used" or "consumed"
- Say **Over-allocated**, not "overspent" or "over-budget" (over-budget means spending exceeds assignment — a different concept)
- Say **Budget Template**, not "preset" or "default budget"
- Say **Weekend Behavior**, not "weekend rule" or "weekend policy"

When naming variables, props, or functions, prefer the glossary term (e.g. `payee` over `vendorName`, `remaining` over `balance`).

---

## Architecture Rules

### State management

All budget state flows through a single `useReducer(budgetReducer)` in `src/Container/Budget/Budget.jsx`. Do not:

- Add separate `useState` hooks for data that belongs in the reducer (salary, groups, items, transactions)
- Introduce external state management (Redux, Zustand, etc.) without an explicit decision
- Mutate state directly — always dispatch an action

### Derived values are computed, never stored

`remaining`, `spent`, `unassignedSalary`, and `isOverallocated` are calculated on every render via `getEnrichedGroups()` and `calculateSummary()` in `src/utils/budgetStore/helpers.js`. Do not:

- Store derived values in the reducer state
- Add derived fields to localStorage data
- Cache derived values in component state

### Persistence goes through StorageAdapter

All reads/writes to localStorage go through the `StorageAdapter` interface (`get`/`set`) defined in `src/utils/budgetStore/adapters.js`. Do not:

- Call `localStorage.getItem`/`setItem` directly from components or reducers
- The one exception is `Settings.jsx`, which directly manages `budget_app_defaults` and `budget_app_setup_completed` — this may be refactored in future

### Month isolation

Each month's budget data is a completely independent blob keyed by `budget_app_data_{MonthName}-{Year}`. Do not:

- Create cross-month references or dependencies
- Assume the previous month's data exists when loading a new month
- See `docs/adr/0002-month-key-data-isolation.md` for rationale

### Template-based initialisation

New months are initialised from `budget_app_defaults` (the saved Budget Template), not from the previous month's data. Do not:

- Copy the previous month's state as a starting point for a new month
- See `docs/adr/0003-template-based-month-initialisation.md` for rationale

### Component reuse

- Do NOT create a new UI component if an existing one under `src/Component/` can satisfy the requirements (via composition, configuration, or props).
- Always search `src/Component/` and `src/Container/` first to locate reusable presentational elements (e.g. `Button`, `TextField`, `PopOverMenu`, `BudgetGroup`, `BudgetItem`, `TransactionLog`).
- Prefer extending or refactoring existing presentational components over introducing new variations.

---

## Data Shapes

### Budget Item

```js
{
  id: string,        // crypto-generated 32-char hex UUID
  name: string,      // e.g. "Rent / Mortgage"
  assigned: number,   // planned amount (float)
  type: "expense"    // currently always "expense" — income types not yet implemented
}
```

### Transaction

```js
{
  id: string,         // crypto-generated 32-char hex UUID
  name: string,       // payee name (e.g. "Tesco")
  amount: number,     // spent amount (float, always positive)
  budgetItemId: string, // FK to Budget Item id
  date: string        // ISO 8601 timestamp
}
```

### Budget Group

```js
{
  name: string,                    // e.g. "Housing"
  columns: [{name: string}],      // UI display metadata (see note below)
  budgetGroupItems: BudgetItem[]
}
```

> **Note:** The `columns` array is UI metadata baked into domain state. This is a known design smell tracked in `FUTURE_IMPROVEMENTS.md`.

### Reducer State (full shape)

```js
{
  startingSalary: number,       // e.g. 5000.00
  budgetGroups: BudgetGroup[],
  transactions: Transaction[],
  paydayDay: number,            // 1-31, default 20
  weekendBehavior: string       // "preceding-friday" | "following-monday" | "exact"
}
```

---

## File Organisation

```
src/
├── Component/          # Reusable presentational components (Button, TextField, Hero, etc.)
│   └── index.jsx       # Barrel export for all components
├── Container/          # Stateful page-level containers
│   └── Budget/         # Main budget dashboard (owns the reducer)
├── Settings/           # Setup wizard / template editor
├── Layout/             # App shell (header, nav, footer)
├── Routes/             # Router configuration
├── Error/              # Error boundary page
├── utils/
│   ├── budgetStore/    # Reducer, helpers, adapters (core business logic)
│   ├── budgetCycle/    # BudgetCycleCalculator class (payday & cycle date logic)
│   ├── utils.js        # Shared utilities (ID generation, formatting, defaults)
│   └── constants.js    # Enum-like constants
└── mocks/              # Test fixture data
```

- **Business logic** belongs in `src/utils/budgetStore/` or `src/utils/budgetCycle/`, not in components
- **Components** in `src/Component/` should be presentational — they receive props and render UI
- **Containers** in `src/Container/` own state and pass it down

### Component Rendering Hierarchy

```
Budget (container, owns reducer)
├── Hero (salary display + edit)
├── BudgetForm (group container wrapper)
│   └── BudgetGroup × N
│       ├── BudgetGroupHeader
│       ├── BudgetGroupItem × N (uses PopOverMenu, ProgressBar, TextField)
│       └── BudgetGroupActions
├── TransactionLog (global log, collapsible)
├── AddTransactionModal
└── ViewTransactionsModal
```

---

## Testing

- This project follows **test-driven development** — use the `tdd` skill when building features or fixing bugs
- Test runner: **Vitest** (`npm test` runs `vitest run`)
- DOM testing: **@testing-library/react** + **jsdom**
- For tests that need storage, use `InMemoryStorageAdapter` from `src/utils/budgetStore/adapters.js`
- ID generation uses `window.crypto.getRandomValues` — in test environments, ensure a polyfill or mock is available

---

## Tech Stack

- React 19 (Create React App)
- React Router v7
- Vanilla CSS (no Tailwind, no CSS-in-JS)
- FontAwesome icons via `@fortawesome/react-fontawesome`
- Prettier + Husky + lint-staged for formatting
- No TypeScript (plain JSX)

---

## Key Files for Reference

| Purpose                   | File                                   |
| ------------------------- | -------------------------------------- |
| Domain glossary           | `CONTEXT.md`                           |
| Git workflow & guidelines | `CONTRIBUTING.md`                      |
| Architectural decisions   | `docs/adr/*.md`                        |
| Future work tracker       | `FUTURE_IMPROVEMENTS.md`               |
| Budget state reducer      | `src/utils/budgetStore/reducer.js`     |
| Derived value helpers     | `src/utils/budgetStore/helpers.js`     |
| Storage abstraction       | `src/utils/budgetStore/adapters.js`    |
| Budget cycle calculator   | `src/utils/budgetCycle/budgetCycle.js` |
| Main dashboard container  | `src/Container/Budget/Budget.jsx`      |
| Setup wizard              | `src/Settings/Settings.jsx`            |

---

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues. See [docs/agents/issue-tracker.md](file:///home/patrick/dev/zero-based-budgetapp/docs/agents/issue-tracker.md).

### Triage labels

Triage labels map to canonical roles (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See [docs/agents/triage-labels.md](file:///home/patrick/dev/zero-based-budgetapp/docs/agents/triage-labels.md).

### Domain docs

Single-context repository layout. See [docs/agents/domain.md](file:///home/patrick/dev/zero-based-budgetapp/docs/agents/domain.md).

---

## Browser Diagnostics Workaround (CDP Fallback)

If the platform's `open_browser_url` or `browser_subagent` fails with a CDP error (e.g., `failed to resolve CDP URLs: get CDP version info: could not resolve IP for 127.0.0.1`), DO NOT attempt to retry or exit. Instead, utilize the local Playwright runner workaround:

1. Define the target browser actions (goto, click, fill, wait, screenshot, dump) in [actions.json](file:///home/patrick/dev/zero-based-budgetapp/e2e/actions.json).
2. Set screenshot paths to save directly to the current conversation's brain folder (e.g., `/home/patrick/.gemini/antigravity-ide/brain/<conversation-id>/filename.png`).
3. Run the Playwright spec via the terminal:
   ```bash
   npx playwright test e2e/runner.spec.js
   ```
4. Verify the output logs and check the saved screenshots in the conversation folder.
