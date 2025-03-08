import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faCoins,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import TextField from "../TextField/TextField";
import ProgressBar from "../ProgressBar";
import { removeSpace } from "../../utils/utils";
import "./styles/BudgetGroupItem.css";
import PopOverMenu from "../PopOverMenu/PopOverMenu";

const BudgetGroupItem = ({
  budgetGroupName,
  budgetGroupItems,
  onChangeHandler,
}) => {
  const [showPopOver, setShowShowPopOver] = useState({});

  const popOverHandler = (event, id) => {
    event.preventDefault();
    setShowShowPopOver((prevShowPopOver) => ({
      ...prevShowPopOver,
      [id]: !prevShowPopOver[id],
    }));
  };

  return budgetGroupItems.map((item, itemIndex) => {
    const { id, fields, status, type } = item;
    // Calculate progress for each budget group
    const calculateProgress = (group) => {
      // console.log(`calculateProgress[group: ${group.type}]`, group);
      // console.log("[...group.fields, ...group?.status || []] => ", [
      //   ...group.fields,
      //   ...(group.status || []),
      // ]);
      // if (group.type === "income") {
      const { planned, received } = [
        ...group.fields,
        ...(group.status || []),
      ].reduce(
        (acc, groupItem) => {
          if (groupItem.label.toLowerCase() === "planned") {
            acc.planned = parseFloat(groupItem.value);
          }
          if (groupItem.label.toLowerCase() === "received") {
            acc.received = parseFloat(groupItem.value);
          }
          // if (field.label.tolowerCase() === "remaining") {
          //   acc.remaining = parseFloat(field.value);
          // }
          return acc;
        },
        {
          planned: 0,
          received: 0, // remaining: 0
        }
      );
      if (planned > 0 && received > 0) {
        return (received / planned) * 100;
      }
      return 0;
      // }
      // Add other group-specific progress calculations if needed
      return 0;
    };
    const progress = calculateProgress(item);
    // console.log("BudgetGroup[progress] => ", calculateProgress(item));
    return (
      <>
        <div className="group-item">
          {fields.length > 0 &&
            fields.map((field, fieldIndex) => {
              const { label, value, placeholder, type } = field;
              const grouptItemID = `${budgetGroupName}_${removeSpace(
                label
              )}_${type}_${id}`;
              return (
                <div className="group-item-fields">
                  <label
                    className="group-item-fields__label"
                    htmlFor={grouptItemID}
                  >
                    {field.label !== "" && `${field.label}:`}
                  </label>
                  <TextField
                    id={grouptItemID}
                    className="form-control group-item-fields__input"
                    type={type}
                    name={grouptItemID}
                    defaultVal={value}
                    placeholder={placeholder}
                    onChange={(e) =>
                      onChangeHandler(itemIndex, fieldIndex, e.target.value)
                    }
                  />
                </div>
              );
            })}
          {status?.length > 0 &&
            status.map(({ label, value, type }) => {
              const grouptItemID = `${budgetGroupName}_${removeSpace(
                label
              )}_${type}_${id}`;
              return (
                <div className="group-item-status" key={grouptItemID}>
                  <h4 className="group-item-status__header">{label}</h4>
                  <p className="group-item-status__text">£{value}</p>
                </div>
              );
            })}

          <div className="group-item-action">
            <Button
              className="group-item-action__Button"
              variation="transparent"
              onClickHandler={(e) => popOverHandler(e, id)}
            >
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size="1x"
                title="open pop over menu"
              />
            </Button>

            {showPopOver[id] && (
              <PopOverMenu
                menuList={[
                  { icon: faCoins, title: `Add ${type}` },
                  { icon: faTrashCan, title: `Delete ${type} Item` },
                ]}
              />
            )}
          </div>
        </div>
        <ProgressBar percentage={progress} />
      </>
    );
  });
};

export default BudgetGroupItem;
