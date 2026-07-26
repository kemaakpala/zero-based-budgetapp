import { useState } from "react";
import type { MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faCoins,
  faList,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import EditableField from "../EditableField/EditableField";
import PopOverMenu from "../PopOverMenu/PopOverMenu";
import ProgressBar from "../ProgressBar";
import type { EnrichedBudgetItem } from "../../utils/budgetStore/types";
import "./styles/SavingsGroup.css";

export interface SavingsItemRowProps {
  item: EnrichedBudgetItem;
  onSaveField: (id: string, fieldName: string, value: string | number) => void;
  onRecordPaymentClick: (item: EnrichedBudgetItem) => void;
  onViewPaymentsClick: (item: EnrichedBudgetItem) => void;
  onEditSavingsClick: (item: EnrichedBudgetItem) => void;
  onDeleteItemClick: (id: string) => void;
}

const SavingsItemRow = ({
  item,
  onSaveField,
  onRecordPaymentClick,
  onViewPaymentsClick,
  onEditSavingsClick,
  onDeleteItemClick,
}: SavingsItemRowProps) => {
  const { id, name: itemName, assigned, goal = 0, currentBalance = 0 } = item;
  const [showPopOver, setShowPopOver] = useState(false);

  const popOverHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPopOver((prev) => !prev);
  };

  const closePopOver = () => {
    setShowPopOver(false);
  };

  // Option C: Overall Progress percentage for the progress bar tooltip
  const progressPercent =
    goal > 0 ? Math.min(Math.round((currentBalance / goal) * 100), 100) : 0;

  return (
    <div className="savings-item-row-wrapper">
      <div className="savings-item-row">
        {/* Name */}
        <div className="savings-item-cell savings-item-name">
          <span>{itemName}</span>
        </div>

        {/* Assigned (editable) */}
        <div className="savings-item-cell savings-item-assigned">
          <EditableField
            value={assigned.toFixed(2)}
            onSave={(v) => onSaveField(id, "assigned", v)}
            type="number"
            prefix="£"
            placeholder="0.00"
          />
        </div>

        {/* To Save */}
        <div className="savings-item-cell savings-item-tosave">
          <span className="savings-item-value">
            £
            {(typeof item.toSave === "number"
              ? item.toSave
              : parseFloat(String(item.toSave)) || 0
            ).toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="savings-item-cell savings-item-action">
          <Button
            className="group-item-action__Button"
            variation="transparent"
            onClickHandler={popOverHandler}
          >
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size="1x"
              title="open pop over menu"
            />
          </Button>

          {showPopOver && (
            <PopOverMenu
              width="12.5rem"
              left="-7.0rem"
              menuList={[
                {
                  icon: faCoins,
                  title: "Add Transaction",
                  description: "Add Transaction",
                  action: () => {
                    closePopOver();
                    onRecordPaymentClick(item);
                  },
                },
                {
                  icon: faList,
                  title: "View Transactions",
                  description: "View Transactions",
                  action: () => {
                    closePopOver();
                    onViewPaymentsClick(item);
                  },
                },
                {
                  icon: faPen,
                  title: "Edit Goal",
                  description: "Edit Goal",
                  action: () => {
                    closePopOver();
                    onEditSavingsClick(item);
                  },
                },
                {
                  icon: faTrashCan,
                  title: "Delete Goal",
                  description: "Delete Goal",
                  action: () => {
                    closePopOver();
                    onDeleteItemClick(id);
                  },
                },
              ]}
            />
          )}
        </div>
      </div>

      {/* Progress Bar with Title Tooltip */}
      <div
        className="savings-item-progress-wrapper"
        title={`${progressPercent}% saved`}
      >
        <ProgressBar percentage={progressPercent} />
      </div>
    </div>
  );
};

export default SavingsItemRow;
