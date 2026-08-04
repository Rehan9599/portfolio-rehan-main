/* Optimistic UI · AppShell (side menu + navbar) · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./app-shell.css";
export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  navbar?: React.ReactNode; sidebar?: React.ReactNode;
}
export const AppShell = ({ navbar, sidebar, className = "", children, ...props }: AppShellProps) => (
  <div className={`o-shell${className ? ` ${className}` : ""}`} {...props}>
    {navbar != null && <div className="o-shell__nav">{navbar}</div>}
    <div className="o-shell__body">
      {sidebar != null && <aside className="o-shell__side">{sidebar}</aside>}
      <main className="o-shell__main">{children}</main>
    </div>
  </div>
);
AppShell.displayName = "AppShell";
