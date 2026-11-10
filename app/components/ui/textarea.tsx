import * as React from "react";
import { cn } from "~/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onBlur, onInput, ...props }, ref) => {
    const syncAriaInvalid = (el: HTMLTextAreaElement) => {
      if (typeof CSS !== "undefined" && CSS.supports("selector(:user-invalid)")) {
        if (el.matches(":user-invalid")) {
          el.setAttribute("aria-invalid", "true");
        } else if (el.hasAttribute("aria-invalid")) {
          el.setAttribute("aria-invalid", "false");
        }
      }
    };

    return (
      <textarea
        ref={ref}
        data-slot="textarea"
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
          "auto-grow-textarea flex w-full rounded-[10px] border border-line bg-bg px-3.5 py-2.5 text-[14px] text-cream placeholder:text-cream-dim/60 transition-colors focus-visible:border-rust outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rust disabled:cursor-not-allowed disabled:opacity-45",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
