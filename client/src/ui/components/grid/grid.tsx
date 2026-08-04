/* Optimistic UI · Grid (Container/Row/Col) · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./grid.css";
export const Container = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`o-container${className ? ` ${className}` : ""}`} {...props} />
);
export const Row = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`o-row${className ? ` ${className}` : ""}`} {...props} />
);
export interface ColProps extends React.HTMLAttributes<HTMLDivElement> { m?: number; t?: number; d?: number; }
export const Col = ({ m = 4, t, d, className = "", style, ...props }: ColProps) => (
  <div className={`o-col${className ? ` ${className}` : ""}`}
    style={{ ["--m" as string]: m, ["--t" as string]: t ?? m, ["--d" as string]: d ?? t ?? m, ...style }} {...props} />
);
