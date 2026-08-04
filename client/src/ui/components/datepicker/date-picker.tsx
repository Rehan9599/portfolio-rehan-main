"use client";
/* Optimistic UI · DatePicker · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./date-picker.css";
export interface DatePickerProps { value?: string; onValueChange?: (iso: string) => void; }
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["S","M","T","W","T","F","S"];
export const DatePicker = ({ value, onValueChange }: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const initial = value ? new Date(value + "T00:00:00") : new Date(2026, 6, 1);
  const [view, setView] = React.useState({ y: initial.getFullYear(), m: initial.getMonth() });
  const first = new Date(view.y, view.m, 1).getDay();
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const pick = (d: number) => { const iso = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; onValueChange?.(iso); setOpen(false); };
  const shift = (n: number) => setView((v) => { const d = new Date(v.y, v.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  return (
    <div className="o-date">
      <button type="button" className="o-date__input" onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        <span>{value || "Select date"}</span>
      </button>
      {open && (
        <>
          <span className="o-date__scrim" onClick={() => setOpen(false)} />
          <div className="o-date__cal">
            <div className="o-date__head">
              <button type="button" className="o-date__nav" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
              <span className="o-date__month">{MONTHS[view.m]} {view.y}</span>
              <button type="button" className="o-date__nav" onClick={() => shift(1)} aria-label="Next month">›</button>
            </div>
            <div className="o-date__grid">
              {DOW.map((d, i) => <span key={i} className="o-date__dow">{d}</span>)}
              {Array.from({ length: first }).map((_, i) => <span key={"e" + i} />)}
              {Array.from({ length: days }).map((_, i) => {
                const d = i + 1;
                const iso = `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                return <button key={d} type="button" className={`o-date__day${value === iso ? " o-date__day--sel" : ""}`} onClick={() => pick(d)}>{d}</button>;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
DatePicker.displayName = "DatePicker";
