const generateRandomId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// months
const monthsJson = [{
  id: generateRandomId(),
  monthID: 1,
  name: 'January',
  abbr: 'Jan',
}, {
  id: generateRandomId(),
  monthID: 2,
  name: 'February',
  abbr: 'Feb',
}, {
  id: generateRandomId(),
  monthID: 3,
  name: 'March',
  abbr: 'Mar',
}, {
  id: generateRandomId(),
  monthID: 4,
  name: 'April',
  abbr: 'Apr',
}, {
  id: generateRandomId(),
  monthID: 5,
  name: 'May',
  abbr: 'May',
}, {
  id: generateRandomId(),
  monthID: 6,
  name: 'June',
  abbr: 'Jun',
}, {
  id: generateRandomId(),
  monthID: 7,
  name: 'July',
  abbr: 'Jul',
}, {
  id: generateRandomId(),
  monthID: 8,
  name: 'August',
  abbr: 'Aug',
}, {
  id: generateRandomId(),
  monthID: 9,
  name: 'September',
  abbr: 'Sep',
}, {
  id: generateRandomId(),
  monthID: 10,
  name: 'October',
  abbr: 'Oct',
}, {
  id: generateRandomId(),
  monthID: 11,
  name: 'November',
  abbr: 'Nov',
}, {
  id: generateRandomId(),
  monthID: 12,
  name: 'December',
  abbr: 'Dec',
}]

// mock income data
const incomeJson = [
  {
    id: generateRandomId(),
    name: "Income",
    monthID: 1,
    year: 2023,
    items: [
      {
        itemID: generateRandomId(),
        name: "PayCheck",
        planned: "£2500.00",
        received: "£2500.00"
      },
      {
        itemID: generateRandomId(),
        name: "Bonus",
        planned: "£500.00",
        received: "£1000.00"
      }
    ]
  },
  {
    id: generateRandomId(),
    name: "Income",
    monthID: 1,
    year: 2024,
    items: [
      {
        itemID: generateRandomId(),
        name: "PayCheck",
        planned: "£2500.00",
        received: "£2500.00"
      },
    ]
  }
];

// mock category data
const categoryJson = [
  {
    id: generateRandomId(),
    name: "Giving",
    monthID: 1,
    year: 2024,
    items: [
      {
        itemID: generateRandomId(),
        name: "Charity",
        planned: "£150.00",
        spent: "£50.00"
      },
      {
        itemID: generateRandomId(),
        name: "Church",
        planned: "£200.00",
        spent: "£100.00"
      }
    ]
  },
  {
    id: generateRandomId(),
    name: "Housing",
    monthID: 1,
    year: 2024,
    items: [
      {
        itemID: generateRandomId(),
        name: "Electricity",
        planned: "£158.00",
        spent: "£0.00",
        currency: "GBP"
      },
      {
        itemID: generateRandomId(),
        name: "Gas",
        planned: "£158.00",
        spent: "£300.00",
        currency: "GBP"
      }
    ]
  },
  {
    id: generateRandomId(),
    name: "Food",
    monthID: 1,
    year: 2024,
    items: [
      {
        itemID: generateRandomId(),
        name: "Groceries",
        planned: "£400.00",
        spent: "£100.00",
        currency: "GBP"
      }
    ]
  },
  {
    itemID: generateRandomId(),
    name: "Transportation",
    monthID: 1,
    items: []
  },
  {
    id: generateRandomId(),
    name: "Giving",
    monthID: 2,
    year: 2024,
    items: [
      {
        itemID: generateRandomId(),
        name: "Charity",
        planned: "£150.00",
        spent: "£50.00"
      },
      {
        itemID: generateRandomId(),
        name: "Church",
        planned: "£200.00",
        spent: "£100.00"
      }
    ]
  },
  {
    id: generateRandomId(),
    name: "Housing",
    monthID: 2,
    year: 2024,
    items: [
      {
        itemID: generateRandomId(),
        name: "Electricity",
        planned: "£158.00",
        spent: "£0.00",
        currency: "GBP"
      },
      {
        itemID: generateRandomId(),
        name: "Gas",
        planned: "£158.00",
        spent: "£300.00",
        currency: "GBP"
      }
    ]
  },
  {
    id: generateRandomId(),
    name: "Food",
    monthID: 3,
    year: 2024,
    items: [
      {
        itemID: generateRandomId(),
        name: "Groceries",
        planned: "£400.00",
        spent: "£100.00",
        currency: "GBP"
      }
    ]
  },
  {
    itemID: generateRandomId(),
    name: "Transportation",
    monthID: 3,
    year: 2024,
    items: []
  }
];