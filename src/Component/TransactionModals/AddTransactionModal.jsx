import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles/TransactionModals.css";

const AddTransactionModal = ({ isOpen, budgetItem, onClose, onSubmit }) => {
  const [txName, setTxName] = useState("");
  const [txAmount, setTxAmount] = useState("");

  // Reset inputs when opened or item changes
  useEffect(() => {
    if (isOpen) {
      setTxName("");
      setTxAmount("");
    }
  }, [isOpen, budgetItem]);

  if (!isOpen || !budgetItem) return null;

  const handleAdd = () => {
    onSubmit(txName, txAmount);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Transaction</h3>
          <button className="btn-close-modal" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Budget Item</label>
            <input type="text" value={budgetItem.name || ""} disabled />
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
          <button className="btn-modal btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-modal btn-modal-submit" onClick={handleAdd}>
            Add
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
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddTransactionModal;
