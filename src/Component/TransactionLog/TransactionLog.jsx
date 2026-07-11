import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faMagnifyingGlass,
  faFilter,
  faTrashCan,
  faReceipt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/TransactionLog.css";

const TransactionLog = ({
  transactions = [],
  budgetGroups = [],
  onDeleteTransaction,
  onDeleteMultipleTransactions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("all");
  const [selectedTxIds, setSelectedTxIds] = useState([]);

  // Resolve item name and group name from budgetItemId
  const getBudgetItemDetails = useMemo(() => {
    const cache = {};
    return (itemId) => {
      if (cache[itemId]) return cache[itemId];

      for (const group of budgetGroups) {
        for (const item of group.budgetGroupItems) {
          if (item.id === itemId) {
            const details = {
              itemName: item.name || "Unnamed Item",
              groupName: group.name,
            };
            cache[itemId] = details;
            return details;
          }
        }
      }
      return { itemName: "Unknown Item", groupName: "Unknown Group" };
    };
  }, [budgetGroups]);

  // Unique list of budget items that have transactions, or all items in budget
  const budgetItemsOptions = useMemo(() => {
    const options = [];
    budgetGroups.forEach((group) => {
      group.budgetGroupItems.forEach((item) => {
        options.push({
          id: item.id,
          name: item.name || "Unnamed Item",
          groupName: group.name,
        });
      });
    });
    return options;
  }, [budgetGroups]);

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Filter by search term (payee name)
        const matchSearch = tx.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        // Filter by budget item dropdown
        const matchItem =
          selectedItemId === "all" || tx.budgetItemId === selectedItemId;
        return matchSearch && matchItem;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
  }, [transactions, searchTerm, selectedItemId]);

  // Handle single row selection
  const handleSelectRow = (txId) => {
    setSelectedTxIds((prev) =>
      prev.includes(txId) ? prev.filter((id) => id !== txId) : [...prev, txId],
    );
  };

  // Handle select all filtered rows
  const handleSelectAll = () => {
    const filteredIds = filteredTransactions.map((tx) => tx.id);
    const allSelected = filteredIds.every((id) => selectedTxIds.includes(id));

    if (allSelected) {
      // Uncheck all filtered
      setSelectedTxIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id)),
      );
    } else {
      // Check all filtered (keeping any other checked items not in the current filter)
      setSelectedTxIds((prev) => {
        const newSelection = [...prev];
        filteredIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Handle batch delete
  const handleBatchDelete = () => {
    if (selectedTxIds.length === 0) return;
    const confirmMsg = `Are you sure you want to delete ${selectedTxIds.length} selected transaction(s)?`;
    if (window.confirm(confirmMsg)) {
      onDeleteMultipleTransactions(selectedTxIds);
      setSelectedTxIds([]);
    }
  };

  // Check if all filtered items are selected
  const isAllFilteredSelected =
    filteredTransactions.length > 0 &&
    filteredTransactions.every((tx) => selectedTxIds.includes(tx.id));

  // Check if some filtered items are selected (indeterminate-like helper)
  const isSomeFilteredSelected =
    filteredTransactions.length > 0 &&
    filteredTransactions.some((tx) => selectedTxIds.includes(tx.id)) &&
    !isAllFilteredSelected;

  return (
    <div className="tx-log-container">
      {/* Collapsible Header */}
      <button
        type="button"
        className={`tx-log-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="tx-log-title-area">
          <span className="tx-log-title">Transactions Log</span>
          <span className="tx-log-badge">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="tx-log-toggle-icon">
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="tx-log-content">
          {transactions.length === 0 ? (
            <div className="tx-log-empty">
              <FontAwesomeIcon
                icon={faReceipt}
                className="empty-icon"
                size="2x"
              />
              <p>No transactions recorded for this cycle.</p>
              <p className="subtext">
                Add transactions to budget items using their action menus.
              </p>
            </div>
          ) : (
            <>
              {/* Filters Panel */}
              <div className="tx-log-filters">
                <div className="search-input-wrapper">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="search-icon"
                  />
                  <input
                    type="text"
                    placeholder="Search payee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input filter-search"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setSearchTerm("")}
                      title="Clear search"
                    >
                      <FontAwesomeIcon icon={faXmark} size="sm" />
                    </button>
                  )}
                </div>

                <div className="filter-select-wrapper">
                  <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="filter-input filter-select"
                  >
                    <option value="all">All Budget Items</option>
                    {budgetItemsOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.groupName} → {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {selectedTxIds.length > 0 && (
                <div className="tx-log-bulk-actions">
                  <span className="selected-count">
                    {selectedTxIds.length} item
                    {selectedTxIds.length !== 1 ? "s" : ""} selected
                  </span>
                  <button
                    type="button"
                    onClick={handleBatchDelete}
                    className="btn-bulk-delete"
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="btn-icon-spacing"
                    />
                    Delete Selected
                  </button>
                </div>
              )}

              {/* Transactions List */}
              {filteredTransactions.length === 0 ? (
                <div className="tx-log-empty">
                  <p>No transactions match your search/filter filters.</p>
                </div>
              ) : (
                <div className="tx-table-wrapper">
                  <table className="tx-table">
                    <thead>
                      <tr>
                        <th className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={isAllFilteredSelected}
                            ref={(el) => {
                              if (el) {
                                el.indeterminate = isSomeFilteredSelected;
                              }
                            }}
                            onChange={handleSelectAll}
                            className="tx-checkbox"
                            aria-label="Select all filtered transactions"
                          />
                        </th>
                        <th className="col-payee">Payee / Description</th>
                        <th className="col-category">Budget Item</th>
                        <th className="col-date">Date</th>
                        <th className="col-amount">Amount</th>
                        <th className="col-actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => {
                        const { itemName, groupName } = getBudgetItemDetails(
                          tx.budgetItemId,
                        );
                        const isChecked = selectedTxIds.includes(tx.id);

                        return (
                          <tr
                            key={tx.id}
                            className={isChecked ? "row-selected" : ""}
                          >
                            <td className="col-checkbox">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleSelectRow(tx.id)}
                                className="tx-checkbox"
                                aria-label={`Select transaction with ${tx.name}`}
                              />
                            </td>
                            <td className="col-payee">
                              <span className="payee-name">{tx.name}</span>
                            </td>
                            <td className="col-category">
                              <span className="category-badge">
                                <span className="group-prefix">
                                  {groupName}:
                                </span>{" "}
                                {itemName}
                              </span>
                            </td>
                            <td className="col-date">
                              <span className="tx-date-text">
                                {new Date(tx.date).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </td>
                            <td className="col-amount">
                              <span className="tx-amount-text">
                                £{tx.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="col-actions">
                              <button
                                type="button"
                                className="btn-delete-row"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete transaction "${tx.name}" for £${tx.amount.toFixed(2)}?`,
                                    )
                                  ) {
                                    onDeleteTransaction(tx.id);
                                  }
                                }}
                                title="Delete transaction"
                              >
                                <FontAwesomeIcon icon={faTrashCan} size="sm" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

TransactionLog.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      budgetItemId: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    }),
  ).isRequired,
  budgetGroups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      budgetGroupItems: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          assigned: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  onDeleteTransaction: PropTypes.func.isRequired,
  onDeleteMultipleTransactions: PropTypes.func.isRequired,
};

export default TransactionLog;
