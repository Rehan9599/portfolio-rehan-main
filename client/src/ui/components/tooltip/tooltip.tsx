/* Optimistic UI · Tooltip · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./tooltip.css";
export interface TooltipProps { label: React.ReactNode; side?: "top" | "bottom"; children: React.ReactNode; }
export const Tooltip = ({ label, side = "top", children }: TooltipProps) => (
  <span className={`o-tip o-tip--${side}`}>
    {children}
    <span role="tooltip" className="o-tip__bubble">{label}</span>
  </span>
);
Tooltip.displayName = "Tooltip";
