/* Optimistic UI · Stepper · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./stepper.css";
export interface StepperProps {
  value: number; min?: number; max?: number; step?: number; onChange?: (v: number) => void;
}
export const Stepper = ({ value, min = -Infinity, max = Infinity, step = 1, onChange }: StepperProps) => {
  const set = (v: number) => onChange?.(Math.max(min, Math.min(max, v)));
  return (
    <div className="o-stepper">
      <button type="button" className="o-stepper__btn" aria-label="Decrease" disabled={value <= min} onClick={() => set(value - step)}>−</button>
      <input className="o-stepper__input" type="number" value={value} onChange={(e) => set(Number(e.target.value))} />
      <button type="button" className="o-stepper__btn" aria-label="Increase" disabled={value >= max} onClick={() => set(value + step)}>+</button>
    </div>
  );
};
Stepper.displayName = "Stepper";
