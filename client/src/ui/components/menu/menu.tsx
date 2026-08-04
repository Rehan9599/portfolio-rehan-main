/* Optimistic UI · Menu · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./menu.css";
export const Menu = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div role="menu" className={`o-menu${className ? ` ${className}` : ""}`} {...props} />
);
Menu.displayName = "Menu";
export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode; danger?: boolean;
}
export const MenuItem = ({ icon, danger = false, className = "", children, ...props }: MenuItemProps) => (
  <button role="menuitem" type="button" className={`o-menu__item${danger ? " o-menu__item--danger" : ""}${className ? ` ${className}` : ""}`} {...props}>
    {icon != null && <span className="o-menu__icon">{icon}</span>}
    <span className="o-menu__label">{children}</span>
  </button>
);
MenuItem.displayName = "MenuItem";
export const MenuSeparator = () => <div className="o-menu__sep" role="separator" />;
