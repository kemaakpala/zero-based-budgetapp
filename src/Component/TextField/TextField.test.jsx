import { render, screen } from "@testing-library/react";
import TextField from "./TextField";

describe("TextField", () => {
  it("test textfield renders", () => {
    render(<TextField label="test" inputName="testName" placeholder="test placeholder"/>);
    expect(screen.getByLabelText('test')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('test placeholder')).toBeInTheDocument();
  });
});
