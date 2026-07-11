import { Outlet, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faChartPie,
  faMagnifyingGlass,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import "./Layout.css";
export default function Layout() {
  const months = [
    "January",
    "February",
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
  const location = useLocation();
  const currentPath = location.pathname;
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
          <div className="budget-settings-container">
            <Link
              to="/settings"
              title="Budget Setup Wizard"
              className="menu-icon-link"
            >
              <FontAwesomeIcon
                icon={faGear}
                size="1x"
                title="budget settings"
              />
            </Link>
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
        <nav className="months-nav">
          <ul className="months-list">
            {months.map((month) => {
              const monthPath = `/${month}-${year}`;
              const isActive = currentPath === monthPath;
              return (
                <li key={month}>
                  <Link
                    to={monthPath}
                    className={`month-link ${
                      isActive ? "month-link--active" : ""
                    }`}
                  >
                    {month.substring(0, 3)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
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
