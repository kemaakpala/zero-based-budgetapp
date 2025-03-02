import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const BudgetGroupActions = ({
  budgetGroup,
  budgetGroupIndex,
  budgetGroupTotal,
}) => {
  return (
    <div className="group-actions">
      <Button className="form-control group-actions__Button">
        Add New Group Item
      </Button>
      <Button classModifier="secondary">
        <FontAwesomeIcon
          icon={faTrashCan}
          size="1x"
          title="delete budget group item"
        />
      </Button>
    </div>
  );
};

export default BudgetGroupActions;
