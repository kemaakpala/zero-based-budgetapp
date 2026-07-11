import { render, screen, fireEvent } from "@testing-library/react";
import BudgetGroup from "./BudgetGroup";

// Mock the BudgetGroupItem component
vi.mock("./BudgetGroupItem", () => ({
  default: () => (
    <div>
      <div>Planned</div>
      <div>Received</div>
      <button>Delete</button>
    </div>
  ),
}));

export const BudgetGroupData = {
  name: "Budget Group",
  columns: [{ name: "Planned" }, { name: "Received" }],
  budgetGroupItems: [
    {
      id: 1,
      name: "Item Name",
      assigned: 0,
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
    expect(screen.getAllByText("Planned")[0]).toBeInTheDocument();
  });
  it("test budget group renders Received", () => {
    render(<BudgetGroup budgetGroup={BudgetGroupData} />);
    expect(screen.getAllByText("Received")[0]).toBeInTheDocument();
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
    expect(screen.getAllByText("Planned")[0]).toBeInTheDocument();
  });

  it("triggers onRenameGroupClick when Edit is clicked in popover", () => {
    const onRenameGroupClick = vi.fn();
    const { container } = render(
      <BudgetGroup
        budgetGroup={BudgetGroupData}
        groupIndex={0}
        onRenameGroupClick={onRenameGroupClick}
      />,
    );

    // Open popover
    const popoverBtn = container.querySelector(
      ".group-header-column:last-child button",
    );
    fireEvent.click(popoverBtn);

    // Find Edit button and click it
    const editBtn = container.querySelector(
      ".popover-menu-list-item:first-child button",
    );
    fireEvent.click(editBtn);

    expect(onRenameGroupClick).toHaveBeenCalledWith(0, "Budget Group");
  });

  it("triggers onDeleteGroupClick when Delete is clicked in popover", () => {
    const onDeleteGroupClick = vi.fn();
    const { container } = render(
      <BudgetGroup
        budgetGroup={BudgetGroupData}
        groupIndex={0}
        onDeleteGroupClick={onDeleteGroupClick}
      />,
    );

    // Open popover
    const popoverBtn = container.querySelector(
      ".group-header-column:last-child button",
    );
    fireEvent.click(popoverBtn);

    // Find Delete button and click it
    const deleteBtn = container.querySelector(
      ".popover-menu-list-item:last-child button",
    );
    fireEvent.click(deleteBtn);

    expect(onDeleteGroupClick).toHaveBeenCalledWith(0, "Budget Group");
  });
});
