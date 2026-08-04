import * as React from "react";
import type { LucideIcon } from "lucide-react";

type Weight = "light" | "regular" | "bold";
const STROKE: Record<Weight, number> = { light: 1.5, regular: 2, bold: 2.5 };
const SIZE = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, "2xl": 40 } as const;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  /** any icon from lucide-react, e.g. import { Search } and pass icon={Search} */
  icon: LucideIcon;
  size?: keyof typeof SIZE | number;
  weight?: Weight;
}

/** Optimistic Icon — a thin wrapper over Lucide (currentColor, one colour, round caps).
 *  Requires: npm i lucide-react  ·  own this file; edit it however you like. */
export function Icon({ icon: Glyph, size = "md", weight = "regular", ...props }: IconProps) {
  const px = typeof size === "number" ? size : SIZE[size];
  return <Glyph size={px} strokeWidth={STROKE[weight]} absoluteStrokeWidth {...props} />;
}
