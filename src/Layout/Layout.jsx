import { Outlet, Link } from "react-router-dom";
export default function Layout() {
  return (
    <>
      <header className="App-header">
        Zero Based Budgeting App
        <nav>
          <ul>
            <li>
              <Link to={"January"}>January</Link>
            </li>
            <li>
              <Link to={"Febuary"}>Febuary</Link>
            </li>
            <li>
              <Link to={"March"}>March</Link>
            </li>
            <li>
              <Link to={"April"}>April</Link>
            </li>
            <li>
              <Link to={"May"}>May</Link>
            </li>
            <li>
              <Link to={"June"}>June</Link>
            </li>
            <li>
              <Link to={"July"}>July</Link>
            </li>
            <li>
              <Link to={"August"}>August</Link>
            </li>
            <li>
              <Link to={"September"}>September</Link>
            </li>
            <li>
              <Link to={"October"}>October</Link>
            </li>
            <li>
              <Link to={"November"}>November</Link>
            </li>
            <li>
              <Link to={"December"}>December</Link>
            </li>
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
      <footer className="App-footer">Budget Footer</footer>
    </>
  );
}
