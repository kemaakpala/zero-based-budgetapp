import { render } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import { test, expect, vi } from "vitest";
import browserRouter from "./Routes/router";
import App from "./App";

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({
    title,
    ...props
  }: {
    title?: string;
    [key: string]: unknown;
  }) => (
    <svg {...props}>
      <title>{title}</title>
      <path d="" />
    </svg>
  ),
}));

test("renders learn react link", () => {
  const router = browserRouter({
    path: "/",
    element: <App />,
  });
  const {
    container: { firstChild },
  } = render(<RouterProvider router={router} />);
  expect(firstChild).toMatchSnapshot();
});
