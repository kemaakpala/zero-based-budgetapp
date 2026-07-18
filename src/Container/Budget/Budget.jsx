import React, { useEffect, useState, useReducer, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Hero,
  BudgetForm,
  BudgetGroup,
  DebtGroup,
  DebtFormModal,
  TransactionLog,
  AddTransactionModal,
  ViewTransactionsModal,
} from "../../Component";
import "./styles/Budget.css";
import { BudgetCycleCalculator } from "../../utils/budgetCycle";
import {
  budgetReducer,
  LocalStorageAdapter,
  loadBudgetData,
  saveBudgetData,
  getEnrichedGroups,
  calculateSummary,
  updateTemplateDebtBalance,
  updateTemplateDebtAssigned,
  addTemplateDebtItem,
  updateTemplateDebtItem,
} from "../../utils/budgetStore";
import { generateUniqueId } from "../../utils/utils";

const storageAdapter = new LocalStorageAdapter();

function Budget() {
  const { month } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const setupCompleted = localStorage.getItem("budget_app_setup_completed");
    if (setupCompleted !== "true") {
      navigate("/settings", { replace: true });
    }
  }, [navigate]);

  // Route fallback logic if URL param is blank
  const getCurrentMonthYearString = () => {
    const date = new Date();
    const monthName = date.toLocaleString("default", { month: "long" });
    const yearVal = date.getFullYear();
    return `${monthName}-${yearVal}`;
  };

  const monthKey = month || getCurrentMonthYearString();
  const [monthName, yearStr] = monthKey.split("-");
  const year = parseInt(yearStr) || new Date().getFullYear();

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let monthIndex = monthsList.indexOf(monthName);
  if (monthIndex === -1) {
    monthIndex = new Date().getMonth();
  }

  // Core Store Reducer
  const [state, dispatch] = useReducer(budgetReducer, {
    incomes: [],
    budgetGroups: [],
    transactions: [],
    paydayDay: 20,
    weekendBehavior: "preceding-friday",
  });

  const cycleCalculator = useMemo(() => {
    return new BudgetCycleCalculator({
      paydayDay: state.paydayDay,
      weekendBehavior: state.weekendBehavior,
    });
  }, [state.paydayDay, state.weekendBehavior]);

  const monthLabel = `${monthName} ${year}`;
  const range = useMemo(() => {
    return cycleCalculator.getCycleRange(year, monthIndex);
  }, [cycleCalculator, year, monthIndex]);

  const cycleRangeLabel = useMemo(() => {
    return cycleCalculator.formatCycleRange(range);
  }, [cycleCalculator, range]);

  const [viewMode, setViewMode] = useState("remaining"); // 'remaining' or 'spent'


  // Modal States
  const [activeAddTransactionItem, setActiveAddTransactionItem] =
    useState(null);
  const [activeViewTransactionsItem, setActiveViewTransactionsItem] =
    useState(null);

  // Debt Modal States
  const [debtFormModalOpen, setDebtFormModalOpen] = useState(false);
  const [editingDebtItem, setEditingDebtItem] = useState(null);

  const loadedMonthRef = useRef(null);

  // Sync state with url parameter (Cycle loading)
  useEffect(() => {
    const data = loadBudgetData(monthKey, storageAdapter);
    dispatch({ type: "LOAD_CYCLE", payload: data });
    loadedMonthRef.current = monthKey;
  }, [monthKey]);

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

  // Action Dispatchers
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
    dispatch({
      type: "UPDATE_ITEM_FIELD",
      payload: { itemId, fieldName, value },
    });

    // If it's a debt item and fieldName is "assigned", update the template defaults
    const targetItem = findBudgetItem(itemId);
    if (targetItem && targetItem.type === "debt" && fieldName === "assigned") {
      updateTemplateDebtAssigned(storageAdapter, itemId, value);
    }
  };

  const handleAddItem = (groupIndex) => {
    dispatch({ type: "ADD_ITEM", payload: { groupIndex } });
  };

  const handleDeleteItem = (itemId) => {
    dispatch({ type: "DELETE_ITEM", payload: itemId });
  };

  const handleAddGroup = () => {
    const newGroupName = prompt("Enter new group name:");
    if (!newGroupName) return;
    dispatch({ type: "ADD_GROUP", payload: { name: newGroupName } });
  };

  const handleRenameGroup = (groupIndex, currentName) => {
    const newName = prompt("Rename budget group:", currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      dispatch({
        type: "RENAME_GROUP",
        payload: { groupIndex, newName: newName.trim() },
      });
    }
  };

  const handleDeleteGroup = (groupIndex, groupName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the "${groupName}" group and all its budget items? This will also remove any related transactions.`
    );
    if (confirmed) {
      dispatch({ type: "DELETE_GROUP", payload: { groupIndex } });
    }
  };



  const handleAddTransaction = (payee, amount, budgetItemId) => {
    if (!payee.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid payee name and numeric amount.");
      return;
    }
    dispatch({
      type: "ADD_TRANSACTION",
      payload: { payee, amount, budgetItemId },
    });

    // Side-effect: update template balance for debt items (Option A)
    const targetItem = findBudgetItem(budgetItemId);
    if (targetItem && targetItem.type === "debt") {
      updateTemplateDebtBalance(
        storageAdapter,
        budgetItemId,
        -parseFloat(amount)
      );
    }
  };

  const handleDeleteTransaction = (txId) => {
    // Side-effect: reverse template balance for debt items
    const tx = state.transactions.find((t) => t.id === txId);
    if (tx) {
      const targetItem = findBudgetItem(tx.budgetItemId);
      if (targetItem && targetItem.type === "debt") {
        updateTemplateDebtBalance(
          storageAdapter,
          tx.budgetItemId,
          tx.amount // Add back the amount
        );
      }
    }

    dispatch({ type: "DELETE_TRANSACTION", payload: txId });
  };

  const handleDeleteMultipleTransactions = (txIds) => {
    // Side-effect: reverse template balance for debt items
    for (const txId of txIds) {
      const tx = state.transactions.find((t) => t.id === txId);
      if (tx) {
        const targetItem = findBudgetItem(tx.budgetItemId);
        if (targetItem && targetItem.type === "debt") {
          updateTemplateDebtBalance(storageAdapter, tx.budgetItemId, tx.amount);
        }
      }
    }

    dispatch({ type: "DELETE_MULTIPLE_TRANSACTIONS", payload: txIds });
  };

  // Debt Action Dispatchers
  const handleAddDebtItem = (debtData) => {
    const newId = generateUniqueId();
    const debtWithId = { ...debtData, id: newId };

    // Ensure the Debt group exists
    dispatch({ type: "ADD_DEBT_REPAYMENT_GROUP" });
    dispatch({ type: "ADD_DEBT_ITEM", payload: debtWithId });

    // Also update the template with the new debt
    addTemplateDebtItem(storageAdapter, debtWithId);
    setDebtFormModalOpen(false);
  };

  const handleUpdateDebtItem = (debtData) => {
    dispatch({ type: "UPDATE_DEBT_ITEM", payload: debtData });

    // Also update the template
    updateTemplateDebtItem(storageAdapter, debtData);

    setEditingDebtItem(null);
    setDebtFormModalOpen(false);
  };

  // Derived values on render (Single Source of Truth)
  const enrichedBudgetGroups = useMemo(() => {
    return getEnrichedGroups(state.budgetGroups, state.transactions, viewMode);
  }, [state.budgetGroups, state.transactions, viewMode]);

  const summary = useMemo(() => {
    return calculateSummary(state);
  }, [state]);

  const { totalIncome, totalAssigned, unassignedIncome, isOverallocated } = summary;

  const activeItemTransactions = useMemo(() => {
    return activeViewTransactionsItem
      ? state.transactions.filter(
          (tx) => tx.budgetItemId === activeViewTransactionsItem.id
        )
      : [];
  }, [state.transactions, activeViewTransactionsItem]);

  return (
    <section key={monthKey}>
      <Hero
        monthLabel={monthLabel}
        cycleRangeLabel={cycleRangeLabel}
        incomes={state.incomes || []}
        totalIncome={totalIncome}
        totalAssigned={totalAssigned}
        unassignedIncome={unassignedIncome}
        isOverallocated={isOverallocated}
        onUpdateIncomeField={handleUpdateIncomeField}
        onAddIncome={handleAddIncome}
        onDeleteIncome={handleDeleteIncome}
        viewMode={viewMode}
        onViewModeToggle={setViewMode}
      />

      <BudgetForm className="form" onAddGroupClick={handleAddGroup}>
        {enrichedBudgetGroups.map((group, groupIndex) => {
          const budgetGroupElement = group.isDebtGroup ? (
            <DebtGroup
              key={group.name}
              budgetGroup={group}
              onChangeHandler={handleFieldChange}
              onRecordPaymentClick={(item) => {
                setActiveAddTransactionItem(item);
              }}
              onViewPaymentsClick={(item) => {
                setActiveViewTransactionsItem(item);
              }}
              onEditDebtClick={(item) => {
                setEditingDebtItem(item);
                setDebtFormModalOpen(true);
              }}
              onDeleteItemClick={handleDeleteItem}
              onAddDebtClick={() => {
                setEditingDebtItem(null);
                setDebtFormModalOpen(true);
              }}
            />
          ) : (
            <BudgetGroup
              key={group.name}
              groupIndex={groupIndex}
              budgetGroup={group}
              viewMode={viewMode}
              onChangeHandler={handleFieldChange}
              onBlurHandler={() => {}}
              onAddTransactionClick={(gIdx, iIdx, item) => {
                setActiveAddTransactionItem(item);
              }}
              onViewTransactionsClick={(gIdx, iIdx, item) => {
                setActiveViewTransactionsItem(item);
              }}
              onDeleteItemClick={handleDeleteItem}
              onAddItemClick={() => handleAddItem(groupIndex)}
              onRenameGroupClick={handleRenameGroup}
              onDeleteGroupClick={handleDeleteGroup}
            />
          );

          return budgetGroupElement;
        })}
      </BudgetForm>

      <TransactionLog
        transactions={state.transactions}
        budgetGroups={state.budgetGroups}
        onDeleteTransaction={handleDeleteTransaction}
        onDeleteMultipleTransactions={handleDeleteMultipleTransactions}
      />

      {/* Add Transaction Modal (also used for debt payments) */}
      <AddTransactionModal
        isOpen={!!activeAddTransactionItem}
        budgetItem={activeAddTransactionItem}
        onClose={() => setActiveAddTransactionItem(null)}
        onSubmit={(payee, amount) => {
          handleAddTransaction(payee, amount, activeAddTransactionItem.id);
          setActiveAddTransactionItem(null);
        }}
      />

      {/* View Transactions Modal */}
      <ViewTransactionsModal
        isOpen={!!activeViewTransactionsItem}
        budgetItem={activeViewTransactionsItem}
        transactions={activeItemTransactions}
        onClose={() => setActiveViewTransactionsItem(null)}
        onDeleteTransaction={handleDeleteTransaction}
      />

      {/* Debt Form Modal (Add/Edit) */}
      <DebtFormModal
        isOpen={debtFormModalOpen}
        debtItem={editingDebtItem}
        onClose={() => {
          setDebtFormModalOpen(false);
          setEditingDebtItem(null);
        }}
        onSubmit={(data) => {
          if (editingDebtItem) {
            handleUpdateDebtItem(data);
          } else {
            handleAddDebtItem(data);
          }
        }}
      />
    </section>
  );
};

export default Budget;
