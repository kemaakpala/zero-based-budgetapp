import React, { useState } from "react";
import "./styles/BudgetGroup.css";
import BudgetGroupHeader from "./BudgetGroupHeader";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";

const BudgetGroup = ({ budgetGroup, onChangeHandler }) => {
  const { name, budgetGroupItems } = budgetGroup;
  console.log("name", name);
  const [hideContent, setHideContent] = useState(false);
  const [showPopOver, setShowShowPopOver] = useState(false);

  const clickHandler = (event) => {
    event.preventDefault();
    setHideContent((prevHideContent) => !prevHideContent);
  };

  const popOverHandler = (event) => {
    event.preventDefault();
    setShowShowPopOver((prevShowPopOver) => !prevShowPopOver);
  };
  const deleteGroupHandler = (event) => {
    // console.log("delete group:", event.target.previousSibling.textContent);
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
        handleToggle={clickHandler}
        handlePopOver={popOverHandler}
        handleHeaderClick={groupHeaderTitleClickHandler}
        hideContentFlag={hideContent}
        showPopOver={showPopOver}
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
        />
      </div>
      <BudgetGroupActions />
    </div>
  );
};
export default BudgetGroup;
