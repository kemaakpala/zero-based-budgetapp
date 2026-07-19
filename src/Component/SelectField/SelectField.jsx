import React from "react";
import PropTypes from "prop-types";

const SelectField = ({
  id,
  value,
  onChange,
  options,
  label,
  name,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const renderLabel = () => {
    if (!label) return null;
    return (
      <label className={`${variant}-fields__label`} htmlFor={id}>
        {label}
      </label>
    );
  };

  return (
    <>
      {renderLabel()}
      <select
        className={`form-control ${variant}-fields__select ${className}`.trim()}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SelectField;
