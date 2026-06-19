import { DEFAULT_BUDGET_GROUPS } from "../utils";

export const loadBudgetData = (monthKey, storageAdapter) => {
  const data = storageAdapter.get(`budget_app_data_${monthKey}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing budget data", e);
    }
  }

  // Load from template defaults
  const savedDefaults = storageAdapter.get("budget_app_defaults");
  if (savedDefaults) {
    try {
      const parsed = JSON.parse(savedDefaults);
      return {
        startingSalary: parsed.startingSalary || 5000.0,
        budgetGroups: JSON.parse(JSON.stringify(parsed.budgetGroups)),
        transactions: [],
      };
    } catch (e) {
      console.error("Error parsing default budget template", e);
    }
  }

  return {
    startingSalary: 5000.0,
    budgetGroups: JSON.parse(JSON.stringify(DEFAULT_BUDGET_GROUPS)),
    transactions: [],
  };
};

export const saveBudgetData = (monthKey, state, storageAdapter) => {
  storageAdapter.set(`budget_app_data_${monthKey}`, JSON.stringify(state));
};

export const getEnrichedGroups = (budgetGroups = [], transactions = [], viewMode = "remaining") => {
  return budgetGroups.map((group) => ({
    ...group,
    columns: [
      { name: "Assigned" },
      { name: viewMode === "remaining" ? "Remaining" : "Spent" },
    ],
    budgetGroupItems: group.budgetGroupItems.map((item) => {
      const itemTransactions = transactions.filter(
        (tx) => tx.budgetItemId === item.id
      );
      const spent = itemTransactions.reduce((sum, tx) => sum + tx.amount, 0);

      const assignedField = item.fields.find(
        (f) => f.label.toLowerCase() === "assigned"
      );
      const assigned =
        assignedField ? parseFloat(assignedField.value) || 0 : 0;
      const remaining = assigned - spent;

      return {
        ...item,
        spent,
        remaining,
        status: item.status
          ? item.status.map((st) => {
              if (
                st.label.toLowerCase() === "remaining" ||
                st.label.toLowerCase() === "spent"
              ) {
                return {
                  ...st,
                  label: viewMode === "remaining" ? "Remaining" : "Spent",
                  value:
                    viewMode === "remaining"
                      ? remaining.toFixed(2)
                      : spent.toFixed(2),
                };
              }
              return st;
            })
          : [],
      };
    }),
  }));
};

export const calculateSummary = (state) => {
  if (!state) {
    return {
      startingSalary: 0,
      totalAssigned: 0,
      unassignedSalary: 0,
      isOverallocated: false,
    };
  }

  const { startingSalary, budgetGroups = [] } = state;

  const totalAssigned = budgetGroups.reduce((total, group) => {
    return (
      total +
      group.budgetGroupItems.reduce((gTotal, item) => {
        const assignedField = item.fields.find(
          (f) => f.label.toLowerCase() === "assigned"
        );
        const assigned =
          assignedField ? parseFloat(assignedField.value) || 0 : 0;
        return gTotal + assigned;
      }, 0)
    );
  }, 0);

  const unassignedSalary = startingSalary - totalAssigned;
  const isOverallocated = unassignedSalary < 0;

  return {
    startingSalary,
    totalAssigned,
    unassignedSalary,
    isOverallocated,
  };
};
