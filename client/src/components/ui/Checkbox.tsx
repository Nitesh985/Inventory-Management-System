import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/utils/cn";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type"
  > {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  size?: "sm" | "default" | "lg";
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      id,
      checked = false,
      indeterminate = false,
      disabled = false,
      required = false,
      label,
      description,
      error,
      size = "default",
      ...props
    },
    ref
  ) => {
    const checkboxId =
      id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    const sizeClasses: Record<NonNullable<CheckboxProps["size"]>, string> = {
      sm: "h-4 w-4",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <div className={cn("flex items-start space-x-2", className)}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />

          <label
            htmlFor={checkboxId}
            className={cn(
              "shrink-0 rounded-sm border border-primary cursor-pointer transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              sizeClasses[size],
              checked && "bg-primary text-primary-foreground",
              indeterminate && "bg-primary text-primary-foreground",
              error && "border-destructive",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {checked && !indeterminate && (
              <Check className="h-3 w-3 text-current" />
            )}
            {indeterminate && (
              <Minus className="h-3 w-3 text-current" />
            )}
          </label>
        </div>

        {(label || description || error) && (
          <div className="flex-1 space-y-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "text-sm font-medium leading-none cursor-pointer",
                  error ? "text-destructive" : "text-foreground",
                  disabled && "cursor-not-allowed opacity-70"
                )}
              >
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
              </label>
            )}

            {description && !error && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
