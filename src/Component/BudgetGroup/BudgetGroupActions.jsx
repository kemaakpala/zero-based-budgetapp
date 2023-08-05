import Button from "../Button/Button";

const BudgetGroupActions = ({ budgetGroup, budgetGroupIndex, budgetGroupTotal }) => {
  return (
    <div className="group-actions">
      <Button className="form-control group-actions__Button">
        Add New Group Item
      </Button>
      <Button classModifier="secondary">Delete Group</Button>
    </div>
  );
};

export default BudgetGroupActions;