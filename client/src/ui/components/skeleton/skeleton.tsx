/* Optimistic UI · Skeleton · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./skeleton.css";
export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
}
export const Skeleton = ({ width, height, circle = false, className = "", style, ...props }: SkeletonProps) => (
  <span className={`o-skeleton${circle ? " o-skeleton--circle" : ""}${className ? ` ${className}` : ""}`} style={{ width, height, ...style }} {...props} />
);
Skeleton.displayName = "Skeleton";
