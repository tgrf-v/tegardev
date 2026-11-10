import * as React from "react";
import { cn } from "~/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", onBlur, onInput, ...props }, ref) => {
    const syncAriaInvalid = (el: HTMLInputElement) => {
      if (typeof CSS !== "undefined" && CSS.supports("selector(:user-invalid)")) {
        if (el.matches(":user-invalid")) {
          el.setAttribute("aria-invalid", "true");
        } else if (el.hasAttribute("aria-invalid")) {
          el.setAttribute("aria-invalid", "false");
        }
      }
    };

    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        onBlur={(e) => {
          syncAriaInvalid(e.currentTarget);
          onBlur?.(e);
        }}
        onInput={(e) => {
          if (e.currentTarget.hasAttribute("aria-invalid")) {
            syncAriaInvalid(e.currentTarget);
          }
          onInput?.(e);
        }}
        className={cn(
          "flex h-11 w-full rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[14px] text-cream placeholder:text-cream-dim/60 transition-colors focus-visible:border-rust outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rust disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
