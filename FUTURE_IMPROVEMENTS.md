# Future Improvements

This file tracks features, optimizations, and user experience enhancements deferred for future implementation.

## Completed

- [x] **Dedicated Setup / Settings Page**: Create an onboarding/setup wizard page where users can configure their Starting Salary and initialize their budget groups and items before entering the main dashboard.
- [x] **Global Transactions Log**: Add a collapsible section at the bottom of the main dashboard listing all recorded transactions for the month with options to filter and batch-delete.
- [x] **Domain Glossary Completion**: Document all domain terms (Budget Group, Remaining, Spent, Over-allocated, Weekend Behavior, Budget Template, Payee) in CONTEXT.md with _Avoid_ disambiguation.
- [x] **Fix Husky Git Hooks**: Setup Husky v9 with a hybrid hook structure (`pre-commit` for formatting, `pre-push` for lints and tests) to automate local validation (see [ADR 0004](docs/adr/0004-branch-protection-and-ci-workflow.md)).

## Planned

### Developer Experience & Core Tooling

- [ ] **Enforce Conventional Commits with commitlint**: Set up `@commitlint/cli` and `@commitlint/config-conventional` integrated with a Husky `commit-msg` hook to programmatically reject non-compliant commit messages.
- [ ] **Migrate to TypeScript**: Instead of expanding/fixing the current inconsistent React `PropTypes` usage, migrate the codebase to TypeScript. This will provide compile-time type safety, better developer tooling, and auto-completion.
- [ ] **Standardize Editor & Prettier Configurations**: Add `.prettierrc` and `.editorconfig` files to the repository root. This ensures all developers and IDEs use identical indentation, trailing newline, and line ending settings.
- [ ] **Node.js Version Pinning (`.nvmrc`)**: Create a `.nvmrc` file at the root pinning the target Node.js version to `v22.19.0` to avoid "works on my machine" issues across different environments.

### Features & Refactoring

- [ ] **Budget Item Type Support (Income vs Expense)**: Every Budget Item currently has a `type` field hardcoded to `"expense"`. Introduce income-type items so users can model salary top-ups, side income, or refunds within a Budget Group rather than only adjusting the Starting Salary.
- [ ] **Remove `columns` from Domain State**: Each Budget Group stores a `columns` array (`[{name: "Assigned"}, {name: "Remaining"}]`) that is purely UI metadata. Move this to the component layer so domain state stays clean.
- [ ] **Month Rollover / Carry Forward**: Currently each Budget Cycle is fully isolated — new months clone from the saved Budget Template. Add an option to roll forward the previous month's group/item structure (and optionally unspent balances) into the next cycle.
- [ ] **Data Export / Import**: All data lives in localStorage with no backup mechanism. Add export-to-JSON and import functionality so users can back up their budget history or move between browsers.
- [ ] **Multi-Device Sync / Backend Persistence**: Replace or supplement localStorage with a backend (e.g. Firebase, Supabase) to enable cross-device access and data durability.
- [ ] **Budget Summary / Insights Page**: The Layout nav bar has a chart-pie icon placeholder with no linked page. Build a summary view showing spending trends, category breakdowns, and month-over-month comparisons.
- [ ] **Rename `tx.name` to `tx.payee`**: Align the Transaction data model with the CONTEXT.md glossary term "Payee" — the field is currently just `name`, which is ambiguous.
- [ ] **Playwright End-to-End Tests**: Integrate Playwright for automated E2E testing of critical user flows (setup wizard, adding Budget Items, recording Transactions, month navigation). Unit tests cover business logic well, but the app has no automated browser-level testing.
- [ ] **GitHub Actions CI Pipeline**: Set up a CI workflow that runs the test suite (`npm test`) on every push and pull request to `main`. This is a prerequisite for moving to a feature-branch workflow with merge protection.
