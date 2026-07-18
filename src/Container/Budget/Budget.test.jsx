import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Budget from "./Budget";
import { describe, vi, it, expect, beforeEach } from "vitest";
import { useParams } from "react-router-dom";
import { formatBudgetItemAmount } from "../../utils/utils";

// Mock React Router useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../utils/utils", async () => {
  const actual = await vi.importActual("../../utils/utils");
  return {
    ...actual,
    formatBudgetItemAmount: vi.fn(),
  };
});

describe("Budget", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ month: "July-2026" });
  });

  it("test budget renders Housing", () => {
    localStorage.setItem("budget_app_setup_completed", "true");
    render(<Budget />);
    expect(screen.getByText("Housing")).toBeInTheDocument();
  });

  it("test budget renders Giving", () => {
    localStorage.setItem("budget_app_setup_completed", "true");
    render(<Budget />);
    expect(screen.getByText("Giving")).toBeInTheDocument();
  });

  it("updates template defaults when a debt item's Planned (assigned) field changes", () => {
    const defaults = {
      incomes: [
        { id: "inc-default", name: "Main Salary", amount: 5000, received: true }
      ],
      budgetGroups: [
        {
          name: "Debt",
          isDebtGroup: true,
          budgetGroupItems: [
            {
              id: "d1",
              name: "Personal Loan",
              assigned: 0,
              type: "debt",
              outstandingBalance: 4000,
              minimumPayment: 100,
              debtType: "personal-loan",
            },
          ],
        },
      ],
      paydayDay: 20,
      weekendBehavior: "preceding-friday",
    };
    localStorage.setItem("budget_app_defaults", JSON.stringify(defaults));
    localStorage.setItem("budget_app_setup_completed", "true");

    const { container } = render(<Budget />);

    // Find the Planned input field for the debt item
    const input = container.querySelector("#debt_Planned_text_d1");
    expect(input).toBeInTheDocument();

    // Edit the planned value
    fireEvent.change(input, { target: { value: "1000" } });

    // Verify template defaults in localStorage has been updated
    const updatedDefaults = JSON.parse(
      localStorage.getItem("budget_app_defaults")
    );
    const debtItem = updatedDefaults.budgetGroups[0].budgetGroupItems[0];
    expect(debtItem.assigned).toBe(1000);
  });

  it("carries over the planned debt amount and reduces left to assign when transitioning to a new month", () => {
    vi.mocked(useParams).mockReturnValue({ month: "June-2026" });
    vi.mocked(formatBudgetItemAmount).mockImplementation((val) => {
      const num = parseFloat(val);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    });

    const defaults = {
      incomes: [
        { id: "inc-default", name: "Main Salary", amount: 5000, received: true }
      ],
      budgetGroups: [
        {
          name: "Debt",
          isDebtGroup: true,
          budgetGroupItems: [
            {
              id: "d1",
              name: "Personal Loan",
              assigned: 0,
              type: "debt",
              outstandingBalance: 4000,
              minimumPayment: 100,
              debtType: "personal-loan",
            },
          ],
        },
      ],
      paydayDay: 20,
      weekendBehavior: "preceding-friday",
    };
    localStorage.setItem("budget_app_defaults", JSON.stringify(defaults));
    localStorage.setItem("budget_app_setup_completed", "true");

    // Render for June-2026
    const { rerender, container } = render(<Budget />);

    // Check starting unassigned salary is 5000.00
    const unassignedSalaryEl = container.querySelector(
      ".hero-progress-subtext"
    );
    expect(unassignedSalaryEl).toBeInTheDocument();
    expect(unassignedSalaryEl.textContent).toBe("£5000.00 left to assign");

    // Edit the planned value in June-2026 to 150
    const input = container.querySelector("#debt_Planned_text_d1");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "150" } });

    // Verify unassigned salary in June-2026 is reduced to 4850.00
    expect(unassignedSalaryEl.textContent).toBe("£4850.00 left to assign");

    // Now transition to July-2026
    vi.mocked(useParams).mockReturnValue({ month: "July-2026" });

    // Rerender to trigger useEffect with the new month
    rerender(<Budget />);

    // In July-2026 (a new month), the planned amount should be carried over from defaults (which was updated to 150)
    // Therefore, the left to assign amount should be 4850.00 (not 5000.00)
    expect(
      container.querySelector(".hero-progress-subtext").textContent
    ).toBe("£4850.00 left to assign");
  });

  it("does not save the previous month's state to the new month when transitioning", () => {
    vi.mocked(useParams).mockReturnValue({ month: "June-2026" });
    vi.mocked(formatBudgetItemAmount).mockImplementation((val) => {
      const num = parseFloat(val);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    });

    const defaults = {
      incomes: [
        { id: "inc-default", name: "Main Salary", amount: 5000, received: true }
      ],
      budgetGroups: [
        {
          name: "Housing",
          budgetGroupItems: [
            {
              id: "h1",
              name: "Rent / Mortgage",
              assigned: 0,
              type: "expense",
            },
          ],
        },
      ],
      paydayDay: 20,
      weekendBehavior: "preceding-friday",
    };
    localStorage.setItem("budget_app_defaults", JSON.stringify(defaults));
    localStorage.setItem("budget_app_setup_completed", "true");

    // Render for June-2026
    const { rerender, container } = render(<Budget />);

    // Edit the Rent assigned value in June-2026 to 1000
    const input = container.querySelector("#Housing_Assigned_text_h1");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "1000" } });

    // Spy on localStorage.setItem
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    // Transition to July-2026
    vi.mocked(useParams).mockReturnValue({ month: "July-2026" });
    rerender(<Budget />);

    // Verify that we never call localStorage.setItem with July-2026 budget data where Rent has assigned: 1000
    for (const call of setItemSpy.mock.calls) {
      const [key, value] = call;
      if (key === "budget_app_data_July-2026") {
        const parsed = JSON.parse(value);
        const rentItem = parsed.budgetGroups[0].budgetGroupItems[0];
        expect(rentItem.assigned).not.toBe(1000);
      }
    }

    setItemSpy.mockRestore();
  });
});
