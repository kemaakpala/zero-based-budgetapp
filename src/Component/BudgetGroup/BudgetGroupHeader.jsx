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
}) => {
  return (
    <div className="group-header">
      <div className="group-header-title">
        <h3>{budgetGroupName}</h3>
        <Button classModifier="transparent" color="red">
          <FontAwesomeIcon
            icon={faTrashCan}
            size="1x"
            title="delete budget group"
          />
        </Button>
      </div>
      <Button classModifier="transparent" onClickHandler={handleToggle}>
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
