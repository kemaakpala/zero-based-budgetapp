import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "./Settings";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Settings Onboarding Wizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("walks through the 3-step setup wizard and saves config (no debts path)", () => {
    render(<Settings />);

    // STEP 1: Starting Salary
    expect(
      screen.getByText("Set Your Starting Monthly Income")
    ).toBeInTheDocument();

    // Check input displays default value of 5000
    const salaryInput = screen.getByPlaceholderText("0.00");
    expect(salaryInput.value).toBe("5000");

    // Change input value to 3500
    fireEvent.change(salaryInput, { target: { value: "3500" } });
    expect(salaryInput.value).toBe("3500");

    // Change payday settings: Day = 25, Weekend Strategy = "following-monday"
    const paydaySelect = screen.getByLabelText("Monthly Payday Day");
    fireEvent.change(paydaySelect, { target: { value: "25" } });
    expect(paydaySelect.value).toBe("25");

    const weekendSelect = screen.getByLabelText("Weekend Payday Behavior");
    fireEvent.change(weekendSelect, { target: { value: "following-monday" } });
    expect(weekendSelect.value).toBe("following-monday");

    // Click "Next" to go to Step 2
    const nextBtn1 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn1);

    // STEP 2: Categories
    expect(screen.getByText("Customize Budget Categories")).toBeInTheDocument();

    // Check default groups are rendered (e.g. Housing)
    expect(screen.getByDisplayValue("Housing")).toBeInTheDocument();

    // Add a new custom group
    const groupInput = screen.getByPlaceholderText(/New Group/i);
    fireEvent.change(groupInput, { target: { value: "Subscriptions" } });

    const addGroupBtn = screen.getByRole("button", { name: /Add Group/i });
    fireEvent.click(addGroupBtn);

    // Verify custom group is added
    expect(screen.getByDisplayValue("Subscriptions")).toBeInTheDocument();

    // Click "Next" to go to Debt Question
    const nextBtn2 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn2);

    // DEBT QUESTION GATE
    expect(screen.getByText("Do You Have Any Debts?")).toBeInTheDocument();

    // Click "No" to skip debts
    const noDebtsBtn = screen.getByRole("button", {
      name: /No, skip this step/i,
    });
    fireEvent.click(noDebtsBtn);

    // CONFIRM STEP (step 3 in the no-debts flow)
    expect(screen.getByText("Confirm Your Budget Setup")).toBeInTheDocument();
    expect(screen.getByText("£3500.00")).toBeInTheDocument();
    expect(screen.getByText("5 groups")).toBeInTheDocument(); // 4 defaults + 1 custom
    expect(screen.getByText("25th of the month")).toBeInTheDocument();
    expect(screen.getByText("Following Monday")).toBeInTheDocument();

    // Click "Save & Start Budgeting"
    const finishBtn = screen.getByRole("button", {
      name: /Save & Start Budgeting/i,
    });
    fireEvent.click(finishBtn);

    // Assert saving logic
    expect(localStorage.getItem("budget_app_setup_completed")).toBe("true");

    const savedDefaults = JSON.parse(
      localStorage.getItem("budget_app_defaults")
    );
    expect(savedDefaults.startingSalary).toBe(3500);
    expect(
      savedDefaults.budgetGroups.some((g) => g.name === "Subscriptions")
    ).toBe(true);
    expect(savedDefaults.paydayDay).toBe(25);
    expect(savedDefaults.weekendBehavior).toBe("following-monday");

    // No debt group should be present
    expect(savedDefaults.budgetGroups.some((g) => g.isDebtGroup)).toBe(false);

    // Assert redirect
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("walks through the 4-step setup wizard with debts", () => {
    render(<Settings />);

    // STEP 1: Advance past salary (defaults are fine)
    const nextBtn1 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn1);

    // STEP 2: Advance past categories (defaults are fine)
    const nextBtn2 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn2);

    // DEBT QUESTION GATE
    expect(screen.getByText("Do You Have Any Debts?")).toBeInTheDocument();

    // Click "Yes"
    const yesDebtsBtn = screen.getByRole("button", {
      name: /Yes, I have debts/i,
    });
    fireEvent.click(yesDebtsBtn);

    // DEBT ENTRY STEP
    expect(screen.getByText("Add Your Debts")).toBeInTheDocument();

    // A blank debt entry card should exist
    expect(screen.getByText("Debt 1")).toBeInTheDocument();

    // Fill in debt details
    const nameInput = screen.getByPlaceholderText("e.g. Barclaycard");
    fireEvent.change(nameInput, { target: { value: "Barclaycard" } });

    const balanceInputs = screen.getAllByPlaceholderText("0.00");
    // First 0.00 placeholder is Outstanding Balance
    fireEvent.change(balanceInputs[0], { target: { value: "3200" } });
    // Second is Minimum Payment
    fireEvent.change(balanceInputs[1], { target: { value: "85" } });

    // Click "Next" to go to confirm
    const nextBtn3 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn3);

    // CONFIRM STEP
    expect(screen.getByText("Confirm Your Budget Setup")).toBeInTheDocument();
    expect(screen.getByText("1 debts")).toBeInTheDocument();

    // Click "Save & Start Budgeting"
    const finishBtn = screen.getByRole("button", {
      name: /Save & Start Budgeting/i,
    });
    fireEvent.click(finishBtn);

    // Assert debt group was saved
    const savedDefaults = JSON.parse(
      localStorage.getItem("budget_app_defaults")
    );
    const debtGroup = savedDefaults.budgetGroups.find((g) => g.isDebtGroup);
    expect(debtGroup).toBeDefined();
    expect(debtGroup.name).toBe("Debt Repayment");
    expect(debtGroup.budgetGroupItems.length).toBe(1);

    const debtItem = debtGroup.budgetGroupItems[0];
    expect(debtItem.name).toBe("Barclaycard");
    expect(debtItem.type).toBe("debt");
    expect(debtItem.outstandingBalance).toBe(3200);
    expect(debtItem.minimumPayment).toBe(85);
    expect(debtItem.debtType).toBe("credit-card"); // default selection

    expect(mockNavigate).toHaveBeenCalled();
  });
});
