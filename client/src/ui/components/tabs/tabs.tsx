/* Optimistic UI · Tabs · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./tabs.css";
export interface Tab { id: string; label: React.ReactNode; }
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]; value: string; onValueChange?: (id: string) => void;
}
export const Tabs = ({ tabs, value, onValueChange, className = "", ...props }: TabsProps) => (
  <div role="tablist" className={`o-tabs${className ? ` ${className}` : ""}`} {...props}>
    {tabs.map((t) => (
      <button key={t.id} role="tab" type="button" aria-selected={value === t.id}
        className={`o-tab${value === t.id ? " o-tab--active" : ""}`} onClick={() => onValueChange?.(t.id)}>
        {t.label}
      </button>
    ))}
  </div>
);
Tabs.displayName = "Tabs";
