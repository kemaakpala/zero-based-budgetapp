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
import type { EnrichedBudgetItem } from "../../utils/budgetStore/types";

export interface DebtItemRowProps {
  item: EnrichedBudgetItem;
  onSaveField: (id: string, fieldName: string, value: string | number) => void;
  onRecordPaymentClick: (item: EnrichedBudgetItem) => void;
  onViewPaymentsClick: (item: EnrichedBudgetItem) => void;
  onEditDebtClick: (item: EnrichedBudgetItem) => void;
  onDeleteItemClick: (id: string) => void;
}

const DebtItemRow = ({
  item,
  onSaveField,
  onRecordPaymentClick,
  onViewPaymentsClick,
  onEditDebtClick,
  onDeleteItemClick,
}: DebtItemRowProps) => {
  const {
    id,
    name: itemName,
    assigned,
    outstandingBalance = 0,
    spent = 0,
    isPaidOff,
  } = item;
  const [showPopOver, setShowPopOver] = useState(false);

  const popOverHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPopOver((prev) => !prev);
  };

  const closePopOver = () => {
    setShowPopOver(false);
  };

  return (
    <div
      className={`debt-item-row ${isPaidOff ? "debt-item-row--paid-off" : ""}`}
    >
      {/* Name */}
      <div className="debt-item-cell debt-item-name">
        <span className={isPaidOff ? "debt-name--strikethrough" : ""}>
          {itemName}
        </span>
      </div>

      {/* Balance */}
      <div className="debt-item-cell debt-item-balance">
        <span className="debt-item-value">
          £
          {(typeof outstandingBalance === "number"
            ? outstandingBalance
            : parseFloat(String(outstandingBalance)) || 0
          ).toFixed(2)}
        </span>
      </div>

      {/* Planned (editable) */}
      <div className="debt-item-cell debt-item-planned">
        <EditableField
          value={assigned.toFixed(2)}
          onSave={(v) => onSaveField(id, "assigned", v)}
          type="number"
          prefix="£"
          placeholder="0.00"
        />
      </div>

      {/* Paid so far */}
      <div className="debt-item-cell debt-item-paid">
        <span className="debt-item-value">£{(spent || 0).toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="debt-item-cell debt-item-action">
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
            width="11.5rem"
            left="-6.0rem"
            menuList={[
              {
                icon: faCoins,
                title: "Record Payment",
                description: "Record Payment",
                action: () => {
                  closePopOver();
                  onRecordPaymentClick(item);
                },
              },
              {
                icon: faList,
                title: "View Payments",
                description: "View Payments",
                action: () => {
                  closePopOver();
                  onViewPaymentsClick(item);
                },
              },
              {
                icon: faPen,
                title: "Edit Debt",
                description: "Edit Debt",
                action: () => {
                  closePopOver();
                  onEditDebtClick(item);
                },
              },
              {
                icon: faTrashCan,
                title: "Delete Debt",
                description: "Delete Debt",
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
  );
};

export default DebtItemRow;
