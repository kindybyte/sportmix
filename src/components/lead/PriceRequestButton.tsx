"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { LeadForm } from "./LeadForm";
import { cn } from "@/lib/utils";

export function PriceRequestButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("btn", className)}
      >
        {children ?? "Получить прайс"}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Получить актуальный прайс">
        <p className="-mt-2 mb-5 text-sm text-muted">
          Оставьте контакт — отправим полный прайс-лист SportMix с актуальными
          ценами и наличием.
        </p>
        <LeadForm type="price" />
      </Modal>
    </>
  );
}
