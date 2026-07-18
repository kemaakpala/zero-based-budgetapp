import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const Hero = ({
  currency = "£",
  monthLabel = "",
  cycleRangeLabel = "",
  startingSalary = 0,
  unassignedSalary = 0,
  onStartingSalaryChange,
  viewMode = "remaining",
  onViewModeToggle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(startingSalary.toString());

  useEffect(() => {
    setEditValue(startingSalary.toString());
  }, [startingSalary]);

  const handleSave = () => {
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onStartingSalaryChange(parsed);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(startingSalary.toString());
      setIsEditing(false);
    }
  };

  const isOverallocated = unassignedSalary < 0;
  const assignedAmount = startingSalary - unassignedSalary;
  const assignedPercentage = (assignedAmount / startingSalary) * 100;

  return (
    <div className="hero-container">
      <div className="hero-header">
        <div className="hero-meta">
          <h2>Budget for {monthLabel}</h2>
          {cycleRangeLabel && <p className="cycle-range">{cycleRangeLabel}</p>}
        </div>

        {/* Toggle Switch */}
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`toggle-btn ${viewMode === "remaining" ? "active" : ""}`}
            onClick={() => onViewModeToggle("remaining")}
          >
            Remaining
          </button>
          <button
            type="button"
            className={`toggle-btn ${viewMode === "spent" ? "active" : ""}`}
            onClick={() => onViewModeToggle("spent")}
          >
            Spent
          </button>
        </div>
      </div>

      <div className="hero-grid">
        {/* Starting Salary Block */}
        <div className="hero-block starting-salary-block">
          <h3>Starting Salary</h3>
          {isEditing ? (
            <div className="salary-edit-form">
              <span className="currency-prefix">{currency}</span>
              <input
                type="number"
                step="0.01"
                className="salary-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button
                type="button"
                className="btn-icon btn-save"
                onClick={handleSave}
              >
                <FontAwesomeIcon icon={faCheck} size="sm" />
              </button>
              <button
                type="button"
                className="btn-icon btn-cancel"
                onClick={() => {
                  setEditValue(startingSalary.toString());
                  setIsEditing(false);
                }}
              >
                <FontAwesomeIcon icon={faXmark} size="sm" />
              </button>
            </div>
          ) : (
            <div>
              <div className="salary-display">
                <h2 className="amount">
                  <span>{currency}</span>
                  <span>{parseFloat(startingSalary).toFixed(2)}</span>
                </h2>
                <button
                  type="button"
                  className="btn-edit-salary"
                  onClick={() => setIsEditing(true)}
                  title="Edit Starting Salary"
                >
                  <FontAwesomeIcon icon={faPen} size="xs" />
                </button>
              </div>
              <div className="assigned-percentage-badge">
                {assignedPercentage.toFixed(0)}% assigned
              </div>
            </div>
          )}
        </div>

        {/* Unassigned Salary Block */}
        <div
          className={`hero-block unassigned-salary-block ${isOverallocated ? "overallocated" : ""}`}
        >
          <h3>{isOverallocated ? "Over-allocated" : "Left to Assign"}</h3>
          <h2 className="amount">
            <span>{currency}</span>
            <span>{parseFloat(unassignedSalary).toFixed(2)}</span>
          </h2>
          <p className="zero-budget-caption">
            {isOverallocated
              ? "You've assigned more than your salary!"
              : unassignedSalary === 0
                ? "Every pound has a job. Well done!"
                : "Give every pound a job."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
