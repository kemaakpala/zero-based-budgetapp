import React from "react";
import PropTypes from "prop-types";

const TextField = React.forwardRef(
  (
    {
      id,
      value,
      onChange,
      onBlur,
      onKeyDown,
      label,
      name,
      placeholder,
      type = "text",
      variant = "primary",
      className = "",
      autoFocus = false,
      disabled = false,
      step,
      min,
      max,
    },
    ref
  ) => {
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
        <input
          ref={ref}
          className={`form-control ${variant}-fields__input ${className}`.trim()}
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
        />
      </>
    );
  }
);

TextField.displayName = "TextField";

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  step: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
};

export default TextField;
