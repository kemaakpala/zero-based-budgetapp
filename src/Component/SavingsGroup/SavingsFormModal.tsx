import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import TextField from "../TextField/TextField";
import type { BudgetItem } from "../../utils/budgetStore/types";
import "../TransactionModals/styles/TransactionModals.css";

export interface SavingsFormData {
  itemId?: string;
  name: string;
  goal: number;
  startingBalance: number;
}

export interface SavingsFormModalProps {
  isOpen: boolean;
  savingsItem?: BudgetItem | null;
  onClose: () => void;
  onSubmit: (data: SavingsFormData) => void;
}

const SavingsFormModal = ({
  isOpen,
  savingsItem,
  onClose,
  onSubmit,
}: SavingsFormModalProps) => {
  const isEditMode = !!savingsItem;

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startingBalance, setStartingBalance] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (savingsItem) {
        setName(savingsItem.name || "");
        setGoal(savingsItem.goal?.toString() || "");
        setStartingBalance(savingsItem.startingBalance?.toString() || "");
      } else {
        setName("");
        setGoal("");
        setStartingBalance("");
      }
    }
  }, [isOpen, savingsItem]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      ...(savingsItem?.id ? { itemId: savingsItem.id } : {}),
      name: name.trim(),
      goal: parseFloat(goal) || 0,
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="e.g. Emergency Fund"
              autoFocus
            />
          </div>
          <div className="form-group">
            <TextField
              id="savingsGoal"
              label="Goal Amount (£)"
              type="number"
              step="0.01"
              min="0"
              value={goal}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setGoal(e.target.value)
              }
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartingBalance(e.target.value)
              }
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

export default SavingsFormModal;
