import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import PopOverMenu from "../PopOverMenu/PopOverMenu";
import Button from "../Button/Button";
import "./styles/BudgetGroupHeader.css";

const BudgetGroupHeader = ({
  budgetGroupName,
  handleToggle,
  hideContentFlag,
  handleHeaderClick,
}) => {
  const [showPopOver, setShowShowPopOver] = useState(false);
  const popOverHandler = (event) => {
    event.preventDefault();
    setShowShowPopOver((prevShowPopOver) => !prevShowPopOver);
  };
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
        <Button variation="transparent" onClickHandler={popOverHandler}>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            size="1x"
            title="open pop over menu"
          />
        </Button>
        {showPopOver && (
          <PopOverMenu
            menuList={[
              { icon: faPen, title: "Edit budget group" },
              { icon: faTrashCan, title: "Delete budget group" },
            ]}
          />
        )}
      </div>
    </div>
  );
};
export default BudgetGroupHeader;
