/* Optimistic UI · Choicebox · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./choicebox.css";
export interface ChoiceboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode; description?: React.ReactNode;
}
export const Choicebox = React.forwardRef<HTMLInputElement, ChoiceboxProps>(
  ({ label, description, id, className = "", ...props }, ref) => {
    const rid = React.useId();
    const cid = id || rid;
    return (
      <label className={`o-choicebox${props.disabled ? " o-choicebox--disabled" : ""}${className ? ` ${className}` : ""}`} htmlFor={cid}>
        <input ref={ref} id={cid} type="radio" className="o-choicebox__input" {...props} />
        <span className="o-choicebox__dot" aria-hidden="true" />
        <span className="o-choicebox__body">
          <span className="o-choicebox__label">{label}</span>
          {description != null && <span className="o-choicebox__desc">{description}</span>}
        </span>
      </label>
    );
  }
);
Choicebox.displayName = "Choicebox";
