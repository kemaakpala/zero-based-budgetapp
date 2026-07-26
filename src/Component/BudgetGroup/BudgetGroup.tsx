import { useState } from "react";
import type { ReactNode, MouseEvent } from "react";
import "./styles/BudgetGroup.css";
import BudgetGroupHeader from "./BudgetGroupHeader";
import type { BudgetGroupColumnHeader } from "./BudgetGroupHeader";
import BudgetGroupActions from "./BudgetGroupActions";
import BudgetGroupItem from "./BudgetGroupItem";
import type {
  EnrichedBudgetGroup,
  EnrichedBudgetItem,
} from "../../utils/budgetStore/types";

export interface BudgetGroupProps {
  budgetGroup?:
    | EnrichedBudgetGroup
    | { name: string; budgetGroupItems: unknown[] };
  groupIndex?: number;
  onSaveField?: (
    itemId: string,
    fieldName: string,
    value: string | number
  ) => void;
  onAddTransactionClick?: (
    groupIndex?: number,
    itemIndex?: number,
    item?: EnrichedBudgetItem
  ) => void;
  onViewTransactionsClick?: (
    groupIndex?: number,
    itemIndex?: number,
    item?: EnrichedBudgetItem
  ) => void;
  onDeleteItemClick?: (itemId: string) => void;
  onAddItemClick?: (groupIndex?: number) => void;
  onRenameGroupClick?: (groupIndex?: number, newName?: string) => void;
  onDeleteGroupClick?: (groupIndex?: number, groupName?: string) => void;
  className?: string;
  headerActions?: ReactNode;
  footerActions?: ReactNode;
  children?: ReactNode;
  name?: string;
  columns?: BudgetGroupColumnHeader[];
  viewMode?: string;
  progress?: number;
}

const BudgetGroup = ({
  budgetGroup,
  groupIndex,
  onSaveField,
  onAddTransactionClick,
  onViewTransactionsClick,
  onDeleteItemClick,
  onAddItemClick,
  onRenameGroupClick,
  onDeleteGroupClick,
  className = "",
  headerActions,
  footerActions,
  children,
  name: propName,
  columns: propColumns,
  viewMode = "remaining",
}: BudgetGroupProps) => {
  const name = budgetGroup?.name || propName || "";
  const columns = propColumns || [
    { name: "Assigned" },
    { name: viewMode === "spent" ? "Spent" : "Remaining" },
  ];
  const budgetGroupItems = (budgetGroup?.budgetGroupItems ||
    []) as EnrichedBudgetItem[];
  const [hideContent, setHideContent] = useState(false);

  const clickHandler = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setHideContent((prevHideContent) => !prevHideContent);
  };

  const groupHeaderTitleClickHandler = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={`group-container ${className}`}>
      <BudgetGroupHeader
        budgetGroupName={name}
        columns={columns}
        handleToggle={clickHandler}
        handleHeaderClick={groupHeaderTitleClickHandler}
        hideContentFlag={hideContent}
        onRenameGroupClick={() => onRenameGroupClick?.(groupIndex, name)}
        onDeleteGroupClick={() => onDeleteGroupClick?.(groupIndex, name)}
        actions={headerActions}
      />
      <div
        className={`group-content ${
          hideContent ? "group-content--hidden" : ""
        }`}
      >
        {children || (
          <BudgetGroupItem
            budgetGroupName={name}
            groupIndex={groupIndex}
            budgetGroupItems={budgetGroupItems}
            onSaveField={onSaveField}
            onAddTransactionClick={onAddTransactionClick}
            onViewTransactionsClick={onViewTransactionsClick}
            onDeleteItemClick={onDeleteItemClick}
            hideContentFlag={hideContent}
          />
        )}
      </div>
      {footerActions !== undefined ? (
        footerActions
      ) : (
        <BudgetGroupActions
          onAddItemClick={() => onAddItemClick?.(groupIndex)}
        />
      )}
    </div>
  );
};

export default BudgetGroup;
