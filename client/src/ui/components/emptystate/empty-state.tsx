/* Optimistic UI · EmptyState · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./empty-state.css";
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}
export const EmptyState = ({ icon, title, description, action, className = "", ...props }: EmptyStateProps) => (
  <div className={`o-empty${className ? ` ${className}` : ""}`} {...props}>
    {icon != null && <span className="o-empty__icon" aria-hidden="true">{icon}</span>}
    <div className="o-empty__title">{title}</div>
    {description != null && <p className="o-empty__desc">{description}</p>}
    {action != null && <div className="o-empty__action">{action}</div>}
  </div>
);
EmptyState.displayName = "EmptyState";
