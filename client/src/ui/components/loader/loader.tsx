/* Optimistic UI · Loader · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./loader.css";
export interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  label?: string;
}
export const Loader = ({ size = 18, label = "Loading", className = "", style, ...props }: LoaderProps) => (
  <span role="status" aria-label={label} className={`o-loader${className ? ` ${className}` : ""}`} style={{ width: size, height: size, ...style }} {...props} />
);
Loader.displayName = "Loader";
