import React, { useState } from "react";
import "./styles/BudgetGroup.css";
import BudgetGroupHeader from "./BudgetGroupHeader";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";

const BudgetGroup = ({
  budgetGroup,
  groupIndex,
  onChangeHandler,
  onBlurHandler,
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
}) => {
  const name = budgetGroup?.name || propName || "";
  const columns = budgetGroup?.columns || propColumns || [];
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
            onChangeHandler={onChangeHandler}
            onBlurHandler={onBlurHandler}
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

export default BudgetGroup;
