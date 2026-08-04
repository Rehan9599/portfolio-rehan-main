/* Optimistic UI · Search · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./search.css";
export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  onClear?: () => void;
}
export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ onClear, className = "", value, ...props }, ref) => (
    <div className={`o-search${className ? ` ${className}` : ""}`}>
      <svg className="o-search__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" /><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      <input ref={ref} type="search" className="o-search__input" value={value} {...props} />
      {onClear && value ? <button type="button" className="o-search__clear" aria-label="Clear" onClick={onClear}>×</button> : null}
    </div>
  )
);
Search.displayName = "Search";
