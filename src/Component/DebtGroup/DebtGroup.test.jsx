import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DebtGroup from "./DebtGroup";

const noop = () => {};

const createDebtGroup = (overrides = {}) => ({
  name: "Debt",
  isDebtGroup: true,
  budgetGroupItems: [
    {
      id: "d1",
      name: "Barclaycard",
      assigned: 150,
      type: "debt",
      outstandingBalance: 3200,
      minimumPayment: 85,
      debtType: "credit-card",
      spent: 150,
      isPaidOff: false,
    },
    {
      id: "d2",
      name: "Old Loan",
      assigned: 0,
      type: "debt",
      outstandingBalance: 0,
      minimumPayment: 0,
      debtType: "personal-loan",
      spent: 0,
      isPaidOff: true,
    },
    ...(overrides.extraItems || []),
  ],
  ...overrides,
});

describe("DebtGroup", () => {
  it("renders active debt items as a table with Balance and Planned columns, and Paid so far summary", () => {
    render(
      <DebtGroup
        budgetGroup={createDebtGroup()}
        onChangeHandler={noop}
        onRecordPaymentClick={noop}
        onViewPaymentsClick={noop}
        onEditDebtClick={noop}
        onDeleteItemClick={noop}
        onAddDebtClick={noop}
      />
    );

    // Header columns
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("Planned")).toBeInTheDocument();
    expect(screen.getByText("Paid so far")).toBeInTheDocument();

    // Active debt is visible
    expect(screen.getByText("Barclaycard")).toBeInTheDocument();
    expect(screen.getByText("£3200.00")).toBeInTheDocument();
    expect(screen.getByText("£150.00")).toBeInTheDocument();

    // Paid-off debt is hidden by default
    expect(screen.queryByText("Old Loan")).not.toBeInTheDocument();
  });

  it("shows paid-off items when toggle is clicked", () => {
    render(
      <DebtGroup
        budgetGroup={createDebtGroup()}
        onChangeHandler={noop}
        onRecordPaymentClick={noop}
        onViewPaymentsClick={noop}
        onEditDebtClick={noop}
        onDeleteItemClick={noop}
        onAddDebtClick={noop}
      />
    );

    // Toggle should show count
    const toggle = screen.getByText(/Show Paid Off/i);
    expect(toggle).toBeInTheDocument();
    expect(toggle.textContent).toContain("1");

    fireEvent.click(toggle);

    // Now paid-off item should be visible
    expect(screen.getByText("Old Loan")).toBeInTheDocument();
  });

  it("calls onAddDebtClick when Add Debt button is clicked", () => {
    const onAddDebtClick = vi.fn();
    render(
      <DebtGroup
        budgetGroup={createDebtGroup()}
        onChangeHandler={noop}
        onRecordPaymentClick={noop}
        onViewPaymentsClick={noop}
        onEditDebtClick={noop}
        onDeleteItemClick={noop}
        onAddDebtClick={onAddDebtClick}
      />
    );

    const addBtn = screen.getByText(/Add Debt/i);
    fireEvent.click(addBtn);
    expect(onAddDebtClick).toHaveBeenCalledTimes(1);
  });
});
