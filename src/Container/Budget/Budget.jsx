import React, { useEffect, useState, useReducer, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Hero, BudgetForm, BudgetGroup, TransactionLog } from "../../Component";
import "./styles/Budget.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  getBudgetCycleRange,
  formatDate,
} from "../../utils/utils";
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

  const monthLabel = `${monthName} ${year}`;
  const range = getBudgetCycleRange(year, monthIndex);
  const cycleRangeLabel = `${formatDate(range.start)} - ${formatDate(range.end)}`;

  // Core Store Reducer
  const [state, dispatch] = useReducer(budgetReducer, {
    startingSalary: 0,
    budgetGroups: [],
    transactions: [],
  });

  const [viewMode, setViewMode] = useState("remaining"); // 'remaining' or 'spent'

  // Modal States
  const [activeAddTransactionItem, setActiveAddTransactionItem] =
    useState(null);
  const [activeViewTransactionsItem, setActiveViewTransactionsItem] =
    useState(null);
  const [txName, setTxName] = useState("");
  const [txAmount, setTxAmount] = useState("");

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
              setTxName("");
              setTxAmount("");
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
      {activeAddTransactionItem && (
        <div
          className="modal-overlay"
          onClick={() => setActiveAddTransactionItem(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Transaction</h3>
              <button
                className="btn-close-modal"
                onClick={() => setActiveAddTransactionItem(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Budget Item</label>
                <input
                  type="text"
                  value={
                    activeAddTransactionItem.fields.find(
                      (f) => f.label.toLowerCase() === "name"
                    )?.value || ""
                  }
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Payee / Description</label>
                <input
                  type="text"
                  value={txName}
                  onChange={(e) => setTxName(e.target.value)}
                  placeholder="e.g. Tesco, Rent payment"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-modal btn-modal-cancel"
                onClick={() => setActiveAddTransactionItem(null)}
              >
                Cancel
              </button>
              <button
                className="btn-modal btn-modal-submit"
                onClick={() => {
                  handleAddTransaction(
                    txName,
                    txAmount,
                    activeAddTransactionItem.id
                  );
                  setActiveAddTransactionItem(null);
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Transactions Modal */}
      {activeViewTransactionsItem && (
        <div
          className="modal-overlay"
          onClick={() => setActiveViewTransactionsItem(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transactions List</h3>
              <button
                className="btn-close-modal"
                onClick={() => setActiveViewTransactionsItem(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  Budget Item:{" "}
                  {activeViewTransactionsItem.fields.find(
                    (f) => f.label.toLowerCase() === "name"
                  )?.value || ""}
                </label>
              </div>
              {activeItemTransactions.length === 0 ? (
                <p className="no-transactions">No transactions recorded yet.</p>
              ) : (
                <ul className="tx-list">
                  {activeItemTransactions.map((tx) => (
                    <li key={tx.id} className="tx-item">
                      <div className="tx-info">
                        <span className="tx-name">{tx.name}</span>
                        <span className="tx-date">
                          {new Date(tx.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="tx-amount-delete">
                        <span className="tx-amount">
                          £{tx.amount.toFixed(2)}
                        </span>
                        <button
                          className="btn-delete-tx"
                          onClick={() => handleDeleteTransaction(tx.id)}
                          title="Delete Transaction"
                        >
                          <FontAwesomeIcon icon={faTrashCan} size="sm" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="btn-modal btn-modal-submit"
                onClick={() => setActiveViewTransactionsItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Budget;
