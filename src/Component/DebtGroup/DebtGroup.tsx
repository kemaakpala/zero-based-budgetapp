import { useState } from "react";
import type { MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import BudgetGroup from "../BudgetGroup/BudgetGroup";
import BudgetGroupItem from "../BudgetGroup/BudgetGroupItem";
import BudgetGroupActions from "../BudgetGroup/BudgetGroupActions";
import DebtItemRow from "./DebtItemRow";
import type {
  EnrichedBudgetGroup,
  EnrichedBudgetItem,
} from "../../utils/budgetStore/types";
import "./styles/DebtGroup.css";

export interface DebtGroupProps {
  budgetGroup:
    | EnrichedBudgetGroup
    | { name: string; budgetGroupItems: EnrichedBudgetItem[] };
  onSaveField: (id: string, fieldName: string, value: string | number) => void;
  onRecordPaymentClick: (item: EnrichedBudgetItem) => void;
  onViewPaymentsClick: (item: EnrichedBudgetItem) => void;
  onEditDebtClick: (item: EnrichedBudgetItem) => void;
  onDeleteItemClick: (id: string) => void;
  onAddDebtClick: (e?: MouseEvent<HTMLButtonElement>) => void;
}

const DebtGroup = ({
  budgetGroup,
  onSaveField,
  onRecordPaymentClick,
  onViewPaymentsClick,
  onEditDebtClick,
  onDeleteItemClick,
  onAddDebtClick,
}: DebtGroupProps) => {
  const { name, budgetGroupItems = [] } = budgetGroup;
  const columns = [
    { name: "Balance" },
    { name: "Planned" },
    { name: "Paid so far" },
  ];
  const [showPaidOff, setShowPaidOff] = useState(false);

  const activeItems = budgetGroupItems.filter((item) => !item.isPaidOff);
  const paidOffItems = budgetGroupItems.filter((item) => item.isPaidOff);

  const visibleItems = showPaidOff
    ? [...activeItems, ...paidOffItems]
    : activeItems;

  return (
    <BudgetGroup
      name={name}
      columns={columns}
      className="debt-group-container"
      headerActions={null}
      footerActions={
        <BudgetGroupActions>
          <div className="debt-footer-left">
            <Button
              className="form-control group-actions__Button"
              variation="transparent"
              onClickHandler={onAddDebtClick}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Debt
            </Button>
          </div>

          <div className="debt-footer-right">
            {paidOffItems.length > 0 && (
              <button
                type="button"
                className="btn-toggle-paid-off"
                onClick={() => setShowPaidOff((prev) => !prev)}
              >
                {showPaidOff ? "Hide" : "Show"} Paid Off ({paidOffItems.length})
              </button>
            )}
          </div>
        </BudgetGroupActions>
      }
    >
      <BudgetGroupItem>
        {visibleItems.map((item) => (
          <DebtItemRow
            key={item.id}
            item={item}
            onSaveField={onSaveField}
            onRecordPaymentClick={onRecordPaymentClick}
            onViewPaymentsClick={onViewPaymentsClick}
            onEditDebtClick={onEditDebtClick}
            onDeleteItemClick={onDeleteItemClick}
          />
        ))}
      </BudgetGroupItem>
    </BudgetGroup>
  );
};

export default DebtGroup;
