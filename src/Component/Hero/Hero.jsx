import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashCan,
  faCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/Hero.css";

const SEGMENT_COLORS = ["#1a73e8", "#6c3eb6", "#e67c00", "#0d8a72", "#c81e1e"];

const EditableField = ({ value, onSave, type = "text", prefix = "" }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleBlur = () => {
    setEditing(false);
    onSave(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      inputRef.current.blur();
    }
  };

  if (editing) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        {prefix && <span className="hero-currency-inline">{prefix}</span>}
        <input
          ref={inputRef}
          type={type}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="hero-inplace-input"
          autoFocus
        />
      </div>
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className="hero-inplace-text"
      title="Click to edit"
    >
      {prefix}
      {value}
    </span>
  );
};

EditableField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSave: PropTypes.func.isRequired,
  type: PropTypes.string,
  prefix: PropTypes.string,
};

const Hero = ({
  monthLabel = "",
  cycleRangeLabel = "",
  incomes = [],
  totalIncome = 0,
  totalAssigned = 0,
  unassignedIncome = 0,
  isOverallocated = false,
  onUpdateIncomeField,
  onAddIncome,
  onDeleteIncome,
  viewMode = "remaining",
  onViewModeToggle,
}) => {
  const pct = totalIncome > 0 ? (totalAssigned / totalIncome) * 100 : 0;
  const clampedPct = Math.min(pct, 100);
  const overage = Math.abs(unassignedIncome);

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

      <div className="hero-total-section">
        <h3>TOTAL INCOME</h3>
        <h2 className="hero-total-amount">
          <span>£</span>
          {totalIncome.toFixed(2)}
        </h2>
      </div>

      {/* Incomes Cards Grid */}
      <div className="hero-cards-grid">
        {incomes.map((income, idx) => {
          const pctShare =
            totalIncome > 0 ? (income.amount / totalIncome) * 100 : 0;
          return (
            <div
              key={income.id}
              className="hero-bordered-card"
              style={{
                borderLeft: `4px solid ${SEGMENT_COLORS[idx % SEGMENT_COLORS.length]}`,
              }}
            >
              <div className="hero-card-header-row">
                <EditableField
                  value={income.name}
                  onSave={(v) => onUpdateIncomeField(income.id, "name", v)}
                />
                <button
                  type="button"
                  className={`hero-pill-badge ${income.received ? "received" : "pending"}`}
                  onClick={() =>
                    onUpdateIncomeField(income.id, "received", !income.received)
                  }
                  title="Click to toggle status"
                >
                  {income.received ? "Received" : "Pending"}
                </button>
              </div>
              <div className="hero-card-bottom-row">
                <EditableField
                  value={income.amount.toFixed(2)}
                  onSave={(v) => onUpdateIncomeField(income.id, "amount", v)}
                  type="number"
                  prefix="£"
                />
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    alignItems: "center",
                  }}
                >
                  <span className="hero-card-pct">{pctShare.toFixed(0)}%</span>
                  {incomes.length > 1 && (
                    <button
                      type="button"
                      className="hero-btn-icon hero-btn-danger"
                      onClick={() => onDeleteIncome(income.id)}
                      title="Delete Income Source"
                    >
                      <FontAwesomeIcon icon={faTrashCan} size="xs" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className="hero-bordered-card hero-btn-add-card"
          onClick={onAddIncome}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Income</span>
        </button>
      </div>

      {/* Symmetric Banners Area */}
      {unassignedIncome === 0 && !isOverallocated ? (
        <div className="hero-status-banner hero-status-banner--success">
          <FontAwesomeIcon icon={faCheck} className="hero-status-banner-icon" />
          <span>Every pound has a job. Well done!</span>
        </div>
      ) : isOverallocated ? (
        <div className="hero-status-banner hero-status-banner--error">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="hero-status-banner-icon"
          />
          <span>£{overage.toFixed(2)} Over-allocated! Reduce assignments.</span>
        </div>
      ) : (
        <div className="hero-progress-section">
          <p className="hero-progress-text">
            £{totalAssigned.toFixed(2)} of £{totalIncome.toFixed(2)} assigned
          </p>
          <div className="hero-progress-track">
            <div
              className="hero-progress-fill"
              style={{ width: `${clampedPct}%` }}
            ></div>
          </div>
          <p className="hero-progress-subtext">
            £{unassignedIncome.toFixed(2)} left to assign
          </p>
        </div>
      )}
    </div>
  );
};

Hero.propTypes = {
  monthLabel: PropTypes.string,
  cycleRangeLabel: PropTypes.string,
  incomes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      received: PropTypes.bool.isRequired,
    })
  ).isRequired,
  totalIncome: PropTypes.number,
  totalAssigned: PropTypes.number,
  unassignedIncome: PropTypes.number,
  isOverallocated: PropTypes.bool,
  onUpdateIncomeField: PropTypes.func.isRequired,
  onAddIncome: PropTypes.func.isRequired,
  onDeleteIncome: PropTypes.func.isRequired,
  viewMode: PropTypes.string,
  onViewModeToggle: PropTypes.func.isRequired,
};

export default Hero;
