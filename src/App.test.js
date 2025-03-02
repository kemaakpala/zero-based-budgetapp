import { render, screen } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
import browserRouter from "./Routes/router";
import App from "./App";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <svg {...props}>
      <title>{props.title}</title>
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
