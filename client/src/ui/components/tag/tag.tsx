/* Optimistic UI · Tag · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./tag.css";
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void;
}
export const Tag = ({ onRemove, className = "", children, ...props }: TagProps) => (
  <span className={`o-tag${className ? ` ${className}` : ""}`} {...props}>
    <span className="o-tag__text">{children}</span>
    {onRemove && (
      <button type="button" className="o-tag__remove" aria-label="Remove" onClick={onRemove}>
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      </button>
    )}
  </span>
);
Tag.displayName = "Tag";
