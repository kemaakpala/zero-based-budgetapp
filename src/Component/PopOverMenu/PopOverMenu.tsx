import type { ReactNode } from "react";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "./styles/PopOverMenu.css";

export interface MenuItemType {
  title: string;
  icon: IconDefinition;
  description?: string;
  action?: () => void;
}

export interface PopOverMenuProps {
  menuList: MenuItemType[];
  width: string;
  left: string;
}

const MenuItem = ({ children }: { children: ReactNode }) => (
  <li className="popover-menu-list-item">{children}</li>
);

/**
 * PopOverMenu component renders a navigation menu with a list of items.
 */
function PopOverMenu({ menuList, width, left }: PopOverMenuProps) {
  return (
    <nav>
      <ul className="popover-menu-list" style={{ width, left }}>
        {menuList.map((menuItem) => {
          return (
            <MenuItem key={menuItem.title}>
              <Button
                variation="transparent"
                onClickHandler={(e) => {
                  e.preventDefault();
                  if (menuItem.action) {
                    menuItem.action();
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={menuItem.icon}
                  size="1x"
                  title={menuItem.title}
                />
                {menuItem.description !== undefined && (
                  <span>{menuItem.description}</span>
                )}
              </Button>
            </MenuItem>
          );
        })}
      </ul>
    </nav>
  );
}

export default PopOverMenu;
