/* Optimistic UI · Indicator · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./indicator.css";
type Tone = "neutral" | "success" | "danger" | "warning" | "info" | "brand";
export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  pulse?: boolean;
}
export const Indicator = ({ tone = "neutral", pulse = false, className = "", ...props }: IndicatorProps) => (
  <span className={`o-indicator o-indicator--${tone}${pulse ? " o-indicator--pulse" : ""}${className ? ` ${className}` : ""}`} {...props} />
);
Indicator.displayName = "Indicator";
