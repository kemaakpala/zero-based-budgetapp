import { render, screen } from "@testing-library/react";
import Budget from "./Budget";

jest.mock("../../utils/utils", () => ({
  ...jest.requireActual("../../utils/utils"),
  generateUniqueId: jest.fn(() => 1),
  formatBudgetItemAmount: jest.fn(() => 1),
  getFullYear: jest.fn(() => 1),
}));

describe("Budget", () => {
  it("test budget renders Income", () => {
    render(<Budget />);
    expect(screen.getByText("Income")).toBeInTheDocument();
  });

  it("test budget renders Giving", () => {
    render(<Budget />);
    expect(screen.getByText("Giving")).toBeInTheDocument();
  });
});
