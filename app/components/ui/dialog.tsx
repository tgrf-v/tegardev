import * as React from "react";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

interface DialogContextValue {
  open: boolean;
  setOpen: (next: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error("Komponen Dialog harus berada di dalam <Dialog>.");
  }
  return ctx;
}

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const reactId = React.useId();

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen,
        titleId: `dialog-title-${reactId}`,
        descriptionId: `dialog-desc-${reactId}`,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  asChild,
}: {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  asChild?: boolean;
}) {
  const { setOpen } = useDialogContext();
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        setOpen(true);
      },
    });
  }
  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDialogElement> {
  children: React.ReactNode;
}

/**
 * Dialog berbasis elemen native <dialog> dengan showModal() sesuai modern-web-guidance:
 * - Top-layer native & fokus otomatis kembali ke pemicu tanpa mengunci overflow body
 * - Mendukung light-dismiss (closedby="any") beserta fallback pengecekan koordinat pointer
 */
export function DialogContent({
  className,
  children,
  ...props
}: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useDialogContext();
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);
  const pressedOutsideRef = React.useRef(false);

  React.useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;

    if (open && !node.open) {
      node.showModal();
    } else if (!open && node.open) {
      node.close();
    }
  }, [open]);

  const isOutsideRect = (e: React.PointerEvent<HTMLDialogElement>, dialog: HTMLDialogElement) => {
    const rect = dialog.getBoundingClientRect();
    return (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    );
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-slot="dialog-content"
      {...({ closedby: "any" } as Record<string, string>)}
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.returnValue = "";
        }
        setOpen(false);
      }}
      onPointerDown={(e) => {
        if (dialogRef.current && !("closedBy" in HTMLDialogElement.prototype)) {
          pressedOutsideRef.current = isOutsideRect(e, dialogRef.current);
        }
      }}
      onPointerUp={(e) => {
        if (
          dialogRef.current &&
          !("closedBy" in HTMLDialogElement.prototype) &&
          pressedOutsideRef.current &&
          isOutsideRect(e, dialogRef.current)
        ) {
          dialogRef.current.close();
        }
        pressedOutsideRef.current = false;
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-xl rounded-[20px] bg-bg2 p-0 text-cream backdrop:bg-[#000000cc] border-0 outline-none focus:outline-none open:block shadow-2xl",
        className,
      )}
      {...props}
    >
      <div className="relative max-h-[88dvh] overflow-y-auto p-6 sm:p-7">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Tutup dialog"
          className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-cream-dim transition-colors hover:bg-bg hover:text-cream outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust cursor-pointer border-0"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 pr-8 text-left", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialogContext();
  return (
    <h2
      id={titleId}
      className={cn("text-[20px] font-semibold tracking-tight text-cream", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useDialogContext();
  return (
    <p
      id={descriptionId}
      className={cn("text-[14px] leading-relaxed text-cream-dim", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export function DialogClose({
  children,
  asChild,
}: {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  asChild?: boolean;
}) {
  const { setOpen } = useDialogContext();
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        setOpen(false);
      },
    });
  }
  return (
    <button type="button" onClick={() => setOpen(false)}>
      {children}
    </button>
  );
}
