/* Optimistic UI · Badge · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./badge.css";

type Tone = "neutral" | "brand" | "success" | "danger" | "warning" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** show a leading status dot */
  dot?: boolean;
}

export const Badge = ({ tone = "neutral", dot = false, className = "", children, ...props }: BadgeProps) => (
  <span className={`o-badge o-badge--${tone}${className ? ` ${className}` : ""}`} {...props}>
    {dot && <span className="o-badge__dot" aria-hidden="true" />}
    {children}
  </span>
);
Badge.displayName = "Badge";
