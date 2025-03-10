import React, { useEffect, useState } from "react";
import { Hero, BudgetForm, BudgetGroup } from "../../Component";
import "./styles/Budget.css";
import {
  generateUniqueId,
  formatBudgetItemAmount,
  getFullYear,
} from "../../utils/utils";
import { TYPE } from "../../utils/constants";

export const incomeData = {
  name: "Income",
  columns: [{ name: "Planned" }, { name: "Received" }],
  budgetGroupItems: [
    {
      id: generateUniqueId(),
      fields: [
        {
          label: "Income name",
          value: "",
          placeholder: "Enter name",
          name: "nameIncome",
          type: "text",
        },
        {
          label: "Planned",
          value: formatBudgetItemAmount(0),
          name: "plannedIncome",
          placeholder: formatBudgetItemAmount(0),
          type: "text",
        },
        {
          label: "Received",
          value: formatBudgetItemAmount(0),
          name: "receivedIncome",
          placeholder: formatBudgetItemAmount(0),
          type: "text",
        },
      ],
      type: "income",
    },
  ],
};
export const GivingData = {
  name: "Giving",
  columns: [{ name: "Planned" }, { name: "Remaining" }],
  budgetGroupItems: [
    {
      id: generateUniqueId(),
      fields: [
        {
          label: "Charity",
          value: "",
          placeholder: "Enter name",
          name: "nameIncome",
          type: "text",
        },
        {
          label: "Planned",
          value: formatBudgetItemAmount(0),
          name: "plannedIncome",
          placeholder: formatBudgetItemAmount(0),
          type: "text",
        },
      ],
      status: [
        {
          label: "Remaining",
          value: "0.00",
          type: "text",
        },
      ],
      type: "expense",
    },
    {
      id: generateUniqueId(),
      fields: [
        {
          label: "Offering",
          value: "",
          placeholder: "Enter name",
          name: "nametithes",
          type: "text",
        },
        {
          label: "Planned",
          value: formatBudgetItemAmount(0),
          name: "plannedIncome",
          placeholder: formatBudgetItemAmount(0),
          type: "text",
        },
      ],
      status: [
        {
          label: "Remaining",
          value: formatBudgetItemAmount(0),
          type: "text",
        },
      ],
      type: "expense",
    },
    {
      id: generateUniqueId(),
      fields: [
        {
          label: "Tithes",
          value: "",
          placeholder: "Enter name",
          name: "nametithes",
          type: "text",
        },
        {
          label: "Planned",
          value: formatBudgetItemAmount(0),
          name: "plannedTithes",
          placeholder: formatBudgetItemAmount(0),
          type: "text",
        },
      ],
      status: [
        {
          label: "Remaining",
          value: formatBudgetItemAmount(0),
          type: "text",
        },
      ],
      type: "expense",
    },
  ],
};

function Budget() {
  const [income, setIncome] = useState({
    planned: formatBudgetItemAmount(0),
    received: formatBudgetItemAmount(0),
  });
  const [plannedIncome, setPlannedIncome] = useState(0);
  const [receivedIncome, setReceivedIncome] = useState(0);

  const [fullyear, setFullYear] = useState(getFullYear());

  const [budgetGroups, setBudgetGroups] = useState([
    { ...incomeData },
    { ...GivingData },
  ]);

  const [budgetTotal, setBudgetTotal] = useState(0);

  const handleFieldChange = (groupIndex, itemIndex, fieldIndex, value) => {
    // console.log("handleFieldChange =>", value);
    // console.log("groupIndex", groupIndex);
    // console.log("itemIndex", itemIndex);
    // console.log("fieldIndex", fieldIndex);
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

  const handleZeroBudgetCalulation = (
    totalArg,
    group,
    groupIndex,
    itemIndex,
    fieldIndex,
    value
  ) => {
    if (group.name.toLowerCase() !== "income") {
      setBudgetTotal((prevTotal) => prevTotal - parseFloat(value));
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

  // Calculate budgetTotal income
  const calculateTotalIncomeByType = (groups, type = "planned") => {
    const incomeGroup = groups.find((group) => group.name === "Income");
    if (!incomeGroup) return 0;

    return incomeGroup.budgetGroupItems.reduce((total, item) => {
      return (
        total +
        item.fields.reduce((sum, field) => {
          return (
            sum +
            parseFloat(
              field.label.toLowerCase() === type.toLowerCase() ? field.value : 0
            )
          );
        }, 0)
      );
    }, 0);
  };

  useEffect(() => {
    const tPlannedIncome = calculateTotalIncomeByType(
      budgetGroups,
      TYPE.planned
    );
    setPlannedIncome(tPlannedIncome);
    const tReceivedIncome = calculateTotalIncomeByType(
      budgetGroups,
      TYPE.received
    );
    setReceivedIncome(tReceivedIncome);
    const tIncome = tReceivedIncome ? tReceivedIncome : tPlannedIncome;
    setBudgetTotal(tIncome);
  }, [budgetGroups]);

  return (
    <section>
      <Hero
        month={fullyear}
        income={formatBudgetItemAmount(budgetTotal)}
        planned={formatBudgetItemAmount(plannedIncome)}
        received={formatBudgetItemAmount(receivedIncome)}
      />
      <BudgetForm className="form">
        {budgetGroups.map((group, groupIndex) => (
          <BudgetGroup
            key={group.name}
            budgetGroup={group}
            onChangeHandler={(itemIndex, fieldIndex, value) =>
              handleFieldChange(groupIndex, itemIndex, fieldIndex, value)
            }
            onBlurHandler={(itemIndex, fieldIndex, value) =>
              handleZeroBudgetCalulation(
                budgetTotal,
                group,
                groupIndex,
                itemIndex,
                fieldIndex,
                value
              )
            }
          />
        ))}
      </BudgetForm>
    </section>
  );
}

export default Budget;
