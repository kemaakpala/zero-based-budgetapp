# Debt tracking as specialised Budget Items with template-stored balances

Debt (credit cards, loans, overdrafts) are modelled as Budget Items with `type: "debt"` inside a dedicated "Debt" Budget Group, rather than as a separate top-level data structure. Outstanding balances are stored in the Budget Template and updated as a side-effect when payment transactions are recorded.

## Considered Options

1. **Separate top-level `debts[]` array** — parallel to `budgetGroups`, with its own reducer actions, persistence, and enrichment logic. Rejected because debts participate in the same zero-based envelope (assigned amounts reduce Unassigned Salary), so a parallel system would duplicate state management while still needing to integrate with `calculateSummary()`.

2. **Outstanding balance stored in monthly data with cross-month loading** — each month's blob would store the debt balance, and new months would read the previous month's data to carry it forward. Rejected because it breaks the month isolation principle (ADR 0002) for a narrow need; the Budget Template already provides a cross-month persistence mechanism.

## Consequences

- The Budget Item data shape gains optional debt-specific fields (`outstandingBalance`, `minimumPayment`, `debtType`, `interestRate`) that only apply when `type: "debt"`. Components must check the item type before rendering these fields.
- The `ADD_TRANSACTION` and `DELETE_TRANSACTION` reducer actions gain a side-effect: when the target item is a debt, the Budget Template's `outstandingBalance` is updated. This is the only place where a reducer action writes to the template.
- The Budget Template's role expands from pure structural configuration to also holding mutable runtime state (outstanding balances). This is a deliberate trade-off to avoid breaking month isolation.
