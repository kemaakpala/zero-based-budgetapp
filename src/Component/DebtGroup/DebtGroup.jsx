import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faEllipsisVertical,
  faCoins,
  faList,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import TextField from "../TextField/TextField";
import PopOverMenu from "../PopOverMenu/PopOverMenu";
import "./styles/DebtGroup.css";

const DebtGroup = ({
  budgetGroup,
  onChangeHandler,
  onRecordPaymentClick,
  onViewPaymentsClick,
  onEditDebtClick,
  onDeleteItemClick,
  onAddDebtClick,
}) => {
  const { name, budgetGroupItems } = budgetGroup;
  const [hideContent, setHideContent] = useState(false);
  const [showPaidOff, setShowPaidOff] = useState(false);
  const [showPopOver, setShowPopOver] = useState({});

  const activeItems = budgetGroupItems.filter((item) => !item.isPaidOff);
  const paidOffItems = budgetGroupItems.filter((item) => item.isPaidOff);

  const visibleItems = showPaidOff
    ? [...activeItems, ...paidOffItems]
    : activeItems;

  const popOverHandler = (e, id) => {
    e.preventDefault();
    setShowPopOver((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closePopOver = (id) => {
    setShowPopOver((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="group-container debt-group-container">
      {/* Header */}
      <div className="group-header debt-group-header">
        <div className="group-header-column group-header-title">
          <h3>{name}</h3>
          <Button
            variation="transparent"
            onClickHandler={(e) => {
              e.preventDefault();
              setHideContent((prev) => !prev);
            }}
          >
            <FontAwesomeIcon
              icon={hideContent ? faChevronUp : faChevronDown}
              size="1x"
              title="budget group collapse toggle"
            />
          </Button>
        </div>
        <div className="group-header-column group-header-field-title">
          <h3 className="size1">Balance</h3>
        </div>
        <div className="group-header-column group-header-field-title">
          <h3 className="size1">Planned</h3>
        </div>
        <div className="group-header-column group-header-field-title">
          <h3 className="size1">Paid so far</h3>
        </div>
        <div className="group-header-column" />
      </div>

      {/* Content */}
      <div
        className={`group-content ${hideContent ? "group-content--hidden" : ""}`}
      >
        {visibleItems.map((item) => {
          const {
            id,
            name: itemName,
            assigned,
            outstandingBalance = 0,
            spent = 0,
            isPaidOff,
          } = item;

          return (
            <React.Fragment key={id}>
              <div
                className={`debt-item-row ${isPaidOff ? "debt-item-row--paid-off" : ""}`}
              >
                {/* Name */}
                <div className="debt-item-cell debt-item-name">
                  <span className={isPaidOff ? "debt-name--strikethrough" : ""}>
                    {itemName}
                  </span>
                </div>

                {/* Balance */}
                <div className="debt-item-cell debt-item-balance">
                  <span className="debt-item-value">
                    £{(parseFloat(outstandingBalance) || 0).toFixed(2)}
                  </span>
                </div>

                {/* Planned (editable) */}
                <div className="debt-item-cell debt-item-planned">
                  <TextField
                    id={`debt_Planned_text_${id}`}
                    className="form-control debt-planned-input"
                    type="text"
                    name={`debt_Planned_text_${id}`}
                    defaultVal={assigned.toString()}
                    placeholder="0.00"
                    onChange={(e) =>
                      onChangeHandler(id, "assigned", e.target.value)
                    }
                    onBlur={() => {}}
                  />
                </div>

                {/* Paid so far */}
                <div className="debt-item-cell debt-item-paid">
                  <span className="debt-item-value">£{spent.toFixed(2)}</span>
                </div>

                {/* Actions */}
                <div className="debt-item-cell debt-item-action">
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
                          title: "Record Payment",
                          description: "Record Payment",
                          action: () => {
                            closePopOver(id);
                            onRecordPaymentClick(item);
                          },
                        },
                        {
                          icon: faList,
                          title: "View Payments",
                          description: "View Payments",
                          action: () => {
                            closePopOver(id);
                            onViewPaymentsClick(item);
                          },
                        },
                        {
                          icon: faPen,
                          title: "Edit Debt",
                          description: "Edit Debt",
                          action: () => {
                            closePopOver(id);
                            onEditDebtClick(item);
                          },
                        },
                        {
                          icon: faTrashCan,
                          title: "Delete Debt",
                          description: "Delete Debt",
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
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer */}
      <div className="debt-group-footer">
        <Button
          className="form-control group-actions__Button"
          variation="transparent"
          onClickHandler={onAddDebtClick}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Debt
        </Button>

        {paidOffItems.length > 0 && (
          <button
            type="button"
            className="btn-toggle-paid-off"
            onClick={() => setShowPaidOff((prev) => !prev)}
          >
            {showPaidOff ? "Hide" : "Show"} Paid Off ({paidOffItems.length})
          </button>
        )}
      </div>
    </div>
  );
};

DebtGroup.propTypes = {
  budgetGroup: PropTypes.shape({
    name: PropTypes.string.isRequired,
    budgetGroupItems: PropTypes.array.isRequired,
  }).isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onRecordPaymentClick: PropTypes.func.isRequired,
  onViewPaymentsClick: PropTypes.func.isRequired,
  onEditDebtClick: PropTypes.func.isRequired,
  onDeleteItemClick: PropTypes.func.isRequired,
  onAddDebtClick: PropTypes.func.isRequired,
};

export default DebtGroup;
