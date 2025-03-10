import React from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/PopOverMenu.css";

const MenuItem = ({ children }) => (
  <li className="popover-menu-list-item">{children}</li>
);

/**
 * PopOverMenu component renders a navigation menu with a list of items.
 *
 * @param {Object[]} menuList - Array of menu items.
 * @param {string} menuList[].title - Title of the menu item.
 * @param {Object} menuList[].icon - Icon of the menu item.
 * @param {string} [menuList[].description] - Description of the menu item.
 * @param {string} width - Width of the menu.
 * @param {string} left - Left position of the menu.
 */
function PopOverMenu({ menuList, width, left }) {
  return (
    <nav>
      <ul className="popover-menu-list" style={{ width, left }}>
        {menuList.map((menuItem) => {
          return (
            <MenuItem key={menuItem.title}>
              <Button
                variation="transparent"
                // Prevents the default action but does not handle the click event
                onClickHandler={(e) => e.preventDefault()}
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

PopOverMenu.propTypes = {
  menuList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.object.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  width: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
};
export default PopOverMenu;
