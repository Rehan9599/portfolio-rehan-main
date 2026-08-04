/* Optimistic UI · Pill · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./pill.css";
export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}
export const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ selected = false, className = "", ...props }, ref) => (
    <button ref={ref} type="button" aria-pressed={selected} className={`o-pill${selected ? " o-pill--selected" : ""}${className ? ` ${className}` : ""}`} {...props} />
  )
);
Pill.displayName = "Pill";
