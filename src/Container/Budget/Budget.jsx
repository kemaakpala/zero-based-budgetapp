import { Hero, BudgetForm, BudgetGroup, Button, TextField } from "../../Component";
import "./Budget.css";

function Budget() {
  const getFullYear = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
  const monthYear = getFullYear();
  const income = 5000.0;
  const planned = 0.0;
  const received = 0.0;
  // const totalSpent = 0.0;

  const generateUniqueId = () => Array.from(window.crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("");
  
  return (
    <section>
      <Hero month={monthYear} income={income} planned={planned} received={received} />
      <BudgetForm className="form">
        <div className="group-container">
          <div className="group-header">
            <h3>Income</h3>
          </div>
          <div className="group-item group-item--hidden">
            <div className="group-item-fields">
              <TextField
                id="primaryIncome"
                label="Salary 1"
                inputName="primary_income"
              />
            </div>
            <div className="group-item-status">
              <h4 className="group-item-status__header">Planned</h4>
              <p className="group-item-status__text">£0.00</p>
            </div>
            <div className="group-item-status">
              <h4 className="group-item-status__header">Remaining</h4>
              <p className="group-item-status__text">£0.00</p>
            </div>
            <div className="group-item-action">
              <Button classModifier="secondary">Delete Item</Button>
            </div>
          </div>
          <div className="group-item">
            <div className="group-item-fields">
              <TextField
                id="secondaryIncome"
                label="Salary 2"
                inputName="secondary_income"
                variant="secondary"
              />
            </div>
            <div className="group-item-status">
              <h4 className="group-item-status__header">Planned</h4>
              <p className="group-item-status__text">£0.00</p>
            </div>
            <div className="group-item-status">
              <h4 className="group-item-status__header">Remaining</h4>
              <p className="group-item-status__text">£0.00</p>
            </div>
            <div className="group-item-action">
              <Button classModifier="secondary">Delete Item</Button>
            </div>
          </div>
        </div>
        
        <BudgetGroup
          budgetGroup={{ name: "Giving", budgetGroupItem: [{
            id: generateUniqueId(),
            label: "Charity"
          }] }}
        />
        <BudgetGroup
          budgetGroup={{ name: "Savings", budgetGroupItem: [{
            id: generateUniqueId(),
            label: "Emergency Fund"
          }] }}      
        />
        <BudgetGroup
          budgetGroup={{ name: "Housing", budgetGroupItem: [{
            id: generateUniqueId(),
            label: "Rent / Mortgage"
          }] }}
        />
        <BudgetGroup
          budgetGroup={{ name: "Utilities", budgetGroupItem: [{
            id: generateUniqueId(),
            label: "Gas"
          }] }}
        />
        <BudgetGroup
          budgetGroup={{ name: "Food", budgetGroupItem: [{
            id: generateUniqueId(),
            label: "Groceries"
          }] }}
        />
        <BudgetGroup
          budgetGroup={{ name: "Transport", budgetGroupItem: [{
            id: generateUniqueId(),
            label: "TFL"
          }] }}
        />
        <BudgetGroup
          budgetGroup={{ name: "Insurance", budgetGroupItem: [{
            id: generateUniqueId(),
            label: "Life"
          }] }}
        />
      </BudgetForm>
    </section>
  );
}

export default Budget;
