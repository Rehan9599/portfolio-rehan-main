"use client";
/* Optimistic UI · TimePicker · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./time-picker.css";
export interface TimePickerProps { value?: string; onValueChange?: (t: string) => void; step?: number; }
export const TimePicker = ({ value, onValueChange, step = 30 }: TimePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const times = React.useMemo(() => {
    const out: string[] = [];
    for (let m = 0; m < 24 * 60; m += step) out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    return out;
  }, [step]);
  return (
    <div className="o-time">
      <button type="button" className="o-time__input" onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" /><path d="M8 5v3.2l2 1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        <span>{value || "Select time"}</span>
      </button>
      {open && (
        <>
          <span className="o-time__scrim" onClick={() => setOpen(false)} />
          <div className="o-time__list" role="listbox">
            {times.map((t) => (
              <button key={t} type="button" role="option" aria-selected={t === value} className={`o-time__opt${t === value ? " o-time__opt--sel" : ""}`} onClick={() => { onValueChange?.(t); setOpen(false); }}>{t}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
TimePicker.displayName = "TimePicker";
