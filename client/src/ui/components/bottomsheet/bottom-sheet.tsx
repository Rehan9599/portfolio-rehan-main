"use client";
/* Optimistic UI · BottomSheet · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import { createPortal } from "react-dom";
import "./bottom-sheet.css";
export interface BottomSheetProps { open: boolean; onClose?: () => void; title?: React.ReactNode; children?: React.ReactNode; }
export const BottomSheet = ({ open, onClose, title, children }: BottomSheetProps) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="o-sheet">
      <div className="o-sheet__backdrop" onClick={onClose} />
      <div className="o-sheet__panel" role="dialog" aria-modal="true">
        <div className="o-sheet__grip" aria-hidden="true" />
        {title != null && <div className="o-sheet__title">{title}</div>}
        <div className="o-sheet__body">{children}</div>
      </div>
    </div>,
    document.body
  );
};
BottomSheet.displayName = "BottomSheet";
