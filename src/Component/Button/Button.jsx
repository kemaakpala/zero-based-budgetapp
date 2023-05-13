import "./styles/Button.css";
const Button = ({ children, classModifier = "primary" }) => (
  <button
    className={`form-control group-actions__button group-actions__button--${classModifier}`}
  >
    {children}
  </button>
);

export default Button;
