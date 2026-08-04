/* Optimistic UI · FormLayout · v1.0.0 · updated 2026-07-11 */
import * as React from "react";
import "./form-layout.css";
export const FormLayout = ({ className = "", ...props }: React.FormHTMLAttributes<HTMLFormElement>) => (
  <form className={`o-form${className ? ` ${className}` : ""}`} {...props} />
);
FormLayout.displayName = "FormLayout";
export interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> { title?: React.ReactNode; description?: React.ReactNode; }
export const FormSection = ({ title, description, className = "", children, ...props }: FormSectionProps) => (
  <section className={`o-form__section${className ? ` ${className}` : ""}`} {...props}>
    <div className="o-form__aside">
      {title != null && <h3 className="o-form__title">{title}</h3>}
      {description != null && <p className="o-form__desc">{description}</p>}
    </div>
    <div className="o-form__fields">{children}</div>
  </section>
);
export const FormRow = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`o-form__row${className ? ` ${className}` : ""}`} {...props} />
);
export const FormActions = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`o-form__actions${className ? ` ${className}` : ""}`} {...props} />
);
