import Button from "../Button/Button";
const BudgetFormActions = () => {
  return (
    <div className="form-actions">
      <Button className="form-control form-actions__Button">
        Add New Group
      </Button>
      <Button classNam="form-control form-actions__Button">
        Submit Budget
      </Button>
    </div>
  );
}

export default BudgetFormActions;