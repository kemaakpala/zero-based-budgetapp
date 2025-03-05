import React, { useEffect, useState } from "react";
import { Hero, BudgetForm, BudgetGroup } from "../../Component";
import "./styles/Budget.css";
import {
  generateUniqueId,
  formatBudgetItemAmount,
  getFullYear,
} from "../../utils/utils";

function Budget() {
  const [income, setIncome] = useState({
    planned: formatBudgetItemAmount(0),
    received: formatBudgetItemAmount(0),
  });

  const [progress, setProgress] = useState(0);
  const [fullyear, setFullYear] = useState(getFullYear());

  const [budgetGroups, setBudgetGroups] = useState([
    {
      name: "Income",
      budgetGroupItems: [
        {
          id: generateUniqueId(),
          fields: [
            {
              label: "Planned",
              value: income.planned,
              placeholder: income.planned,
              type: "text",
            },
            {
              label: "Received",
              value: income.received,
              placeholder: income.received,
              type: "text",
            },
          ],
          action: { label: "Delete", color: "red", type: "button" },
          type: "income",
        },
      ],
    },
    {
      name: "Giving",
      budgetGroupItems: [
        {
          id: generateUniqueId(),
          fields: [
            {
              label: "Charity",
              value: "0.00",
              type: "text",
            },
          ],
          status: [
            {
              label: "Planned",
              value: "0.00",
              type: "text",
            },
            {
              label: "Remaining",
              value: "0.00",
              type: "text",
            },
          ],
          action: { label: "Delete", color: "red", type: "button" },
          type: "expense",
        },
        {
          id: generateUniqueId(),
          fields: [
            {
              label: "Offering",
              value: "0.00",
              type: "text",
            },
          ],
          status: [
            {
              label: "Planned",
              value: "0.00",
              type: "text",
            },
            {
              label: "Remaining",
              value: "0.00",
              type: "text",
            },
          ],
          action: { label: "Delete", color: "red", type: "button" },
          type: "expense",
        },
        {
          id: generateUniqueId(),
          fields: [
            {
              label: "Tithes",
              value: "0.00",
              type: "text",
            },
          ],
          status: [
            {
              label: "Planned",
              value: "0.00",
              type: "text",
            },
            {
              label: "Remaining",
              value: "0.00",
              type: "text",
            },
          ],
          action: { label: "Delete", color: "red", type: "button" },
          type: "expense",
        },
      ],
    },
  ]);

  const handleFieldChange = (groupIndex, itemIndex, fieldIndex, value) => {
    console.log("handleFieldChange =>", value);
    console.log("groupIndex", groupIndex);
    console.log("itemIndex", itemIndex);
    console.log("fieldIndex", fieldIndex);
    // Validate indices
    if (
      groupIndex < 0 ||
      groupIndex >= budgetGroups.length ||
      itemIndex < 0 ||
      itemIndex >= budgetGroups[groupIndex].budgetGroupItems.length ||
      fieldIndex < 0 ||
      fieldIndex >=
        budgetGroups[groupIndex].budgetGroupItems[itemIndex].fields.length
    ) {
      console.error("Invalid indices for handleFieldChange");
      return;
    }
    // Update budgetGroups state
    const updatedGroups = [...budgetGroups];
    updatedGroups[groupIndex].budgetGroupItems[itemIndex].fields[
      fieldIndex
    ].value = formatBudgetItemAmount(value);
    setBudgetGroups(updatedGroups);
    // Update income state if the group is "Income"
    if (budgetGroups[groupIndex].name === "Income") {
      setIncome({
        ...income,
        [updatedGroups[groupIndex].budgetGroupItems[itemIndex].fields[
          fieldIndex
        ].label.toLowerCase()]: formatBudgetItemAmount(value),
      });
    }
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
    console.log("useEffect[income] =>", income);
    console.log(
      "useEffect[planned && received] => ",
      income.planned > 0 && income.received > 0
    );
    const { planned, received } = income;
    if (planned > 0 && received > 0) {
      setProgress((received / planned) * 100);
    } else {
      setProgress(0);
    }
  }, [income]);

    // Calculate progress for each budget group
    const calculateProgress = (group) => {
      if (group.name === "Income") {
        const { planned, received } = income;
        if (planned > 0 && received > 0) {
          return (received / planned) * 100;
        }
        return 0;
      }
      // Add other group-specific progress calculations if needed
      return 0;
    };

  console.log("progress => ", progress);
  return (
    <section>
      <Hero
        month={fullyear}
        income={income.planned}
        planned={income.planned}
        received={income.received}
      />
      <BudgetForm className="form">
        {budgetGroups.map((group, groupIndex) => (
          <BudgetGroup
            key={group.name}
            budgetGroup={group}
            progress={calculateProgress(group)} // Pass progress for Income group, 0 for others
            onChangeHandler={(itemIndex, fieldIndex, value) =>
              handleFieldChange(groupIndex, itemIndex, fieldIndex, value)
            }
          />
        ))}
      </BudgetForm>
    </section>
  );
}

export default Budget;
