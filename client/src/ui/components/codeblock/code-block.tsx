"use client";
/* Optimistic UI · CodeBlock · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./code-block.css";
export interface CodeBlockProps { code: string; lang?: string; }
export const CodeBlock = ({ code, lang = "" }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const copy = () => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <div className="o-code">
      <div className="o-code__head">
        <span className="o-code__lang">{lang}</span>
        <button type="button" className="o-code__copy" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre className="o-code__pre"><code>{code}</code></pre>
    </div>
  );
};
CodeBlock.displayName = "CodeBlock";
