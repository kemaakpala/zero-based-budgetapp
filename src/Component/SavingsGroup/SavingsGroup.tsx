import type { MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import BudgetGroup from "../BudgetGroup/BudgetGroup";
import BudgetGroupItem from "../BudgetGroup/BudgetGroupItem";
import BudgetGroupActions from "../BudgetGroup/BudgetGroupActions";
import SavingsItemRow from "./SavingsItemRow";
import type {
  EnrichedBudgetGroup,
  EnrichedBudgetItem,
} from "../../utils/budgetStore/types";
import "./styles/SavingsGroup.css";

export interface SavingsGroupProps {
  budgetGroup:
    | EnrichedBudgetGroup
    | { name: string; budgetGroupItems: EnrichedBudgetItem[] };
  onSaveField: (id: string, fieldName: string, value: string | number) => void;
  onRecordPaymentClick: (item: EnrichedBudgetItem) => void;
  onViewPaymentsClick: (item: EnrichedBudgetItem) => void;
  onEditSavingsClick: (item: EnrichedBudgetItem) => void;
  onDeleteItemClick: (id: string) => void;
  onAddSavingsClick: (e?: MouseEvent<HTMLButtonElement>) => void;
}

const SavingsGroup = ({
  budgetGroup,
  onSaveField,
  onRecordPaymentClick,
  onViewPaymentsClick,
  onEditSavingsClick,
  onDeleteItemClick,
  onAddSavingsClick,
}: SavingsGroupProps) => {
  const { name, budgetGroupItems = [] } = budgetGroup;
  const columns = [{ name: "Assigned" }, { name: "To Save" }];

  return (
    <BudgetGroup
      name={name}
      columns={columns}
      className="savings-group-container"
      headerActions={null}
      footerActions={
        <BudgetGroupActions>
          <div className="debt-footer-left">
            <Button
              className="form-control group-actions__Button"
              variation="transparent"
              onClickHandler={onAddSavingsClick}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Savings Goal
            </Button>
          </div>
        </BudgetGroupActions>
      }
    >
      <BudgetGroupItem>
        {budgetGroupItems.map((item) => (
          <SavingsItemRow
            key={item.id}
            item={item}
            onSaveField={onSaveField}
            onRecordPaymentClick={onRecordPaymentClick}
            onViewPaymentsClick={onViewPaymentsClick}
            onEditSavingsClick={onEditSavingsClick}
            onDeleteItemClick={onDeleteItemClick}
          />
        ))}
      </BudgetGroupItem>
    </BudgetGroup>
  );
};

export default SavingsGroup;
