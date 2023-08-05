import React from "react";
import "./styles/BudgetGroup.css";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";

const BudgetGroup = ({ budgetGroup, budgetGroupIndex, budgetGroupTotal }) => {
  const {
    name,
    budgetGroupItem,
  } = budgetGroup;
  return (
    <div className="group-container">
      <div className="group-header">
        <h3>{name}</h3>
      </div>
      <BudgetGroupItem budgetGroupItem={budgetGroupItem}/>
      <BudgetGroupActions />
    </div>
  );
};
export default BudgetGroup;
