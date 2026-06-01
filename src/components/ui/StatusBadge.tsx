import { PRODUCT_STATUS_LABEL, type ProductStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: Record<ProductStatus, string> = {
  in_stock: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  on_order: "bg-amber-50 text-amber-700 ring-amber-600/20",
  coming_soon: "bg-sky-50 text-sky-700 ring-sky-600/20",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProductStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        STYLES[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {PRODUCT_STATUS_LABEL[status]}
    </span>
  );
}
