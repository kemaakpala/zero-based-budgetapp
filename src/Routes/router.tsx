import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

export default function browserRouter(config: RouteObject) {
  return createBrowserRouter([config]);
}
