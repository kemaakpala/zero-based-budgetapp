import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import browserRouter from './Routes/router';
import App from './App';

test('renders learn react link', () => {
  const router = browserRouter({
    path: "/",
    element: <App />
  })
  const { container: { firstChild } } = render(
    <RouterProvider router={router} />);
  expect(firstChild).toMatchSnapshot();
});