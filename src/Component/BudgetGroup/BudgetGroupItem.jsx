import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import { removeSpace } from "../../utils/utils";
import ProgressBar from "../ProgressBar";

const BudgetGroupItem = ({
  budgetGroupName,
  budgetGroupIndex,
  budgetGroupItemIndex,
  budgetGroupItem,
  updateBudgetGroupItem,
  deleteBudgetGroupItem,
  onChangeHandler
}) => {
  return budgetGroupItem.map((item) => {
    const { id, label, type } = item;
    const grouptItemID = `${budgetGroupName}_${removeSpace(
      label
    )}_${type}_${id}`;
    return (
      <div className="group-item" key={id}>
        <div className="group-item-fields">
          <label className="group-item-fields__label" htmlFor={grouptItemID}>
            {label}:{" "}
          </label>
          <TextField
            id={grouptItemID}
            className="form-control group-item-fields__input"
            type="text"
            name={grouptItemID}
            onChange={onChangeHandler}
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
        <ProgressBar percentage={0} />
        <div className="group-item-action">
          <Button className="group-item-action__Button">Delete Item</Button>
        </div>
      </div>
    );
  });
};
// END: ed8c6549bwf9;

export default BudgetGroupItem;
