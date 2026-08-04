/* Optimistic UI · Input · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./input.css";

type Size = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  size?: Size;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, size = "md", id, className = "", ...props }, ref) => {
    const reactId = React.useId();
    const inputId = id || reactId;
    const describedBy = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;
    return (
      <div className="o-field">
        {label && <label className="o-field__label" htmlFor={inputId}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`o-input o-input--${size}${error ? " o-input--error" : ""}${className ? ` ${className}` : ""}`}
          {...props}
        />
        {error ? (
          <span id={`${inputId}-err`} className="o-field__error">{error}</span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="o-field__hint">{hint}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
