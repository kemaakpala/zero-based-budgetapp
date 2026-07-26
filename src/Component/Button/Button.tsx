import type { ReactNode, MouseEvent } from "react";
import "./styles/Button.css";

export interface ButtonProps {
  children?: ReactNode;
  variation?: string;
  color?: string;
  bgColor?: string;
  className?: string;
  onClickHandler?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  children,
  variation,
  color,
  bgColor,
  className = "",
  onClickHandler,
}: ButtonProps) => {
  let groupActionsStyledModifier = `group-actions__button--styled group-actions__button--${variation}`;
  if (variation === "transparent") {
    groupActionsStyledModifier = `group-actions__button--${variation}`;
  }
  if (color) {
    groupActionsStyledModifier += ` group-actions__button--${color}`;
  }
  if (bgColor) {
    groupActionsStyledModifier += ` group-actions__button--bg--${bgColor}`;
  }
  return (
    <button
      className={`form-control group-actions__button ${groupActionsStyledModifier} ${className}`.trim()}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
