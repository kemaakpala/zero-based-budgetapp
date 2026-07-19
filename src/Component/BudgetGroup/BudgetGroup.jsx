import React, { useState } from "react";
import PropTypes from "prop-types";
import "./styles/BudgetGroup.css";
import BudgetGroupHeader from "./BudgetGroupHeader";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";

const BudgetGroup = ({
  budgetGroup,
  groupIndex,
  onSaveField,
  onAddTransactionClick,
  onViewTransactionsClick,
  onDeleteItemClick,
  onAddItemClick,
  onRenameGroupClick,
  onDeleteGroupClick,
  // Composition props
  className = "",
  headerActions,
  footerActions,
  children,
  // Additional direct props (for fallback/direct usage)
  name: propName,
  columns: propColumns,
  viewMode = "remaining",
}) => {
  const name = budgetGroup?.name || propName || "";
  const columns = propColumns || [
    { name: "Assigned" },
    { name: viewMode === "spent" ? "Spent" : "Remaining" },
  ];
  const budgetGroupItems = budgetGroup?.budgetGroupItems || [];
  const [hideContent, setHideContent] = useState(false);

  const clickHandler = (event) => {
    event.preventDefault();
    setHideContent((prevHideContent) => !prevHideContent);
  };

  const groupHeaderTitleClickHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`group-container ${className}`}>
      <BudgetGroupHeader
        budgetGroupName={name}
        columns={columns}
        handleToggle={clickHandler}
        handleHeaderClick={groupHeaderTitleClickHandler}
        hideContentFlag={hideContent}
        onRenameGroupClick={() => onRenameGroupClick?.(groupIndex, name)}
        onDeleteGroupClick={() => onDeleteGroupClick?.(groupIndex, name)}
        actions={headerActions}
      />
      <div
        className={`group-content ${
          hideContent ? "group-content--hidden" : ""
        }`}
      >
        {children || (
          <BudgetGroupItem
            budgetGroupName={name}
            groupIndex={groupIndex}
            budgetGroupItems={budgetGroupItems}
            onSaveField={onSaveField}
            onAddTransactionClick={onAddTransactionClick}
            onViewTransactionsClick={onViewTransactionsClick}
            onDeleteItemClick={onDeleteItemClick}
            hideContentFlag={hideContent}
          />
        )}
      </div>
      {footerActions !== undefined ? (
        footerActions
      ) : (
        <BudgetGroupActions onAddItemClick={onAddItemClick} />
      )}
    </div>
  );
};

BudgetGroup.propTypes = {
  budgetGroup: PropTypes.shape({
    name: PropTypes.string.isRequired,
    budgetGroupItems: PropTypes.array.isRequired,
  }),
  groupIndex: PropTypes.number,
  onSaveField: PropTypes.func,
  onAddTransactionClick: PropTypes.func,
  onViewTransactionsClick: PropTypes.func,
  onDeleteItemClick: PropTypes.func,
  onAddItemClick: PropTypes.func,
  onRenameGroupClick: PropTypes.func,
  onDeleteGroupClick: PropTypes.func,
  className: PropTypes.string,
  headerActions: PropTypes.node,
  footerActions: PropTypes.node,
  children: PropTypes.node,
  name: PropTypes.string,
  columns: PropTypes.array,
  viewMode: PropTypes.string,
};

export default BudgetGroup;
