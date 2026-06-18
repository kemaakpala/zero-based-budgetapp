import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button/Button";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
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
      <Button
        className="form-control form-actions__Button"
        variation={"transparent"}
        onClickHandler={(e) => {
          e.preventDefault();
          alert("Budget saved successfully!");
        }}
      >
        <FontAwesomeIcon icon={faSave} /> Submit Budget
      </Button>
    </div>
  );
};

export default BudgetFormActions;
