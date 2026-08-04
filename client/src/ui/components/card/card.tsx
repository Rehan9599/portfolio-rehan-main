/* Optimistic UI · Card · v1.1.1 · updated 2026-07-11 · default padding 20px
   Own this file; edit it however you like. Colours come from tokens.css.

   A card is a bordered surface that groups related content and actions.
   Compose it from the parts below:

     <Card>                     the surface (add `raised`, `interactive`, `flush`)
       <CardMedia ratio="16/9"> flush media band, holds an <img>, <video>, <audio>, anything
       <CardBody>               padded content region (use with a flush Card + media)
         <CardTitle>            the heading
         <CardDescription>      muted supporting copy
       <CardFooter>            actions row with a hairline above
*/
import * as React from "react";
import "./card.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** raised surface with a soft shadow */
  raised?: boolean;
  /** remove the default inner padding (let media/tables own the edges) */
  flush?: boolean;
  /** lift + ring on hover/focus; makes the whole card feel clickable */
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ raised = false, flush = false, interactive = false, className = "", tabIndex, ...props }, ref) => (
    <div
      ref={ref}
      className={
        "o-card" +
        (raised ? " o-card--raised" : "") +
        (flush ? "" : " o-card--padded") +
        (interactive ? " o-card--interactive" : "") +
        (className ? ` ${className}` : "")
      }
      tabIndex={interactive ? (tabIndex ?? 0) : tabIndex}
      {...props}
    />
  )
);
Card.displayName = "Card";

/** Flush media band. Pass an aspect `ratio` like "16/9"; children are the media. */
export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: string;
}
export const CardMedia = ({ ratio, className = "", style, ...props }: CardMediaProps) => (
  <div
    className={`o-card__media${className ? ` ${className}` : ""}`}
    style={ratio ? { aspectRatio: ratio, ...style } : style}
    {...props}
  />
);

export const CardBody = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`o-card__body${className ? ` ${className}` : ""}`} {...props} />
);

export const CardHeader = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`o-card__header${className ? ` ${className}` : ""}`} {...props} />
);

export const CardTitle = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`o-card__title${className ? ` ${className}` : ""}`} {...props} />
);

export const CardDescription = ({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`o-card__desc${className ? ` ${className}` : ""}`} {...props} />
);

export const CardFooter = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`o-card__footer${className ? ` ${className}` : ""}`} {...props} />
);
