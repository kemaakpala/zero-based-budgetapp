# Domain Context: Zero-Based Budgeting App

## Glossary

### Starting Salary

The fixed initial amount set at the start of a month's budget (typically matching the user's monthly salary, e.g., £5,000.00).

### Unassigned Salary

The countdown of money that hasn't yet been given a job. It starts equal to the **Starting Salary** and decreases as funds are allocated to **Budget Items**.

### Budget Item

A specific category item (e.g., Rent, Groceries, Charity) that belongs to a **Budget Group**.

### Assigned Amount

The planned amount of money allocated/assigned to a specific **Budget Item**.

### Transaction

An individual record of actual spending containing:

- **Transaction Name / Payee**: The entity receiving the money (e.g., "Tesco").
- **Amount**: The monetary value of the purchase.
- **Associated Budget Item**: The **Budget Item** from which this transaction's amount is subtracted.

### Payday

The day the user receives their monthly salary. This is defined as the 20th of the month, or the preceding Friday if the 20th falls on a weekend.

### Budget Cycle

The date range for a given month's budget. It begins on that month's **Payday** and ends the day before the next month's **Payday**. All transactions and budget allocations made within this window belong to this cycle.

### Budget Group

A named container that organizes related **Budget Items** under a common heading (e.g. "Housing", "Food", "Giving"). Each group holds zero or more Budget Items.

### Remaining

The amount of money left in a **Budget Item's** envelope: **Assigned Amount** minus total **Spent**. This is derived, never stored.
_Avoid_: Balance, available

### Spent

The sum of all **Transaction** amounts linked to a **Budget Item**. This is derived, never stored.
_Avoid_: Used, consumed

### Over-allocated

The state where total **Assigned Amounts** across all **Budget Items** exceed the **Starting Salary**, causing **Unassigned Salary** to go negative. Violates the zero-based principle.
_Avoid_: Overspent, over-budget (which would mean spending exceeds assignment, a different concept)

### Weekend Behavior

The policy applied when a **Payday** falls on a weekend: shift to the preceding Friday, the following Monday, or keep the exact date.
_Avoid_: Weekend rule, weekend policy

### Budget Template

A saved configuration of **Starting Salary**, **Budget Groups**, and **Payday** settings. When a **Budget Cycle** has no saved data, it is initialized from this template.
_Avoid_: Preset, default budget

### Payee

The entity receiving money in a **Transaction** (e.g. "Tesco", "Landlord").
_Avoid_: Vendor, merchant, recipient

### Debt Item

A specialised **Budget Item** with `type: "debt"` that represents an obligation being paid off over time (e.g. a credit card or personal loan). It carries additional metadata: **Outstanding Balance**, **Minimum Payment**, **Debt Type**, and optionally an interest rate. Debt Items live exclusively in the **Debt Group** (named "Debt").
_Avoid_: Liability, loan item

### Outstanding Balance

The total amount still owed on a **Debt Item**. Stored in the **Budget Template** and decremented as a side-effect when payment **Transactions** are recorded. This is the only cross-month state for debts.
_Avoid_: Remaining balance, amount owed

### Minimum Payment

The minimum required monthly payment for a **Debt Item**, as set by the lender.
_Avoid_: Minimum due, required payment

### Debt Type

The category of a **Debt Item**: credit card, personal loan, car loan, student loan, overdraft, or other.
_Avoid_: Loan type, debt category

### Paid Off

The state of a **Debt Item** when its **Outstanding Balance** reaches zero or below. Derived from `outstandingBalance <= 0`, never stored as a flag.
_Avoid_: Settled, cleared, closed

### Debt Group

A dedicated, system-level **Budget Group** (named "Debt") that contains only **Debt Items**. Created automatically when the user indicates they have debts during setup.
_Avoid_: Debt Repayment Group, loans group

### Savings Item

A specialised **Budget Item** with `type: "savings"` that represents a financial goal the user is saving towards (e.g. Emergency Fund, Holiday Fund). It contains metadata: **Goal** and **Starting Balance**. Lives in the **Savings Group**.
_Avoid_: Savings category, target item

### Goal

The target amount of money the user aims to accumulate for a **Savings Item**.
_Avoid_: Target, target amount, savings target

### Starting Balance

The initial funds already saved for a **Savings Item** before the start of the current **Budget Cycle**. Stored in the **Budget Template** and updated dynamically if edited.
_Avoid_: Initial savings, account balance

### To Save

The remaining amount of money needed to reach the **Goal** of a **Savings Item**. Derived as `Goal - (Starting Balance + Assigned Amount - Spent)`. This is derived, never stored.
_Avoid_: Remaining goal, gap to target

### Savings Group

A dedicated, system-level **Budget Group** (named "Savings") that contains only **Savings Items**. Created automatically when the user indicates they want to track savings.
_Avoid_: Savings bucket, goals group
