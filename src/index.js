import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorPage from './Error/Error';
import Settings from './Settings/Settings';
import Budget from './Budget/Budget';
import browserRouter from './Routes/router';

const router = browserRouter({
  path: "/",
  element: <App />,
  errorElement: <ErrorPage />,
  children: [{
    path: "settings",
    element: <Settings />
  }, {
    path: "/:month",
    element: <Budget />
  }]
})

console.log(router)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
