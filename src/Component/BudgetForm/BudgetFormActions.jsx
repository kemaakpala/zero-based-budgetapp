import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button/Button";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
const BudgetFormActions = () => {
  return (
    <div className="form-actions">
      <Button
        className="form-control form-actions__Button"
        variation="transparent"
      >
        <FontAwesomeIcon icon={faPlus} /> Add New Group
      </Button>
      <Button
        classNam="form-control form-actions__Button"
        variation={"transparent"}
      >
        <FontAwesomeIcon icon={faSave} /> Submit Budget
      </Button>
    </div>
  );
};

export default BudgetFormActions;
