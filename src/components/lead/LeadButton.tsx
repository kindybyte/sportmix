"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { LeadForm } from "./LeadForm";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LeadButton({
  product,
  className,
  children,
  label = "Отправить заявку",
}: {
  product: Pick<Product, "id" | "title" | "article" | "sizes" | "colors">;
  className?: string;
  children?: React.ReactNode;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("btn", className)}
      >
        {children ?? label}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Заявка на товар"
      >
        <LeadForm product={product} type="product" />
      </Modal>
    </>
  );
}
