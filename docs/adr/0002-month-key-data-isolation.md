# Month-key-based data isolation

Each Budget Cycle's data is stored as a completely independent JSON blob under the key `budget_app_data_{MonthName}-{Year}` (e.g. `budget_app_data_July-2026`). There is no shared state between months and no concept of carrying over balances.

This mirrors the zero-based budgeting philosophy: every month starts from zero. It also simplifies the data model — there are no cross-month references, no migration concerns when months roll over, and each month can be loaded or deleted independently.

The consequence is that if a user adds a new Budget Group mid-month, it doesn't automatically appear in future months. Future months are initialised from the saved Budget Template (see ADR-0003), not from the previous month's actual state. This is a deliberate simplification; month rollover is a candidate for future work but would add complexity to the currently simple loading logic in `loadBudgetData`.
