
import defaultCalculator from "./budgetCycle";

export const generateUniqueId = () =>
  Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const removeSpace = (str) => str.replace(/\s+/g, '')

export const formatBudgetItemAmount = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return parseFloat(0).toFixed(2);
  }
  return num.toFixed(2);
}

export const getFullYear = () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

/**
 * Calculates the payday for a given year and month index (0-11).
 * Payday is the 20th, or the preceding Friday if the 20th falls on a weekend.
 */
export const calculatePayday = (year, monthIndex) =>
  defaultCalculator.calculatePayday(year, monthIndex);

/**
 * Returns the budget cycle start and end dates for a month.
 * Starts on the month's payday and ends the day before next month's payday.
 */
export const getBudgetCycleRange = (year, monthIndex) =>
  defaultCalculator.getCycleRange(year, monthIndex);

/**
 * Formats a Date object as Month Day + Suffix, Year (e.g. June 19th, 2026).
 */
export const formatDate = (date) =>
  defaultCalculator.formatDate(date);

export const DEFAULT_BUDGET_GROUPS = [
  {
    name: "Housing",
    columns: [{ name: "Assigned" }, { name: "Remaining" }],
    budgetGroupItems: [
      {
        id: "h1",
        name: "Rent / Mortgage",
        assigned: 0,
        type: "expense"
      },
      {
        id: "h2",
        name: "Electricity",
        assigned: 0,
        type: "expense"
      },
      {
        id: "h3",
        name: "Water",
        assigned: 0,
        type: "expense"
      }
    ]
  },
  {
    name: "Food",
    columns: [{ name: "Assigned" }, { name: "Remaining" }],
    budgetGroupItems: [
      {
        id: "f1",
        name: "Groceries",
        assigned: 0,
        type: "expense"
      },
      {
        id: "f2",
        name: "Dining Out",
        assigned: 0,
        type: "expense"
      }
    ]
  },
  {
    name: "Giving",
    columns: [{ name: "Assigned" }, { name: "Remaining" }],
    budgetGroupItems: [
      {
        id: "g1",
        name: "Charity",
        assigned: 0,
        type: "expense"
      },
      {
        id: "g2",
        name: "Offering",
        assigned: 0,
        type: "expense"
      }
    ]
  },
  {
    name: "Transportation",
    columns: [{ name: "Assigned" }, { name: "Remaining" }],
    budgetGroupItems: [
      {
        id: "t1",
        name: "Fuel",
        assigned: 0,
        type: "expense"
      },
      {
        id: "t2",
        name: "Public Transit",
        assigned: 0,
        type: "expense"
      }
    ]
  }
];