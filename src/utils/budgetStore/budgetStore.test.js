import {
  budgetReducer,
  InMemoryStorageAdapter,
  loadBudgetData,
  saveBudgetData,
  getEnrichedGroups,
  calculateSummary,
  updateTemplateDebtBalance,
} from "./index";

describe("BudgetCycleStore Modules", () => {
  describe("InMemoryStorageAdapter", () => {
    it("gets and sets data correctly", () => {
      const adapter = new InMemoryStorageAdapter({ key1: "value1" });
      expect(adapter.get("key1")).toBe("value1");
      expect(adapter.get("key2")).toBeNull();

      adapter.set("key2", "value2");
      expect(adapter.get("key2")).toBe("value2");
    });
  });

  describe("budgetReducer", () => {
    const initialState = {
      startingSalary: 3000.0,
      budgetGroups: [
        {
          name: "Housing",
          columns: [{ name: "Assigned" }, { name: "Remaining" }],
          budgetGroupItems: [
            {
              id: "h1",
              name: "Rent / Mortgage",
              assigned: 1000.0,
              type: "expense",
            },
          ],
        },
      ],
      transactions: [],
    };

    it("handles LOAD_CYCLE", () => {
      const newState = {
        startingSalary: 4000.0,
        budgetGroups: [],
        transactions: [],
      };
      const result = budgetReducer(initialState, {
        type: "LOAD_CYCLE",
        payload: newState,
      });
      expect(result.startingSalary).toBe(4000.0);
      expect(result.budgetGroups.length).toBe(0);
    });

    it("handles SET_STARTING_SALARY", () => {
      const result = budgetReducer(initialState, {
        type: "SET_STARTING_SALARY",
        payload: 5000.0,
      });
      expect(result.startingSalary).toBe(5000.0);
    });

    it("handles UPDATE_ITEM_FIELD", () => {
      const result = budgetReducer(initialState, {
        type: "UPDATE_ITEM_FIELD",
        payload: { itemId: "h1", fieldName: "assigned", value: "1200.00" },
      });
      expect(result.budgetGroups[0].budgetGroupItems[0].assigned).toBe(1200.0);
    });

    it("handles ADD_ITEM", () => {
      const result = budgetReducer(initialState, {
        type: "ADD_ITEM",
        payload: { groupIndex: 0 },
      });
      expect(result.budgetGroups[0].budgetGroupItems.length).toBe(2);
      expect(result.budgetGroups[0].budgetGroupItems[1].name).toBe("New Item");
      expect(result.budgetGroups[0].budgetGroupItems[1].assigned).toBe(0);
    });

    it("handles DELETE_ITEM and cleans up associated transactions", () => {
      const stateWithTx = {
        ...initialState,
        transactions: [
          { id: "tx1", name: "Landlord", amount: 1000, budgetItemId: "h1" },
          { id: "tx2", name: "Other", amount: 200, budgetItemId: "h2" },
        ],
      };
      const result = budgetReducer(stateWithTx, {
        type: "DELETE_ITEM",
        payload: "h1",
      });
      expect(result.budgetGroups[0].budgetGroupItems.length).toBe(0);
      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].id).toBe("tx2");
    });

    it("handles ADD_GROUP", () => {
      const result = budgetReducer(initialState, {
        type: "ADD_GROUP",
        payload: { name: "Savings" },
      });
      expect(result.budgetGroups.length).toBe(2);
      expect(result.budgetGroups[1].name).toBe("Savings");
    });

    it("handles DELETE_GROUP and cleans up associated transactions", () => {
      const stateWithGroupsAndTx = {
        ...initialState,
        budgetGroups: [
          {
            name: "Group 1",
            budgetGroupItems: [{ id: "item1", name: "Rent" }],
          },
          {
            name: "Group 2",
            budgetGroupItems: [{ id: "item2", name: "Groceries" }],
          },
        ],
        transactions: [
          { id: "tx1", name: "Tesco", amount: 50, budgetItemId: "item2" },
          { id: "tx2", name: "Landlord", amount: 1000, budgetItemId: "item1" },
        ],
      };
      // Delete Group 2 (index 1)
      const result = budgetReducer(stateWithGroupsAndTx, {
        type: "DELETE_GROUP",
        payload: { groupIndex: 1 },
      });
      expect(result.budgetGroups.length).toBe(1);
      expect(result.budgetGroups[0].name).toBe("Group 1");
      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].id).toBe("tx2"); // Rent transaction remains
    });

    it("handles RENAME_GROUP", () => {
      const result = budgetReducer(initialState, {
        type: "RENAME_GROUP",
        payload: { groupIndex: 0, newName: "Housing & Utility" },
      });
      expect(result.budgetGroups[0].name).toBe("Housing & Utility");
    });

    it("handles ADD_TRANSACTION", () => {
      const result = budgetReducer(initialState, {
        type: "ADD_TRANSACTION",
        payload: { name: "Tesco", amount: "55.50", budgetItemId: "h1" },
      });
      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].name).toBe("Tesco");
      expect(result.transactions[0].amount).toBe(55.5);
      expect(result.transactions[0].budgetItemId).toBe("h1");
    });

    it("handles DELETE_TRANSACTION", () => {
      const stateWithTx = {
        ...initialState,
        transactions: [
          { id: "tx1", name: "Landlord", amount: 1000, budgetItemId: "h1" },
        ],
      };
      const result = budgetReducer(stateWithTx, {
        type: "DELETE_TRANSACTION",
        payload: "tx1",
      });
      expect(result.transactions.length).toBe(0);
    });

    it("handles DELETE_MULTIPLE_TRANSACTIONS", () => {
      const stateWithTx = {
        ...initialState,
        transactions: [
          { id: "tx1", name: "Tx 1", amount: 10, budgetItemId: "h1" },
          { id: "tx2", name: "Tx 2", amount: 20, budgetItemId: "h1" },
          { id: "tx3", name: "Tx 3", amount: 30, budgetItemId: "h1" },
        ],
      };
      const result = budgetReducer(stateWithTx, {
        type: "DELETE_MULTIPLE_TRANSACTIONS",
        payload: ["tx1", "tx3"],
      });
      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].id).toBe("tx2");
    });

    it("handles ADD_DEBT_REPAYMENT_GROUP", () => {
      const result = budgetReducer(initialState, {
        type: "ADD_DEBT_REPAYMENT_GROUP",
      });
      expect(result.budgetGroups.length).toBe(2);
      const debtGroup = result.budgetGroups[1];
      expect(debtGroup.name).toBe("Debt Repayment");
      expect(debtGroup.isDebtGroup).toBe(true);
      expect(debtGroup.budgetGroupItems).toEqual([]);
    });

    it("does not duplicate Debt Repayment group if one already exists", () => {
      const stateWithDebtGroup = {
        ...initialState,
        budgetGroups: [
          ...initialState.budgetGroups,
          {
            name: "Debt Repayment",
            isDebtGroup: true,
            columns: [
              { name: "Balance" },
              { name: "Planned" },
              { name: "Paid so far" },
            ],
            budgetGroupItems: [],
          },
        ],
      };
      const result = budgetReducer(stateWithDebtGroup, {
        type: "ADD_DEBT_REPAYMENT_GROUP",
      });
      expect(result.budgetGroups.length).toBe(2);
    });

    it("handles ADD_DEBT_ITEM", () => {
      const stateWithDebtGroup = {
        ...initialState,
        budgetGroups: [
          ...initialState.budgetGroups,
          {
            name: "Debt Repayment",
            isDebtGroup: true,
            columns: [
              { name: "Balance" },
              { name: "Planned" },
              { name: "Paid so far" },
            ],
            budgetGroupItems: [],
          },
        ],
      };
      const result = budgetReducer(stateWithDebtGroup, {
        type: "ADD_DEBT_ITEM",
        payload: {
          name: "Barclaycard",
          outstandingBalance: 3200,
          minimumPayment: 85,
          debtType: "credit-card",
          interestRate: 19.9,
        },
      });
      const debtGroup = result.budgetGroups.find((g) => g.isDebtGroup);
      expect(debtGroup.budgetGroupItems.length).toBe(1);
      const item = debtGroup.budgetGroupItems[0];
      expect(item.name).toBe("Barclaycard");
      expect(item.type).toBe("debt");
      expect(item.outstandingBalance).toBe(3200);
      expect(item.minimumPayment).toBe(85);
      expect(item.debtType).toBe("credit-card");
      expect(item.interestRate).toBe(19.9);
      expect(item.assigned).toBe(0);
      expect(item.id).toBeDefined();
    });

    it("handles UPDATE_DEBT_ITEM", () => {
      const stateWithDebt = {
        ...initialState,
        budgetGroups: [
          ...initialState.budgetGroups,
          {
            name: "Debt Repayment",
            isDebtGroup: true,
            columns: [
              { name: "Balance" },
              { name: "Planned" },
              { name: "Paid so far" },
            ],
            budgetGroupItems: [
              {
                id: "d1",
                name: "Barclaycard",
                assigned: 150,
                type: "debt",
                outstandingBalance: 3200,
                minimumPayment: 85,
                debtType: "credit-card",
                interestRate: 19.9,
              },
            ],
          },
        ],
      };
      const result = budgetReducer(stateWithDebt, {
        type: "UPDATE_DEBT_ITEM",
        payload: {
          itemId: "d1",
          name: "Barclays Visa",
          outstandingBalance: 2800,
          minimumPayment: 100,
          debtType: "credit-card",
          interestRate: 21.5,
        },
      });
      const debtGroup = result.budgetGroups.find((g) => g.isDebtGroup);
      const item = debtGroup.budgetGroupItems[0];
      expect(item.name).toBe("Barclays Visa");
      expect(item.outstandingBalance).toBe(2800);
      expect(item.minimumPayment).toBe(100);
      expect(item.interestRate).toBe(21.5);
    });
  });

  describe("helpers", () => {
    it("loads budget data with templates fallback", () => {
      const adapter = new InMemoryStorageAdapter();
      // Test default fallback
      const data1 = loadBudgetData("June-2026", adapter);
      expect(data1.startingSalary).toBe(5000.0);
      expect(data1.budgetGroups.length).toBeGreaterThan(0);
      expect(data1.paydayDay).toBe(20);
      expect(data1.weekendBehavior).toBe("preceding-friday");

      // Test custom templates
      const defaults = {
        startingSalary: 4500.0,
        budgetGroups: [{ name: "CustomGroup", budgetGroupItems: [] }],
        paydayDay: 25,
        weekendBehavior: "following-monday",
      };
      adapter.set("budget_app_defaults", JSON.stringify(defaults));
      const data2 = loadBudgetData("June-2026", adapter);
      expect(data2.startingSalary).toBe(4500.0);
      expect(data2.budgetGroups[0].name).toBe("CustomGroup");
      expect(data2.paydayDay).toBe(25);
      expect(data2.weekendBehavior).toBe("following-monday");
    });

    it("saves budget data", () => {
      const adapter = new InMemoryStorageAdapter();
      const state = {
        startingSalary: 6000.0,
        budgetGroups: [],
        transactions: [],
      };
      saveBudgetData("June-2026", state, adapter);

      const loaded = JSON.parse(adapter.get("budget_app_data_June-2026"));
      expect(loaded.startingSalary).toBe(6000.0);
    });

    it("enriches budget groups correctly", () => {
      const budgetGroups = [
        {
          name: "Housing",
          columns: [{ name: "Assigned" }, { name: "Remaining" }],
          budgetGroupItems: [
            {
              id: "h1",
              name: "Rent",
              assigned: 1000.0,
              type: "expense",
            },
          ],
        },
      ];
      const transactions = [
        { id: "tx1", name: "Landlord", amount: 800, budgetItemId: "h1" },
      ];

      // remaining view
      const enrichedRemaining = getEnrichedGroups(
        budgetGroups,
        transactions,
        "remaining"
      );
      const itemRemaining = enrichedRemaining[0].budgetGroupItems[0];
      expect(itemRemaining.spent).toBe(800);
      expect(itemRemaining.remaining).toBe(200);
      expect(itemRemaining.status[0].label).toBe("Remaining");
      expect(itemRemaining.status[0].value).toBe("200.00");

      // spent view
      const enrichedSpent = getEnrichedGroups(
        budgetGroups,
        transactions,
        "spent"
      );
      const itemSpent = enrichedSpent[0].budgetGroupItems[0];
      expect(itemSpent.status[0].label).toBe("Spent");
      expect(itemSpent.status[0].value).toBe("800.00");
    });

    it("enriches debt items with isPaidOff flag", () => {
      const budgetGroups = [
        {
          name: "Debt Repayment",
          isDebtGroup: true,
          columns: [
            { name: "Balance" },
            { name: "Planned" },
            { name: "Paid so far" },
          ],
          budgetGroupItems: [
            {
              id: "d1",
              name: "Barclaycard",
              assigned: 150,
              type: "debt",
              outstandingBalance: 3200,
              minimumPayment: 85,
              debtType: "credit-card",
            },
            {
              id: "d2",
              name: "Old Loan",
              assigned: 0,
              type: "debt",
              outstandingBalance: 0,
              minimumPayment: 0,
              debtType: "personal-loan",
            },
          ],
        },
      ];
      const transactions = [
        {
          id: "tx1",
          name: "Barclaycard Payment",
          amount: 150,
          budgetItemId: "d1",
        },
      ];

      const enriched = getEnrichedGroups(
        budgetGroups,
        transactions,
        "remaining"
      );
      const debtGroup = enriched[0];
      const activeDebt = debtGroup.budgetGroupItems[0];
      const paidOffDebt = debtGroup.budgetGroupItems[1];

      expect(activeDebt.spent).toBe(150);
      expect(activeDebt.isPaidOff).toBe(false);
      expect(paidOffDebt.isPaidOff).toBe(true);
    });

    it("updates template debt balance correctly", () => {
      const adapter = new InMemoryStorageAdapter();
      const template = {
        startingSalary: 5000,
        budgetGroups: [
          {
            name: "Debt Repayment",
            isDebtGroup: true,
            budgetGroupItems: [
              {
                id: "d1",
                name: "Barclaycard",
                type: "debt",
                assigned: 150,
                outstandingBalance: 3200,
                minimumPayment: 85,
                debtType: "credit-card",
              },
            ],
          },
        ],
      };
      adapter.set("budget_app_defaults", JSON.stringify(template));

      // Simulate a payment of 150
      updateTemplateDebtBalance(adapter, "d1", -150);

      const updated = JSON.parse(adapter.get("budget_app_defaults"));
      const debtItem = updated.budgetGroups[0].budgetGroupItems[0];
      expect(debtItem.outstandingBalance).toBe(3050);
    });

    it("calculates summaries correctly", () => {
      const state = {
        startingSalary: 3000.0,
        budgetGroups: [
          {
            name: "Housing",
            budgetGroupItems: [
              {
                id: "h1",
                name: "Rent",
                assigned: 1000.0,
              },
              {
                id: "h2",
                name: "Power",
                assigned: 200.0,
              },
            ],
          },
        ],
      };

      const summary = calculateSummary(state);
      expect(summary.startingSalary).toBe(3000.0);
      expect(summary.totalAssigned).toBe(1200.0);
      expect(summary.unassignedSalary).toBe(1800.0);
      expect(summary.isOverallocated).toBe(false);

      // Test overallocated
      state.startingSalary = 1000.0;
      const summary2 = calculateSummary(state);
      expect(summary2.unassignedSalary).toBe(-200.0);
      expect(summary2.isOverallocated).toBe(true);
    });
  });
});
