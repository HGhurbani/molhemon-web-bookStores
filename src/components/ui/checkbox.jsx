import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils.js";

const Checkbox = React.forwardRef(
  ({ className, onChange, onCheckedChange, ...props }, ref) => {
    const handleCheckedChange = React.useCallback(
      (checked) => {
        if (typeof onCheckedChange === "function") {
          onCheckedChange(checked);
        }

        if (typeof onChange === "function") {
          if (typeof checked === "boolean") {
            onChange(checked);
          } else {
            onChange(checked === "indeterminate");
          }
        }
      },
      [onChange, onCheckedChange],
    );

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-5 w-5 shrink-0 rounded border border-input bg-background text-primary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
          className,
        )}
        onCheckedChange={handleCheckedChange}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check className="h-3.5 w-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
