import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faTrashCan,
  faGear,
  faWandMagicSparkles,
  faCreditCard,
  faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_BUDGET_GROUPS, generateUniqueId } from "../utils/utils";
import { DEBT_TYPES } from "../utils/constants";
import "./styles/Settings.css";

export default function Settings() {
  const navigate = useNavigate();

  // Load initial settings
  const loadInitialSettings = () => {
    const savedDefaults = localStorage.getItem("budget_app_defaults");
    if (savedDefaults) {
      try {
        const parsed = JSON.parse(savedDefaults);
        const incomes = parsed.incomes || [];
        const incomeVal =
          incomes.length > 0
            ? incomes.reduce((s, i) => s + i.amount, 0)
            : parsed.startingSalary || 5000.0;
        return {
          initialIncome: incomeVal,
          budgetGroups:
            parsed.budgetGroups ||
            JSON.parse(JSON.stringify(DEFAULT_BUDGET_GROUPS)),
          paydayDay: parsed.paydayDay ?? 20,
          weekendBehavior: parsed.weekendBehavior ?? "preceding-friday",
        };
      } catch (e) {
        console.error("Error parsing defaults", e);
      }
    }
    return {
      initialIncome: 5000.0,
      budgetGroups: JSON.parse(JSON.stringify(DEFAULT_BUDGET_GROUPS)),
      paydayDay: 20,
      weekendBehavior: "preceding-friday",
    };
  };

  const initialData = loadInitialSettings();

  const [currentStep, setCurrentStep] = useState(1);
  const [initialIncome, setInitialIncome] = useState(initialData.initialIncome);
  const [budgetGroups, setBudgetGroups] = useState(initialData.budgetGroups);
  const [paydayDay, setPaydayDay] = useState(initialData.paydayDay);
  const [weekendBehavior, setWeekendBehavior] = useState(
    initialData.weekendBehavior
  );
  const [newGroupName, setNewGroupName] = useState("");

  // Debt tracking state
  const [hasDebts, setHasDebts] = useState(null); // null = unanswered, true/false
  const [debtItems, setDebtItems] = useState([]);

  // Savings tracking state
  const [hasSavings, setHasSavings] = useState(null); // null = unanswered, true/false
  const [savingsItems, setSavingsItems] = useState([]);
  const [isSoleBreadwinner, setIsSoleBreadwinner] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState("permanent"); // "permanent" | "contractor"
  const [monthlyExpensesInput, setMonthlyExpensesInput] = useState("");

  // Initialize estimated monthly expenses baseline
  React.useEffect(() => {
    if (monthlyExpensesInput === "" && initialIncome > 0) {
      setMonthlyExpensesInput((initialIncome * 0.7).toFixed(0));
    }
  }, [initialIncome, monthlyExpensesInput]);

  const calcRecommendedBuffer = () => {
    const expenses = parseFloat(monthlyExpensesInput) || 0;
    const months =
      isSoleBreadwinner || employmentStatus === "contractor" ? 6 : 3;
    return {
      months,
      amount: expenses * months,
    };
  };

  const recommendedBuffer = calcRecommendedBuffer();

  const handleAddSavingsItem = () => {
    setSavingsItems([
      ...savingsItems,
      {
        id: generateUniqueId(),
        name: "",
        target: "",
        startingBalance: "",
      },
    ]);
  };

  const handleUpdateSavingsItem = (index, field, value) => {
    const updated = [...savingsItems];
    updated[index][field] = value;
    setSavingsItems(updated);
  };

  const handleDeleteSavingsItem = (index) => {
    const updated = [...savingsItems];
    updated.splice(index, 1);
    setSavingsItems(updated);
  };

  const handleApplyRecommendedBuffer = () => {
    const recommended = calcRecommendedBuffer();
    const existingIndex = savingsItems.findIndex((item) =>
      item.name.toLowerCase().includes("emergency")
    );

    if (existingIndex !== -1) {
      handleUpdateSavingsItem(
        existingIndex,
        "target",
        recommended.amount.toFixed(0)
      );
    } else {
      setSavingsItems([
        {
          id: generateUniqueId(),
          name: "Emergency Fund",
          target: recommended.amount.toFixed(0),
          startingBalance: "0",
        },
        ...savingsItems,
      ]);
    }
  };

  // Auto-focus logic or helpers
  const handleIncomePreset = (amount) => {
    setInitialIncome(amount);
  };

  // Group Handlers
  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newGroup = {
      name: newGroupName.trim(),
      budgetGroupItems: [],
    };
    setBudgetGroups([...budgetGroups, newGroup]);
    setNewGroupName("");
  };

  const handleDeleteGroup = (groupIndex) => {
    const updated = [...budgetGroups];
    updated.splice(groupIndex, 1);
    setBudgetGroups(updated);
  };

  const handleRenameGroup = (groupIndex, newName) => {
    if (!newName.trim()) return;
    const updated = [...budgetGroups];
    updated[groupIndex].name = newName.trim();
    setBudgetGroups(updated);
  };

  // Item Handlers
  const handleAddItem = (groupIndex, itemName) => {
    if (!itemName || !itemName.trim()) return;
    const updated = [...budgetGroups];
    const newItem = {
      id: generateUniqueId(),
      name: itemName.trim(),
      assigned: 0,
      type: "expense",
    };
    updated[groupIndex].budgetGroupItems.push(newItem);
    setBudgetGroups(updated);
  };

  const handleDeleteItem = (groupIndex, itemIndex) => {
    const updated = [...budgetGroups];
    updated[groupIndex].budgetGroupItems.splice(itemIndex, 1);
    setBudgetGroups(updated);
  };

  const handleRenameItem = (groupIndex, itemIndex, newName) => {
    if (!newName.trim()) return;
    const updated = [...budgetGroups];
    updated[groupIndex].budgetGroupItems[itemIndex].name = newName.trim();
    setBudgetGroups(updated);
  };

  // Debt Item Handlers
  const handleAddDebtItem = () => {
    setDebtItems([
      ...debtItems,
      {
        id: generateUniqueId(),
        name: "",
        outstandingBalance: "",
        minimumPayment: "",
        debtType: "credit-card",
        interestRate: "",
      },
    ]);
  };

  const handleUpdateDebtItem = (index, field, value) => {
    const updated = [...debtItems];
    updated[index][field] = value;
    setDebtItems(updated);
  };

  const handleDeleteDebtItem = (index) => {
    const updated = [...debtItems];
    updated.splice(index, 1);
    setDebtItems(updated);
  };

  // Step logic: steps are 1=Salary, 2=Categories, 3=Debt, 4=Savings, 5=Confirm
  const isConfirmStep = currentStep === 5;
  const isDebtQuestionStep = currentStep === 3 && hasDebts === null;
  const isDebtEntryStep = currentStep === 3 && hasDebts === true;
  const isSavingsQuestionStep = currentStep === 4 && hasSavings === null;
  const isSavingsEntryStep = currentStep === 4 && hasSavings === true;

  // Get the actual step labels for the stepper
  const getStepperSteps = () => {
    return [
      { label: "Salary", step: 1 },
      { label: "Categories", step: 2 },
      { label: "Debt", step: 3 },
      { label: "Savings", step: 4 },
      { label: "Confirm", step: 5 },
    ];
  };

  const stepperSteps = getStepperSteps();

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 5) {
      if (hasSavings === true) {
        setCurrentStep(4);
      } else {
        setHasSavings(null);
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      if (hasSavings === true) {
        setHasSavings(null);
      } else {
        if (hasDebts === true) {
          setCurrentStep(3);
        } else {
          setHasDebts(null);
          setCurrentStep(3);
        }
      }
    } else if (currentStep === 3) {
      if (hasDebts === true) {
        setHasDebts(null);
      } else {
        setCurrentStep(2);
      }
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // Finish setup and save
  const handleFinishSetup = () => {
    // Build final budget groups including debt group if applicable
    let finalBudgetGroups = [...budgetGroups];

    if (hasDebts && debtItems.length > 0) {
      const validDebtItems = debtItems
        .filter((d) => d.name.trim())
        .map((d) => ({
          id: d.id,
          name: d.name.trim(),
          assigned: 0,
          type: "debt",
          outstandingBalance: parseFloat(d.outstandingBalance) || 0,
          minimumPayment: parseFloat(d.minimumPayment) || 0,
          debtType: d.debtType || "other",
          interestRate: d.interestRate ? parseFloat(d.interestRate) : undefined,
        }));

      if (validDebtItems.length > 0) {
        finalBudgetGroups.push({
          name: "Debt",
          isDebtGroup: true,
          budgetGroupItems: validDebtItems,
        });
      }
    }

    if (hasSavings && savingsItems.length > 0) {
      const validSavingsItems = savingsItems
        .filter((s) => s.name.trim())
        .map((s) => ({
          id: s.id,
          name: s.name.trim(),
          assigned: 0,
          type: "savings",
          target: parseFloat(s.target) || 0,
          startingBalance: parseFloat(s.startingBalance) || 0,
        }));

      if (validSavingsItems.length > 0) {
        finalBudgetGroups.push({
          name: "Savings",
          isSavingsGroup: true,
          budgetGroupItems: validSavingsItems,
        });
      }
    }

    // 1. Save defaults to localStorage for template use
    const defaults = {
      incomes: [
        {
          id: "inc-default",
          name: "Main Salary",
          amount: initialIncome,
          received: true,
        },
      ],
      budgetGroups: finalBudgetGroups,
      paydayDay,
      weekendBehavior,
    };
    localStorage.setItem("budget_app_defaults", JSON.stringify(defaults));
    localStorage.setItem("budget_app_setup_completed", "true");

    // 2. Also initialize current month's budget data if not already customized
    const getCurrentMonthYearString = () => {
      const date = new Date();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return `${month}-${year}`;
    };
    const currentMonthKey = getCurrentMonthYearString();
    const existingMonthData = localStorage.getItem(
      `budget_app_data_${currentMonthKey}`
    );

    // Always write or prompt? Let's write to current month so user starts with their new setup
    const newMonthData = {
      incomes: [
        {
          id: "inc-default",
          name: "Main Salary",
          amount: initialIncome,
          received: true,
        },
      ],
      budgetGroups: JSON.parse(JSON.stringify(finalBudgetGroups)),
      transactions: existingMonthData
        ? JSON.parse(existingMonthData).transactions || []
        : [],
      paydayDay,
      weekendBehavior,
    };
    localStorage.setItem(
      `budget_app_data_${currentMonthKey}`,
      JSON.stringify(newMonthData)
    );

    // Redirect to current month's budget page
    navigate(`/${currentMonthKey}`);
  };

  const totalGroups =
    budgetGroups.length +
    (hasDebts && debtItems.length > 0 ? 1 : 0) +
    (hasSavings && savingsItems.length > 0 ? 1 : 0);
  const totalItems =
    budgetGroups.reduce((acc, g) => acc + g.budgetGroupItems.length, 0) +
    (hasDebts ? debtItems.filter((d) => d.name.trim()).length : 0) +
    (hasSavings ? savingsItems.filter((s) => s.name.trim()).length : 0);

  // Determine stepper state for each node
  const getStepState = (stepNum) => {
    if (hasDebts) {
      return {
        active: currentStep >= stepNum,
        completed: currentStep > stepNum,
      };
    }
    // When no debts or unanswered, map to 3-step stepper
    if (stepNum <= 2) {
      return {
        active: currentStep >= stepNum,
        completed: currentStep > stepNum,
      };
    }
    // Step 3 = Confirm (when no debts)
    return {
      active: isConfirmStep || currentStep >= 3,
      completed: false,
    };
  };

  return (
    <div className="setup-wizard-container">
      {/* Step Tracker */}
      <div className="stepper">
        {stepperSteps.map((step, idx) => (
          <React.Fragment key={step.label}>
            {idx > 0 && (
              <div className="step-connector">
                <div
                  className="connector-progress"
                  style={{
                    width: getStepState(step.step).completed ? "100%" : "0%",
                  }}
                ></div>
              </div>
            )}
            <div
              className={`step-node ${getStepState(step.step).active ? "active" : ""} ${getStepState(step.step).completed ? "completed" : ""}`}
            >
              <span className="step-number">
                {getStepState(step.step).completed ? (
                  <FontAwesomeIcon icon={faCheck} size="xs" />
                ) : (
                  idx + 1
                )}
              </span>
              <span className="step-label">{step.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Wizard Card */}
      <div className="wizard-card">
        {currentStep === 1 && (
          <div className="wizard-step step-salary">
            <div className="step-icon-header">
              <FontAwesomeIcon
                icon={faWandMagicSparkles}
                size="2x"
                className="wizard-icon"
              />
            </div>
            <h2>Set Your Starting Monthly Income</h2>
            <p className="wizard-description">
              In a zero-based budget, you assign every single pound of your
              income a job. Let's start with how much money you earn each month.
            </p>

            <div className="salary-input-container">
              <span className="currency-symbol">£</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={initialIncome}
                onChange={(e) =>
                  setInitialIncome(parseFloat(e.target.value) || 0)
                }
                className="wizard-salary-input"
                placeholder="0.00"
              />
            </div>

            <div className="presets-container">
              <span className="presets-label">Common Presets:</span>
              <div className="presets-buttons">
                {[2000, 3000, 4000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleIncomePreset(preset)}
                    className={`preset-btn ${initialIncome === preset ? "selected" : ""}`}
                  >
                    £{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <hr className="wizard-step-divider" />

            <div className="payday-settings-container">
              <h3>Budget Cycle & Payday Settings</h3>
              <p className="wizard-description">
                Your budget cycle starts on your payday and ends the day before
                your next payday.
              </p>

              <div className="payday-fields-grid">
                <div className="form-group">
                  <label htmlFor="payday-day-select">Monthly Payday Day</label>
                  <select
                    id="payday-day-select"
                    value={paydayDay}
                    onChange={(e) => setPaydayDay(parseInt(e.target.value))}
                    className="wizard-select"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                        {day === 1 || day === 21 || day === 31
                          ? "st"
                          : day === 2 || day === 22
                            ? "nd"
                            : day === 3 || day === 23
                              ? "rd"
                              : "th"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="payday-weekend-select">
                    Weekend Payday Behavior
                  </label>
                  <select
                    id="payday-weekend-select"
                    value={weekendBehavior}
                    onChange={(e) => setWeekendBehavior(e.target.value)}
                    className="wizard-select"
                  >
                    <option value="preceding-friday">
                      Preceding Friday (Early)
                    </option>
                    <option value="following-monday">
                      Following Monday (Late)
                    </option>
                    <option value="exact">Exact Day (No Shift)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="wizard-step step-categories">
            <h2>Customize Budget Categories</h2>
            <p className="wizard-description">
              Organize your money into budget groups and specific items. We
              pre-populated this with defaults, but feel free to customize.
            </p>

            {/* Add Group Form */}
            <form onSubmit={handleAddGroup} className="add-group-form">
              <input
                type="text"
                placeholder="New Group (e.g. Savings, Subscriptions)..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="new-group-input"
              />
              <button type="submit" className="btn-add-group" title="Add Group">
                <FontAwesomeIcon icon={faPlus} className="spacing-right" />
                Add Group
              </button>
            </form>

            {/* List of Groups and Items */}
            <div className="groups-list-container">
              {budgetGroups.length === 0 ? (
                <div className="empty-groups-state">
                  <p>
                    No budget groups configured. Please add one above to
                    continue.
                  </p>
                </div>
              ) : (
                budgetGroups.map((group, groupIndex) => (
                  <div key={group.name + groupIndex} className="group-card">
                    <div className="group-card-header">
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) =>
                          handleRenameGroup(groupIndex, e.target.value)
                        }
                        className="group-name-edit"
                        title="Click to rename group"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(groupIndex)}
                        className="btn-delete-group"
                        title="Delete Group and all items"
                      >
                        <FontAwesomeIcon icon={faTrashCan} size="sm" />
                      </button>
                    </div>

                    <div className="group-items-list">
                      {group.budgetGroupItems.map((item, itemIndex) => {
                        const itemName = item.name || "Unnamed Item";
                        return (
                          <div key={item.id} className="item-row">
                            <input
                              type="text"
                              value={itemName}
                              onChange={(e) =>
                                handleRenameItem(
                                  groupIndex,
                                  itemIndex,
                                  e.target.value
                                )
                              }
                              className="item-name-edit"
                              title="Click to rename item"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteItem(groupIndex, itemIndex)
                              }
                              className="btn-delete-item"
                              title="Delete Item"
                            >
                              <FontAwesomeIcon icon={faTrashCan} size="xs" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Inline Add Item Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          const name = prompt("Enter item name:");
                          if (name) handleAddItem(groupIndex, name);
                        }}
                        className="btn-add-item-trigger"
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          size="xs"
                          className="spacing-right"
                        />
                        Add Item
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Debt Question Gate (when unanswered) */}
        {currentStep === 3 && hasDebts === null && (
          <div className="wizard-step step-debt-question">
            <div className="step-icon-header">
              <FontAwesomeIcon
                icon={faCreditCard}
                size="2x"
                className="wizard-icon"
              />
            </div>
            <h2>Do You Have Any Debt?</h2>
            <p className="wizard-description">
              Track your debts alongside your budget to monitor payoff progress.
              This includes credit cards, personal loans, car loans, student
              loans, and overdrafts.
            </p>
            <div className="debt-question-buttons">
              <button
                type="button"
                className="btn-debt-answer btn-debt-yes"
                onClick={() => {
                  setHasDebts(true);
                  if (debtItems.length === 0) {
                    handleAddDebtItem();
                  }
                }}
              >
                Yes, I have debts
              </button>
              <button
                type="button"
                className="btn-debt-answer btn-debt-no"
                onClick={() => {
                  setHasDebts(false);
                  setCurrentStep(4);
                }}
              >
                No, skip this step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Debt Entry (when hasDebts === true) */}
        {isDebtEntryStep && (
          <div className="wizard-step step-debts">
            <h2>Add Your Debt</h2>
            <p className="wizard-description">
              List all your active debts. We'll track your payoff progress on
              the budget dashboard.
            </p>

            <div className="debts-list-container">
              {debtItems.map((debt, index) => (
                <div key={debt.id} className="debt-entry-card">
                  <div className="debt-entry-header">
                    <span className="debt-entry-number">Debt {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteDebtItem(index)}
                      className="btn-delete-group"
                      title="Remove debt"
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="sm" />
                    </button>
                  </div>

                  <div className="debt-fields-grid">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={debt.name}
                        onChange={(e) =>
                          handleUpdateDebtItem(index, "name", e.target.value)
                        }
                        placeholder="e.g. Barclaycard"
                        className="debt-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Debt Type</label>
                      <select
                        value={debt.debtType}
                        onChange={(e) =>
                          handleUpdateDebtItem(
                            index,
                            "debtType",
                            e.target.value
                          )
                        }
                        className="wizard-select"
                      >
                        {DEBT_TYPES.map((dt) => (
                          <option key={dt.value} value={dt.value}>
                            {dt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Outstanding Balance (£)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={debt.outstandingBalance}
                        onChange={(e) =>
                          handleUpdateDebtItem(
                            index,
                            "outstandingBalance",
                            e.target.value
                          )
                        }
                        placeholder="0.00"
                        className="debt-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Minimum Payment (£)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={debt.minimumPayment}
                        onChange={(e) =>
                          handleUpdateDebtItem(
                            index,
                            "minimumPayment",
                            e.target.value
                          )
                        }
                        placeholder="0.00"
                        className="debt-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Interest Rate (% — optional)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={debt.interestRate}
                        onChange={(e) =>
                          handleUpdateDebtItem(
                            index,
                            "interestRate",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 19.9"
                        className="debt-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-add-debt-entry"
              onClick={handleAddDebtItem}
            >
              <FontAwesomeIcon icon={faPlus} className="spacing-right" />
              Add Another Debt
            </button>
          </div>
        )}

        {/* Step 4: Savings Question Gate (when unanswered) */}
        {isSavingsQuestionStep && (
          <div className="wizard-step step-savings-question">
            <div className="step-icon-header">
              <FontAwesomeIcon
                icon={faPiggyBank}
                size="2x"
                className="wizard-icon"
              />
            </div>
            <h2>Do You Want to Set Up Savings Goals?</h2>
            <p className="wizard-description">
              Track your savings goals like emergency funds, holidays, or major
              purchases. We can also help recommend a buffer size based on your
              household circumstances.
            </p>
            <div className="debt-question-buttons">
              <button
                type="button"
                className="btn-debt-answer btn-debt-yes"
                onClick={() => {
                  setHasSavings(true);
                  if (savingsItems.length === 0) {
                    handleAddSavingsItem();
                  }
                }}
              >
                Yes, set up savings
              </button>
              <button
                type="button"
                className="btn-debt-answer btn-debt-no"
                onClick={() => {
                  setHasSavings(false);
                  setCurrentStep(5);
                }}
              >
                No, skip this step
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Savings Entry / Wizard (when hasSavings === true) */}
        {isSavingsEntryStep && (
          <div className="wizard-step step-savings">
            <h2>Add Your Savings Goals</h2>
            <p className="wizard-description">
              Answer a few questions to get a recommended emergency fund size,
              or add custom goals directly.
            </p>

            {/* Risk Assessment Panel */}
            <div className="savings-risk-panel">
              <h3>Emergency Fund Recommender</h3>
              <div className="debt-fields-grid risk-grid">
                <div
                  className="form-group checkbox-group"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    id="sole-breadwinner-chk"
                    checked={isSoleBreadwinner}
                    onChange={(e) => setIsSoleBreadwinner(e.target.checked)}
                  />
                  <label
                    htmlFor="sole-breadwinner-chk"
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Are you the sole breadwinner?
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="employment-status-select">
                    Employment Status
                  </label>
                  <select
                    id="employment-status-select"
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="wizard-select"
                  >
                    <option value="permanent">Permanent Employee</option>
                    <option value="contractor">Contractor / Freelancer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="monthly-expenses-input">
                    Monthly Living Expenses (£)
                  </label>
                  <input
                    type="number"
                    id="monthly-expenses-input"
                    value={monthlyExpensesInput}
                    onChange={(e) => setMonthlyExpensesInput(e.target.value)}
                    placeholder="0"
                    className="debt-input"
                  />
                </div>
              </div>

              <div className="risk-recommendation-box">
                <p>
                  💡 <strong>Recommendation:</strong> Based on your job
                  stability and household, we recommend a{" "}
                  <strong>{recommendedBuffer.months}-month buffer</strong> of{" "}
                  <strong>£{recommendedBuffer.amount.toLocaleString()}</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleApplyRecommendedBuffer}
                  className="btn-apply-recommended"
                >
                  Apply Emergency Fund Target
                </button>
              </div>
            </div>

            <div className="debts-list-container">
              {savingsItems.map((item, index) => (
                <div key={item.id} className="debt-entry-card">
                  <div className="debt-entry-header">
                    <span className="debt-entry-number">Goal {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSavingsItem(index)}
                      className="btn-delete-group"
                      title="Remove goal"
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="sm" />
                    </button>
                  </div>

                  <div className="debt-fields-grid">
                    <div className="form-group">
                      <label>Goal Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleUpdateSavingsItem(index, "name", e.target.value)
                        }
                        placeholder="e.g. Emergency Fund"
                        className="debt-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Overall Target (£)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.target}
                        onChange={(e) =>
                          handleUpdateSavingsItem(
                            index,
                            "target",
                            e.target.value
                          )
                        }
                        placeholder="0.00"
                        className="debt-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Starting Balance (£)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.startingBalance}
                        onChange={(e) =>
                          handleUpdateSavingsItem(
                            index,
                            "startingBalance",
                            e.target.value
                          )
                        }
                        placeholder="0.00"
                        className="debt-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-add-debt-entry"
              onClick={handleAddSavingsItem}
            >
              <FontAwesomeIcon icon={faPlus} className="spacing-right" />
              Add Another Savings Goal
            </button>
          </div>
        )}

        {/* Confirm Step */}
        {isConfirmStep && (
          <div className="wizard-step step-confirm">
            <div className="step-icon-header">
              <FontAwesomeIcon
                icon={faGear}
                size="2x"
                className="wizard-icon gear-pulse"
              />
            </div>
            <h2>Confirm Your Budget Setup</h2>
            <p className="wizard-description">
              Review your zero-based budgeting plan. You can change these
              templates at any time in the settings page.
            </p>

            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Monthly Starting Income:</span>
                <span className="summary-value">
                  £{initialIncome.toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Total Budget Groups:</span>
                <span className="summary-value">{totalGroups} groups</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Total Budget Items:</span>
                <span className="summary-value">{totalItems} items</span>
              </div>
              {hasDebts &&
                debtItems.filter((d) => d.name.trim()).length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Debt Being Tracked:</span>
                    <span className="summary-value">
                      {debtItems.filter((d) => d.name.trim()).length} debts
                    </span>
                  </div>
                )}
              {hasSavings &&
                savingsItems.filter((s) => s.name.trim()).length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">
                      Savings Goals Tracked:
                    </span>
                    <span className="summary-value">
                      {savingsItems.filter((s) => s.name.trim()).length} goals
                    </span>
                  </div>
                )}
              <div className="summary-row">
                <span className="summary-label">Payday Date:</span>
                <span className="summary-value">
                  {paydayDay}
                  {paydayDay === 1 || paydayDay === 21 || paydayDay === 31
                    ? "st"
                    : paydayDay === 2 || paydayDay === 22
                      ? "nd"
                      : paydayDay === 3 || paydayDay === 23
                        ? "rd"
                        : "th"}{" "}
                  of the month
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Weekend Strategy:</span>
                <span className="summary-value">
                  {weekendBehavior === "preceding-friday"
                    ? "Preceding Friday"
                    : weekendBehavior === "following-monday"
                      ? "Following Monday"
                      : "Exact Day"}
                </span>
              </div>
            </div>

            <div className="principles-card">
              <h3>Zero-Based Budgeting Checklist</h3>
              <ul>
                <li>
                  <span className="check-bullet">✓</span> Give every pound a job
                  by allocating all £{initialIncome.toFixed(2)} to your
                  categories.
                </li>
                <li>
                  <span className="check-bullet">✓</span> Keep your "Left to
                  Assign" balance at exactly £0.00.
                </li>
                <li>
                  <span className="check-bullet">✓</span> Track transactions on
                  the dashboard to see your Remaining funds update in real-time.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Navigation Bar */}
        <div className="wizard-footer">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn-wizard-nav btn-wizard-back"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="spacing-right" />
              Back
            </button>
          ) : (
            <div /> // Placeholder to push next button right
          )}

          {!isConfirmStep && !isDebtQuestionStep && !isSavingsQuestionStep ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-wizard-nav btn-wizard-next"
              disabled={currentStep === 2 && budgetGroups.length === 0}
            >
              Next
              <FontAwesomeIcon icon={faChevronRight} className="spacing-left" />
            </button>
          ) : isConfirmStep ? (
            <button
              type="button"
              onClick={handleFinishSetup}
              className="btn-wizard-nav btn-wizard-finish"
            >
              Save & Start Budgeting
              <FontAwesomeIcon icon={faCheck} className="spacing-left" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
