"use client";
/* Optimistic UI · PinInput · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./pin-input.css";
export interface PinInputProps {
  length?: number; value: string; onValueChange?: (v: string) => void; type?: "text" | "password";
}
export const PinInput = ({ length = 4, value, onValueChange, type = "text" }: PinInputProps) => {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const chars = value.slice(0, length).padEnd(length, " ").split("");
  const setAt = (i: number, ch: string) => {
    const clean = ch.replace(/\s/g, "").slice(-1);
    const arr = value.padEnd(length, " ").split("");
    arr[i] = clean || " ";
    onValueChange?.(arr.join("").replace(/\s+$/g, ""));
    if (clean && refs.current[i + 1]) refs.current[i + 1]!.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[i].trim() && refs.current[i - 1]) refs.current[i - 1]!.focus();
  };
  return (
    <div className="o-pin">
      {Array.from({ length }).map((_, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} className="o-pin__cell" inputMode="numeric"
          type={type} maxLength={1} value={chars[i].trim()} aria-label={`Digit ${i + 1}`}
          onChange={(e) => setAt(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} />
      ))}
    </div>
  );
};
PinInput.displayName = "PinInput";
