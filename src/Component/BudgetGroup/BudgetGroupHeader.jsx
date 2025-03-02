import React from "react";
import "./styles/BudgetGroupHeader.css";

const BudgetGroupHeader = ({ budgetGroupName }) => {
  return (
    <div className="group-header">
      <h3>{budgetGroupName}</h3>
    </div>
  );
};
export default BudgetGroupHeader;
