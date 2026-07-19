import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectField from "./SelectField";

describe("SelectField", () => {
  const options = [
    { value: "credit-card", label: "Credit Card" },
    { value: "personal-loan", label: "Personal Loan" },
    { value: "car-loan", label: "Car Loan" },
  ];

  const defaultProps = {
    id: "test-select",
    value: "credit-card",
    onChange: () => {},
    options,
  };

  it("renders a select element with the correct options", () => {
    render(<SelectField {...defaultProps} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Credit Card")).toBeInTheDocument();
    expect(screen.getByText("Personal Loan")).toBeInTheDocument();
    expect(screen.getByText("Car Loan")).toBeInTheDocument();
  });

  it("renders with the selected value", () => {
    render(<SelectField {...defaultProps} value="personal-loan" />);
    expect(screen.getByRole("combobox")).toHaveValue("personal-loan");
  });

  it("calls onChange when a different option is selected", () => {
    const onChange = vi.fn();
    render(<SelectField {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "car-loan" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("renders a label when label prop is provided", () => {
    render(<SelectField {...defaultProps} label="Debt Type" />);
    expect(screen.getByLabelText("Debt Type")).toBeInTheDocument();
  });

  it("renders without a label when label prop is omitted", () => {
    const { container } = render(<SelectField {...defaultProps} />);
    expect(container.querySelector("label")).not.toBeInTheDocument();
  });

  it("renders as disabled when disabled prop is true", () => {
    render(<SelectField {...defaultProps} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
