import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import BudgetGroup from "../BudgetGroup/BudgetGroup";
import BudgetGroupItem from "../BudgetGroup/BudgetGroupItem";
import BudgetGroupActions from "../BudgetGroup/BudgetGroupActions";
import SavingsItemRow from "./SavingsItemRow";
import "./styles/SavingsGroup.css";

const SavingsGroup = ({
  budgetGroup,
  onSaveField,
  onRecordPaymentClick,
  onViewPaymentsClick,
  onEditSavingsClick,
  onDeleteItemClick,
  onAddSavingsClick,
}) => {
  const { name, budgetGroupItems } = budgetGroup;
  const columns = [{ name: "Assigned" }, { name: "To Save" }];

  return (
    <BudgetGroup
      name={name}
      columns={columns}
      className="savings-group-container"
      headerActions={null}
      footerActions={
        <BudgetGroupActions>
          <div className="debt-footer-left">
            <Button
              className="form-control group-actions__Button"
              variation="transparent"
              onClickHandler={onAddSavingsClick}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Savings Goal
            </Button>
          </div>
        </BudgetGroupActions>
      }
    >
      <BudgetGroupItem>
        {budgetGroupItems.map((item) => (
          <SavingsItemRow
            key={item.id}
            item={item}
            onSaveField={onSaveField}
            onRecordPaymentClick={onRecordPaymentClick}
            onViewPaymentsClick={onViewPaymentsClick}
            onEditSavingsClick={onEditSavingsClick}
            onDeleteItemClick={onDeleteItemClick}
          />
        ))}
      </BudgetGroupItem>
    </BudgetGroup>
  );
};

SavingsGroup.propTypes = {
  budgetGroup: PropTypes.shape({
    name: PropTypes.string.isRequired,
    budgetGroupItems: PropTypes.array.isRequired,
  }).isRequired,
  onSaveField: PropTypes.func.isRequired,
  onRecordPaymentClick: PropTypes.func.isRequired,
  onViewPaymentsClick: PropTypes.func.isRequired,
  onEditSavingsClick: PropTypes.func.isRequired,
  onDeleteItemClick: PropTypes.func.isRequired,
  onAddSavingsClick: PropTypes.func.isRequired,
};

export default SavingsGroup;
