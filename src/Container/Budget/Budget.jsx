import React, { useEffect, useState } from "react";
import {
  Hero,
  BudgetForm,
  BudgetGroup,
  Button,
  TextField,
} from "../../Component";
import "./styles/Budget.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { generateUniqueId, formatBudgetItemAmount } from "../../utils/utils";
import ProgressBar from "../../Component/ProgressBar";

function Budget() {
  const getFullYear = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const [income, setIncome] = useState({
    planned: formatBudgetItemAmount(0),
    received: formatBudgetItemAmount(0),
  });

  const [progress, setProgress] = useState(0);
  const [fullyear, setFullYear] = useState(getFullYear());
  const [hideContent, setHideContent] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const onIncomeChange = (e) => {
    const value = parseFloat(e.target.value);
    setIncome({
      ...income,
      [e.target.name]: formatBudgetItemAmount(value),
    });
  };

  // This useEffect hook updates the fullyear state
  useEffect(() => {
    setFullYear(getFullYear());
  }, [fullyear]);

  // This useEffect hook updates the income state
  useEffect(() => {
    const { planned, received } = income;
    const formattedPlanned = formatBudgetItemAmount(planned);
    const formattedReceived = formatBudgetItemAmount(received);
    if (planned !== formattedPlanned || received !== formattedReceived) {
      setIncome({
        planned: formattedPlanned,
        received: formattedReceived,
      });
    }
  }, [income]);

  // This useEffect hook updates the progress state whenever the income state changes
  useEffect(() => {
    const { planned, received } = income;
    if (planned && received) {
      setProgress((received / planned) * 100);
    }
  }, [income]);

  const toggleGroupContent = (event) => {
    event.preventDefault();
    setHideContent((prevHideContent) => !prevHideContent);
  };

  console.log("showDeleteButton", showDeleteButton);

  const toggleDeleteButton = (event) => {
    event.preventDefault();
    setShowDeleteButton((prevShowDeleteButton) => !prevShowDeleteButton);
  };
  const deleteGroupHandler = (event) => {
    console.log("delete group:", event.target.previousSibling.textContent);
  };
  const groupHeaderTitleHandler = (event) => {
    event.preventDefault();
    console.log("event", event);
    console.log("event", event.target.tagName);
    if (event.target.tagName === "H3") {
      toggleDeleteButton(event);
    }
    if (event.target.tagName === "BUTTON") {
      deleteGroupHandler(event);
    }
  };

  return (
    <section>
      <Hero
        month={fullyear}
        income={income.planned}
        planned={income.planned}
        received={income.received}
      />
      <BudgetForm className="form">
        <div className="group-container">
          <div className="group-header">
            <div
              className="group-header-title"
              role="button"
              onClick={groupHeaderTitleHandler}
            >
              <h3>Income</h3>
              {showDeleteButton && (
                <Button
                  classModifier="transparent"
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    size="1x"
                    title="delete budget group"
                  />
                </Button>
              )}
            </div>

            <Button
              classModifier="transparent"
              onClickHandler={(e) => {
                toggleGroupContent(e);
              }}
            >
              <FontAwesomeIcon
                icon={hideContent ? faChevronUp : faChevronDown}
                size="1x"
                title="budget group collapse toggle"
              />
            </Button>
          </div>
          <div
            className={`group-content ${
              hideContent ? "group-content--hidden" : ""
            }`}
          >
            <div className="group-item">
              <div className="group-item-fields">
                <TextField
                  label="Planned"
                  id="planned"
                  inputName="planned"
                  onChange={onIncomeChange}
                  defaultVal={income.planned}
                  placeholder={income.planned}
                />
              </div>
              <div className="group-item-fields">
                <TextField
                  label="Received"
                  id="received"
                  inputName="received"
                  onChange={onIncomeChange}
                  defaultVal={income.received}
                  placeholder={income.received}
                />
              </div>
            </div>
          </div>
          <ProgressBar percentage={progress} />
        </div>

        <BudgetGroup
          budgetGroup={{
            name: "Giving",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Charity",
                type: "expense",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Savings",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Emergency Fund",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Housing",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Rent / Mortgage",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Utilities",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Gas",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Food",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Groceries",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Transport",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "TFL",
                type: "fund",
              },
            ],
          }}
        />
        <BudgetGroup
          budgetGroup={{
            name: "Insurance",
            budgetGroupItem: [
              {
                id: generateUniqueId(),
                label: "Life",
                type: "fund",
              },
            ],
          }}
        />
      </BudgetForm>
    </section>
  );
}

export default Budget;
