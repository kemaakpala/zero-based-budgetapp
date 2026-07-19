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
import EditableField from "../EditableField/EditableField";
import ProgressBar from "../ProgressBar";
import { removeSpace } from "../../utils/utils";
import "./styles/BudgetGroupItem.css";
import PopOverMenu from "../PopOverMenu/PopOverMenu";

const BudgetGroupItem = ({
  budgetGroupName,
  groupIndex,
  budgetGroupItems,
  onSaveField,
  onAddTransactionClick,
  onViewTransactionsClick,
  onDeleteItemClick,
  children,
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

  if (children) {
    return <>{children}</>;
  }

  return budgetGroupItems.map((item, itemIndex) => {
    const { id, name, assigned, spent = 0, status } = item;

    // Calculate progress for this budget item
    const progress = assigned > 0 ? (spent / assigned) * 100 : 0;
    const isOverspent = spent > assigned;

    return (
      <React.Fragment key={id}>
        <div className="group-item">
          {/* Name Field */}
          <div className="group-item-column group-item-fields group-item-name">
            <EditableField
              value={name}
              onSave={(v) => onSaveField(id, "name", v)}
              placeholder="Item Name"
            />
          </div>

          {/* Assigned Field */}
          <div className="group-item-column group-item-fields group-item-assigned">
            <EditableField
              value={assigned.toFixed(2)}
              onSave={(v) => onSaveField(id, "assigned", v)}
              type="number"
              prefix="£"
              placeholder="0.00"
            />
          </div>

          {/* Derived Status Display */}
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
                  <p
                    className={`group-item-status__text ${isNegative ? "group-item-status__text--negative" : ""}`}
                  >
                    £{value}
                  </p>
                </div>
              );
            })}

          {/* Popover Action Button */}
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
                    },
                  },
                  {
                    icon: faList,
                    title: `View Transactions`,
                    description: `View Transactions`,
                    action: () => {
                      closePopOver(id);
                      onViewTransactionsClick(groupIndex, itemIndex, item);
                    },
                  },
                  {
                    icon: faTrashCan,
                    title: `Delete Item`,
                    description: `Delete Item`,
                    action: () => {
                      closePopOver(id);
                      onDeleteItemClick(id);
                    },
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
  budgetGroupName: PropTypes.string,
  groupIndex: PropTypes.number,
  budgetGroupItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      assigned: PropTypes.number.isRequired,
      status: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
          type: PropTypes.string,
        })
      ),
      type: PropTypes.string,
    })
  ),
  onSaveField: PropTypes.func,
  onAddTransactionClick: PropTypes.func,
  onViewTransactionsClick: PropTypes.func,
  onDeleteItemClick: PropTypes.func,
  children: PropTypes.node,
};

export default BudgetGroupItem;
