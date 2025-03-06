import { render, screen, userEvent } from "@testing-library/react";
import BudgetGroup from "./BudgetGroup";

// Mock the BudgetGroupItem component
jest.mock("./BudgetGroupItem", () => () => (
  <div>
    <div>Planned</div>
    <div>Received</div>
    <button>Delete</button>
  </div>
));

export const BudgetGroupData = {
  name: "Budget Group",
  budgetGroupItems: [
    {
      id: 1,
      fields: [
        {
          label: "Planned",
          value: 0,
          placeholder: 0,
          type: "text",
        },
        {
          label: "Received",
          value: 0,
          placeholder: 0,
          type: "text",
        },
      ],
      action: { label: "Delete", color: "red", type: "button" },
      type: "budgetGroup",
    },
  ],
};
describe("BudgetGroup", () => {
  it("test budget group renders", () => {
    render(<BudgetGroup budgetGroup={BudgetGroupData} />);
    expect(screen.getByText("Budget Group")).toBeInTheDocument();
  });
  it("test budget group renders Planned", () => {
    render(<BudgetGroup budgetGroup={BudgetGroupData} />);
    expect(screen.getByText("Planned")).toBeInTheDocument();
  });
  it("test budget group renders Received", () => {
    render(<BudgetGroup budgetGroup={BudgetGroupData} />);
    expect(screen.getByText("Received")).toBeInTheDocument();
  });
  it("test budget group renders Delete", () => {
    render(<BudgetGroup budgetGroup={BudgetGroupData} />);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("test budget group renders with progress", () => {
    render(<BudgetGroup budgetGroup={BudgetGroupData} progress={50} />);
    expect(screen.getByText("Budget Group")).toBeInTheDocument();
  });

  it("test budget group hideContent onClick", () => {
    render(<BudgetGroup budgetGroup={BudgetGroupData} />);
    const button = screen.getByText("Budget Group");
    button.click();
    expect(screen.getByText("Planned")).toBeInTheDocument();
  });
});
