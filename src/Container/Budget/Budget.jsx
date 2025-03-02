import React, { useEffect, useState } from "react";
import {
  Hero,
  BudgetForm,
  BudgetGroup,
  Button,
  TextField,
} from "../../Component";
import "./Budget.css";
import { generateUniqueId, formatBudgetItemAmount } from "../../utils/utils";
import ProgressBar from "../../Component/ProgressBar";

function Budget() {
  const getFullYear = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const [income, setIncome] = useState({
    planned: formatBudgetItemAmount(0),
    received: formatBudgetItemAmount(0),
  });

  const [progress, setProgress] = useState(0);
  const [fullyear, setFullYear] = useState(getFullYear());

  const onIncomeChange = (e) => {
    const value = parseFloat(e.target.value);
    setIncome({
      ...income,
      [e.target.name]: formatBudgetItemAmount(value),
    });
  };

  // This useEffect hook updates the fullyear state
  useEffect(() => {
    setFullYear(getFullYear());
  }, [fullyear]);

  // This useEffect hook updates the income state
  useEffect(() => {
    const { planned, received } = income;
    const formattedPlanned = formatBudgetItemAmount(planned);
    const formattedReceived = formatBudgetItemAmount(received);
    if (planned !== formattedPlanned || received !== formattedReceived) {
      setIncome({
        planned: formattedPlanned,
        received: formattedReceived,
      });
    }
  }, [income]);

  // This useEffect hook updates the progress state whenever the income state changes
  useEffect(() => {
    const { planned, received } = income;
    if (planned && received) {
      setProgress((received / planned) * 100);
    }
  }, [income]);

  return (
    <section>
      <Hero
        month={fullyear}
        income={income.planned}
        planned={income.planned}
        received={income.received}
      />
      <BudgetForm className="form">
        <div className="group-container">
          <div className="group-header">
            <h3>Income</h3>
          </div>
          <div className="group-item group-item--hidden">
            <div className="group-item-fields">
              <TextField
                label="Planned"
                id="planned"
                inputName="planned"
                onChange={onIncomeChange}
                defaultVal={income.planned}
                placeholder={income.planned}
              />
            </div>
            <div className="group-item-fields">
              <TextField
                label="Received"
                id="received"
                inputName="received"
                onChange={onIncomeChange}
                defaultVal={income.received}
                placeholder={income.received}
              />
            </div>
            <ProgressBar percentage={progress} />
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
