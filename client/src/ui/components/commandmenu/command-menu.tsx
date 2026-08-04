"use client";
/* Optimistic UI · CommandMenu · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import { createPortal } from "react-dom";
import "./command-menu.css";
export interface CommandItem { label: string; hint?: string; icon?: React.ReactNode; onSelect?: () => void; }
export interface CommandMenuProps { open: boolean; onClose?: () => void; items: CommandItem[]; placeholder?: string; }
export const CommandMenu = ({ open, onClose, items, placeholder = "Type a command or search…" }: CommandMenuProps) => {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  React.useEffect(() => { setActive(0); }, [q]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter") { filtered[active]?.onSelect?.(); onClose?.(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, filtered, active]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="o-cmd">
      <div className="o-cmd__backdrop" onClick={onClose} />
      <div className="o-cmd__panel" role="dialog" aria-modal="true">
        <input autoFocus className="o-cmd__input" value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} />
        <div className="o-cmd__list">
          {filtered.length ? filtered.map((it, i) => (
            <button key={i} type="button" className={`o-cmd__item${i === active ? " o-cmd__item--active" : ""}`}
              onMouseEnter={() => setActive(i)} onClick={() => { it.onSelect?.(); onClose?.(); }}>
              {it.icon != null && <span className="o-cmd__icon">{it.icon}</span>}
              <span className="o-cmd__label">{it.label}</span>
              {it.hint && <span className="o-cmd__hint">{it.hint}</span>}
            </button>
          )) : <div className="o-cmd__empty">No results</div>}
        </div>
      </div>
    </div>,
    document.body
  );
};
CommandMenu.displayName = "CommandMenu";
