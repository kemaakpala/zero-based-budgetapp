import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import TextField from "../TextField/TextField";
import { removeSpace } from "../../utils/utils";
import "./styles/BudgetGroupItem.css";

const BudgetGroupItem = ({
  budgetGroupName,
  budgetGroupItems,
  onChangeHandler,
}) => {
  console.log("budgetGroupItems", budgetGroupItems);
  return budgetGroupItems.map((item, itemIndex) => {
    const { id, fields, status, action, type } = item;
    return (
      <div className="group-item">
        {fields.length > 0 &&
          fields.map((field, fieldIndex) => {
            const { label, value, placeholder, type } = field;
            const grouptItemID = `${budgetGroupName}_${removeSpace(
              label
            )}_${type}_${id}`;
            return (
              <div className="group-item-fields">
                <label
                  className="group-item-fields__label"
                  htmlFor={grouptItemID}
                >
                  {field.label}:{" "}
                </label>
                <TextField
                  id={grouptItemID}
                  className="form-control group-item-fields__input"
                  type={type}
                  name={grouptItemID}
                  defaultVal={value}
                  placeholder={placeholder}
                  onChange={(e) =>
                    onChangeHandler(itemIndex, fieldIndex, e.target.value)
                  }
                />
              </div>
            );
          })}
        {status?.length > 0 &&
          status.map(({ label, value, type }) => {
            const grouptItemID = `${budgetGroupName}_${removeSpace(
              label
            )}_${type}_${id}`;
            return (
              <div className="group-item-status" key={grouptItemID}>
                <h4 className="group-item-status__header">{label}</h4>
                <p className="group-item-status__text">£{value}</p>
              </div>
            );
          })}
        {action && (
          <div className="group-item-action">
            <Button
              className="group-item-action__Button"
              classModifier="transparent"
              color={action.color}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                size="1x"
                title="delete budget item"
              />
            </Button>
          </div>
        )}
      </div>
    );
  });
};

export default BudgetGroupItem;
