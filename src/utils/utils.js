export const generateUniqueId = () =>
  Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const removeSpace = (str) => str.replace(/\s+/g, "");

export const formatBudgetItemAmount = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return parseFloat(0).toFixed(2);
  }
  return num.toFixed(2);
};

export const getFullYear = () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

export const DEFAULT_BUDGET_GROUPS = [
  {
    name: "Housing",
    budgetGroupItems: [
      {
        id: "h1",
        name: "Rent / Mortgage",
        assigned: 0,
        type: "expense",
      },
      {
        id: "h2",
        name: "Electricity",
        assigned: 0,
        type: "expense",
      },
      {
        id: "h3",
        name: "Water",
        assigned: 0,
        type: "expense",
      },
    ],
  },
  {
    name: "Food",
    budgetGroupItems: [
      {
        id: "f1",
        name: "Groceries",
        assigned: 0,
        type: "expense",
      },
      {
        id: "f2",
        name: "Dining Out",
        assigned: 0,
        type: "expense",
      },
    ],
  },
  {
    name: "Giving",
    budgetGroupItems: [
      {
        id: "g1",
        name: "Charity",
        assigned: 0,
        type: "expense",
      },
      {
        id: "g2",
        name: "Offering",
        assigned: 0,
        type: "expense",
      },
    ],
  },
  {
    name: "Transportation",
    budgetGroupItems: [
      {
        id: "t1",
        name: "Fuel",
        assigned: 0,
        type: "expense",
      },
      {
        id: "t2",
        name: "Public Transit",
        assigned: 0,
        type: "expense",
      },
    ],
  },
];
