import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditableField from "./EditableField";

describe("EditableField", () => {
  const defaultProps = {
    value: "Groceries",
    onSave: () => {},
  };

  it("renders the value as text in read mode", () => {
    render(<EditableField {...defaultProps} />);
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("displays prefix before the value in read mode", () => {
    render(<EditableField {...defaultProps} value="500.00" prefix="£" />);
    expect(screen.getByText("£500.00")).toBeInTheDocument();
  });

  it("switches to edit mode when clicked", () => {
    render(<EditableField {...defaultProps} />);
    fireEvent.click(screen.getByText("Groceries"));
    expect(screen.getByDisplayValue("Groceries")).toBeInTheDocument();
  });

  it("does not call onSave while typing", () => {
    const onSave = vi.fn();
    render(<EditableField {...defaultProps} onSave={onSave} />);
    fireEvent.click(screen.getByText("Groceries"));
    fireEvent.change(screen.getByDisplayValue("Groceries"), {
      target: { value: "Food" },
    });
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave with the current value on blur", () => {
    const onSave = vi.fn();
    render(<EditableField {...defaultProps} onSave={onSave} />);
    fireEvent.click(screen.getByText("Groceries"));
    fireEvent.change(screen.getByDisplayValue("Groceries"), {
      target: { value: "Food" },
    });
    fireEvent.blur(screen.getByDisplayValue("Food"));
    expect(onSave).toHaveBeenCalledWith("Food");
  });

  it("calls onSave with the current value on Enter", () => {
    const onSave = vi.fn();
    render(<EditableField {...defaultProps} onSave={onSave} />);
    fireEvent.click(screen.getByText("Groceries"));
    fireEvent.change(screen.getByDisplayValue("Groceries"), {
      target: { value: "Food" },
    });
    fireEvent.keyDown(screen.getByDisplayValue("Food"), { key: "Enter" });
    expect(onSave).toHaveBeenCalledWith("Food");
  });

  it("reverts to original value and exits edit mode on Escape", () => {
    const onSave = vi.fn();
    render(<EditableField {...defaultProps} onSave={onSave} />);
    fireEvent.click(screen.getByText("Groceries"));
    fireEvent.change(screen.getByDisplayValue("Groceries"), {
      target: { value: "Food" },
    });
    fireEvent.keyDown(screen.getByDisplayValue("Food"), { key: "Escape" });
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("returns to read mode after saving on blur", () => {
    render(<EditableField {...defaultProps} />);
    fireEvent.click(screen.getByText("Groceries"));
    fireEvent.blur(screen.getByDisplayValue("Groceries"));
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("syncs with external value prop changes", () => {
    const { rerender } = render(<EditableField {...defaultProps} />);
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    rerender(<EditableField {...defaultProps} value="Food" />);
    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  it("applies custom className to the wrapper", () => {
    const { container } = render(
      <EditableField {...defaultProps} className="hero-editable" />
    );
    expect(container.firstChild).toHaveClass("hero-editable");
  });
});
