/* Optimistic UI · Kbd · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./kbd.css";
export const Kbd = ({ className = "", ...props }: React.HTMLAttributes<HTMLElement>) => (
  <kbd className={`o-kbd${className ? ` ${className}` : ""}`} {...props} />
);
Kbd.displayName = "Kbd";
