import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">Zero Based Budgeting App</header>
      <main>
        <form className="form">
          <div className="income-container">
            <div className="total-income-hero__text">£ 0.00</div>
            <div className="income-fields">
              <div className="primary-income-fields">
                <label
                  className="primary-income-fields__label"
                  for="primaryIncome"
                >
                  Salary 1
                </label>
                <input
                  id="primaryIncome"
                  className="form-control primary-income-fields__input"
                  type="text"
                  name="primary-income"
                  value=""
                />
              </div>
              <div className="secondary-income-fields">
                <label
                  className="secondary-income-fields__label"
                  for="secondaryIncome1"
                >
                  Salary 2
                </label>
                <input
                  className="form-control secondary-income-fields__input"
                  id="secondaryIncome1"
                  type="text"
                  name="secondary-income-1"
                  value=""
                />
              </div>
            </div>
          </div>
          <div className="group-container">
            <div className="group-header">
              <h3>Savings</h3>
            </div>
            <div className="group-item">
              <div className="group-item-fields">
                <label className="group-item-fields__label">Emergency Fund: </label>
                <input className="form-control group-item-fields__input" type="text" name="savings_emergency_fund" value="" />
              </div>
              <div className="group-item-status">
                <h4 className="group-item-status__header">Planned</h4>
                <p className="group-item-status__text">£0.00</p>
              </div>
              <div className="group-item-status">
                <h4 className="group-item-status__header">Remaining</h4>
                <p className="group-item-status__text">£0.00</p>
              </div>
              <div className="group-item-action">
                <button className="group-item-action__button">Delete Item</button>
              </div>
            </div>
            <div className="group-actions">
              <button className="form-control group-actions__button">Add New Group Item</button>
              <button className="form-control group-actions__button">Delete Group</button>
            </div>
          </div>
          <div className="group-container">
            <div className="group-header">
              <h3>Housing</h3>
            </div>
            <div className="group-item">
              <div className="group-item-fields">
                <label className="group-item-fields__label">Rent / Mortgage: </label>
                <input className="form-control group-item-fields__input" type="text" name="housing_rent_mortgage" value="" />
              </div>
              <div className="group-item-status">
                <h4 className="group-item-status__header">Planned</h4>
                <p className="group-item-status__text">£0.00</p>
              </div>
              <div className="group-item-status">
                <h4 className="group-item-status__header">Remaining</h4>
                <p className="group-item-status__text">£0.00</p>
              </div>
              <div className="group-item-action">
                <button className="group-item-action__button">Delete Item</button>
              </div>
            </div>
            <div className="group-actions">
              <button className="form-control group-actions__button">Add New Group Item</button>
              <button className="form-control group-actions__button">Delete Group</button>
            </div>
          </div>
          <div className="group-container">
            <div className="group-header">
              <h3>Transport</h3>
            </div>
            <div className="group-item">
              <div className="group-item-fields">
                <label className="group-item-fields__label">TFL: </label>
                <input className="form-control group-item-fields__input" type="text" name="transport_tfl" value="" />
              </div>
              <div className="group-item-status">
                <h4 className="group-item-status__header">Planned</h4>
                <p className="group-item-status__text">£0.00</p>
              </div>
              <div className="group-item-status">
                <h4 className="group-item-status__header">Remaining</h4>
                <p className="group-item-status__text">£0.00</p>
              </div>
              <div className="group-item-action">
                <button className="group-item-action__button">Delete Item</button>
              </div>
            </div>
            <div className="group-actions">
              <button className="form-control group-actions__button">Add New Group Item</button>
              <button className="form-control group-actions__button">Delete Group</button>
            </div>
          </div>
          <div className="form-actions">
            <button className="form-control form-actions__button">Add New Group</button>
            <button classNam="form-control form-actions__button">Submit Budget</button>
          </div>
        </form>
      </main>
      <footer>Budget Footer</footer>
    </div>
  );
}

export default App;
