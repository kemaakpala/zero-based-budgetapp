import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BudgetGroupActions = ({
  budgetGroup,
  budgetGroupIndex,
  budgetGroupTotal,
}) => {
  return (
    <div className="group-actions">
      <Button
        className="form-control group-actions__Button"
        variation="transparent"
      >
        <FontAwesomeIcon icon={faPlus} /> Add Item
      </Button>
    </div>
  );
};

export default BudgetGroupActions;
