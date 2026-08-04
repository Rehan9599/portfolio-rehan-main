/* Optimistic UI · Link · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./link.css";

type Variant = "default" | "quiet" | "brand";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  external?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = "default", external = false, className = "", children, ...props }, ref) => (
    <a
      ref={ref}
      className={`o-link o-link--${variant}${className ? ` ${className}` : ""}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {external && (
        <svg className="o-link__ext" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3h7v7M13 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </a>
  )
);
Link.displayName = "Link";
