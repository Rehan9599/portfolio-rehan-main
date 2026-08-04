/* Optimistic UI · Logo · v1.0.0 · updated 2026-07-11
   The brand mark: a thick-ring pixel O with one warm pixel. Own it; swap the SVG
   for your own mark. Colours come from tokens.css. */
import * as React from "react";
import "./logo.css";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  withWordmark?: boolean;
  wordmark?: React.ReactNode;
}

const N = 9, C = 4, R_IN = 2.5, R_OUT = 4.55, ACCENT_I = 6, ACCENT_J = 2;
const PAD = 4, PITCH = (56 - PAD * 2) / N, DRAW = PITCH * 0.84;
const r2 = (v: number) => Math.round(v * 100) / 100;
type Cell = { x: number; y: number; warm: boolean };
const CELLS: Cell[] = [];
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
  const dist = Math.hypot(i - C, j - C);
  if (dist < R_IN || dist > R_OUT) continue;
  CELLS.push({ x: r2(PAD + (i + 0.5) * PITCH - DRAW / 2), y: r2(PAD + (j + 0.5) * PITCH - DRAW / 2), warm: i === ACCENT_I && j === ACCENT_J });
}
const D = r2(DRAW);

export const Logo = ({ size = 24, withWordmark = true, wordmark = "Optimistic", className = "", ...props }: LogoProps) => (
  <span className={`o-logo${className ? ` ${className}` : ""}`} aria-label="Optimistic" {...props}>
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" role="img" aria-hidden="true">
      {CELLS.map((c, k) => (
        <rect key={k} x={c.x} y={c.y} width={D} height={D} className={c.warm ? "o-logo__px o-logo__px--warm" : "o-logo__px"} />
      ))}
    </svg>
    {withWordmark && <span className="o-logo__word">{wordmark}</span>}
  </span>
);
Logo.displayName = "Logo";
