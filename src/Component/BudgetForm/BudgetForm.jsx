import BudgetFormActions from "./BudgetFormActions";

const BudgetForm = ({ children, onAddGroupClick }) => (
  <form className="form" onSubmit={(e) => e.preventDefault()}>
    {children}
    <BudgetFormActions onAddGroupClick={onAddGroupClick} />
  </form>
);

export default BudgetForm;
