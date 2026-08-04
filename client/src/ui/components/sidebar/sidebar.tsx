/* Optimistic UI · Sidebar · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./sidebar.css";
export const Sidebar = ({ className = "", ...props }: React.HTMLAttributes<HTMLElement>) => (
  <nav className={`o-sidebar${className ? ` ${className}` : ""}`} {...props} />
);
Sidebar.displayName = "Sidebar";
export const SidebarGroup = ({ label, className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement> & { label?: React.ReactNode }) => (
  <div className={`o-sidebar__group${className ? ` ${className}` : ""}`} {...props}>
    {label != null && <div className="o-sidebar__grouplabel">{label}</div>}
    {children}
  </div>
);
export interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode; active?: boolean;
}
export const SidebarItem = ({ icon, active = false, className = "", children, ...props }: SidebarItemProps) => (
  <button type="button" aria-current={active ? "page" : undefined} className={`o-sidebar__item${active ? " o-sidebar__item--active" : ""}${className ? ` ${className}` : ""}`} {...props}>
    {icon != null && <span className="o-sidebar__icon">{icon}</span>}
    <span className="o-sidebar__label">{children}</span>
  </button>
);
