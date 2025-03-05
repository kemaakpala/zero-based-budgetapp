import React, { useState } from "react";
import "./styles/BudgetGroup.css";
import BudgetGroupHeader from "./BudgetGroupHeader";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";
import ProgressBar from "../ProgressBar";

const BudgetGroup = ({ budgetGroup, progress, onChangeHandler }) => {
  const { name, budgetGroupItems } = budgetGroup;
  console.log("name", name);
  console.log("BudgetGroup[progress] => ", progress);
  const [hideContent, setHideContent] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const clickHandler = (event) => {
    event.preventDefault();
    setHideContent((prevHideContent) => !prevHideContent);
  };

  const toggleDeleteButton = (event) => {
    event.preventDefault();
    setShowDeleteButton((prevShowDeleteButton) => !prevShowDeleteButton);
  };
  const deleteGroupHandler = (event) => {
    // console.log("delete group:", event.target.previousSibling.textContent);
  };
  const groupHeaderTitleClickHandler = (event) => {
    event.preventDefault();
    // console.log("event", event);
    // console.log("event", event.target.tagName);
    if (event.target.tagName === "H3") {
      toggleDeleteButton(event);
    }
    if (event.target.tagName === "BUTTON") {
      deleteGroupHandler(event);
    }
  };

  return (
    <div className="group-container">
      <BudgetGroupHeader
        budgetGroupName={name}
        handleToggle={clickHandler}
        handleHeaderClick={groupHeaderTitleClickHandler}
        hideContentFlag={hideContent}
        showDeleteButtonFlag={showDeleteButton}
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
      <ProgressBar percentage={progress} />
      <BudgetGroupActions />
    </div>
  );
};
export default BudgetGroup;
