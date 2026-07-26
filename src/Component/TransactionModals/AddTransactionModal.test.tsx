import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddTransactionModal from "./AddTransactionModal";
import type { BudgetItem } from "../../utils/budgetStore/types";

describe("AddTransactionModal", () => {
  const mockItem: BudgetItem = {
    id: "h1",
    name: "Rent / Mortgage",
    assigned: 0,
    type: "expense",
  };
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <AddTransactionModal
        isOpen={false}
        budgetItem={mockItem}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly and submits inputs", () => {
    render(
      <AddTransactionModal
        isOpen={true}
        budgetItem={mockItem}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Add Transaction")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rent / Mortgage")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/Tesco/i) as HTMLInputElement;
    const amountInput = screen.getByPlaceholderText("0.00") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Landlord" } });
    fireEvent.change(amountInput, { target: { value: "850.00" } });

    expect(nameInput.value).toBe("Landlord");
    expect(amountInput.value).toBe("850.00");

    const submitBtn = screen.getByRole("button", { name: "Add" });
    fireEvent.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith("Landlord", "850.00");
  });

  it("calls onClose when close or cancel button is clicked", () => {
    render(
      <AddTransactionModal
        isOpen={true}
        budgetItem={mockItem}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const closeBtn = screen.getByRole("button", { name: "×" });
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});
