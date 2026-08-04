/* Optimistic UI · Breadcrumbs · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./breadcrumbs.css";
export interface Crumb { label: React.ReactNode; href?: string; }
export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: Crumb[];
}
export const Breadcrumbs = ({ items, className = "", ...props }: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumb" className={`o-crumbs${className ? ` ${className}` : ""}`} {...props}>
    <ol className="o-crumbs__list">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <li key={i} className="o-crumbs__item">
            {c.href && !last ? <a className="o-crumbs__link" href={c.href}>{c.label}</a> : <span aria-current={last ? "page" : undefined} className="o-crumbs__current">{c.label}</span>}
            {!last && <span className="o-crumbs__sep" aria-hidden="true">/</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);
Breadcrumbs.displayName = "Breadcrumbs";
