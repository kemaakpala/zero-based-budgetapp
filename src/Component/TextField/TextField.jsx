import PropTypes from "prop-types";

const TextField = ({label, inputName, placeholder, variant}) => (
  <>
    <label
      className={`${variant}-income-fields__label`}
      htmlFor={inputName}
    >
      {label}
    </label>
    <input
      className={`form-control ${variant}-income-fields__input`}
      id={inputName}
      type="text"
      name={inputName}
      placeholder={placeholder}
    />
  </>
);

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  variant: PropTypes.string
};

TextField.defaultProps = {
  placeholder: "Please Enter Value Here",
  variant: "primary"
};

export default TextField;
