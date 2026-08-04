/* Optimistic UI · Illustration · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./illustration.css";
type Name = "empty" | "error" | "success" | "search";
export interface IllustrationProps { name: Name; size?: number; }
const scenes: Record<Name, React.ReactNode> = {
  empty: (<><rect x="14" y="24" width="52" height="36" rx="4" className="o-illo__panel" /><path d="M14 34h52" className="o-illo__line" /><circle cx="21" cy="29" r="1.6" className="o-illo__dot" /><rect x="26" y="42" width="28" height="3" rx="1.5" className="o-illo__soft" /><rect x="26" y="49" width="18" height="3" rx="1.5" className="o-illo__soft" /></>),
  error: (<><circle cx="40" cy="42" r="20" className="o-illo__panel" /><path d="M40 33v11M40 49v.5" className="o-illo__accent" /></>),
  success: (<><circle cx="40" cy="42" r="20" className="o-illo__panel" /><path d="M31 42l6 6 12-13" className="o-illo__accent" /></>),
  search: (<><circle cx="35" cy="37" r="14" className="o-illo__panel" /><path d="M46 48l9 9" className="o-illo__line" /></>),
};
export const Illustration = ({ name, size = 120 }: IllustrationProps) => (
  <svg className="o-illo" width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">{scenes[name]}</svg>
);
Illustration.displayName = "Illustration";
