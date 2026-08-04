/* Optimistic UI · TopNav · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./topnav.css";
export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode; actions?: React.ReactNode;
}
export const TopNav = ({ brand, actions, className = "", children, ...props }: TopNavProps) => (
  <header className={`o-topnav${className ? ` ${className}` : ""}`} {...props}>
    {brand != null && <div className="o-topnav__brand">{brand}</div>}
    <nav className="o-topnav__links">{children}</nav>
    {actions != null && <div className="o-topnav__actions">{actions}</div>}
  </header>
);
TopNav.displayName = "TopNav";
export interface TopNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { active?: boolean; }
export const TopNavLink = ({ active = false, className = "", ...props }: TopNavLinkProps) => (
  <a aria-current={active ? "page" : undefined} className={`o-topnav__link${active ? " o-topnav__link--active" : ""}${className ? ` ${className}` : ""}`} {...props} />
);
