import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DebtFormModal from "./DebtFormModal";

describe("DebtFormModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <DebtFormModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly in add mode and submits form", () => {
    render(
      <DebtFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Add Debt" })
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText("Name");
    const typeSelect = screen.getByLabelText("Debt Type");
    const balanceInput = screen.getByLabelText("Outstanding Balance (£)");

    fireEvent.change(nameInput, { target: { value: "Credit Card A" } });
    fireEvent.change(typeSelect, { target: { value: "credit-card" } });
    fireEvent.change(balanceInput, { target: { value: "1500.50" } });

    const submitBtn = screen.getByRole("button", { name: "Add Debt" });
    fireEvent.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Credit Card A",
      debtType: "credit-card",
      outstandingBalance: 1500.5,
      minimumPayment: 0,
      interestRate: undefined,
    });
  });

  it("renders correctly in edit mode and populates values", () => {
    const debtItem = {
      id: "d1",
      name: "Student Loan",
      outstandingBalance: 12000,
      minimumPayment: 250,
      debtType: "student-loan",
      interestRate: 4.5,
    };

    render(
      <DebtFormModal
        isOpen={true}
        debtItem={debtItem}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Edit Debt" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Name")).toHaveValue("Student Loan");
    expect(screen.getByLabelText("Outstanding Balance (£)")).toHaveValue(12000);
    expect(screen.getByLabelText("Minimum Payment (£)")).toHaveValue(250);
    expect(screen.getByLabelText("Interest Rate (% — optional)")).toHaveValue(
      4.5
    );

    const submitBtn = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      itemId: "d1",
      name: "Student Loan",
      outstandingBalance: 12000,
      minimumPayment: 250,
      debtType: "student-loan",
      interestRate: 4.5,
    });
  });
});
