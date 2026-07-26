import type { ReactNode, MouseEvent } from "react";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export interface BudgetGroupActionsProps {
  onAddItemClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

const BudgetGroupActions = ({
  onAddItemClick,
  children,
}: BudgetGroupActionsProps) => {
  return (
    <div className="group-actions">
      {children || (
        <Button
          className="form-control group-actions__Button"
          variation="transparent"
          onClickHandler={onAddItemClick}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Item
        </Button>
      )}
    </div>
  );
};

export default BudgetGroupActions;
