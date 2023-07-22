import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faChartPie,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

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
        <nav className="menu">
          <h1>Every Pound (£)</h1>
          <div className="user-profile-container">
            <FontAwesomeIcon
              icon={faUserCircle}
              size="1x"
              title="user profile image"
            />
          </div>
          <div className="budget-summary-container">
            <FontAwesomeIcon
              icon={faChartPie}
              size="1x"
              title="budget summary"
            />
          </div>
          <div className="budget-search-container">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="1x"
              title="budget search"
            />
          </div>
        </nav>
        <hr className="divider" />
        {/* <nav>
          <ul>
            {months.map((month) => (
              <li>
                <Link to={month}>{month}</Link>
              </li>
            ))}
          </ul>
        </nav> */}
      </header>
      <main className="App-main">
        <Outlet />
      </main>
      {/* <aside>
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
      </aside> */}
      <footer className="App-footer">
        <hr />
        <p>&copy; {year}</p>
      </footer>
    </>
  );
}
