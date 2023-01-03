import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Zero Based Budgeting App
      </header>
      <main>
        <form>
          <div className="bdgt-header-container">
            <div className="bdgt-total-income-hero">
              £ 0.00
            </div>
            <div className="bdgt-fields">
              <div className="bdgt-primary-fields">
                <label for="salary">Salary 1</label>
                <input id="salary" type="text" name="salary_1" value="" />
              </div>
              <div className="bdgt-secondary-fields">
                <label for="additionalIncome">Salary 2</label>
                <input id="additonalIncome" type="text" name="salary_2" value="" />
              </div>
            </div>
          </div>
          <div className="bdgt-group-container">
            <div className="bdgt-group-header"><h3>Savings</h3></div>
            <div className="bdgt-group-items">
              <div>
                <label>Emergency Fund: </label>
                <input type="text" name="savings_emergency_fund" value="" />
              </div>
              <div>
                <h4>Planned</h4>
                <p>£0.00</p>
              </div>
              <div>
                <h4>Remaining</h4>
                <p>£0.00</p>
              </div>
            </div>
            <div className="bdgt-group-items-actions">
              <button>Add New Group Item</button>
            </div>
          </div>
          <div className="bdgt-group-container">
            <div className="bdgt-group-header"><h3>Housing</h3></div>
            <div className="bdgt-group-items">
              <div>
                <label>Rent: </label>
                <input type="text" name="housing_rent" value="" />
              </div>
              <div>
                <h4>Planned</h4>
                <p>£0.00</p>
              </div>
              <div>
                <h4>Remaining</h4>
                <p>£0.00</p>
              </div>
            </div>
            <div className="bdgt-group-items-actions">
              <button>Add New Group Item</button>
            </div>
          </div>
          <div className="bdgt-group-container">
            <div className="bdgt-group-header"><h3>Transport</h3></div>
            <div className="bdgt-group-items">
              <div>
                <label>TFL: </label>
                <input type="text" name="transport_tfl" value="" />
              </div>
              <div>
                <h4>Planned</h4>
                <p>£0.00</p>
              </div>
              <div>
                <h4>Remaining</h4>
                <p>£0.00</p>
              </div>
            </div>
            <div className="bdgt-group-items-actions">
              <button>Add New Group Item</button>
            </div>
          </div>
        </form>
      </main>
      <footer>
      </footer>
    </div>
  );
}

export default App;
