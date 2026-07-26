import type { ChangeEvent } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  label?: string;
  name?: string;
  variant?: string;
  className?: string;
  disabled?: boolean;
}

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
}: SelectFieldProps) => {
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

export default SelectField;
