import React from "react";
import "./styles/BudgetGroup.css";
import BudgetGroupHeader from "./BudgetGroupHeader";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";
import ProgressBar from "../ProgressBar";

const BudgetGroup = ({ budgetGroup, budgetGroupIndex, budgetGroupTotal }) => {
  const { name, budgetGroupItem } = budgetGroup;
  return (
    <div className="group-container">
      <BudgetGroupHeader budgetGroupName={name} />
      <div className="group-content">
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
