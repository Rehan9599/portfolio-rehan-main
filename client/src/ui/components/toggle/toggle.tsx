/* Optimistic UI · Toggle · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./toggle.css";

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, id, className = "", ...props }, ref) => {
    const reactId = React.useId();
    const tid = id || reactId;
    return (
      <label className={`o-toggle${props.disabled ? " o-toggle--disabled" : ""}${className ? ` ${className}` : ""}`} htmlFor={tid}>
        <input ref={ref} id={tid} type="checkbox" role="switch" className="o-toggle__input" {...props} />
        <span className="o-toggle__track" aria-hidden="true"><span className="o-toggle__thumb" /></span>
        {label != null && <span className="o-toggle__label">{label}</span>}
      </label>
    );
  }
);
Toggle.displayName = "Toggle";
