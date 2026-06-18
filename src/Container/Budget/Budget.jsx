import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Hero, BudgetForm, BudgetGroup, TransactionLog } from "../../Component";
import "./styles/Budget.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  generateUniqueId,
  formatBudgetItemAmount,
  calculatePayday,
  getBudgetCycleRange,
  formatDate,
  DEFAULT_BUDGET_GROUPS,
} from "../../utils/utils";

// Loader for budget data
const loadBudgetData = (monthKey) => {
  const data = localStorage.getItem(`budget_app_data_${monthKey}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing budget data", e);
    }
  }
  const savedDefaults = localStorage.getItem("budget_app_defaults");
  if (savedDefaults) {
    try {
      const parsed = JSON.parse(savedDefaults);
      return {
        startingSalary: parsed.startingSalary || 5000.0,
        budgetGroups: JSON.parse(JSON.stringify(parsed.budgetGroups)),
        transactions: [],
      };
    } catch (e) {
      console.error("Error parsing default budget template", e);
    }
  }
  return {
    startingSalary: 5000.0,
    budgetGroups: JSON.parse(JSON.stringify(DEFAULT_BUDGET_GROUPS)),
    transactions: [],
  };
};

const saveBudgetData = (monthKey, state) => {
  localStorage.setItem(`budget_app_data_${monthKey}`, JSON.stringify(state));
};

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

  // Core State
  const [startingSalary, setStartingSalary] = useState(0);
  const [budgetGroups, setBudgetGroups] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState("remaining"); // 'remaining' or 'spent'

  // Modal States
  const [activeAddTransactionItem, setActiveAddTransactionItem] =
    useState(null);
  const [activeViewTransactionsItem, setActiveViewTransactionsItem] =
    useState(null);
  const [txName, setTxName] = useState("");
  const [txAmount, setTxAmount] = useState("");

  // Sync state with url parameter
  useEffect(() => {
    const data = loadBudgetData(monthKey);
    setStartingSalary(data.startingSalary);
    setBudgetGroups(data.budgetGroups);
    setTransactions(data.transactions);
  }, [monthKey]);

  // Handle updates
  const handleStartingSalaryChange = (newVal) => {
    setStartingSalary(newVal);
    saveBudgetData(monthKey, {
      startingSalary: newVal,
      budgetGroups,
      transactions,
    });
  };

  const handleFieldChange = (groupIndex, itemIndex, fieldIndex, value) => {
    const updatedGroups = [...budgetGroups];
    const field =
      updatedGroups[groupIndex].budgetGroupItems[itemIndex].fields[fieldIndex];

    if (
      field.label.toLowerCase() === "assigned" ||
      field.label.toLowerCase() === "planned"
    ) {
      field.value = formatBudgetItemAmount(value);
    } else {
      field.value = value;
    }

    setBudgetGroups(updatedGroups);
    saveBudgetData(monthKey, {
      startingSalary,
      budgetGroups: updatedGroups,
      transactions,
    });
  };

  const handleAddItem = (groupIndex) => {
    const updatedGroups = [...budgetGroups];
    const newItem = {
      id: generateUniqueId(),
      fields: [
        { label: "Name", value: "New Item", type: "text" },
        { label: "Assigned", value: "0.00", type: "text" },
      ],
      status: [{ label: "Remaining", value: "0.00", type: "text" }],
      type: "expense",
    };
    updatedGroups[groupIndex].budgetGroupItems.push(newItem);
    setBudgetGroups(updatedGroups);
    saveBudgetData(monthKey, {
      startingSalary,
      budgetGroups: updatedGroups,
      transactions,
    });
  };

  const handleDeleteItem = (groupIndex, itemIndex) => {
    const updatedGroups = [...budgetGroups];
    const itemToDelete = updatedGroups[groupIndex].budgetGroupItems[itemIndex];
    updatedGroups[groupIndex].budgetGroupItems.splice(itemIndex, 1);

    // Clean up orphan transactions
    const updatedTransactions = transactions.filter(
      (tx) => tx.budgetItemId !== itemToDelete.id
    );

    setBudgetGroups(updatedGroups);
    setTransactions(updatedTransactions);
    saveBudgetData(monthKey, {
      startingSalary,
      budgetGroups: updatedGroups,
      transactions: updatedTransactions,
    });
  };

  const handleAddGroup = () => {
    const newGroupName = prompt("Enter new group name:");
    if (!newGroupName) return;
    const updatedGroups = [
      ...budgetGroups,
      {
        name: newGroupName,
        columns: [{ name: "Assigned" }, { name: "Remaining" }],
        budgetGroupItems: [],
      },
    ];
    setBudgetGroups(updatedGroups);
    saveBudgetData(monthKey, {
      startingSalary,
      budgetGroups: updatedGroups,
      transactions,
    });
  };

  // Transaction logic
  const handleAddTransaction = (name, amount, budgetItemId) => {
    if (!name.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid payee name and numeric amount.");
      return;
    }
    const newTx = {
      id: generateUniqueId(),
      name: name.trim(),
      amount: parseFloat(amount) || 0,
      budgetItemId,
      date: new Date().toISOString(),
    };
    const updatedTransactions = [...transactions, newTx];
    setTransactions(updatedTransactions);
    saveBudgetData(monthKey, {
      startingSalary,
      budgetGroups,
      transactions: updatedTransactions,
    });
  };

  const handleDeleteTransaction = (txId) => {
    const updatedTransactions = transactions.filter((tx) => tx.id !== txId);
    setTransactions(updatedTransactions);
    saveBudgetData(monthKey, {
      startingSalary,
      budgetGroups,
      transactions: updatedTransactions,
    });

    // If the view modal is open, update the active item's transactions list
    if (activeViewTransactionsItem) {
      setActiveViewTransactionsItem((prev) => (prev ? { ...prev } : null));
    }
  };

  const handleDeleteMultipleTransactions = (txIds) => {
    const updatedTransactions = transactions.filter(
      (tx) => !txIds.includes(tx.id)
    );
    setTransactions(updatedTransactions);
    saveBudgetData(monthKey, {
      startingSalary,
      budgetGroups,
      transactions: updatedTransactions,
    });

    // If the view modal is open, update the active item's transactions list
    if (activeViewTransactionsItem) {
      setActiveViewTransactionsItem((prev) => (prev ? { ...prev } : null));
    }
  };

  // Derive values on render (Single Source of Truth)
  const enrichedBudgetGroups = budgetGroups.map((group) => ({
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

      const assignedField = item.fields.find(
        (f) => f.label.toLowerCase() === "assigned"
      );
      const assigned =
        assignedField ? parseFloat(assignedField.value) || 0 : 0;
      const remaining = assigned - spent;

      return {
        ...item,
        spent,
        remaining,
        status: item.status
          ? item.status.map((st) => {
              if (
                st.label.toLowerCase() === "remaining" ||
                st.label.toLowerCase() === "spent"
              ) {
                return {
                  ...st,
                  label: viewMode === "remaining" ? "Remaining" : "Spent",
                  value:
                    viewMode === "remaining"
                      ? remaining.toFixed(2)
                      : spent.toFixed(2),
                };
              }
              return st;
            })
          : [],
      };
    }),
  }));

  const totalAssigned = budgetGroups.reduce((total, group) => {
    return (
      total +
      group.budgetGroupItems.reduce((gTotal, item) => {
        const assignedField = item.fields.find(
          (f) => f.label.toLowerCase() === "assigned"
        );
        const assigned =
          assignedField ? parseFloat(assignedField.value) || 0 : 0;
        return gTotal + assigned;
      }, 0)
    );
  }, 0);

  const unassignedSalary = startingSalary - totalAssigned;

  // Render variables for modals
  const activeItemTransactions = activeViewTransactionsItem
    ? transactions.filter(
        (tx) => tx.budgetItemId === activeViewTransactionsItem.id
      )
    : [];

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
        transactions={transactions}
        budgetGroups={budgetGroups}
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
