import * as React from "react";
import { Card, CardProps } from "./card";
import "./spotlight-card.css";

export interface SpotlightCardProps extends CardProps {
  /** Size of the light spotlight radius in pixels (default: 500) */
  spotlightRadius?: number;
  /** Color of the ember glow (default: rgba(255, 90, 31, 0.25)) */
  spotlightColor?: string;
}

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      children,
      className = "",
      spotlightRadius = 500,
      spotlightColor = "rgba(255, 90, 31, 0.25)",
      style,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    // Combine forwarded ref and internal ref safely
    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (internalRef.current) {
        const rect = internalRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        internalRef.current.style.setProperty("--mouse-x", `${x}px`);
        internalRef.current.style.setProperty("--mouse-y", `${y}px`);
      }
      setIsHovered(true);
      if (onMouseMove) onMouseMove(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      if (onMouseLeave) onMouseLeave(e);
    };

    return (
      <Card
        ref={setRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`o-card--spotlight${isHovered ? " is-hovered" : ""}${className ? ` ${className}` : ""}`}
        style={{
          ...style,
          "--spotlight-radius": `${spotlightRadius}px`,
          "--spotlight-color": spotlightColor,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

SpotlightCard.displayName = "SpotlightCard";