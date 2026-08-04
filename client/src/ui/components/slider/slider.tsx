/* Optimistic UI · Slider · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./slider.css";
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number; min?: number; max?: number; step?: number; onValueChange?: (v: number) => void;
}
export const Slider = ({ value, min = 0, max = 100, step = 1, onValueChange, className = "", style, ...props }: SliderProps) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input type="range" value={value} min={min} max={max} step={step}
      onChange={(e) => onValueChange?.(Number(e.target.value))}
      className={`o-slider${className ? ` ${className}` : ""}`}
      style={{ ["--o-pct" as string]: `${pct}%`, ...style }} {...props} />
  );
};
Slider.displayName = "Slider";
