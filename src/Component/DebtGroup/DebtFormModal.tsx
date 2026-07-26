import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { DEBT_TYPES } from "../../utils/constants";
import TextField from "../TextField/TextField";
import SelectField from "../SelectField/SelectField";
import type { BudgetItem } from "../../utils/budgetStore/types";
import "../TransactionModals/styles/TransactionModals.css";

export interface DebtFormData {
  itemId?: string;
  name: string;
  outstandingBalance: number;
  minimumPayment: number;
  debtType: string;
  interestRate?: number;
}

export interface DebtFormModalProps {
  isOpen: boolean;
  debtItem?: BudgetItem | null;
  onClose: () => void;
  onSubmit: (data: DebtFormData) => void;
}

const DebtFormModal = ({
  isOpen,
  debtItem,
  onClose,
  onSubmit,
}: DebtFormModalProps) => {
  const isEditMode = !!debtItem;

  const [name, setName] = useState("");
  const [outstandingBalance, setOutstandingBalance] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [debtType, setDebtType] = useState("credit-card");
  const [interestRate, setInterestRate] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (debtItem) {
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
  }, [isOpen, debtItem]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      ...(debtItem?.id ? { itemId: debtItem.id } : {}),
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
            <TextField
              id="debtName"
              label="Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="e.g. Barclaycard"
              autoFocus
            />
          </div>
          <div className="form-group">
            <SelectField
              id="debtType"
              label="Debt Type"
              value={debtType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setDebtType(e.target.value)
              }
              options={DEBT_TYPES}
            />
          </div>
          <div className="form-group">
            <TextField
              id="debtOutstandingBalance"
              label="Outstanding Balance (£)"
              type="number"
              step="0.01"
              min="0"
              value={outstandingBalance}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOutstandingBalance(e.target.value)
              }
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <TextField
              id="debtMinimumPayment"
              label="Minimum Payment (£)"
              type="number"
              step="0.01"
              min="0"
              value={minimumPayment}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMinimumPayment(e.target.value)
              }
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <TextField
              id="debtInterestRate"
              label="Interest Rate (% — optional)"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={interestRate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInterestRate(e.target.value)
              }
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

export default DebtFormModal;
