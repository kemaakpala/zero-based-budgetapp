import React, { useState } from "react";
import PropTypes from "prop-types";
import "./styles/BudgetGroup.css";
import BudgetGroupHeader from "./BudgetGroupHeader";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";

const BudgetGroup = ({ budgetGroup, onChangeHandler, onBlurHandler }) => {
  const { name, columns, budgetGroupItems } = budgetGroup;
  const [hideContent, setHideContent] = useState(false);

  const clickHandler = (event) => {
    event.preventDefault();
    setHideContent((prevHideContent) => !prevHideContent);
  };

  const groupHeaderTitleClickHandler = (event) => {
    event.preventDefault();
    // console.log("event", event);
    // console.log("event", event.target.tagName);
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
          budgetGroupItems={budgetGroupItems}
          onChangeHandler={onChangeHandler}
          onBlurHandler={onBlurHandler}
          hideContentFlag={hideContent}
        />
      </div>
      <BudgetGroupActions />
    </div>
  );
};

BudgetGroup.propTypes = {};
export default BudgetGroup;
