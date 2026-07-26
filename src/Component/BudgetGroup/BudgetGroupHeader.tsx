import { useState } from "react";
import type { ReactNode, MouseEvent } from "react";
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

export interface BudgetGroupColumnHeader {
  name: string;
}

export interface BudgetGroupHeaderProps {
  budgetGroupName: string;
  columns: BudgetGroupColumnHeader[];
  handleToggle: (e?: MouseEvent<HTMLButtonElement>) => void;
  hideContentFlag: boolean;
  handleHeaderClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onRenameGroupClick: () => void;
  onDeleteGroupClick: () => void;
  actions?: ReactNode;
}

const BudgetGroupHeader = ({
  budgetGroupName,
  columns,
  handleToggle,
  hideContentFlag,
  handleHeaderClick,
  onRenameGroupClick,
  onDeleteGroupClick,
  actions,
}: BudgetGroupHeaderProps) => {
  const [showPopOver, setShowShowPopOver] = useState(false);
  const popOverHandler = (event: MouseEvent<HTMLButtonElement>) => {
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
                width="11.5rem"
                left="-6.0rem"
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

export default BudgetGroupHeader;
