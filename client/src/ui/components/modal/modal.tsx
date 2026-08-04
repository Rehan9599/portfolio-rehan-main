"use client";
/* Optimistic UI · Modal · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import { createPortal } from "react-dom";
import "./modal.css";
export interface ModalProps {
  open: boolean; onClose?: () => void; title?: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode;
}
export const Modal = ({ open, onClose, title, footer, children }: ModalProps) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="o-modal">
      <div className="o-modal__backdrop" onClick={onClose} />
      <div className="o-modal__panel" role="dialog" aria-modal="true">
        {title != null && (
          <div className="o-modal__head">
            <div className="o-modal__title">{title}</div>
            <button type="button" className="o-modal__close" aria-label="Close" onClick={onClose}>×</button>
          </div>
        )}
        <div className="o-modal__body">{children}</div>
        {footer != null && <div className="o-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
Modal.displayName = "Modal";
