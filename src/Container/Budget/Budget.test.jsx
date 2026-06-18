import { render, screen } from "@testing-library/react";
import Budget from "./Budget";

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
  it("test budget renders Housing", () => {
    render(<Budget />);
    expect(screen.getByText("Housing")).toBeInTheDocument();
  });

  it("test budget renders Giving", () => {
    render(<Budget />);
    expect(screen.getByText("Giving")).toBeInTheDocument();
  });
});
