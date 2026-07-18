import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { describe, vi } from "vitest";

describe("Hero Component", () => {
  it("renders starting salary and left to assign values", () => {
    render(
      <Hero
        startingSalary={5000}
        unassignedSalary={1000}
        viewMode="remaining"
        onViewModeToggle={vi.fn()}
        onStartingSalaryChange={vi.fn()}
      />
    );
    expect(screen.getByText("Starting Salary")).toBeInTheDocument();
    expect(screen.getByText("5000.00")).toBeInTheDocument();
    expect(screen.getByText("Left to Assign")).toBeInTheDocument();
    expect(screen.getByText("1000.00")).toBeInTheDocument();
  });

  it("displays the correct assigned percentage badge", () => {
    render(
      <Hero
        startingSalary={5000}
        unassignedSalary={1000}
        viewMode="remaining"
        onViewModeToggle={vi.fn()}
        onStartingSalaryChange={vi.fn()}
      />
    );
    expect(screen.getByText("80% assigned")).toBeInTheDocument();
  });
});
