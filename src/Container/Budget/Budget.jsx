import React, { useEffect, useState } from "react";
import {
  Hero,
  BudgetForm,
  BudgetGroup,
  Button,
  TextField,
} from "../../Component";
import "./Budget.css";
import { generateUniqueId } from "../../utils/utils";

function Budget() {
  const getFullYear = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const [income, setIncome] = useState(formatBudgetItemAmount(0));
  const [receivedIncome, setReceivedIncome] = useState(
    formatBudgetItemAmount(0)
  );
  const [progress, setProgress] = useState(0);
  const [fullyear, setFullYear] = useState(getFullYear());

  const onIncomeChange = (e) => {
    const value = parseFloat(e.target.value);
    setIncome(formatBudgetItemAmount(value));
  };

  const onReceivedIncomeChange = (e) => {
    const value = parseFloat(e.target.value);
    setReceivedIncome(formatBudgetItemAmount(value));
  };

  useEffect(() => {
    setIncome(formatBudgetItemAmount(income));
    setReceivedIncome(formatBudgetItemAmount(receivedIncome));
    setFullYear(getFullYear());
    setProgress(
      (formatBudgetItemAmount(receivedIncome) /
        formatBudgetItemAmount(income)) *
        100
    );
  }, [income, receivedIncome, fullyear]);

  function formatBudgetItemAmount(value) {
    if (isNaN(value)) {
      return parseFloat(0).toFixed(2);
    }
    return parseFloat(value).toFixed(2);
  }

  return (
    <section>
      <Hero
        month={fullyear}
        income={income}
        planned={income}
        received={receivedIncome}
      />
      <BudgetForm className="form">
        <div className="group-container">
          <div className="group-header">
            <h3>Income</h3>
          </div>
          <div className="group-item group-item--hidden">
            <div className="group-item-fields">
              <TextField
                label="Income"
                id="primaryIncome"
                inputName="primary_income"
                onChange={onIncomeChange}
                defaultVal={income}
                placeholder={income}
              />
            </div>
            <div className="group-item-fields">
              <TextField
                label="Received"
                id="received_income"
                inputName="received_income"
                onChange={onReceivedIncomeChange}
                defaultVal={receivedIncome}
                placeholder={receivedIncome}
              />
            </div>
            <div className="group-item group-item-progress">
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${(receivedIncome / income) * 100}%` }}
                  aria-valuenow={(receivedIncome / income) * 100}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            <div className="group-item-action">
              <Button classModifier="secondary">Delete Item</Button>
            </div>
          </div>
        </div>

        <BudgetGroup
          budgetGroup={{
            name: "Giving",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Charity",
                type: "expense",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Savings",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Emergency Fund",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Housing",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Rent / Mortgage",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Utilities",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Gas",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Food",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Groceries",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Transport",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "TFL",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Insurance",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Life",
                type: "fund",
              },
            ],
          }}
        />
      </BudgetForm>
    </section>
  );
}

export default Budget;
