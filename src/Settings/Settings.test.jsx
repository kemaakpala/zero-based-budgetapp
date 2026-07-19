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

  it("walks through the 5-step setup wizard and saves config (no debts, no savings path)", () => {
    render(<Settings />);

    // STEP 1: Starting Salary
    expect(
      screen.getByText("Set Your Starting Monthly Income")
    ).toBeInTheDocument();

    // Check input displays default value of 5000
    const incomeInput = screen.getByPlaceholderText("0.00");
    expect(incomeInput.value).toBe("5000");

    // Change input value to 3500
    fireEvent.change(incomeInput, { target: { value: "3500" } });
    expect(incomeInput.value).toBe("3500");

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
    expect(screen.getByText("Do You Have Any Debt?")).toBeInTheDocument();

    // Click "No" to skip debts
    const noDebtsBtn = screen.getByRole("button", {
      name: /No, skip this step/i,
    });
    fireEvent.click(noDebtsBtn);

    // SAVINGS QUESTION GATE (Step 4)
    expect(
      screen.getByText("Do You Want to Set Up Savings Goals?")
    ).toBeInTheDocument();

    // Click "No" to skip savings
    const noSavingsBtn = screen.getByRole("button", {
      name: /No, skip this step/i,
    });
    fireEvent.click(noSavingsBtn);

    // CONFIRM STEP (Step 5)
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
    expect(savedDefaults.incomes[0].amount).toBe(3500);
    expect(
      savedDefaults.budgetGroups.some((g) => g.name === "Subscriptions")
    ).toBe(true);
    expect(savedDefaults.paydayDay).toBe(25);
    expect(savedDefaults.weekendBehavior).toBe("following-monday");

    // No debt or savings groups should be present
    expect(savedDefaults.budgetGroups.some((g) => g.isDebtGroup)).toBe(false);
    expect(savedDefaults.budgetGroups.some((g) => g.isSavingsGroup)).toBe(
      false
    );

    // Assert redirect
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("walks through the 5-step setup wizard with debts and savings goals", () => {
    render(<Settings />);

    // STEP 1: Advance past salary
    const nextBtn1 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn1);

    // STEP 2: Advance past categories
    const nextBtn2 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn2);

    // DEBT QUESTION GATE (Step 3)
    expect(screen.getByText("Do You Have Any Debt?")).toBeInTheDocument();

    // Click "Yes"
    const yesDebtsBtn = screen.getByRole("button", {
      name: /Yes, I have debts/i,
    });
    fireEvent.click(yesDebtsBtn);

    // DEBT ENTRY STEP
    expect(screen.getByText("Add Your Debt")).toBeInTheDocument();
    expect(screen.getByText("Debt 1")).toBeInTheDocument();

    // Fill in debt details
    const nameInput = screen.getByPlaceholderText("e.g. Barclaycard");
    fireEvent.change(nameInput, { target: { value: "Barclaycard" } });

    const balanceInputs = screen.getAllByPlaceholderText("0.00");
    // First is Outstanding Balance
    fireEvent.change(balanceInputs[0], { target: { value: "3200" } });
    // Second is Minimum Payment
    fireEvent.change(balanceInputs[1], { target: { value: "85" } });

    // Click "Next" to go to Savings Gate (Step 4)
    const nextBtn3 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn3);

    // SAVINGS QUESTION GATE (Step 4)
    expect(
      screen.getByText("Do You Want to Set Up Savings Goals?")
    ).toBeInTheDocument();

    // Click "Yes"
    const yesSavingsBtn = screen.getByRole("button", {
      name: /Yes, set up savings/i,
    });
    fireEvent.click(yesSavingsBtn);

    // SAVINGS ENTRY STEP
    expect(screen.getByText("Add Your Savings Goals")).toBeInTheDocument();

    // We check risk assessment calculations
    // Sole breadwinner check
    const breadwinnerChk = screen.getByLabelText(
      "Are you the sole breadwinner?"
    );
    expect(breadwinnerChk.checked).toBe(false);

    // Trigger calculation updates by making sole breadwinner true
    fireEvent.click(breadwinnerChk);
    expect(breadwinnerChk.checked).toBe(true);

    // Apply Recommended Emergency Fund buffer
    const applyBtn = screen.getByRole("button", {
      name: /Apply Emergency Fund Target/i,
    });
    fireEvent.click(applyBtn);

    // Goal 1 Emergency Fund should exist
    expect(screen.getByDisplayValue("Emergency Fund")).toBeInTheDocument();

    // Click "Next" to go to confirm (Step 5)
    const nextBtn4 = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn4);

    // CONFIRM STEP
    expect(screen.getByText("Confirm Your Budget Setup")).toBeInTheDocument();
    expect(screen.getByText("1 debts")).toBeInTheDocument();
    expect(screen.getByText("1 goals")).toBeInTheDocument();

    // Click "Save & Start Budgeting"
    const finishBtn = screen.getByRole("button", {
      name: /Save & Start Budgeting/i,
    });
    fireEvent.click(finishBtn);

    // Assert saving logic
    const savedDefaults = JSON.parse(
      localStorage.getItem("budget_app_defaults")
    );
    const savingsGroup = savedDefaults.budgetGroups.find(
      (g) => g.isSavingsGroup
    );
    expect(savingsGroup).toBeDefined();
    expect(savingsGroup.name).toBe("Savings");
    expect(savingsGroup.budgetGroupItems.length).toBe(1);

    const savingsItem = savingsGroup.budgetGroupItems[0];
    expect(savingsItem.name).toBe("Emergency Fund");
    expect(savingsItem.type).toBe("savings");
    // income default is 5000, 70% monthly expenses = 3500.
    // Sole breadwinner is true -> 6 months -> 3500 * 6 = 21000.
    expect(savingsItem.target).toBe(21000);
    expect(savingsItem.startingBalance).toBe(0);

    expect(mockNavigate).toHaveBeenCalled();
  });
});
