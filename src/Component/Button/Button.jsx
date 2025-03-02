import "./styles/Button.css";
const Button = ({ children, classModifier = "primary", onClickHandler }) => {
  let groupActionsStyledModifier = `group-actions__button--styled group-actions__button--${classModifier}`;
  if(classModifier === "transparent") {
    groupActionsStyledModifier = `group-actions__button--${classModifier}`;
  }
  return (
  <button
    className={`form-control group-actions__button ${groupActionsStyledModifier}`}
    onClick={onClickHandler}
  >
    {children}
  </button>
)};

export default Button;
