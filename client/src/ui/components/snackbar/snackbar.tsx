/* Optimistic UI · Snackbar · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./snackbar.css";
type Tone = "neutral" | "success" | "danger";
export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone; action?: React.ReactNode; onClose?: () => void;
}
export const Snackbar = ({ tone = "neutral", action, onClose, className = "", children, ...props }: SnackbarProps) => (
  <div role="status" className={`o-snack o-snack--${tone}${className ? ` ${className}` : ""}`} {...props}>
    <span className="o-snack__text">{children}</span>
    {action != null && <span className="o-snack__action">{action}</span>}
    {onClose && <button type="button" className="o-snack__close" aria-label="Dismiss" onClick={onClose}>×</button>}
  </div>
);
Snackbar.displayName = "Snackbar";
