
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
export const calculatePayday = (year, monthIndex) => {
  const date = new Date(year, monthIndex, 20);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 0) {
    // Sunday -> Friday 18th
    return new Date(year, monthIndex, 18);
  } else if (dayOfWeek === 6) {
    // Saturday -> Friday 19th
    return new Date(year, monthIndex, 19);
  }
  return date;
};

/**
 * Returns the budget cycle start and end dates for a month.
 * Starts on the month's payday and ends the day before next month's payday.
 */
export const getBudgetCycleRange = (year, monthIndex) => {
  const start = calculatePayday(year, monthIndex);
  
  // Next month calculation
  let nextMonthIndex = monthIndex + 1;
  let nextYear = year;
  if (nextMonthIndex > 11) {
    nextMonthIndex = 0;
    nextYear += 1;
  }
  const nextPayday = calculatePayday(nextYear, nextMonthIndex);
  const end = new Date(nextPayday.getTime() - 24 * 60 * 60 * 1000);
  
  return { start, end };
};

/**
 * Formats a Date object as Month Day + Suffix, Year (e.g. June 19th, 2026).
 */
export const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";
  
  return `${month} ${day}${suffix}, ${year}`;
};

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