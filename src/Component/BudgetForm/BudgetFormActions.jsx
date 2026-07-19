import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BudgetFormActions = ({ onAddGroupClick }) => {
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
