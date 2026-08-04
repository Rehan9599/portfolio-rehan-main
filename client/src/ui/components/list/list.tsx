/* Optimistic UI · List · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./list.css";
export const List = ({ className = "", ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={`o-list${className ? ` ${className}` : ""}`} {...props} />
);
List.displayName = "List";
export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  leading?: React.ReactNode; trailing?: React.ReactNode;
}
export const ListItem = ({ leading, trailing, className = "", children, ...props }: ListItemProps) => (
  <li className={`o-list__item${className ? ` ${className}` : ""}`} {...props}>
    {leading != null && <span className="o-list__leading">{leading}</span>}
    <span className="o-list__content">{children}</span>
    {trailing != null && <span className="o-list__trailing">{trailing}</span>}
  </li>
);
ListItem.displayName = "ListItem";
