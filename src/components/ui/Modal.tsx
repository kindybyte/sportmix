"use client";

import { useEffect } from "react";
import { CloseIcon } from "./Icons";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-paper p-6 shadow-lift animate-fade-up sm:max-w-lg sm:rounded-2xl sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          {title && (
            <h3 className="font-display text-xl font-bold leading-tight">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="btn btn-ghost -mr-2 -mt-1 h-9 w-9 rounded-full p-0"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
