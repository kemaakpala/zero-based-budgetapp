import { render } from "@testing-library/react";
import TextField from "./TextField";

describe("TextField", () => {
  it("test textfield renders", () => {
    const {
      container: { firstChild },
    } = render(<TextField label="test" inputName="testName" />);
    expect(firstChild).toMatchSnapshot();
  });
});
