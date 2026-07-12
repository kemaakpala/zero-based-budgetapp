import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BudgetGroupActions = ({ onAddItemClick, children }) => {
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
