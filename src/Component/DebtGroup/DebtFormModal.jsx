import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DEBT_TYPES } from "../../utils/constants";
import "../TransactionModals/styles/TransactionModals.css";

const DebtFormModal = ({ isOpen, debtItem, onClose, onSubmit }) => {
  const isEditMode = !!debtItem;

  const [name, setName] = useState("");
  const [outstandingBalance, setOutstandingBalance] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [debtType, setDebtType] = useState("credit-card");
  const [interestRate, setInterestRate] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setName(debtItem.name || "");
        setOutstandingBalance(debtItem.outstandingBalance?.toString() || "");
        setMinimumPayment(debtItem.minimumPayment?.toString() || "");
        setDebtType(debtItem.debtType || "credit-card");
        setInterestRate(debtItem.interestRate?.toString() || "");
      } else {
        setName("");
        setOutstandingBalance("");
        setMinimumPayment("");
        setDebtType("credit-card");
        setInterestRate("");
      }
    }
  }, [isOpen, debtItem, isEditMode]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      ...(isEditMode ? { itemId: debtItem.id } : {}),
      name: name.trim(),
      outstandingBalance: parseFloat(outstandingBalance) || 0,
      minimumPayment: parseFloat(minimumPayment) || 0,
      debtType,
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? "Edit Debt" : "Add Debt"}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Barclaycard"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Debt Type</label>
            <select
              value={debtType}
              onChange={(e) => setDebtType(e.target.value)}
            >
              {DEBT_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Outstanding Balance (£)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={outstandingBalance}
              onChange={(e) => setOutstandingBalance(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label>Minimum Payment (£)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={minimumPayment}
              onChange={(e) => setMinimumPayment(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (% — optional)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g. 19.9"
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-modal btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-modal btn-modal-submit"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            {isEditMode ? "Save Changes" : "Add Debt"}
          </button>
        </div>
      </div>
    </div>
  );
};

DebtFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  debtItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    outstandingBalance: PropTypes.number,
    minimumPayment: PropTypes.number,
    debtType: PropTypes.string,
    interestRate: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DebtFormModal;
