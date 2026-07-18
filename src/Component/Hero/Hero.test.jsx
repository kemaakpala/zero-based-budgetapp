import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { describe, vi, expect, it } from "vitest";

describe("Hero Component", () => {
  it("renders total income and remaining values", () => {
    render(
      <Hero
        incomes={[
          { id: "inc-1", name: "Main Salary", amount: 5000, received: true },
        ]}
        totalIncome={5000}
        totalAssigned={4000}
        unassignedIncome={1000}
        onUpdateIncomeField={vi.fn()}
        onAddIncome={vi.fn()}
        onDeleteIncome={vi.fn()}
        viewMode="remaining"
        onViewModeToggle={vi.fn()}
      />
    );
    expect(screen.getByText("TOTAL INCOME")).toBeInTheDocument();
    expect(screen.getByText("5000.00")).toBeInTheDocument();
    expect(screen.getByText("£1000.00 left to assign")).toBeInTheDocument();
  });

  it("displays the correct assigned amount statement", () => {
    render(
      <Hero
        incomes={[
          { id: "inc-1", name: "Main Salary", amount: 5000, received: true },
        ]}
        totalIncome={5000}
        totalAssigned={4000}
        unassignedIncome={1000}
        onUpdateIncomeField={vi.fn()}
        onAddIncome={vi.fn()}
        onDeleteIncome={vi.fn()}
        viewMode="remaining"
        onViewModeToggle={vi.fn()}
      />
    );
    expect(
      screen.getByText("£4000.00 of £5000.00 assigned")
    ).toBeInTheDocument();
  });
});
