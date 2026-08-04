/* Optimistic UI · Accordion · v1.0.0 · updated 2026-07-10 */
import * as React from "react";
import "./accordion.css";
export interface AccordionItem { title: React.ReactNode; content: React.ReactNode; }
export interface AccordionProps { items: AccordionItem[]; defaultOpen?: number | null; }
export const Accordion = ({ items, defaultOpen = null }: AccordionProps) => {
  const [open, setOpen] = React.useState<number | null>(defaultOpen);
  return (
    <div className="o-accordion">
      {items.map((it, i) => (
        <div key={i} className={`o-accordion__item${open === i ? " o-accordion__item--open" : ""}`}>
          <button type="button" className="o-accordion__head" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span>{it.title}</span>
            <svg className="o-accordion__chev" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {open === i && <div className="o-accordion__body">{it.content}</div>}
        </div>
      ))}
    </div>
  );
};
Accordion.displayName = "Accordion";
