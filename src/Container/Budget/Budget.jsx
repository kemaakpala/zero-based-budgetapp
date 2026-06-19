import React, { useEffect, useState, useReducer, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Hero,
  BudgetForm,
  BudgetGroup,
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
} from "../../utils/budgetStore";

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
    startingSalary: 0,
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

  // Sync state with url parameter (Cycle loading)
  useEffect(() => {
    const data = loadBudgetData(monthKey, storageAdapter);
    dispatch({ type: "LOAD_CYCLE", payload: data });
  }, [monthKey]);

  // Sync state changes back to localStorage
  useEffect(() => {
    if (state && state.startingSalary !== undefined && state.budgetGroups.length > 0) {
      saveBudgetData(monthKey, state, storageAdapter);
    }
  }, [state, monthKey]);

  // Action Dispatchers
  const handleStartingSalaryChange = (newVal) => {
    dispatch({ type: "SET_STARTING_SALARY", payload: newVal });
  };

  const handleFieldChange = (itemId, fieldName, value) => {
    dispatch({
      type: "UPDATE_ITEM_FIELD",
      payload: { itemId, fieldName, value },
    });
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

  const handleAddTransaction = (name, amount, budgetItemId) => {
    if (!name.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid payee name and numeric amount.");
      return;
    }
    dispatch({
      type: "ADD_TRANSACTION",
      payload: { name, amount, budgetItemId },
    });
  };

  const handleDeleteTransaction = (txId) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: txId });
  };

  const handleDeleteMultipleTransactions = (txIds) => {
    dispatch({ type: "DELETE_MULTIPLE_TRANSACTIONS", payload: txIds });
  };

  // Derived values on render (Single Source of Truth)
  const enrichedBudgetGroups = useMemo(() => {
    return getEnrichedGroups(state.budgetGroups, state.transactions, viewMode);
  }, [state.budgetGroups, state.transactions, viewMode]);

  const summary = useMemo(() => {
    return calculateSummary(state);
  }, [state]);

  const { startingSalary, unassignedSalary } = summary;

  const activeItemTransactions = useMemo(() => {
    return activeViewTransactionsItem
      ? state.transactions.filter(
          (tx) => tx.budgetItemId === activeViewTransactionsItem.id
        )
      : [];
  }, [state.transactions, activeViewTransactionsItem]);

  return (
    <section>
      <Hero
        monthLabel={monthLabel}
        cycleRangeLabel={cycleRangeLabel}
        startingSalary={startingSalary}
        unassignedSalary={unassignedSalary}
        onStartingSalaryChange={handleStartingSalaryChange}
        viewMode={viewMode}
        onViewModeToggle={setViewMode}
      />

      <BudgetForm className="form" onAddGroupClick={handleAddGroup}>
        {enrichedBudgetGroups.map((group, groupIndex) => (
          <BudgetGroup
            key={group.name}
            groupIndex={groupIndex}
            budgetGroup={group}
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
          />
        ))}
      </BudgetForm>

      <TransactionLog
        transactions={state.transactions}
        budgetGroups={state.budgetGroups}
        onDeleteTransaction={handleDeleteTransaction}
        onDeleteMultipleTransactions={handleDeleteMultipleTransactions}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={!!activeAddTransactionItem}
        budgetItem={activeAddTransactionItem}
        onClose={() => setActiveAddTransactionItem(null)}
        onSubmit={(name, amount) => {
          handleAddTransaction(name, amount, activeAddTransactionItem.id);
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
    </section>
  );
}

export default Budget;
