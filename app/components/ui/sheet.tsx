import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

export const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "left" | "right";
  }
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay
      data-slot="dialog-overlay"
      className="fixed inset-0 z-50 bg-[#121010cc]"
    />
    <SheetPrimitive.Content
      ref={ref}
      data-slot="dialog-content"
      className={cn(
        "fixed inset-y-0 z-50 flex w-[84vw] max-w-xs flex-col bg-bg2 p-6 text-cream focus:outline-none",
        side === "right" ? "right-0 border-l border-line" : "left-0 border-r border-line",
        className,
      )}
      {...props}
    >
      <SheetPrimitive.Close
        aria-label="Tutup menu navigasi"
        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-cream-dim hover:bg-bg hover:text-cream outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust cursor-pointer border-0"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

export const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-[16px] font-semibold text-cream", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";
