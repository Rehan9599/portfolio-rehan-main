"use client";
/* Optimistic UI · Popover · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./popover.css";
export interface PopoverProps {
  open: boolean; onClose?: () => void; trigger: React.ReactNode; align?: "start" | "end"; children: React.ReactNode;
}
export const Popover = ({ open, onClose, trigger, align = "start", children }: PopoverProps) => (
  <span className="o-popover">
    {trigger}
    {open && (
      <>
        <span className="o-popover__scrim" onClick={onClose} />
        <div className={`o-popover__panel o-popover__panel--${align}`} role="dialog">{children}</div>
      </>
    )}
  </span>
);
Popover.displayName = "Popover";
