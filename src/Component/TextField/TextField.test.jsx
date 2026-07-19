import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextField from "./TextField";

describe("TextField", () => {
  const defaultProps = {
    id: "test-field",
    value: "hello",
    onChange: () => {},
  };

  it("renders an input with the given value", () => {
    render(<TextField {...defaultProps} />);
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
  });

  it("renders a label when label prop is provided", () => {
    render(<TextField {...defaultProps} label="Username" />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("renders without a label when label prop is omitted", () => {
    render(<TextField {...defaultProps} />);
    expect(screen.queryByRole("textbox")).toBeInTheDocument();
    expect(screen.queryByTagName?.("label")).not.toBeDefined();
  });

  it("calls onChange when the input value changes", () => {
    const onChange = vi.fn();
    render(<TextField {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue("hello"), {
      target: { value: "world" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls onBlur when the input loses focus", () => {
    const onBlur = vi.fn();
    render(<TextField {...defaultProps} onBlur={onBlur} />);
    fireEvent.blur(screen.getByDisplayValue("hello"));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("calls onKeyDown when a key is pressed", () => {
    const onKeyDown = vi.fn();
    render(<TextField {...defaultProps} onKeyDown={onKeyDown} />);
    fireEvent.keyDown(screen.getByDisplayValue("hello"), { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("forwards ref to the underlying input element", () => {
    const ref = React.createRef();
    render(<TextField {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current.value).toBe("hello");
  });

  it("renders with the specified type", () => {
    render(<TextField {...defaultProps} type="number" value="42" />);
    expect(screen.getByDisplayValue("42")).toHaveAttribute("type", "number");
  });

  it("sets autoFocus on the input", () => {
    render(<TextField {...defaultProps} autoFocus />);
    expect(screen.getByDisplayValue("hello")).toHaveFocus();
  });

  it("renders a disabled input", () => {
    render(<TextField {...defaultProps} disabled />);
    expect(screen.getByDisplayValue("hello")).toBeDisabled();
  });

  it("passes step, min, and max attributes for number inputs", () => {
    render(
      <TextField
        {...defaultProps}
        type="number"
        value="5"
        step="0.01"
        min="0"
        max="100"
      />
    );
    const input = screen.getByDisplayValue("5");
    expect(input).toHaveAttribute("step", "0.01");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });

  it("renders with the specified placeholder", () => {
    render(<TextField {...defaultProps} placeholder="Enter name" />);
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  it("applies the name attribute", () => {
    render(<TextField {...defaultProps} name="username" />);
    expect(screen.getByDisplayValue("hello")).toHaveAttribute(
      "name",
      "username"
    );
  });

  it("applies additional className to the input", () => {
    render(<TextField {...defaultProps} className="custom-class" />);
    expect(screen.getByDisplayValue("hello")).toHaveClass("custom-class");
  });
});
