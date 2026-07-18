import { DEFAULT_BUDGET_GROUPS } from "../utils";

// Data migration: strips the legacy `columns` property from persisted budget
// groups. Before this refactor, each group stored UI column metadata (e.g.
// [{name: "Assigned"}, {name: "Remaining"}]) in domain state. Columns are now
// computed at the component layer (BudgetGroup / DebtGroup). This sanitizer
// ensures old localStorage blobs are cleaned up on first load. Safe to remove
// once no persisted data carries `columns`.
const sanitizeBudgetGroups = (groups = []) => {
  return groups.map(({ columns, ...rest }) => ({
    ...rest,
    budgetGroupItems: rest.budgetGroupItems || [],
  }));
};

export const loadBudgetData = (monthKey, storageAdapter) => {
  const data = storageAdapter.get(`budget_app_data_${monthKey}`);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return {
        incomes: parsed.incomes || [
          { id: "inc-default", name: "Main Salary", amount: 5000.0, received: true }
        ],
        budgetGroups: sanitizeBudgetGroups(parsed.budgetGroups || []),
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
        incomes: parsed.incomes || [
          { id: "inc-default", name: "Main Salary", amount: 5000.0, received: true }
        ],
        budgetGroups: sanitizeBudgetGroups(
          JSON.parse(JSON.stringify(parsed.budgetGroups))
        ),
        transactions: [],
        paydayDay: parsed.paydayDay ?? 20,
        weekendBehavior: parsed.weekendBehavior ?? "preceding-friday",
      };
    } catch (e) {
      console.error("Error parsing default budget template", e);
    }
  }

  return {
    incomes: [
      { id: "inc-default", name: "Main Salary", amount: 5000.0, received: true }
    ],
    budgetGroups: sanitizeBudgetGroups(
      JSON.parse(JSON.stringify(DEFAULT_BUDGET_GROUPS))
    ),
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
      totalIncome: 0,
      totalAssigned: 0,
      unassignedIncome: 0,
      isOverallocated: false,
    };
  }

  const { incomes = [], budgetGroups = [] } = state;

  const totalIncome = incomes.reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);

  const totalAssigned = budgetGroups.reduce((total, group) => {
    return (
      total +
      group.budgetGroupItems.reduce((gTotal, item) => {
        const assigned = parseFloat(item.assigned) || 0;
        return gTotal + assigned;
      }, 0)
    );
  }, 0);

  const unassignedIncome = totalIncome - totalAssigned;
  const isOverallocated = unassignedIncome < 0;

  return {
    totalIncome,
    totalAssigned,
    unassignedIncome,
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

export const updateTemplateDebtAssigned = (storageAdapter, itemId, value) => {
  const raw = storageAdapter.get("budget_app_defaults");
  if (!raw) return;

  try {
    const template = JSON.parse(raw);
    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === itemId && item.type === "debt") {
          item.assigned = parseFloat(value) || 0;
          storageAdapter.set("budget_app_defaults", JSON.stringify(template));
          return;
        }
      }
    }
  } catch (e) {
    console.error("Error updating template debt assigned", e);
  }
};

export const addTemplateDebtItem = (storageAdapter, debtData) => {
  const raw = storageAdapter.get("budget_app_defaults");
  try {
    const template = JSON.parse(raw || "{}");
    template.budgetGroups = template.budgetGroups || [];

    let debtGroup = template.budgetGroups.find((g) => g.isDebtGroup);
    if (!debtGroup) {
      debtGroup = {
        name: "Debt",
        isDebtGroup: true,
        budgetGroupItems: [],
      };
      template.budgetGroups.push(debtGroup);
    }

    debtGroup.budgetGroupItems.push({
      id: debtData.id,
      name: debtData.name,
      assigned: 0,
      type: "debt",
      outstandingBalance: parseFloat(debtData.outstandingBalance) || 0,
      minimumPayment: parseFloat(debtData.minimumPayment) || 0,
      debtType: debtData.debtType || "other",
      interestRate: debtData.interestRate
        ? parseFloat(debtData.interestRate)
        : undefined,
    });

    storageAdapter.set("budget_app_defaults", JSON.stringify(template));
  } catch (e) {
    console.error("Error adding template debt item", e);
  }
};

export const updateTemplateDebtItem = (storageAdapter, debtData) => {
  const raw = storageAdapter.get("budget_app_defaults");
  if (!raw) return;

  try {
    const template = JSON.parse(raw);
    for (const group of template.budgetGroups || []) {
      for (const item of group.budgetGroupItems || []) {
        if (item.id === debtData.itemId && item.type === "debt") {
          if (debtData.name !== undefined) item.name = debtData.name;
          if (debtData.outstandingBalance !== undefined)
            item.outstandingBalance =
              parseFloat(debtData.outstandingBalance) || 0;
          if (debtData.minimumPayment !== undefined)
            item.minimumPayment = parseFloat(debtData.minimumPayment) || 0;
          if (debtData.debtType !== undefined)
            item.debtType = debtData.debtType;
          if (debtData.interestRate !== undefined)
            item.interestRate = parseFloat(debtData.interestRate) || undefined;
          storageAdapter.set("budget_app_defaults", JSON.stringify(template));
          return;
        }
      }
    }
  } catch (e) {
    console.error("Error updating template debt item", e);
  }
};
