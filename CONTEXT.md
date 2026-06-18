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
