import React from "react";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/BudgetGroupHeader.css";

const BudgetGroupHeader = ({
  budgetGroupName,
  handleToggle,
  hideContentFlag,
  showDeleteButtonFlag,
  handleHeaderClick,
}) => {
  return (
    <div className="group-header">
      <div
        className="group-header-title"
        role="button"
        onClick={handleHeaderClick}
      >
        <h3>{budgetGroupName}</h3>
        {showDeleteButtonFlag && (
          <Button variation="transparent" color="red">
            <FontAwesomeIcon
              icon={faTrashCan}
              size="1x"
              title="delete budget group"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Button>
        )}
      </div>
      <Button variation="transparent" onClickHandler={handleToggle}>
        <FontAwesomeIcon
          icon={hideContentFlag ? faChevronUp : faChevronDown}
          size="1x"
          title="budget group collapse toggle"
        />
      </Button>
    </div>
  );
};
export default BudgetGroupHeader;
