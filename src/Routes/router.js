import { createBrowserRouter } from "react-router-dom"

export default function browserRouter(config={}) {
  console.log('browserRouter[config]', config);

  return createBrowserRouter([config]);
}