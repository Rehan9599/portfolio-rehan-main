"use client";
/* Optimistic UI · Drawer · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import { createPortal } from "react-dom";
import "./drawer.css";
export interface DrawerProps {
  open: boolean; onClose?: () => void; side?: "right" | "left"; title?: React.ReactNode; children?: React.ReactNode;
  /** Portal target. Defaults to document.body; pass a themed element to inherit its tokens. */
  container?: HTMLElement | null;
}
export const Drawer = ({ open, onClose, side = "right", title, children, container }: DrawerProps) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className={`o-drawer o-drawer--${side}`}>
      <div className="o-drawer__backdrop" onClick={onClose} />
      <div className="o-drawer__panel" role="dialog" aria-modal="true">
        {title != null && (
          <div className="o-drawer__head">
            <div className="o-drawer__title">{title}</div>
            <button type="button" className="o-drawer__close" aria-label="Close" onClick={onClose}>×</button>
          </div>
        )}
        <div className="o-drawer__body">{children}</div>
      </div>
    </div>,
    container ?? document.body
  );
};
Drawer.displayName = "Drawer";
