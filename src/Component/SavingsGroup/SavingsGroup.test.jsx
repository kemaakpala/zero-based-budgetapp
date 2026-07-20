import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SavingsGroup from "./SavingsGroup";

const noop = () => {};

const createSavingsGroup = (overrides = {}) => ({
  name: "Savings",
  isSavingsGroup: true,
  budgetGroupItems: [
    {
      id: "s1",
      name: "Emergency Fund",
      assigned: 200,
      type: "savings",
      goal: 1000,
      currentBalance: 400,
      toSave: 600,
    },
    ...(overrides.extraItems || []),
  ],
  ...overrides,
});

describe("SavingsGroup", () => {
  it("renders savings goals list with columns Assigned and To Save", () => {
    render(
      <SavingsGroup
        budgetGroup={createSavingsGroup()}
        onSaveField={noop}
        onRecordPaymentClick={noop}
        onViewPaymentsClick={noop}
        onEditSavingsClick={noop}
        onDeleteItemClick={noop}
        onAddSavingsClick={noop}
      />
    );

    // Header columns
    expect(screen.getByText("Assigned")).toBeInTheDocument();
    expect(screen.getByText("To Save")).toBeInTheDocument();

    // Goal Details
    expect(screen.getByText("Emergency Fund")).toBeInTheDocument();
    expect(screen.getByText("£600.00")).toBeInTheDocument();
  });

  it("renders progress bar with correct percentage width", () => {
    render(
      <SavingsGroup
        budgetGroup={createSavingsGroup()}
        onSaveField={noop}
        onRecordPaymentClick={noop}
        onViewPaymentsClick={noop}
        onEditSavingsClick={noop}
        onDeleteItemClick={noop}
        onAddSavingsClick={noop}
      />
    );

    const progressBar = screen.getByRole("progressbar");
    // Emergency Fund goal is 1000, currentBalance is 400, so progress is 40%
    expect(progressBar).toHaveStyle("width: 40%");
  });

  it("calls onAddSavingsClick when Add Savings Goal button is clicked", () => {
    const onAddSavingsClick = vi.fn();
    render(
      <SavingsGroup
        budgetGroup={createSavingsGroup()}
        onSaveField={noop}
        onRecordPaymentClick={noop}
        onViewPaymentsClick={noop}
        onEditSavingsClick={noop}
        onDeleteItemClick={noop}
        onAddSavingsClick={onAddSavingsClick}
      />
    );

    const addBtn = screen.getByText(/Add Savings Goal/i);
    fireEvent.click(addBtn);
    expect(onAddSavingsClick).toHaveBeenCalledTimes(1);
  });
});
