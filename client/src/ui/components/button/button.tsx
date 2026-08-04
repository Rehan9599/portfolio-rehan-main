import * as React from "react";
import "./button.css";

type Variant = "warm" | "primary" | "ghost" | "quiet" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/** Optimistic Button — own this file; edit it however you like. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "warm", size = "md", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`o-btn o-btn--${variant}${size !== "md" ? ` o-btn--${size}` : ""}${className ? ` ${className}` : ""}`}
      {...props}
    />
  )
);
Button.displayName = "Button";
