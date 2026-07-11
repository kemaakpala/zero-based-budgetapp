import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionLog from "./TransactionLog";

describe("TransactionLog", () => {
  const mockTransactions = [
    {
      id: "tx1",
      name: "Tesco Groceries",
      amount: 45.5,
      budgetItemId: "item-groceries",
      date: "2026-06-18T10:00:00.000Z",
    },
    {
      id: "tx2",
      name: "Monthly Rent",
      amount: 1200.0,
      budgetItemId: "item-rent",
      date: "2026-06-18T09:00:00.000Z",
    },
  ];

  const mockBudgetGroups = [
    {
      name: "Housing",
      budgetGroupItems: [
        {
          id: "item-rent",
          name: "Rent / Mortgage",
          assigned: 1200.0,
        },
      ],
    },
    {
      name: "Food",
      budgetGroupItems: [
        {
          id: "item-groceries",
          name: "Groceries",
          assigned: 100.0,
        },
      ],
    },
  ];

  const mockOnDeleteTransaction = vi.fn();
  const mockOnDeleteMultipleTransactions = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders closed by default showing the transaction count badge", () => {
    render(
      <TransactionLog
        transactions={mockTransactions}
        budgetGroups={mockBudgetGroups}
        onDeleteTransaction={mockOnDeleteTransaction}
        onDeleteMultipleTransactions={mockOnDeleteMultipleTransactions}
      />,
    );

    expect(screen.getByText("Transactions Log")).toBeInTheDocument();
    expect(screen.getByText("2 transactions")).toBeInTheDocument();
    // Content should not be visible (it's conditionally rendered on isOpen)
    expect(
      screen.queryByPlaceholderText("Search payee..."),
    ).not.toBeInTheDocument();
  });

  it("opens when clicking the header and renders transactions", () => {
    render(
      <TransactionLog
        transactions={mockTransactions}
        budgetGroups={mockBudgetGroups}
        onDeleteTransaction={mockOnDeleteTransaction}
        onDeleteMultipleTransactions={mockOnDeleteMultipleTransactions}
      />,
    );

    const headerButton = screen.getByRole("button", {
      name: /Transactions Log/i,
    });
    fireEvent.click(headerButton);

    expect(screen.getByPlaceholderText("Search payee...")).toBeInTheDocument();
    expect(screen.getByText("Tesco Groceries")).toBeInTheDocument();
    expect(screen.getByText("Monthly Rent")).toBeInTheDocument();
    expect(screen.getByText("£45.50")).toBeInTheDocument();
    expect(screen.getByText("£1200.00")).toBeInTheDocument();

    // Check mapping category badge
    expect(screen.getByText("Food:")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Food → Groceries")).toBeInTheDocument();
    expect(screen.getByText("Housing:")).toBeInTheDocument();
    expect(screen.getByText("Rent / Mortgage")).toBeInTheDocument();
    expect(screen.getByText("Housing → Rent / Mortgage")).toBeInTheDocument();
  });

  it("filters transactions based on search input", () => {
    render(
      <TransactionLog
        transactions={mockTransactions}
        budgetGroups={mockBudgetGroups}
        onDeleteTransaction={mockOnDeleteTransaction}
        onDeleteMultipleTransactions={mockOnDeleteMultipleTransactions}
      />,
    );

    // Open
    fireEvent.click(screen.getByRole("button", { name: /Transactions Log/i }));

    const searchInput = screen.getByPlaceholderText("Search payee...");
    fireEvent.change(searchInput, { target: { value: "Tesco" } });

    expect(screen.getByText("Tesco Groceries")).toBeInTheDocument();
    expect(screen.queryByText("Monthly Rent")).not.toBeInTheDocument();
  });

  it("filters transactions based on budget item selection", () => {
    render(
      <TransactionLog
        transactions={mockTransactions}
        budgetGroups={mockBudgetGroups}
        onDeleteTransaction={mockOnDeleteTransaction}
        onDeleteMultipleTransactions={mockOnDeleteMultipleTransactions}
      />,
    );

    // Open
    fireEvent.click(screen.getByRole("button", { name: /Transactions Log/i }));

    const selectDropdown = screen.getByRole("combobox");
    fireEvent.change(selectDropdown, { target: { value: "item-rent" } });

    expect(screen.getByText("Monthly Rent")).toBeInTheDocument();
    expect(screen.queryByText("Tesco Groceries")).not.toBeInTheDocument();
  });

  it("calls onDeleteTransaction on row delete click after confirmation", () => {
    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockImplementation(() => true);

    render(
      <TransactionLog
        transactions={mockTransactions}
        budgetGroups={mockBudgetGroups}
        onDeleteTransaction={mockOnDeleteTransaction}
        onDeleteMultipleTransactions={mockOnDeleteMultipleTransactions}
      />,
    );

    // Open
    fireEvent.click(screen.getByRole("button", { name: /Transactions Log/i }));

    const deleteButtons = screen.getAllByTitle("Delete transaction");
    fireEvent.click(deleteButtons[0]); // delete Tesco

    expect(confirmSpy).toHaveBeenCalledWith(
      'Delete transaction "Tesco Groceries" for £45.50?',
    );
    expect(mockOnDeleteTransaction).toHaveBeenCalledWith("tx1");

    confirmSpy.mockRestore();
  });

  it("supports row selection and batch delete", () => {
    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockImplementation(() => true);

    render(
      <TransactionLog
        transactions={mockTransactions}
        budgetGroups={mockBudgetGroups}
        onDeleteTransaction={mockOnDeleteTransaction}
        onDeleteMultipleTransactions={mockOnDeleteMultipleTransactions}
      />,
    );

    // Open
    fireEvent.click(screen.getByRole("button", { name: /Transactions Log/i }));

    const checkboxes = screen.getAllByRole("checkbox");
    // checkboxes[0] is the Select All header checkbox
    // checkboxes[1] is tx1 (Tesco)
    // checkboxes[2] is tx2 (Rent)

    // Select Tesco
    fireEvent.click(checkboxes[1]);

    // Bulk action bar should appear
    expect(screen.getByText("1 item selected")).toBeInTheDocument();

    // Select Rent
    fireEvent.click(checkboxes[2]);
    expect(screen.getByText("2 items selected")).toBeInTheDocument();

    // Perform batch delete
    const batchDeleteBtn = screen.getByRole("button", {
      name: /Delete Selected/i,
    });
    fireEvent.click(batchDeleteBtn);

    expect(confirmSpy).toHaveBeenCalledWith(
      "Are you sure you want to delete 2 selected transaction(s)?",
    );
    expect(mockOnDeleteMultipleTransactions).toHaveBeenCalledWith([
      "tx1",
      "tx2",
    ]);

    confirmSpy.mockRestore();
  });
});
