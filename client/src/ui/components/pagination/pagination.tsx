/* Optimistic UI · Pagination · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./pagination.css";
export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  total: number;
  onPage?: (p: number) => void;
}
export const Pagination = ({ page, total, onPage, className = "", ...props }: PaginationProps) => {
  const go = (p: number) => { if (p >= 1 && p <= total) onPage?.(p); };
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter((p) => p === 1 || p === total || Math.abs(p - page) <= 1);
  return (
    <nav aria-label="Pagination" className={`o-page${className ? ` ${className}` : ""}`} {...props}>
      <button type="button" className="o-page__btn" disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Previous">‹</button>
      {pages.map((p, i) => (
        <React.Fragment key={p}>
          {i > 0 && p - pages[i - 1] > 1 && <span className="o-page__gap">…</span>}
          <button type="button" className={`o-page__btn${p === page ? " o-page__btn--active" : ""}`} aria-current={p === page ? "page" : undefined} onClick={() => go(p)}>{p}</button>
        </React.Fragment>
      ))}
      <button type="button" className="o-page__btn" disabled={page >= total} onClick={() => go(page + 1)} aria-label="Next">›</button>
    </nav>
  );
};
Pagination.displayName = "Pagination";
