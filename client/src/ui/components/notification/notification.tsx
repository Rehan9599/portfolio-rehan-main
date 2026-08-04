import * as React from "react";
import "./notification.css";

export type Severity = "info" | "success" | "warning" | "error";

const ICONS: Record<Severity, React.ReactNode> = {
  info: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10 9v5M10 6.4v.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>,
  success: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" /><path d="M6.4 10.2l2.4 2.4 4.8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  warning: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3.2 17.6 16.4H2.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M10 8.4v3.4M10 14v.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>,
  error: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" /><path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
};
const Close = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;

export interface NotificationProps {
  severity?: Severity;
  bar?: boolean;
  title?: string;
  actions?: React.ReactNode;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

/** Optimistic Notification — own this file; edit it however you like.
 *  info/success use role="status" (polite); warning/error use role="alert". */
export function Notification({ severity = "info", bar, title, actions, onDismiss, children }: NotificationProps) {
  const role = severity === "warning" || severity === "error" ? "alert" : "status";
  return (
    <div className={`o-notif o-notif--${severity}${bar ? " o-notif--bar" : ""}`} role={role}>
      <span className="o-notif__icon">{ICONS[severity]}</span>
      <div className="o-notif__body">
        {title && <div className="o-notif__title">{title}</div>}
        {children && <div className="o-notif__text">{children}</div>}
        {actions && <div className="o-notif__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="o-notif__close" aria-label="Dismiss" onClick={onDismiss}><Close /></button>
      )}
    </div>
  );
}
