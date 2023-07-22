import { Outlet, Link } from "react-router-dom";
import "./Layout.css";
export default function Layout() {
  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const year = new Date(Date.now()).getFullYear();
  return (
    <>
      <header className="App-header">
        <p>Zero Based Budgeting App</p>
        <hr />
        <nav>
          <ul>
            {months.map((month) => (
              <li>
                <Link to={month}>{month}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <aside>
        <nav>
          <ul>
            <li>
              <Link to={"Budget"}>Budget</Link>
            </li>
            <li>
              <Link to={"insights"}>Insights</Link>
            </li>
            <li>
              <Link to={"settings"}>Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <footer className="App-footer">
        <hr />
        <p>&copy; {year}</p>
      </footer>
    </>
  );
}
