import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./styles/TransactionModals.css";

const ViewTransactionsModal = ({
  isOpen,
  budgetItem,
  transactions = [],
  onClose,
  onDeleteTransaction,
}) => {
  if (!isOpen || !budgetItem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Transactions List</h3>
          <button className="btn-close-modal" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Budget Item: {budgetItem.name || ""}</label>
          </div>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions recorded yet.</p>
          ) : (
            <ul className="tx-list">
              {transactions.map((tx) => (
                <li key={tx.id} className="tx-item">
                  <div className="tx-info">
                    <span className="tx-name">{tx.name}</span>
                    <span className="tx-date">
                      {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="tx-amount-delete">
                    <span className="tx-amount">£{tx.amount.toFixed(2)}</span>
                    <button
                      className="btn-delete-tx"
                      onClick={() => onDeleteTransaction(tx.id)}
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
          <button className="btn-modal btn-modal-submit" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewTransactionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  budgetItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }),
  ),
  onClose: PropTypes.func.isRequired,
  onDeleteTransaction: PropTypes.func.isRequired,
};

export default ViewTransactionsModal;
