import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles/TransactionModals.css";

const AddTransactionModal = ({ isOpen, budgetItem, onClose, onSubmit }) => {
  const [txName, setTxName] = useState("");
  const [txAmount, setTxAmount] = useState("");

  const isDebt = budgetItem?.type === "debt";

  // Reset inputs when opened or item changes
  useEffect(() => {
    if (isOpen) {
      // Pre-fill payee name for debt payments
      setTxName(isDebt ? budgetItem?.name || "" : "");
      setTxAmount("");
    }
  }, [isOpen, budgetItem, isDebt]);

  if (!isOpen || !budgetItem) return null;

  const handleAdd = () => {
    onSubmit(txName, txAmount);
  };

  const parsedAmount = parseFloat(txAmount) || 0;
  const currentBalance = parseFloat(budgetItem.outstandingBalance) || 0;
  const balanceAfterPayment = currentBalance - parsedAmount;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isDebt ? "Record Payment" : "Add Transaction"}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>{isDebt ? "Debt Item" : "Budget Item"}</label>
            <input type="text" value={budgetItem.name || ""} disabled />
          </div>

          {isDebt && (
            <div className="form-group">
              <label>Current Outstanding Balance</label>
              <input
                type="text"
                value={`£${currentBalance.toFixed(2)}`}
                disabled
              />
            </div>
          )}

          <div className="form-group">
            <label>Payee / Description</label>
            <input
              type="text"
              value={txName}
              onChange={(e) => setTxName(e.target.value)}
              placeholder={
                isDebt ? "e.g. Monthly payment" : "e.g. Tesco, Rent payment"
              }
              autoFocus={!isDebt}
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
              autoFocus={isDebt}
            />
          </div>

          {isDebt && parsedAmount > 0 && (
            <div className="debt-balance-preview">
              Balance after payment:{" "}
              <strong>£{balanceAfterPayment.toFixed(2)}</strong>
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn-modal btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-modal btn-modal-submit" onClick={handleAdd}>
            {isDebt ? "Record Payment" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

AddTransactionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  budgetItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    outstandingBalance: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddTransactionModal;
