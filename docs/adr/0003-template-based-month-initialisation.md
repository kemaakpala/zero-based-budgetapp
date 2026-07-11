# Template-based month initialisation

When a user navigates to a month that has no saved data, the system initialises it from a saved Budget Template (`budget_app_defaults` in localStorage) rather than cloning the previous month's data. If no template exists, hardcoded defaults from `DEFAULT_BUDGET_GROUPS` are used as a last resort.

The template is created and updated through the Settings wizard, which saves the user's Starting Salary, Budget Groups (with their items), payday day, and weekend behavior as a reusable blueprint.

We chose templates over month rollover because: (1) it avoids coupling between months, keeping the loading logic in `loadBudgetData` simple and stateless; (2) it lets users intentionally restructure their budget for a new month without dragging forward stale categories; and (3) it aligns with the zero-based philosophy of re-justifying every allocation each month.

The trade-off is that ad-hoc changes to a month's groups (adding a new category mid-month) won't propagate to future months unless the user also updates the template via Settings. This is a known friction point.
