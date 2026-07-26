import { forwardRef } from "react";
import type { ChangeEvent, FocusEvent, KeyboardEvent } from "react";

export interface TextFieldProps {
  id: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  label?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  variant?: string;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  step?: string;
  min?: string;
  max?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
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

export default TextField;
