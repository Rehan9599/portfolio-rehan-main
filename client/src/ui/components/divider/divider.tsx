/* Optimistic UI · Divider · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./divider.css";
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
}
export const Divider = ({ orientation = "horizontal", label, className = "", ...props }: DividerProps) => (
  <div role="separator" aria-orientation={orientation} className={`o-divider o-divider--${orientation}${label ? " o-divider--labelled" : ""}${className ? ` ${className}` : ""}`} {...props}>
    {label != null && <span className="o-divider__label">{label}</span>}
  </div>
);
Divider.displayName = "Divider";
