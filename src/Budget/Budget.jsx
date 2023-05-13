import { Button } from "../Component";

function Budget() {
  return (
    <form className="form">
      <div className="group-container">
        <div className="group-header">
          <h3>Income</h3>
        </div>
        <div className="group-item">
          <div className="group-item-fields">
            <label className="group-item-fields__label" htmlFor="primaryIncome">
              Salary 1
            </label>
            <input
              id="primaryIncome"
              className="form-control primary-income-fields__input"
              type="text"
              name="income_primary"
              value=""
            />
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
            <Button classModifier="secondary">Delete Item</Button>
          </div>
        </div>
        <div className="group-item">
          <div className="group-item-fields">
            <label
              className="secondary-income-fields__label"
              htmlFor="secondaryIncome1"
            >
              Salary 2
            </label>
            <input
              className="form-control secondary-income-fields__input"
              id="secondaryIncome1"
              type="text"
              name="income_secondary"
              value=""
            />
          </div>
        </div>
      </div>
      <div className="group-container">
        <div className="group-header">
          <h3>Giving</h3>
        </div>
        <div className="group-item">
          <div className="group-item-fields">
            <label
              className="group-item-fields__label"
              htmlFor="giving_charity"
            >
              Charity:{" "}
            </label>
            <input
              id="giving_charity"
              className="form-control group-item-fields__input"
              type="text"
              name="giving_charity"
              value=""
            />
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
            <Button classModifier="secondary">Delete Item</Button>
          </div>
        </div>
        <div className="group-actions">
          <Button className="form-control group-actions__Button">
            Add New Group Item
          </Button>
          <Button className="form-control group-actions__Button">
            Delete Group
          </Button>
        </div>
      </div>
      <div className="group-container">
        <div className="group-header">
          <h3>Savings</h3>
        </div>
        <div className="group-item">
          <div className="group-item-fields">
            <label
              className="group-item-fields__label"
              htmlFor="savings_emergency_fund"
            >
              Emergency Fund:{" "}
            </label>
            <input
              id="savings_emergency_fund"
              className="form-control group-item-fields__input"
              type="text"
              name="savings_emergency_fund"
              value=""
            />
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
            <Button className="group-item-action__Button">Delete Item</Button>
          </div>
        </div>
        <div className="group-actions">
          <Button className="form-control group-actions__Button">
            Add New Group Item
          </Button>
          <Button classModifier="secondary">
            Delete Group
          </Button>
        </div>
      </div>
      <div className="group-container">
        <div className="group-header">
          <h3>Housing</h3>
        </div>
        <div className="group-item">
          <div className="group-item-fields">
            <label
              className="group-item-fields__label"
              htmlFor="housing_rent_mortgage"
            >
              Rent / Mortgage:{" "}
            </label>
            <input
              id="housing_rent_mortgage"
              className="form-control group-item-fields__input"
              type="text"
              name="housing_rent_mortgage"
              value=""
            />
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
            <Button className="group-item-action__Button">Delete Item</Button>
          </div>
        </div>
        <div className="group-actions">
          <Button className="form-control group-actions__Button">
            Add New Group Item
          </Button>
          <Button classModifier="secondary">
            Delete Group
          </Button>
        </div>
      </div>
      <div className="group-container">
        <div className="group-header">
          <h3>Food</h3>
        </div>
        <div className="group-item">
          <div className="group-item-fields">
            <label
              className="group-item-fields__label"
              htmlFor="food_groceries"
            >
              Groceries:{" "}
            </label>
            <input
              id="food_groceries"
              className="form-control group-item-fields__input"
              type="text"
              name="food_groceries"
              value=""
            />
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
            <Button classModifier="secondary">Delete Item</Button>
          </div>
        </div>
        <div className="group-actions">
          <Button className="form-control group-actions__Button">
            Add New Group Item
          </Button>
          <Button classModifier="secondary">
            Delete Group
          </Button>
        </div>
      </div>
      <div className="group-container">
        <div className="group-header">
          <h3>Transport</h3>
        </div>
        <div className="group-item">
          <div className="group-item-fields">
            <label className="group-item-fields__label" htmlFor="transport_tfl">
              TFL:{" "}
            </label>
            <input
              id="transport_tfl"
              className="form-control group-item-fields__input"
              type="text"
              name="transport_tfl"
              value=""
            />
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
            <Button className="group-item-action__Button">Delete Item</Button>
          </div>
        </div>
        <div className="group-actions">
          <Button className="form-control group-actions__Button">
            Add New Group Item
          </Button>
          <Button classModifier="secondary">
            Delete Group
          </Button>
        </div>
      </div>
      <div className="group-container">
        <div className="group-header">
          <h3>Insurance</h3>
        </div>
        <div className="group-item">
          <div className="group-item-fields">
            <label
              className="group-item-fields__label"
              htmlFor="insurance_life"
            >
              Life:{" "}
            </label>
            <input
              id="insurance_life"
              className="form-control group-item-fields__input"
              type="text"
              name="insurance_life"
              value=""
            />
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
            <Button classModifier="secondary">Delete Item</Button>
          </div>
        </div>
        <div className="group-actions">
          <Button className="form-control group-actions__Button">
            Add New Group Item
          </Button>
          <Button classModifier="secondary">
            Delete Group
          </Button>
        </div>
      </div>
      <div className="form-actions">
        <Button className="form-control form-actions__Button">
          Add New Group
        </Button>
        <Button classNam="form-control form-actions__Button">
          Submit Budget
        </Button>
      </div>
    </form>
  );
}

export default Budget;