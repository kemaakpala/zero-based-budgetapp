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
}) => {
  const { name, columns, budgetGroupItems } = budgetGroup;
  const [hideContent, setHideContent] = useState(false);

  const clickHandler = (event) => {
    event.preventDefault();
    setHideContent((prevHideContent) => !prevHideContent);
  };

  const groupHeaderTitleClickHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="group-container">
      <BudgetGroupHeader
        budgetGroupName={name}
        columns={columns}
        handleToggle={clickHandler}
        handleHeaderClick={groupHeaderTitleClickHandler}
        hideContentFlag={hideContent}
      />
      <div
        className={`group-content ${
          hideContent ? "group-content--hidden" : ""
        }`}
      >
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
      </div>
      <BudgetGroupActions onAddItemClick={onAddItemClick} />
    </div>
  );
};

export default BudgetGroup;
