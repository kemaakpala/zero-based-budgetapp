import {
  budgetReducer,
  InMemoryStorageAdapter,
  loadBudgetData,
  saveBudgetData,
  getEnrichedGroups,
  calculateSummary,
  updateTemplateDebtBalance,
  updateTemplateSavingsBalance,
  addTemplateSavingsItem,
  updateTemplateSavingsItem,
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
      incomes: [
        { id: "inc-1", name: "Main Salary", amount: 3000.0, received: true },
      ],
      budgetGroups: [
        {
          name: "Housing",
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
        incomes: [
          { id: "inc-1", name: "Main Salary", amount: 4000.0, received: true },
        ],
        budgetGroups: [],
        transactions: [],
      };
      const result = budgetReducer(initialState, {
        type: "LOAD_CYCLE",
        payload: newState,
      });
      expect(result.incomes[0].amount).toBe(4000.0);
      expect(result.budgetGroups.length).toBe(0);
    });

    it("handles ADD_INCOME, DELETE_INCOME, and UPDATE_INCOME_FIELD", () => {
      // Add income
      let state = budgetReducer(initialState, {
        type: "ADD_INCOME",
        payload: { name: "Side Hustle", amount: 500, received: false },
      });
      expect(state.incomes.length).toBe(2);
      expect(state.incomes[1].name).toBe("Side Hustle");
      expect(state.incomes[1].amount).toBe(500);

      const newIncomeId = state.incomes[1].id;

      // Update income field
      state = budgetReducer(state, {
        type: "UPDATE_INCOME_FIELD",
        payload: { incomeId: newIncomeId, fieldName: "amount", value: 600 },
      });
      expect(state.incomes[1].amount).toBe(600);

      // Delete income
      state = budgetReducer(state, {
        type: "DELETE_INCOME",
        payload: { incomeId: newIncomeId },
      });
      expect(state.incomes.length).toBe(1);
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
        payload: { payee: "Tesco", amount: "55.50", budgetItemId: "h1" },
      });
      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].payee).toBe("Tesco");
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
      expect(debtGroup.name).toBe("Debt");
      expect(debtGroup.isDebtGroup).toBe(true);
      expect(debtGroup.budgetGroupItems).toEqual([]);
    });

    it("does not duplicate Debt group if one already exists", () => {
      const stateWithDebtGroup = {
        ...initialState,
        budgetGroups: [
          ...initialState.budgetGroups,
          {
            name: "Debt",
            isDebtGroup: true,
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
            name: "Debt",
            isDebtGroup: true,
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

    it("handles ADD_DEBT_ITEM with a pre-specified ID", () => {
      const stateWithDebtGroup = {
        ...initialState,
        budgetGroups: [
          ...initialState.budgetGroups,
          {
            name: "Debt",
            isDebtGroup: true,
            budgetGroupItems: [],
          },
        ],
      };
      const result = budgetReducer(stateWithDebtGroup, {
        type: "ADD_DEBT_ITEM",
        payload: {
          id: "custom-id-999",
          name: "Personal Loan",
          outstandingBalance: 4000,
          minimumPayment: 100,
          debtType: "personal-loan",
        },
      });
      const debtGroup = result.budgetGroups.find((g) => g.isDebtGroup);
      expect(debtGroup.budgetGroupItems[0].id).toBe("custom-id-999");
    });

    it("handles UPDATE_DEBT_ITEM", () => {
      const stateWithDebt = {
        ...initialState,
        budgetGroups: [
          ...initialState.budgetGroups,
          {
            name: "Debt",
            isDebtGroup: true,
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
      expect(data1.incomes[0].amount).toBe(5000.0);
      expect(data1.budgetGroups.length).toBeGreaterThan(0);
      expect(data1.paydayDay).toBe(20);
      expect(data1.weekendBehavior).toBe("preceding-friday");

      // Test custom templates
      const defaults = {
        incomes: [
          { id: "inc-1", name: "Salary", amount: 4500.0, received: true },
        ],
        budgetGroups: [{ name: "CustomGroup", budgetGroupItems: [] }],
        paydayDay: 25,
        weekendBehavior: "following-monday",
      };
      adapter.set("budget_app_defaults", JSON.stringify(defaults));
      const data2 = loadBudgetData("June-2026", adapter);
      expect(data2.incomes[0].amount).toBe(4500.0);
      expect(data2.budgetGroups[0].name).toBe("CustomGroup");
      expect(data2.paydayDay).toBe(25);
      expect(data2.weekendBehavior).toBe("following-monday");
    });

    it("saves budget data", () => {
      const adapter = new InMemoryStorageAdapter();
      const state = {
        incomes: [
          { id: "inc-1", name: "Salary", amount: 6000.0, received: true },
        ],
        budgetGroups: [],
        transactions: [],
      };
      saveBudgetData("June-2026", state, adapter);

      const loaded = JSON.parse(adapter.get("budget_app_data_June-2026"));
      expect(loaded.incomes[0].amount).toBe(6000.0);
    });

    it("enriches budget groups correctly", () => {
      const budgetGroups = [
        {
          name: "Housing",
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
          name: "Debt",
          isDebtGroup: true,
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
            name: "Debt",
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
        incomes: [
          { id: "inc-1", name: "Salary", amount: 3000.0, received: true },
        ],
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
      expect(summary.totalIncome).toBe(3000.0);
      expect(summary.totalAssigned).toBe(1200.0);
      expect(summary.unassignedIncome).toBe(1800.0);
      expect(summary.isOverallocated).toBe(false);

      // Test overallocated
      state.incomes = [
        { id: "inc-1", name: "Salary", amount: 1000.0, received: true },
      ];
      const summary2 = calculateSummary(state);
      expect(summary2.unassignedIncome).toBe(-200.0);
      expect(summary2.isOverallocated).toBe(true);
    });

    it("handles ADD_SAVINGS_GROUP, ADD_SAVINGS_ITEM, and UPDATE_SAVINGS_ITEM", () => {
      const state = { budgetGroups: [] };

      // 1. ADD_SAVINGS_GROUP
      let nextState = budgetReducer(state, { type: "ADD_SAVINGS_GROUP" });
      expect(nextState.budgetGroups.length).toBe(1);
      expect(nextState.budgetGroups[0].name).toBe("Savings");
      expect(nextState.budgetGroups[0].isSavingsGroup).toBe(true);

      // Duplicate check
      nextState = budgetReducer(nextState, { type: "ADD_SAVINGS_GROUP" });
      expect(nextState.budgetGroups.length).toBe(1);

      // 2. ADD_SAVINGS_ITEM
      nextState = budgetReducer(nextState, {
        type: "ADD_SAVINGS_ITEM",
        payload: {
          id: "sav-1",
          name: "Trip Fund",
          target: 1000,
          startingBalance: 200,
        },
      });
      expect(nextState.budgetGroups[0].budgetGroupItems.length).toBe(1);
      const item = nextState.budgetGroups[0].budgetGroupItems[0];
      expect(item.name).toBe("Trip Fund");
      expect(item.target).toBe(1000);
      expect(item.startingBalance).toBe(200);
      expect(item.type).toBe("savings");

      // 3. UPDATE_SAVINGS_ITEM
      nextState = budgetReducer(nextState, {
        type: "UPDATE_SAVINGS_ITEM",
        payload: {
          itemId: "sav-1",
          name: "Tokyo Trip",
          target: 1200,
          startingBalance: 250,
        },
      });
      const updatedItem = nextState.budgetGroups[0].budgetGroupItems[0];
      expect(updatedItem.name).toBe("Tokyo Trip");
      expect(updatedItem.target).toBe(1200);
      expect(updatedItem.startingBalance).toBe(250);
    });

    it("enriches savings items correctly in getEnrichedGroups", () => {
      const budgetGroups = [
        {
          name: "Savings",
          isSavingsGroup: true,
          budgetGroupItems: [
            {
              id: "sav-1",
              name: "Emergency Fund",
              type: "savings",
              assigned: 200,
              target: 1000,
              startingBalance: 400,
            },
          ],
        },
      ];
      const transactions = [
        { id: "tx-1", payee: "Car Repair", amount: 150, budgetItemId: "sav-1" },
      ];

      const enriched = getEnrichedGroups(
        budgetGroups,
        transactions,
        "remaining"
      );
      const item = enriched[0].budgetGroupItems[0];

      expect(item.spent).toBe(150);
      // currentBalance = startingBalance + assigned - spent = 400 + 200 - 150 = 450
      expect(item.currentBalance).toBe(450);
      // toSave = target - currentBalance = 1000 - 450 = 550
      expect(item.toSave).toBe(550);
      expect(item.status[0].label).toBe("To Save");
      expect(item.status[0].value).toBe("550.00");
    });

    it("manages savings template updates correctly", () => {
      const adapter = new InMemoryStorageAdapter();
      const template = {
        budgetGroups: [
          {
            name: "Savings",
            isSavingsGroup: true,
            budgetGroupItems: [
              {
                id: "sav-1",
                name: "Emergency Fund",
                type: "savings",
                assigned: 0,
                target: 1000,
                startingBalance: 200,
              },
            ],
          },
        ],
      };
      adapter.set("budget_app_defaults", JSON.stringify(template));

      // 1. Update savings balance in template
      updateTemplateSavingsBalance(adapter, "sav-1", 100);
      let updated = JSON.parse(adapter.get("budget_app_defaults"));
      expect(updated.budgetGroups[0].budgetGroupItems[0].startingBalance).toBe(
        300
      );

      // 2. Update savings item metadata in template
      updateTemplateSavingsItem(adapter, {
        itemId: "sav-1",
        name: "Sinking Fund",
        target: 1500,
        startingBalance: 350,
      });
      updated = JSON.parse(adapter.get("budget_app_defaults"));
      const item = updated.budgetGroups[0].budgetGroupItems[0];
      expect(item.name).toBe("Sinking Fund");
      expect(item.target).toBe(1500);
      expect(item.startingBalance).toBe(350);

      // 3. Add template savings item
      addTemplateSavingsItem(adapter, {
        id: "sav-2",
        name: "Car Goal",
        target: 5000,
        startingBalance: 500,
      });
      updated = JSON.parse(adapter.get("budget_app_defaults"));
      expect(updated.budgetGroups[0].budgetGroupItems.length).toBe(2);
      expect(updated.budgetGroups[0].budgetGroupItems[1].name).toBe("Car Goal");
      expect(updated.budgetGroups[0].budgetGroupItems[1].target).toBe(5000);
      expect(updated.budgetGroups[0].budgetGroupItems[1].startingBalance).toBe(
        500
      );
    });
  });
});
