import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TextField from "../TextField/TextField";
import "../TransactionModals/styles/TransactionModals.css";

const SavingsFormModal = ({ isOpen, savingsItem, onClose, onSubmit }) => {
  const isEditMode = !!savingsItem;

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [startingBalance, setStartingBalance] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setName(savingsItem.name || "");
        setTarget(savingsItem.target?.toString() || "");
        setStartingBalance(savingsItem.startingBalance?.toString() || "");
      } else {
        setName("");
        setTarget("");
        setStartingBalance("");
      }
    }
  }, [isOpen, savingsItem, isEditMode]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      ...(isEditMode ? { itemId: savingsItem.id } : {}),
      name: name.trim(),
      target: parseFloat(target) || 0,
      startingBalance: parseFloat(startingBalance) || 0,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? "Edit Savings Goal" : "Add Savings Goal"}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <TextField
              id="savingsName"
              label="Goal Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emergency Fund"
              autoFocus
            />
          </div>
          <div className="form-group">
            <TextField
              id="savingsTarget"
              label="Overall Target (£)"
              type="number"
              step="0.01"
              min="0"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <TextField
              id="savingsStartingBalance"
              label="Starting Balance (£)"
              type="number"
              step="0.01"
              min="0"
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
              placeholder="0.00"
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
            {isEditMode ? "Save Changes" : "Add Goal"}
          </button>
        </div>
      </div>
    </div>
  );
};

SavingsFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  savingsItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    target: PropTypes.number,
    startingBalance: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SavingsFormModal;
