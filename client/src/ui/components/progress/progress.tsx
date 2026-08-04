/* Optimistic UI · Progress · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./progress.css";
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  indeterminate?: boolean;
}
export const Progress = ({ value = 0, indeterminate = false, className = "", ...props }: ProgressProps) => (
  <div role="progressbar" aria-valuenow={indeterminate ? undefined : Math.round(value)} aria-valuemin={0} aria-valuemax={100} className={`o-progress${indeterminate ? " o-progress--indeterminate" : ""}${className ? ` ${className}` : ""}`} {...props}>
    <div className="o-progress__bar" style={indeterminate ? undefined : { width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);
Progress.displayName = "Progress";
