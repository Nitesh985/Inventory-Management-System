import React from 'react'
import { cn } from "@/utils/cn";


export interface CheckboxGroupProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

const CheckboxGroup = React.forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(
  (
    {
      className,
      children,
      label,
      description,
      error,
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <fieldset
        ref={ref}
        disabled={disabled}
        className={cn("space-y-3", className)}
        {...props}
      >
        {label && (
          <legend
            className={cn(
              "text-sm font-medium",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </legend>
        )}

        {description && !error && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="space-y-2">{children}</div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </fieldset>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };
