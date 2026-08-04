"use client";
/* Optimistic UI · Combobox · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./combobox.css";
export interface ComboOption { label: string; value: string; }
export interface ComboboxProps { options: ComboOption[]; value?: string; onValueChange?: (v: string) => void; placeholder?: string; }
export const Combobox = ({ options, value, onValueChange, placeholder = "Select…" }: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="o-combo">
      <input className="o-combo__input" value={open ? q : selected?.label ?? ""} placeholder={placeholder}
        onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); }} />
      <svg className="o-combo__chev" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {open && (
        <>
          <span className="o-combo__scrim" onClick={() => { setOpen(false); setQ(""); }} />
          <div className="o-combo__list" role="listbox">
            {filtered.length ? filtered.map((o) => (
              <button key={o.value} type="button" role="option" aria-selected={o.value === value}
                className={`o-combo__opt${o.value === value ? " o-combo__opt--sel" : ""}`}
                onClick={() => { onValueChange?.(o.value); setOpen(false); setQ(""); }}>{o.label}</button>
            )) : <div className="o-combo__empty">No results</div>}
          </div>
        </>
      )}
    </div>
  );
};
Combobox.displayName = "Combobox";
