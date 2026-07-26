import { useState, useEffect } from "react";
import type { ChangeEvent, MouseEvent, JSX } from "react";
import TextField from "../TextField/TextField";
import type { BudgetItem } from "../../utils/budgetStore/types";
import "./styles/TransactionModals.css";

export interface AddTransactionModalProps {
  isOpen: boolean;
  budgetItem?: BudgetItem | null;
  onClose: () => void;
  onSubmit: (name: string, amount: string) => void;
}

const AddTransactionModal = ({
  isOpen,
  budgetItem,
  onClose,
  onSubmit,
}: AddTransactionModalProps): JSX.Element | null => {
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
  const currentBalance = parseFloat(String(budgetItem.outstandingBalance)) || 0;
  const balanceAfterPayment = currentBalance - parsedAmount;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{isDebt ? "Record Payment" : "Add Transaction"}</h3>
          <button className="btn-close-modal" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <TextField
              id="budgetItemName"
              label={isDebt ? "Debt Item" : "Budget Item"}
              value={budgetItem.name || ""}
              onChange={() => {}}
              disabled
            />
          </div>

          {isDebt && (
            <div className="form-group">
              <TextField
                id="currentBalance"
                label="Current Outstanding Balance"
                value={`£${currentBalance.toFixed(2)}`}
                onChange={() => {}}
                disabled
              />
            </div>
          )}

          <div className="form-group">
            <TextField
              id="txName"
              label="Payee / Description"
              value={txName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTxName(e.target.value)
              }
              placeholder={
                isDebt ? "e.g. Monthly payment" : "e.g. Tesco, Rent payment"
              }
              autoFocus={!isDebt}
            />
          </div>
          <div className="form-group">
            <TextField
              id="txAmount"
              label="Amount (£)"
              type="number"
              step="0.01"
              value={txAmount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTxAmount(e.target.value)
              }
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

export default AddTransactionModal;
