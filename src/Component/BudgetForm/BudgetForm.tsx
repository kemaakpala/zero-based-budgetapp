import type { ReactNode, FormEvent, MouseEvent } from "react";
import BudgetFormActions from "./BudgetFormActions";

export interface BudgetFormProps {
  children?: ReactNode;
  onAddGroupClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
}

const BudgetForm = ({ children, onAddGroupClick }: BudgetFormProps) => (
  <form
    className="form"
    onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
  >
    {children}
    <BudgetFormActions onAddGroupClick={onAddGroupClick} />
  </form>
);

export default BudgetForm;
