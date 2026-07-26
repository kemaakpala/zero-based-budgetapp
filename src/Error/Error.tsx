import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "Unknown error";
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || "Route Error";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has ocurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
