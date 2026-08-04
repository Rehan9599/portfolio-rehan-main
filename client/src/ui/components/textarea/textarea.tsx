/* Optimistic UI · Textarea · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./textarea.css";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, rows = 4, className = "", ...props }, ref) => {
    const reactId = React.useId();
    const tid = id || reactId;
    const describedBy = error ? `${tid}-err` : hint ? `${tid}-hint` : undefined;
    return (
      <div className="o-field">
        {label && <label className="o-field__label" htmlFor={tid}>{label}</label>}
        <textarea
          ref={ref}
          id={tid}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`o-textarea${error ? " o-textarea--error" : ""}${className ? ` ${className}` : ""}`}
          {...props}
        />
        {error ? (
          <span id={`${tid}-err`} className="o-field__error">{error}</span>
        ) : hint ? (
          <span id={`${tid}-hint`} className="o-field__hint">{hint}</span>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
