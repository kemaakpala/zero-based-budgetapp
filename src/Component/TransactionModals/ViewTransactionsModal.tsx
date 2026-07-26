import type { MouseEvent, JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import type { BudgetItem, Transaction } from "../../utils/budgetStore/types";
import "./styles/TransactionModals.css";

export interface ViewTransactionsModalProps {
  isOpen: boolean;
  budgetItem?: BudgetItem | null;
  transactions?: Transaction[];
  onClose: () => void;
  onDeleteTransaction: (txId: string) => void;
}

const ViewTransactionsModal = ({
  isOpen,
  budgetItem,
  transactions = [],
  onClose,
  onDeleteTransaction,
}: ViewTransactionsModalProps): JSX.Element | null => {
  if (!isOpen || !budgetItem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
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
                    <span className="tx-name">{tx.payee}</span>
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

export default ViewTransactionsModal;
