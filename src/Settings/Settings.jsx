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
} from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_BUDGET_GROUPS, generateUniqueId } from "../utils/utils";
import "./styles/Settings.css";

export default function Settings() {
  const navigate = useNavigate();

  // Load initial settings
  const loadInitialSettings = () => {
    const savedDefaults = localStorage.getItem("budget_app_defaults");
    if (savedDefaults) {
      try {
        const parsed = JSON.parse(savedDefaults);
        return {
          startingSalary: parsed.startingSalary || 5000.0,
          budgetGroups: parsed.budgetGroups || JSON.parse(JSON.stringify(DEFAULT_BUDGET_GROUPS)),
          paydayDay: parsed.paydayDay ?? 20,
          weekendBehavior: parsed.weekendBehavior ?? "preceding-friday",
        };
      } catch (e) {
        console.error("Error parsing defaults", e);
      }
    }
    return {
      startingSalary: 5000.0,
      budgetGroups: JSON.parse(JSON.stringify(DEFAULT_BUDGET_GROUPS)),
      paydayDay: 20,
      weekendBehavior: "preceding-friday",
    };
  };

  const initialData = loadInitialSettings();

  const [currentStep, setCurrentStep] = useState(1);
  const [startingSalary, setStartingSalary] = useState(initialData.startingSalary);
  const [budgetGroups, setBudgetGroups] = useState(initialData.budgetGroups);
  const [paydayDay, setPaydayDay] = useState(initialData.paydayDay);
  const [weekendBehavior, setWeekendBehavior] = useState(initialData.weekendBehavior);
  const [newGroupName, setNewGroupName] = useState("");

  // Auto-focus logic or helpers
  const handleSalaryPreset = (amount) => {
    setStartingSalary(amount);
  };

  // Group Handlers
  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newGroup = {
      name: newGroupName.trim(),
      columns: [{ name: "Assigned" }, { name: "Remaining" }],
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

  // Finish setup and save
  const handleFinishSetup = () => {
    // 1. Save defaults to localStorage for template use
    const defaults = {
      startingSalary,
      budgetGroups,
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
    const existingMonthData = localStorage.getItem(`budget_app_data_${currentMonthKey}`);
    
    // Always write or prompt? Let's write to current month so user starts with their new setup
    const newMonthData = {
      startingSalary,
      budgetGroups: JSON.parse(JSON.stringify(budgetGroups)),
      transactions: existingMonthData ? JSON.parse(existingMonthData).transactions || [] : [],
      paydayDay,
      weekendBehavior,
    };
    localStorage.setItem(`budget_app_data_${currentMonthKey}`, JSON.stringify(newMonthData));

    // Redirect to current month's budget page
    navigate(`/${currentMonthKey}`);
  };

  const totalGroups = budgetGroups.length;
  const totalItems = budgetGroups.reduce((acc, g) => acc + g.budgetGroupItems.length, 0);

  return (
    <div className="setup-wizard-container">
      {/* Step Tracker */}
      <div className="stepper">
        <div className={`step-node ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
          <span className="step-number">{currentStep > 1 ? <FontAwesomeIcon icon={faCheck} size="xs" /> : "1"}</span>
          <span className="step-label">Salary</span>
        </div>
        <div className="step-connector">
          <div className="connector-progress" style={{ width: currentStep > 1 ? "100%" : "0%" }}></div>
        </div>
        <div className={`step-node ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
          <span className="step-number">{currentStep > 2 ? <FontAwesomeIcon icon={faCheck} size="xs" /> : "2"}</span>
          <span className="step-label">Categories</span>
        </div>
        <div className="step-connector">
          <div className="connector-progress" style={{ width: currentStep > 2 ? "100%" : "0%" }}></div>
        </div>
        <div className={`step-node ${currentStep === 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      {/* Wizard Card */}
      <div className="wizard-card">
        {currentStep === 1 && (
          <div className="wizard-step step-salary">
            <div className="step-icon-header">
              <FontAwesomeIcon icon={faWandMagicSparkles} size="2x" className="wizard-icon" />
            </div>
            <h2>Set Your Starting Monthly Income</h2>
            <p className="wizard-description">
              In a zero-based budget, you assign every single pound of your salary a job. Let's start with how much money you earn each month.
            </p>

            <div className="salary-input-container">
              <span className="currency-symbol">£</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={startingSalary}
                onChange={(e) => setStartingSalary(parseFloat(e.target.value) || 0)}
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
                    onClick={() => handleSalaryPreset(preset)}
                    className={`preset-btn ${startingSalary === preset ? "selected" : ""}`}
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
                Your budget cycle starts on your payday and ends the day before your next payday.
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
                        {day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th"}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="payday-weekend-select">Weekend Payday Behavior</label>
                  <select
                    id="payday-weekend-select"
                    value={weekendBehavior}
                    onChange={(e) => setWeekendBehavior(e.target.value)}
                    className="wizard-select"
                  >
                    <option value="preceding-friday">Preceding Friday (Early)</option>
                    <option value="following-monday">Following Monday (Late)</option>
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
              Organize your money into budget groups and specific items. We pre-populated this with defaults, but feel free to customize.
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
                  <p>No budget groups configured. Please add one above to continue.</p>
                </div>
              ) : (
                budgetGroups.map((group, groupIndex) => (
                  <div key={group.name + groupIndex} className="group-card">
                    <div className="group-card-header">
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => handleRenameGroup(groupIndex, e.target.value)}
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
                              onChange={(e) => handleRenameItem(groupIndex, itemIndex, e.target.value)}
                              className="item-name-edit"
                              title="Click to rename item"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(groupIndex, itemIndex)}
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
                        <FontAwesomeIcon icon={faPlus} size="xs" className="spacing-right" />
                        Add Item
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="wizard-step step-confirm">
            <div className="step-icon-header">
              <FontAwesomeIcon icon={faGear} size="2x" className="wizard-icon gear-pulse" />
            </div>
            <h2>Confirm Your Budget Setup</h2>
            <p className="wizard-description">
              Review your zero-based budgeting plan. You can change these templates at any time in the settings page.
            </p>

            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Monthly Starting Income:</span>
                <span className="summary-value">£{startingSalary.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Total Budget Groups:</span>
                <span className="summary-value">{totalGroups} groups</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Total Budget Items:</span>
                <span className="summary-value">{totalItems} items</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Payday Date:</span>
                <span className="summary-value">
                  {paydayDay}
                  {paydayDay === 1 || paydayDay === 21 || paydayDay === 31 ? "st" : paydayDay === 2 || paydayDay === 22 ? "nd" : paydayDay === 3 || paydayDay === 23 ? "rd" : "th"} of the month
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Weekend Strategy:</span>
                <span className="summary-value">
                  {weekendBehavior === "preceding-friday" ? "Preceding Friday" : weekendBehavior === "following-monday" ? "Following Monday" : "Exact Day"}
                </span>
              </div>
            </div>

            <div className="principles-card">
              <h3>Zero-Based Budgeting Checklist</h3>
              <ul>
                <li>
                  <span className="check-bullet">✓</span> Give every pound a job by allocating all £{startingSalary.toFixed(2)} to your categories.
                </li>
                <li>
                  <span className="check-bullet">✓</span> Keep your "Left to Assign" balance at exactly £0.00.
                </li>
                <li>
                  <span className="check-bullet">✓</span> Track transactions on the dashboard to see your Remaining funds update in real-time.
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
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn-wizard-nav btn-wizard-back"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="spacing-right" />
              Back
            </button>
          ) : (
            <div /> // Placeholder to push next button right
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-wizard-nav btn-wizard-next"
              disabled={currentStep === 2 && budgetGroups.length === 0}
            >
              Next
              <FontAwesomeIcon icon={faChevronRight} className="spacing-left" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishSetup}
              className="btn-wizard-nav btn-wizard-finish"
            >
              Save & Start Budgeting
              <FontAwesomeIcon icon={faCheck} className="spacing-left" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
