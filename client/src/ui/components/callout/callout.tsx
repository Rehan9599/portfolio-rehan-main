/* Optimistic UI · Callout · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./callout.css";

type Tone = "info" | "success" | "warning" | "danger" | "neutral";

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: Tone;
  title?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Callout = ({ tone = "info", title, icon, className = "", children, ...props }: CalloutProps) => (
  <div className={`o-callout o-callout--${tone}${className ? ` ${className}` : ""}`} role="note" {...props}>
    {icon != null && <span className="o-callout__icon" aria-hidden="true">{icon}</span>}
    <div className="o-callout__body">
      {title != null && <div className="o-callout__title">{title}</div>}
      {children != null && <div className="o-callout__text">{children}</div>}
    </div>
  </div>
);
Callout.displayName = "Callout";
