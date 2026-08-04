"use client";
/* Optimistic UI · Dropdown · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./dropdown.css";
export interface DropdownOption { label: React.ReactNode; value: string; icon?: React.ReactNode; danger?: boolean; }
export interface DropdownProps {
  label: React.ReactNode; options: DropdownOption[]; onSelect?: (value: string) => void; align?: "start" | "end";
}
export const Dropdown = ({ label, options, onSelect, align = "start" }: DropdownProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="o-dropdown">
      <button type="button" className="o-dropdown__trigger" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
        {label}
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <>
          <span className="o-dropdown__scrim" onClick={() => setOpen(false)} />
          <div role="menu" className={`o-dropdown__menu o-dropdown__menu--${align}`}>
            {options.map((o) => (
              <button key={o.value} role="menuitem" type="button" className={`o-dropdown__item${o.danger ? " o-dropdown__item--danger" : ""}`} onClick={() => { onSelect?.(o.value); setOpen(false); }}>
                {o.icon != null && <span className="o-dropdown__icon">{o.icon}</span>}
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  );
};
Dropdown.displayName = "Dropdown";
