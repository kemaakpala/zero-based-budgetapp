import PropTypes from "prop-types";

const TextField = ({
  id,
  label,
  inputName,
  placeholder,
  variant,
  onChange,
  defaultVal,
}) => {
  const onChangeHandler = (e) => onChange(e);
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
        className={`form-control ${variant}-fields__input`}
        id={id}
        type="text"
        name={inputName}
        placeholder={placeholder}
        onChange={onChangeHandler}
        defaultValue={defaultVal}
      />
    </>
  );
};

TextField.defaultProps = {
  placeholder: "Please Enter Value Here",
  variant: "primary",
};

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  variant: PropTypes.string,
};

export default TextField;
