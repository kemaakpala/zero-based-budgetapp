import { render, screen, fireEvent } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { formatBudgetItemAmount } from "../../utils/utils";
import Budget from "./Budget";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(() => ({ month: "June-2026" })),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

vi.mock("../../utils/utils", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    generateUniqueId: vi.fn(() => 1),
    formatBudgetItemAmount: vi.fn(() => 1),
    getFullYear: vi.fn(() => 1),
  };
});

describe("Budget", () => {
  beforeEach(() => {
    localStorage.clear();
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
      startingSalary: 5000,
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
      startingSalary: 5000,
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
      ".unassigned-salary-block .amount"
    );
    expect(unassignedSalaryEl).toBeInTheDocument();
    expect(unassignedSalaryEl.textContent).toBe("£5000.00");

    // Edit the planned value in June-2026 to 150
    const input = container.querySelector("#debt_Planned_text_d1");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "150" } });

    // Verify unassigned salary in June-2026 is reduced to 4850.00
    expect(unassignedSalaryEl.textContent).toBe("£4850.00");

    // Now transition to July-2026
    vi.mocked(useParams).mockReturnValue({ month: "July-2026" });

    // Rerender to trigger useEffect with the new month
    rerender(<Budget />);

    // In July-2026 (a new month), the planned amount should be carried over from defaults (which was updated to 150)
    // Therefore, the left to assign amount should be 4850.00 (not 5000.00)
    expect(
      container.querySelector(".unassigned-salary-block .amount").textContent
    ).toBe("£4850.00");
  });

  it("does not save the previous month's state to the new month when transitioning", () => {
    vi.mocked(useParams).mockReturnValue({ month: "June-2026" });
    vi.mocked(formatBudgetItemAmount).mockImplementation((val) => {
      const num = parseFloat(val);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    });

    const defaults = {
      startingSalary: 5000,
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
