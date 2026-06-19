import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewTransactionsModal from "./ViewTransactionsModal";

describe("ViewTransactionsModal", () => {
  const mockItem = { id: "h1", name: "Rent / Mortgage" };
  const mockTransactions = [
    { id: "tx1", name: "Rent July", amount: 950.0, date: "2026-06-18T10:00:00.000Z" },
    { id: "tx2", name: "Rent Latefee", amount: 50.0, date: "2026-06-18T11:00:00.000Z" },
  ];
  const mockOnClose = vi.fn();
  const mockOnDeleteTransaction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ViewTransactionsModal
        isOpen={false}
        budgetItem={mockItem}
        transactions={mockTransactions}
        onClose={mockOnClose}
        onDeleteTransaction={mockOnDeleteTransaction}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders transactions correctly", () => {
    render(
      <ViewTransactionsModal
        isOpen={true}
        budgetItem={mockItem}
        transactions={mockTransactions}
        onClose={mockOnClose}
        onDeleteTransaction={mockOnDeleteTransaction}
      />
    );

    expect(screen.getByText("Transactions List")).toBeInTheDocument();
    expect(screen.getByText("Budget Item: Rent / Mortgage")).toBeInTheDocument();
    expect(screen.getByText("Rent July")).toBeInTheDocument();
    expect(screen.getByText("£950.00")).toBeInTheDocument();
    expect(screen.getByText("Rent Latefee")).toBeInTheDocument();
    expect(screen.getByText("£50.00")).toBeInTheDocument();
  });

  it("displays empty state message when no transactions exist", () => {
    render(
      <ViewTransactionsModal
        isOpen={true}
        budgetItem={mockItem}
        transactions={[]}
        onClose={mockOnClose}
        onDeleteTransaction={mockOnDeleteTransaction}
      />
    );

    expect(screen.getByText("No transactions recorded yet.")).toBeInTheDocument();
  });

  it("triggers onDeleteTransaction when clicking a delete button", () => {
    render(
      <ViewTransactionsModal
        isOpen={true}
        budgetItem={mockItem}
        transactions={mockTransactions}
        onClose={mockOnClose}
        onDeleteTransaction={mockOnDeleteTransaction}
      />
    );

    const deleteBtns = screen.getAllByTitle("Delete Transaction");
    fireEvent.click(deleteBtns[0]); // Delete first transaction (tx1)

    expect(mockOnDeleteTransaction).toHaveBeenCalledWith("tx1");
  });

  it("calls onClose when close or close actions button is clicked", () => {
    render(
      <ViewTransactionsModal
        isOpen={true}
        budgetItem={mockItem}
        transactions={mockTransactions}
        onClose={mockOnClose}
        onDeleteTransaction={mockOnDeleteTransaction}
      />
    );

    const closeBtn = screen.getByRole("button", { name: "×" });
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();

    const bottomCloseBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(bottomCloseBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});
