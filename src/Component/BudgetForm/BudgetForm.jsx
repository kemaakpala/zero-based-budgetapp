import BudgetFormActions from "./BudgetFormActions";

const BudgetForm = ({ children }) => (
  <form className="form">
    {children}
    <BudgetFormActions />
  </form>
);

export default BudgetForm;
