/* Optimistic UI · SplitButton · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./split-button.css";
export interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  onMain?: () => void;
  onMore?: () => void;
  variant?: "warm" | "primary";
}
export const SplitButton = ({ label, onMain, onMore, variant = "warm", className = "", ...props }: SplitButtonProps) => (
  <div className={`o-split o-split--${variant}${className ? ` ${className}` : ""}`} {...props}>
    <button type="button" className="o-split__main" onClick={onMain}>{label}</button>
    <button type="button" className="o-split__more" aria-label="More actions" onClick={onMore}>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  </div>
);
SplitButton.displayName = "SplitButton";
