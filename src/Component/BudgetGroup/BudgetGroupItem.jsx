import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faCoins,
  faTrashCan,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import TextField from "../TextField/TextField";
import ProgressBar from "../ProgressBar";
import { removeSpace } from "../../utils/utils";
import "./styles/BudgetGroupItem.css";
import PopOverMenu from "../PopOverMenu/PopOverMenu";

const BudgetGroupItem = ({
  budgetGroupName,
  groupIndex,
  budgetGroupItems,
  onChangeHandler,
  onBlurHandler,
  onAddTransactionClick,
  onViewTransactionsClick,
  onDeleteItemClick,
}) => {
  const [showPopOver, setShowShowPopOver] = useState({});

  const popOverHandler = (event, id) => {
    event.preventDefault();
    setShowShowPopOver((prevShowPopOver) => ({
      ...prevShowPopOver,
      [id]: !prevShowPopOver[id],
    }));
  };

  const closePopOver = (id) => {
    setShowShowPopOver((prevShowPopOver) => ({
      ...prevShowPopOver,
      [id]: false,
    }));
  };

  return budgetGroupItems.map((item, itemIndex) => {
    const { id, fields, status } = item;
    
    // Calculate progress for this budget item
    const assignedField = fields.find((f) => f.label.toLowerCase() === "assigned");
    const assigned = assignedField ? parseFloat(assignedField.value) || 0 : 0;
    const spent = item.spent || 0;
    const progress = assigned > 0 ? (spent / assigned) * 100 : 0;
    const isOverspent = spent > assigned;

    return (
      <React.Fragment key={id}>
        <div className="group-item">
          {fields.length > 0 &&
            fields.map((field, fieldIndex) => {
              const { label, value, placeholder, type } = field;
              const grouptItemID = `${budgetGroupName}_${removeSpace(
                label
              )}_${type}_${id}`;
              
              // Determine if we should show a numeric field prefix
              const isNameField = label.toLowerCase() !== "assigned" && label.toLowerCase() !== "planned" && label.toLowerCase() !== "received";

              return (
                <div className="group-item-column group-item-fields" key={grouptItemID}>
                  <label
                    className="group-item-fields__label"
                    htmlFor={grouptItemID}
                  >
                    {field.label !== "" && `${field.label}:`}
                  </label>
                  <TextField
                    id={grouptItemID}
                    className="form-control group-item-fields__input"
                    type={type}
                    name={grouptItemID}
                    defaultVal={value}
                    placeholder={placeholder}
                    onChange={(e) =>
                      onChangeHandler(groupIndex, itemIndex, fieldIndex, e.target.value)
                    }
                    onBlur={(e) => {
                      onBlurHandler(groupIndex, itemIndex, fieldIndex, e.target.value);
                    }}
                  />
                </div>
              );
            })}
          {status?.length > 0 &&
            status.map(({ label, value, type }) => {
              const grouptItemID = `${budgetGroupName}_${removeSpace(
                label
              )}_${type}_${id}`;
              const numericValue = parseFloat(value) || 0;
              const isNegative = numericValue < 0;
              
              return (
                <div
                  className="group-item-column group-item-status"
                  key={grouptItemID}
                >
                  <p className={`group-item-status__text ${isNegative ? "group-item-status__text--negative" : ""}`}>
                    £{value}
                  </p>
                </div>
              );
            })}

          <div className="group-item-column group-item-action">
            <Button
              className="group-item-action__Button"
              variation="transparent"
              onClickHandler={(e) => popOverHandler(e, id)}
            >
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size="1x"
                title="open pop over menu"
              />
            </Button>

            {showPopOver[id] && (
              <PopOverMenu
                width="11.5rem"
                left="-6.0rem"
                menuList={[
                  {
                    icon: faCoins,
                    title: `Add Transaction`,
                    description: `Add Transaction`,
                    action: () => {
                      closePopOver(id);
                      onAddTransactionClick(groupIndex, itemIndex, item);
                    }
                  },
                  {
                    icon: faList,
                    title: `View Transactions`,
                    description: `View Transactions`,
                    action: () => {
                      closePopOver(id);
                      onViewTransactionsClick(groupIndex, itemIndex, item);
                    }
                  },
                  {
                    icon: faTrashCan,
                    title: `Delete Item`,
                    description: `Delete Item`,
                    action: () => {
                      closePopOver(id);
                      onDeleteItemClick(groupIndex, itemIndex);
                    }
                  },
                ]}
              />
            )}
          </div>
        </div>
        <ProgressBar percentage={progress} isOverspent={isOverspent} />
      </React.Fragment>
    );
  });
};

BudgetGroupItem.propTypes = {
  budgetGroupName: PropTypes.string.isRequired,
  groupIndex: PropTypes.number.isRequired,
  budgetGroupItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
          placeholder: PropTypes.string,
          type: PropTypes.string,
        })
      ),
      status: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
          type: PropTypes.string,
        })
      ),
      type: PropTypes.string,
    })
  ).isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onBlurHandler: PropTypes.func.isRequired,
  onAddTransactionClick: PropTypes.func.isRequired,
  onViewTransactionsClick: PropTypes.func.isRequired,
  onDeleteItemClick: PropTypes.func.isRequired,
};

export default BudgetGroupItem;
