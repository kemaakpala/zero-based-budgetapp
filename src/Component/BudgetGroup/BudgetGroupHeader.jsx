import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import PopOverMenu from "../PopOverMenu/PopOverMenu";
import Button from "../Button/Button";
import "./styles/BudgetGroupHeader.css";

const BudgetGroupHeader = ({
  budgetGroupName,
  handleToggle,
  handlePopOver,
  hideContentFlag,
  handleHeaderClick,
  showPopOver,
}) => {
  console.log("BudgetGroupHeader[showPopOver]", showPopOver);
  return (
    <div className="group-header">
      <div
        className="group-header-column group-header-title"
        role="button"
        onClick={handleHeaderClick}
      >
        <h3>{budgetGroupName}</h3>

        <Button variation="transparent" onClickHandler={handleToggle}>
          <FontAwesomeIcon
            icon={hideContentFlag ? faChevronUp : faChevronDown}
            size="1x"
            title="budget group collapse toggle"
          />
        </Button>
      </div>
      <div className="group-header-column group-header-field-title">
        <h3>Planned</h3>
      </div>
      <div className="group-header-column group-header-field-title">
        <h3>Received</h3>
      </div>
      <div className="group-header-column">
        <Button variation="transparent" onClickHandler={handlePopOver}>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            size="1x"
            title="budget group collapse toggle"
          />
        </Button>
        {showPopOver && <PopOverMenu />}
      </div>
    </div>
  );
};
export default BudgetGroupHeader;
