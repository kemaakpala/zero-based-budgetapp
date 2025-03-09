import React from "react";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/PopOverMenu.css";

export default function PopOverMenu({ menuList, width, left }) {
  return (
    <ul className={`popover-menu-list`} style={{ width, left }}>
      {menuList.map((menuItem, index) => {
        return (
          <li className="popover-menu-list-item" key={index}>
            <Button variation="transparent">
              <FontAwesomeIcon
                icon={menuItem.icon}
                size="1x"
                title={menuItem.title}
              />{" "}
              {menuItem.description !== undefined && (
                <span>{menuItem?.description}</span>
              )}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
