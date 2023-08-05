import TextField from "../TextField/TextField";
import Button from "../Button/Button";

const BudgetGroupItem = ({
  budgetGroup,
  budgetGroupIndex,
  budgetGroupItemIndex,
  budgetGroupItem,
  updateBudgetGroupItem,
  deleteBudgetGroupItem,
}) => {
  return budgetGroupItem.map((item) => {
    const { id, label } = item;
    return (
      <div className="group-item" key={id}>
        <div className="group-item-fields">
          <label
            className="group-item-fields__label"
            htmlFor="savings_emergency_fund"
          >
            {label}:{" "}
          </label>
          <TextField
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
    );
  });
};
// END: ed8c6549bwf9;

export default BudgetGroupItem;
