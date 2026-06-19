import {
  budgetReducer,
  InMemoryStorageAdapter,
  loadBudgetData,
  saveBudgetData,
  getEnrichedGroups,
  calculateSummary,
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
              fields: [
                { label: "Name", value: "Rent / Mortgage", type: "text" },
                { label: "Assigned", value: "1000.00", type: "text" },
              ],
              status: [{ label: "Remaining", value: "1000.00", type: "text" }],
              type: "expense",
            },
          ],
        },
      ],
      transactions: [],
    };

    it("handles LOAD_CYCLE", () => {
      const newState = { startingSalary: 4000.0, budgetGroups: [], transactions: [] };
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

    it("handles UPDATE_FIELD", () => {
      const result = budgetReducer(initialState, {
        type: "UPDATE_FIELD",
        payload: { groupIndex: 0, itemIndex: 0, fieldIndex: 1, value: "1200.00" },
      });
      expect(result.budgetGroups[0].budgetGroupItems[0].fields[1].value).toBe("1200.00");
    });

    it("handles ADD_ITEM", () => {
      const result = budgetReducer(initialState, {
        type: "ADD_ITEM",
        payload: { groupIndex: 0 },
      });
      expect(result.budgetGroups[0].budgetGroupItems.length).toBe(2);
      expect(result.budgetGroups[0].budgetGroupItems[1].fields[0].value).toBe("New Item");
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
        payload: { groupIndex: 0, itemIndex: 0 },
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
        transactions: [{ id: "tx1", name: "Landlord", amount: 1000, budgetItemId: "h1" }],
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
  });

  describe("helpers", () => {
    it("loads budget data with templates fallback", () => {
      const adapter = new InMemoryStorageAdapter();
      // Test default fallback
      const data1 = loadBudgetData("June-2026", adapter);
      expect(data1.startingSalary).toBe(5000.0);
      expect(data1.budgetGroups.length).toBeGreaterThan(0);

      // Test custom templates
      const defaults = {
        startingSalary: 4500.0,
        budgetGroups: [{ name: "CustomGroup", budgetGroupItems: [] }],
      };
      adapter.set("budget_app_defaults", JSON.stringify(defaults));
      const data2 = loadBudgetData("June-2026", adapter);
      expect(data2.startingSalary).toBe(4500.0);
      expect(data2.budgetGroups[0].name).toBe("CustomGroup");
    });

    it("saves budget data", () => {
      const adapter = new InMemoryStorageAdapter();
      const state = { startingSalary: 6000.0, budgetGroups: [], transactions: [] };
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
              fields: [
                { label: "Name", value: "Rent", type: "text" },
                { label: "Assigned", value: "1000.00", type: "text" },
              ],
              status: [{ label: "Remaining", value: "1000.00", type: "text" }],
              type: "expense",
            },
          ],
        },
      ];
      const transactions = [{ id: "tx1", name: "Landlord", amount: 800, budgetItemId: "h1" }];
      
      // remaining view
      const enrichedRemaining = getEnrichedGroups(budgetGroups, transactions, "remaining");
      const itemRemaining = enrichedRemaining[0].budgetGroupItems[0];
      expect(itemRemaining.spent).toBe(800);
      expect(itemRemaining.remaining).toBe(200);
      expect(itemRemaining.status[0].label).toBe("Remaining");
      expect(itemRemaining.status[0].value).toBe("200.00");

      // spent view
      const enrichedSpent = getEnrichedGroups(budgetGroups, transactions, "spent");
      const itemSpent = enrichedSpent[0].budgetGroupItems[0];
      expect(itemSpent.status[0].label).toBe("Spent");
      expect(itemSpent.status[0].value).toBe("800.00");
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
                fields: [
                  { label: "Name", value: "Rent" },
                  { label: "Assigned", value: "1000.00" },
                ],
              },
              {
                id: "h2",
                fields: [
                  { label: "Name", value: "Power" },
                  { label: "Assigned", value: "200.00" },
                ],
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
