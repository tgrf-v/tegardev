import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[14px] font-medium transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-rust text-white hover:bg-rust-dark border-0",
        outline:
          "border border-line bg-transparent text-cream hover:border-rust/40 hover:bg-bg2",
        onRustOutline:
          "border border-cream bg-transparent text-cream hover:bg-cream/12",
        onRustSolid:
          "bg-bg text-cream border-0 hover:bg-bg2",
        ghost:
          "bg-transparent text-cream-dim hover:bg-bg2 hover:text-cream border-0",
        destructive:
          "bg-rust-dark text-white hover:bg-rust border-0",
      },
      size: {
        default: "px-6 py-2.5",
        sm: "px-4 py-1.5 text-[13px]",
        lg: "px-7 py-3 text-[15px]",
        icon: "h-9 w-9 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
