import { renderHook, act } from "@testing-library/react";
import { useBudgetStore } from "./useBudgetStore";
import { InMemoryStorageAdapter } from "./adapters";

describe("useBudgetStore custom hook", () => {
  let storageAdapter;
  const initialTemplate = {
    incomes: [
      { id: "inc-1", name: "Main Salary", amount: 5000, received: true },
    ],
    budgetGroups: [
      {
        name: "Housing",
        budgetGroupItems: [
          { id: "item-1", name: "Rent", assigned: 1000, type: "expense" },
        ],
      },
    ],
    paydayDay: 20,
    weekendBehavior: "preceding-friday",
  };

  beforeEach(() => {
    storageAdapter = new InMemoryStorageAdapter();
    storageAdapter.set("budget_app_defaults", JSON.stringify(initialTemplate));
  });

  it("should initialize synchronously from storage adapter", () => {
    // 1. If month data is empty, should load from template
    const { result } = renderHook(() =>
      useBudgetStore("July-2026", storageAdapter)
    );

    expect(result.current.state.incomes[0].amount).toBe(5000);
    expect(result.current.state.budgetGroups[0].name).toBe("Housing");
    expect(result.current.state.budgetGroups[0].budgetGroupItems[0].name).toBe(
      "Rent"
    );

    // 2. If month data already exists, should load month data
    const monthData = {
      ...initialTemplate,
      incomes: [
        { id: "inc-1", name: "Main Salary", amount: 6000, received: true },
      ],
    };
    storageAdapter.set("budget_app_data_July-2026", JSON.stringify(monthData));

    const { result: result2 } = renderHook(() =>
      useBudgetStore("July-2026", storageAdapter)
    );
    expect(result2.current.state.incomes[0].amount).toBe(6000);
  });

  it("should toggle viewMode correctly", () => {
    const { result } = renderHook(() =>
      useBudgetStore("July-2026", storageAdapter)
    );

    expect(result.current.viewMode).toBe("remaining");
    act(() => {
      result.current.setViewMode("spent");
    });
    expect(result.current.viewMode).toBe("spent");
  });

  it("should handle income operations and persist changes", () => {
    const { result } = renderHook(() =>
      useBudgetStore("July-2026", storageAdapter)
    );

    // Add Income
    act(() => {
      result.current.handleAddIncome();
    });
    expect(result.current.state.incomes.length).toBe(2);
    expect(result.current.state.incomes[1].name).toBe("New Income");

    const newIncomeId = result.current.state.incomes[1].id;

    // Update Income Field
    act(() => {
      result.current.handleUpdateIncomeField(newIncomeId, "amount", 500);
    });
    expect(result.current.state.incomes[1].amount).toBe(500);

    // Delete Income
    act(() => {
      result.current.handleDeleteIncome(newIncomeId);
    });
    expect(result.current.state.incomes.length).toBe(1);

    // Verify localStorage has persisted the month data
    const saved = JSON.parse(storageAdapter.get("budget_app_data_July-2026"));
    expect(saved.incomes.length).toBe(1);
  });

  it("should handle budget group operations", () => {
    const { result } = renderHook(() =>
      useBudgetStore("July-2026", storageAdapter)
    );

    // Add Group
    act(() => {
      result.current.handleAddGroup("Food");
    });
    expect(result.current.state.budgetGroups.length).toBe(2);
    expect(result.current.state.budgetGroups[1].name).toBe("Food");

    // Rename Group
    act(() => {
      result.current.handleRenameGroup(1, "Dining Out");
    });
    expect(result.current.state.budgetGroups[1].name).toBe("Dining Out");

    // Add Item to Group
    act(() => {
      result.current.handleAddItem(1);
    });
    expect(result.current.state.budgetGroups[1].budgetGroupItems.length).toBe(
      1
    );
    expect(result.current.state.budgetGroups[1].budgetGroupItems[0].name).toBe(
      "New Item"
    );

    const itemId = result.current.state.budgetGroups[1].budgetGroupItems[0].id;

    // Edit Item Field
    act(() => {
      result.current.handleFieldChange(itemId, "assigned", 200);
    });
    expect(
      result.current.state.budgetGroups[1].budgetGroupItems[0].assigned
    ).toBe(200);

    // Swap Groups
    act(() => {
      result.current.handleSwapGroups(0, 1);
    });
    expect(result.current.state.budgetGroups[0].name).toBe("Dining Out");
    expect(result.current.state.budgetGroups[1].name).toBe("Housing");

    // Delete Group
    act(() => {
      result.current.handleDeleteGroup(0);
    });
    expect(result.current.state.budgetGroups.length).toBe(1);
    expect(result.current.state.budgetGroups[0].name).toBe("Housing");
  });

  it("should handle transaction operations", () => {
    const { result } = renderHook(() =>
      useBudgetStore("July-2026", storageAdapter)
    );

    const itemId = "item-1"; // Rent

    // Add Transaction
    act(() => {
      result.current.handleAddTransaction("Landlord", 1000, itemId);
    });
    expect(result.current.state.transactions.length).toBe(1);
    expect(result.current.state.transactions[0].payee).toBe("Landlord");
    expect(result.current.state.transactions[0].amount).toBe(1000);

    const txId = result.current.state.transactions[0].id;

    // Delete Transaction
    act(() => {
      result.current.handleDeleteTransaction(txId);
    });
    expect(result.current.state.transactions.length).toBe(0);
  });

  it("should sync debt item template changes", () => {
    const templateWithDebt = {
      ...initialTemplate,
      budgetGroups: [
        {
          name: "Debt",
          isDebtGroup: true,
          budgetGroupItems: [
            {
              id: "debt-1",
              name: "Credit Card",
              type: "debt",
              assigned: 0,
              outstandingBalance: 1000,
              minimumPayment: 50,
            },
          ],
        },
      ],
    };
    storageAdapter.set("budget_app_defaults", JSON.stringify(templateWithDebt));

    const { result } = renderHook(() =>
      useBudgetStore("July-2026", storageAdapter)
    );

    // Update Debt Item Assigned amount & check template update
    act(() => {
      result.current.handleFieldChange("debt-1", "assigned", 100);
    });
    expect(
      result.current.state.budgetGroups[0].budgetGroupItems[0].assigned
    ).toBe(100);

    let template = JSON.parse(storageAdapter.get("budget_app_defaults"));
    expect(template.budgetGroups[0].budgetGroupItems[0].assigned).toBe(100);

    // Record payment (Add Transaction) on debt item & check template balance deduction
    act(() => {
      result.current.handleAddTransaction("Bank", 200, "debt-1");
    });
    template = JSON.parse(storageAdapter.get("budget_app_defaults"));
    // Outstanding balance: 1000 - 200 = 800
    expect(
      template.budgetGroups[0].budgetGroupItems[0].outstandingBalance
    ).toBe(800);

    // Delete payment transaction & verify template balance reverts
    const txId = result.current.state.transactions[0].id;
    act(() => {
      result.current.handleDeleteTransaction(txId);
    });
    template = JSON.parse(storageAdapter.get("budget_app_defaults"));
    expect(
      template.budgetGroups[0].budgetGroupItems[0].outstandingBalance
    ).toBe(1000);
  });

  it("should handle month/cycle transition", () => {
    const { result, rerender } = renderHook(
      ({ month }) => useBudgetStore(month, storageAdapter),
      { initialProps: { month: "July-2026" } }
    );

    expect(result.current.state.incomes[0].amount).toBe(5000);

    // Save specific data for August-2026
    const augustData = {
      ...initialTemplate,
      incomes: [
        { id: "inc-1", name: "Main Salary", amount: 5500, received: true },
      ],
    };
    storageAdapter.set(
      "budget_app_data_August-2026",
      JSON.stringify(augustData)
    );

    // Transition monthKey
    rerender({ month: "August-2026" });

    expect(result.current.state.incomes[0].amount).toBe(5500);
  });
});
