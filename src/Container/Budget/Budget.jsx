import React, { useEffect, useState, useMemo } from "react";
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
  SavingsGroup,
  SavingsFormModal,
} from "../../Component";
import "./styles/Budget.css";
import { BudgetCycleCalculator } from "../../utils/budgetCycle";
import { useBudgetStore, LocalStorageAdapter } from "../../utils/budgetStore";

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

  // Custom Hook for State management, Persistence and default Template syncing
  const {
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
    handleAddGroup: hookAddGroup,
    handleRenameGroup: hookRenameGroup,
    handleDeleteGroup: hookDeleteGroup,
    handleSwapGroups,
    handleAddTransaction: hookAddTransaction,
    handleDeleteTransaction,
    handleDeleteMultipleTransactions,
    handleAddDebtItem: hookAddDebtItem,
    handleUpdateDebtItem: hookUpdateDebtItem,
    handleAddSavingsItem: hookAddSavingsItem,
    handleUpdateSavingsItem: hookUpdateSavingsItem,
  } = useBudgetStore(monthKey, storageAdapter);

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

  const [draggedIndex, setDraggedIndex] = useState(null);

  // Modal States
  const [activeAddTransactionItem, setActiveAddTransactionItem] =
    useState(null);
  const [activeViewTransactionsItem, setActiveViewTransactionsItem] =
    useState(null);

  // Debt Modal States
  const [debtFormModalOpen, setDebtFormModalOpen] = useState(false);
  const [editingDebtItem, setEditingDebtItem] = useState(null);

  // Savings Modal States
  const [savingsFormModalOpen, setSavingsFormModalOpen] = useState(false);
  const [editingSavingsItem, setEditingSavingsItem] = useState(null);

  // Component UI Dialog Action wrappers
  const handleAddGroup = () => {
    const newGroupName = prompt("Enter new group name:");
    if (!newGroupName) return;
    hookAddGroup(newGroupName);
  };

  const handleRenameGroup = (groupIndex, currentName) => {
    const newName = prompt("Rename budget group:", currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      hookRenameGroup(groupIndex, newName.trim());
    }
  };

  const handleDeleteGroup = (groupIndex, groupName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the "${groupName}" group and all its budget items? This will also remove any related transactions.`
    );
    if (confirmed) {
      hookDeleteGroup(groupIndex);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      handleSwapGroups(draggedIndex, index);
    }
    setDraggedIndex(null);
  };

  const handleAddTransaction = (payee, amount, budgetItemId) => {
    if (!payee.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid payee name and numeric amount.");
      return;
    }
    hookAddTransaction(payee, amount, budgetItemId);
  };

  const handleAddDebtItem = (debtData) => {
    hookAddDebtItem(debtData);
    setDebtFormModalOpen(false);
  };

  const handleUpdateDebtItem = (debtData) => {
    hookUpdateDebtItem(debtData);
    setEditingDebtItem(null);
    setDebtFormModalOpen(false);
  };

  const handleAddSavingsItem = (savingsData) => {
    hookAddSavingsItem(savingsData);
    setSavingsFormModalOpen(false);
  };

  const handleUpdateSavingsItem = (savingsData) => {
    hookUpdateSavingsItem(savingsData);
    setEditingSavingsItem(null);
    setSavingsFormModalOpen(false);
  };

  const { totalIncome, totalAssigned, unassignedIncome, isOverallocated } =
    summary;

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
              onSaveField={handleFieldChange}
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
          ) : group.isSavingsGroup ? (
            <SavingsGroup
              key={group.name}
              budgetGroup={group}
              onSaveField={handleFieldChange}
              onRecordPaymentClick={(item) => {
                setActiveAddTransactionItem(item);
              }}
              onViewPaymentsClick={(item) => {
                setActiveViewTransactionsItem(item);
              }}
              onEditSavingsClick={(item) => {
                setEditingSavingsItem(item);
                setSavingsFormModalOpen(true);
              }}
              onDeleteItemClick={handleDeleteItem}
              onAddSavingsClick={() => {
                setEditingSavingsItem(null);
                setSavingsFormModalOpen(true);
              }}
            />
          ) : (
            <BudgetGroup
              key={group.name}
              groupIndex={groupIndex}
              budgetGroup={group}
              viewMode={viewMode}
              onSaveField={handleFieldChange}
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

          // Wrap all groups (Budget & Debt) in Draggable containers for sorting
          return (
            <div
              key={group.name}
              draggable
              onDragStart={(e) => handleDragStart(e, groupIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, groupIndex)}
              style={{
                opacity: draggedIndex === groupIndex ? 0.4 : 1,
              }}
              className="budget-group-draggable"
            >
              {budgetGroupElement}
            </div>
          );
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

      {/* Savings Form Modal (Add/Edit) */}
      <SavingsFormModal
        isOpen={savingsFormModalOpen}
        savingsItem={editingSavingsItem}
        onClose={() => {
          setSavingsFormModalOpen(false);
          setEditingSavingsItem(null);
        }}
        onSubmit={(data) => {
          if (editingSavingsItem) {
            handleUpdateSavingsItem(data);
          } else {
            handleAddSavingsItem(data);
          }
        }}
      />
    </section>
  );
}

export default Budget;
