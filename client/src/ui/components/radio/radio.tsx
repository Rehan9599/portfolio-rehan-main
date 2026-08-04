/* Optimistic UI · Radio · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./radio.css";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, id, className = "", ...props }, ref) => {
    const reactId = React.useId();
    const rid = id || reactId;
    return (
      <label className={`o-radio${props.disabled ? " o-radio--disabled" : ""}${className ? ` ${className}` : ""}`} htmlFor={rid}>
        <input ref={ref} id={rid} type="radio" className="o-radio__input" {...props} />
        <span className="o-radio__dot" aria-hidden="true" />
        {label != null && <span className="o-radio__label">{label}</span>}
      </label>
    );
  }
);
Radio.displayName = "Radio";
