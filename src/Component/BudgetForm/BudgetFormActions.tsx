import type { MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export interface BudgetFormActionsProps {
  onAddGroupClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
}

const BudgetFormActions = ({ onAddGroupClick }: BudgetFormActionsProps) => {
  return (
    <div className="form-actions">
      <Button
        className="form-control form-actions__Button"
        variation="transparent"
        onClickHandler={onAddGroupClick}
      >
        <FontAwesomeIcon icon={faPlus} /> Add New Group
      </Button>
    </div>
  );
};

export default BudgetFormActions;
