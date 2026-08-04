/* Optimistic UI · Filter · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./filter.css";
export interface FilterChip { label: React.ReactNode; value: string; }
export interface FilterProps {
  chips: FilterChip[]; onRemove?: (value: string) => void; onClear?: () => void; children?: React.ReactNode;
}
export const Filter = ({ chips, onRemove, onClear, children }: FilterProps) => (
  <div className="o-filter">
    {children}
    {chips.map((c) => (
      <span key={c.value} className="o-filter__chip">
        {c.label}
        {onRemove && <button type="button" className="o-filter__x" aria-label="Remove filter" onClick={() => onRemove(c.value)}>×</button>}
      </span>
    ))}
    {chips.length > 0 && onClear && <button type="button" className="o-filter__clear" onClick={onClear}>Clear all</button>}
  </div>
);
Filter.displayName = "Filter";
