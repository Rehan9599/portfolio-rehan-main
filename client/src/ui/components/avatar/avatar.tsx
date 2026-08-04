/* Optimistic UI · Avatar · v1.0.0 · updated 2026-07-10
   Own this file; edit it however you like. Colours come from tokens.css. */
import * as React from "react";
import "./avatar.css";

type Size = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  name?: string;
  size?: Size;
}

function initials(name: string) {
  return name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export const Avatar = ({ src, name = "", size = "md", className = "", ...props }: AvatarProps) => (
  <span className={`o-avatar o-avatar--${size}${className ? ` ${className}` : ""}`} title={name || undefined} {...props}>
    {src ? (
      <img className="o-avatar__img" src={src} alt={name} />
    ) : (
      <span className="o-avatar__initials">{initials(name) || "?"}</span>
    )}
  </span>
);
Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const AvatarGroup = ({ className = "", children, ...props }: AvatarGroupProps) => (
  <span className={`o-avatar-group${className ? ` ${className}` : ""}`} {...props}>{children}</span>
);
AvatarGroup.displayName = "AvatarGroup";
