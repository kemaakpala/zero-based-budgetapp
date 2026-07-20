import { useReducer, useEffect, useState, useMemo, useRef } from "react";
import { budgetReducer } from "./reducer";
import {
  loadBudgetData,
  saveBudgetData,
  getEnrichedGroups,
  calculateSummary,
} from "./helpers";
import { BudgetTemplate } from "./BudgetTemplate";
import { generateUniqueId } from "../utils";

export function useBudgetStore(monthKey, storageAdapter) {
  const [viewMode, setViewMode] = useState("remaining"); // 'remaining' or 'spent'
  const budgetTemplate = useMemo(
    () => new BudgetTemplate(storageAdapter),
    [storageAdapter]
  );

  // Core Store Reducer with lazy/synchronous initialization on mount
  const [state, dispatch] = useReducer(budgetReducer, null, () =>
    loadBudgetData(monthKey, storageAdapter)
  );

  const loadedMonthRef = useRef(monthKey);

  // Sync state with URL parameter (Cycle loading) when monthKey changes
  useEffect(() => {
    if (loadedMonthRef.current !== monthKey) {
      const data = loadBudgetData(monthKey, storageAdapter);
      dispatch({ type: "LOAD_CYCLE", payload: data });
      loadedMonthRef.current = monthKey;
    }
  }, [monthKey, storageAdapter]);

  // Sync state changes back to localStorage
  useEffect(() => {
    if (
      state &&
      state.incomes !== undefined &&
      state.budgetGroups.length > 0 &&
      loadedMonthRef.current === monthKey
    ) {
      saveBudgetData(monthKey, state, storageAdapter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Helper: find a budget item by id across all groups
  const findBudgetItem = (itemId) => {
    for (const group of state.budgetGroups) {
      for (const item of group.budgetGroupItems) {
        if (item.id === itemId) return item;
      }
    }
    return null;
  };

  // Action Handlers
  const handleUpdateIncomeField = (incomeId, fieldName, value) => {
    dispatch({
      type: "UPDATE_INCOME_FIELD",
      payload: { incomeId, fieldName, value },
    });
  };

  const handleAddIncome = () => {
    dispatch({
      type: "ADD_INCOME",
      payload: { name: "New Income", amount: 0, received: false },
    });
  };

  const handleDeleteIncome = (incomeId) => {
    dispatch({
      type: "DELETE_INCOME",
      payload: { incomeId },
    });
  };

  const handleFieldChange = (itemId, fieldName, value) => {
    const targetItem = findBudgetItem(itemId);

    dispatch({
      type: "UPDATE_ITEM_FIELD",
      payload: { itemId, fieldName, value },
    });

    if (targetItem) {
      if (targetItem.type === "debt" && fieldName === "assigned") {
        budgetTemplate.updateDebtAssigned(itemId, value);
      } else if (targetItem.type === "savings") {
        if (fieldName === "assigned") {
          const oldAssigned = parseFloat(targetItem.assigned) || 0;
          const newAssigned = parseFloat(value) || 0;
          const diff = newAssigned - oldAssigned;
          budgetTemplate.updateSavingsBalance(itemId, diff);
        } else {
          const key = fieldName === "target" ? "goal" : fieldName;
          budgetTemplate.updateSavingsItem({
            itemId,
            [key]: value,
          });
        }
      }
    }
  };

  const handleAddItem = (groupIndex) => {
    dispatch({ type: "ADD_ITEM", payload: { groupIndex } });
  };

  const handleDeleteItem = (itemId) => {
    dispatch({ type: "DELETE_ITEM", payload: itemId });
  };

  const handleAddGroup = (name) => {
    dispatch({ type: "ADD_GROUP", payload: { name } });
  };

  const handleRenameGroup = (groupIndex, newName) => {
    dispatch({
      type: "RENAME_GROUP",
      payload: { groupIndex, newName },
    });
  };

  const handleDeleteGroup = (groupIndex) => {
    dispatch({ type: "DELETE_GROUP", payload: { groupIndex } });
  };

  const handleSwapGroups = (index1, index2) => {
    dispatch({
      type: "SWAP_GROUPS",
      payload: { index1, index2 },
    });
  };

  const handleAddTransaction = (payee, amount, budgetItemId) => {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: { payee, amount, budgetItemId },
    });

    const targetItem = findBudgetItem(budgetItemId);
    if (targetItem) {
      if (targetItem.type === "debt") {
        budgetTemplate.updateDebtBalance(budgetItemId, -parseFloat(amount));
      } else if (targetItem.type === "savings") {
        budgetTemplate.updateSavingsBalance(budgetItemId, -parseFloat(amount));
      }
    }
  };

  const handleDeleteTransaction = (txId) => {
    const tx = state.transactions.find((t) => t.id === txId);
    if (tx) {
      const targetItem = findBudgetItem(tx.budgetItemId);
      if (targetItem) {
        if (targetItem.type === "debt") {
          budgetTemplate.updateDebtBalance(tx.budgetItemId, tx.amount);
        } else if (targetItem.type === "savings") {
          budgetTemplate.updateSavingsBalance(tx.budgetItemId, tx.amount);
        }
      }
    }

    dispatch({ type: "DELETE_TRANSACTION", payload: txId });
  };

  const handleDeleteMultipleTransactions = (txIds) => {
    for (const txId of txIds) {
      const tx = state.transactions.find((t) => t.id === txId);
      if (tx) {
        const targetItem = findBudgetItem(tx.budgetItemId);
        if (targetItem) {
          if (targetItem.type === "debt") {
            budgetTemplate.updateDebtBalance(tx.budgetItemId, tx.amount);
          } else if (targetItem.type === "savings") {
            budgetTemplate.updateSavingsBalance(tx.budgetItemId, tx.amount);
          }
        }
      }
    }

    dispatch({ type: "DELETE_MULTIPLE_TRANSACTIONS", payload: txIds });
  };

  const handleAddDebtItem = (debtData) => {
    const newId = generateUniqueId();
    const debtWithId = { ...debtData, id: newId };

    dispatch({ type: "ADD_DEBT_REPAYMENT_GROUP" });
    dispatch({ type: "ADD_DEBT_ITEM", payload: debtWithId });

    budgetTemplate.addDebtItem(debtWithId);
  };

  const handleUpdateDebtItem = (debtData) => {
    dispatch({ type: "UPDATE_DEBT_ITEM", payload: debtData });
    budgetTemplate.updateDebtItem(debtData);
  };

  const handleAddSavingsItem = (savingsData) => {
    const newId = generateUniqueId();
    const { target, goal, ...rest } = savingsData;
    const savingsWithId = { ...rest, goal: goal ?? target, id: newId };

    dispatch({ type: "ADD_SAVINGS_GROUP" });
    dispatch({ type: "ADD_SAVINGS_ITEM", payload: savingsWithId });

    budgetTemplate.addSavingsItem(savingsWithId);
  };

  const handleUpdateSavingsItem = (savingsData) => {
    const { target, goal, ...rest } = savingsData;
    const dataWithGoal = { ...rest, goal: goal ?? target };
    dispatch({ type: "UPDATE_SAVINGS_ITEM", payload: dataWithGoal });
    budgetTemplate.updateSavingsItem(dataWithGoal);
  };

  // Memoized derived calculations
  const enrichedBudgetGroups = useMemo(() => {
    return getEnrichedGroups(state.budgetGroups, state.transactions, viewMode);
  }, [state.budgetGroups, state.transactions, viewMode]);

  const summary = useMemo(() => {
    return calculateSummary(state);
  }, [state]);

  return {
    state,
    summary,
    enrichedBudgetGroups,
    viewMode,
    setViewMode,
    handleUpdateIncomeField,
    handleAddIncome,
    handleDeleteIncome,
    handleFieldChange,
    handleAddItem,
    handleDeleteItem,
    handleAddGroup,
    handleRenameGroup,
    handleDeleteGroup,
    handleSwapGroups,
    handleAddTransaction,
    handleDeleteTransaction,
    handleDeleteMultipleTransactions,
    handleAddDebtItem,
    handleUpdateDebtItem,
    handleAddSavingsItem,
    handleUpdateSavingsItem,
  };
}
