import { useEffect, useRef } from "react";

export function Dialog({
  children,
  className,
  onClose,
  open,
}: {
  children: React.ReactNode;
  className: string;
  onClose: () => void;
  open: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    let justOpened = false;

    const onDialogClose = () => {
      document.body.toggleAttribute("data-modal-open", false);
      onClose();
    };

    if (dialogRef.current) {
      if (open) {
        dialogRef.current.showModal();
        justOpened = true;
        dialogRef.current.addEventListener("close", onDialogClose);
      } else {
        dialogRef.current.removeEventListener("close", onDialogClose);
        dialogRef.current.close();
      }
    }

    const onClick = (e: MouseEvent) => {
      // dont close on initial open/click
      if (!open || !dialogRef.current || justOpened) {
        justOpened = false;
        return;
      }

      // Bounding box as checking target wont work
      // if the dialog has padding (default browser behavior)
      const rect = dialogRef.current.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    };

    console.log(open);

    if (open) {
      document.body.toggleAttribute("data-modal-open", true);
      document.addEventListener("click", onClick);
    } else {
      document.removeEventListener("click", onClick);
    }

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <dialog
      className={`
        fixed inset-x-4 m-auto h-screen w-full rounded-lg border border-default
        bg-default shadow-lg
        backdrop:bg-[#000] backdrop:opacity-40
        open:flex open:flex-col
        tablet:mx-auto tablet:mt-16 tablet:h-min
        tablet:max-h-[min(100vh-128px,900px)] tablet:min-h-60
        tablet:max-w-[min(100vw-64px,36rem)] tablet:rounded-xl
        ${className ?? className}
      `}
      ref={dialogRef}
    >
      {children}
    </dialog>
  );
}
