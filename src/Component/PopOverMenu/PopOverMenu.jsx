import React from "react";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./styles/PopOverMenu.css";

export default function PopOverMenu() {
  return (
    <ul className={`popover-menu-list`}>
      <li className="popover-menu-list-item">
        <Button variation="transparent">
          <FontAwesomeIcon icon={faPen} size="1x" title="Edit budget group" />
        </Button>
      </li>
      <li className="popover-menu-list-item">
        <Button variation="transparent">
          <FontAwesomeIcon
            icon={faTrashCan}
            size="1x"
            title="Delete budget group"
          />
        </Button>
      </li>
    </ul>
  );
}
