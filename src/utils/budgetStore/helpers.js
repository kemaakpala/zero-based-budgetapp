import { DEFAULT_BUDGET_GROUPS } from "../utils";

export const loadBudgetData = (monthKey, storageAdapter) => {
  const data = storageAdapter.get(`budget_app_data_${monthKey}`);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return {
        startingSalary: parsed.startingSalary || 5000.0,
        budgetGroups: parsed.budgetGroups || [],
        transactions: parsed.transactions || [],
        paydayDay: parsed.paydayDay ?? 20,
        weekendBehavior: parsed.weekendBehavior ?? "preceding-friday",
      };
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
        paydayDay: parsed.paydayDay ?? 20,
        weekendBehavior: parsed.weekendBehavior ?? "preceding-friday",
      };
    } catch (e) {
      console.error("Error parsing default budget template", e);
    }
  }

  return {
    startingSalary: 5000.0,
    budgetGroups: JSON.parse(JSON.stringify(DEFAULT_BUDGET_GROUPS)),
    transactions: [],
    paydayDay: 20,
    weekendBehavior: "preceding-friday",
  };
};

export const saveBudgetData = (monthKey, state, storageAdapter) => {
  storageAdapter.set(`budget_app_data_${monthKey}`, JSON.stringify(state));
};

export const getEnrichedGroups = (
  budgetGroups = [],
  transactions = [],
  viewMode = "remaining"
) => {
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

      const assigned = parseFloat(item.assigned) || 0;
      const remaining = assigned - spent;

      const enrichedItem = {
        ...item,
        spent,
        remaining,
        status: [
          {
            label: viewMode === "remaining" ? "Remaining" : "Spent",
            value:
              viewMode === "remaining"
                ? remaining.toFixed(2)
                : spent.toFixed(2),
            type: "text",
          },
        ],
      };

      // Add debt-specific derived fields
      if (item.type === "debt") {
        enrichedItem.isPaidOff =
          (parseFloat(item.outstandingBalance) || 0) <= 0;
      }

      return enrichedItem;
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
        const assigned = parseFloat(item.assigned) || 0;
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

export const updateTemplateDebtBalance = (
  storageAdapter,
  itemId,
  amountChange
) => {
  const raw = storageAdapter.get("budget_app_defaults");
  if (!raw) return;

  try {
    const template = JSON.parse(raw);
    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === itemId && item.type === "debt") {
          item.outstandingBalance =
            (parseFloat(item.outstandingBalance) || 0) + amountChange;
          storageAdapter.set("budget_app_defaults", JSON.stringify(template));
          return;
        }
      }
    }
  } catch (e) {
    console.error("Error updating template debt balance", e);
  }
};
