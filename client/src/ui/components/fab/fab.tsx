/* Optimistic UI · Fab · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./fab.css";
export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}
export const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  ({ label, className = "", children, ...props }, ref) => (
    <button ref={ref} type="button" aria-label={label} className={`o-fab${label && children ? " o-fab--extended" : ""}${className ? ` ${className}` : ""}`} {...props}>
      {children}{label && children ? <span className="o-fab__label">{label}</span> : null}
    </button>
  )
);
Fab.displayName = "Fab";
