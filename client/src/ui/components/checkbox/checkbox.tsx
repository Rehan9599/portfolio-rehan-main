/* Optimistic UI · Checkbox · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./checkbox.css";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = "", ...props }, ref) => {
    const reactId = React.useId();
    const cid = id || reactId;
    return (
      <label className={`o-check${props.disabled ? " o-check--disabled" : ""}${className ? ` ${className}` : ""}`} htmlFor={cid}>
        <input ref={ref} id={cid} type="checkbox" className="o-check__input" {...props} />
        <span className="o-check__box" aria-hidden="true">
          <svg className="o-check__tick" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {label != null && <span className="o-check__label">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
