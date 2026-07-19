import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
  faPen,
  faTrashCan,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import PopOverMenu from "../PopOverMenu/PopOverMenu";
import Button from "../Button/Button";
import "./styles/BudgetGroupHeader.css";

const BudgetGroupHeader = ({
  budgetGroupName,
  columns,
  handleToggle,
  hideContentFlag,
  handleHeaderClick,
  onRenameGroupClick,
  onDeleteGroupClick,
  actions,
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
        style={{ display: "flex", alignItems: "center" }}
      >
        <span
          className="grip-handle"
          title="Drag grip handle to reorder group"
          style={{
            marginRight: "0.5rem",
            cursor: "grab",
            color: "var(--clr-text-muted-on-dark)",
          }}
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </span>
        <h3>{budgetGroupName}</h3>

        <Button variation="transparent" onClickHandler={handleToggle}>
          <FontAwesomeIcon
            icon={hideContentFlag ? faChevronUp : faChevronDown}
            size="1x"
            title="budget group collapse toggle"
          />
        </Button>
      </div>
      {columns.map(({ name }) => (
        <div
          key={name}
          className="group-header-column group-header-field-title"
        >
          <h4 className="size2">{name}</h4>
        </div>
      ))}
      <div className="group-header-column">
        {actions !== undefined ? (
          actions
        ) : (
          <>
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
                  {
                    icon: faPen,
                    title: `Edit budget ${budgetGroupName} group`,
                    description: "Edit",
                    action: () => {
                      setShowShowPopOver(false);
                      onRenameGroupClick();
                    },
                  },
                  {
                    icon: faTrashCan,
                    title: `Delete ${budgetGroupName} group`,
                    description: "Delete",
                    action: () => {
                      setShowShowPopOver(false);
                      onDeleteGroupClick();
                    },
                  },
                ]}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

BudgetGroupHeader.propTypes = {
  budgetGroupName: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleToggle: PropTypes.func.isRequired,
  hideContentFlag: PropTypes.bool.isRequired,
  handleHeaderClick: PropTypes.func.isRequired,
  onRenameGroupClick: PropTypes.func.isRequired,
  onDeleteGroupClick: PropTypes.func.isRequired,
  actions: PropTypes.node,
};

export default BudgetGroupHeader;
