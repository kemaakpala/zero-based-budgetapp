import React, { useState } from "react";
import "./styles/BudgetGroup.css";
import BudgetGroupHeader from "./BudgetGroupHeader";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";
import ProgressBar from "../ProgressBar";

const BudgetGroup = ({ budgetGroup, budgetGroupIndex, budgetGroupTotal }) => {
  const { name, budgetGroupItem } = budgetGroup;
  const [hideContent, setHideContent] = useState(false);

  const clickHandler = (event) => {
    event.preventDefault();
    setHideContent((prevHideContent) => !prevHideContent);
  };
  return (
    <div className="group-container">
      <BudgetGroupHeader
        budgetGroupName={name}
        handleToggle={clickHandler}
        hideContentFlag={hideContent}
      />
      <div className={`group-content ${hideContent ? "group-content--hidden" : ""}`}>
        <BudgetGroupItem
          budgetGroupName={name}
          budgetGroupItem={budgetGroupItem}
        />
      </div>
      <ProgressBar percentage="0" />
      <BudgetGroupActions />
    </div>
  );
};
export default BudgetGroup;
